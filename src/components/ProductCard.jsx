import { Link } from 'react-router'

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
}

export default function ProductCard({ product, onQuickAdd }) {
  return (
    <article className="product-card">
      <Link className="product-image-link" to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge && <span className={`product-badge product-badge-${product.badge.toLowerCase()}`}>{product.badge}</span>}
      </Link>
      <div className="product-card-info">
        <Link className="product-name" to={`/product/${product.id}`}>{product.name}</Link>
        <p className="product-price"><span>{formatPrice(product.price)}</span>{product.compareAt && <del>{formatPrice(product.compareAt)}</del>}</p>
        <button type="button" className="quick-add" onClick={() => onQuickAdd(product)}>Add to Bag</button>
      </div>
    </article>
  )
}
