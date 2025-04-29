import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/pages/ClimateZones.css';

const ClimateZones = () => {
  const [climateZones, setClimateZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeZone, setActiveZone] = useState(null);

  useEffect(() => {
    const fetchClimateZones = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/forecast/climate-zones');
        setClimateZones(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load climate zone data. Please try again later.');
        setLoading(false);
        console.error('Error fetching climate zones:', err);
      }
    };

    fetchClimateZones();
  }, []);

  const handleZoneClick = (zoneId) => {
    setActiveZone(activeZone === zoneId ? null : zoneId);
  };

  if (loading) {
    return (
      <div className="climate-zones-container">
        <div className="loading-spinner">Loading climate zone data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="climate-zones-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="climate-zones-container">
      <div className="zones-header">
        <h1>Climate Zones Guide</h1>
        <p className="zones-description">
          Understanding your climate zone is essential for successful vegetable gardening. 
          Each zone has unique characteristics that affect which crops will thrive and when to plant them.
        </p>
      </div>

      <div className="zones-intro">
        <h2>How to Identify Your Climate Zone</h2>
        <p>
          Climate zones are determined by factors including temperature ranges, precipitation patterns, 
          and growing season length. Use the interactive map or descriptions below to identify your zone.
        </p>
      </div>

      <div className="climate-map-section">
        <h2>Interactive Climate Zone Map</h2>
        <div className="climate-map">
          {/* This would be replaced with an actual interactive map component */}
          <img 
            src="/images/climate-zones-map.jpg" 
            alt="Climate Zones Map" 
            className="climate-map-image" 
          />
        </div>
      </div>

      <div className="zones-list">
        <h2>Climate Zone Descriptions</h2>
        <p className="zones-list-intro">
          Click on each climate zone to learn more about its characteristics and suitable crops.
        </p>

        <div className="zones-grid">
          {climateZones.map(zone => (
            <div 
              key={zone.id} 
              className={`zone-card ${activeZone === zone.id ? 'active' : ''}`}
              onClick={() => handleZoneClick(zone.id)}
            >
              <div className="zone-header">
                <h3 className="zone-name">{zone.name}</h3>
                <span className="expand-icon">{activeZone === zone.id ? '−' : '+'}</span>
              </div>
              
              {activeZone === zone.id && (
                <div className="zone-details">
                  <div className="zone-characteristics">
                    <h4>Characteristics</h4>
                    <ul>
                      {zone.characteristics.map((characteristic, index) => (
                        <li key={index}>{characteristic}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="zone-temperature">
                    <h4>Temperature Range</h4>
                    <p>Average Annual: {zone.temperatureRange.average}°C</p>
                    <p>Summer: {zone.temperatureRange.summer}°C</p>
                    <p>Winter: {zone.temperatureRange.winter}°C</p>
                  </div>
                  
                  <div className="zone-precipitation">
                    <h4>Precipitation</h4>
                    <p>Annual: {zone.precipitation.annual} mm</p>
                    <p>Pattern: {zone.precipitation.pattern}</p>
                  </div>
                  
                  <div className="zone-growing-season">
                    <h4>Growing Season</h4>
                    <p>{zone.growingSeason}</p>
                  </div>
                  
                  <div className="zone-regions">
                    <h4>Example Regions</h4>
                    <ul>
                      {zone.exampleRegions.map((region, index) => (
                        <li key={index}>{region}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="zone-crops">
                    <h4>Well-Suited Crops</h4>
                    <div className="crop-tags">
                      {zone.suitableCrops.map((crop, index) => (
                        <span key={index} className="crop-tag">{crop}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="zone-challenges">
                    <h4>Common Challenges</h4>
                    <ul>
                      {zone.challenges.map((challenge, index) => (
                        <li key={index}>{challenge}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="microclimate-section">
        <h2>Understanding Microclimates</h2>
        <p>
          Even within a climate zone, your specific garden may have microclimates - small areas with 
          slightly different growing conditions due to factors like:
        </p>
        <ul>
          <li>Elevation changes</li>
          <li>Proximity to buildings or water bodies</li>
          <li>Wind exposure</li>
          <li>Sun exposure (north vs. south facing)</li>
          <li>Urban heat island effects</li>
        </ul>
        <p>
          Identifying these microclimates in your garden can help you place crops in the most favorable 
          locations and extend your growing season.
        </p>
      </div>
    </div>
  );
};

export default ClimateZones;
