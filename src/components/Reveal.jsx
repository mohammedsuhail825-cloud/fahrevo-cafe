import useReveal from '../hooks/useReveal.js'

export default function Reveal({ as: Tag = 'div', delay, className = '', children, ...rest }) {
  const ref = useReveal()
  const style = { ...(delay ? { '--d': delay } : {}), ...(rest.style || {}) }
  const { style: _drop, ...forward } = rest
  return (
    <Tag ref={ref} className={className} data-reveal="" style={style} {...forward}>
      {children}
    </Tag>
  )
}