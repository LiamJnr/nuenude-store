import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

export default function ExpansionModal() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user has already dismissed the modal in this session
    const hasSeenModal = sessionStorage.getItem('nuenude_expansion_modal_seen')
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  function closeModal() {
    sessionStorage.setItem('nuenude_expansion_modal_seen', 'true')
    setIsOpen(false)
  }

  function handleShopNow() {
    closeModal()
    navigate('/shop')
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        closeModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="expansion-modal-scrim" onClick={closeModal} role="dialog" aria-modal="true">
      <div className="expansion-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="expansion-modal-close" onClick={closeModal} aria-label="Close modal">
          &times;
        </button>
        
        <div className="expansion-modal-media">
          <img src="/imgs/trending1.webp" alt="Nue & Nude West Africa Expansion" />
        </div>

        <div className="expansion-modal-content">
          <div className="expansion-modal-brand">NUE &amp; NUDE</div>
          <h2 className="expansion-modal-title">West Africa Expansion</h2>
          <p className="expansion-modal-subtitle">Celebrating our new chapter in partnership with Paystack</p>

          <div className="expansion-modal-features">
            <div className="expansion-feature-item">
              <div className="feature-check" aria-hidden="true">✓</div>
              <div className="feature-text">
                <strong>Paystack Partnership</strong>
                <span>Seamless, secure local checkout in GHS and USD across West Africa.</span>
              </div>
            </div>

            <div className="expansion-feature-item">
              <div className="feature-check" aria-hidden="true">✓</div>
              <div className="feature-text">
                <strong>Complimentary Shipping</strong>
                <span>Enjoy 100% free delivery on all orders as an exclusive expansion gift.</span>
              </div>
            </div>
          </div>

          <button className="expansion-modal-btn" onClick={handleShopNow} type="button">
            PROCEED TO CHECKOUT
          </button>

          <p className="expansion-modal-footer">
            Fast &amp; secure checkout powered by <strong>Paystack</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
