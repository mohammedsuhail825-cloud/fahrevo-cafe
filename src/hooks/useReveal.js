import { useEffect, useRef } from 'react'

export default function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('is-in')
        io.disconnect()
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -36px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}