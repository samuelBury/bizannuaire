const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getBusinesses: () => request('/api/businesses'),
  getBusiness: (id) => request(`/api/businesses/${id}`),
  createBusiness: (data) => request('/api/businesses', { method: 'POST', body: JSON.stringify(data) }),
  updateBusiness: (id, data) => request(`/api/businesses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBusiness: (id) => request(`/api/businesses/${id}`, { method: 'DELETE' }),

  getAds: () => request('/api/ads'),
  createAd: (data) => request('/api/ads', { method: 'POST', body: JSON.stringify(data) }),
  updateAd: (id, data) => request(`/api/ads/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAd: (id) => request(`/api/ads/${id}`, { method: 'DELETE' }),

  seed: () => request('/api/seed', { method: 'POST' }),
};
