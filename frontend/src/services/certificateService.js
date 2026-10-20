import { api } from './api'
// Cada função devolve direto o corpo da resposta (response.data),
export const certificateService = {
  list: () => api.get('/certificates').then((res) => res.data),

  getById: (id) => api.get(`/certificates/${id}`).then((res) => res.data),

  create: (payload) => api.post('/certificates', payload).then((res) => res.data),

  update: (id, payload) =>
    api.patch(`/certificates/${id}`, payload).then((res) => res.data),

  remove: (id) => api.delete(`/certificates/${id}`),

  listExpired: () => api.get('/certificates/expired').then((res) => res.data),

  // { status: 'RENEWING' | 'ACTIVE', changedByUserId }
  updateStatus: (id, payload) =>
    api.patch(`/certificates/${id}/status`, payload).then((res) => res.data),

  // { validFrom, validUntil, renewalValue, renewedByUserId }
  renew: (id, payload) =>
    api.post(`/certificates/${id}/renew`, payload).then((res) => res.data),
}
