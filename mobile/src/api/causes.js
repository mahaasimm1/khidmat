import { apiRequest } from './client';

export async function listCauses() {
  return apiRequest('/causes');
}

export async function getCause(id) {
  return apiRequest(`/causes/${id}`);
}
