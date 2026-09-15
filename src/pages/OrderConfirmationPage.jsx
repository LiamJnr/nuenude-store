import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useCart } from '../store/cart'

export default function OrderConfirmationPage() {
  const clear = useCart((s) => s.clear)
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('order')

  useEffect(() => { clear() }, [clear])

  return (
    <section className="order-confirmation">
      <p className="eyebrow">Order received</p><h1>Thank you for choosing something <em>beautiful.</em></h1>
      <p>Your payment was successful. Your order is now being prepared with care and will be on its way soon.</p>
      {reference && <p className="order-reference">Order reference <strong>{reference.slice(0, 8).toUpperCase()}</strong></p>}
      <Link to="/">Continue shopping</Link>
    </section>
  )
}
