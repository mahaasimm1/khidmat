import { apiRequest } from './client';
import { DEMO_MODE, DEMO_CAUSES, getDemoCause } from '../config/demo';

export async function listCauses() {
  if (DEMO_MODE) return { causes: DEMO_CAUSES };

  return apiRequest('/causes');
}

export async function getCause(id) {
  if (DEMO_MODE) return { cause: getDemoCause(id) };

  return apiRequest(`/causes/${id}`);
}
