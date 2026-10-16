import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { registrations } = useBooking();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏨</span>
          <span className="logo-text">
            <strong>LuxeStay</strong>
            <span className="logo-sub">Hotel Registration</span>
          </span>
        </Link>

        <nav className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Home
          </NavLink>
          <NavLink
            to="/hotels"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Hotels
          </NavLink>
          <NavLink
            to="/booking/room"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Book Room
          </NavLink>
          <NavLink
            to="/registrations"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            My Registrations
            {registrations.length > 0 && (
              <span className="badge-count">{registrations.length}</span>
            )}
          </NavLink>
        </nav>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-profile-badge">
              <div className="user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <span className="user-name">{user.username}</span>
                <span className="user-status">{user.memberStatus || "Member"}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout" title="Sign Out">
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-login-nav">
              Sign In / Register
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
