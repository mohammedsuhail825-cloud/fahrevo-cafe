import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SITE } from '../data/site.js'

const CartContext = createContext(null)

async function reverseGeocode(lat, lng) {
  const url =
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('Could not resolve address')
  const data = await res.json()
  return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
}

function detectAddress() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Location is not supported on this device'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const label = await reverseGeocode(latitude, longitude)
          resolve({
            label,
            mapsUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
          })
        } catch {
          resolve({
            label: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
            mapsUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
          })
        }
      },
      (err) => {
        const msg =
          err.code === 1 ? 'Location permission denied'
            : err.code === 2 ? 'Location unavailable'
              : 'Could not get location'
        reject(new Error(msg))
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    )
  })
}

// Fahrévo OS order inbox. Local demo: the OS runs on this machine; set VITE_FAHREVO_OS_URL when deployed.
const OS_URL = (import.meta.env.VITE_FAHREVO_OS_URL || 'http://localhost:3100').replace(/\/$/, '')

function buildWhatsappUrl({ items, ref, customerName, customerPhone, address, mapsUrl }) {
  if (!items.length) return `https://wa.me/${SITE.whatsapp}`
  const lines = [
    ref ? `Hi! I've placed order ${ref} at ${SITE.name}:` : `Hi! I'd like to place an order at ${SITE.name}:`,
    '',
    '— Order —',
    ...items.map(x => `• ${x.name} × ${x.qty}`),
    '',
    `Total items: ${items.reduce((a, x) => a + x.qty, 0)}`,
    '',
    '— Delivery details —',
    `Name: ${customerName.trim() || '—'}`,
    `Phone: ${customerPhone.trim() || '—'}`,
    `Address: ${address.trim() || '—'}`,
  ]
  if (mapsUrl) lines.push(`Location: ${mapsUrl}`)
  lines.push('', ref ? 'Please share the payment details. Thank you!' : 'Please confirm availability. Thank you!')
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [address, setAddress] = useState('')
  const [mapsUrl, setMapsUrl] = useState('')
  const [locStatus, setLocStatus] = useState('idle')
  const [locError, setLocError] = useState('')

  const addItem = useCallback((name) => {
    setItems(prev => {
      const i = prev.findIndex(x => x.name === name)
      if (i === -1) return [...prev, { name, qty: 1 }]
      return prev.map((x, idx) => idx === i ? { ...x, qty: x.qty + 1 } : x)
    })
    setOpen(true)
  }, [])

  const setQty = useCallback((name, qty) => {
    const n = Math.max(0, Math.floor(Number(qty) || 0))
    setItems(prev => {
      if (n <= 0) return prev.filter(x => x.name !== name)
      return prev.map(x => x.name === name ? { ...x, qty: n } : x)
    })
  }, [])

  const removeItem = useCallback((name) => {
    setItems(prev => prev.filter(x => x.name !== name))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const requestAddress = useCallback(async () => {
    setLocStatus('loading')
    setLocError('')
    try {
      const result = await detectAddress()
      setAddress(result.label)
      setMapsUrl(result.mapsUrl)
      setLocStatus('ready')
      return result
    } catch (err) {
      setLocStatus('error')
      setLocError(err.message || 'Could not get location')
      return null
    }
  }, [])

  useEffect(() => {
    if (!open || !items.length) return
    if (address || locStatus === 'loading' || locStatus === 'ready') return
    requestAddress()
  }, [open, items.length, address, locStatus, requestAddress])

  const totalQty = useMemo(() => items.reduce((a, x) => a + x.qty, 0), [items])

  const whatsappUrl = useMemo(
    () => buildWhatsappUrl({ items, ref: '', customerName, customerPhone, address, mapsUrl }),
    [items, customerName, customerPhone, address, mapsUrl],
  )

  // Send the order to Fahrévo OS first (it shows up live on the kitchen board), then hand the
  // customer to WhatsApp with the order code. If the OS can't be reached, WhatsApp still works.
  const [placing, setPlacing] = useState(false)
  const placeOrder = useCallback(async () => {
    setPlacing(true)
    let ref = ''
    try {
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), 6000)
      const res = await fetch(`${OS_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(x => ({ name: x.name, qty: x.qty })),
          customer: { name: customerName, phone: customerPhone, address, mapsUrl },
        }),
        signal: ctrl.signal,
      })
      clearTimeout(timer)
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) ref = data.ref
    } catch {
      // OS offline — fall back to the plain WhatsApp order
    }
    setPlacing(false)
    const url = buildWhatsappUrl({ items, ref, customerName, customerPhone, address, mapsUrl })
    if (ref) setItems([])
    return { ref, url }
  }, [items, customerName, customerPhone, address, mapsUrl])

  const value = useMemo(() => ({
    items, open, setOpen, addItem, setQty, removeItem, clear, totalQty, whatsappUrl, placeOrder, placing,
    customerName, setCustomerName, customerPhone, setCustomerPhone,
    address, setAddress, mapsUrl, locStatus, locError, requestAddress,
  }), [
    items, open, addItem, setQty, removeItem, clear, totalQty, whatsappUrl, placeOrder, placing,
    customerName, customerPhone, address, mapsUrl, locStatus, locError, requestAddress,
  ])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
