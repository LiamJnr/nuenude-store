import { Link } from 'react-router'
import { PRODUCTS } from '../data/products'
import ProductCard from '../components/ProductCard'
import { useCart } from '../store/cart'

export default function HomePage() {
  const addItem = useCart((s) => s.addItem)
  const featuredProducts = PRODUCTS.slice(0, 3)

  const bestSellers = PRODUCTS.slice(0, 6)

  function addDefaultSize(product) {
    addItem({ ...product, size: product.sizes[0] })
  }

  return (
    <div className="home-page">
      <section className="home-hero">
        <img src="/imgs/hero.jpg" alt="Nue and Nude editorial lingerie campaign" />
        <div className="hero-copy">
          <p>For the woman you are becoming</p>
          <h1>Explore Your <em>Femininity</em></h1>
          <Link to="/shop" className="hero-button">Shop Now</Link>
        </div>
      </section>

      <section className="trending-section" aria-labelledby="trending-title">
        <div className="section-heading"><p className="eyebrow">In rotation</p><h2 id="trending-title">The pieces everyone wants.</h2></div>
        <div className="trend-grid">
          {featuredProducts.map((product) => (
            <Link className="trend-card" key={product.id} to={`/product/${product.id}`}>
              <img src={product.image} alt="" loading="lazy" />
              <span>{product.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <aside className="promotion"><p><strong>Complimentary shipping</strong><span>Included on all orders to celebrate our expansion</span></p><Link to="/shop">Discover the edit <span>→</span></Link></aside>

      <section className="collection-intro" id="new-and-loved">
        <div><p className="eyebrow">Curated edit</p><h2>A curated selection of our most loved silhouettes.</h2></div>
        <Link className="text-link" to="/shop">View all {PRODUCTS.length} pieces <span>→</span></Link>
      </section>

      <section className="product-section" aria-labelledby="new-loved-title">
        <div className="product-section-heading">
          <h2 id="new-loved-title">Best Sellers</h2>
          <Link to="/shop" className="text-link">View full collection ({PRODUCTS.length}) <span>→</span></Link>
        </div>
        <div className="product-grid">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} onQuickAdd={addDefaultSize} />
          ))}
        </div>
      </section>

      <section className="category-notes" aria-label="Shop by collection">
        <Link to="/"><span>Sets</span><strong>Soft lace, garters, and matching moments.</strong><b>→</b></Link>
        <Link to="/"><span>Teddies</span><strong>One-piece silhouettes with a little drama.</strong><b>→</b></Link>
        <Link to="/"><span>Sale</span><strong>Pretty pieces waiting for one last cart.</strong><b>→</b></Link>
      </section>

      <section className="editorial-banner"><img src="/imgs/footer banner.jpg" alt="Nue and Nude editorial campaign" loading="lazy" /></section>
    </div>
  )
}
