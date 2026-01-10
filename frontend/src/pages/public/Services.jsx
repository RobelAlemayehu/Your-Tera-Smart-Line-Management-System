import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/navbar';
import Footer from '../../components/layout/footer';
import { queueAPI, officeAPI, serviceAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Clock, Users } from 'lucide-react';
import QRCode from 'qrcode';

const Services = () => {
  const [offices, setOffices] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(null); // Track which service is loading
  const [message, setMessage] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedServiceForJoin, setSelectedServiceForJoin] = useState(null);
  const [newTicket, setNewTicket] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('Fetching offices and services...');
      // Use the configured API instead of hardcoded localhost
      const [officesRes, servicesRes] = await Promise.all([
        officeAPI.getOffices(),
        serviceAPI.getServices()
      ]);
      console.log('Offices response:', officesRes.data);
      console.log('Services response:', servicesRes.data);
      setOffices(officesRes.data);
      setServices(servicesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinQueue = async (service) => {
    if (!user) {
      navigate('/signup');
      return;
    }

    // Show documents modal first
    setSelectedServiceForJoin(service);
    setShowDocumentsModal(true);
  };

  const confirmJoinQueue = async () => {
    if (!selectedServiceForJoin) return;

    setJoinLoading(selectedServiceForJoin._id); // Set loading for specific service
    setShowDocumentsModal(false);
    try {
      const response = await queueAPI.joinQueue({
        service_id: selectedServiceForJoin._id,
        phone_number: user.phone_number
      });
      setMessage('Successfully joined the queue!');
      setNewTicket(response.data.data);
      setShowTicketModal(true);
      setSelectedServiceForJoin(null);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to join queue');
    } finally {
      setJoinLoading(null); // Clear loading state
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}>
          <p style={{ color: '#4A868C', fontSize: '18px' }}>Loading services...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ 
            color: '#4A868C', 
            fontSize: '3rem', 
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Our Services
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: '1.25rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            Choose from our available offices and services to join the digital queue
          </p>
        </div>

        {message && (
          <div style={{
            backgroundColor: message.includes('Success') || message.includes('successfully') ? '#d1fae5' : '#fee2e2',
            color: message.includes('Success') || message.includes('successfully') ? '#065f46' : '#991b1b',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}



        {offices.length === 0 && services.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px'
          }}>
            <p style={{ color: '#666', fontSize: '18px' }}>
              No services available at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Show all services if no offices, or group by office */}
            {offices.length === 0 ? (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <h2 style={{ 
                  color: '#4A868C', 
                  fontSize: '1.8rem', 
                  fontWeight: 'bold',
                  marginBottom: '1.5rem'
                }}>
                  Available Services
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1rem'
                }}>
                  {services.map(service => (
                    <ServiceCard key={service._id} service={service} handleJoinQueue={handleJoinQueue} joinLoading={joinLoading} user={user} />
                  ))}
                </div>
              </div>
            ) : (
              offices.map(office => {
                const officeServices = services.filter(service => 
                  service.office_id?._id === office._id || service.office_id === office._id
                );
                
                return (
                  <div
                    key={office._id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '2rem',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h2 style={{ 
                        color: '#4A868C', 
                        fontSize: '1.8rem', 
                        fontWeight: 'bold',
                        marginBottom: '0.5rem'
                      }}>
                        {office.office_name}
                      </h2>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        color: '#666'
                      }}>
                        <MapPin size={16} />
                        <span>{office.location}</span>
                      </div>
                    </div>

                    {officeServices.length === 0 ? (
                      <p style={{ color: '#999', fontStyle: 'italic' }}>
                        No services available for this office
                      </p>
                    ) : (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1rem'
                      }}>
                        {officeServices.map(service => (
                          <ServiceCard key={service._id} service={service} handleJoinQueue={handleJoinQueue} joinLoading={joinLoading} user={user} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {!user && (
          <div style={{
            backgroundColor: '#4A868C',
            color: 'white',
            padding: '3rem',
            borderRadius: '12px',
            textAlign: 'center',
            marginTop: '4rem'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Ready to Skip the Line?
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
              Create an account to join digital queues and get real-time updates
            </p>
            <button
              onClick={() => navigate('/signup')}
              style={{
                backgroundColor: 'white',
                color: '#4A868C',
                padding: '1rem 2rem',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Get Started Now
            </button>
          </div>
        )}
      </div>

      <Footer />

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

      {/* QR Ticket Modal */}
      {showTicketModal && newTicket && (
        <TicketModal 
          ticket={newTicket}
          onClose={() => {
            setShowTicketModal(false);
            setMessage('');
          }}
        />
      )}
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service, handleJoinQueue, joinLoading, user }) => {
  const isLoading = joinLoading === service._id; // Check if this specific service is loading
  
  return (
    <div
      style={{
        backgroundColor: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}
    >
      <h3 style={{ 
        color: '#4A868C', 
        fontSize: '1.2rem',
        marginBottom: '1rem'
      }}>
        {service.service_name}
      </h3>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        marginBottom: '1rem',
        color: '#666'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={16} />
          <span>~{service.avg_wait_time} min wait</span>
        </div>
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

      {service.required_documents && (
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ color: '#4A868C', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Required Documents:</h4>
          <ul style={{ margin: 0, paddingLeft: '1rem', color: '#666', fontSize: '0.85rem' }}>
            {Array.isArray(service.required_documents) 
              ? service.required_documents.map((doc, index) => (
                  <li key={index} style={{ marginBottom: '0.25rem' }}>{doc}</li>
                ))
              : <li>{service.required_documents}</li>
            }
          </ul>
        </div>
      )}

      <button
        onClick={() => handleJoinQueue(service)}
        disabled={!service.is_active || isLoading}
        style={{
          backgroundColor: !service.is_active ? '#ccc' : isLoading ? '#999' : '#4A868C',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '6px',
          cursor: !service.is_active || isLoading ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          width: '100%'
        }}
      >
        {!service.is_active ? 'Service Unavailable' : 
         isLoading ? 'Joining...' : 
         user ? 'Join Queue' : 'Sign Up to Join'}
      </button>
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

export default Services;