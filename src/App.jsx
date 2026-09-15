import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import ShopPage from './pages/ShopPage'
import AboutPage from './pages/AboutPage'
import ShippingPage from './pages/ShippingPage'
import ContactPage from './pages/ContactPage'
import FaqPage from './pages/FaqPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="shipping-returns" element={<ShippingPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="terms-of-service" element={<TermsPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-confirmed" element={<OrderConfirmationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
