import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, lazy, Suspense } from 'react'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

// 🧠 CONCEPT: lazy() splits each page into its own JS chunk.
//    The chunk only downloads when the user navigates to that route.
const Home = lazy(() => import('./pages/Home'))
const Menu = lazy(() => import('./pages/Menu'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Cart = lazy(() => import('./pages/Cart'))
const Orders = lazy(() => import('./pages/Orders'))
const Reservations = lazy(() => import('./pages/Reservations'))
const Admin = lazy(() => import('./pages/Admin'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  const [cart, setCart] = useState([])
  const { isAdmin } = useAuth()

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
        <Suspense fallback={
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #C19A6B', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        }>
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

            <Route path="/reservations" element={<Reservations />} />

            {/* Admin — protected by reactive isAdmin from AuthContext */}
            <Route path="/admin" element={
              isAdmin
                ? <Admin />
                : <Navigate to="/" replace />
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App




