import React, { useState } from 'react';
import CropProfile from './CropProfile';
import PlantingCalendar from './PlantingCalendar';
import ProductionMetrics from './ProductionMetrics';
import RiskFactors from './RiskFactors';
import '../styles/components/CropTabs.css';

const CropTabs = ({ forecastData }) => {
  const [activeTab, setActiveTab] = useState(Object.keys(forecastData.crops)[0]);
  const [activeSection, setActiveSection] = useState('profile');

  // Handle crop tab click
  const handleCropTabClick = (cropId) => {
    setActiveTab(cropId);
  };

  // Handle section tab click
  const handleSectionTabClick = (section) => {
    setActiveSection(section);
  };

  // Get crop names for tabs
  const cropNames = {
    tomatoes: 'Tomatoes',
    cucumbers: 'Cucumbers',
    bellPeppers: 'Bell Peppers',
    eggplant: 'Eggplant',
    hotPeppers: 'Hot Peppers'
  };

  return (
    <div className="crop-tabs-container">
      <div className="crop-tabs-header">
        <h3>Your Crop Forecast</h3>
        <div className="forecast-meta">
          <span>Generated: {new Date(forecastData.meta.generated).toLocaleString()}</span>
          <span>Climate: {getClimateName(forecastData.meta.params.climate)}</span>
          <span>Environment: {getEnvironmentName(forecastData.meta.params.environment)}</span>
          <span>Area: {forecastData.meta.params.area} m²</span>
        </div>
      </div>
      
      <div className="crop-tabs">
        {Object.keys(forecastData.crops).map(cropId => (
          <div 
            key={cropId} 
            className={`crop-tab ${activeTab === cropId ? 'active' : ''}`}
            onClick={() => handleCropTabClick(cropId)}
          >
            <span>{cropNames[cropId] || cropId}</span>
          </div>
        ))}
      </div>
      
      <div className="crop-content">
        <div className="section-tabs">
          <div 
            className={`section-tab ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => handleSectionTabClick('profile')}
          >
            <span>Crop Profile</span>
          </div>
          <div 
            className={`section-tab ${activeSection === 'calendar' ? 'active' : ''}`}
            onClick={() => handleSectionTabClick('calendar')}
          >
            <span>Planting Calendar</span>
          </div>
          <div 
            className={`section-tab ${activeSection === 'metrics' ? 'active' : ''}`}
            onClick={() => handleSectionTabClick('metrics')}
          >
            <span>Production Metrics</span>
          </div>
          <div 
            className={`section-tab ${activeSection === 'risks' ? 'active' : ''}`}
            onClick={() => handleSectionTabClick('risks')}
          >
            <span>Risk Factors</span>
          </div>
        </div>
        
        <div className="section-content">
          {activeSection === 'profile' && (
            <CropProfile cropData={forecastData.crops[activeTab].cropProfile} />
          )}
          
          {activeSection === 'calendar' && (
            <PlantingCalendar calendarData={forecastData.crops[activeTab].plantingCalendar} />
          )}
          
          {activeSection === 'metrics' && (
            <ProductionMetrics 
              metricsData={forecastData.crops[activeTab].productionMetrics} 
              area={forecastData.meta.params.area}
            />
          )}
          
          {activeSection === 'risks' && (
            <RiskFactors 
              riskData={forecastData.crops[activeTab].riskFactors}
              recommendations={forecastData.crops[activeTab].recommendations}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Helper functions for displaying formatted names
const getClimateName = (climateId) => {
  const climateNames = {
    tropical: 'Tropical',
    subtropical: 'Subtropical',
    mediterranean: 'Mediterranean',
    continental: 'Continental',
    temperate: 'Temperate',
    oceanic: 'Oceanic',
    arid: 'Arid',
    semiarid: 'Semi-arid'
  };
  
  return climateNames[climateId] || climateId;
};

const getEnvironmentName = (environmentId) => {
  const environmentNames = {
    open: 'Open Field',
    protected: 'Protected (Greenhouse)',
    cooled: 'Climate Controlled',
    noncooled: 'Non-Cooled Structure'
  };
  
  return environmentNames[environmentId] || environmentId;
};

export default CropTabs;
