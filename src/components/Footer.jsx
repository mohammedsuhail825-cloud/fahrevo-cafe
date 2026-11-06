import { SITE } from '../data/site.js'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <a className="f-name" href="/">{SITE.brand}</a>
        <p className="f-meta">{SITE.area}</p>
      </div>
    </footer>
  )
}
