import api from './axiosInstance';

export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
};

export const userAPI = {
  getMe: () => api.get('/users/me'),
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
};
