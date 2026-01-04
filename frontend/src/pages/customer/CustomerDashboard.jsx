import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MyQueue from './MyQueue';
import MyHistory from './MyHistory';
import MyNotifications from './MyNotifications';
import '../../styles/customer.css';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('queue');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const goToServices = () => {
    navigate('/services');
  };

  return (
    <div className="customer-dashboard">
      <nav className="customer-nav">
        <div className="customer-nav-content">
          <div className="nav-brand" onClick={() => navigate('/')}>
            <img src="/images/logo.png" alt="YourTera Logo" className="dashboard-logo" />
            <span className="brand-name">YourTera</span>
          </div>
          <div className="customer-nav-right">
            <span className="customer-user">Welcome, {user?.fullname || user?.username || user?.email}</span>
          </div>
        </div>
      </nav>

      <div className="dashboard-layout">
        <div className="sidebar">
          <div className="customer-tabs">
            <button
              className={activeTab === 'services' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('services')}
            >
              Services
            </button>
            <button
              className={activeTab === 'queue' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('queue')}
            >
              Queue
            </button>
            <button
              className={activeTab === 'history' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
            <button
              className={activeTab === 'notifications' ? 'tab active' : 'tab'}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
          </div>
          <button onClick={handleLogout} className="logout-btn-sidebar">Logout</button>
        </div>

        <div className="customer-content">
          {activeTab === 'services' && (
            <div className="services-section">
              <h2>Available Services</h2>
              <p>Browse and register for available services</p>
              <button onClick={goToServices} className="browse-services-btn">
                Browse All Services
              </button>
            </div>
          )}
          {activeTab === 'queue' && <MyQueue />}
          {activeTab === 'history' && <MyHistory />}
          {activeTab === 'notifications' && <MyNotifications />}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;

