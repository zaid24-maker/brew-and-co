import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  const [cart, setCart] = useState([])

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id)
      if (existing) {
        return prev.map(i =>
          i._id === item._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i._id !== itemId))
  }

  const clearCart = () => setCart([])

  return (
    <BrowserRouter>
      <Navbar cart={cart} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu addToCart={addToCart} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🧠 CONCEPT: ProtectedRoute wraps routes that need login
              If not logged in → redirect to /login
              If logged in → show the page */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App




