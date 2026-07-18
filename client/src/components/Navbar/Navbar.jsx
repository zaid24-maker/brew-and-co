import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

function Navbar({ cart }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn, isAdmin, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-left">
        <div className="navbar-logo">
          <Link to="/">Brew &amp; Co</Link>
        </div>
        <div className="navbar-cart">
          <Link to="/cart" aria-label={`Cart, ${cart.length} item${cart.length !== 1 ? 's' : ''}`}>
            <span aria-hidden="true">🛒</span> {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </Link>
        </div>
      </div>

      <ul className="navbar-links">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/menu" className={location.pathname === '/menu' ? 'active' : ''}>
            Menu
          </Link>
        </li>
        <li>
          <Link to="/reservations" className={location.pathname === '/reservations' ? 'active' : ''}>
            Reservations
          </Link>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>
                My Orders
              </Link>
            </li>
            {/* 🧠 CONCEPT: Admin link only visible when isAdmin is true in context */}
            {isAdmin && (
              <li>
                <Link to="/admin" className={`admin-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                  ⚙️ Admin
                </Link>
              </li>
            )}
            <li>
              <button onClick={handleLogout} className="logout-btn" aria-label="Log out of your account">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar