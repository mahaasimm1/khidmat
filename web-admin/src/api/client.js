// Central place for the backend base URL.
// Swap between local dev and the deployed Render URL from API_CONTRACT.md.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

function getToken() {
  return localStorage.getItem('khidmat_token')
}

export function setToken(token) {
  localStorage.setItem('khidmat_token', token)
}

export function clearToken() {
  localStorage.removeItem('khidmat_token')
}

export async function apiRequest(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    // Backend always returns { error: "message" } on failure — see API_CONTRACT.md
    throw new Error(data.error || `Request failed with status ${res.status}`)
  }

  return data
}
