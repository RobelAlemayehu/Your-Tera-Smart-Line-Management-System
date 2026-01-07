import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, officeAPI, serviceAPI } from '../../services/api';
import { Users, Clock, CheckCircle, XCircle, Plus, Settings, BarChart3, Edit, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState({});
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [offices, setOffices] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Edit/Delete modals
  const [showEditOfficeModal, setShowEditOfficeModal] = useState(false);
  const [showDeleteOfficeModal, setShowDeleteOfficeModal] = useState(false);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [showDeleteServiceModal, setShowDeleteServiceModal] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [editOfficeData, setEditOfficeData] = useState({ office_name: '', location: '' });
  const [editServiceData, setEditServiceData] = useState({ office_id: '', service_name: '', avg_wait_time: '', required_documents: [''] });

  // New office form
  const [newOffice, setNewOffice] = useState({
    office_name: '',
    location: ''
  });

  // New service form
  const [newService, setNewService] = useState({
    office_id: '',
    service_name: '',
    avg_wait_time: '',
    required_documents: ['']
  });

  // Calculate analytics from tickets data
  const calculateAnalytics = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTickets = tickets.filter(ticket => {
      const ticketDate = new Date(ticket.createdAt);
      return ticketDate >= today && ticketDate < tomorrow;
    });

    const completedToday = tickets.filter(ticket => {
      const updatedDate = new Date(ticket.updatedAt);
      return ticket.status === 'Completed' && updatedDate >= today && updatedDate < tomorrow;
    });

    return {
      totalTickets: todayTickets.length,
      waitingTickets: tickets.filter(t => t.status === 'Waiting').length,
      servingTickets: tickets.filter(t => t.status === 'Serving').length,
      completedTickets: completedToday.length
    };
  };

  // Update analytics whenever tickets change
  useEffect(() => {
    if (tickets.length >= 0) {
      const calculatedAnalytics = calculateAnalytics();
      setAnalytics(calculatedAnalytics);
    }
  }, [tickets]);

  useEffect(() => {
    fetchTickets();
    fetchUsers();
    fetchOffices();
    fetchServices();
    
    // Refresh tickets every 30 seconds
    const interval = setInterval(fetchTickets, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await adminAPI.getAllTickets();
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

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
      const response = await serviceAPI.getServices();
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleCallNext = async () => {
    setLoading(true);
    try {
      await adminAPI.callNext({});
      setMessage('Next customer called successfully');
      fetchTickets(); // This will trigger analytics recalculation
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to call next customer');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTicket = async (ticketId) => {
    try {
      await adminAPI.completeTicket(ticketId);
      setMessage('Ticket completed successfully');
      fetchTickets(); // This will trigger analytics recalculation
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to complete ticket');
    }
  };

  const handleUpdateTicketStatus = async (ticketId, status) => {
    try {
      await adminAPI.updateTicketStatus(ticketId, { status });
      setMessage(`Ticket status updated to ${status}`);
      fetchTickets(); // This will trigger analytics recalculation
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update ticket status');
    }
  };

  const handleAddOffice = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAPI.addOffice(newOffice);
      setMessage('Office added successfully');
      setNewOffice({ office_name: '', location: '' });
      fetchOffices();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to add office');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAPI.addService(newService);
      setMessage('Service added successfully');
      setNewService({ office_id: '', service_name: '', avg_wait_time: '', required_documents: [''] });
      fetchServices();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to add service');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeUserRole = async (userId, newRole) => {
    try {
      await adminAPI.changeUserRole(userId, { role: newRole });
      setMessage(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update user role');
    }
  };

  // Office edit/delete handlers
  const handleEditOffice = (office) => {
    setSelectedOffice(office);
    setEditOfficeData({ office_name: office.office_name, location: office.location });
    setShowEditOfficeModal(true);
  };

  const handleDeleteOffice = (office) => {
    setSelectedOffice(office);
    setShowDeleteOfficeModal(true);
  };

  const confirmEditOffice = async () => {
    setLoading(true);
    try {
      await adminAPI.updateOffice(selectedOffice._id, editOfficeData);
      setMessage('Office updated successfully');
      setShowEditOfficeModal(false);
      fetchOffices();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update office');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteOffice = async () => {
    console.log('Attempting to delete office:', selectedOffice);
    setLoading(true);
    try {
      const response = await adminAPI.deleteOffice(selectedOffice._id);
      console.log('Delete office response:', response);
      setMessage('Office deleted successfully');
      setShowDeleteOfficeModal(false);
      fetchOffices();
      fetchServices(); // Refresh services as they might be affected
    } catch (error) {
      console.error('Delete office error:', error);
      setMessage(error.response?.data?.error || 'Failed to delete office');
    } finally {
      setLoading(false);
    }
  };

  // Service edit/delete handlers
  const handleEditService = (service) => {
    setSelectedService(service);
    setEditServiceData({
      office_id: service.office_id?._id || '',
      service_name: service.service_name,
      avg_wait_time: service.avg_wait_time,
      required_documents: Array.isArray(service.required_documents) ? service.required_documents : [service.required_documents || '']
    });
    setShowEditServiceModal(true);
  };

  const handleDeleteService = (service) => {
    setSelectedService(service);
    setShowDeleteServiceModal(true);
  };

  const confirmEditService = async () => {
    setLoading(true);
    try {
      await adminAPI.updateService(selectedService._id, editServiceData);
      setMessage('Service updated successfully');
      setShowEditServiceModal(false);
      fetchServices();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update service');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteService = async () => {
    console.log('Attempting to delete service:', selectedService);
    setLoading(true);
    try {
      const response = await adminAPI.deleteService(selectedService._id);
      console.log('Delete service response:', response);
      setMessage('Service deleted successfully');
      setShowDeleteServiceModal(false);
      fetchServices();
    } catch (error) {
      console.error('Delete service error:', error);
      setMessage(error.response?.data?.error || 'Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  // Filter tickets based on date and status
  const filteredTickets = tickets.filter(ticket => {
    const ticketDate = new Date(ticket.createdAt).toISOString().split('T')[0];
    const matchesDate = !dateFilter || ticketDate === dateFilter;
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    return matchesDate && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Waiting': return '#f59e0b';
      case 'Serving': return '#10b981';
      case 'Completed': return '#6b7280';
      case 'Cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>{title}</p>
          <p style={{ color: '#333', fontSize: '24px', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>
            {value}
          </p>
        </div>
        <Icon size={32} color={color} />
      </div>
    </div>
  );

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
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ color: '#4A868C', fontSize: '24px', fontWeight: 'bold' }}>
              Admin Dashboard
            </h1>
            <p style={{ color: '#666', margin: 0 }}>Welcome, {user.fullname}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={handleCallNext}
              disabled={loading}
              style={{
                backgroundColor: loading ? '#ccc' : '#10b981',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '600'
              }}
            >
              {loading ? 'Calling...' : 'Call Next'}
            </button>
            <button
              onClick={logout}
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

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem', paddingTop: '180px' }}>
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '2px solid #e5e7eb',
          overflowX: 'auto',
          position: 'fixed',
          top: '90px',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          zIndex: 999,
          padding: '1rem 1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {[
            { key: 'overview', label: 'Overview', icon: BarChart3 },
            { key: 'tickets', label: 'Queue Management', icon: Clock },
            { key: 'services', label: 'Services', icon: Settings },
            { key: 'users', label: 'Users', icon: Users }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeTab === key ? '#4A868C' : '#666',
                borderBottom: activeTab === key ? '2px solid #4A868C' : 'none',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {message && (
          <div style={{
            backgroundColor: message.includes('success') ? '#d1fae5' : '#fee2e2',
            color: message.includes('success') ? '#065f46' : '#991b1b',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            {message}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <StatCard
                title="Total Tickets Today"
                value={analytics.totalTickets || 0}
                icon={Clock}
                color="#4A868C"
              />
              <StatCard
                title="Currently Waiting"
                value={analytics.waitingTickets || 0}
                icon={Users}
                color="#f59e0b"
              />
              <StatCard
                title="Being Served"
                value={analytics.servingTickets || 0}
                icon={CheckCircle}
                color="#10b981"
              />
              <StatCard
                title="Completed Today"
                value={analytics.completedTickets || 0}
                icon={CheckCircle}
                color="#6b7280"
              />
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ color: '#4A868C', marginBottom: '1rem' }}>Recent Activity</h3>
              <p style={{ color: '#666' }}>
                System is running smoothly. {analytics.totalTickets || 0} tickets processed today.
              </p>
            </div>
          </div>
        )}

        {/* Queue Management Tab */}
        {activeTab === 'tickets' && (
          <div>
            <h2 style={{ color: '#4A868C', marginBottom: '1.5rem' }}>Queue Management</h2>
            
            {/* Filters */}
            <div className="filter-container">
              <div className="filter-row">
                <div className="filter-group">
                  <label className="filter-label">Filter by Date</label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="filter-date-input"
                    placeholder="Select date"
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">Filter by Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Statuses</option>
                    <option value="Waiting">Waiting</option>
                    <option value="Serving">Serving</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <button
                  onClick={() => { setDateFilter(''); setStatusFilter(''); }}
                  className="clear-filters-btn"
                  title="Clear all filters"
                >
                  Clear Filters
                </button>
              </div>
            </div>
            
            {filteredTickets.length === 0 ? (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '3rem',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <Clock size={48} color="#ccc" style={{ marginBottom: '1rem' }} />
                <p style={{ color: '#666', fontSize: '18px' }}>No active tickets</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {filteredTickets.map(ticket => (
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
                      <div>
                        <h3 style={{ color: '#4A868C', marginBottom: '0.5rem' }}>
                          Ticket #{ticket.ticket_number}
                        </h3>
                        <p style={{ color: '#666', margin: 0 }}>
                          Customer: {ticket.user_id?.fullname || 'N/A'}
                        </p>
                        <p style={{ color: '#666', margin: 0 }}>
                          Phone: {ticket.phone_number}
                        </p>
                        <p style={{ color: '#666', margin: 0 }}>
                          Service: {ticket.service_id?.service_name || 'N/A'}
                        </p>
                        {ticket.service_id?.required_documents && (
                          <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
                            Required: {Array.isArray(ticket.service_id.required_documents) ? ticket.service_id.required_documents.join(', ') : ticket.service_id.required_documents}
                          </p>
                        )}
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
                      gap: '1rem',
                      marginTop: '1rem'
                    }}>
                      {ticket.status === 'Waiting' && (
                        <button
                          onClick={() => handleUpdateTicketStatus(ticket._id, 'Serving')}
                          style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          Start Serving
                        </button>
                      )}
                      {ticket.status === 'Serving' && (
                        <button
                          onClick={() => handleCompleteTicket(ticket._id)}
                          style={{
                            backgroundColor: '#4A868C',
                            color: 'white',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          Complete
                        </button>
                      )}
                      {(ticket.status === 'Waiting' || ticket.status === 'Serving') && (
                        <button
                          onClick={() => handleUpdateTicketStatus(ticket._id, 'Cancelled')}
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
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            <h2 style={{ color: '#4A868C', marginBottom: '1.5rem' }}>Service Management</h2>
            
            {/* Add New Office */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ color: '#4A868C', marginBottom: '1rem' }}>Add New Office</h3>
              <form onSubmit={handleAddOffice} style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Office Name"
                    value={newOffice.office_name}
                    onChange={(e) => setNewOffice({ ...newOffice, office_name: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    placeholder="Location"
                    value={newOffice.location}
                    onChange={(e) => setNewOffice({ ...newOffice, location: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? '#ccc' : '#10b981',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Add Office
                </button>
              </form>
            </div>

            {/* Add New Service */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ color: '#4A868C', marginBottom: '1rem' }}>Add New Service</h3>
              <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <select
                    value={newService.office_id}
                    onChange={(e) => setNewService({ ...newService, office_id: e.target.value })}
                    required
                    style={{
                      padding: '12px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">Select Office</option>
                    {offices.map(office => (
                      <option key={office._id} value={office._id}>
                        {office.office_name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Service Name"
                    value={newService.service_name}
                    onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
                    required
                    style={{
                      padding: '12px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Avg Wait Time (min)"
                    value={newService.avg_wait_time}
                    onChange={(e) => setNewService({ ...newService, avg_wait_time: e.target.value })}
                    required
                    style={{
                      padding: '12px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '6px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '400px' }}>
                  <label style={{ color: '#4A868C', fontWeight: '500' }}>Required Documents</label>
                  {newService.required_documents.map((doc, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder={`Document ${index + 1}`}
                        value={doc}
                        onChange={(e) => {
                          const updatedDocs = [...newService.required_documents];
                          updatedDocs[index] = e.target.value;
                          setNewService({ ...newService, required_documents: updatedDocs });
                        }}
                        required
                        style={{
                          padding: '12px',
                          border: '2px solid #e1e5e9',
                          borderRadius: '6px',
                          fontSize: '16px',
                          flex: 1
                        }}
                      />
                      {newService.required_documents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updatedDocs = newService.required_documents.filter((_, i) => i !== index);
                            setNewService({ ...newService, required_documents: updatedDocs });
                          }}
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            minWidth: '70px'
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setNewService({ ...newService, required_documents: [...newService.required_documents, ''] });
                    }}
                    style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      alignSelf: 'flex-start'
                    }}
                  >
                    Add Document
                  </button>
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
                  Add Service
                </button>
              </form>
            </div>

            {/* Offices List */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ color: '#4A868C', marginBottom: '1rem' }}>Offices</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {offices.map(office => (
                  <div
                    key={office._id}
                    style={{
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      padding: '1rem',
                      border: '1px solid #e1e5e9'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ color: '#4A868C', marginBottom: '0.25rem', margin: 0 }}>
                          {office.office_name}
                        </h4>
                        <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
                          Location: {office.location}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEditOffice(office)}
                          style={{
                            backgroundColor: '#4A868C',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Edit Office"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteOffice(office)}
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Delete Office"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services List */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ color: '#4A868C', marginBottom: '1rem' }}>Services</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {services.map(service => (
                  <div
                    key={service._id}
                    style={{
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      padding: '1rem',
                      border: '1px solid #e1e5e9'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <h4 style={{ color: '#4A868C', margin: 0 }}>
                            {service.service_name}
                          </h4>
                          <div style={{
                            backgroundColor: service.is_active ? '#10b981' : '#ef4444',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            {service.is_active ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                        <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
                          Office: {service.office_id?.office_name || 'N/A'}
                        </p>
                        <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
                          Average Wait Time: {service.avg_wait_time} minutes
                        </p>
                        <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
                          Required Documents: {Array.isArray(service.required_documents) ? service.required_documents.join(', ') : service.required_documents || 'N/A'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEditService(service)}
                          style={{
                            backgroundColor: '#4A868C',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Edit Service"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service)}
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Delete Service"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{ color: '#4A868C', marginBottom: '1.5rem' }}>User Management</h2>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {users.map(user => (
                <div
                  key={user._id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ color: '#4A868C', marginBottom: '0.5rem' }}>
                        {user.fullname}
                      </h3>
                      <p style={{ color: '#666', margin: 0 }}>Email: {user.email}</p>
                      <p style={{ color: '#666', margin: 0 }}>Phone: {user.phone_number}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeUserRole(user._id, e.target.value)}
                        className="user-role-select"
                      >
                        <option value="Customer">Customer</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Office Modal */}
      {showEditOfficeModal && (
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
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ color: '#4A868C', marginBottom: '1rem' }}>Edit Office</h3>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Office Name"
                value={editOfficeData.office_name}
                onChange={(e) => setEditOfficeData({ ...editOfficeData, office_name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '6px',
                  fontSize: '16px',
                  marginBottom: '1rem'
                }}
              />
              <input
                type="text"
                placeholder="Location"
                value={editOfficeData.location}
                onChange={(e) => setEditOfficeData({ ...editOfficeData, location: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowEditOfficeModal(false)}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmEditOffice}
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#ccc' : '#4A868C',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Updating...' : 'Update Office'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Office Modal */}
      {showDeleteOfficeModal && (
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
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>Delete Office</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Are you sure you want to delete "{selectedOffice?.office_name}"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDeleteOfficeModal(false)}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteOffice}
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#ccc' : '#ef4444',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Deleting...' : 'Delete Office'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditServiceModal && (
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
            maxWidth: '600px',
            width: '90%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ color: '#4A868C', marginBottom: '1rem' }}>Edit Service</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <select
                value={editServiceData.office_id}
                onChange={(e) => setEditServiceData({ ...editServiceData, office_id: e.target.value })}
                style={{
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              >
                <option value="">Select Office</option>
                {offices.map(office => (
                  <option key={office._id} value={office._id}>
                    {office.office_name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Service Name"
                value={editServiceData.service_name}
                onChange={(e) => setEditServiceData({ ...editServiceData, service_name: e.target.value })}
                style={{
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
              <input
                type="number"
                placeholder="Avg Wait Time (min)"
                value={editServiceData.avg_wait_time}
                onChange={(e) => setEditServiceData({ ...editServiceData, avg_wait_time: e.target.value })}
                style={{
                  padding: '12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
              <div>
                <label style={{ color: '#4A868C', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>Required Documents</label>
                {editServiceData.required_documents.map((doc, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder={`Document ${index + 1}`}
                      value={doc}
                      onChange={(e) => {
                        const updatedDocs = [...editServiceData.required_documents];
                        updatedDocs[index] = e.target.value;
                        setEditServiceData({ ...editServiceData, required_documents: updatedDocs });
                      }}
                      style={{
                        padding: '12px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '6px',
                        fontSize: '16px',
                        flex: 1
                      }}
                    />
                    {editServiceData.required_documents.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updatedDocs = editServiceData.required_documents.filter((_, i) => i !== index);
                          setEditServiceData({ ...editServiceData, required_documents: updatedDocs });
                        }}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '8px 12px',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setEditServiceData({ ...editServiceData, required_documents: [...editServiceData.required_documents, ''] });
                  }}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  Add Document
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowEditServiceModal(false)}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmEditService}
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#ccc' : '#4A868C',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Updating...' : 'Update Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Service Modal */}
      {showDeleteServiceModal && (
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
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>Delete Service</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              Are you sure you want to delete "{selectedService?.service_name}"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDeleteServiceModal(false)}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteService}
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#ccc' : '#ef4444',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Deleting...' : 'Delete Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;