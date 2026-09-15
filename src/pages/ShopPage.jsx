import { useMemo, useState } from 'react'
import { PRODUCTS } from '../data/products'
import ProductCard from '../components/ProductCard'
import { useCart } from '../store/cart'

const categories = ['All', 'Sets', 'Teddies', 'Corsets', 'Garters', 'Babydolls', 'Sale']
const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL']

export default function ShopPage() {
  const addItem = useCart((s) => s.addItem)
  const [category, setCategory] = useState('All')
  const [size, setSize] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')

  const products = useMemo(() => {
    const search = query.trim().toLowerCase()
    const result = PRODUCTS.filter((product) => (
      (category === 'All' || product.category === category || (category === 'Sale' && product.badge === 'Sale')) &&
      (size === 'All' || product.sizes.includes(size)) &&
      (!search || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(search))
    ))
    return [...result].sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0)
  }, [category, query, size, sort])

  return (
    <section className="shop-page">
      <div className="shop-page-heading"><p className="eyebrow">Nue &amp; Nude collection</p><h1>Find the piece that feels like <em>you.</em></h1><p>Our current edit is small by design—made for lingering, not scrolling.</p></div>
      <div className="shop-controls"><label className="shop-search"><span className="sr-only">Search the collection</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the collection" /></label><label className="shop-sort">Sort<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div>
      <div className="shop-filter-groups"><div className="shop-category-tabs" aria-label="Shop categories">{categories.map((item) => <button key={item} type="button" className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="shop-size-tabs" aria-label="Filter by size">{sizes.map((item) => <button key={item} type="button" className={size === item ? 'is-active' : ''} onClick={() => setSize(item)}>{item === 'All' ? 'All sizes' : item}</button>)}</div></div>
      <div className="shop-results-heading"><span>{products.length} {products.length === 1 ? 'piece' : 'pieces'}</span><span>Curated collection</span></div>
      {products.length ? <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} onQuickAdd={(item) => addItem({ ...item, size: item.sizes[0] })} />)}</div> : <div className="shop-empty"><p>No pieces match this edit.</p><button type="button" onClick={() => { setCategory('All'); setSize('All'); setQuery(''); setSort('featured') }}>Clear filters</button></div>}
    </section>
  )
}
