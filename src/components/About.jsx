import { SITE } from '../data/site.js'
import Reveal from './Reveal.jsx'

const hideImg = e => { e.currentTarget.style.display = 'none' }
const WORDS = ['Desserts', 'Kinder Bueno', 'Kinder Crunch']

export default function About() {
  return (
    <section id="about" className="about-wrap" aria-label="About Fahrévo Cafe">
      <div className="about-grid">
        <Reveal className="about-copy">
          <p className="sec-mark"><i className="d"></i><span>02</span><i className="d"></i></p>
          <h2 className="about-title">About Fahrévo Cafe</h2>
          <p className="about-accent">More than just any dessert.</p>
          <p className="about-lede">
            Fahrévo Cafe serves signature desserts — crafted for your sweetest cravings in Mehdipatnam, Hyderabad.
          </p>
          <a className="btn btn--solid about-cta" href="#menu-items">
            <span>Explore the Menu</span>
            <svg className="btn-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 8h12M9.5 3.5 14 8l-4.5 4.5"/></svg>
          </a>
        </Reveal>

        <Reveal className="about-photo" delay=".1s">
          <div className="frame">
            <img
              src={SITE.aboutUrl}
              alt="Fahrévo Cafe dessert"
              loading="lazy"
              decoding="async"
              onError={hideImg}
            />
          </div>
        </Reveal>
      </div>

      <Reveal as="p" className="about-cats">
        {WORDS.flatMap((w, i) => [
          <span className="ac-word" key={'w' + i}>{w}</span>,
          ...(i < WORDS.length - 1 ? [<span className="ac-dot" key={'d' + i} aria-hidden="true">·</span>] : []),
        ])}
      </Reveal>
    </section>
  )
}
