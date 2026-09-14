import { apiRequest } from './client'

// GET /donations — admin-only, returns donor_name + cause_title per API_CONTRACT.md
export function listAllDonations() {
  return apiRequest('/donations')
}

export function listDonationsForCause(causeId) {
  return apiRequest(`/donations/cause/${causeId}`)
}
