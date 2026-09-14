import { createContext, useContext, useEffect, useState } from 'react'
import { login as loginApi, getMe } from '../api/auth'
import { setToken, clearToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On page load, if a token exists, try to restore the session
  useEffect(() => {
    const token = localStorage.getItem('khidmat_token')
    if (!token) {
      setLoading(false)
      return
    }
    getMe()
      .then((data) => setUser(data.user))
      .catch(() => clearToken())
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const data = await loginApi(email, password)
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  function logout() {
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
