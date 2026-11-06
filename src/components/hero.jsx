import { SITE } from '../data/site.js'

const hideImg = e => { e.currentTarget.style.display = 'none' }

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bloom" aria-hidden="true">
        <svg className="hero-leaf hero-leaf--a" viewBox="0 0 80 150">
          <path d="M40 142C40 92 6 58 40 8c34 50 0 84 0 134z" />
          <path d="M40 128c0-36 0-72 0-104" />
          <path d="M40 96c-12-4-20-14-24-26M40 72c12-2 22-12 26-24M40 52c-8-2-16-10-18-18" />
        </svg>
        <svg className="hero-leaf hero-leaf--b" viewBox="0 0 80 150">
          <path d="M40 142C40 92 6 58 40 8c34 50 0 84 0 134z" />
          <path d="M40 128c0-36 0-72 0-104" />
          <path d="M40 96c-12-4-20-14-24-26M40 72c12-2 22-12 26-24" />
        </svg>
      </div>

      <div className="hero-stage">
        <div className="hero-copy">
          <p className="hero-kicker">
            <span>Kinder Bueno</span>
            <span>Kinder Crunch</span>
          </p>
          <p className="hero-script">Signature</p>
          <h1 className="hero-name">Desserts</h1>
          <p className="hero-lede">
            Kinder Bueno and Kinder Crunch from our kitchen. Pick a cake, then send the order on WhatsApp.
          </p>
          <div className="hero-actions">
            <a className="btn btn--solid" href="/menu">See desserts</a>
            <a className="btn btn--ghost" href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer">
              Order on WhatsApp
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <img
            src={SITE.heroUrl}
            alt="Fahrévo Kinder Bueno signature cake"
            decoding="async"
            fetchPriority="high"
            onError={hideImg}
          />
        </div>
      </div>

      <svg className="hero-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 52C220 12 380 82 620 48C860 14 1040 74 1260 36C1340 22 1400 28 1440 34V90H0Z" />
      </svg>
    </section>
  )
}
