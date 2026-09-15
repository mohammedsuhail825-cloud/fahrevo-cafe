import { useEffect, useState } from 'react'

/* lights the nav link of whichever section is in view */
export default function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) setActive(en.target.id) })
    }, { rootMargin: '-42% 0px -52% 0px' })
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) spy.observe(el)
    })
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        setActive('contact')
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => { spy.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [ids])
  return active
}