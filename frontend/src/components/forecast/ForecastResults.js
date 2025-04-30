import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Line, Bar } from 'react-chartjs-2';
import '../../styles/components/ForecastResults.css';

/**
 * ForecastResults Component
 * 
 * Displays the results of a forecast including crop profiles, planting calendars,
 * production metrics, risk factors, and recommendations.
 */
const ForecastResults = ({ forecastData, onSave }) => {
  const [activeTab, setActiveTab] = useState(Object.keys(forecastData.results)[0]);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const { isAuthenticated, user } = useAuth();
  
  // Handle tab change
  const handleTabChange = (crop) => {
    setActiveTab(crop);
  };
  
  // Handle save forecast
  const handleSave = async () => {
    if (!isAuthenticated) return;
    
    setSaving(true);
    setSaveStatus(null);
    
    try {
      await onSave(forecastData);
      setSaveStatus({ type: 'success', message: 'Forecast saved successfully' });
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Error saving forecast' });
      console.error('Error saving forecast:', error);
    } finally {
      setSaving(false);
    }
  };
  
  // Get active crop data
  const activeCropData = forecastData.results[activeTab];
  
  // Prepare chart data for planting calendar
  const plantingCalendarData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Growing Period',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: Array(12).fill(0).map((_, i) => {
          const month = i + 1;
          const seedStartDate = new Date(activeCropData.plantingCalendar.seedStartDate);
          const harvestEndDate = new Date(activeCropData.plantingCalendar.harvestEndDate);
          
          if (month >= seedStartDate.getMonth() + 1 && month <= harvestEndDate.getMonth() + 1) {
            return 1;
          }
          return 0;
        })
      }
    ]
  };
  
  // Prepare chart data for yield
  const yieldData = {
    labels: ['Minimum Yield', 'Maximum Yield'],
    datasets: [
      {
        label: 'Yield (kg)',
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
        data: [
          activeCropData.productionMetrics.totalYield.min,
          activeCropData.productionMetrics.totalYield.max
        ]
      }
    ]
  };
  
  return (
    <div className="forecast-results">
      <div className="forecast-header">
        <h2>Forecast Results</h2>
        {isAuthenticated ? (
          <button 
            className="save-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Forecast'}
          </button>
        ) : (
          <p className="login-message">Log in to save this forecast</p>
        )}
      </div>
      
      {saveStatus && (
        <div className={`save-status ${saveStatus.type}`}>
          {saveStatus.message}
        </div>
      )}
      
      <div className="crop-tabs">
        {Object.keys(forecastData.results).map(crop => (
          <button
            key={crop}
            className={`tab-button ${activeTab === crop ? 'active' : ''}`}
            onClick={() => handleTabChange(crop)}
          >
            {forecastData.results[crop].cropProfile.name}
          </button>
        ))}
      </div>
      
      <div className="forecast-content">
        <section className="crop-profile">
          <h3>Crop Profile</h3>
          <div className="profile-content">
            <div className="profile-image">
              <img 
                src={activeCropData.cropProfile.image || '/images/placeholder.jpg'} 
                alt={activeCropData.cropProfile.name} 
              />
            </div>
            <div className="profile-details">
              <p><strong>Scientific Name:</strong> {activeCropData.cropProfile.scientificName}</p>
              <p><strong>Life Cycle:</strong> {activeCropData.cropProfile.lifeCycle}</p>
              <p><strong>Growth Pattern:</strong> {activeCropData.cropProfile.growthPattern}</p>
              <p><strong>Maintenance Level:</strong> {activeCropData.cropProfile.maintenanceLevel}</p>
              <div className="key-requirements">
                <p><strong>Key Requirements:</strong></p>
                <ul>
                  {activeCropData.cropProfile.keyRequirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        <section className="planting-calendar">
          <h3>Planting Calendar</h3>
          <div className="calendar-content">
            <div className="calendar-chart">
              <Line 
                data={plantingCalendarData}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 1,
                      ticks: {
                        stepSize: 1,
                        callback: function(value) {
                          return value === 1 ? 'Active' : 'Inactive';
                        }
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
            <div className="calendar-details">
              <p><strong>Seed Starting:</strong> {new Date(activeCropData.plantingCalendar.seedStartDate).toLocaleDateString()}</p>
              <p><strong>Transplanting:</strong> {new Date(activeCropData.plantingCalendar.transplantDate).toLocaleDateString()}</p>
              <p><strong>Harvest Start:</strong> {new Date(activeCropData.plantingCalendar.harvestStartDate).toLocaleDateString()}</p>
              <p><strong>Harvest End:</strong> {new Date(activeCropData.plantingCalendar.harvestEndDate).toLocaleDateString()}</p>
              <p><strong>Total Growing Days:</strong> {activeCropData.plantingCalendar.totalGrowingDays}</p>
            </div>
          </div>
        </section>
        
        <section className="production-metrics">
          <h3>Production Metrics</h3>
          <div className="metrics-content">
            <div className="metrics-chart">
              <Bar 
                data={yieldData}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Yield (kg)'
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="metrics-details">
              <p><strong>Plants per Square Meter:</strong> {activeCropData.productionMetrics.plantsPerSqMeter}</p>
              <p><strong>Total Plants:</strong> {activeCropData.productionMetrics.totalPlants}</p>
              <p><strong>Yield per Plant:</strong> {activeCropData.productionMetrics.yieldPerPlant.min} - {activeCropData.productionMetrics.yieldPerPlant.max} kg</p>
              <p><strong>Total Yield:</strong> {activeCropData.productionMetrics.totalYield.min} - {activeCropData.productionMetrics.totalYield.max} kg</p>
            </div>
          </div>
        </section>
        
        <section className="risk-factors">
          <h3>Risk Factors</h3>
          <div className="risks-content">
            {activeCropData.riskFactors.map((risk, index) => (
              <div key={index} className="risk-item">
                <div className="risk-header">
                  <h4>{risk.name}</h4>
                  <span className={`risk-likelihood ${risk.likelihood.toLowerCase()}`}>
                    {risk.likelihood}
                  </span>
                </div>
                <p><strong>Category:</strong> {risk.category}</p>
                <p><strong>Impact:</strong> {risk.impact}</p>
                <p><strong>Mitigation:</strong> {risk.mitigation}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section className="recommendations">
          <h3>Recommendations</h3>
          <ul className="recommendations-list">
            {activeCropData.recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ForecastResults;
