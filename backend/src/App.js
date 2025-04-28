import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CropLibrary from './pages/CropLibrary';
import ClimateZones from './pages/ClimateZones';
import Help from './pages/Help';
import { ForecastContext } from './contexts/ForecastContext';
import { getCrops, getClimateZones } from './utils/api';
import './styles/global.css';

function App() {
  // Global app state
  const [crops, setCrops] = useState([]);
  const [climateZones, setClimateZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [forecastParams, setForecastParams] = useState({
    country: '',
    region: '',
    climate: '',
    environment: 'open',
    area: 10,
    experience: 'intermediate'
  });

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [cropsData, climateData] = await Promise.all([
          getCrops(),
          getClimateZones()
        ]);
        
        setCrops(cropsData);
        setClimateZones(climateData);
        setError(null);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load application data. Please refresh the page or try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Update forecast data
  const updateForecast = (data) => {
    setForecastData(data);
  };

  // Update forecast parameters
  const updateForecastParams = (params) => {
    setForecastParams(prevParams => ({
      ...prevParams,
      ...params
    }));
  };

  // Reset the forecast
  const resetForecast = () => {
    setForecastData(null);
    setForecastParams({
      country: '',
      region: '',
      climate: '',
      environment: 'open',
      area: 10,
      experience: 'intermediate'
    });
  };

  // Context value
  const forecastContextValue = {
    forecastData,
    forecastParams,
    crops,
    climateZones,
    updateForecast,
    updateForecastParams,
    resetForecast
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading HomeGrow Forecast Tool...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <Router>
      <ForecastContext.Provider value={forecastContextValue}>
        <div className="app">
          <Header />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/crops" element={<CropLibrary />} />
              <Route path="/climate-zones" element={<ClimateZones />} />
              <Route path="/help" element={<Help />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ForecastContext.Provider>
    </Router>
  );
}

export default App;
