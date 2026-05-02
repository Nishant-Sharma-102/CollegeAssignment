import api from './axiosInstance';

export const projectAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  addMember: (projectId, userId) => api.post(`/projects/${projectId}/members/${userId}`),
  removeMember: (projectId, userId) => api.delete(`/projects/${projectId}/members/${userId}`),
};
