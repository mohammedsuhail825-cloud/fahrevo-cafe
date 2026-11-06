import { useEffect, useRef, useState } from 'react'
import { PREVIEW } from '../data/menu.js'
import { useCart } from '../context/CartContext.jsx'

const smooth = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth')
const itemName = item => (typeof item === 'string' ? item : item.name)
const itemImg = item => (typeof item === 'string' ? null : item.img)
const hideImg = e => { e.currentTarget.style.display = 'none' }

function DishCard({ item, staggerIndex }) {
  const name = itemName(item)
  const img = itemImg(item)
  const { addItem, setQty, items } = useCart()
  const qty = items.find(entry => entry.name === name)?.qty || 0

  return (
    <li className="dish" data-name={name} style={{ '--i': staggerIndex ?? 0 }}>
      <div className="dish-photo">
        {img && (
          <img src={img} alt={name} loading="lazy" decoding="async" onError={hideImg} />
        )}
      </div>
      <svg className="dish-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 52C220 12 380 82 620 48C860 14 1040 74 1260 36C1340 22 1400 28 1440 34V90H0Z" />
      </svg>
      <div className="dish-body">
        <h3 className="dish-name">{name}</h3>
        {qty > 0 ? (
          <div className="dish-qty">
            <button type="button" aria-label={`Decrease ${name}`} onClick={() => setQty(name, qty - 1)}>−</button>
            <span aria-live="polite">{qty}</span>
            <button type="button" aria-label={`Increase ${name}`} onClick={() => setQty(name, qty + 1)}>+</button>
          </div>
        ) : (
          <button type="button" className="dish-add" onClick={() => addItem(name)}>Add</button>
        )}
      </div>
      <svg className="dish-foot" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 52C220 12 380 82 620 48C860 14 1040 74 1260 36C1340 22 1400 28 1440 34V90H0Z" />
      </svg>
    </li>
  )
}

export default function MenuList({ items, listKey, focusName, onFocused }) {
  const [open, setOpen] = useState(false)
  const [instant, setInstant] = useState(false)
  const rootRef = useRef(null)

  const first = items.slice(0, PREVIEW)
  const rest = items.slice(PREVIEW)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const cards = root.querySelectorAll('.dish')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach(card => card.classList.add('is-in'))
      return
    }
    const seen = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-in')
        seen.unobserve(entry.target)
      })
    }, { threshold: 0.22 })
    cards.forEach(card => seen.observe(card))
    return () => seen.disconnect()
  }, [items, open])

  useEffect(() => {
    if (!focusName) return
    const li = Array.from(rootRef.current.querySelectorAll('.dish'))
      .find(el => (el.dataset.name || '').trim() === focusName)
    if (!li) { if (onFocused) onFocused(); return }
    setInstant(true)
    setOpen(true)
    const t = setTimeout(() => {
      li.scrollIntoView({ behavior: smooth(), block: 'center' })
      li.classList.add('is-flash')
      setTimeout(() => li.classList.remove('is-flash'), 1900)
      setInstant(false)
      if (onFocused) onFocused()
    }, 140)
    return () => clearTimeout(t)
  }, [focusName, onFocused])

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (!next && rootRef.current) {
      const head = rootRef.current.closest('.menu-section')?.querySelector('.section-head')
      if (head) {
        const headerH = (document.getElementById('siteHeader') || {}).offsetHeight || 72
        if (head.getBoundingClientRect().top <= headerH + 8) {
          setTimeout(() => head.scrollIntoView({ behavior: smooth(), block: 'start' }), 420)
        }
      }
    }
  }

  return (
    <div ref={rootRef}>
      <ul className="dish-grid">
        {first.map((item, i) => <DishCard key={itemName(item)} item={item} staggerIndex={i} />)}
      </ul>
      {rest.length > 0 && (
        <>
          <div className={'dish-more' + (open ? ' is-open' : '') + (instant ? ' is-instant' : '')} id={'exp-' + listKey}>
            <ul className="dish-grid">
              {rest.map((item, i) => <DishCard key={itemName(item)} item={item} staggerIndex={i} />)}
            </ul>
          </div>
          <div className="dish-more-row">
            <button
              type="button"
              className="btn btn--ghost"
              aria-expanded={open}
              aria-controls={'exp-' + listKey}
              onClick={toggle}
            >
              {open ? 'Show less' : 'Show more'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
