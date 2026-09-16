import { useEffect } from 'react'
import { Link } from 'react-router'
import { useCart } from '../store/cart'

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export default function CartDrawer({ open, onClose }) {
  const items = useCart((s) => s.items)
  const total = useCart((s) => s.total)
  const removeItem = useCart((s) => s.removeItem)
  const updateQty = useCart((s) => s.updateQty)

  useEffect(() => {
    if (!open) return undefined
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open, onClose])

  return (
    <div className={`cart-drawer-shell ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <button className="cart-scrim" type="button" aria-label="Close bag" onClick={onClose} tabIndex={open ? 0 : -1} />
      <aside className="cart-drawer" aria-label="Shopping bag">
        <header className="cart-drawer-head"><div><p className="eyebrow">Your selection</p><h2>Your Bag</h2></div><button type="button" onClick={onClose} aria-label="Close bag">×</button></header>
        {items.length === 0 ? (
          <div className="empty-bag"><p>Your bag is waiting for something beautiful.</p><button type="button" onClick={onClose}>Continue Shopping</button></div>
        ) : (
          <>
            <div className="drawer-items">
              {items.map((item) => (
                <article className="drawer-item" key={`${item.id}-${item.size}-${item.color || 'Default'}`}>
                  {item.image && <img src={item.image} alt="" />}
                  <div className="drawer-item-copy">
                    <h3>{item.name}</h3>
                    <p>Size {item.size}{item.color && item.color !== 'Default' ? ` · ${item.color}` : ''}</p>
                    <button type="button" onClick={() => removeItem(item.id, item.size, item.color)}>Remove</button>
                  </div>
                  <div className="drawer-item-controls">
                    <strong>{money(item.price * item.qty)}</strong>
                    <div className="quantity-control">
                      <button type="button" onClick={() => updateQty(item.id, item.size, item.color, item.qty - 1)} aria-label={`Decrease ${item.name} quantity`}>−</button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.id, item.size, item.color, item.qty + 1)} aria-label={`Increase ${item.name} quantity`}>+</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <footer className="cart-drawer-footer"><p><span>Subtotal</span><strong>{money(total())}</strong></p><small>Shipping and taxes are calculated at checkout.</small><Link to="/checkout" onClick={onClose}>Proceed to Checkout</Link><Link className="view-bag" to="/cart" onClick={onClose}>View bag</Link></footer>
          </>
        )}
      </aside>
    </div>
  )
}
