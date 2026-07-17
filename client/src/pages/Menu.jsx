import { useState, useEffect } from 'react'
import MenuItemCard from '../components/MenuItemCard/MenuItemCard'
import './Menu.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const CATEGORIES = ['ALL', 'Hot Drinks', 'Cold Drinks', 'Pastries', 'Snacks']

const CATEGORY_EMOJIS = {
  ALL: '☕',
  'Hot Drinks': '🔥',
  'Cold Drinks': '🧊',
  Pastries: '🥐',
  Snacks: '🍪',
}

function Menu({ addToCart }) {
  const [menu, setMenu] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    const url =
      selectedCategory === 'ALL'
        ? `${API_URL}/api/menu`
        : `${API_URL}/api/menu?category=${selectedCategory}`

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load menu')
        return res.json()
      })
      .then((data) => {
        setMenu(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [selectedCategory])

  return (
    <main className="menu-page">

      {/* ── Hero ── */}
      <section className="menu-hero">
        {/* Floating particles */}
        <div className="menu-particles">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="menu-particle" />
          ))}
        </div>

        <div className="menu-hero__content">
          <p className="menu-tagline">☕ Handcrafted with love</p>
          <h1>Our Menu</h1>
          <p className="menu-subtitle">Crafted with care, served with passion</p>
        </div>
      </section>

      {/* ── Category Filters ── */}
      <section className="filter-section" aria-label="Filter menu by category">
        <div className="filter-buttons">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
            >
              <span className="filter-emoji">{CATEGORY_EMOJIS[category]}</span>
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* ── Menu Grid ── */}
      <section className="menu-content">
        {loading && (
          <div className="menu-loading" aria-live="polite">
            <div className="loading-spinner"></div>
            <p>Brewing your menu...</p>
          </div>
        )}

        {error && (
          <div className="menu-error" role="alert">
            <p>⚠️ {error}</p>
            <button onClick={() => setSelectedCategory(selectedCategory)}>Try Again</button>
          </div>
        )}

        {!loading && !error && menu.length === 0 && (
          <div className="menu-empty">
            <p>☕ No items found in this category.</p>
          </div>
        )}

        {!loading && !error && menu.length > 0 && (
          <div className="menu-grid">
            {menu.map((item) => (
              <MenuItemCard
                key={item._id}
                name={item.name}
                price={item.price}
                category={item.category}
                item={item}
                addToCart={addToCart}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Menu