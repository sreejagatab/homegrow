// frontend/src/components/LoadingSpinner.js

import React from 'react';
import '../styles/components/LoadingSpinner.css';

/**
 * Loading spinner component
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the spinner (small, medium, large)
 * @param {string} props.color - Color of the spinner (primary, secondary, white)
 * @returns {React.ReactNode} Loading spinner component
 */
const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
  const spinnerClasses = `loading-spinner spinner-${size} spinner-${color}`;
  
  return (
    <div className={spinnerClasses}>
      <div className="spinner-circle"></div>
    </div>
  );
};

export default LoadingSpinner;
