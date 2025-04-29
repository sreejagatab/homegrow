// frontend/src/pages/NotFound.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/NotFound.css';

/**
 * 404 Not Found page
 * @returns {React.ReactNode} Not found page component
 */
const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">
            Return to Home
          </Link>
          <Link to="/help" className="btn-secondary">
            Get Help
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
