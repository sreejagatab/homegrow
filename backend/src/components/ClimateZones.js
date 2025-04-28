import React, { useContext } from 'react';
import { ForecastContext } from '../contexts/ForecastContext';
import '../styles/pages/ClimateZones.css';

const ClimateZones = () => {
  const { climateZones } = useContext(ForecastContext);
  
  return (
    <div className="climate-zones-page">
      <div className="container">
        <section className="page-header">
          <h1>Climate Zones Guide</h1>
          <p className="page-description">
            Understanding your climate zone is essential for successful home gardening. 
            This guide will help you identify your climate type and learn about its 
            characteristics for optimal growing conditions.
          </p>
        </section>
        
        <section className="climate-map-section">
          <h2>Climate Zone Map</h2>
          <div className="climate-map">
            <img 
              src="/images/climate-map.jpg" 
              alt="World Climate Zone Map" 
              className="map-image"
            />
            <div className="map-legend">
              <h3>Legend</h3>
              <ul className="legend-list">
                {climateZones.map(zone => (
                  <li key={zone.id} className={`legend-item ${zone.id}`}>
                    <div className="color-indicator"></div>
                    <span>{zone.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        
        <section className="climate-details-section">
          <h2>Climate Zone Details</h2>
          
          <div className="climate-zones-grid">
            {climateZones.map(zone => (
              <div key={zone.id} className={`climate-zone-card ${zone.id}`}>
                <h3>{zone.name}</h3>
                <p className="zone-description">{zone.description}</p>
                
                <div className="zone-characteristics">
                  <h4>Characteristics</h4>
                  <ul>
                    <li><strong>Temperature Range:</strong> {zone.characteristics?.minTemp || 0}°C to {zone.characteristics?.maxTemp || 30}°C</li>
                    <li><strong>Annual Rainfall:</strong> {zone.characteristics?.annualRainfall || "Varies"}</li>
                    <li><strong>Growing Season:</strong> {zone.characteristics?.growingSeason || "Varies"}</li>
                    <li><strong>Humidity:</strong> {zone.characteristics?.humidity || "Medium"}</li>
                  </ul>
                </div>
                
                <div className="crop-suitability">
                  <h4>Crop Suitability</h4>
                  <ul className="suitability-list">
                    {Object.keys(zone.suitability || {}).map(crop => (
                      <li key={crop} className={`suitability-${getSuitabilityClass(zone.suitability[crop])}`}>
                        <span className="crop-name">{formatCropName(crop)}</span>
                        <span className="suitability-rating">{zone.suitability[crop]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="zone-challenges">
                  <h4>Common Challenges</h4>
                  <ul>
                    {zone.challenges?.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section className="climate-tips-section">
          <h2>Growing Tips by Climate</h2>
          
          <div className="tips-accordion">
            {climateZones.map(zone => (
              <div key={zone.id} className="accordion-item">
                <div className="accordion-header">
                  <h3>{zone.name} Climate Growing Tips</h3>
                  <span className="accordion-icon">+</span>
                </div>
                <div className="accordion-content">
                  <p>{getClimateGrowingTips(zone.id)}</p>
                  <div className="tips-categories">
                    <div className="tips-category">
                      <h4>Water Management</h4>
                      <p>{getWaterManagementTips(zone.id)}</p>
                    </div>
                    <div className="tips-category">
                      <h4>Temperature Control</h4>
                      <p>{getTemperatureControlTips(zone.id)}</p>
                    </div>
                    <div className="tips-category">
                      <h4>Pest Management</h4>
                      <p>{getPestManagementTips(zone.id)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Helper functions for formatting and displaying data
const formatCropName = (cropId) => {
  const names = {
    tomatoes: "Tomatoes",
    cucumbers: "Cucumbers",
    bellPeppers: "Bell Peppers",
    eggplant: "Eggplant",
    hotPeppers: "Hot Peppers"
  };
  
  return names[cropId] || cropId;
};

const getSuitabilityClass = (suitability) => {
  const ratingMap = {
    "Very high": "very-high",
    "High": "high",
    "Medium": "medium",
    "Low": "low",
    "Very low": "very-low"
  };
  
  return ratingMap[suitability] || "medium";
};

// Additional helper functions for climate-specific tips
const getClimateGrowingTips = (climateId) => {
  // Implementation would be added here
  return "General growing tips for this climate zone.";
};

const getWaterManagementTips = (climateId) => {
  // Implementation would be added here
  return "Water management tips for this climate zone.";
};

const getTemperatureControlTips = (climateId) => {
  // Implementation would be added here
  return "Temperature control tips for this climate zone.";
};

const getPestManagementTips = (climateId) => {
  // Implementation would be added here
  return "Pest management tips for this climate zone.";
};

export default ClimateZones;