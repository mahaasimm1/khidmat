import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Causes from './pages/Causes'
import Events from './pages/Events'
import Donations from './pages/Donations'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/causes" element={<ProtectedRoute><Causes /></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
      <Route path="/donations" element={<ProtectedRoute><Donations /></ProtectedRoute>} />
    </Routes>
  )
}
