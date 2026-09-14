import { apiRequest } from './client'

export function listEvents() {
  return apiRequest('/events')
}

export function getEvent(id) {
  return apiRequest(`/events/${id}`)
}

export function createEvent(event) {
  return apiRequest('/events', { method: 'POST', body: event })
}

export function updateEvent(id, event) {
  return apiRequest(`/events/${id}`, { method: 'PUT', body: event })
}

export function deleteEvent(id) {
  return apiRequest(`/events/${id}`, { method: 'DELETE' })
}
