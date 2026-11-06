import { useCart } from '../context/CartContext.jsx'

const STEPS = [
  {
    n: '01',
    title: 'Ready',
    text: 'The station is cleared and made ready before your cake begins.',
  },
  {
    n: '02',
    title: 'Set',
    text: 'Only what this order needs is set out. Nothing extra stays on the bench.',
  },
  {
    n: '03',
    title: 'Make',
    text: 'Kinder Bueno or Kinder Crunch is assembled to order, slowly and with care.',
  },
  {
    n: '04',
    title: 'Seal',
    text: 'The cake is looked over, then closed and packed for the trip to you.',
  },
]

export default function Order() {
  const { setOpen, totalQty } = useCart()

  return (
    <section id="about" className="order" aria-label="How each Fahrévo dessert is made">
      <div className="order-inner">
        <header className="section-head">
          <p className="eyebrow">The kitchen</p>
          <h2>How each cake is made.</h2>
          <p className="order-lead">
            Fahrévo Cafe makes signature desserts to order in Mehdipatnam, Hyderabad. Every cake is handled with care from the first step.
          </p>
        </header>
        <ol className="steps" aria-label="From a clean station to a sealed cake">
          {STEPS.map(step => (
            <li key={step.n}>
              <svg className="step-cap" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 52C220 12 380 82 620 48C860 14 1040 74 1260 36C1340 22 1400 28 1440 34V90H0Z" />
              </svg>
              <div className="step-body">
                <span className="step-num">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
              <svg className="step-foot" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 52C220 12 380 82 620 48C860 14 1040 74 1260 36C1340 22 1400 28 1440 34V90H0Z" />
              </svg>
            </li>
          ))}
        </ol>
        <button type="button" className="btn btn--solid" onClick={() => setOpen(true)}>
          {totalQty ? `View cart (${totalQty})` : 'Open cart'}
        </button>
      </div>
    </section>
  )
}
