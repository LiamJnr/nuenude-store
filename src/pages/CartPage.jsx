import { Link, useNavigate } from 'react-router'
import { useCart } from '../store/cart'
import CartItem from '../components/CartItem'

export default function CartPage() {
  const items = useCart((s) => s.items)
  const total = useCart((s) => s.total)
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div>
        <h1>Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/">Continue shopping</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>Cart</h1>
      {items.map((item) => (
        <CartItem key={`${item.id}-${item.size}-${item.color || 'Default'}`} item={item} />
      ))}
      <p>
        <strong>Total: ${total().toFixed(2)}</strong>
      </p>
      <button onClick={() => navigate('/checkout')}>Checkout</button>
    </div>
  )
}
