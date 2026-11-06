import { useCallback, useEffect, useRef, useState } from 'react'
import { NAV_ITEMS, SITE } from '../data/site.js'
import { useCart } from '../context/CartContext.jsx'
import useScrollSpy from '../hooks/useScrollSpy.js'
import MobileMenu from './MobileMenu.jsx'

const SPY_IDS = ['home', 'about', 'contact']

export default function Header({ page }) {
  const headerRef = useRef(null)
  const toggleRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const spy = useScrollSpy(SPY_IDS, page)
  const active = page === 'menu' ? 'full-menu' : spy
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const { totalQty, setOpen: setCartOpen } = useCart()

  useEffect(() => {
    const sync = () => {
      const hh = headerRef.current ? headerRef.current.offsetHeight : 72
      const tabs = document.getElementById('menuTabs')
      const th = tabs ? tabs.offsetHeight : 0
      const root = document.documentElement
      const prev = parseInt(root.style.getPropertyValue('--header-h'), 10)
      if (!prev || Math.abs(prev - hh) > 1) root.style.setProperty('--header-h', hh + 'px')
      root.style.setProperty('--tabs-top', hh + 'px')
      root.style.setProperty('--menu-offset', (hh + th + 26) + 'px')
    }
    sync()
    const ro = new ResizeObserver(sync)
    if (headerRef.current) ro.observe(headerRef.current)
    window.addEventListener('resize', sync)
    return () => { ro.disconnect(); window.removeEventListener('resize', sync) }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = e => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        if (toggleRef.current) toggleRef.current.focus({ preventScroll: true })
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <>
      <header ref={headerRef} id="siteHeader" className="site-header">
        <div className="header-inner">
          <a className="brand" href="/" aria-label="Fahrévo Cafe — home">
            <span className="brand-name">{SITE.brand}</span>
            <span className="brand-sub">Cafe</span>
          </a>

          <nav className="site-nav" aria-label="Primary">
            <ul key={page}>
              {NAV_ITEMS.map((item, i) => (
                <li key={item.href} style={{ '--i': i }}>
                  <a
                    className={'nav-link' + (active === item.id ? ' is-active' : '')}
                    href={item.href}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="btn-cart"
              aria-label={totalQty ? `Open cart, ${totalQty} ${totalQty === 1 ? 'item' : 'items'}` : 'Open cart'}
              onClick={() => setCartOpen(true)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 7h15l-1.4 9H8.2L6 7Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M6 7 5 3H2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="9.5" cy="20" r="1.3" fill="currentColor"/>
                <circle cx="17.5" cy="20" r="1.3" fill="currentColor"/>
              </svg>
              <span className="btn-cart-label">Cart</span>
              {totalQty > 0 && <span className="btn-cart-count">{totalQty}</span>}
            </button>
            <button
              ref={toggleRef}
              className={'menu-toggle' + (menuOpen ? ' is-open' : '')}
              id="menuToggle"
              aria-expanded={menuOpen}
              aria-controls="mobileMenu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen(o => !o)}
            >
              <span className="bars"><span></span><span></span></span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} active={active} onClose={closeMenu} />
    </>
  )
}
