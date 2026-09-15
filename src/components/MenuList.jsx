import { useEffect, useRef, useState } from 'react'
import { PREVIEW } from '../data/menu.js'
import { useCart } from '../context/CartContext.jsx'

const smooth = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth')
const itemName = item => (typeof item === 'string' ? item : item.name)
const itemImg = item => (typeof item === 'string' ? null : item.img)
const hideImg = e => { e.currentTarget.style.display = 'none' }

export default function MenuList({ items, listKey, tabId, isSearch = false, onJump, focusName, onFocused }) {
  const [open, setOpen] = useState(false)
  const [instant, setInstant] = useState(false)
  const rootRef = useRef(null)
  const { addItem } = useCart()

  const count = isSearch ? 5 : PREVIEW
  const first = items.slice(0, count)
  const rest = items.slice(count)

  useEffect(() => {
    if (!focusName) return
    const li = Array.from(rootRef.current.querySelectorAll('.mp-item'))
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusName])

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (!next) {
      const view = rootRef.current.closest('.mp-view')
      const sub = rootRef.current.closest('.mp-sub')
      const head = (sub && sub.querySelector('.cat-head')) || (view && view.querySelector('.mp-cat-head'))
      if (head) {
        const headerH = (document.getElementById('siteHeader') || {}).offsetHeight || 72
        const tabsH = (document.getElementById('menuTabs') || {}).offsetHeight || 44
        if (head.getBoundingClientRect().top <= headerH + tabsH + 8) {
          setTimeout(() => head.scrollIntoView({ behavior: smooth(), block: 'start' }), 580)
        }
      }
    }
  }

  const renderItem = (item, i, stagger) => {
    const name = itemName(item)
    const img = itemImg(item)
    const style = stagger ? { '--i': i } : undefined

    if (isSearch) {
      return (
        <li className="mp-item mp-item--photo" key={name + '-' + i} style={style} data-name={name}>
          <a href="#full-menu" onClick={e => { e.preventDefault(); if (onJump) onJump(tabId, name) }}>
            {img && (
              <span className="mi-photo">
                <img src={img} alt="" loading="lazy" decoding="async" onError={hideImg} />
              </span>
            )}
            <span className="mi-name">{name}</span>
          </a>
        </li>
      )
    }

    return (
      <li className="mp-item mp-item--photo" key={name + '-' + i} style={style} data-name={name}>
        {img && (
          <span className="mi-photo">
            <img src={img} alt={name} loading="lazy" decoding="async" onError={hideImg} />
          </span>
        )}
        <span className="mi-body">
          <span className="mi-name">{name}</span>
          <button type="button" className="mi-add" aria-label={`Add ${name} to cart`} onClick={() => addItem(name)}>
            Add
          </button>
        </span>
      </li>
    )
  }

  return (
    <div ref={rootRef}>
      <ul className="mp-items mp-items--photos">{first.map((n, i) => renderItem(n, i, false))}</ul>
      {rest.length > 0 && (
        <>
          <div className={'mp-expand' + (open ? ' is-open' : '') + (instant ? ' is-instant' : '')} id={'exp-' + listKey}>
            <div className="mp-expand-clip" aria-hidden={!open}>
              <ul className="mp-items mp-items--photos">{rest.map((n, i) => renderItem(n, i, true))}</ul>
            </div>
          </div>
          <div className="mp-more-row">
            <button
              type="button"
              className={'mp-toggle' + (open ? ' is-open' : '')}
              aria-expanded={open}
              aria-controls={'exp-' + listKey}
              onClick={toggle}
            >
              <span>{open ? 'Show Less' : 'Show More'}</span>
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.5v11M3.5 9 8 13.5 12.5 9"/></svg>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
