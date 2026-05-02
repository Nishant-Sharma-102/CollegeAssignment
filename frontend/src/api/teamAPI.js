import api from './axiosInstance';

export const teamAPI = {
  getAll: () => api.get('/teams'),
  getById: (id) => api.get(`/teams/${id}`),
  create: (data) => api.post('/teams', data),
  update: (id, data) => api.put(`/teams/${id}`, data),
  delete: (id) => api.delete(`/teams/${id}`),
  addMember: (teamId, userId) => api.post(`/teams/${teamId}/members/${userId}`),
  removeMember: (teamId, userId) => api.delete(`/teams/${teamId}/members/${userId}`),
};
