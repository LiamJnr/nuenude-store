import { useEffect } from 'react'

const moneyUSD = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

const moneyGHS = (value) =>
  new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(value)

export default function CheckoutReviewModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  usdTotal,
  subtotal,
  shippingCost,
  shippingAddress,
  email,
  exchangeRate = 16.5,
  currency = 'GHS',
}) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, loading, onClose])

  if (!isOpen) return null

  const isGHS = currency.toUpperCase() === 'GHS'
  const ghsEquivalent = usdTotal * exchangeRate

  return (
    <div className="checkout-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="checkout-modal-backdrop" onClick={loading ? undefined : onClose} />
      <div className="checkout-modal-container">
        <div className="checkout-modal-card">
          <div className="checkout-modal-header">
            <div>
              <p className="eyebrow">Final Step · Order Review</p>
              <h2 id="modal-title" className="checkout-modal-title">Ready for secure payment.</h2>
            </div>
            <button
              type="button"
              className="checkout-modal-close"
              onClick={onClose}
              disabled={loading}
              aria-label="Close review modal"
            >
              ×
            </button>
          </div>

          <div className="checkout-modal-body">
            {/* Primary USD Total Highlight */}
            <div className="checkout-modal-total-banner">
              <div>
                <span className="modal-total-label">Total to pay</span>
                <p className="modal-total-subtext">Includes complimentary free shipping</p>
              </div>
              <strong className="modal-total-usd">{moneyUSD(usdTotal)}</strong>
            </div>

            {/* West Africa Expansion & Complimentary Shipping Announcement */}
            <div className="currency-conversion-card">
              <div className="currency-conversion-head">
                <span className="currency-badge">West Africa Expansion</span>
                <span className="currency-rate-pill">Complimentary Free Shipping Included</span>
              </div>
              <p className="currency-conversion-note" style={{ marginBottom: isGHS ? '14px' : '0' }}>
                We are proud to be expanding our services to West Africa! As part of this expansion, we have partnered with <strong>Paystack</strong> as our regional payment processor. To celebrate, your order comes with <strong>free complimentary shipping</strong>.
              </p>
              {isGHS && (
                <>
                  <div className="currency-conversion-amount">
                    <span>Processed via Paystack (~1 USD ≈ {exchangeRate} GHS):</span>
                    <strong>{moneyGHS(ghsEquivalent)}</strong>
                  </div>
                  <p className="currency-conversion-note" style={{ fontSize: '11px', opacity: 0.9 }}>
                    Your card will be billed in Ghanaian Cedis (GH₵) at the bank conversion rate, matching your exact store total of <strong>{moneyUSD(usdTotal)}</strong> with no additional merchant fees.
                  </p>
                </>
              )}
            </div>

            {/* Order & Delivery Details Summary */}
            <div className="checkout-modal-details">
              <div className="modal-detail-col">
                <p className="modal-detail-title">Delivery To</p>
                <p className="modal-detail-text">
                  <strong>{shippingAddress?.name || 'Customer'}</strong><br />
                  {shippingAddress?.line1}<br />
                  {shippingAddress?.line2 && <>{shippingAddress.line2}<br /></>}
                  {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zip}<br />
                  {shippingAddress?.country}
                </p>
              </div>
              <div className="modal-detail-col">
                <p className="modal-detail-title">Contact &amp; Breakdown</p>
                <p className="modal-detail-text">
                  <span>Email:</span> {email}<br />
                  <span>Subtotal:</span> {moneyUSD(subtotal)}<br />
                  <span>Shipping:</span> Complimentary (Expansion Gift)
                </p>
              </div>
            </div>
          </div>

          <div className="checkout-modal-footer">
            <button
              type="button"
              className="checkout-modal-pay-btn"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <span>Opening secure payment…</span>
              ) : (
                <>
                  <span>Pay {moneyUSD(usdTotal)} with Card</span>
                  <span className="pay-arrow">→</span>
                </>
              )}
            </button>
            <button
              type="button"
              className="checkout-modal-cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Edit delivery details
            </button>
            <p className="modal-security-note">
              🔒 Encrypted 256-bit payment via Paystack · PCI-DSS Level 1 Certified
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
