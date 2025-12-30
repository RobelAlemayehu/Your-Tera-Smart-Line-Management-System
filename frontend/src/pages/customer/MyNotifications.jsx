import { useState, useEffect } from 'react';
import { customerService } from '../../services/customerService';
import '../../styles/customer.css';

const MyNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await customerService.getMyNotifications();
      setNotifications(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Failed to load notifications. Please try again.');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading notifications...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="my-notifications">
      <div className="notifications-header">
        <h2>My Notifications</h2>
        <button onClick={fetchNotifications} className="refresh-btn">Refresh</button>
      </div>

      {notifications.length === 0 ? (
        <div className="no-notifications">
          <p>You don't have any notifications yet.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div 
              key={notification.notification_id || notification.id} 
              className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-date">
                  {notification.created_at 
                    ? new Date(notification.created_at).toLocaleString() 
                    : 'N/A'}
                </span>
              </div>
              {notification.type && (
                <span className="notification-type">{notification.type}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyNotifications;

