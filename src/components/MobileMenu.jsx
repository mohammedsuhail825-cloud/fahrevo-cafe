import { memo, useEffect, useRef } from 'react'
import { NAV_ITEMS, SITE } from '../data/site.js'

function MobileMenuBase({ open, active, onClose }) {
  const firstRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    return () => document.documentElement.classList.remove('menu-open')
  }, [open])

  useEffect(() => {
    if (open && firstRef.current) firstRef.current.focus({ preventScroll: true })
  }, [open])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 941px)')
    const fn = () => { if (mq.matches) onClose() }
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [onClose])

  return (
    <div
      className={'mobile-menu' + (open ? ' is-open' : '')}
      id="mobileMenu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <nav className="mobile-nav" aria-label="Primary mobile">
        {NAV_ITEMS.map((item, i) => (
          <a
            key={item.href}
            ref={i === 0 ? firstRef : undefined}
            className={'m-link' + (active === item.id ? ' is-active' : '')}
            style={{ '--i': i }}
            href={item.href}
            onClick={onClose}
          >
            <span className="m-idx">{String(i + 1).padStart(2, '0')}</span>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="mobile-foot">
        <p className="m-hours">{SITE.area} · {SITE.phone}</p>
        <a className="btn btn--solid btn--full" href="/menu" onClick={onClose}>
          See desserts
        </a>
      </div>
    </div>
  )
}

export default memo(MobileMenuBase)