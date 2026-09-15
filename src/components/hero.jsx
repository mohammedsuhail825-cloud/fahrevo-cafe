import { useEffect, useState } from 'react'
import { SITE } from '../data/site.js'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const hideImg = e => { e.currentTarget.style.display = 'none' }

export default function Hero() {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (reducedMotion() || !document.documentElement.classList.contains('intro-pending')) {
      const raf = requestAnimationFrame(() => setEntered(true))
      return () => cancelAnimationFrame(raf)
    }
    const reveal = () => setEntered(true)
    window.addEventListener('cravings:intro-done', reveal, { once: true })
    const fallback = setTimeout(reveal, 5200)
    return () => {
      window.removeEventListener('cravings:intro-done', reveal)
      clearTimeout(fallback)
    }
  }, [])

  return (
    <section className="hero" id="home">
      <div className="hero-glow" aria-hidden="true"></div>
      <div className={'hero-stage' + (entered ? ' is-entered' : '')}>
        <div className="hero-copy">
          <p className="hero-overline">
            <span aria-hidden="true">✦</span>
            <span>Signature Cakes</span>
            <span aria-hidden="true">✦</span>
          </p>
          <h1 className="hero-title">
            <span className="line">
              <span className="line-inner" style={{ '--i': 0 }}>An Élevated Take</span>
            </span>
            <span className="line">
              <span className="line-inner" style={{ '--i': 1 }}>
                on <em>Sweet.</em>
              </span>
            </span>
          </h1>
          <p className="hero-lede">
            Crafted with indulgent flavors and a touch of {SITE.brand}.
          </p>
          <div className="hero-actions">
            <a className="btn btn--ghost" href="#menu-items">
              <span>Explore Menu</span>
              <svg className="btn-arrow" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M1.5 8h12M9.5 3.5 14 8l-4.5 4.5" />
              </svg>
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <img
            className="hero-media"
            src={SITE.heroUrl}
            alt="Fahrévo Kinder Bueno signature cake"
            decoding="async"
            fetchPriority="high"
            onError={hideImg}
          />
        </div>
      </div>
    </section>
  )
}
