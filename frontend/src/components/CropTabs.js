// frontend/src/components/CropTabs.js

import React, { useState, useEffect } from 'react';
import CropProfile from './CropProfile';
import ProductionMetrics from './ProductionMetrics';
import RiskFactors from './RiskFactors';
import '../styles/components/CropTabs.css';

const CropTabs = ({ forecastData }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [activeCrop, setActiveCrop] = useState(Object.keys(forecastData)[0]);
  const [isLoading, setIsLoading] = useState(false);

  // Get the active crop data
  const cropData = forecastData[activeCrop];

  // Add loading effect when switching tabs or crops
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeTab, activeCrop]);

  if (!cropData) {
    return <div className="no-crop-data">No crop data available</div>;
  }

  return (
    <div className="crop-tabs-container">
      <div className="crop-selector">
        <h3>Select Crop</h3>
        <div className="crop-buttons">
          {Object.keys(forecastData).map(cropId => (
            <button
              key={cropId}
              className={`crop-button ${activeCrop === cropId ? 'active' : ''}`}
              onClick={() => setActiveCrop(cropId)}
            >
              {forecastData[cropId].cropProfile.name}
            </button>
          ))}
        </div>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Crop Profile
        </button>
        <button
          className={`tab-button ${activeTab === 'production' ? 'active' : ''}`}
          onClick={() => setActiveTab('production')}
        >
          Production Metrics
        </button>
        <button
          className={`tab-button ${activeTab === 'risks' ? 'active' : ''}`}
          onClick={() => setActiveTab('risks')}
        >
          Risk Factors
        </button>
      </div>

      <div className={`tab-content ${isLoading ? 'loading' : ''}`}>
        {isLoading ? (
          <div className="tab-loading">
            <div className="tab-loading-spinner"></div>
            <p>Loading data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'profile' && (
              <CropProfile
                cropData={cropData.cropProfile}
                cropName={cropData.cropProfile.name}
              />
            )}

            {activeTab === 'production' && (
              <ProductionMetrics
                metricsData={cropData.productionMetrics}
                plantingCalendar={cropData.plantingCalendar}
                area={forecastData.meta?.params?.area || 10}
                cropName={cropData.cropProfile.name}
                environment={forecastData.meta?.params?.environment}
              />
            )}

            {activeTab === 'risks' && (
              <RiskFactors
                riskFactors={cropData.riskFactors}
                recommendations={cropData.recommendations}
                cropName={cropData.cropProfile.name}
                climate={forecastData.meta?.params?.climate}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CropTabs;
