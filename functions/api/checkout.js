import { CATALOG } from '../../src/data/catalog.js'

const SHIPPING_CENTS = 800
const FREE_SHIPPING_CENTS = 10000
const MAX_LINE_ITEMS = 25
const MAX_QUANTITY_PER_LINE = 20
const catalogById = new Map(CATALOG.map((product) => [product.id, product]))

export async function onRequestPost({ request, env }) {
  const missing = ['DB', 'LEMONSQUEEZY_API_KEY', 'LEMONSQUEEZY_STORE_ID', 'LEMONSQUEEZY_VARIANT_ID'].filter((key) => !env[key])
  if (missing.length) return json({ error: `Checkout is not configured: ${missing.join(', ')}` }, 500)

  let body
  try { body = await request.json() } catch { return json({ error: 'Invalid checkout request.' }, 400) }

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
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0)
  const siteUrl = new URL(request.url).origin
  const redirectUrl = `${siteUrl}/order-confirmed?order=${encodeURIComponent(orderId)}`

  await env.DB.prepare(
    `INSERT INTO orders (id, status, email, cart_json, shipping_json, total_cents)
     VALUES (?, 'pending', ?, ?, ?, ?)`
  ).bind(orderId, email, JSON.stringify(items), JSON.stringify(shippingAddress), totalCents).run()

  const variantId = Number(env.LEMONSQUEEZY_VARIANT_ID)
  const testMode = String(env.LEMONSQUEEZY_TEST_MODE || '').trim().toLowerCase() === 'true'
  const payload = {
    data: {
      type: 'checkouts',
      attributes: {
        custom_price: totalCents,
        test_mode: testMode,
        product_options: {
          name: `Nue & Nude order — ${itemCount} item${itemCount === 1 ? '' : 's'}`,
          description: items.map((item) => `${item.name} (${item.size}) × ${item.qty}`).join(', ').slice(0, 1000),
          enabled_variants: [variantId],
          redirect_url: redirectUrl,
          receipt_button_text: 'Return to Nue & Nude',
          receipt_link_url: siteUrl,
        },
        checkout_data: { email, name: shippingAddress.name, custom: { order_ref: orderId } },
      },
      relationships: {
        store: { data: { type: 'stores', id: String(env.LEMONSQUEEZY_STORE_ID) } },
        variant: { data: { type: 'variants', id: String(env.LEMONSQUEEZY_VARIANT_ID) } },
      },
    },
  }

  const checkoutResponse = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.LEMONSQUEEZY_API_KEY}`, Accept: 'application/vnd.api+json', 'Content-Type': 'application/vnd.api+json' },
    body: JSON.stringify(payload),
  })

  const checkoutData = await checkoutResponse.json().catch(() => null)
  const url = checkoutData?.data?.attributes?.url
  if (!checkoutResponse.ok || !url) {
    await env.DB.prepare(`UPDATE orders SET status = 'checkout_failed' WHERE id = ? AND status = 'pending'`).bind(orderId).run()
    return json({ error: checkoutData?.errors?.[0]?.detail || 'Payment checkout could not be prepared. Please try again.' }, 502)
  }

  return json({ url })
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
