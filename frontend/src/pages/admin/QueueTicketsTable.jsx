import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import '../../styles/admin.css';

const QueueTicketsTable = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllTickets();
      setTickets(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tickets. Please try again.');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await adminService.updateTicketStatus(ticketId, newStatus);
      setTickets(tickets.map(ticket =>
        ticket.ticket_id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
    } catch (err) {
      alert('Failed to update ticket status. Please try again.');
      console.error('Error updating ticket:', err);
    }
  };

  const handleDeleteTicket = async (serviceId, ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) {
      return;
    }
    try {
      await adminService.deleteTicket(serviceId, ticketId);
      setTickets(tickets.filter(ticket => ticket.ticket_id !== ticketId));
    } catch (err) {
      alert('Failed to delete ticket. Please try again.');
      console.error('Error deleting ticket:', err);
    }
  };

  const filteredTickets = filterStatus === 'all' 
    ? tickets 
    : tickets.filter(ticket => ticket.status === filterStatus);

  if (loading) {
    return <div className="loading">Loading tickets...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="queue-tickets-table">
      <div className="table-header">
        <h2>Queue Tickets Management</h2>
        <div className="filter-controls">
          <label>Filter by Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="Waiting">Waiting</option>
            <option value="Serving">Serving</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button onClick={fetchTickets} className="refresh-btn">Refresh</button>
        </div>
      </div>

      <div className="table-container">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Ticket Number</th>
              <th>User</th>
              <th>Service</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No tickets found</td>
              </tr>
            ) : (
              filteredTickets.map((ticket) => (
                <tr key={ticket.ticket_id}>
                  <td>{ticket.ticket_id}</td>
                  <td>{ticket.ticket_number}</td>
                  <td>
                    {ticket.user?.username || ticket.user?.email || 'N/A'}
                  </td>
                  <td>{ticket.service?.service_name || 'N/A'}</td>
                  <td>
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket.ticket_id, e.target.value)}
                      className={`status-select status-${ticket.status.toLowerCase()}`}
                    >
                      <option value="Waiting">Waiting</option>
                      <option value="Serving">Serving</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{ticket.created_at ? new Date(ticket.created_at).toLocaleString() : 'N/A'}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteTicket(ticket.service_id, ticket.ticket_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QueueTicketsTable;

