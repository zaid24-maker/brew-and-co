import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children }) {
    const { isLoggedIn } = useAuth()

    if (!isLoggedIn) {
        // Navigate is React Router's redirect — "replace" avoids it going in history
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute
