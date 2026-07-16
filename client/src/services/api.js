// ─── Central API Service ──────────────────────────────
// RULES: All API calls go here, never inline in components

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
})

// ── Menu ──────────────────────────────────────────────
export const fetchMenu = (category = 'ALL') => {
    const url =
        category === 'ALL'
            ? `${API_URL}/api/menu`
            : `${API_URL}/api/menu?category=${category}`
    return fetch(url).then((r) => r.json())
}

// ── Auth ──────────────────────────────────────────────
export const loginUser = (email, password) =>
    fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    }).then((r) => r.json())

export const signupUser = (email, password) =>
    fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    }).then((r) => r.json())

// ── Orders ────────────────────────────────────────────
export const placeOrder = (items) =>
    fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ items }),
    }).then((r) => r.json())

export const fetchMyOrders = () =>
    fetch(`${API_URL}/api/orders/myorders`, {
        headers: getAuthHeaders(),
    }).then((r) => r.json())
