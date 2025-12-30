import api from './api';

export const customerService = {
  // Get customer's own tickets/history
  getMyTickets: async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/queue/my-status', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get customer's notifications
  getMyNotifications: async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await api.get(`/notifications/${user.user_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Get customer's ticket history (all tickets, not just active)
  getMyTicketHistory: async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    // This endpoint might need to be created - for now using my-status
    const response = await api.get('/queue/my-status', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Join queue
  joinQueue: async (serviceId) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await api.post('/queue/join', 
      { user_id: user.user_id, service_id: serviceId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Cancel ticket
  cancelTicket: async (ticketId) => {
    const token = localStorage.getItem('token');
    const response = await api.patch(`/queue/cancel/${ticketId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

