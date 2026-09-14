import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { listAllDonations } from '../api/donations'

export default function Donations() {
  const [donations, setDonations] = useState([])
  const [error, setError] = useState('')

  async function refresh() {
    try {
      const data = await listAllDonations()
      setDonations(data.donations || [])
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Donations</h1>
        <button onClick={refresh}>Refresh</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
            <th style={th}>Donor</th>
            <th style={th}>Cause</th>
            <th style={th}>Amount</th>
            <th style={th}>Type</th>
            <th style={th}>Status</th>
            <th style={th}>Date</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((d) => (
            <tr key={d.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={td}>{d.donor_name}</td>
              <td style={td}>{d.cause_title}</td>
              <td style={td}>{d.amount}</td>
              <td style={td}>{d.type}</td>
              <td style={td}>{d.status}</td>
              <td style={td}>{d.created_at ? new Date(d.created_at).toLocaleString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {donations.length === 0 && !error && <p style={{ marginTop: 12, color: '#6b7280' }}>No donations yet.</p>}
    </Layout>
  )
}

const th = { padding: 10, fontSize: 13, color: '#6b7280' }
const td = { padding: 10, fontSize: 14 }
