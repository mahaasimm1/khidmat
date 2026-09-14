import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { listEvents, createEvent, updateEvent, deleteEvent } from '../api/events'

const emptyForm = { title: '', description: '', location: '', event_date: '', cause_id: '' }

export default function Events() {
  const [events, setEvents] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  async function refresh() {
    try {
      const data = await listEvents()
      setEvents(data.events || [])
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const payload = { ...form }
    if (!payload.cause_id) delete payload.cause_id
    try {
      if (editingId) {
        await updateEvent(editingId, payload)
      } else {
        await createEvent(payload)
      }
      setForm(emptyForm)
      setEditingId(null)
      refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  function startEdit(ev) {
    setEditingId(ev.id)
    setForm({
      title: ev.title,
      description: ev.description || '',
      location: ev.location || '',
      event_date: ev.event_date ? ev.event_date.slice(0, 16) : '',
      cause_id: ev.cause_id || '',
    })
  }

  async function handleDelete(id) {
    if (!confirm('Delete this event?')) return
    try {
      await deleteEvent(id)
      refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Layout>
      <h1 style={{ marginBottom: 20 }}>Events</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} required />
        <input placeholder="Cause ID (optional)" value={form.cause_id} onChange={(e) => setForm({ ...form, cause_id: e.target.value })} />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ flexBasis: '100%' }} />
        <button type="submit">{editingId ? 'Update event' : 'Add event'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm) }}>Cancel</button>}
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
            <th style={th}>Title</th>
            <th style={th}>Location</th>
            <th style={th}>Date</th>
            <th style={th}>Status</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={td}>{ev.title}</td>
              <td style={td}>{ev.location}</td>
              <td style={td}>{ev.event_date ? new Date(ev.event_date).toLocaleString() : ''}</td>
              <td style={td}>{ev.status}</td>
              <td style={td}>
                <button onClick={() => startEdit(ev)}>Edit</button>{' '}
                <button onClick={() => handleDelete(ev.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}

const th = { padding: 10, fontSize: 13, color: '#6b7280' }
const td = { padding: 10, fontSize: 14 }
