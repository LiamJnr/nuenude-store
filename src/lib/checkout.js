// Calls our own Pages Function, which talks to Paystack server-side
// (keeps the secret key out of the browser) and opens Paystack Popup or redirects.

export async function getCheckoutConfig() {
  try {
    const res = await fetch('/api/checkout')
    if (res.ok) {
      return await res.json()
    }
  } catch (err) {
    console.warn('Could not fetch checkout config:', err)
  }
  return { currency: 'GHS', exchangeRate: 11.14 }
}

export async function startCheckout({ items, shippingAddress, email, onSuccess, onCancel }) {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, shippingAddress, email }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok || !data) {
    throw new Error(data?.error || `Checkout failed (Status ${res.status})`)
  }

  const { url, access_code, reference } = data

  // If Paystack Inline script is available on the window, open the secure popup overlay
  if (access_code && typeof window !== 'undefined' && typeof window.PaystackPop !== 'undefined') {
    try {
      const popup = new window.PaystackPop()
      popup.resumeTransaction(access_code, {
        onSuccess: (transaction) => {
          const finalRef = transaction?.reference || reference
          if (typeof onSuccess === 'function') {
            onSuccess({ reference: finalRef })
          } else {
            window.location.href = `/order-confirmed?order=${encodeURIComponent(finalRef)}`
          }
        },
        onCancel: () => {
          if (typeof onCancel === 'function') {
            onCancel()
          }
        },
      })
      return { mode: 'popup', reference }
    } catch (popupErr) {
      console.warn('Paystack popup encountered an issue, redirecting instead:', popupErr)
    }
  }

  // Fallback: direct redirect to authorization URL
  if (url) {
    window.location.href = url
    return { mode: 'redirect', url }
  }

  throw new Error('No checkout URL or access code was provided by Paystack.')
}
