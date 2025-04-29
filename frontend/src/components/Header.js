import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../styles/components/Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
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
              <NavLink
                to="/"
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                onClick={closeMobileMenu}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/crops"
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                onClick={closeMobileMenu}
              >
                Crop Library
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/climate-zones"
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                onClick={closeMobileMenu}
              >
                Climate Zones
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/help"
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                onClick={closeMobileMenu}
              >
                Help
              </NavLink>
            </li>
            <li className="nav-item auth-item">
              <NavLink
                to="/login"
                className="login-button"
                onClick={closeMobileMenu}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="register-button"
                onClick={closeMobileMenu}
              >
                Sign Up
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
