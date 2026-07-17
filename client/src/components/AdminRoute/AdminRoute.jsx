import { Navigate } from 'react-router-dom'

// 🧠 CONCEPT: AdminRoute wraps any route that requires admin access.
//    It checks localStorage for the isAdmin flag set on login.
//    Non-admin users are silently redirected to the home page.
function AdminRoute({ children }) {
    const token = localStorage.getItem('token')
    const isAdmin = localStorage.getItem('isAdmin') === 'true'

    if (!token || !isAdmin) {
        return <Navigate to="/" replace />
    }

    return children
}

export default AdminRoute

