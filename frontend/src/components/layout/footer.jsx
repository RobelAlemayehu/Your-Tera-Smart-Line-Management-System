import { Link } from "react-router-dom";
import { Mail, Phone, Instagram, Facebook, Twitter, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-logo">
            <img src="/images/logo.png" alt="YourTera Logo" className="logo-image" />
            <span className="footer-brand-text">YourTera</span>
          </div>
          <p className="footer-description">
            Advanced queue management platform that enables remote queue joining, real-time notifications, 
            and digital ticket systems to transform service delivery across multiple industries.
          </p>
          <div className="working-hours">
            <p className="hours-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} /> Working Hours:
            </p>
            <p>8:00AM-12PM</p>
            <p>1:00PM-8PM</p>
          </div>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Join a Queue</Link></li>
            <li><Link to="/services">Offices</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Connect With Us</h4>
          <ul>
            <li>
              <a href="mailto:info@yourtera.com" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} /> info@yourtera.com
              </a>
            </li>
            <li>
              <a href="tel:+251911234567" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} /> +251 911 234 567
              </a>
            </li>
            <li>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <a href="https://instagram.com/yourtera" target="_blank" rel="noopener noreferrer" title="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="https://facebook.com/yourtera" target="_blank" rel="noopener noreferrer" title="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="https://twitter.com/yourtera" target="_blank" rel="noopener noreferrer" title="Twitter">
                  <Twitter size={20} />
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} YourTera. All rights reserved.</p>
        <div className="footer-legal">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/data">Data Protection</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
