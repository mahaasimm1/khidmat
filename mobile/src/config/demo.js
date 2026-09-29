export const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE === 'true';

export const DEMO_USER = {
  id: 'demo-user-001',
  name: 'Demo Donor',
  email: 'demo@khidmat.local',
  role: 'donor',
  phone: '03000000000',
};

export const DEMO_CAUSES = [
  {
    id: 'demo-cause-water',
    title: 'Clean Water for Thar',
    description: 'Help provide reliable clean water access for communities in Tharparkar.',
    category: 'health',
    target_amount: 500000,
    raised_amount: 180000,
    zakat_eligible: true,
    status: 'active',
    created_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'demo-cause-food',
    title: 'Ramadan Food Packages',
    description: 'Provide essential food packages to families facing food insecurity.',
    category: 'food',
    target_amount: 300000,
    raised_amount: 95000,
    zakat_eligible: true,
    status: 'active',
    created_at: '2026-09-02T00:00:00Z',
  },
];

let demoDonations = [
  {
    id: 'demo-donation-001',
    cause_id: 'demo-cause-water',
    cause_title: 'Clean Water for Thar',
    amount: 2500,
    type: 'one_time',
    status: 'completed',
    created_at: '2026-09-20T12:00:00Z',
  },
];

export function getDemoCause(id) {
  return DEMO_CAUSES.find((cause) => cause.id === id) || null;
}

export function getDemoDonations() {
  return { donations: demoDonations };
}

export function addDemoDonation({ cause_id, amount, type }) {
  const cause = getDemoCause(cause_id);
  const donation = {
    id: `demo-donation-${Date.now()}`,
    cause_id,
    cause_title: cause?.title || 'Cause',
    amount,
    type,
    status: 'completed',
    created_at: new Date().toISOString(),
  };
  demoDonations = [donation, ...demoDonations];
  return { donation };
}
