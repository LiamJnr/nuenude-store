import { useState, useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useCart } from '../store/cart'
import { startCheckout, getCheckoutConfig } from '../lib/checkout'
import ShippingForm from '../components/ShippingForm'
import CheckoutReviewModal from '../components/CheckoutReviewModal'

const EMPTY_ADDRESS = { name: '', line1: '', line2: '', city: '', state: '', zip: '', country: '' }
const SHIPPING = 0
const FREE_SHIPPING_MINIMUM = 0
const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

export default function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCart((s) => s.items)
  const [email, setEmail] = useState('')
  const [shipping, setShipping] = useState(EMPTY_ADDRESS)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [config, setConfig] = useState({ currency: 'GHS', exchangeRate: 16.5 })

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shippingCost = 0
  const total = subtotal + shippingCost

  useEffect(() => {
    getCheckoutConfig().then((cfg) => {
      if (cfg) setConfig(cfg)
    })
  }, [])

  if (items.length === 0) return <Navigate to="/cart" replace />

  function validateBeforeReview(e) {
    e.preventDefault()
    setError(null)

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid email address.')
      return
    }

    const requiredFields = ['name', 'line1', 'city', 'state', 'zip', 'country']
    for (const f of requiredFields) {
      if (!shipping[f] || !shipping[f].trim()) {
        setError('Please complete all required delivery address fields.')
        return
      }
    }

    // Open the branded review & currency transparency modal
    setIsReviewOpen(true)
  }

  async function handleConfirmPayment() {
    setError(null)
    setLoading(true)
    try {
      await startCheckout({
        items,
        shippingAddress: shipping,
        email,
        onSuccess: ({ reference }) => {
          setIsReviewOpen(false)
          navigate(`/order-confirmed?order=${encodeURIComponent(reference)}`)
        },
        onCancel: () => {
          setLoading(false)
        },
      })
    } catch (checkoutError) {
      setError(checkoutError.message || 'Payment could not be started. Please try again.')
      setLoading(false)
    }
  }

  return (
    <section className="checkout-page">
      <div className="checkout-heading">
        <Link to="/cart">← Back to bag</Link>
        <p className="eyebrow">Secure checkout</p>
        <h1>Almost yours.</h1>
        <p>Enter your delivery details, then review your order and complete payment securely.</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={validateBeforeReview}>
          <ShippingForm
            email={email}
            onEmailChange={setEmail}
            shipping={shipping}
            onShippingChange={setShipping}
          />
          <button className="checkout-submit" type="submit" disabled={loading}>
            {loading ? 'Opening secure payment…' : (
              <>
                Continue to payment <span>{money(total)}</span>
              </>
            )}
          </button>
          {error && <p className="checkout-error" role="alert">{error}</p>}
        </form>

        <aside className="checkout-summary">
          <p className="eyebrow">Order summary</p>
          {items.map((item) => (
            <article key={`${item.id}-${item.size}`}>
              <img src={item.image} alt="" />
              <div>
                <h2>{item.name}</h2>
                <p>Size {item.size} · Qty {item.qty}</p>
              </div>
              <strong>{money(item.price * item.qty)}</strong>
            </article>
          ))}
          <div className="summary-totals">
            <p><span>Subtotal</span><strong>{money(subtotal)}</strong></p>
            <p><span>Shipping</span><strong>Complimentary (Expansion Gift)</strong></p>
            <p className="summary-grand-total"><span>Total (USD)</span><strong>{money(total)}</strong></p>
          </div>
        </aside>
      </div>

      <CheckoutReviewModal
        isOpen={isReviewOpen}
        onClose={() => !loading && setIsReviewOpen(false)}
        onConfirm={handleConfirmPayment}
        loading={loading}
        usdTotal={total}
        subtotal={subtotal}
        shippingCost={shippingCost}
        shippingAddress={shipping}
        email={email}
        exchangeRate={config.exchangeRate}
        currency={config.currency}
      />
    </section>
  )
}
