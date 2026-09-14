import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(email, password)
      if (user.role !== 'admin') {
        setError('This account is not an admin. Use an admin login.')
        return
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ width: 320, padding: 24, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>Khidmat Admin Login</h1>
        {error && <p style={{ color: 'red', fontSize: 14 }}>{error}</p>}
        <label style={{ display: 'block', marginBottom: 12 }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </label>
        <label style={{ display: 'block', marginBottom: 16 }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </label>
        <button type="submit" disabled={submitting} style={{ width: '100%', padding: 10 }}>
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  )
}

const inputStyle = { width: '100%', padding: 8, marginTop: 4 }
