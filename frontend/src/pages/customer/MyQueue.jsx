import { useState, useEffect } from 'react';
import { customerService } from '../../services/customerService';
import { useNavigate } from 'react-router-dom';
import '../../styles/customer.css';

const MyQueue = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyQueue();
    // Refresh every 30 seconds
    const interval = setInterval(fetchMyQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMyQueue = async () => {
    try {
      setLoading(true);
      const data = await customerService.getMyTickets();
      if (data.message) {
        setTickets([]);
      } else {
        setTickets(Array.isArray(data) ? data : []);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load queue status. Please try again.');
      console.error('Error fetching queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to cancel this ticket?')) {
      return;
    }
    try {
      await customerService.cancelTicket(ticketId);
      fetchMyQueue();
    } catch (err) {
      alert('Failed to cancel ticket. Please try again.');
      console.error('Error cancelling ticket:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading your queue...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="my-queue">
      <div className="queue-header">
        <h2>My Digital Queue</h2>
        <button onClick={fetchMyQueue} className="refresh-btn">Refresh</button>
      </div>

      {tickets.length === 0 ? (
        <div className="no-tickets">
          <p>You don't have any active tickets in the queue.</p>
          <button 
            className="join-queue-btn"
            onClick={() => navigate('/services')}
          >
            Browse Services
          </button>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map((ticket) => (
            <div key={ticket.ticket_id} className="ticket-card">
              <div className="ticket-header">
                <h3>{ticket.service_name}</h3>
                <span className={`status-badge status-${ticket.status?.toLowerCase()}`}>
                  {ticket.status}
                </span>
              </div>
              <div className="ticket-info">
                <div className="info-row">
                  <span className="label">Ticket Number:</span>
                  <span className="value ticket-number">#{ticket.ticket_number}</span>
                </div>
                <div className="info-row">
                  <span className="label">Position in Queue:</span>
                  <span className="value position">{ticket.position || 'N/A'}</span>
                </div>
                {ticket.estimatedWaitTime !== undefined && (
                  <div className="info-row">
                    <span className="label">Estimated Wait Time:</span>
                    <span className="value wait-time">{ticket.estimatedWaitTime} minutes</span>
                  </div>
                )}
              </div>
              {ticket.status === 'Waiting' && (
                <button
                  className="cancel-btn"
                  onClick={() => handleCancelTicket(ticket.ticket_id)}
                >
                  Cancel Ticket
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQueue;

