import { useState, useEffect } from 'react'
import MenuItemCard from '../components/MenuItemCard/MenuItemCard'


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Menu({ addToCart }) {
  const [menu, setMenu] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  useEffect(() => {
   
    const url = selectedCategory === 'ALL'
      ? `${API_URL}/api/menu`
      : `${API_URL}/api/menu?category=${selectedCategory}`

    fetch(url)
      .then(response => response.json())
      .then(data => setMenu(data))
      .catch(error => console.error('Error fetching menu:', error))
  }, [selectedCategory])
  
  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Crafted with love, served with passion</p>
      </div>

      <div className="filter-buttons">
        {['ALL', 'Hot Drinks', 'Cold Drinks', 'Pastries', 'Snacks'].map(category => (
          <button
            key={category}
            className={selectedCategory === category ? 'active' : ''}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>  
        ))}
      </div>

      <div className="menu-grid">
        {menu.map(item => (
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
    </div>
  )
}

export default Menu
