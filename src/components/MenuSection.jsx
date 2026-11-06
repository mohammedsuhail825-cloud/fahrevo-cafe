import { useEffect, useRef, useState } from 'react'
import { CATS, TABS } from '../data/menu.js'
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
  const count = CATS.reduce((a, c) => a + c.items.length, 0)

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return }
    if (pendingFocusRef.current) return
    const h = contentRef.current && contentRef.current.querySelector('.menu-cat-head')
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
      <header className="section-head menu-head">
        <p className="eyebrow">Menu</p>
        <h2>Desserts</h2>
        <p className="section-note">{count} {count === 1 ? 'item' : 'items'} · made to order</p>
      </header>

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
                {t.label}
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
      <p className="menu-soon">More items coming soon</p>
    </section>
  )
}

function CategoryView({ tab, focusName, onFocused, onGo }) {
  const items = flatItems(tab)
  const ti = TABS.findIndex(t => t.id === tab.id)
  const prev = ti > 0 ? TABS[ti - 1] : null
  const next = ti < TABS.length - 1 ? TABS[ti + 1] : null

  return (
    <div className="menu-view">
      {TABS.length > 1 && (
        <header className="menu-cat-head">
          <p className="eyebrow">Category {pad(ti + 1)} · {pad(TABS.length)}</p>
          <h3>{tab.label}</h3>
          <p className="section-note">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </header>
      )}

      <MenuList items={items} listKey={tab.id} focusName={focusName} onFocused={onFocused} />

      {TABS.length > 1 && (
        <nav className="menu-pager" aria-label="Browse categories">
          {prev ? (
            <button type="button" onClick={() => onGo(prev.id)}>Previous · {prev.label}</button>
          ) : <span />}
          {next ? (
            <button type="button" onClick={() => onGo(next.id)}>Next · {next.label}</button>
          ) : <span />}
        </nav>
      )}
    </div>
  )
}
