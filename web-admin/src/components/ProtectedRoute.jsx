import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>
  if (!user) return <Navigate to="/login" replace />

  // Sprint 1: admin panel is admin-only. If a non-admin somehow logs in here, bounce them.
  if (user.role !== 'admin') {
    return <p style={{ padding: 24 }}>This panel is for admins only.</p>
  }

  return children
}
