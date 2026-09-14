import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { listCauses } from '../api/causes'
import { listEvents } from '../api/events'
import { listAllDonations } from '../api/donations'

export default function Dashboard() {
  const [stats, setStats] = useState({ causes: 0, events: 0, donations: 0 })

  useEffect(() => {
    Promise.all([listCauses(), listEvents(), listAllDonations()])
      .then(([causesData, eventsData, donationsData]) => {
        setStats({
          causes: causesData.causes?.length || 0,
          events: eventsData.events?.length || 0,
          donations: donationsData.donations?.length || 0,
        })
      })
      .catch(() => {
        // Sprint 1: silently fall back to zeros if an endpoint isn't live yet
      })
  }, [])

  return (
    <Layout>
      <h1 style={{ marginBottom: 20 }}>Dashboard</h1>
      <div style={{ display: 'flex', gap: 16 }}>
        <Card title="Causes" value={stats.causes} />
        <Card title="Events" value={stats.events} />
        <Card title="Donations" value={stats.donations} />
      </div>
    </Layout>
  )
}

function Card({ title, value }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 20, width: 160 }}>
      <p style={{ color: '#6b7280', fontSize: 13 }}>{title}</p>
      <p style={{ fontSize: 28, fontWeight: 'bold' }}>{value}</p>
    </div>
  )
}
