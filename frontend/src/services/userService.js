import { api } from './api'

export const userService = {
  list: () => api.get('/users').then((res) => res.data),

  getById: (id) => api.get(`/users/${id}`).then((res) => res.data),

  create: (payload) => api.post('/users', payload).then((res) => res.data),

  update: (id, payload) =>
    api.patch(`/users/${id}`, payload).then((res) => res.data),

  remove: (id) => api.delete(`/users/${id}`),
}
