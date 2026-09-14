import { apiRequest } from './client'

export function listCauses() {
  return apiRequest('/causes')
}

export function getCause(id) {
  return apiRequest(`/causes/${id}`)
}

export function createCause(cause) {
  return apiRequest('/causes', { method: 'POST', body: cause })
}

export function updateCause(id, cause) {
  return apiRequest(`/causes/${id}`, { method: 'PUT', body: cause })
}

export function deleteCause(id) {
  return apiRequest(`/causes/${id}`, { method: 'DELETE' })
}
