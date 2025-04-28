import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import '../styles/components/ProductionMetrics.css';

const ProductionMetrics = ({ metricsData, area }) => {
  const harvestChartRef = useRef(null);
  const harvestChart = useRef(null);

  // Create harvest timeline chart
  useEffect(() => {
    if (harvestChartRef.current) {
      // Destroy existing chart if it exists
      if (harvestChart.current) {
        harvestChart.current.destroy();
      }

      // Calculate start and end dates based on time to harvest and harvest duration
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(now.getDate() + parseInt(metricsData.timeToHarvest.split('-')[0]));
      
      const endDate = new Date(startDate);
      const harvestWeeks = parseInt(metricsData.harvestDuration.split('-')[1]);
      endDate.setDate(startDate.getDate() + (harvestWeeks * 7));
      
      // Generate labels for timeline
      const labels = [];
      const data = [];
      
      // Current date line
      const currentDateLine = {
        type: 'line',
        mode: 'vertical',
        scaleID: 'x',
        value: now.toISOString().split('T')[0],
        borderColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 2,
        label: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          content: 'Today',
          display: true
        }
      };
      
      // Generate timeline data
      const dateArray = generateDateArray(now, endDate);
      dateArray.forEach(date => {
        labels.push(formatDate(date));
        
        // Determine yield value for each date
        if (date < startDate) {
          data.push(0); // No harvest yet
        } else if (date >= startDate && date <= endDate) {
          // Calculate yield based on position in harvest window
          const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
          const daysPassed = Math.round((date - startDate) / (1000 * 60 * 60 * 24));
          const progress = daysPassed / totalDays;
          
          // Use a bell curve for yield distribution
          let yield_factor;
          if (progress < 0.5) {
            yield_factor = progress * 2; // Ramp up
          } else {
            yield_factor = (1 - progress) * 2; // Ramp down
          }
          
          const maxYield = metricsData.totalYield.max;
          data.push((maxYield / totalDays) * yield_factor * 4); // Daily yield
        }
      });
      
      // Create the chart
      const ctx = harvestChartRef.current.getContext('2d');
      harvestChart.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Estimated Daily Yield (kg)',
            data: data,
            backgroundColor: 'rgba(46, 125, 50, 0.6)',
            borderColor: 'rgba(46, 125, 50, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Daily Yield (kg)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Date'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Projected Harvest Timeline',
              font: {
                size: 16
              }
            },
            annotation: {
              annotations: {
                currentDateLine
              }
            }
          }
        }
      });
    }
    
    return () => {
      // Clean up chart when component unmounts
      if (harvestChart.current) {
        harvestChart.current.destroy();
      }
    };
  }, [metricsData, area]);

  return (
    <div className="production-metrics">
      <div className="metrics-overview">
        <h3>Production Overview</h3>
        
        <div className="metrics-grid">
          <div className="metric-card">
            <h4>Expected Total Yield</h4>
            <div className="metric-value">{metricsData.totalYield.min}-{metricsData.totalYield.max} kg</div>
            <div className="metric-details">Based on {area} m² growing area</div>
          </div>
          
          <div className="metric-card">
            <h4>Time to First Harvest</h4>
            <div className="metric-value">{metricsData.timeToHarvest}</div>
            <div className="metric-details">Days after transplanting</div>
          </div>
          
          <div className="metric-card">
            <h4>Harvest Duration</h4>
            <div className="metric-value">{metricsData.harvestDuration}</div>
            <div className="metric-details">With proper care and maintenance</div>
          </div>
          
          <div className="metric-card">
            <h4>Maintenance Level</h4>
            <div className="metric-value">{metricsData.maintenanceLevel}</div>
            <div className="metric-details">Labor intensity required</div>
          </div>
        </div>
      </div>
      
      <div className="harvest-timeline">
        <div className="chart-container">
          <canvas ref={harvestChartRef}></canvas>
        </div>
      </div>
      
      <div className="yield-factors">
        <h3>Yield Optimization Factors</h3>
        
        <div className="factors-list">
          <div className="factor-item">
            <h4>Spacing Impact</h4>
            <p>
              Proper plant spacing is crucial for maximum yield. For your {area} m² area, 
              aim for {calculateOptimalPlants(area, getAverageSpacing(metricsData))} plants 
              with {getAverageSpacing(metricsData)} cm spacing for optimal air circulation and light exposure.
            </p>
          </div>
          
          <div className="factor-item">
            <h4>Maintenance Impact</h4>
            <p>
              Regular {getMaintenanceTasks(metricsData.maintenanceLevel)} can increase your yield by 
              up to {getMaintenanceImpact(metricsData.maintenanceLevel)}%. Neglecting these tasks 
              may reduce yield by a similar amount.
            </p>
          </div>
          
          <div className="factor-item">
            <h4>Environmental Controls</h4>
            <p>
              {getEnvironmentalTips(metricsData.maintenanceLevel)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const generateDateArray = (startDate, endDate) => {
  const dateArray = [];
  let currentDate = new Date(startDate);
  
  // Show only every 5th day to keep chart readable
  const dayStep = 5;
  
  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + dayStep);
  }
  
  return dateArray;
};

const getAverageSpacing = (metricsData) => {
  // This would come from the real data in a production app
  const spacingMap = {
    'tomatoes': 60,
    'cucumbers': 45,
    'bellPeppers': 40,
    'eggplant': 50,
    'hotPeppers': 40
  };
  
  // Default average spacing
  return 50;
};

const calculateOptimalPlants = (area, spacing) => {
  // Convert spacing from cm to m
  const spacingMeters = spacing / 100;
  
  // Calculate plants per square meter (assuming square spacing)
  const plantsPerSqMeter = 1 / (spacingMeters * spacingMeters);
  
  // Calculate total plants
  return Math.round(area * plantsPerSqMeter);
};

const getMaintenanceTasks = (maintenanceLevel) => {
  switch (maintenanceLevel) {
    case 'High':
      return 'pruning, staking, pest monitoring, and nutrient management';
    case 'Medium to High':
      return 'pruning, staking, and regular pest checks';
    case 'Medium':
      return 'occasional pruning and regular watering';
    case 'Low to Medium':
      return 'minimal pruning and consistent watering';
    case 'Low':
      return 'basic watering and occasional pest checks';
    default:
      return 'basic maintenance tasks';
  }
};

const getMaintenanceImpact = (maintenanceLevel) => {
  switch (maintenanceLevel) {
    case 'High':
      return 30;
    case 'Medium to High':
      return 25;
    case 'Medium':
      return 20;
    case 'Low to Medium':
      return 15;
    case 'Low':
      return 10;
    default:
      return 15;
  }
};

const getEnvironmentalTips = (maintenanceLevel) => {
  switch (maintenanceLevel) {
    case 'High':
      return 'Consider implementing automated irrigation and climate controls to maintain optimal growing conditions. Monitoring temperature and humidity can increase yields by 15-20%.';
    case 'Medium to High':
      return 'Use mulch to regulate soil temperature and moisture. Consider row covers or shade cloth to protect plants during extreme weather events.';
    case 'Medium':
      return 'Consistent watering and proper fertilization will significantly impact your yield. Consider using a simple timer for irrigation.';
    case 'Low to Medium':
      return 'Focus on proper initial setup with quality soil and adequate drainage to minimize ongoing maintenance needs.';
    case 'Low':
      return 'Choose disease-resistant varieties and implement basic companion planting to naturally deter pests with minimal intervention.';
    default:
      return 'Monitor your plants regularly and adjust care as needed based on weather conditions and plant development.';
  }
};

export default ProductionMetrics;
