import Navbar from '../../components/layout/navbar';
import Footer from '../../components/layout/footer';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Clock, Users, MapPin, CheckCircle, Shield, Smartphone } from 'lucide-react';

const About = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      slug: "revenue-office",
      title: "Revenue Office Queue Management",
      description: "Streamline tax payments, license renewals, and government fee collections with our intelligent queue system.",
      image: "/images/revenue-office.png",
      features: [
        "Digital ticket generation",
        "Real-time queue status",
        "SMS notifications",
        "Priority service handling",
        "Multi-service support"
      ],
      documentation: {
        overview: "Our Revenue Office solution digitizes the entire queue management process, reducing wait times significantly and improving customer satisfaction.",
        howItWorks: [
          "Citizens arrive and scan QR code or use mobile device",
          "System generates digital ticket with estimated wait time",
          "Real-time updates sent via SMS and notifications",
          "Staff call next customer using digital display system",
          "Service completion tracked for workflow optimization"
        ],
        benefits: [
          "Eliminate physical queues and crowding",
          "Reduce average wait time from hours to minutes",
          "Improve staff efficiency with organized workflow",
          "Enhance customer experience and satisfaction"
        ],
        requirements: [
          "Valid ID (Kebele ID, Passport, or Driver's License)",
          "Tax identification number (TIN) for business services",
          "Previous receipts for renewal services",
          "Mobile phone for SMS notifications"
        ]
      }
    },
    {
      id: 2,
      slug: "ethio-telecom",
      title: "Ethio Telecom Customer Service",
      description: "Optimize customer support operations with smart queue management for telecom services and technical support.",
      image: "/images/ethio-telecom.png",
      features: [
        "Service category selection",
        "Technical support queuing",
        "Bill payment integration",
        "SIM card services",
        "Customer feedback system"
      ],
      documentation: {
        overview: "Designed specifically for telecom customer service centers, handling everything from bill payments to technical support with intelligent routing.",
        howItWorks: [
          "Customer selects service type (billing, technical, new connection)",
          "System routes to appropriate service counter",
          "Specialized staff handle specific service categories",
          "Integration with billing and customer management systems",
          "Automated follow-up and satisfaction surveys"
        ],
        benefits: [
          "Reduce customer service wait times significantly",
          "Improve first-call resolution rates",
          "Better resource allocation across service types",
          "Enhanced customer satisfaction tracking",
          "Streamlined billing and payment processes"
        ],
        requirements: [
          "Phone number registered with Ethio Telecom",
          "Account number for billing inquiries",
          "Valid ID for new connections or SIM replacement",
          "Device information for technical support"
        ]
      }
    },
    {
      id: 3,
      slug: "kebele-office",
      title: "Kebele Office Services",
      description: "Digitize community office operations for ID cards, certificates, and local government services.",
      image: "/images/kebele.png",
      features: [
        "ID card processing",
        "Certificate issuance",
        "Residence verification",
        "Birth/death registration",
        "Community service requests"
      ],
      documentation: {
        overview: "Comprehensive solution for Kebele offices to manage citizen services efficiently, from ID issuance to community registrations.",
        howItWorks: [
          "Citizens book appointments for specific services",
          "Document verification and processing queue",
          "Biometric data collection for ID services",
          "Digital certificate generation and printing",
          "Integration with national ID database systems"
        ],
        benefits: [
          "Eliminate long queues for essential documents",
          "Reduce processing time from days to hours",
          "Improve document security and authenticity",
          "Better tracking of citizen service requests",
          "Enhanced transparency in government services"
        ],
        requirements: [
          "Birth certificate for ID applications",
          "Witness statements for residence verification",
          "Previous ID for renewal services",
          "Passport photos (multiple copies)",
          "Supporting documents specific to service type"
        ]
      }
    }
  ];

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Navbar />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: window.innerWidth <= 768 ? '2rem 1rem' : '4rem 1.5rem'
      }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{
            color: '#4A868C',
            fontSize: window.innerWidth <= 768 ? '2.5rem' : '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            About YourTera
          </h1>
          <p style={{
            color: '#666',
            fontSize: '1.25rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            Revolutionizing queue management across Ethiopia with smart, digital solutions
          </p>
        </div>

        {/* Mission, Vision, Impact Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: window.innerWidth <= 768 ? '2rem' : '3rem',
          marginBottom: '6rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#4A868C', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Our Mission
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              To eliminate long waiting lines and improve service efficiency across government offices,
              telecom centers, and public service institutions in Ethiopia.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#4A868C', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Our Vision
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              A future where every Ethiopian can access public services efficiently,
              transparently, and without unnecessary delays through digital innovation.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#4A868C', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Our Impact
            </h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              Serving offices across Ethiopia, reducing wait times significantly,
              and improving customer satisfaction for thousands of users daily.
            </p>
          </div>
        </div>

        {/* Services Documentation Section */}
        <div style={{ marginBottom: '6rem' }}>
          <h2 style={{
            color: '#4A868C',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Our Services & Documentation
          </h2>

          {services.map((service, index) => (
            <ServiceDocumentation key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Technology Stack */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '3rem',
          borderRadius: '12px',
          marginBottom: '4rem'
        }}>
          <h2 style={{
            color: '#4A868C',
            fontSize: '2rem',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            Technology & Features
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <TechFeature
              icon={<Smartphone size={24} />}
              title="Mobile-First Design"
              description="Responsive web platform accessible on any device"
            />
            <TechFeature
              icon={<Shield size={24} />}
              title="Secure & Reliable"
              description="Enterprise-grade security with high uptime guarantee"
            />
            <TechFeature
              icon={<Clock size={24} />}
              title="Real-Time Updates"
              description="Live queue status and instant SMS notifications"
            />
          </div>
        </div>

        {!user && (
          <div style={{
            backgroundColor: '#4A868C',
            color: 'white',
            padding: '3rem',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Ready to Transform Your Service?
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
              Join hundreds of organizations already using YourTera to improve their customer experience.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                Get Started Today
              </button>
              <button
                onClick={() => navigate('/services')}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  padding: '1rem 2rem',
                  border: '2px solid white',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Explore Services
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

// Service Documentation Component
const ServiceDocumentation = ({ service, index }) => {
  const isEven = index % 2 === 0;

  return (
    <div
      id={service.slug}
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        marginBottom: '4rem',
        overflow: 'hidden'
      }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : (isEven ? '1fr 1fr' : '1fr 1fr'),
        minHeight: window.innerWidth <= 768 ? 'auto' : '400px'
      }}>
        {/* Image Section */}
        <div style={{
          order: isEven ? 1 : 2,
          backgroundImage: `url(${service.image})`,
          backgroundSize: service.id === 2 ? 'contain' : 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: service.id === 2 ? '#f8f9fa' : 'transparent',
          minHeight: '400px'
        }} />

        {/* Content Section */}
        <div style={{
          order: window.innerWidth <= 768 ? 2 : (isEven ? 2 : 1),
          padding: window.innerWidth <= 768 ? '2rem 1.5rem' : '3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h3 style={{
            color: '#4A868C',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            {service.title}
          </h3>

          <p style={{
            color: '#666',
            fontSize: '1.1rem',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            {service.description}
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: '#4A868C', marginBottom: '1rem' }}>Key Features:</h4>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {service.features.map((feature, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} style={{ color: '#10b981' }} />
                  <span style={{ color: '#666' }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Documentation */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: window.innerWidth <= 768 ? '2rem 1.5rem' : '3rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {/* Overview */}
          <div>
            <h4 style={{ color: '#4A868C', fontSize: '1.2rem', marginBottom: '1rem' }}>Overview</h4>
            <p style={{ color: '#666', lineHeight: '1.6' }}>{service.documentation.overview}</p>
          </div>

          {/* How It Works */}
          <div>
            <h4 style={{ color: '#4A868C', fontSize: '1.2rem', marginBottom: '1rem' }}>How It Works</h4>
            <ol style={{ color: '#666', paddingLeft: '1.2rem' }}>
              {service.documentation.howItWorks.map((step, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Benefits */}
          <div>
            <h4 style={{ color: '#4A868C', fontSize: '1.2rem', marginBottom: '1rem' }}>Benefits</h4>
            <ul style={{ color: '#666', paddingLeft: '1.2rem' }}>
              {service.documentation.benefits.map((benefit, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>{benefit}</li>
              ))}
            </ul>
          </div>


        </div>
      </div>
    </div>
  );
};

// Technology Feature Component
const TechFeature = ({ icon, title, description }) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        color: '#4A868C',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'center'
      }}>
        {icon}
      </div>
      <h4 style={{
        color: '#4A868C',
        fontSize: '1.1rem',
        marginBottom: '0.5rem'
      }}>
        {title}
      </h4>
      <p style={{
        color: '#666',
        fontSize: '0.9rem',
        lineHeight: '1.5'
      }}>
        {description}
      </p>
    </div>
  );
};

export default About;