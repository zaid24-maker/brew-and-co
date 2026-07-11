import { useState, useEffect } from 'react'
import './Orders.css'

// 🧠 CONCEPT: Fetching protected data from the backend
//    This page calls GET /api/orders/myorders
//    The backend's auth middleware checks the JWT to know WHICH user's orders to return
function Orders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')

        // 🧠 CONCEPT: Authorization header tells the server "this is ME"
        //    Without it, the server returns 401 Unauthorized
        fetch('http://localhost:5000/api/orders/myorders', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to load orders')
                return res.json()
            })
            .then(data => {
                setOrders(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, []) // empty array = runs once when the component mounts

    if (loading) {
        return (
            <div className="orders-page">
                <div className="orders-loading">Loading your orders...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="orders-page">
                <div className="orders-error">❌ {error}</div>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="orders-page">
                <div className="orders-empty">
                    <span>📦</span>
                    <h2>No orders yet</h2>
                    <p>Head to the menu and place your first order!</p>
                </div>
            </div>
        )
    }

    return (
        <div className="orders-page">
            <div className="orders-header">
                <h1>My Orders</h1>
                <p>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
            </div>

            <div className="orders-list">
                {orders.map(order => (
                    <div key={order._id} className="order-card">
                        <div className="order-card-header">
                            <div>
                                <span className="order-id">Order #{order._id.slice(-6).toUpperCase()}</span>
                                <span className="order-date">
                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </span>
                            </div>
                            {/* Status badge — color changes based on status */}
                            <span className={`order-status order-status--${order.status}`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="order-items">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="order-item-row">
                                    <span>{item.menuItem?.name || 'Item'}</span>
                                    <span>× {item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="order-total">
                            Total: <strong>₹{order.totalPrice}</strong>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Orders
