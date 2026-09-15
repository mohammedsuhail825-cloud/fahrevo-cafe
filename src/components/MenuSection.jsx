import { useEffect, useRef, useState } from 'react'
import { CATS, TABS } from '../data/menu.js'
import RollingText from './RollingText.jsx'
import Reveal from './Reveal.jsx'
import MenuList from './MenuList.jsx'

const CAT_BY_ID = Object.fromEntries(CATS.map(c => [c.id, c]))
const TAB_BY_ID = Object.fromEntries(TABS.map(t => [t.id, t]))
const pad = n => String(n).padStart(2, '0')
const smooth = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth')
const flatItems = t => t.cats.flatMap(cid => (CAT_BY_ID[cid] ? CAT_BY_ID[cid].items : []))

export default function MenuSection({ activeTab, onTabChange }) {
  const [pendingFocus, setPendingFocus] = useState(null)
  const tabsInnerRef = useRef(null)
  const contentRef = useRef(null)
  const firstRender = useRef(true)
  const pendingFocusRef = useRef(null)
  pendingFocusRef.current = pendingFocus

  const tab = TAB_BY_ID[activeTab] || TABS[0]

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    if (pendingFocusRef.current) return
    const h = contentRef.current && contentRef.current.querySelector('.mp-cat-head')
    if (h) h.scrollIntoView({ behavior: smooth(), block: 'start' })
  }, [activeTab])

  useEffect(() => {
    const strip = tabsInnerRef.current
    if (!strip) return
    const btn = strip.querySelector('.tab-btn[data-cat="' + activeTab + '"]')
    if (btn) {
      const left = btn.offsetLeft - (strip.clientWidth - btn.offsetWidth) / 2
      strip.scrollTo({ left: Math.max(0, left), behavior: smooth() })
    }
  }, [activeTab])

  useEffect(() => {
    const strip = tabsInnerRef.current
    if (!strip) return
    const sync = () => strip.classList.toggle('can-scroll', strip.scrollWidth - strip.clientWidth > 2)
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  return (
    <section id="full-menu" className="menu-section" aria-label="Menu">
      <Reveal as="header" className="menu-intro">
        <p className="sec-mark"><i className="d"></i><span>01</span><i className="d"></i></p>
        <h2>Explore the Menu</h2>
        <p className="menu-tagline">A little something from Fahrévo.</p>
        <p className="menu-stats">
          Desserts · {CATS.reduce((a, c) => a + c.items.length, 0)} items
        </p>
      </Reveal>

      {TABS.length > 1 && (
        <nav className="tabs" id="menuTabs" aria-label="Menu categories">
          <div className="tabs-inner" ref={tabsInnerRef} id="menuTabsInner">
            {TABS.map(t => (
              <button
                key={t.id}
                type="button"
                className={'tab-btn' + (t.id === activeTab ? ' is-active' : '')}
                data-cat={t.id}
                aria-pressed={t.id === activeTab}
                onClick={() => onTabChange(t.id)}
              >
                <RollingText text={t.label} />
              </button>
            ))}
          </div>
        </nav>
      )}

      <div className="menu-body" id="menu-items" ref={contentRef}>
        <CategoryView
          key={tab.id}
          tab={tab}
          focusName={pendingFocus && pendingFocus.tab === tab.id ? pendingFocus.item : null}
          onFocused={() => setPendingFocus(null)}
          onGo={onTabChange}
        />
      </div>
    </section>
  )
}

function CategoryView({ tab, focusName, onFocused, onGo }) {
  const items = flatItems(tab)
  const ti = TABS.findIndex(t => t.id === tab.id)
  const prev = ti > 0 ? TABS[ti - 1] : null
  const next = ti < TABS.length - 1 ? TABS[ti + 1] : null

  return (
    <div className="mp-view mp-anim">
      <header className="mp-cat-head">
        <p className="sec-mark"><i className="d"></i><span>Category {pad(ti + 1)} · {pad(TABS.length)}</span><i className="d"></i></p>
        <h2 className="mp-cat-title">{tab.label}</h2>
        <p className="mp-cat-count">{items.length} item{items.length === 1 ? '' : 's'}</p>
      </header>

      <MenuList items={items} listKey={tab.id} focusName={focusName} onFocused={onFocused} />

      {TABS.length > 1 && (
        <nav className="mp-pager" aria-label="Browse categories">
          {prev ? (
            <button type="button" className="mp-pager-btn" onClick={() => onGo(prev.id)}>
              <svg className="mp-pager-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M14.5 8H2.5M6.5 3.5 2 8l4.5 4.5"/></svg>
              <span className="mp-pager-name">{prev.label}</span>
            </button>
          ) : (
            <span className="mp-pager-btn is-void" aria-hidden="true"></span>
          )}
          <span className="mp-pager-rule" aria-hidden="true"></span>
          {next ? (
            <button type="button" className="mp-pager-btn mp-pager-btn--next" onClick={() => onGo(next.id)}>
              <span className="mp-pager-name">{next.label}</span>
              <svg className="mp-pager-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 8h12M9.5 3.5 14 8l-4.5 4.5"/></svg>
            </button>
          ) : (
            <span className="mp-pager-btn is-void" aria-hidden="true"></span>
          )}
        </nav>
      )}
    </div>
  )
}
