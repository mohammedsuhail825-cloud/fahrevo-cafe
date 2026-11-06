import { useEffect, useState } from 'react'
import { CartProvider } from './context/CartContext.jsx'
import useRoute from './hooks/useRoute.js'
import Header from './components/Header.jsx'
import Hero from './components/hero.jsx'
import MenuSection from './components/MenuSection.jsx'
import Order from './components/Order.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import MobileCartBar from './components/MobileCartBar.jsx'
import Cart from './components/Cart.jsx'

const smooth = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth')

export default function App() {
  const route = useRoute()
  const page = route.path === '/menu' ? 'menu' : 'home'
  const [activeTab, setActiveTab] = useState('desserts')

  useEffect(() => {
    const id = route.hash.replace('#', '')
    if (!id || id === 'home') {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }
    const target = document.getElementById(id)
    if (target) target.scrollIntoView({ behavior: smooth(), block: 'start' })
    else window.scrollTo({ top: 0, behavior: 'auto' })
  }, [route.path, route.hash])

  return (
    <CartProvider>
      <Header page={page} />
      <main id="main" className={page === 'menu' ? 'page-menu' : undefined}>
        {page === 'menu' ? (
          <MenuSection activeTab={activeTab} onTabChange={setActiveTab} />
        ) : (
          <>
            <Hero />
            <Order />
          </>
        )}
      </main>
      <div className="closing">
        {page === 'home' && <Contact />}
        <Footer />
      </div>
      <MobileCartBar />
      <Cart />
    </CartProvider>
  )
}
