import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="/images/logo.png" alt="YourTera Logo" className="logo-image" />
        <span className="brand-text">YourTera</span>
      </div>

      <div className="navbar-links">
        <Link to="/" className="nav-link">HOME</Link>
        <Link to="/about" className="nav-link">ABOUT</Link>
        <Link to="/services" className="nav-link">SERVICES</Link>
        <Bell className="bell"/>
      </div>

      <div className="navbar-actions">
        <button className="login-btn">LOGIN</button>
      </div>
    </nav>
  );
};

export default Navbar;
