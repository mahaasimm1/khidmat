import { apiRequest } from './client'

export function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  })
}

export function signup({ name, email, password, role, phone }) {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: { name, email, password, role, phone },
    auth: false,
  })
}

export function getMe() {
  return apiRequest('/auth/me')
}
