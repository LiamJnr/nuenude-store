import { useState } from 'react'
import { Outlet } from 'react-router'
import CartDrawer from './CartDrawer'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="site-shell">
      <Header onOpenCart={() => setCartOpen(true)} />
      <main className="page-content"><Outlet /></main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
