import { apiRequest } from './client';
import { DEMO_MODE, DEMO_USER } from '../config/demo';

export async function signup({ name, email, password, role = 'donor', phone }) {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: { name, email, password, role, phone },
    auth: false,
  });
}

export async function login(email, password) {
  if (DEMO_MODE && email === 'demo@khidmat.local' && password === 'Demo1234') {
    return { user: DEMO_USER, token: 'khidmat-local-demo-token' };
  }

  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
}

export async function getMe() {
  if (DEMO_MODE) {
    return { user: DEMO_USER };
  }

  return apiRequest('/auth/me');
}
