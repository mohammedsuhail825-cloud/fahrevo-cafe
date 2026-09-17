import { useCallback, useEffect, useRef, useState } from 'react'
import { NAV_ITEMS, SITE } from '../data/site.js'
import { useCart } from '../context/CartContext.jsx'
import useScrollSpy from '../hooks/useScrollSpy.js'
import RollingText from './RollingText.jsx'
import MobileMenu from './MobileMenu.jsx'

const SPY_IDS = ['home', 'full-menu', 'about', 'contact']

export default function Header() {
  const headerRef = useRef(null)
  const toggleRef = useRef(null)
  const [solid, setSolid] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useScrollSpy(SPY_IDS)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const { totalQty, setOpen: setCartOpen } = useCart()

  useEffect(() => {
    let ticking = false
    const update = () => {
      const hero = document.getElementById('home')
      const hh = headerRef.current ? headerRef.current.offsetHeight : 72
      const past = hero ? hero.getBoundingClientRect().bottom <= hh + 12 : true
      setPastHero(past)
      setSolid(past || menuOpen)
      ticking = false
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [menuOpen])

  useEffect(() => {
    const hero = document.getElementById('home')
    const hh = headerRef.current ? headerRef.current.offsetHeight : 72
    const past = hero ? hero.getBoundingClientRect().bottom <= hh + 12 : window.scrollY > 24
    setSolid(past || menuOpen)
  }, [menuOpen])

  useEffect(() => {
    const sync = () => {
      const hh = headerRef.current ? headerRef.current.offsetHeight : 72
      const tabs = document.getElementById('menuTabs')
      const th = tabs ? tabs.offsetHeight : 0
      const root = document.documentElement
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
      <header
        ref={headerRef}
        id="siteHeader"
        className={'site-header' + (solid ? ' is-solid' : '') + (pastHero ? ' is-past-hero' : '')}
      >
        <div className="header-inner">
          <a className="brand" href="#home" aria-label="Fahrévo Cafe — home">
            <span className="brand-lockup">
              <span className="brand-name">{SITE.brand}</span>
              <span className="brand-sub">Cafe</span>
            </span>
          </a>

          <nav className="site-nav" aria-label="Primary">
            <ul>
              {NAV_ITEMS.map(item => (
                <li key={item.href}>
                  <a
                    className={'nav-link' + (active === item.id ? ' is-active' : '')}
                    href={item.href}
                    aria-label={item.label}
                  >
                    <RollingText text={item.label} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="btn-cart"
              aria-label={totalQty ? `Open cart, ${totalQty} items` : 'Open cart'}
              onClick={() => setCartOpen(true)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 7h15l-1.4 9H8.2L6 7Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M6 7 5 3H2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="9.5" cy="20" r="1.3" fill="currentColor"/>
                <circle cx="17.5" cy="20" r="1.3" fill="currentColor"/>
              </svg>
              {totalQty > 0 && <span className="btn-cart-count">{totalQty}</span>}
            </button>
            <a className="btn-order" href="#order">
              <span>Order</span>
              <svg className="btn-arrow" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M1.5 8h12M9.5 3.5 14 8l-4.5 4.5" />
              </svg>
            </a>
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
