import { NAV_ITEMS, SITE } from '../data/site.js'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="f-brand">
          <a className="f-name" href="#home">
            <span>{SITE.name}</span>
          </a>
          <p className="f-meta">
            {SITE.area} · <a href={SITE.phoneHref}>{SITE.phone}</a>
          </p>
        </div>

        <nav className="f-nav" aria-label="Footer">
          {NAV_ITEMS.map(item => (
            <a key={item.href} href={item.href}>{item.label === 'About Us' ? 'About' : item.label}</a>
          ))}
        </nav>

        <div className="f-order">
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>
    </footer>
  )
}
