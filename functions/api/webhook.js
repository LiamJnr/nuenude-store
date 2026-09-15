// POST /api/webhook
// Paystack webhook endpoint: listens for payment events (charge.success, refund.processed)
// and marks orders as paid in Cloudflare D1.

export async function onRequestPost(context) {
  const { request, env } = context

  const signature = request.headers.get('x-paystack-signature') || request.headers.get('X-Paystack-Signature') || ''
  const rawBody = await request.text()

  const valid = await verifySignature(rawBody, signature, env.PAYSTACK_SECRET_KEY)
  if (!valid) {
    console.warn('Paystack webhook received with invalid signature.')
    return new Response('Invalid signature', { status: 401 })
  }

  let event
  try {
    event = JSON.parse(rawBody)
  } catch {
    return new Response('Invalid JSON payload', { status: 400 })
  }

  const eventName = event.event
  const data = event.data || {}
  const orderRef = data.reference || data.metadata?.order_id

  if (eventName === 'charge.success' && orderRef && data.status === 'success') {
    const paystackRef = data.reference || orderRef

    const update = await env.DB.prepare(
      `UPDATE orders 
       SET status = 'paid', paystack_reference = ?, paid_at = datetime('now') 
       WHERE id = ? AND status = 'pending'`
    )
      .bind(paystackRef, orderRef)
      .run()
      .catch((err) => {
        console.error('D1 error updating order status to paid:', err)
        return null
      })

    const order = update?.meta?.changes === 1
      ? await env.DB.prepare(`SELECT * FROM orders WHERE id = ?`).bind(orderRef).first().catch(() => null)
      : null

    if (order && hasEmailConfiguration(env)) {
      await sendFulfillmentEmail(env, order).catch((err) => {
        // Log but don't fail the webhook; D1 is already marked as paid
        console.error('Fulfillment email failed to send:', err)
      })
    } else if (order) {
      console.log('Order marked as paid. Fulfillment email skipped (Resend not configured yet).')
    }
  }

  if (eventName === 'refund.processed' && orderRef) {
    await env.DB.prepare(
      `UPDATE orders SET status = 'refunded' WHERE id = ?`
    )
      .bind(orderRef)
      .run()
      .catch((err) => console.error('D1 error marking order refunded:', err))
  }

  // Always acknowledge Paystack with 200 OK so it doesn't repeatedly retry
  return new Response('OK', { status: 200 })
}

async function verifySignature(rawBody, signatureHex, secret) {
  if (!signatureHex || !secret) return false
  try {
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign']
    )
    const mac = await crypto.subtle.sign('HMAC', key, enc.encode(rawBody))
    const macHex = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('')

    if (macHex.length !== signatureHex.length) return false
    let mismatch = 0
    for (let i = 0; i < macHex.length; i++) {
      mismatch |= macHex.charCodeAt(i) ^ signatureHex.charCodeAt(i)
    }
    return mismatch === 0
  } catch (err) {
    console.error('Error verifying Paystack signature:', err)
    return false
  }
}

async function sendFulfillmentEmail(env, order) {
  const cart = JSON.parse(order.cart_json)
  const shipping = JSON.parse(order.shipping_json)

  const itemLines = cart.map((i) => `- ${i.name} (${i.size}) x${i.qty}`).join('\n')

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.ORDERS_FROM_EMAIL,
      to: env.FULFILLMENT_EMAIL,
      subject: `New Nue & Nude Order #${order.id.slice(0, 8).toUpperCase()}`,
      text: `New paid order received!\n\nOrder ID: ${order.id}\nCustomer Email: ${order.email}\n\nItems:\n${itemLines}\n\nShip to:\n${formatAddress(shipping)}\n\nReference: ${order.paystack_reference || 'N/A'}`,
    }),
  })
  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Resend rejected fulfillment email (${response.status}): ${body}`)
  }
}

function hasEmailConfiguration(env) {
  return Boolean(env.RESEND_API_KEY && env.ORDERS_FROM_EMAIL && env.FULFILLMENT_EMAIL)
}

function formatAddress(a) {
  return [a.name, a.line1, a.line2, `${a.city}, ${a.state} ${a.zip}`, a.country]
    .filter(Boolean)
    .join('\n')
}
