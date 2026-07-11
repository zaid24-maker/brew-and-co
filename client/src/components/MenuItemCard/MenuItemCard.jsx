import './MenuItemCard.css'

function MenuItemCard({ name, price, category, item, addToCart }) {
  return (
    <div className="menu-card">
      <div className="menu-card-emoji">☕</div>
      <h2>{name}</h2>
      <p className="category">{category}</p>
      <p className="price">₹{price}</p>
      <button
        className="add-btn"
        onClick={() => addToCart(item)}
      >
        Add to Cart
      </button>
    </div>
  )
}

export default MenuItemCard