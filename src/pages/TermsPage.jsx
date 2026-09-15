import { Link } from 'react-router'

export default function TermsPage() {
  return (
    <article className="policy-page">
      <header>
        <p className="eyebrow">Legal &amp; Terms</p>
        <h1>Terms <em>&amp;</em> conditions</h1>
        <p>Please read these terms carefully before exploring or shopping with Nue &amp; Nude.</p>
      </header>

      <section className="policy-block">
        <h2>Agreement to Terms</h2>
        <div>
          <p>
            These Terms of Service constitute a legally binding agreement between you and Nue &amp; Nude (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) concerning your access to and use of our website and purchase of products.
          </p>
          <p>
            By accessing the website, you confirm that you are at least 18 years of age or the age of majority in your jurisdiction, and agree to abide by all stated terms.
          </p>
        </div>
      </section>

      <section className="policy-block">
        <h2>Products &amp; Orders</h2>
        <div>
          <p>
            All products displayed on our site are subject to availability. We make every effort to display garment colors, textures, and silhouettes as accurately as possible. However, actual colors may vary slightly depending on your screen settings.
          </p>
          <p>
            We reserve the right to limit order quantities, refuse service, or cancel orders at our discretion if fraud or unauthorized activity is suspected. If an order is cancelled after payment has been completed, a full refund will be issued promptly.
          </p>
        </div>
      </section>

      <section className="policy-block">
        <h2>Pricing &amp; Payments</h2>
        <div>
          <p>
            All prices are listed in Canadian / US Dollars as shown during checkout. Prices are subject to change without prior notice.
          </p>
          <p>
            Payments are processed securely via verified, authorized payment processors (including Paystack). By providing your payment information, you represent that you have the legal right to use the designated payment method.
          </p>
        </div>
      </section>

      <section className="policy-block">
        <h2>Shipping &amp; Delivery</h2>
        <div>
          <p>
            Orders are dispatched from Alberta, Canada within 1–3 business days. 
          </p>
          <p>
            Standard delivery across all destinations is completed within <strong>5–14 working days</strong> (Canada: 3–7 business days; United States: 5–10 business days; International: 7–14 business days). You will receive tracking details via email as soon as your package has been handed to our carrier.
          </p>
          <Link to="/shipping-returns">View full shipping &amp; returns policy</Link>
        </div>
      </section>

      <section className="policy-block">
        <h2>Returns &amp; Refunds</h2>
        <div>
          <p>
            We accept returns within 30 days of delivery for unworn, unwashed items in their original condition with tags attached.
          </p>
          <p>
            Due to strict hygiene standards, certain intimate apparel items—including bodysuits, teddies, and final-sale pieces—are non-returnable.
          </p>
        </div>
      </section>

      <section className="policy-block">
        <h2>Intellectual Property</h2>
        <div>
          <p>
            All content on this website—including imagery, typography, logos, styling, descriptions, and code—is the property of Nue &amp; Nude and protected by copyright and intellectual property laws. Reproduction, redistribution, or modification without written permission is strictly prohibited.
          </p>
        </div>
      </section>

      <section className="policy-block">
        <h2>Governing Law</h2>
        <div>
          <p>
            These terms and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of the Province of Alberta and the federal laws of Canada.
          </p>
        </div>
      </section>

      <section className="policy-block">
        <h2>Questions &amp; Contact</h2>
        <div>
          <p>
            For questions about our Terms of Service or for order support, please reach out to us:
          </p>
          <p>
            <strong>Nue &amp; Nude</strong><br />
            Email: <a href="mailto:hello@nuenude.ca">hello@nuenude.ca</a>
          </p>
          <Link to="/contact">Contact customer care</Link>
        </div>
      </section>
    </article>
  )
}
