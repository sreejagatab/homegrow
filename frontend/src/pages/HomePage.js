import React, { useContext } from 'react';
import ForecastForm from '../components/ForecastForm';
import CropTabs from '../components/CropTabs';
import { ForecastContext } from '../contexts/ForecastContext';
import '../styles/pages/HomePage.css';

const HomePage = () => {
  const { forecastData, resetForecast } = useContext(ForecastContext);

  return (
    <div className="home-page">
      <div className="container">
        {!forecastData ? (
          <>
            <section className="hero-section">
              <div className="hero-content">
                <h1>HomeGrow Forecast Tool</h1>
                <p className="hero-subtitle">
                  Optimize your home vegetable garden with data-driven planting forecasts
                </p>
                <p className="hero-description">
                  Get customized planting recommendations, yield estimates, and risk assessments
                  for tomatoes, cucumbers, bell peppers, eggplant, and hot peppers based on your
                  specific location and growing environment.
                </p>
              </div>
            </section>

            <section className="forecast-section">
              <div className="forecast-container">
                <ForecastForm />
              </div>
            </section>

            <section className="features-section">
              <h2>Why Use HomeGrow Forecast?</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">🌱</div>
                  <h3>Optimal Planting Times</h3>
                  <p>
                    Identify the best times to plant throughout the year based on your climate zone
                    and growing environment.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">📊</div>
                  <h3>Yield Predictions</h3>
                  <p>
                    Get data-driven estimates of expected yields for each crop based on your
                    specific conditions and growing area.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">⚠️</div>
                  <h3>Risk Assessment</h3>
                  <p>
                    Identify and prepare for potential challenges specific to your crops and growing
                    environment.
                  </p>
                </div>

                <div className="feature-card">
                  <div className="feature-icon">🔍</div>
                  <h3>Detailed Crop Profiles</h3>
                  <p>
                    Access comprehensive information about growth patterns, maintenance requirements,
                    and harvesting tips for each crop.
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="results-section" id="forecast-results">
            <div className="results-header">
              <h2>Your Crop Forecast</h2>
              <button className="btn btn-outline" onClick={resetForecast}>
                Start New Forecast
              </button>
            </div>
            <CropTabs forecastData={forecastData} />
          </section>
        )}

        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Enter Your Location</h3>
              <p>Select your country, region, and climate zone to get location-specific forecasts.</p>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <h3>Specify Growing Environment</h3>
              <p>Tell us about your growing setup - whether it's open field, greenhouse, or other environments.</p>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <h3>Select Your Crops</h3>
              <p>Choose from our selection of vegetable crops to include in your forecast.</p>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <h3>Get Your Forecast</h3>
              <p>Receive comprehensive planting forecasts, calendars, and recommendations.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
