import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import '../styles/components/ProductionMetrics.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

const ProductionMetrics = ({ metricsData, area, cropName, environment }) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('harvest');

  // Chart references
  const harvestChartRef = useRef(null);
  const harvestChart = useRef(null);
  const yieldComparisonRef = useRef(null);
  const yieldComparisonChart = useRef(null);

  // Create harvest timeline chart
  useEffect(() => {
    // Add a small delay to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      if (harvestChartRef.current && activeTab === 'harvest') {
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
    }, 300); // 300ms delay to ensure DOM is ready

    return () => {
      // Clean up chart and timer when component unmounts
      clearTimeout(timer);
      if (harvestChart.current) {
        harvestChart.current.destroy();
      }
    };
  }, [metricsData, area, activeTab]);

  // Create yield comparison chart
  useEffect(() => {
    // Add a small delay to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      if (yieldComparisonRef.current && activeTab === 'comparison') {
        // Destroy existing chart if it exists
        if (yieldComparisonChart.current) {
          yieldComparisonChart.current.destroy();
        }

      // Environment factors for yield comparison
      const environments = ['Open Field', 'Protected', 'Climate Controlled'];
      const yieldFactors = {
        'Open Field': 0.7,
        'Protected': 1.0,
        'Climate Controlled': 1.3
      };

      // Calculate yields for different environments
      const yields = environments.map(env => {
        const factor = yieldFactors[env];
        const baseYield = (metricsData.totalYield.min + metricsData.totalYield.max) / 2;
        return Math.round(baseYield * factor * 10) / 10;
      });

      // Highlight current environment
      const currentEnvIndex = environments.findIndex(env =>
        env.toLowerCase() === (environment || '').toLowerCase()
      );

      const backgroundColors = environments.map((_, index) =>
        index === currentEnvIndex
          ? 'rgba(46, 125, 50, 0.8)'
          : 'rgba(46, 125, 50, 0.3)'
      );

      const borderColors = environments.map((_, index) =>
        index === currentEnvIndex
          ? 'rgba(46, 125, 50, 1)'
          : 'rgba(46, 125, 50, 0.5)'
      );

      // Create the chart
      const ctx = yieldComparisonRef.current.getContext('2d');
      yieldComparisonChart.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: environments,
          datasets: [{
            label: 'Expected Yield (kg)',
            data: yields,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
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
                text: 'Total Yield (kg)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Growing Environment'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Yield Comparison by Environment',
              font: {
                size: 16
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Expected Yield: ${context.raw} kg`;
                },
                afterLabel: function(context) {
                  const index = context.dataIndex;
                  if (index === currentEnvIndex) {
                    return 'Your selected environment';
                  }
                  return null;
                }
              }
            }
          }
        }
      });
    }
    }, 300); // 300ms delay to ensure DOM is ready

    return () => {
      // Clean up chart and timer when component unmounts or tab changes
      clearTimeout(timer);
      if (yieldComparisonChart.current) {
        yieldComparisonChart.current.destroy();
      }
    };
  }, [metricsData, environment, activeTab]);

  return (
    <div className="production-metrics">
      <div className="metrics-overview">
        <h3>{cropName ? `${cropName} Production Metrics` : 'Production Metrics'}</h3>

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

      <div className="chart-tabs">
        <button
          className={`chart-tab ${activeTab === 'harvest' ? 'active' : ''}`}
          onClick={() => setActiveTab('harvest')}
        >
          Harvest Timeline
        </button>
        <button
          className={`chart-tab ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          Environment Comparison
        </button>
      </div>

      <div className={`chart-panel ${activeTab === 'harvest' ? 'active' : ''}`}>
        <div className="chart-container">
          <canvas ref={harvestChartRef}></canvas>
        </div>
      </div>

      <div className={`chart-panel ${activeTab === 'comparison' ? 'active' : ''}`}>
        <div className="chart-container">
          <canvas ref={yieldComparisonRef}></canvas>
        </div>
      </div>

      <div className="yield-factors">
        <h3>Yield Optimization Factors</h3>

        <div className="factors-list">
          <div className="factor-item">
            <div className="factor-header">
              <h4>Spacing Impact</h4>
              <div className="impact-indicator high">High Impact</div>
            </div>
            <div className="factor-content">
              <p>
                Proper plant spacing is crucial for maximum yield. For your {area} m² area,
                aim for <strong>{calculateOptimalPlants(area, getAverageSpacing(metricsData))}</strong> plants
                with <strong>{getAverageSpacing(metricsData)} cm</strong> spacing for optimal air circulation and light exposure.
              </p>
              <div className="factor-tip">
                <div className="tip-icon">💡</div>
                <div className="tip-text">
                  Increasing spacing by 10% can improve air circulation and reduce disease pressure,
                  but will reduce total plant count. Decreasing spacing by 10% allows more plants but may
                  increase competition and disease risk.
                </div>
              </div>
            </div>
          </div>

          <div className="factor-item">
            <div className="factor-header">
              <h4>Maintenance Impact</h4>
              <div className={`impact-indicator ${getMaintenanceImpactLevel(metricsData.maintenanceLevel)}`}>
                {getMaintenanceImpactLevel(metricsData.maintenanceLevel) === 'high' ? 'High Impact' :
                 getMaintenanceImpactLevel(metricsData.maintenanceLevel) === 'medium' ? 'Medium Impact' : 'Low Impact'}
              </div>
            </div>
            <div className="factor-content">
              <p>
                Regular <strong>{getMaintenanceTasks(metricsData.maintenanceLevel)}</strong> can increase your yield by
                up to <strong>{getMaintenanceImpact(metricsData.maintenanceLevel)}%</strong>. Neglecting these tasks
                may reduce yield by a similar amount.
              </p>
              <div className="maintenance-scale">
                <div className="scale-label">Maintenance Level:</div>
                <div className="scale-bar">
                  <div
                    className="scale-fill"
                    style={{
                      width: getMaintenanceScalePercentage(metricsData.maintenanceLevel)
                    }}
                  ></div>
                </div>
                <div className="scale-markers">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>

          <div className="factor-item">
            <div className="factor-header">
              <h4>Environmental Controls</h4>
              <div className="impact-indicator medium">Medium Impact</div>
            </div>
            <div className="factor-content">
              <p>
                {getEnvironmentalTips(metricsData.maintenanceLevel)}
              </p>
              <div className="factor-tip">
                <div className="tip-icon">🌡️</div>
                <div className="tip-text">
                  Monitoring temperature and humidity can help you optimize growing conditions.
                  Consider investing in simple monitoring tools to track these variables.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="optimization-summary">
          <h4>Optimization Summary</h4>
          <p>
            By implementing all recommended practices, you could potentially increase your yield by
            <strong> {calculateTotalYieldImprovement(metricsData.maintenanceLevel)}%</strong> above the baseline estimate.
            This would result in a total yield of approximately
            <strong> {calculateOptimizedYield(metricsData, calculateTotalYieldImprovement(metricsData.maintenanceLevel))} kg</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

// Additional helper functions
const getMaintenanceImpactLevel = (maintenanceLevel) => {
  switch (maintenanceLevel) {
    case 'High':
    case 'Medium to High':
      return 'high';
    case 'Medium':
      return 'medium';
    default:
      return 'low';
  }
};

const getMaintenanceScalePercentage = (maintenanceLevel) => {
  switch (maintenanceLevel) {
    case 'High':
      return '100%';
    case 'Medium to High':
      return '85%';
    case 'Medium':
      return '60%';
    case 'Low to Medium':
      return '35%';
    case 'Low':
      return '15%';
    default:
      return '50%';
  }
};

const calculateTotalYieldImprovement = (maintenanceLevel) => {
  // Base improvement from maintenance
  const maintenanceImprovement = getMaintenanceImpact(maintenanceLevel);

  // Additional improvements from other factors
  const spacingImprovement = 10; // Optimal spacing
  const environmentalImprovement = 5; // Environmental controls

  return maintenanceImprovement + spacingImprovement + environmentalImprovement;
};

const calculateOptimizedYield = (metricsData, improvementPercentage) => {
  const baseYield = (metricsData.totalYield.min + metricsData.totalYield.max) / 2;
  const optimizedYield = baseYield * (1 + improvementPercentage / 100);
  return Math.round(optimizedYield * 10) / 10; // Round to 1 decimal place
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
  // Commented out for now as it's not being used
  // const spacingMap = {
  //   'tomatoes': 60,
  //   'cucumbers': 45,
  //   'bellPeppers': 40,
  //   'eggplant': 50,
  //   'hotPeppers': 40
  // };

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
