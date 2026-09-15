import { useEffect } from 'react'
import { useCart } from '../context/CartContext.jsx'

export default function Cart() {
  const {
    items, open, setOpen, setQty, removeItem, totalQty, whatsappUrl,
    customerName, setCustomerName, customerPhone, setCustomerPhone,
    address, setAddress, locStatus, locError, requestAddress,
  } = useCart()

  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.documentElement.classList.add('cart-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('cart-open')
    }
  }, [open, setOpen])

  const canOrder = items.length > 0

  return (
    <>
      <div
        className={'cart-backdrop' + (open ? ' is-open' : '')}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <aside
        className={'cart-drawer' + (open ? ' is-open' : '')}
        id="cartDrawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!open}
      >
        <header className="cart-head">
          <h2 className="cart-title">Your Order</h2>
          <button type="button" className="cart-close" aria-label="Close cart" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg>
          </button>
        </header>

        <div className="cart-body">
          {items.length === 0 ? (
            <p className="cart-empty">Your cart is empty. Add something from the menu.</p>
          ) : (
            <ul className="cart-list">
              {items.map(item => (
                <li className="cart-row" key={item.name}>
                  <div className="cart-row-top">
                    <span className="cart-name">{item.name}</span>
                    <button type="button" className="cart-remove" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.name)}>
                      Remove
                    </button>
                  </div>
                  <div className="cart-qty">
                    <button type="button" aria-label={`Decrease ${item.name}`} onClick={() => setQty(item.name, item.qty - 1)}>−</button>
                    <span aria-live="polite">{item.qty}</span>
                    <button type="button" aria-label={`Increase ${item.name}`} onClick={() => setQty(item.name, item.qty + 1)}>+</button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="cart-details">
            <p className="cart-details-label">Delivery details</p>
            <label className="cart-field">
              <span>Name</span>
              <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Your name" autoComplete="name" />
            </label>
            <label className="cart-field">
              <span>Phone</span>
              <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="Your phone number" autoComplete="tel" />
            </label>
            <label className="cart-field">
              <span>Address</span>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder={locStatus === 'loading' ? 'Detecting your location…' : 'Delivery address'}
                rows={3}
              />
            </label>
            <div className="cart-loc-row">
              <button type="button" className="cart-loc-btn" onClick={() => requestAddress()} disabled={locStatus === 'loading'}>
                {locStatus === 'loading' ? 'Detecting…' : 'Use my location'}
              </button>
              {locStatus === 'ready' && <span className="cart-loc-ok">Address filled</span>}
              {locStatus === 'error' && <span className="cart-loc-err">{locError}</span>}
            </div>
          </div>
        </div>

        <footer className="cart-foot">
          <div className="cart-totals">
            <div className="cart-total-row">
              <span>Subtotal</span>
              <span>{totalQty} item{totalQty === 1 ? '' : 's'}</span>
            </div>
            <div className="cart-total-row cart-total-row--grand">
              <span>Total</span>
              <span>{totalQty} item{totalQty === 1 ? '' : 's'}</span>
            </div>
          </div>
          <a
            className={'btn btn--solid cart-wa' + (!canOrder ? ' is-disabled' : '')}
            href={canOrder ? whatsappUrl : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!canOrder}
            onClick={e => { if (!canOrder) e.preventDefault() }}
          >
            <span>Share order on WhatsApp</span>
            <svg className="btn-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 8h12M9.5 3.5 14 8l-4.5 4.5"/></svg>
          </a>
        </footer>
      </aside>
    </>
  )
}
