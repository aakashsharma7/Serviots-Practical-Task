import api from './axiosInstance';

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Pets
export const petsAPI = {
  getAll: (params) => api.get('/pets', { params }),
  getById: (id) => api.get(`/pets/${id}`),
  getAllAdmin: (params) => api.get('/pets/admin/all', { params }),
  create: (formData) =>
    api.post('/pets', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) =>
    api.put(`/pets/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/pets/${id}`),
};

// Applications
export const applicationsAPI = {
  submit: (data) => api.post('/applications', data),
  getMine: () => api.get('/applications/mine'),
  getAll: (params) => api.get('/applications', { params }),
  getById: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, data) => api.patch(`/applications/${id}`, data),
};
