import { Link } from 'react-router'

export default function PrivacyPolicyPage() {
  return (
    <article className="policy-page">
      <header>
        <p className="eyebrow">Legal &amp; Privacy</p>
        <h1>Privacy <em>&amp;</em> policy</h1>
        <p>Your privacy and trust are paramount to us. Learn how we collect, handle, and protect your personal information.</p>
      </header>

      <section className="policy-block">
        <h2>Introduction</h2>
        <div>
          <p>
            Nue &amp; Nude (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), operating out of Alberta, Canada, is committed to safeguarding the privacy and security of your personal data. This Privacy Policy outlines how your personal information is collected, used, and disclosed when you visit, browse, or make a purchase from our website.
          </p>
          <p>
            By accessing or using our services, you acknowledge that you have read and understood the practices described in this policy.
          </p>
        </div>
      </section>

      <section className="policy-block">
        <h2>Information We Collect</h2>
        <div>
          <p>
            When you interact with Nue &amp; Nude, we collect various types of information to provide you with seamless service:
          </p>
          <p>
            <strong>Order &amp; Contact Details:</strong> When you place an order, we collect your name, billing address, shipping address, email address, and phone number to fulfill your purchase and provide shipment tracking updates.
          </p>
          <p>
            <strong>Device &amp; Usage Information:</strong> We automatically collect certain information when you browse the site, including your IP address, browser type, device details, and pages viewed, to ensure technical reliability and improve our store experience.
          </p>
        </div>
      </section>

      <section className="policy-block">
        <h2>Payment Processing</h2>
        <div>
          <p>
            All payment transactions on Nue &amp; Nude are encrypted and handled directly by certified, PCI-DSS compliant payment gateways (such as Paystack).
          </p>
          <p>
            We do not store, process, or have access to your full credit card or sensitive financial information on our servers. Your payment details are securely transferred directly to our payment processor.
          </p>
        </div>
      </section>

      <section className="policy-block">
        <h2>How We Use Information</h2>
        <div>
          <p>We use your information strictly for legitimate business purposes:</p>
          <p>
            • Processing, packing, and delivering your orders within our 5–14 working days standard delivery window.<br />
            • Communicating with you regarding order confirmations, shipping notifications, and customer support inquiries.<br />
            • Screening transactions for potential risk, fraud, or unauthorized activities.<br />
            • Sending private notes and promotional updates if you have voluntarily subscribed to our newsletter (you may opt out at any time).
          </p>
        </div>
      </section>

      <section className="policy-block">
        <h2>Data Sharing &amp; Third Parties</h2>
        <div>
          <p>
            We never sell, rent, or trade your personal information. We only share necessary data with trusted third-party service providers essential for operating our business, such as postal couriers for order delivery and payment processors for transaction settlement.
          </p>
          <p>
            We may also disclose information where required by law, regulation, or legal process to protect our legal rights.
          </p>
        </div>
      </section>

      <section className="policy-block">
        <h2>Your Rights</h2>
        <div>
          <p>
            Depending on your jurisdiction, you have the right to request access to the personal data we hold about you, request corrections, or request that your personal information be deleted.
          </p>
          <p>
            To exercise any of these rights, please contact our team directly at <a href="mailto:hello@nuenude.ca">hello@nuenude.ca</a>.
          </p>
        </div>
      </section>

      <section className="policy-block">
        <h2>Contact Us</h2>
        <div>
          <p>
            If you have questions, feedback, or concerns regarding our privacy practices, please contact us:
          </p>
          <p>
            <strong>Nue &amp; Nude</strong><br />
            Alberta, Canada<br />
            Email: <a href="mailto:hello@nuenude.ca">hello@nuenude.ca</a>
          </p>
          <Link to="/contact">Visit contact page</Link>
        </div>
      </section>
    </article>
  )
}
