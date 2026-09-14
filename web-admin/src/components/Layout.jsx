import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <aside style={{ width: 220, background: '#1f2937', color: '#fff', padding: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 24 }}>Khidmat Admin</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <NavLink to="/" end style={navStyle}>Dashboard</NavLink>
          <NavLink to="/causes" style={navStyle}>Causes</NavLink>
          <NavLink to="/events" style={navStyle}>Events</NavLink>
          <NavLink to="/donations" style={navStyle}>Donations</NavLink>
        </nav>
        <div style={{ marginTop: 40, fontSize: 13, opacity: 0.8 }}>
          {user && <p>Signed in as {user.name}</p>}
          <button onClick={handleLogout} style={{ marginTop: 8 }}>Log out</button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: 24, background: '#f9fafb' }}>{children}</main>
    </div>
  )
}

const navStyle = ({ isActive }) => ({
  color: isActive ? '#fff' : '#9ca3af',
  fontWeight: isActive ? 'bold' : 'normal',
  textDecoration: 'none',
})
