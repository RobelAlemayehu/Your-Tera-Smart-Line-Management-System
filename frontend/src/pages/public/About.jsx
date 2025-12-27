import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-title">About YourTera</h1>
          <p className="about-subtitle">
            Revolutionizing queue management across Ethiopia with smart, digital solutions 
            that eliminate waiting times and enhance service delivery.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="mission-vision-container">
          <div className="mission-card">
            <div className="card-icon"></div>
            <h3>Our Mission</h3>
            <p>
              To transform traditional queuing systems into intelligent, digital experiences 
              that save time, reduce stress, and improve service efficiency for millions of Ethiopians.
            </p>
          </div>
          <div className="vision-card">
            <div className="card-icon"></div>
            <h3>Our Vision</h3>
            <p>
              To become Ethiopia's leading queue management platform, enabling seamless 
              service delivery across government offices, healthcare, telecom, and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="our-story">
        <div className="story-container">
          <div className="story-content">
            <h2>Our Story</h2>
            <p>
              Founded in 2025, YourTera emerged from a simple observation: millions of Ethiopians 
              waste countless hours standing in queues every day. Whether at government offices, 
              telecom centers, or healthcare facilities, the traditional first-come-first-served 
              system was outdated and inefficient.
            </p>
            <p>
              Our team of Ethiopian tech innovators set out to solve this problem using modern 
              technology. We developed a comprehensive digital queue management system that allows 
              people to join queues remotely, receive real-time updates, and arrive exactly when 
              their turn comes.
            </p>
          </div>
          <div className="story-image">
            <img src="/images/queue.png" alt="Our story" />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="our-values">
        <div className="values-container">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon"></div>
              <h4>Efficiency</h4>
              <p>We believe time is precious and strive to eliminate unnecessary waiting.</p>
            </div>
            <div className="value-item">
              <div className="value-icon"></div>
              <h4>Accessibility</h4>
              <p>Our solutions are designed for everyone, regardless of technical expertise.</p>
            </div>
            <div className="value-item">
              <div className="value-icon"></div>
              <h4>Reliability</h4>
              <p>We provide dependable systems that organizations can trust.</p>
            </div>
            <div className="value-item">
              {/* <div className="value-icon">🌟</div> */}
              <h4>Innovation</h4>
              <p>We continuously improve our technology to serve Ethiopia better.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="our-impact">
        <div className="impact-container">
          <h2>Our Impact</h2>
          <div className="impact-stats">
            <div className="impact-stat">
              <span className="impact-number">2M+</span>
              <span className="impact-label">Hours Saved</span>
            </div>
            <div className="impact-stat">
              <span className="impact-number">50+</span>
              <span className="impact-label">Partner Organizations</span>
            </div>
            <div className="impact-stat">
              <span className="impact-number">15</span>
              <span className="impact-label">Cities Covered</span>
            </div>
            <div className="impact-stat">
              <span className="impact-number">98%</span>
              <span className="impact-label">Customer Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="cta-container">
          <h2>Ready to Transform Your Service Delivery?</h2>
          <p>Join thousands of organizations already using YourTera to serve their communities better.</p>
          <div className="cta-buttons">
            <button className="cta-btn primary" onClick={() => navigate('/signup')}>
              Get Started Today
            </button>
            {/* <button className="cta-btn secondary" onClick={() => navigate('/contact')}>
              Contact Our Team
            </button> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;