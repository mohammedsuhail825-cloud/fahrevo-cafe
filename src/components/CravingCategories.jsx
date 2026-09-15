import { useState } from 'react'
import Reveal from './Reveal.jsx'

const TILES = [
  { tab: 'cafe', label: 'Cafe', icon: (
    <svg className="craving-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M11 21h22v6.2c0 5.6-4.4 9.8-10 9.8h-2c-5.6 0-10-4.2-10-9.8V21Z"/>
      <path d="M33 23.4h2.4c2.3 0 3.8 1.5 3.8 3.5s-1.5 3.5-3.8 3.5H33"/>
      <path d="M10 41.5h24"/>
      <path d="M18.5 15.8c1.3-1.5 1.3-3.1 0-4.6"/>
      <path d="M26.5 15.8c1.3-1.5 1.3-3.1 0-4.6"/>
    </svg>) },
  { tab: 'pizza', label: 'Pizza', icon: (
    <svg className="craving-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M9 13.5Q24 5.5 39 13.5L24 42.5Z"/>
      <circle cx="19" cy="19.5" r="2.3"/><circle cx="28.8" cy="21.5" r="2.3"/><circle cx="23.8" cy="29.5" r="2.3"/>
    </svg>) },
  { tab: 'fast-food', label: 'Fast Food', icon: (
    <svg className="craving-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M9.5 20c0-7.2 6.5-11 14.5-11s14.5 3.8 14.5 11"/>
      <circle cx="17" cy="15" r="1.1"/><circle cx="24" cy="13.5" r="1.1"/><circle cx="31" cy="15" r="1.1"/>
      <path d="M10 25.5h28"/>
      <path d="M10 30.5c3 2.2 6-2.2 9 0s6 2.2 9 0 6 2.2 10 0"/>
      <path d="M9.5 35.5c1.3 3.2 7.3 5 14.5 5s13.2-1.8 14.5-5"/>
    </svg>) },
  { tab: 'shake', label: 'Shakes', icon: (
    <svg className="craving-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M15.5 11h17l-2.7 30H18.2L15.5 11Z"/>
      <path d="M17.8 11c0-3.4 2.8-6.2 6.2-6.2s6.2 2.8 6.2 6.2"/>
      <path d="M29 10l4-6.5"/>
    </svg>) },
  { tab: 'beverages', label: 'Beverages', icon: (
    <svg className="craving-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M15.5 13.5h17l-2.4 27H17.9L15.5 13.5Z"/>
      <path d="M13.5 13.5h21"/>
      <path d="M26 13.5l3-7.5"/>
      <circle cx="21.5" cy="24" r="1.2"/><circle cx="25" cy="31.5" r="1.2"/>
    </svg>) },
  { tab: 'sides', label: 'Sides', icon: (
    <svg className="craving-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M14 21h20l-3 19H17l-3-19Z"/>
      <path d="M18.5 21v-9M24 21V8M29.5 21v-9"/>
    </svg>) },
  { tab: 'starters', label: 'Starters', icon: (
    <svg className="craving-icon" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="29" cy="18" r="10"/>
      <path d="M22 25 13.5 33.5"/>
      <circle cx="10.5" cy="33" r="2.4"/>
      <circle cx="14" cy="38.5" r="2.4"/>
    </svg>) },
  { tab: 'sandwiches', label: 'Sandwiches', icon: (
    <svg className="craving-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M12 23c0-6.5 5.5-10 12-10s12 3.5 12 10"/>
      <path d="M12 28h24"/>
      <path d="M14 35c1.5 2.5 6 4 10 4s8.5-1.5 10-4"/>
    </svg>) },
  { tab: 'wraps', label: 'Wraps', icon: (
    <svg className="craving-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M15 18h18l-6 24h-6L15 18Z"/>
      <path d="M18 18c.5-3 2.5-4.5 5-4.5M26 13.5c2.5 0 4.5 1.5 5 4.5"/>
    </svg>) },
  { tab: 'burgers', label: 'Burgers', icon: (
    <svg className="craving-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M9.5 14c0-6 6-9.5 14.5-9.5S38.5 8 38.5 14"/>
      <path d="M10 17h28"/>
      <path d="M10 22c3 2.2 6-2.2 9 0s6 2.2 9 0 6-2.2 10 0"/>
      <path d="M10 27h28"/>
      <path d="M9.5 32c1.3 3.2 7.3 5 14.5 5s13.2-1.8 14.5-5"/>
    </svg>) },
  { tab: 'pasta', label: 'Pasta', icon: (
    <svg className="craving-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M9 27h30c-1 7.5-7 12-15 12S10 34.5 9 27Z"/>
      <path d="M16 26c-3-3 3-6 0-12M24 26c-3-3 3-6 0-12M32 26c-3-3 3-6 0-12"/>
    </svg>) },
  { tab: 'salads', label: 'Salads', icon: (
    <svg className="craving-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M9 27h30c-1 7.5-7 12-15 12S10 34.5 9 27Z"/>
      <path d="M24 8c6 3 7 10 2 15-5-2-6-10-2-15Z"/>
      <path d="M24 12v8"/>
    </svg>) },
  { tab: 'noodles', label: 'Noodles', icon: (
    <svg className="craving-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M9 27h30c-1 7.5-7 12-15 12S10 34.5 9 27Z"/>
      <path d="M17 22 38 6M31 22 12 6"/>
    </svg>) },
  { tab: 'desserts', label: 'Desserts', icon: (
    <svg className="craving-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M16 26h16l-2.5 14h-11L16 26Z"/>
      <path d="M14 26a10 9 0 0 1 20 0"/>
      <circle cx="24" cy="16" r="2.4"/>
    </svg>) },
  { tab: 'ice-cream', label: 'Ice Cream', icon: (
    <svg className="craving-icon" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M18 22h12l-6 20-6-20Z"/>
      <circle cx="24" cy="14" r="8"/>
    </svg>) },
]

const VISIBLE_COUNT = 6

export default function CravingCategories({ onSelect }) {
  const [open, setOpen] = useState(false)
  const visible = TILES.slice(0, VISIBLE_COUNT)
  const hidden = TILES.slice(VISIBLE_COUNT)

  return (
    <section className="section section--wide" aria-label="Craving categories">
      <Reveal as="header" className="section-head">
        <p className="sec-mark"><i className="d"></i><span>01</span><i className="d"></i></p>
        <h2>What are you craving?</h2>
      </Reveal>

      <nav className="cravings-row" aria-label="Craving categories">
        {visible.map((t, i) => (
          <Reveal
            as="a"
            key={t.tab}
            className="craving"
            href="#menu-tabs"
            delay={(0.05 + i * 0.05).toFixed(2) + 's'}
            onClick={e => { e.preventDefault(); onSelect(t.tab) }}
          >
            {t.icon}
            <span className="craving-label">{t.label}</span>
          </Reveal>
        ))}
      </nav>

      <div className={'cravings-extra' + (open ? ' is-open' : '')}>
        <div className="cravings-clip">
          <div className="cravings-clip-inner" aria-hidden={!open}>
            <div className="cravings-row cravings-row--extra" id="cravingsExtra">
              {hidden.map((t, i) => (
                <a
                  key={t.tab}
                  className="craving"
                  href="#menu-tabs"
                  style={{ '--i': i }}
                  onClick={e => { e.preventDefault(); onSelect(t.tab) }}
                >
                  {t.icon}
                  <span className="craving-label">{t.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="cravings-more-row">
          <button
            type="button"
            className={'cravings-toggle' + (open ? ' is-open' : '')}
            aria-expanded={open}
            aria-controls="cravingsExtra"
            onClick={() => setOpen(o => !o)}
          >
            <span>{open ? 'View Less' : 'View More'}</span>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.5v11M3.5 9 8 13.5 12.5 9"/></svg>
          </button>
        </div>
      </div>
    </section>
  )
}