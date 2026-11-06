import { SITE } from '../data/site.js'

export default function Contact() {
  const whatsapp = `https://wa.me/${SITE.whatsapp}`

  return (
    <section id="contact" className="contact">
      <header className="section-head">
        <p className="eyebrow">Contact</p>
        <h2>Reach the kitchen.</h2>
      </header>

      <div className="contact-block">
        <div>
          <span>Area</span>
          <strong>{SITE.area}</strong>
        </div>
        <div>
          <span>Call</span>
          <a href={SITE.phoneHref}>{SITE.phone}</a>
        </div>
        <div>
          <span>WhatsApp</span>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer">Message the kitchen</a>
        </div>
      </div>
    </section>
  )
}
