import { useParams, useNavigate } from "react-router-dom";
import { Bell, Clock, Users } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { queueService } from "../../services/queueService";
import "../../styles/servicedetail.css";
import Navbar from "@/components/layout/navbar"

const servicesData = {
  kebele: {
    title: "Services at Kebele Administration",
    services: [
      {
        name: "Birth Certificate Issuance",
        desc: "Obtain birth certificate for newborn or adult registration",
        requirements: [
          "Valid ID card or passport",
          "Birth notification from hospital",
          "Parent's marriage certificate",
          "Two passport-size photos",
          "Application form (filled)",
          "Service fee payment receipt"
        ]
      },
      {
        name: "Residence Certificate",
        desc: "Get official residence or domicile certificate",
        requirements: [
          "Valid ID card",
          "Rental agreement or house ownership document",
          "Utility bill (recent)",
          "Two passport-size photos",
          "Application form",
          "Service fee payment"
        ]
      },
      {
        name: "Business Permit (Local)",
        desc: "Register small business at kebele level",
        requirements: [
          "Business plan document",
          "Valid ID card",
          "Location permit",
          "Tax clearance certificate",
          "Application form",
          "Registration fee payment"
        ]
      },
    ],
  },

  revenue: {
    title: "Services at Revenue Office",
    services: [
      {
        name: "Business License Registration",
        desc: "Register a new business and obtain operating license",
        requirements: [
          "Business registration certificate",
          "Tax identification number",
          "Bank account statement",
          "Office lease agreement",
          "Application form",
          "License fee payment"
        ]
      },
      {
        name: "Tax Certificate Renewal",
        desc: "Renew your business tax certificate",
        requirements: [
          "Previous tax certificate",
          "Financial statements",
          "Tax payment receipts",
          "Business license",
          "Renewal application",
          "Renewal fee payment"
        ]
      },
      {
        name: "Import/Export Permit",
        desc: "Obtain permit for import/export activities",
        requirements: [
          "Business license",
          "Tax clearance certificate",
          "Bank guarantee letter",
          "Product specifications",
          "Application form",
          "Permit fee payment"
        ]
      },
    ],
  },

  telecom: {
    title: "Services at Telecom Office",
    services: [
      {
        name: "SIM Card Registration",
        desc: "Register new SIM card for mobile services",
        requirements: [
          "Valid ID card or passport",
          "Passport-size photo",
          "Registration form",
          "SIM card fee payment",
          "Address verification",
          "Biometric data"
        ]
      },
      {
        name: "Telecommunications License",
        desc: "Apply for telecommunications operating license",
        requirements: [
          "Company registration certificate",
          "Technical specifications",
          "Financial capability proof",
          "Network infrastructure plan",
          "Application form",
          "License fee payment"
        ]
      },
      {
        name: "Service Provider Registration",
        desc: "Register as internet or mobile service provider",
        requirements: [
          "Business license",
          "Technical qualifications",
          "Equipment specifications",
          "Service area map",
          "Registration form",
          "Registration fee"
        ]
      },
    ],
  },
};

const ServiceDetail = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const data = servicesData[type];

  const handleJoinQueue = async (serviceName) => {
    if (!isAuthenticated) {
      alert('Please sign in to join the queue');
      navigate('/signin');
      return;
    }

    setLoading(true);
    try {
      // For now, we'll use a temporary serviceId based on service type
      // In a real app, you'd fetch actual service IDs from the backend
      const serviceIdMap = {
        'kebele': '507f1f77bcf86cd799439011',
        'revenue': '507f1f77bcf86cd799439012', 
        'telecom': '507f1f77bcf86cd799439013'
      };
      
      const queueData = {
        serviceId: serviceIdMap[type] || '507f1f77bcf86cd799439011',
        service_name: serviceName // Additional info for reference
      };
      
      await queueService.joinQueue(queueData);
      alert('Successfully joined the queue! Check your dashboard for updates.');
      navigate('/customer/dashboard');
    } catch (error) {
      console.error('Error joining queue:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to join queue. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <h2>Service not found</h2>;

  return (
    <>
      <Navbar />

      <div className="container">
        <h1>{data.title}</h1>
        <p>Select a service to view requirements and get your queue ticket.</p>

        <div className="cards">
          {data.services.map((service, index) => (
            <div className="service-detail-card" key={index}>
              <div className="service-header">
                <h2>Service detail</h2>
                <h1>{service.name}</h1>
              </div>

              <div className="requirements-section">
                <h3>Requirements needed for the service</h3>
                <ol>
                  {service.requirements.map((req, reqIndex) => (
                    <li key={reqIndex}>{reqIndex + 1}. {req}</li>
                  ))}
                </ol>
              </div>

              <div className="service-info">
                <div className="info-item">
                  <h4>Estimated service time per person</h4>
                  <div className="info-display">
                    <div className="icon-circle">
                      <Clock size={24} />
                    </div>
                    <span>15 Minutes</span>
                  </div>
                </div>
                <div className="info-item">
                  <h4>Current line length</h4>
                  <div className="info-display">
                    <div className="icon-circle">
                      <Users size={24} />
                    </div>
                    <span>7 people ahead</span>
                  </div>
                </div>
              </div>

              <div className="join-queue-section">
                <button 
                  className="join-queue-btn" 
                  onClick={() => handleJoinQueue(service.name)}
                  disabled={loading}
                >
                  {loading ? 'Joining...' : 'Join queue'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ServiceDetail;