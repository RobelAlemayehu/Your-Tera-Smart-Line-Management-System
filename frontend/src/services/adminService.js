import api from './api';

export const adminService = {
  // Get all users
  getAllUsers: async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    const token = localStorage.getItem('token');
    const response = await api.patch(`/admin/users/${userId}/role`, 
      { role },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Get all queue tickets
  getAllTickets: async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/admin/tickets', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Update ticket status
  updateTicketStatus: async (ticketId, status) => {
    const token = localStorage.getItem('token');
    const response = await api.patch(`/admin/tickets/${ticketId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Delete ticket
  deleteTicket: async (serviceId, ticketId) => {
    const token = localStorage.getItem('token');
    const response = await api.delete(`/admin/services/${serviceId}/tickets/${ticketId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get analytics
  getAnalytics: async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/admin/analytics', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

