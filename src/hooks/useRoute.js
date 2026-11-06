import { useEffect, useState } from 'react'

const readRoute = () => {
  const raw = window.location.pathname.replace(/\/+$/, '') || '/'
  return {
    path: raw === '/index.html' ? '/' : raw,
    hash: window.location.hash,
  }
}

export default function useRoute() {
  const [route, setRoute] = useState(readRoute)

  useEffect(() => {
    const sync = () => setRoute(readRoute())
    const onClick = event => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target.closest('a[href]')
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return
      const url = new URL(link.href)
      if (url.origin !== window.location.origin) return
      event.preventDefault()
      const next = url.pathname + url.search + url.hash
      const here = window.location.pathname + window.location.search + window.location.hash
      if (next !== here) window.history.pushState(null, '', next)
      sync()
    }
    window.addEventListener('popstate', sync)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('popstate', sync)
      document.removeEventListener('click', onClick)
    }
  }, [])

  return route
}
