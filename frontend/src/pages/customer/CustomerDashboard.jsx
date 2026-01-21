import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { queueAPI, officeAPI, serviceAPI, profileAPI } from '../../services/api';
import { Bell, Clock, Users, MapPin, User, Eye, EyeOff, Plus, History, Menu, X } from 'lucide-react';
import QRCode from 'qrcode';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('join');
  const [offices, setOffices] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [myTickets, setMyTickets] = useState([]);
  const [ticketHistory, setTicketHistory] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [newTicket, setNewTicket] = useState(null);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedServiceForJoin, setSelectedServiceForJoin] = useState(null);

  // Profile management
  const [profileData, setProfileData] = useState({ fullname: '', email: '', phone_number: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchOffices();
    fetchMyStatus();
    fetchProfile();

    // Close mobile menu on window resize
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchTicketHistory();
    }
  }, [activeTab, startDate, endDate]);

  useEffect(() => {
    if (selectedOffice) {
      fetchServices();
    }
  }, [selectedOffice]);

  const fetchOffices = async () => {
    try {
      const response = await officeAPI.getOffices();
      setOffices(response.data);
    } catch (error) {
      console.error('Error fetching offices:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await serviceAPI.getServicesByOffice(selectedOffice);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchMyStatus = async () => {
    try {
      const response = await queueAPI.getMyStatus();
      // Handle both array response (when tickets exist) and object response (when no tickets)
      const tickets = Array.isArray(response.data) ? response.data : (response.data.tickets || []);
      console.log('Fetched tickets:', tickets); // Debug log
      setMyTickets(tickets);
    } catch (error) {
      console.error('Error fetching status:', error);
      setMyTickets([]); // Set empty array on error to show proper empty state
    }
  };

  const fetchTicketHistory = async () => {
    try {
      console.log('Fetching ticket history...');
      const response = await queueAPI.getMyHistory(startDate, endDate);
      console.log('History API response:', response.data);
      // Handle response the same way as fetchMyStatus
      const tickets = Array.isArray(response.data) ? response.data : (response.data.tickets || []);
      console.log('Processed tickets:', tickets);
      setTicketHistory(tickets);
    } catch (error) {
      console.error('Error fetching ticket history:', error);
      setTicketHistory([]);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await profileAPI.getProfile();
      setProfileData({
        fullname: response.data.fullname,
        email: response.data.email,
        phone_number: response.data.phone_number
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleJoinQueue = (e) => {
    e.preventDefault();
    if (!selectedService) {
      setMessage('Please select a service');
      return;
    }

    // Find the full service object to get required documents
    const serviceToJoin = services.find(s => s._id === selectedService);
    if (!serviceToJoin) {
      setMessage('Service not found');
      return;
    }

    setSelectedServiceForJoin(serviceToJoin);
    setShowDocumentsModal(true);
  };

  const confirmJoinQueue = async () => {
    setShowDocumentsModal(false);
    setLoading(true);
    try {
      const response = await queueAPI.joinQueue({
        service_id: selectedService,
        phone_number: user.phone_number
      });
      setMessage('Successfully joined the queue!');
      setNewTicket(response.data.data);
      setShowTicketModal(true);
      fetchMyStatus();
      setSelectedOffice('');
      setSelectedService('');
      setSelectedServiceForJoin(null);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to join queue');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (ticketNumber) => {
    try {
      await queueAPI.cancelTicket(ticketNumber);
      setMessage('Ticket cancelled successfully');
      fetchMyStatus();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to cancel ticket');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Waiting': return '#f59e0b';
      case 'Serving': return '#10b981';
      case 'Completed': return '#6b7280';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await profileAPI.updateProfile(profileData);
      setMessage('Profile updated successfully');
      fetchProfile();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await profileAPI.changePassword(passwordData);
      setMessage('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '1rem 0',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1
              onClick={() => window.location.href = '/'}
              style={{
                color: '#4A868C',
                fontSize: '24px',
                fontWeight: 'bold',
                cursor: 'pointer',
                margin: 0
              }}
            >
              YourTera
            </h1>
            <p style={{ color: '#666', margin: 0 }}>Welcome, {user.fullname}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              className="dashboard-mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <button
              onClick={logout}
              className="dashboard-logout-btn"
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', paddingTop: '180px' }}>
        {/* Navigation Tabs */}
        <div className="dashboard-nav-tabs">
          <button
            onClick={() => setActiveTab('join')}
            style={{
              padding: '12px 24px',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === 'join' ? '#4A868C' : '#666',
              borderBottom: activeTab === 'join' ? '2px solid #4A868C' : 'none',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Plus size={16} />
            Join Queue
          </button>
          <button
            onClick={() => setActiveTab('status')}
            style={{
              padding: '12px 24px',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === 'status' ? '#4A868C' : '#666',
              borderBottom: activeTab === 'status' ? '2px solid #4A868C' : 'none',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Clock size={16} />
            My Tickets
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              padding: '12px 24px',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === 'history' ? '#4A868C' : '#666',
              borderBottom: activeTab === 'history' ? '2px solid #4A868C' : 'none',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap'
            }}
          >
            <History size={16} />
            Ticket History
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '12px 24px',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === 'profile' ? '#4A868C' : '#666',
              borderBottom: activeTab === 'profile' ? '2px solid #4A868C' : 'none',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap'
            }}
          >
            <User size={16} />
            Profile
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="dashboard-mobile-menu">
            <button
              onClick={() => {
                setActiveTab('join');
                setIsMobileMenuOpen(false);
              }}
              className={`dashboard-mobile-nav-btn ${activeTab === 'join' ? 'active' : ''}`}
            >
              <Plus size={16} />
              Join Queue
            </button>
            <button
              onClick={() => {
                setActiveTab('status');
                setIsMobileMenuOpen(false);
              }}
              className={`dashboard-mobile-nav-btn ${activeTab === 'status' ? 'active' : ''}`}
            >
              <Clock size={16} />
              My Tickets
            </button>
            <button
              onClick={() => {
                setActiveTab('history');
                setIsMobileMenuOpen(false);
              }}
              className={`dashboard-mobile-nav-btn ${activeTab === 'history' ? 'active' : ''}`}
            >
              <History size={16} />
              Ticket History
            </button>
            <button
              onClick={() => {
                setActiveTab('profile');
                setIsMobileMenuOpen(false);
              }}
              className={`dashboard-mobile-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            >
              <User size={16} />
              Profile
            </button>
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="dashboard-mobile-nav-btn"
              style={{ color: '#ef4444' }}
            >
              Logout
            </button>
          </div>
        )}

        {message && (
          <div style={{
            backgroundColor: message.includes('Success') || message.includes('successfully') ? '#d1fae5' : '#fee2e2',
            color: message.includes('Success') || message.includes('successfully') ? '#065f46' : '#991b1b',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            {message}
          </div>
        )}

        {/* Join Queue Tab */}
        {activeTab === 'join' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#4A868C', marginBottom: '1.5rem' }}>Join a Queue</h2>

            <form onSubmit={handleJoinQueue}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#4A868C',
                  fontWeight: '500'
                }}>
                  Select Office
                </label>
                <select
                  value={selectedOffice}
                  onChange={(e) => setSelectedOffice(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                >
                  <option value="">Choose an office...</option>
                  {offices.map(office => (
                    <option key={office._id} value={office._id}>
                      {office.office_name} - {office.location}
                    </option>
                  ))}
                </select>
              </div>

              {selectedOffice && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    color: '#4A868C',
                    fontWeight: '500'
                  }}>
                    Select Service
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">Choose a service...</option>
                    {services.map(service => (
                      <option key={service._id} value={service._id}>
                        {service.service_name} (Avg wait: {service.avg_wait_time} min)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !selectedService}
                style={{
                  backgroundColor: loading || !selectedService ? '#ccc' : '#4A868C',
                  color: 'white',
                  padding: '14px 28px',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading || !selectedService ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Joining...' : 'Join Queue'}
              </button>
            </form>
          </div>
        )}

        {/* My Tickets Tab */}
        {activeTab === 'status' && (
          <div>
            <h2 style={{ color: '#4A868C', marginBottom: '1.5rem' }}>My Tickets</h2>

            {myTickets.length === 0 ? (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '3rem',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <Users size={48} color="#ccc" style={{ marginBottom: '1rem' }} />
                <p style={{ color: '#666', fontSize: '18px' }}>No active tickets</p>
                <p style={{ color: '#999' }}>Join a queue to see your tickets here</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {myTickets.map(ticket => (
                  <div
                    key={ticket._id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      borderLeft: `4px solid ${getStatusColor(ticket.status)}`
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ color: '#4A868C', marginBottom: '0.5rem' }}>
                          Ticket #{ticket.ticket_number}
                        </h3>
                        <p style={{ color: '#666', margin: 0 }}>
                          Service: {ticket.service_id?.service_name || 'N/A'}
                        </p>
                        <p style={{ color: '#666', margin: 0 }}>
                          Office: {ticket.service_id?.office_id?.office_name || 'N/A'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <QRCodeDisplay ticketNumber={ticket.ticket_number} />
                        <div style={{
                          backgroundColor: getStatusColor(ticket.status),
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>
                          {ticket.status}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '2rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={16} color="#666" />
                        <span style={{ color: '#666' }}>Position: {ticket.position}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} color="#666" />
                        <span style={{ color: '#666' }}>
                          Created: {(() => {
                            const date = ticket.createdAt || ticket.created_at || ticket.timestamp;
                            return date ? new Date(date).toLocaleString() : 'N/A';
                          })()
                          }
                        </span>
                      </div>
                    </div>

                    {ticket.status === 'Waiting' && (
                      <button
                        onClick={() => handleCancelTicket(ticket.ticket_number)}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Cancel Ticket
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ticket History Tab */}
        {activeTab === 'history' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ color: '#4A868C', margin: 0 }}>Ticket History</h2>

              {/* Date Filter */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <label style={{ color: '#666', fontSize: '14px', marginRight: '0.5rem' }}>From:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: '#666', fontSize: '14px', marginRight: '0.5rem' }}>To:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <button
                  onClick={fetchTicketHistory}
                  style={{
                    backgroundColor: '#4A868C',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Filter
                </button>
                {(startDate || endDate) && (
                  <button
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                      fetchTicketHistory();
                    }}
                    style={{
                      backgroundColor: '#6b7280',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {ticketHistory.length === 0 ? (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '3rem',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <Clock size={48} color="#ccc" style={{ marginBottom: '1rem' }} />
                <p style={{ color: '#666', fontSize: '18px' }}>No completed tickets</p>
                <p style={{ color: '#999' }}>Your completed and cancelled tickets will appear here</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {ticketHistory.map(ticket => (
                  <div
                    key={ticket._id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      borderLeft: `4px solid ${getStatusColor(ticket.status)}`
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ color: '#4A868C', marginBottom: '0.5rem' }}>
                          Ticket #{ticket.ticket_number}
                        </h3>
                        <p style={{ color: '#666', margin: 0 }}>
                          Service: {ticket.service_id?.service_name || 'N/A'}
                        </p>
                        <p style={{ color: '#666', margin: 0 }}>
                          Office: {ticket.service_id?.office_id?.office_name || 'N/A'}
                        </p>
                      </div>
                      <div style={{
                        backgroundColor: getStatusColor(ticket.status),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {ticket.status}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '2rem',
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} color="#666" />
                        <span>
                          Created: {(() => {
                            const date = ticket.createdAt || ticket.created_at || ticket.timestamp;
                            return date ? new Date(date).toLocaleDateString() : 'N/A';
                          })()
                          }
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={16} color="#666" />
                        <span>{ticket.service_id?.office_id?.location || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <h2 style={{ color: '#4A868C', marginBottom: '1.5rem' }}>Profile Settings</h2>

            {/* Update Profile */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ color: '#4A868C', marginBottom: '1rem' }}>Personal Information</h3>
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4A868C', fontWeight: '500' }}>Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullname}
                      onChange={(e) => setProfileData({ ...profileData, fullname: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '6px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4A868C', fontWeight: '500' }}>Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '6px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4A868C', fontWeight: '500' }}>Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone_number}
                      onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '6px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? '#ccc' : '#4A868C',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    alignSelf: 'flex-start'
                  }}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ color: '#4A868C', marginBottom: '1rem' }}>Change Password</h3>
              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4A868C', fontWeight: '500' }}>Current Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          paddingRight: '45px',
                          border: '2px solid #e1e5e9',
                          borderRadius: '6px',
                          fontSize: '16px'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#666'
                        }}
                      >
                        {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4A868C', fontWeight: '500' }}>New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          paddingRight: '45px',
                          border: '2px solid #e1e5e9',
                          borderRadius: '6px',
                          fontSize: '16px'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#666'
                        }}
                      >
                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4A868C', fontWeight: '500' }}>Confirm New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          paddingRight: '45px',
                          border: '2px solid #e1e5e9',
                          borderRadius: '6px',
                          fontSize: '16px'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#666'
                        }}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? '#ccc' : '#4A868C',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    alignSelf: 'flex-start'
                  }}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* QR Ticket Modal */}
        {showTicketModal && newTicket && (
          <TicketModal
            ticket={newTicket}
            onClose={() => setShowTicketModal(false)}
          />
        )}

        {/* Required Documents Modal */}
        {showDocumentsModal && selectedServiceForJoin && (
          <DocumentsModal
            service={selectedServiceForJoin}
            onConfirm={confirmJoinQueue}
            onClose={() => {
              setShowDocumentsModal(false);
              setSelectedServiceForJoin(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// QR Code Display Component
const QRCodeDisplay = ({ ticketNumber }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(ticketNumber, {
          width: 80,
          margin: 1,
          color: {
            dark: '#4A868C',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };
    generateQR();
  }, [ticketNumber]);

  return qrCodeUrl ? (
    <img
      src={qrCodeUrl}
      alt={`QR Code for ticket ${ticketNumber}`}
      style={{ width: '60px', height: '60px' }}
    />
  ) : null;
};

// Ticket Modal Component
const TicketModal = ({ ticket, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(ticket.ticket_number, {
          width: 200,
          margin: 2,
          color: {
            dark: '#4A868C',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };
    generateQR();
  }, [ticket.ticket_number]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Queue Ticket - ${ticket.ticket_number}</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            .ticket { border: 2px solid #4A868C; padding: 20px; margin: 20px auto; max-width: 300px; }
            h1 { color: #4A868C; margin-bottom: 10px; }
            .qr-code { margin: 20px 0; }
            .info { margin: 10px 0; color: #666; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <h1>YourTera Queue Ticket</h1>
            <h2>${ticket.ticket_number}</h2>
            <div class="qr-code">
              <img src="${qrCodeUrl}" alt="QR Code" />
            </div>
            <div class="info">Position: ${ticket.position}</div>
            <div class="info">Status: ${ticket.status}</div>
            <div class="info">Generated: ${new Date().toLocaleString()}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{ color: '#4A868C', marginBottom: '1rem' }}>Your Queue Ticket</h2>

        <div style={{
          border: '2px solid #4A868C',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ color: '#4A868C', fontSize: '24px', marginBottom: '1rem' }}>
            {ticket.ticket_number}
          </h3>

          {qrCodeUrl && (
            <img
              src={qrCodeUrl}
              alt={`QR Code for ticket ${ticket.ticket_number}`}
              style={{ marginBottom: '1rem' }}
            />
          )}

          <div style={{ color: '#666', marginBottom: '0.5rem' }}>
            Position: {ticket.position}
          </div>
          <div style={{ color: '#666', marginBottom: '0.5rem' }}>
            Status: {ticket.status}
          </div>
          <div style={{ color: '#999', fontSize: '14px' }}>
            Generated: {new Date().toLocaleString()}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={handlePrint}
            style={{
              backgroundColor: '#4A868C',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Print Ticket
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Required Documents Modal Component
const DocumentsModal = ({ service, onConfirm, onClose }) => {
  const requiredDocs = Array.isArray(service.required_documents)
    ? service.required_documents.filter(doc => doc && doc.trim() !== '')
    : (service.required_documents && service.required_documents.trim() !== ''
      ? [service.required_documents]
      : ['No specific documents required']);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{ color: '#4A868C', marginBottom: '1rem', textAlign: 'center' }}>
          Required Documents
        </h2>

        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ color: '#4A868C', marginBottom: '1rem', fontSize: '18px' }}>
            {service.service_name}
          </h3>

          <p style={{ color: '#666', marginBottom: '1rem', fontSize: '14px' }}>
            Please ensure you have the following documents before joining the queue:
          </p>

          <ol style={{ margin: 0, paddingLeft: '1.5rem', color: '#333' }}>
            {requiredDocs.map((doc, index) => (
              <li key={index} style={{ marginBottom: '0.5rem', fontSize: '15px' }}>
                {doc}
              </li>
            ))}
          </ol>
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              backgroundColor: '#4A868C',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px'
            }}
          >
            Confirm & Join Queue
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;