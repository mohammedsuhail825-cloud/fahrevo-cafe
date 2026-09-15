import { memo } from 'react'

/* memoized: nav and tab labels are stable strings, so the letter stacks
   are built once and never rebuilt when a parent re-renders */
function RollingTextBase({ text }) {
  let i = 0
  return (
    <span aria-hidden="true">
      {text.split('').map((ch, idx) => {
        if (ch === ' ') return <span key={idx} className="ch ch--space"></span>
        const n = i++
        return (
          <span key={idx} className="ch">
            <span className="stack" style={{ '--i': n }}>
              <span>{ch}</span>
              <span>{ch}</span>
            </span>
          </span>
        )
      })}
    </span>
  )
}

export default memo(RollingTextBase)