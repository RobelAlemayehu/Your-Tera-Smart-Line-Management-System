import { useNavigate } from "react-router-dom";

const ServicesHeader = () => {
  const navigate = useNavigate();

  const handleTryNow = () => {
    navigate('/services');
  };

  return (
    <section className="services-header">
      <div className="services-badge">
        {/* <span className="badge-text">Smart Queue Solutions</span> */}
      </div>
      
      <h2 className="services-title">Our Services</h2>
      
      <p className="services-main-text">
        Transform Your Service Delivery with Digital Queue Management
      </p>
      
      <p className="services-subtitle">
        From government offices to telecom centers, we digitize queues to reduce waiting times, 
        improve customer satisfaction, and streamline operations across Ethiopia.
      </p>
      
      <div className="services-stats">
        <div className="stat-item">
          <span className="stat-number">50+</span>
          <span className="stat-label">Offices Served</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">85%</span>
          <span className="stat-label">Time Reduction</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">10K+</span>
          <span className="stat-label">Happy Users</span>
        </div>
      </div>
      
      <div className="services-actions">
        <button className="services-btn primary" onClick={handleTryNow}>
          Explore Services
        </button>
        {/* <button className="services-btn secondary" onClick={() => navigate('/contact')}>
          Contact Sales
        </button> */}
      </div>
    </section>
  );
};

export default ServicesHeader;
