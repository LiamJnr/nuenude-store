// Calls our own Pages Function, which talks to Lemon Squeezy server-side
// (keeps the API key out of the browser) and returns a checkout URL to redirect to.

export async function startCheckout({ items, shippingAddress, email }) {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, shippingAddress, email }),
  })

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: 'Checkout failed' }))
    throw new Error(error || 'Checkout failed')
  }

  const { url } = await res.json()
  window.location.href = url
}
