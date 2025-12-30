import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UsersManagement from './UsersManagement';
import QueueTicketsTable from './QueueTicketsTable';
import '../../styles/admin.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  const handleLogout = () => {
    logout();
    window.location.href = '/signin';
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <div className="admin-nav-content">
          <h1>Admin Dashboard</h1>
          <div className="admin-nav-right">
            <span className="admin-user">Welcome, {user?.username || user?.email}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </nav>

      <div className="admin-tabs">
        <button
          className={activeTab === 'users' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('users')}
        >
          Users Management
        </button>
        <button
          className={activeTab === 'tickets' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('tickets')}
        >
          Queue Tickets
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'users' && <UsersManagement />}
        {activeTab === 'tickets' && <QueueTicketsTable />}
      </div>
    </div>
  );
};

export default AdminDashboard;

