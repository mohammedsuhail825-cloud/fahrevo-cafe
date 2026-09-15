const WORDS = ['Desserts', 'Kinder Bueno', 'Kinder Crunch', 'Fahrévo']

function MarqueeSet() {
  return (
    <div className="marquee-set">
      {[0, 1, 2].flatMap(rep =>
        WORDS.flatMap((w, i) => [
          <span key={rep + '-' + i + '-w'}>{w}</span>,
          <i key={rep + '-' + i + '-d'}></i>,
        ])
      )}
    </div>
  )
}

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <MarqueeSet />
        <MarqueeSet />
      </div>
    </div>
  )
}
