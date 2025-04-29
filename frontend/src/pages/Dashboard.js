import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ForecastContext } from '../contexts/ForecastContext';
import { getForecastHistory } from '../utils/api';
import '../styles/pages/Dashboard.css';

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useContext(ForecastContext);
  const [forecastHistory, setForecastHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch user's forecast history
    const fetchForecastHistory = async () => {
      try {
        setLoading(true);
        const history = await getForecastHistory(user.id);
        setForecastHistory(history);
      } catch (err) {
        setError('Failed to load forecast history. Please try again later.');
        console.error('Error fetching forecast history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchForecastHistory();
  }, [isAuthenticated, navigate, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <p className="welcome-message">Welcome back, {user?.name || 'Gardener'}!</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <div className="user-profile">
            <div className="profile-image">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="profile-info">
              <h3>{user?.name || 'User'}</h3>
              <p>{user?.email || 'email@example.com'}</p>
            </div>
          </div>

          <div className="sidebar-menu">
            <Link to="/dashboard" className="menu-item active">
              <span className="menu-icon">📊</span>
              Dashboard
            </Link>
            <Link to="/forecast" className="menu-item">
              <span className="menu-icon">🌱</span>
              New Forecast
            </Link>
            <Link to="/profile" className="menu-item">
              <span className="menu-icon">👤</span>
              Profile Settings
            </Link>
            <button onClick={handleLogout} className="menu-item logout-button">
              <span className="menu-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>

        <div className="dashboard-main">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <Link to="/forecast" className="action-card">
                <div className="action-icon">🌱</div>
                <h3>Create New Forecast</h3>
                <p>Plan your next planting with a customized forecast</p>
              </Link>
              <Link to="/crops" className="action-card">
                <div className="action-icon">🍅</div>
                <h3>Browse Crops</h3>
                <p>Explore our library of vegetable crops</p>
              </Link>
              <Link to="/climate-zones" className="action-card">
                <div className="action-icon">🌍</div>
                <h3>Climate Zones</h3>
                <p>Learn about different growing environments</p>
              </Link>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Forecasts</h2>
            </div>

            {loading ? (
              <div className="loading-message">Loading your forecast history...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : forecastHistory.length === 0 ? (
              <div className="empty-state">
                <p>You haven't created any forecasts yet.</p>
                <Link to="/forecast" className="create-forecast-button">
                  Create Your First Forecast
                </Link>
              </div>
            ) : (
              <div className="forecast-history">
                {forecastHistory.map((forecast) => (
                  <div key={forecast.id} className="forecast-card">
                    <div className="forecast-info">
                      <h3>{forecast.name || 'Unnamed Forecast'}</h3>
                      <p className="forecast-date">
                        Created on {new Date(forecast.createdAt).toLocaleDateString()}
                      </p>
                      <div className="forecast-crops">
                        {forecast.crops.map((crop) => (
                          <span key={crop} className="crop-tag">
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="forecast-actions">
                      <Link to={`/forecast/${forecast.id}`} className="view-button">
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
