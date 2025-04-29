// frontend/src/pages/SavedForecasts.js

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ForecastContext } from '../contexts/ForecastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/pages/SavedForecasts.css';

/**
 * Saved Forecasts page component
 * @returns {React.ReactNode} Saved forecasts page
 */
const SavedForecasts = () => {
  const {
    forecastHistory,
    loading,
    error
  } = useContext(ForecastContext);

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // If loading, show loading spinner
  if (loading) {
    return (
      <div className="saved-forecasts-container">
        <div className="loading-state">
          <LoadingSpinner size="large" />
          <p>Loading your saved forecasts...</p>
        </div>
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className="saved-forecasts-container">
        <div className="error-state">
          <h2>Error Loading Forecasts</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-forecasts-container">
      <div className="saved-forecasts-header">
        <h1>Your Saved Forecasts</h1>
        <p>View and manage your previously saved crop forecasts</p>
      </div>

      {forecastHistory.length === 0 ? (
        <div className="empty-state">
          <h2>No Saved Forecasts</h2>
          <p>You haven't saved any forecasts yet. Generate a forecast to get started!</p>
          <Link to="/" className="btn-primary">Create New Forecast</Link>
        </div>
      ) : (
        <div className="forecasts-list">
          {forecastHistory.map((forecast) => (
            <div key={forecast.id} className="forecast-card">
              <div className="forecast-card-header">
                <h3>{forecast.name || 'Unnamed Forecast'}</h3>
                <span className="forecast-date">{formatDate(forecast.createdAt)}</span>
              </div>

              <div className="forecast-details">
                <div className="forecast-detail">
                  <span className="detail-label">Climate:</span>
                  <span className="detail-value">{forecast.params.climate}</span>
                </div>

                <div className="forecast-detail">
                  <span className="detail-label">Environment:</span>
                  <span className="detail-value">{forecast.params.environment}</span>
                </div>

                <div className="forecast-detail">
                  <span className="detail-label">Area:</span>
                  <span className="detail-value">{forecast.params.area} m²</span>
                </div>

                <div className="forecast-detail">
                  <span className="detail-label">Crops:</span>
                  <span className="detail-value">
                    {forecast.crops.map(crop => crop.name).join(', ')}
                  </span>
                </div>
              </div>

              <div className="forecast-card-actions">
                <Link to={`/forecast/${forecast.id}`} className="btn-secondary">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedForecasts;
