import { Link } from 'react-router'
import { useCart } from '../store/cart'

export default function Header({ onOpenCart }) {
  const itemCount = useCart((s) => s.items.reduce((sum, item) => sum + item.qty, 0))

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="brand" to="/">Nue <span className="brand-amp">&amp;</span> Nude</Link>
        <div className="nav-links"><Link to="/shop">New Arrivals</Link><Link to="/shop">Shop All</Link><Link to="/shop">Best Sellers</Link></div>
        <button className="nav-icon-button" type="button" onClick={onOpenCart} aria-label={`Shopping bag, ${itemCount} items`}>Bag{itemCount > 0 && <span className="nav-badge">{itemCount}</span>}</button>
      </nav>
    </header>
  )
}
