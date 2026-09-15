import { Link } from 'react-router'

export default function AboutPage() {
  return (
    <article className="editorial-page">
      <header className="editorial-page-hero"><p className="eyebrow">Our story</p><h1>Softness with a little more <em>intention.</em></h1></header>
      <div className="editorial-page-body"><section><h2>Made for the feeling.</h2><p>Nue &amp; Nude is a Canadian lingerie edit for the woman who wants softness with structure. Every piece is chosen for the private, confidence-shifting moments that happen long before anyone else sees it.</p><p>We believe beautiful lingerie should feel considered on real bodies: adjustable where it matters, comfortable enough to linger in, and expressive without asking you to perform.</p></section><aside><p className="eyebrow">The approach</p><ul><li>Curated silhouettes</li><li>Thoughtful, flexible fit</li><li>Delicate details, everyday confidence</li></ul></aside></div>
      <section className="editorial-page-close"><p>From Alberta, Canada</p><h2>For the version of you that feels most like <em>you.</em></h2><Link to="/shop">Shop the collection</Link></section>
    </article>
  )
}
