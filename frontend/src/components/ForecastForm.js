// frontend/src/components/ForecastForm.js

import React, { useState, useEffect, useContext } from 'react';
import { ForecastContext } from '../contexts/ForecastContext';
import { getRegionsByCountry } from '../services/api';
import '../styles/components/ForecastForm.css';

const ForecastForm = () => {
  const {
    createForecast,
    loading,
    error,
    clearError,
    availableCrops,
    climateZones
  } = useContext(ForecastContext);

  // Form state
  const [formData, setFormData] = useState({
    country: '',
    region: '',
    climate: '',
    environment: '',
    area: '',
    crops: [],
    experience: 'intermediate'
  });

  // Additional state
  const [regions, setRegions] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Clear any errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Fetch regions when country changes
  useEffect(() => {
    if (formData.country) {
      const fetchRegions = async () => {
        try {
          setLoadingRegions(true);
          const regionsData = await getRegionsByCountry(formData.country);
          setRegions(regionsData || []);
        } catch (error) {
          console.error('Error fetching regions:', error);
        } finally {
          setLoadingRegions(false);
        }
      };

      fetchRegions();
    } else {
      setRegions([]);
    }
  }, [formData.country]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Clear validation error for this field
    setValidationErrors({
      ...validationErrors,
      [name]: undefined
    });

    // Handle special case for area (convert to number)
    if (name === 'area') {
      const numValue = parseFloat(value);
      setFormData({
        ...formData,
        [name]: numValue || ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // If climate not set and region selected, try to get climate from region
    if (name === 'region' && value && !formData.climate) {
      const selectedRegion = regions.find(r => r.id === value);
      if (selectedRegion && selectedRegion.climateZone) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          climate: selectedRegion.climateZone
        }));

        // Clear validation error for climate
        setValidationErrors(prev => ({
          ...prev,
          climate: undefined
        }));
      }
    }
  };

  // Handle crop selection changes
  const handleCropChange = (e) => {
    const { value, checked } = e.target;

    // Clear validation error for crops
    setValidationErrors({
      ...validationErrors,
      crops: undefined
    });

    if (checked) {
      setFormData({
        ...formData,
        crops: [...formData.crops, value]
      });
    } else {
      setFormData({
        ...formData,
        crops: formData.crops.filter(crop => crop !== value)
      });
    }
  };

  // Validate the form
  const validateForm = () => {
    const errors = {};

    if (!formData.climate) {
      errors.climate = 'Climate zone is required';
    }

    if (!formData.environment) {
      errors.environment = 'Growing environment is required';
    }

    if (!formData.area) {
      errors.area = 'Growing area is required';
    } else if (formData.area < 1) {
      errors.area = 'Growing area must be at least 1 m²';
    } else if (formData.area > 1000) {
      errors.area = 'Growing area must be less than 1000 m²';
    }

    if (formData.crops.length === 0) {
      errors.crops = 'At least one crop must be selected';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // Create forecast
      await createForecast(formData);

      // Scroll to results
      document.getElementById('forecast-results')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error creating forecast:', error);
    }
  };

  // If crops or climate zones are loading, show loading state
  if (loading && (!availableCrops.length || !climateZones.length)) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading form options...</p>
        <p className="loading-subtext">This will just take a moment</p>
      </div>
    );
  }

  return (
    <div className="forecast-form-container">
      <h2>Create Your Crop Forecast</h2>

      {error && (
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <h4>Error</h4>
            <p>{error}</p>
          </div>
          <button className="error-close" onClick={clearError}>×</button>
        </div>
      )}

      <form className="forecast-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Location & Environment</h3>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
            >
              <option value="">Select Country (Optional)</option>
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
            <small>Select your country to get region-specific recommendations</small>
          </div>

          {formData.country && (
            <div className="form-group">
              <label htmlFor="region">Region</label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                disabled={loadingRegions}
              >
                <option value="">Select Region (Optional)</option>
                {regions.map(region => (
                  <option key={region.id} value={region.id}>{region.name}</option>
                ))}
              </select>
              {loadingRegions && <div className="loading-indicator">Loading regions...</div>}
              <small>Select your specific region for more accurate forecasts</small>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="climate">Climate Zone *</label>
            <select
              id="climate"
              name="climate"
              value={formData.climate}
              onChange={handleInputChange}
              className={validationErrors.climate ? 'error' : ''}
            >
              <option value="">Select Climate Zone</option>
              {climateZones.map(zone => (
                <option key={zone.id} value={zone.id}>{zone.name}</option>
              ))}
            </select>
            {validationErrors.climate && (
              <div className="field-error">{validationErrors.climate}</div>
            )}
            <small>Select the climate zone that best matches your location</small>
          </div>

          <div className="form-group">
            <label htmlFor="environment">Growing Environment *</label>
            <select
              id="environment"
              name="environment"
              value={formData.environment}
              onChange={handleInputChange}
              className={validationErrors.environment ? 'error' : ''}
            >
              <option value="">Select Environment</option>
              <option value="open">Open Field</option>
              <option value="protected">Protected (Greenhouse/Polytunnel)</option>
              <option value="cooled">Climate Controlled</option>
              <option value="non-cooled">Non-Cooled Indoor</option>
            </select>
            {validationErrors.environment && (
              <div className="field-error">{validationErrors.environment}</div>
            )}
            <small>How will you be growing your crops?</small>
          </div>

          <div className="form-group">
            <label htmlFor="area">Growing Area (m²) *</label>
            <input
              type="number"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              min="1"
              max="1000"
              className={validationErrors.area ? 'error' : ''}
            />
            {validationErrors.area && (
              <div className="field-error">{validationErrors.area}</div>
            )}
            <small>Total area in square meters</small>
          </div>
        </div>

        <div className="form-section">
          <h3>Crop Selection</h3>

          <div className="form-group crop-selection">
            <label>Select Crops *</label>
            <div className={`crop-options ${validationErrors.crops ? 'error' : ''}`}>
              {availableCrops.map(crop => (
                <div key={crop.id} className="crop-option">
                  <input
                    type="checkbox"
                    id={`crop-${crop.id}`}
                    value={crop.id}
                    checked={formData.crops.includes(crop.id)}
                    onChange={handleCropChange}
                  />
                  <label htmlFor={`crop-${crop.id}`}>{crop.name}</label>
                </div>
              ))}
            </div>
            {validationErrors.crops && (
              <div className="field-error">{validationErrors.crops}</div>
            )}
            <small>Select one or more crops to include in your forecast</small>
          </div>
        </div>

        <div className="form-section">
          <h3>Experience Level</h3>

          <div className="form-group">
            <label htmlFor="experience">Gardening Experience</label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <small>This helps tailor recommendations to your experience level</small>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className={`generate-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                <span>Generating Forecast...</span>
              </>
            ) : (
              'Generate Forecast'
            )}
          </button>
          {loading && (
            <div className="generating-message">
              This may take a few moments as we analyze your growing conditions
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ForecastForm;
