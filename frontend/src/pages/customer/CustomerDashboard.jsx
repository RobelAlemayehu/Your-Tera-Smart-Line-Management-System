import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import MyQueue from './MyQueue';
import MyHistory from './MyHistory';
import MyNotifications from './MyNotifications';
import '../../styles/customer.css';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('queue');

  const handleLogout = () => {
    logout();
    window.location.href = '/signin';
  };

  return (
    <div className="customer-dashboard">
      <nav className="customer-nav">
        <div className="customer-nav-content">
          <h1>Customer Dashboard</h1>
          <div className="customer-nav-right">
            <span className="customer-user">Welcome, {user?.username || user?.email}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </nav>

      <div className="customer-tabs">
        <button
          className={activeTab === 'queue' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('queue')}
        >
          My Queue
        </button>
        <button
          className={activeTab === 'history' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('history')}
        >
          My History
        </button>
        <button
          className={activeTab === 'notifications' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
      </div>

      <div className="customer-content">
        {activeTab === 'queue' && <MyQueue />}
        {activeTab === 'history' && <MyHistory />}
        {activeTab === 'notifications' && <MyNotifications />}
      </div>
    </div>
  );
};

export default CustomerDashboard;

