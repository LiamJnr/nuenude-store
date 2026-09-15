import { useState } from 'react'

const QUESTIONS = [
  ['What sizes do you carry?', 'The current edit offers XS through XL on most pieces. Each product page shows the sizes available for that silhouette. If you are between sizes, we generally recommend choosing the larger size for a softer fit.'],
  ['How do I care for my lingerie?', 'Hand wash cold with a gentle detergent and lay flat to dry. Avoid bleach and tumble drying to protect delicate lace, mesh, and hardware.'],
  ['How long does shipping take?', 'Orders are prepared within 1–3 business days. Canadian delivery typically takes 3–7 business days, US delivery takes 5–10 business days, and international delivery arrives within 7–14 business days.'],
  ['Can I return a piece?', 'Unworn, unwashed pieces with original tags may be returned within 30 days of delivery. Bodysuits, teddies, and final-sale pieces are not eligible for return because of hygiene requirements.'],
  ['Can I modify my order?', 'Please email us as soon as possible with your order reference. We will do our best to help before the order begins fulfillment, although changes cannot be guaranteed once processing starts.'],
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <article className="faq-page"><header><p className="eyebrow">A little help</p><h1>Frequently asked <em>questions.</em></h1><p>Everything we can answer before you invite a new piece into your drawer.</p></header><div className="faq-list">{QUESTIONS.map(([question, answer], index) => <section className={openIndex === index ? 'is-open' : ''} key={question}><button type="button" aria-expanded={openIndex === index} onClick={() => setOpenIndex(openIndex === index ? null : index)}><span>{question}</span><b>{openIndex === index ? '−' : '+'}</b></button>{openIndex === index && <p>{answer}</p>}</section>)}</div></article>
  )
}
