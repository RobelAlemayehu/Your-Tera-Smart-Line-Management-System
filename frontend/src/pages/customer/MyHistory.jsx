import { useState, useEffect } from 'react';
import { customerService } from '../../services/customerService';
import '../../styles/customer.css';

const MyHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await customerService.getMyTicketHistory();
      if (data.message) {
        setHistory([]);
      } else {
        setHistory(Array.isArray(data) ? data : []);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load history. Please try again.');
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your history...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="my-history">
      <div className="history-header">
        <h2>My Ticket History</h2>
        <button onClick={fetchHistory} className="refresh-btn">Refresh</button>
      </div>

      {history.length === 0 ? (
        <div className="no-history">
          <p>You don't have any ticket history yet.</p>
        </div>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Ticket Number</th>
                <th>Service</th>
                <th>Status</th>
                <th>Position</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((ticket) => (
                <tr key={ticket.ticket_id}>
                  <td>#{ticket.ticket_number}</td>
                  <td>{ticket.service_name}</td>
                  <td>
                    <span className={`status-badge status-${ticket.status?.toLowerCase()}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td>{ticket.position || 'N/A'}</td>
                  <td>{ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyHistory;

