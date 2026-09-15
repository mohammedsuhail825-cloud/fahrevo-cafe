/* Static mode: no intro. The logo renders in its normal top-left
   header position from the first frame. The only job left is to signal
   the hero (which no longer animates) and disarm any legacy arming. */
import { useEffect } from 'react'

export default function Intro() {
  useEffect(() => {
    document.documentElement.classList.remove('intro-pending')
    window.dispatchEvent(new Event('cravings:intro-done'))
  }, [])
  return null
}