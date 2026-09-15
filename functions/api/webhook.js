// POST /api/webhook
// Point this at your Lemon Squeezy webhook settings, subscribed to order_created
// (and order_refunded if you want to track refunds too).

export async function onRequestPost(context) {
  const { request, env } = context

  const rawBody = await request.text()
  const signature = request.headers.get('X-Signature') || ''

  const valid = await verifySignature(rawBody, signature, env.LEMONSQUEEZY_WEBHOOK_SECRET)
  if (!valid) {
    return new Response('Invalid signature', { status: 401 })
  }

  let event
  try {
    event = JSON.parse(rawBody)
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }
  const eventName = event.meta?.event_name
  const orderRef = event.meta?.custom_data?.order_ref
  const lsOrderId = event.data?.id

  if (eventName === 'order_created' && orderRef) {
    const update = await env.DB.prepare(
      `UPDATE orders SET status = 'paid', ls_order_id = ?, paid_at = datetime('now') WHERE id = ? AND status = 'pending'`
    )
      .bind(lsOrderId, orderRef)
      .run()

    const order = update.meta.changes === 1
      ? await env.DB.prepare(`SELECT * FROM orders WHERE id = ?`).bind(orderRef).first()
      : null

    if (order && hasEmailConfiguration(env)) {
      await sendFulfillmentEmail(env, order).catch((err) => {
        // Don't fail the webhook over an email hiccup — the order is already
        // recorded in D1, which is the source of truth.
        console.error('Fulfillment email failed', err)
      })
    } else if (order) {
      console.warn('Fulfillment email skipped: Resend is not configured')
    }
  }

  if (eventName === 'order_refunded' && orderRef) {
    await env.DB.prepare(`UPDATE orders SET status = 'refunded' WHERE id = ?`)
      .bind(orderRef)
      .run()
  }

  // Always return 200 once the event is handled, or Lemon Squeezy will retry it.
  return new Response('OK', { status: 200 })
}

async function verifySignature(rawBody, signatureHex, secret) {
  if (!signatureHex || !secret) return false
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const mac = await crypto.subtle.sign('HMAC', key, enc.encode(rawBody))
  const macHex = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('')

  // Constant-time-ish comparison
  if (macHex.length !== signatureHex.length) return false
  let mismatch = 0
  for (let i = 0; i < macHex.length; i++) {
    mismatch |= macHex.charCodeAt(i) ^ signatureHex.charCodeAt(i)
  }
  return mismatch === 0
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
      subject: `New order ${order.id.slice(0, 8)}`,
      text: `New paid order\n\nItems:\n${itemLines}\n\nShip to:\n${formatAddress(shipping)}\n\nCustomer email: ${order.email}`,
    }),
  })
  if (!response.ok) throw new Error(`Resend rejected fulfillment email (${response.status})`)
}

function hasEmailConfiguration(env) {
  return Boolean(env.RESEND_API_KEY && env.ORDERS_FROM_EMAIL && env.FULFILLMENT_EMAIL)
}

function formatAddress(a) {
  return [a.name, a.line1, a.line2, `${a.city}, ${a.state} ${a.zip}`, a.country]
    .filter(Boolean)
    .join('\n')
}
