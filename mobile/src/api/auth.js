import { apiRequest } from './client';

export async function signup({ name, email, password, role = 'donor', phone }) {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: { name, email, password, role, phone },
    auth: false,
  });
}

export async function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
}

export async function getMe() {
  return apiRequest('/auth/me');
}
