import { useState, useEffect, useCallback } from 'react'
import './Admin.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const CATEGORIES = ['Hot Drinks', 'Cold Drinks', 'Pastries', 'Snacks']

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
}

// ── Empty form state ──────────────────────────────────────
const emptyItem = { name: '', price: '', category: 'Hot Drinks', description: '', image: '' }

function Admin() {
    const [tab, setTab] = useState('dashboard') // 'dashboard' | 'orders' | 'menu'

    // ── Stats ──────────────────────────────────────────────
    const [stats, setStats] = useState(null)

    // ── Orders ─────────────────────────────────────────────
    const [orders, setOrders] = useState([])

    // ── Menu ───────────────────────────────────────────────
    const [menuItems, setMenuItems] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editItem, setEditItem] = useState(null) // null = add new
    const [form, setForm] = useState(emptyItem)
    const [formError, setFormError] = useState('')
    const [saving, setSaving] = useState(false)

    // ── Load data for current tab ──────────────────────────
    const loadStats = useCallback(async () => {
        const res = await fetch(`${API}/api/admin/stats`, { headers: authHeaders() })
        const data = await res.json()
        setStats(data)
    }, [])

    const loadOrders = useCallback(async () => {
        const res = await fetch(`${API}/api/admin/orders`, { headers: authHeaders() })
        const data = await res.json()
        setOrders(Array.isArray(data) ? data : [])
    }, [])

    const loadMenu = useCallback(async () => {
        const res = await fetch(`${API}/api/menu`)
        const data = await res.json()
        setMenuItems(Array.isArray(data) ? data : [])
    }, [])

    useEffect(() => {
        if (tab === 'dashboard') loadStats()
        if (tab === 'orders') loadOrders()
        if (tab === 'menu') loadMenu()
    }, [tab, loadStats, loadOrders, loadMenu])

    // ── Update order status ────────────────────────────────
    const updateStatus = async (orderId, status) => {
        await fetch(`${API}/api/admin/orders/${orderId}/status`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ status }),
        })
        setOrders(prev =>
            prev.map(o => (o._id === orderId ? { ...o, status } : o))
        )
    }

    // ── Menu modal helpers ─────────────────────────────────
    const openAdd = () => {
        setEditItem(null)
        setForm(emptyItem)
        setFormError('')
        setShowModal(true)
    }

    const openEdit = (item) => {
        setEditItem(item)
        setForm({
            name: item.name,
            price: item.price,
            category: item.category,
            description: item.description || '',
            image: item.image || '',
        })
        setFormError('')
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditItem(null)
        setForm(emptyItem)
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async (e) => {
        e.preventDefault()
        if (!form.name || !form.price || !form.category) {
            setFormError('Name, price and category are required.')
            return
        }
        setSaving(true)
        setFormError('')
        try {
            const url = editItem
                ? `${API}/api/menu/${editItem._id}`
                : `${API}/api/menu`
            const method = editItem ? 'PUT' : 'POST'
            const res = await fetch(url, {
                method,
                headers: authHeaders(),
                body: JSON.stringify({ ...form, price: Number(form.price) }),
            })
            if (!res.ok) {
                const err = await res.json()
                setFormError(err.message || 'Failed to save item.')
                return
            }
            closeModal()
            loadMenu()
        } catch {
            setFormError('Network error. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this menu item?')) return
        await fetch(`${API}/api/menu/${id}`, { method: 'DELETE', headers: authHeaders() })
        setMenuItems(prev => prev.filter(i => i._id !== id))
    }

    // ── STATUS badge color ─────────────────────────────────
    const statusClass = (s) =>
        s === 'completed' ? 'badge--green' : s === 'cancelled' ? 'badge--red' : 'badge--yellow'

    return (
        <div className="admin-page">
            {/* ── Sidebar ── */}
            <aside className="admin-sidebar">
                <div className="admin-brand">⚙️ Admin Panel</div>
                <nav className="admin-nav">
                    {[
                        { key: 'dashboard', label: '📊 Dashboard' },
                        { key: 'orders', label: '📦 Orders' },
                        { key: 'menu', label: '☕ Menu' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            className={`admin-nav__item ${tab === key ? 'admin-nav__item--active' : ''}`}
                            onClick={() => setTab(key)}
                        >
                            {label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* ── Main content ── */}
            <main className="admin-main">

                {/* ── DASHBOARD ── */}
                {tab === 'dashboard' && (
                    <section className="admin-section">
                        <h1 className="admin-heading">Dashboard</h1>
                        {stats ? (
                            <div className="stat-grid">
                                <StatCard icon="📦" label="Total Orders" value={stats.totalOrders} color="blue" />
                                <StatCard icon="💰" label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} color="green" />
                                <StatCard icon="☕" label="Menu Items" value={stats.menuItemCount} color="amber" />
                                <StatCard icon="⏳" label="Pending Orders" value={stats.pendingOrders} color="red" />
                            </div>
                        ) : (
                            <p className="admin-loading">Loading stats...</p>
                        )}
                    </section>
                )}

                {/* ── ORDERS ── */}
                {tab === 'orders' && (
                    <section className="admin-section">
                        <h1 className="admin-heading">All Orders</h1>
                        {orders.length === 0 ? (
                            <p className="admin-loading">No orders yet.</p>
                        ) : (
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Items</th>
                                            <th>Total</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order._id}>
                                                <td className="order-id">#{order._id.slice(-6).toUpperCase()}</td>
                                                <td>{order.user?.email || '—'}</td>
                                                <td>
                                                    {order.items.map(i => (
                                                        <span key={i._id} className="item-pill">
                                                            {i.menuItem?.name || 'Item'} ×{i.quantity}
                                                        </span>
                                                    ))}
                                                </td>
                                                <td>₹{order.totalPrice}</td>
                                                <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                                                <td>
                                                    <select
                                                        className={`status-select badge ${statusClass(order.status)}`}
                                                        value={order.status}
                                                        onChange={e => updateStatus(order._id, e.target.value)}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {/* ── MENU ── */}
                {tab === 'menu' && (
                    <section className="admin-section">
                        <div className="admin-section__header">
                            <h1 className="admin-heading">Menu Items</h1>
                            <button className="admin-add-btn" onClick={openAdd}>+ Add Item</button>
                        </div>

                        {menuItems.length === 0 ? (
                            <p className="admin-loading">No menu items found.</p>
                        ) : (
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Description</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {menuItems.map(item => (
                                            <tr key={item._id}>
                                                <td><strong>{item.name}</strong></td>
                                                <td><span className="cat-pill">{item.category}</span></td>
                                                <td>₹{item.price}</td>
                                                <td className="desc-cell">{item.description || '—'}</td>
                                                <td>
                                                    <div className="action-btns">
                                                        <button className="btn-edit" onClick={() => openEdit(item)}>Edit</button>
                                                        <button className="btn-delete" onClick={() => handleDelete(item._id)}>Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}
            </main>

            {/* ── Add / Edit Modal ── */}
            {showModal && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal__header">
                            <h2>{editItem ? 'Edit Item' : 'Add New Item'}</h2>
                            <button className="modal__close" onClick={closeModal}>✕</button>
                        </div>

                        <form onSubmit={handleSave} className="modal__form">
                            {formError && <div className="modal__error">{formError}</div>}

                            <div className="modal-row">
                                <div className="modal-group">
                                    <label>Name *</label>
                                    <input name="name" value={form.name} onChange={handleFormChange} placeholder="Cappuccino" required />
                                </div>
                                <div className="modal-group">
                                    <label>Price (₹) *</label>
                                    <input name="price" type="number" value={form.price} onChange={handleFormChange} placeholder="250" required />
                                </div>
                            </div>

                            <div className="modal-group">
                                <label>Category *</label>
                                <select name="category" value={form.category} onChange={handleFormChange}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="modal-group">
                                <label>Description</label>
                                <textarea name="description" value={form.description} onChange={handleFormChange} rows={2} placeholder="A short description..." />
                            </div>

                            <div className="modal-group">
                                <label>Image URL</label>
                                <input name="image" value={form.image} onChange={handleFormChange} placeholder="https://..." />
                            </div>

                            <div className="modal__footer">
                                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn-save" disabled={saving}>
                                    {saving ? 'Saving...' : editItem ? 'Save Changes' : 'Add Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function StatCard({ icon, label, value, color }) {
    return (
        <div className={`stat-card stat-card--${color}`}>
            <span className="stat-card__icon">{icon}</span>
            <div>
                <p className="stat-card__value">{value}</p>
                <p className="stat-card__label">{label}</p>
            </div>
        </div>
    )
}

export default Admin
