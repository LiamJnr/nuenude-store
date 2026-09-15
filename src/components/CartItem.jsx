import { useCart } from '../store/cart'

export default function CartItem({ item }) {
  const removeItem = useCart((s) => s.removeItem)
  const updateQty = useCart((s) => s.updateQty)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <span style={{ flex: 1 }}>
        {item.name} ({item.size})
      </span>
      <input
        type="number"
        min="1"
        value={item.qty}
        onChange={(e) => updateQty(item.id, item.size, Number(e.target.value))}
        style={{ width: 48 }}
      />
      <span>${(item.price * item.qty).toFixed(2)}</span>
      <button onClick={() => removeItem(item.id, item.size)}>Remove</button>
    </div>
  )
}
