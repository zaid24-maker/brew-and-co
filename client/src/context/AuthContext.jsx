import { createContext, useState, useContext } from 'react'
const AuthContext = createContext()

export function AuthProvider({ children }) {

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'))
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true')

  // 🧠 CONCEPT: login now accepts both token and isAdmin flag from the server
  //    Both are stored in localStorage so they survive page refreshes
  const login = (token, adminFlag = false) => {
    localStorage.setItem('token', token)
    localStorage.setItem('isAdmin', adminFlag ? 'true' : 'false')
    setIsLoggedIn(true)
    setIsAdmin(adminFlag)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
    setIsLoggedIn(false)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
