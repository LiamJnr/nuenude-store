import { useState } from 'react'
import { Link, Navigate } from 'react-router'
import { useCart } from '../store/cart'
import { startCheckout } from '../lib/checkout'
import ShippingForm from '../components/ShippingForm'

const EMPTY_ADDRESS = { name: '', line1: '', line2: '', city: '', state: '', zip: '', country: '' }
const SHIPPING = 8
const FREE_SHIPPING_MINIMUM = 100
const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

export default function CheckoutPage() {
  const items = useCart((s) => s.items)
  const [email, setEmail] = useState('')
  const [shipping, setShipping] = useState(EMPTY_ADDRESS)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shippingCost = subtotal >= FREE_SHIPPING_MINIMUM ? 0 : SHIPPING

  if (items.length === 0) return <Navigate to="/cart" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await startCheckout({ items, shippingAddress: shipping, email })
    } catch (checkoutError) {
      setError(checkoutError.message || 'Checkout could not be prepared. Please try again.')
      setLoading(false)
    }
  }

  return (
    <section className="checkout-page">
      <div className="checkout-heading"><Link to="/cart">← Back to bag</Link><p className="eyebrow">Secure checkout</p><h1>Almost yours.</h1><p>Enter your delivery details, then complete payment securely with Lemon Squeezy.</p></div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}><ShippingForm email={email} onEmailChange={setEmail} shipping={shipping} onShippingChange={setShipping} /><button className="checkout-submit" type="submit" disabled={loading}>{loading ? 'Opening secure payment…' : <>Continue to secure payment <span>{money(subtotal + shippingCost)}</span></>}</button>{error && <p className="checkout-error" role="alert">{error}</p>}</form>
        <aside className="checkout-summary"><p className="eyebrow">Order summary</p>{items.map((item) => <article key={`${item.id}-${item.size}`}><img src={item.image} alt="" /><div><h2>{item.name}</h2><p>Size {item.size} · Qty {item.qty}</p></div><strong>{money(item.price * item.qty)}</strong></article>)}<div className="summary-totals"><p><span>Subtotal</span><strong>{money(subtotal)}</strong></p><p><span>Shipping</span><strong>{shippingCost ? money(shippingCost) : 'Complimentary'}</strong></p><p className="summary-grand-total"><span>Total</span><strong>{money(subtotal + shippingCost)}</strong></p></div></aside>
      </div>
    </section>
  )
}
