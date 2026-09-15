import { useState } from 'react'
import { CartProvider } from './context/CartContext.jsx'
import Intro from './components/Intro.jsx'
import Header from './components/Header.jsx'
import Hero from './components/hero.jsx'
import MenuSection from './components/MenuSection.jsx'
import About from './components/About.jsx'
import Marquee from './components/Marquee.jsx'
import Order from './components/Order.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Cart from './components/Cart.jsx'

export default function App() {
  const [activeTab, setActiveTab] = useState('desserts')

  return (
    <CartProvider>
      <Intro />
      <Header />
      <main id="main">
        <Hero />
        <MenuSection activeTab={activeTab} onTabChange={setActiveTab} />
        <About />
        <Marquee />
        <Order />
        <Contact />
      </main>
      <Footer />
      <Cart />
    </CartProvider>
  )
}
