import { useEffect } from 'react'
import { useCart } from '../context/CartContext.jsx'

export default function MobileCartBar() {
  const { totalQty, setOpen } = useCart()

  useEffect(() => {
    document.documentElement.classList.toggle('has-order-bar', totalQty > 0)
    return () => document.documentElement.classList.remove('has-order-bar')
  }, [totalQty])

  if (!totalQty) return null

  return (
    <div className="order-bar">
      <p>
        <strong>{totalQty}</strong> {totalQty === 1 ? 'item' : 'items'} in your order
      </p>
      <button type="button" onClick={() => setOpen(true)}>View cart</button>
    </div>
  )
}
