import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  verifyResetCode: (data) => api.post('/auth/verify-reset-code', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const queueAPI = {
  joinQueue: (data) => api.post('/queue/join', data),
  getOfficeQueue: (serviceId) => api.get(`/queue/office/${serviceId}`),
  getMyStatus: () => api.get('/queue/my-status'),
  getMyHistory: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return api.get(`/queue/my-history?${params.toString()}`);
  },
  cancelTicket: (ticketId) => api.patch(`/queue/cancel/${ticketId}`),
  updateStatus: (ticketId, data) => api.patch(`/queue/status/${ticketId}`, data),
};

export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getAllTickets: () => api.get('/admin/tickets'),
  getUsers: () => api.get('/admin/users'),
  addService: (data) => api.post('/admin/services', data),
  addOffice: (data) => api.post('/offices/add', data),
  updateOffice: (officeId, data) => api.patch(`/offices/${officeId}`, data),
  deleteOffice: (officeId) => api.delete(`/offices/${officeId}`),
  updateService: (serviceId, data) => api.patch(`/admin/services/${serviceId}`, data),
  deleteService: (serviceId) => api.delete(`/admin/services/${serviceId}`),
  completeTicket: (id) => api.patch(`/admin/complete/${id}`),
  changeUserRole: (userId, data) => api.patch(`/admin/users/${userId}/role`, data),
  updateTicketStatus: (ticketId, data) => api.patch(`/admin/tickets/${ticketId}/status`, data),
  deleteServiceTickets: (serviceId) => api.delete(`/admin/tickets/${serviceId}`),
  deleteTicket: (serviceId, ticketId) => api.delete(`/admin/services/${serviceId}/tickets/${ticketId}`),
};

export const officeAPI = {
  getOffices: () => api.get('/offices'),
  getOfficeById: (id) => api.get(`/offices/${id}`),
};

export const serviceAPI = {
  getServices: () => api.get('/services'),
  getServicesByOffice: (officeId) => api.get(`/services/office/${officeId}`),
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.patch('/profile', data),
  changePassword: (data) => api.patch('/profile/password', data),
};

export default api;