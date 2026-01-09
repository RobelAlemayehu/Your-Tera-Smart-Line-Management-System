import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleProfileClick = () => {
    if (user?.role === 'Admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/customer/dashboard');
    }
  };
  
  return (
    <>
      <nav className={`navbar ${isSticky ? 'navbar-sticky' : ''}`}>
        <div className="navbar-brand" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src="/images/logo.png" alt="YourTera Logo" className="logo-image" />
          <span className="brand-text">YourTera</span>
        </div>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>HOME</Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>ABOUT</Link>
          <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}>SERVICES</Link>
          <Bell className="bell"/>
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <button className="profile-btn" onClick={handleProfileClick} title={`Go to ${user?.role} Dashboard`}>
              <User size={20} />
            </button>
          ) : (
            <button className="login-btn desktop-login-btn" onClick={() => navigate('/signin')}>LOGIN</button>
          )}
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>HOME</Link>
            <Link to="/about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>ABOUT</Link>
            <Link to="/services" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>SERVICES</Link>
            {isAuthenticated ? (
              <button className="mobile-profile-btn" onClick={() => { handleProfileClick(); setIsMobileMenuOpen(false); }}>DASHBOARD</button>
            ) : (
              <button className="mobile-login-btn" onClick={() => { navigate('/signin'); setIsMobileMenuOpen(false); }}>LOGIN</button>
            )}
          </div>
        )}
      </nav>
      <div className="navbar-bottom-line"></div>
    </>
  );
};

export default Navbar;
