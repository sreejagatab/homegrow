import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/components/ApiStatus.css';

const ApiStatus = () => {
  const [apiStatus, setApiStatus] = useState({
    server: 'checking',
    crops: 'checking',
    climateZones: 'checking'
  });
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    const checkApiStatus = async () => {
      let serverError = null;

      // Check server health
      try {
        const response = await axios.get('/api/health', { timeout: 5000 });
        console.log('Health check response:', response.data);

        if (response.data && response.data.success) {
          setApiStatus(prev => ({ ...prev, server: 'online' }));

          // Check database status
          if (response.data.database && response.data.database.status === 'connected') {
            console.log('Database is connected');
          } else {
            console.warn('Database is not connected:', response.data.database);
            serverError = `Database issue: ${response.data.database.status}`;
            if (response.data.database.error) {
              serverError += ` - ${response.data.database.error}`;
            }
          }
        } else {
          setApiStatus(prev => ({ ...prev, server: 'offline' }));
          serverError = 'Server responded but with an invalid format';
        }
      } catch (error) {
        console.error('Server health check failed:', error);
        setApiStatus(prev => ({ ...prev, server: 'offline' }));

        // Capture error details
        if (error.code === 'ECONNABORTED') {
          serverError = 'Connection timeout. The server is not responding.';
        } else if (error.code === 'ERR_NETWORK') {
          serverError = 'Network error. The server might be down or not running.';
        } else if (error.response) {
          serverError = `Server responded with status: ${error.response.status}`;
        } else {
          serverError = error.message || 'Unknown server error';
        }
      }

      if (serverError) {
        setErrorDetails(serverError);
      }

      // Only check other endpoints if server is online
      const currentStatus = apiStatus.server;
      if (currentStatus === 'online') {
        // Check crops endpoint
        try {
          await axios.get('/api/forecast/crops', { timeout: 5000 });
          setApiStatus(prev => ({ ...prev, crops: 'online' }));
        } catch (error) {
          console.error('Crops API test failed:', error);
          setApiStatus(prev => ({ ...prev, crops: 'offline' }));
        }

        // Check climate zones endpoint
        try {
          await axios.get('/api/forecast/climate-zones', { timeout: 5000 });
          setApiStatus(prev => ({ ...prev, climateZones: 'online' }));
        } catch (error) {
          console.error('Climate zones API test failed:', error);
          setApiStatus(prev => ({ ...prev, climateZones: 'offline' }));
        }
      } else if (currentStatus === 'offline') {
        // If server is offline, mark all endpoints as offline
        setApiStatus(prev => ({
          ...prev,
          crops: 'offline',
          climateZones: 'offline'
        }));
      }
    };

    checkApiStatus();
  }, []);

  return (
    <div className="api-status-container">
      <h3>API Status</h3>
      <div className="api-status-grid">
        <div className="api-status-item">
          <span className="api-label">Server:</span>
          <span className={`api-status ${apiStatus.server}`}>
            {apiStatus.server === 'checking' ? 'Checking...' :
             apiStatus.server === 'online' ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="api-status-item">
          <span className="api-label">Crops API:</span>
          <span className={`api-status ${apiStatus.crops}`}>
            {apiStatus.crops === 'checking' ? 'Checking...' :
             apiStatus.crops === 'online' ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="api-status-item">
          <span className="api-label">Climate Zones API:</span>
          <span className={`api-status ${apiStatus.climateZones}`}>
            {apiStatus.climateZones === 'checking' ? 'Checking...' :
             apiStatus.climateZones === 'online' ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {apiStatus.server === 'offline' && (
        <div className="api-status-error">
          <h4>Server Connection Issue</h4>
          <p>{errorDetails || 'No response from server. Please check your internet connection.'}</p>
          <div className="troubleshooting-tips">
            <h5>Troubleshooting Tips:</h5>
            <ul>
              <li>Make sure the backend server is running on port 5001</li>
              <li>Check for any firewall or network restrictions</li>
              <li>Verify that the API URL is correctly configured</li>
              <li>The application will use fallback data where possible</li>
            </ul>
          </div>
        </div>
      )}

      {apiStatus.server === 'online' && (apiStatus.crops === 'offline' || apiStatus.climateZones === 'offline') && (
        <div className="api-status-message">
          <p>Some API endpoints are offline. The application is using fallback data.</p>
        </div>
      )}
    </div>
  );
};

export default ApiStatus;
