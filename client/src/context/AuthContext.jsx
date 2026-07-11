import { createContext, useState, useContext } from 'react'
const AuthContext = createContext()

export function AuthProvider({ children }) {

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token')
  })

  const login = (token) => {
    localStorage.setItem('token', token)
    setIsLoggedIn(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
