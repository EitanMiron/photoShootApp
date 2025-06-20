import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const CameraLogo = () => (
  <svg
    width="45"
    height="45"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginRight: '0.7rem', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.18))' }}
  >
    <defs>
      <radialGradient id="camera3d" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#6dd5ed" />
        <stop offset="100%" stopColor="#2193b0" />
      </radialGradient>
    </defs>
    <rect x="6" y="14" width="36" height="22" rx="4" fill="url(#camera3d)" />
    <rect x="14" y="8" width="20" height="8" rx="3" fill="#222" />
    <circle cx="24" cy="25" r="7" fill="#fff" stroke="#222" strokeWidth="2" />
    <circle cx="24" cy="25" r="4" fill="url(#camera3d)" />
    <rect x="34" y="19" width="4" height="4" rx="2" fill="#fff" />
    <rect x="10" y="19" width="4" height="4" rx="2" fill="#fff" />
    <ellipse cx="24" cy="36" rx="10" ry="2" fill="#222" opacity="0.12" />
  </svg>
);

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    logout();
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <header className="header">
      {loading && (
        <div className="logout-loading-overlay">
          <div className="logout-loading-spinner">Logging out...</div>
        </div>
      )}
      <div className="header-content">
        <Link to="/" className="header-title app-title">
          <CameraLogo />
          <span>PhotoShoot App</span>
        </Link>
        
        <nav>
          <ul className="nav-list">
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            
            {user ? (
              <>
                <li>
                  <Link to="/bookings" className="nav-link">
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="nav-link">
                    Profile
                  </Link>
                </li>
                <li className="user-menu">
                  <span className="user-name">Hello, {user.name}</span>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="nav-link">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 