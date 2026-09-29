import { apiRequest } from './client';
import { addDemoDonation, DEMO_MODE, getDemoDonations } from '../config/demo';

export async function createDonation(payload) {
  if (DEMO_MODE) return addDemoDonation(payload);

  return apiRequest('/donations', {
    method: 'POST',
    body: payload,
  });
}

export async function listMyDonations() {
  if (DEMO_MODE) return getDemoDonations();

  return apiRequest('/donations/me');
}
