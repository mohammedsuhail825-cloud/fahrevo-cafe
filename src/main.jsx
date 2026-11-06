import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

document.documentElement.classList.add('js')

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

// PWA: register the service worker in production builds only (keeps dev hot-reload clean).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}))
}
