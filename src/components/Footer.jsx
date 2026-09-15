import { Link } from 'react-router'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <section><p className="footer-kicker">Collection</p><Link to="/shop">New Arrivals</Link><Link to="/shop">Best Sellers</Link><Link to="/shop">Shop All</Link></section>
        <section><p className="footer-kicker">Customer Care</p><Link to="/contact">Contact Us</Link><Link to="/faq">FAQs</Link><Link to="/shipping-returns">Shipping &amp; Returns</Link><Link to="/privacy-policy">Privacy Policy</Link><Link to="/terms-of-service">Terms of Service</Link><Link to="/about">Our Story</Link></section>
        <section className="footer-signup"><p className="footer-kicker">Private Notes</p><p>First access to new drops, restocks, and private offers.</p><form className="email-signup" onSubmit={(event) => event.preventDefault()}><label className="sr-only" htmlFor="footer-email">Email address</label><input id="footer-email" type="email" placeholder="Email address" autoComplete="email" /><button type="submit">Join</button></form></section>
      </div>
      <p className="footer-wordmark">Nue <span className="brand-amp">&amp;</span> Nude</p>
    </footer>
  )
}
