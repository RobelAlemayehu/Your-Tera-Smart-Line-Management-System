import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

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
        <button className="hero-btn" onClick={() => navigate('/signup')}>
            Get Started
          </button>
      </div>

      <div className="hero-image">
        <img src="/images/hero.png" alt="Queue illustration" />
      </div>
    </section>
  );
};

export default Hero;
