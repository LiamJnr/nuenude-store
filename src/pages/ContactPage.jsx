export default function ContactPage() {
  return (
    <article className="contact-page">
      <header><p className="eyebrow">Get in touch</p><h1>We’d love to hear what you’re looking <em>for.</em></h1><p>Questions about fit, an existing order, or something else entirely—we’re here to help.</p></header>
      <div className="contact-grid"><section><p className="eyebrow">Customer care</p><a href="mailto:hello@nuenude.ca">hello@nuenude.ca</a><p>For order help, include your order reference when you write. We aim to respond within two business days.</p></section><section><p className="eyebrow">Based in</p><h2>Alberta,<br />Canada</h2><p>Online only, with carefully selected pieces sent from our home base.</p></section><section><p className="eyebrow">Before you write</p><a href="/faq">Visit frequently asked questions <span>→</span></a><p>Our sizing, shipping, and returns answers may already have what you need.</p></section></div>
    </article>
  )
}
