import { CATALOG } from '../../src/data/catalog.js'

const SHIPPING_CENTS = 0 // Complimentary worldwide shipping
const FREE_SHIPPING_CENTS = 0
const MAX_LINE_ITEMS = 25
const MAX_QUANTITY_PER_LINE = 20
const catalogById = new Map(CATALOG.map((product) => [product.id, product]))

export async function onRequestGet({ env }) {
  const currency = (env?.PAYSTACK_CURRENCY || 'GHS').trim().toUpperCase()
  const exchangeRate = Number(env?.USD_TO_GHS_RATE || 11.14)
  return json({
    currency,
    exchangeRate,
    publicKey: env?.PAYSTACK_PUBLIC_KEY || '',
  })
}

export async function onRequestPost({ request, env }) {
  try {
    const missing = ['DB', 'PAYSTACK_SECRET_KEY'].filter((key) => !env[key])
    if (missing.length) {
      console.error(`Checkout configuration error: missing ${missing.join(', ')}`)
      return json({ error: `Checkout is not configured: ${missing.join(', ')}` }, 500)
    }

    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Invalid checkout request.' }, 400)
    }

    let items
    let shippingAddress
    let email
    try {
      items = validateItems(body.items)
      shippingAddress = validateShipping(body.shippingAddress)
      email = validateEmail(body.email)
    } catch (error) {
      return json({ error: error.message }, 400)
    }

    const subtotalCents = items.reduce((sum, item) => sum + item.unit_price_cents * item.qty, 0)
    const shippingCents = subtotalCents >= FREE_SHIPPING_CENTS ? 0 : SHIPPING_CENTS
    const totalCents = subtotalCents + shippingCents
    const orderId = crypto.randomUUID()
    const siteUrl = new URL(request.url).origin
    const redirectUrl = `${siteUrl}/order-confirmed?order=${encodeURIComponent(orderId)}`
    const currency = (env.PAYSTACK_CURRENCY || 'GHS').trim().toUpperCase()
    const exchangeRate = Number(env.USD_TO_GHS_RATE || 11.14)

    // If billing in GHS, convert USD cents to GHS pesewas
    const isGHS = currency === 'GHS'
    const paystackAmount = isGHS ? Math.round(totalCents * exchangeRate) : totalCents

    try {
      await env.DB.prepare(
        `INSERT INTO orders (id, status, email, cart_json, shipping_json, total_cents)
         VALUES (?, 'pending', ?, ?, ?, ?)`
      ).bind(orderId, email, JSON.stringify(items), JSON.stringify(shippingAddress), totalCents).run()
    } catch (dbError) {
      console.error('D1 Database error inserting pending order:', dbError)
      return json({ error: `Database error: ${dbError.message || 'Could not record pending order.'}. Have you executed schema.sql on your local D1?` }, 500)
    }

    const payload = {
      email,
      amount: paystackAmount,
      currency,
      reference: orderId,
      callback_url: redirectUrl,
      metadata: {
        order_id: orderId,
        usd_total_cents: totalCents,
        charged_amount: paystackAmount,
        currency,
        exchange_rate: exchangeRate,
        customer_name: shippingAddress.name,
        shipping_address: shippingAddress,
        cart_items: items.map((item) => ({
          id: item.id,
          name: item.name,
          size: item.size,
          qty: item.qty,
          unit_price_cents: item.unit_price_cents,
        })),
        custom_fields: [
          {
            display_name: 'Order Reference',
            variable_name: 'order_reference',
            value: orderId,
          },
          {
            display_name: 'USD Equivalent',
            variable_name: 'usd_equivalent',
            value: `$${(totalCents / 100).toFixed(2)} USD`,
          },
          {
            display_name: 'Delivery To',
            variable_name: 'delivery_to',
            value: `${shippingAddress.name}, ${shippingAddress.city}, ${shippingAddress.country}`,
          },
        ],
      },
    }

    const checkoutResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const checkoutData = await checkoutResponse.json().catch(() => null)
    const url = checkoutData?.data?.authorization_url
    const accessCode = checkoutData?.data?.access_code

    if (!checkoutResponse.ok || !checkoutData?.status || !url) {
      console.error('Paystack initialization error response:', checkoutData)
      await env.DB.prepare(`UPDATE orders SET status = 'checkout_failed' WHERE id = ? AND status = 'pending'`).bind(orderId).run().catch(() => null)
      return json({ error: checkoutData?.message || 'Payment checkout could not be prepared with Paystack. Please check your keys or currency.' }, 502)
    }

    return json({
      url,
      access_code: accessCode,
      reference: orderId,
      currency,
      exchangeRate,
      paystackAmount,
      usdTotalCents: totalCents,
    })
  } catch (err) {
    console.error('Unhandled checkout error:', err)
    return json({ error: err.message || 'Checkout failed unexpectedly.' }, 500)
  }
}

function validateItems(items) {
  if (!Array.isArray(items) || items.length === 0) throw new Error('Your bag is empty.')
  if (items.length > MAX_LINE_ITEMS) throw new Error('Your bag has too many different items.')
  return items.map((item) => {
    const product = catalogById.get(String(item?.id || ''))
    const qty = Number(item?.qty)
    const size = String(item?.size || '').trim()
    if (!product) throw new Error('One of the items in your bag is no longer available.')
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QUANTITY_PER_LINE) throw new Error('Please choose a valid quantity for every item.')
    if (!product.sizes.includes(size)) throw new Error(`Please choose a valid size for ${product.name}.`)
    return { id: product.id, name: product.name, size, qty, unit_price_cents: Math.round(product.price * 100) }
  })
}

function validateShipping(address) {
  const required = ['name', 'line1', 'city', 'state', 'zip', 'country']
  const clean = (value, max = 120) => String(value || '').trim().slice(0, max)
  const result = { name: clean(address?.name, 100), line1: clean(address?.line1, 160), line2: clean(address?.line2, 160), city: clean(address?.city, 100), state: clean(address?.state, 100), zip: clean(address?.zip, 30), country: clean(address?.country, 100) }
  if (required.some((field) => !result[field])) throw new Error('Please complete your delivery address.')
  return result
}

function validateEmail(value) {
  const email = String(value || '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error('Please enter a valid email address.')
  return email
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
}
