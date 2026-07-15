import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Cart.css'

// 1. Add the API URL variable at the top
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// 🧠 CONCEPT: Props coming down from App.jsx (lifted state)
//    cart = array of items, removeFromCart & clearCart = functions from App.jsx
function Cart({ cart, removeFromCart, clearCart }) {
    const [orderStatus, setOrderStatus] = useState(null) // 'success' | 'error' | null
    const [loading, setLoading] = useState(false)

    // Calculate total price from cart array
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const handlePlaceOrder = async () => {
        setLoading(true)
        setOrderStatus(null)

        // 🧠 CONCEPT: Sending a JWT token in the Authorization header
        //    The backend's auth middleware reads this header and identifies the user
        //    Format is always: "Bearer <token>"
        const token = localStorage.getItem('token')

        try {
            // 2. Use the new API_URL variable here (notice the backticks!)
            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // ← this is how we prove we're logged in
                },
                body: JSON.stringify({
                    // Backend expects: { items: [{ menuItem: id, quantity: number }] }
                    items: cart.map(item => ({
                        menuItem: item._id,
                        quantity: item.quantity
                    }))
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Failed to place order')
            }

            // ✅ Order placed successfully!
            setOrderStatus('success')
            clearCart() // empty the cart in App.jsx state

        } catch (err) {
            setOrderStatus('error')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Empty cart state
    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-empty">
                    <span className="cart-empty-icon">🛒</span>
                    <h2>Your cart is empty</h2>
                    <p>Add some items from the menu to get started!</p>
                    <Link to="/menu" className="cart-menu-link">Browse Menu</Link>
                </div>

                {/* Show success message even after cart clears */}
                {orderStatus === 'success' && (
                    <div className="order-success">
                        <span>✅</span>
                        <div>
                            <strong>Order Placed!</strong>
                            <p>Check your <Link to="/orders">My Orders</Link> page to see it.</p>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="cart-page">
            <div className="cart-header">
                <h1>Your Cart</h1>
                <p>{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
            </div>

            {orderStatus === 'error' && (
                <div className="order-error">
                    ❌ Something went wrong placing your order. Please try again.
                </div>
            )}

            <div className="cart-layout">
                <div className="cart-items">
                    {cart.map(item => (
                        <div key={item._id} className="cart-item">
                            <div className="cart-item-info">
                                <h3>{item.name}</h3>
                                <span className="cart-item-category">{item.category}</span>
                            </div>
                            <div className="cart-item-controls">
                                <span className="cart-item-qty">× {item.quantity}</span>
                                <span className="cart-item-price">
                                   ₹{item.price * item.quantity}
                                </span>
                                <button
                                    className="cart-remove-btn"
                                    onClick={() => removeFromCart(item._id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h2>Order Summary</h2>
                    <div className="cart-total-row">
                        <span>Total</span>
                        <span className="cart-total-price">₹{total}</span>
                    </div>
                    <button
                        className="place-order-btn"
                        onClick={handlePlaceOrder}
                        disabled={loading}
                    >
                        {loading ? 'Placing Order...' : '☕ Place Order'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Cart
