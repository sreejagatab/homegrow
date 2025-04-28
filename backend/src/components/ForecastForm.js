import React, { useState, useEffect, useContext } from 'react';
import { ForecastContext } from '../contexts/ForecastContext';
import { generateForecast, getRegionsByCountry } from '../utils/api';
import '../styles/components/ForecastForm.css';

const ForecastForm = () => {
  const { 
    forecastParams, 
    updateForecastParams, 
    updateForecast, 
    climateZones,
    crops
  } = useContext(ForecastContext);
  
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCrops, setSelectedCrops] = useState([
    'tomatoes', 'cucumbers', 'bellPeppers', 'eggplant', 'hotPeppers'
  ]);

  // Load regions when country changes
  useEffect(() => {
    const loadRegions = async () => {
      if (!forecastParams.country) {
        setRegions([]);
        return;
      }
      
      try {
        const regionsData = await getRegionsByCountry(forecastParams.country);
        setRegions(regionsData);
        
        // Reset region if the current one is no longer valid
        if (regionsData.length > 0 && !regionsData.find(r => r.id === forecastParams.region)) {
          updateForecastParams({ region: '' });
        }
      } catch (err) {
        console.error('Error loading regions:', err);
        setError('Failed to load regions. Please try a different country.');
        setRegions([]);
      }
    };
    
    loadRegions();
  }, [forecastParams.country, updateForecastParams]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert area to number
    if (name === 'area') {
      updateForecastParams({ [name]: parseFloat(value) || 0 });
    } else {
      updateForecastParams({ [name]: value });
    }
    
    // If climate not set, try to get from selected region
    if (name === 'region' && value && !forecastParams.climate) {
      const selectedRegion = regions.find(r => r.id === value);
      if (selectedRegion && selectedRegion.climateZone) {
        updateForecastParams({ climate: selectedRegion.climateZone });
      }
    }
  };

  // Handle crop selection
  const handleCropSelection = (cropId) => {
    setSelectedCrops(prevSelectedCrops => {
      if (prevSelectedCrops.includes(cropId)) {
        return prevSelectedCrops.filter(id => id !== cropId);
      } else {
        return [...prevSelectedCrops, cropId];
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!forecastParams.climate || !forecastParams.environment || !forecastParams.area) {
      setError('Please fill in all required fields.');
      return;
    }
    
    if (selectedCrops.length === 0) {
      setError('Please select at least one crop.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Generate forecast
      const params = {
        ...forecastParams,
        crops: selectedCrops
      };
      
      const forecastData = await generateForecast(params);
      
      // Update forecast data in context
      updateForecast(forecastData);
      
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('forecast-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error('Error generating forecast:', err);
      setError('Failed to generate forecast. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forecast-form-container">
      <h3>Forecast Parameters</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="forecast-form">
        <div className="form-section">
          <h4>Location</h4>
          
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select 
              id="country" 
              name="country" 
              value={forecastParams.country} 
              onChange={handleChange}
            >
              <option value="">Select Country</option>
              <option value="usa">United States</option>
              <option value="canada">Canada</option>
              <option value="uk">United Kingdom</option>
              <option value="australia">Australia</option>
              <option value="spain">Spain</option>
              <option value="italy">Italy</option>
              <option value="france">France</option>
              <option value="germany">Germany</option>
              <option value="mexico">Mexico</option>
              <option value="japan">Japan</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="region">Region</label>
            <select 
              id="region" 
              name="region" 
              value={forecastParams.region} 
              onChange={handleChange}
              disabled={!forecastParams.country || regions.length === 0}
            >
              <option value="">Select Region</option>
              {regions.map(region => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="climate">Climate Zone</label>
            <select 
              id="climate" 
              name="climate" 
              value={forecastParams.climate} 
              onChange={handleChange}
              required
            >
              <option value="">Select Climate Zone</option>
              {climateZones.map(climate => (
                <option key={climate.id} value={climate.id}>
                  {climate.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-section">
          <h4>Growing Environment</h4>
          
          <div className="form-group">
            <label htmlFor="environment">Cultivation Environment</label>
            <select 
              id="environment" 
              name="environment" 
              value={forecastParams.environment} 
              onChange={handleChange}
              required
            >
              <option value="open">Open Field</option>
              <option value="protected">Protected (Greenhouse)</option>
              <option value="cooled">Climate Controlled</option>
              <option value="noncooled">Non-Cooled Structure</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="area">Growing Area (m²)</label>
            <input 
              type="number" 
              id="area" 
              name="area" 
              min="1" 
              step="0.1"
              value={forecastParams.area} 
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="experience">Gardening Experience</label>
            <select 
              id="experience" 
              name="experience" 
              value={forecastParams.experience} 
              onChange={handleChange}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        
        <div className="form-section">
          <h4>Crops to Forecast</h4>
          
          <div className="crop-selection">
            {crops.map(crop => (
              <div 
                key={crop.id} 
                className={`crop-option ${selectedCrops.includes(crop.id) ? 'selected' : ''}`}
                onClick={() => handleCropSelection(crop.id)}
              >
                <div className="crop-image">
                  <img src={crop.image || `/images/crops/default.jpg`} alt={crop.name} />
                </div>
                <div className="crop-name">{crop.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="generate-button"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Forecast'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForecastForm;
