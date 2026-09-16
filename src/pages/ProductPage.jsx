import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { getProduct } from '../data/products'
import { useCart } from '../store/cart'

export default function ProductPage() {
  const { id } = useParams()
  const product = getProduct(id)
  const addItem = useCart((s) => s.addItem)
  
  const [color, setColor] = useState(product?.colors?.[0] || 'Default')
  const [size, setSize] = useState(product?.sizes?.[0])
  const [added, setAdded] = useState(false)

  // Determine gallery for selected color (or fall back to full gallery)
  const activeGallery = (product?.colorMedia && product.colorMedia[color])
    ? product.colorMedia[color]
    : (product?.gallery || [product?.image])

  const [selectedImage, setSelectedImage] = useState(activeGallery[0] || product?.image)

  // When product or color changes, ensure image stays in sync
  useEffect(() => {
    if (product) {
      const defaultColor = product.colors?.[0] || 'Default'
      setColor(defaultColor)
      const initialGallery = (product.colorMedia && product.colorMedia[defaultColor])
        ? product.colorMedia[defaultColor]
        : (product.gallery || [product.image])
      setSelectedImage(initialGallery[0] || product.image)
      setSize(product.sizes?.[0])
    }
  }, [id])

  function handleColorChange(newColor) {
    setColor(newColor)
    if (product?.colorMedia && product.colorMedia[newColor]?.[0]) {
      setSelectedImage(product.colorMedia[newColor][0])
    }
  }

  if (!product) {
    return (
      <div>
        <p>Product not found.</p>
        <Link to="/shop">Back to products</Link>
      </div>
    )
  }

  function handleAdd() {
    const itemImage = (product?.colorMedia && product.colorMedia[color]?.[0]) || selectedImage || product?.image
    addItem({ ...product, size, color, image: itemImage })
    setAdded(true)
  }

  return (
    <article className="product-detail">
      <Link className="back-link" to="/shop">← Back to collection</Link>
      <div className="product-detail-layout">
        <section className="product-gallery" aria-label={`${product.name} images`}>
          <div className="product-main-image"><img src={selectedImage} alt={`${product.name} - ${color}`} /></div>
          <div className="product-thumbnails">
            {activeGallery.map((image, index) => (
              <button
                className={image === selectedImage ? 'is-selected' : ''}
                type="button"
                key={image}
                onClick={() => setSelectedImage(image)}
                aria-label={`View image ${index + 1} of ${product.name}`}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </section>
        <section className="product-detail-info">
          <p className="eyebrow">Nue &amp; Nude / {product.category}</p>
          <h1>{product.name}</h1>
          <p className="detail-price">${product.price.toFixed(2)} {product.compareAt && <del>${product.compareAt.toFixed(2)}</del>}</p>
          <p className="detail-description">{product.description}</p>

          {product.colors && product.colors.length > 0 && (
            <fieldset className="color-picker">
              <legend>Color: <span>{color}</span></legend>
              <div className="color-picker-options">
                {product.colors.map((option) => (
                  <button
                    className={`color-btn ${color === option ? 'is-selected' : ''}`}
                    type="button"
                    key={option}
                    onClick={() => handleColorChange(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <fieldset className="size-picker">
            <legend>Choose your size <span>{size}</span></legend>
            <div>
              {product.sizes.map((option) => (
                <button
                  className={size === option ? 'is-selected' : ''}
                  type="button"
                  key={option}
                  onClick={() => setSize(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
          
          <button className="add-to-bag" type="button" onClick={handleAdd}>
            Add to Bag <span>${product.price.toFixed(2)}</span>
          </button>
          {added && <p className="add-confirmation">Added to your bag. Open “Bag” in the header to check out.</p>}
          <div className="product-notes">
            <p><strong>Fit &amp; feel</strong> Adjustable straps and a flexible, close-to-body fit.</p>
            <p><strong>Care</strong> Hand wash cold. Lay flat to dry.</p>
          </div>
        </section>
      </div>
    </article>
  )
}
