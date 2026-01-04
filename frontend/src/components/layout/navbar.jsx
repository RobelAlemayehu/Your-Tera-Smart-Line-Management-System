import { Bell, User } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const goToDashboard = () => {
    if (user?.role === "Admin") {
      navigate("/admin/dashboard")
    } else {
      navigate("/customer/dashboard")
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="/images/logo.png" alt="YourTera Logo" className="logo-image" />
        <span className="brand-text">YourTera</span>
      </div>
      <div className="navbar-links">
        <a href="/" className="nav-link">Home</a>
        <a href="/about" className="nav-link">About</a>
        <a href="/services" className="nav-link">Services</a>
      </div>
      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            <button className="notification-btn">
              <Bell className="bell" />
            </button>
            <button onClick={goToDashboard} className="profile-btn">
              <User className="profile-icon" />
            </button>
          </>
        ) : (
          <>
            <button className="notification-btn">
              <Bell className="bell" />
            </button>
            <a href="/signin" className="login-btn">Login</a>
          </>
        )}
      </div>
    </nav>
  )
}
