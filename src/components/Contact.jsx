import { SITE } from '../data/site.js'
import Reveal from './Reveal.jsx'

export default function Contact() {
  return (
    <section id="contact" className="section">
      <Reveal as="header" className="section-head">
        <p className="sec-mark">
          <i className="d"></i>
          <span>04</span>
          <i className="d"></i>
        </p>
        <h2>Contact</h2>
      </Reveal>

      <div className="contact-rows">
        <Reveal className="c-row">
          <span className="c-label">Based in</span>
          <span className="c-value">
            <strong className="c-name">{SITE.name}</strong>
            <span className="c-addr">
              Cloud kitchen · {SITE.area}
            </span>
          </span>
        </Reveal>

        <Reveal className="c-row">
          <span className="c-label">Call</span>
          <a className="c-tel" href={SITE.phoneHref}>
            {SITE.phone}
          </a>
        </Reveal>
      </div>

      <Reveal className="contact-actions">
        <a className="btn btn--solid" href={SITE.phoneHref}>
          <span>Call Now</span>
          <svg className="btn-arrow" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M1.5 8h12M9.5 3.5 14 8l-4.5 4.5" />
          </svg>
        </a>
      </Reveal>
    </section>
  )
}
