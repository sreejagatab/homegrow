/**
 * Calculate expected yield based on various factors
 * @param {Object} baseYield - Base yield range for the crop
 * @param {Object} climateData - Climate zone data
 * @param {string} environment - Growing environment
 * @param {Object} yieldFactors - Yield adjustment factors
 * @param {string} crop - Crop ID
 * @param {string} experience - Gardener experience level
 * @returns {Object} Adjusted yield range per square meter
 */
exports.calculateYield = (baseYield, climateData, environment, yieldFactors, crop, experience) => {
  // Get climate multiplier
  const climateMultiplier = yieldFactors.climate[climateData.id]?.[crop] || 1;
  
  // Get environment multiplier
  const environmentMultiplier = yieldFactors.environment[environment]?.[crop] || 1;
  
  // Get experience multiplier
  const experienceMultiplier = yieldFactors.experience[experience]?.[crop] || 1;
  
  // Calculate adjusted yield
  const minYield = Math.round(baseYield.min * climateMultiplier * environmentMultiplier * experienceMultiplier * 10) / 10;
  const maxYield = Math.round(baseYield.max * climateMultiplier * environmentMultiplier * experienceMultiplier * 10) / 10;
  
  return {
    min: minYield,
    max: maxYield
  };
};

/**
 * Calculate planting calendar based on crop and climate
 * @param {Object} cropPlantingMonths - Crop planting months by climate
 * @param {Object} climateData - Climate zone data
 * @param {string} environment - Growing environment
 * @param {Object} weatherData - Regional weather data if available
 * @returns {Object} Planting calendar with suitability ratings
 */
exports.calculatePlantingCalendar = (cropPlantingMonths, climateData, environment, weatherData) => {
  // Get planting months for this climate
  const plantingData = cropPlantingMonths[climateData.id] || {
    optimal: [],
    suitable: [],
    risky: []
  };
  
  // Adjust for environment
  let adjustedPlantingData = { ...plantingData };
  
  if (environment === 'protected' || environment === 'cooled') {
    // Protected environments can extend planting windows
    const risky = [...adjustedPlantingData.risky];
    const suitable = [...adjustedPlantingData.suitable];
    
    // Some risky months become suitable in protected environments
    adjustedPlantingData.suitable = [...suitable, ...risky.filter(month => 
      !suitable.includes(month) && !adjustedPlantingData.optimal.includes(month)
    )];
    
    // Generate new risky months (ones adjacent to suitable)
    const allMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const newRisky = allMonths.filter(month => 
      !adjustedPlantingData.optimal.includes(month) && 
      !adjustedPlantingData.suitable.includes(month) &&
      hasAdjacentMonth(month, [...adjustedPlantingData.optimal, ...adjustedPlantingData.suitable])
    );
    
    adjustedPlantingData.risky = newRisky;
  }
  
  // Adjust further if weather data available
  if (weatherData) {
    // This would incorporate actual weather forecasts or historical data
    // to refine planting windows based on specific regional conditions
  }
  
  // Create calendar object
  const calendar = [];
  for (let month = 1; month <= 12; month++) {
    let suitability;
    if (adjustedPlantingData.optimal.includes(month)) {
      suitability = 'optimal';
    } else if (adjustedPlantingData.suitable.includes(month)) {
      suitability = 'suitable';
    } else if (adjustedPlantingData.risky.includes(month)) {
      suitability = 'risky';
    } else {
      suitability = 'not_recommended';
    }
    
    calendar.push({
      month,
      suitability
    });
  }
  
  return calendar;
};

/**
 * Check if a month has an adjacent month in the provided array
 * @param {number} month - Month to check
 * @param {Array} monthArray - Array of months to check against
 * @returns {boolean} True if adjacent month exists
 */
function hasAdjacentMonth(month, monthArray) {
  const prev = month === 1 ? 12 : month - 1;
  const next = month === 12 ? 1 : month + 1;
  
  return monthArray.includes(prev) || monthArray.includes(next);
}

/**
 * Assess risk factors for a crop based on climate and environment
 * @param {Array} cropRisks - Crop-specific risks
 * @param {Object} climateData - Climate zone data
 * @param {string} environment - Growing environment
 * @param {Object} weatherData - Regional weather data if available
 * @returns {Array} Assessed risk factors with adjusted severity
 */
exports.assessRiskFactors = (cropRisks, climateData, environment, weatherData) => {
  if (!cropRisks || !cropRisks.length) {
    return [];
  }
  
  return cropRisks.map(risk => {
    // Create a copy of the risk
    const assessedRisk = { ...risk };
    
    // Adjust severity based on climate
    switch (risk.category) {
      case 'Temperature Extremes':
      case 'Cold Sensitivity':
        if (['tropical', 'subtropical'].includes(climateData.id)) {
          // Reduce cold sensitivity risk in warm climates
          if (assessedRisk.severity === 'high') {
            assessedRisk.severity = 'medium';
          } else if (assessedRisk.severity === 'medium') {
            assessedRisk.severity = 'low';
          }
        } else if (['continental', 'temperate', 'oceanic'].includes(climateData.id)) {
          // Increase cold sensitivity risk in cooler climates
          if (assessedRisk.severity === 'medium') {
            assessedRisk.severity = 'high';
          } else if (assessedRisk.severity === 'low') {
            assessedRisk.severity = 'medium';
          }
        }
        break;
        
      case 'Disease Pressure':
        if (['tropical', 'subtropical', 'oceanic'].includes(climateData.id)) {
          // Increase disease risk in humid climates
          if (assessedRisk.severity === 'medium') {
            assessedRisk.severity = 'high';
          } else if (assessedRisk.severity === 'low') {
            assessedRisk.severity = 'medium';
          }
        } else if (['arid', 'semiarid'].includes(climateData.id)) {
          // Decrease disease risk in dry climates
          if (assessedRisk.severity === 'high') {
            assessedRisk.severity = 'medium';
          } else if (assessedRisk.severity === 'medium') {
            assessedRisk.severity = 'low';
          }
        }
        break;
        
      case 'Pest Challenges':
      case 'Pest Vulnerability':
      case 'Pest Issues':
        // Adjust based on climate and local pest pressure
        if (['tropical', 'subtropical'].includes(climateData.id)) {
          // Higher pest pressure in warmer climates
          if (assessedRisk.severity === 'medium') {
            assessedRisk.severity = 'high';
          } else if (assessedRisk.severity === 'low') {
            assessedRisk.severity = 'medium';
          }
        } else if (['continental', 'temperate'].includes(climateData.id) &&
                   risk.description.toLowerCase().includes('aphid') ||
                   risk.description.toLowerCase().includes('mite')) {
          // Some pests are less prevalent in cooler climates
          if (assessedRisk.severity === 'high') {
            assessedRisk.severity = 'medium';
          } else if (assessedRisk.severity === 'medium') {
            assessedRisk.severity = 'low';
          }
        }
        break;
        
      case 'Moisture Balance':
      case 'Water Scarcity':
        if (['arid', 'semiarid'].includes(climateData.id)) {
          // Increase water-related risks in dry climates
          if (assessedRisk.severity === 'medium') {
            assessedRisk.severity = 'high';
          } else if (assessedRisk.severity === 'low') {
            assessedRisk.severity = 'medium';
          }
        } else if (['oceanic', 'tropical'].includes(climateData.id)) {
          // Decrease water scarcity risk in wet climates
          if (assessedRisk.severity === 'high') {
            assessedRisk.severity = 'medium';
          } else if (assessedRisk.severity === 'medium') {
            assessedRisk.severity = 'low';
          }
        }
        break;
    }
    
    // Adjust based on environment
    if (environment === 'protected' || environment === 'cooled') {
      // Protected environments generally reduce environmental risks
      if (assessedRisk.severity === 'high' && 
          !risk.category.includes('Disease') && 
          !risk.category.includes('Pest')) {
        assessedRisk.severity = 'medium';
      } else if (assessedRisk.severity === 'medium' && 
                !risk.category.includes('Disease') && 
                !risk.category.includes('Pest')) {
        assessedRisk.severity = 'low';
      }
      
      // But can increase disease risks due to humidity
      if (environment === 'protected' && risk.category.includes('Disease')) {
        if (assessedRisk.severity === 'medium') {
          assessedRisk.severity = 'high';
        } else if (assessedRisk.severity === 'low') {
          assessedRisk.severity = 'medium';
        }
      }
    }
    
    // Adjust based on weather data if available
    if (weatherData) {
      // This would incorporate actual weather forecasts or historical data
      // to refine risk assessments based on specific regional conditions
    }
    
    return assessedRisk;
  });
};
