import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { listCauses, createCause, updateCause, deleteCause } from '../api/causes'

const emptyForm = { title: '', description: '', category: '', target_amount: '', zakat_eligible: false }

export default function Causes() {
  const [causes, setCauses] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  async function refresh() {
    try {
      const data = await listCauses()
      setCauses(data.causes || [])
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
    const payload = { ...form, target_amount: Number(form.target_amount) }
    try {
      if (editingId) {
        await updateCause(editingId, payload)
      } else {
        await createCause(payload)
      }
      setForm(emptyForm)
      setEditingId(null)
      refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  function startEdit(cause) {
    setEditingId(cause.id)
    setForm({
      title: cause.title,
      description: cause.description || '',
      category: cause.category || '',
      target_amount: cause.target_amount,
      zakat_eligible: cause.zakat_eligible,
    })
  }

  async function handleDelete(id) {
    if (!confirm('Delete this cause?')) return
    try {
      await deleteCause(id)
      refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Layout>
      <h1 style={{ marginBottom: 20 }}>Causes</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input placeholder="Target amount" type="number" value={form.target_amount} onChange={(e) => setForm({ ...form, target_amount: e.target.value })} required />
        <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input type="checkbox" checked={form.zakat_eligible} onChange={(e) => setForm({ ...form, zakat_eligible: e.target.checked })} />
          Zakat eligible
        </label>
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ flexBasis: '100%' }} />
        <button type="submit">{editingId ? 'Update cause' : 'Add cause'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm) }}>Cancel</button>}
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
            <th style={th}>Title</th>
            <th style={th}>Category</th>
            <th style={th}>Target</th>
            <th style={th}>Raised</th>
            <th style={th}>Zakat</th>
            <th style={th}>Status</th>
            <th style={th}></th>
          </tr>
        </thead>
        <tbody>
          {causes.map((c) => (
            <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={td}>{c.title}</td>
              <td style={td}>{c.category}</td>
              <td style={td}>{c.target_amount}</td>
              <td style={td}>{c.raised_amount}</td>
              <td style={td}>{c.zakat_eligible ? 'Yes' : 'No'}</td>
              <td style={td}>{c.status}</td>
              <td style={td}>
                <button onClick={() => startEdit(c)}>Edit</button>{' '}
                <button onClick={() => handleDelete(c.id)}>Delete</button>
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
