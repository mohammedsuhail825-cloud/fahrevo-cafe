import { useCart } from '../context/CartContext.jsx'
import Reveal from './Reveal.jsx'

export default function Order() {
  const { setOpen, totalQty } = useCart()

  return (
    <section id="order" className="order">
      <div className="order-inner">
        <svg className="order-steam" viewBox="0 0 36 36" aria-hidden="true">
          <path d="M8 24c2-2.4 2-4.9 0-7.3"/>
          <path d="M18 28c2-2.4 2-4.9 0-7.3"/>
          <path d="M28 24c2-2.4 2-4.9 0-7.3"/>
        </svg>
        <Reveal as="p" className="sec-mark sec-mark--dark">
          <i className="d"></i><span>03</span><i className="d"></i>
        </Reveal>
        <Reveal as="h2" className="order-title" delay=".08s">
          Order from <em>Fahrévo</em>
        </Reveal>
        <Reveal className="order-actions" delay=".16s">
          <button type="button" className="btn btn--solid" onClick={() => setOpen(true)}>
            <span>{totalQty ? `View Cart (${totalQty})` : 'Open Cart'}</span>
            <svg className="btn-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 8h12M9.5 3.5 14 8l-4.5 4.5"/></svg>
          </button>
          <button type="button" className="btn btn--solid" onClick={() => setOpen(true)}>
            <span>Share order on WhatsApp</span>
            <svg className="btn-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 8h12M9.5 3.5 14 8l-4.5 4.5"/></svg>
          </button>
        </Reveal>
      </div>
    </section>
  )
}
