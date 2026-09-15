import { Link } from 'react-router'
import { PRODUCTS } from '../data/products'
import ProductCard from '../components/ProductCard'
import { useCart } from '../store/cart'

export default function HomePage() {
  const addItem = useCart((s) => s.addItem)
  const featuredProducts = PRODUCTS.slice(0, 3)

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
          <a href="#new-and-loved" className="hero-button">Shop Now</a>
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

      <aside className="promotion"><p><strong>Complimentary shipping</strong><span>On orders over $100</span></p><a href="#new-and-loved">Discover the edit <span>→</span></a></aside>

      <section className="collection-intro" id="new-and-loved">
        <div><p className="eyebrow">New softness</p><h2>A smaller edit for slipping into something beautiful.</h2></div>
        <a className="text-link" href="#new-and-loved">View all pieces <span>→</span></a>
      </section>

      <section className="product-section" aria-labelledby="new-loved-title">
        <div className="product-section-heading"><h2 id="new-loved-title">New &amp; Loved</h2><span>{PRODUCTS.length} pieces</span></div>
        <div className="product-grid">
        {PRODUCTS.map((p) => (
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
