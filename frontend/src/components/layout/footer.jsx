import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-logo">
            <img src="/images/logo.png" alt="YourTera Logo" className="logo-image" />
          </div>
          <p className="footer-description">
            Digitizing physical queues to reduce waiting time and improve service efficiency for offices, hospitals, and
            service centers.
          </p>
          <div className="working-hours">
            <p className="hours-title">🕐 Working Hours:</p>
            <p>8:00AM-12PM</p>
            <p>1:00PM-8PM</p>
          </div>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/queue">Join a Queue</Link></li>
            <li><Link to="/offices">Offices</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/status">Queue Status</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Connect With Us</h4>
          <ul>
            <li><Link to="/support">Support Center</Link></li>
            <li><Link to="/contact">Contact us</Link></li>
            <li><Link to="/status">System Status</Link></li>
            <li><Link to="/docs">Documentation</Link></li>
            <li><Link to="/admin">Admin Login</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Smart Line Management System. All rights reserved.</p>
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
