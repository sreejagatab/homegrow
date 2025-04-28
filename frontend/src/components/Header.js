import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCurrentUser, setAuthToken } from '../utils/api';
import '../styles/components/Header.css';

const Header = () => {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check for user on component mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        // User not logged in, remove any stale token
        setAuthToken(null);
      }
    };

    checkUser();
  }, []);

  // Handle logout
  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    // Close mobile menu if open
    setMobileMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo">
          <Link to="/">HomeGrow Forecast</Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
        </div>

        <nav className={`nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/crops" 
                className={`nav-link ${isActive('/crops') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Crop Library
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/climate-zones" 
                className={`nav-link ${isActive('/climate-zones') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Climate Zones
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/help" 
                className={`nav-link ${isActive('/help') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Help
              </Link>
            </li>
            
            {user ? (
              <>
                <li className="nav-item">
                  <Link 
                    to="/dashboard" 
                    className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button 
                    className="nav-link btn-link" 
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item auth-item">
                  <Link 
                    to="/login" 
                    className="nav-link btn-login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item auth-item">
                  <Link 
                    to="/register" 
                    className="nav-link btn-register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
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
