/**
 * Format the forecast response for client
 * @param {Object} forecastResults - Raw forecast results
 * @param {Object} params - Original request parameters
 * @returns {Object} Formatted forecast response
 */
exports.formatForecastResponse = (forecastResults, params) => {
  return {
    meta: {
      generated: new Date().toISOString(),
      params
    },
    crops: forecastResults
  };
};

/**
 * Format planting calendar for display
 * @param {Array} calendar - Raw calendar data
 * @returns {Object} Formatted calendar data
 */
exports.formatPlantingCalendar = (calendar) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const formattedCalendar = calendar.map(item => {
    return {
      month: months[item.month - 1],
      shortMonth: months[item.month - 1].substring(0, 3),
      monthNumber: item.month,
      suitability: item.suitability,
      suitabilityScore: getSuitabilityScore(item.suitability)
    };
  });
  
  // Also include suitability periods for easy display
  const optimalPeriods = findContinuousPeriods(calendar, 'optimal');
  const suitablePeriods = findContinuousPeriods(calendar, 'suitable');
  const riskyPeriods = findContinuousPeriods(calendar, 'risky');
  
  return {
    monthlyData: formattedCalendar,
    periods: {
      optimal: formatPeriods(optimalPeriods, months),
      suitable: formatPeriods(suitablePeriods, months),
      risky: formatPeriods(riskyPeriods, months)
    }
  };
};

/**
 * Get numeric score for suitability level
 * @param {string} suitability - Suitability level
 * @returns {number} Suitability score
 */
function getSuitabilityScore(suitability) {
  switch (suitability) {
    case 'optimal':
      return 3;
    case 'suitable':
      return 2;
    case 'risky':
      return 1;
    default:
      return 0;
  }
}

/**
 * Find continuous periods of a specific suitability
 * @param {Array} calendar - Calendar data
 * @param {string} suitability - Suitability level to find
 * @returns {Array} Continuous periods
 */
function findContinuousPeriods(calendar, suitability) {
  const periods = [];
  let currentPeriod = null;
  
  // Check each month in the calendar
  for (let i = 0; i < calendar.length; i++) {
    if (calendar[i].suitability === suitability) {
      if (!currentPeriod) {
        currentPeriod = {
          start: calendar[i].month,
          end: calendar[i].month
        };
      } else {
        currentPeriod.end = calendar[i].month;
      }
    } else if (currentPeriod) {
      periods.push(currentPeriod);
      currentPeriod = null;
    }
  }
  
  // Don't forget to add the last period if it ends at December
  if (currentPeriod) {
    periods.push(currentPeriod);
  }
  
  // Check if there's a period spanning the year boundary (December to January)
  if (periods.length > 1 && 
      periods[0].start === 1 && 
      periods[periods.length - 1].end === 12) {
    // Merge the first and last periods
    const firstPeriod = periods.shift();
    const lastPeriod = periods.pop();
    periods.push({
      start: lastPeriod.start,
      end: firstPeriod.end,
      crossesYearBoundary: true
    });
  }
  
  return periods;
}

/**
 * Format periods for display
 * @param {Array} periods - Raw period data
 * @param {Array} months - Month names
 * @returns {Array} Formatted periods
 */
function formatPeriods(periods, months) {
  return periods.map(period => {
    const startMonth = months[period.start - 1];
    const endMonth = months[period.end - 1];
    
    if (period.start === period.end) {
      return startMonth;
    } else if (period.crossesYearBoundary) {
      return `${startMonth} to ${endMonth}`;
    } else {
      return `${startMonth} to ${endMonth}`;
    }
  });
}

/**
 * Format risk factors for display
 * @param {Array} riskFactors - Raw risk factors
 * @returns {Array} Formatted risk factors
 */
exports.formatRiskFactors = (riskFactors) => {
  return riskFactors.map(risk => {
    return {
      category: risk.category,
      description: risk.description,
      severity: risk.severity,
      severityScore: getSeverityScore(risk.severity),
      mitigation: risk.mitigation || null
    };
  }).sort((a, b) => b.severityScore - a.severityScore);
};

/**
 * Get numeric score for severity level
 * @param {string} severity - Severity level
 * @returns {number} Severity score
 */
function getSeverityScore(severity) {
  switch (severity) {
    case 'high':
      return 3;
    case 'medium':
      return 2;
    case 'low':
      return 1;
    default:
      return 0;
  }
}

/**
 * Format recommendations for display
 * @param {Array} recommendations - Raw recommendations
 * @returns {Array} Formatted recommendations
 */
exports.formatRecommendations = (recommendations) => {
  // Group recommendations by category
  const groupedRecommendations = {};
  
  recommendations.forEach(rec => {
    if (!groupedRecommendations[rec.category]) {
      groupedRecommendations[rec.category] = [];
    }
    groupedRecommendations[rec.category].push(rec.text);
  });
  
  // Convert to array format
  return Object.keys(groupedRecommendations).map(category => {
    return {
      category,
      recommendations: groupedRecommendations[category]
    };
  });
};
