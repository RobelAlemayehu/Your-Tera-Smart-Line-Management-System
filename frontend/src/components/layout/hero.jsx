import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="hero">
      <div className="hero-content">
        {/* <div className="hero-badge">
          <span className="badge-icon">⚡</span>
          <span>Smart Queue Technology</span>
        </div> */}
        <h1 className="hero-title">
          Smart Line Management System
        </h1>
        <p className="hero-subtitle">Reduce waiting time, Get Notified.</p>
        {/* <div className="hero-features">
          <div className="feature-item">
            <span className="feature-icon"></span>
            <span>Real-time Updates</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon"></span>
            <span>Zero Wait Time</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon"></span>
            <span>Smart Notifications</span>
          </div> */}
        {/* </div> */}
        {!isAuthenticated && (
          <button className="hero-btn" onClick={() => navigate('/signup')}>
            Get Started
          </button>
        )}
        {isAuthenticated && (
          <button 
            className="hero-btn" 
            onClick={() => navigate('/services')}
            style={{ backgroundColor: '#ff6b35' }}
          >
            Join Queue
          </button>
        )}
      </div>

      <div className="hero-image">
        <img src="/images/hero.png" alt="Queue illustration" />
      </div>
    </section>
  );
};

export default Hero;
