import { apiRequest } from './client';

export async function createDonation(payload) {
  return apiRequest('/donations', {
    method: 'POST',
    body: payload,
  });
}

export async function listMyDonations() {
  return apiRequest('/donations/me');
}
