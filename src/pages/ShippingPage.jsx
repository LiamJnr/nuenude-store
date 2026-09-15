import { Link } from 'react-router'

export default function ShippingPage() {
  return (
    <article className="policy-page">
      <header><p className="eyebrow">Customer care</p><h1>Shipping <em>&amp;</em> returns</h1><p>Everything you need to know before your order begins its journey. Standard delivery takes between 5–14 working days depending on destination.</p></header>
      <section className="policy-block"><h2>Shipping</h2><div><p>Orders are prepared from Alberta, Canada within 1–3 business days. Once an order has shipped, you’ll receive a confirmation email with tracking details. All orders are delivered within 5–14 working days.</p><div className="policy-table"><p><span>Canada</span><strong>3–7 business days</strong><em>Free over $100 / $8 flat rate</em></p><p><span>United States</span><strong>5–10 business days</strong><em>Calculated at checkout</em></p><p><span>International</span><strong>7–14 business days</strong><em>Calculated at checkout</em></p></div></div></section>
      <section className="policy-block"><h2>Returns</h2><div><p>We accept returns within 30 days of delivery for unworn, unwashed pieces with their original tags attached. For hygiene reasons, bodysuits, teddies, and final-sale pieces are not eligible for return.</p><p>To begin a return, email us with your order number and reason for return. We’ll reply with next steps as soon as possible.</p><a href="mailto:hello@nuenude.ca">Email customer care</a></div></section>
      <section className="policy-block"><h2>Exchanges</h2><div><p>We do not process direct exchanges. Returning your original order and placing a new order helps ensure the new size or style reaches you without delay.</p><Link to="/shop">Browse the collection</Link></div></section>
    </article>
  )
}

