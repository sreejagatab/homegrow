const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

// Path to regions data file
const REGIONS_PATH = path.join(__dirname, '../data/regions.json');

/**
 * Get weather data for a specific region
 * @param {string} country - Country code
 * @param {string} region - Region ID
 * @returns {Object} Weather data
 */
exports.getRegionalWeatherData = async (country, region) => {
  try {
    // In a production environment, this would make a call to a weather API
    // For this MVP, we'll use regionally adjusted mock data based on climate zones

    // Get region information from data file
    const regionsData = JSON.parse(await fs.readFile(REGIONS_PATH, 'utf8'));
    const countryData = regionsData.find(c => c.code === country);
    
    if (!countryData) {
      throw new Error(`Country data not found for ${country}`);
    }
    
    const regionData = countryData.regions.find(r => r.id === region);
    
    if (!regionData) {
      throw new Error(`Region data not found for ${region}`);
    }

    // Generate mock weather data based on region climate
    return generateMockWeatherData(regionData);
  } catch (error) {
    console.error(`Error getting regional weather data: ${error.message}`);
    throw error;
  }
};

/**
 * Get current weather data from external API (if available)
 * @param {string} location - Location string (city, region, country)
 * @returns {Object} Current weather data
 */
exports.getCurrentWeather = async (location) => {
  try {
    // In a production environment, this would call a weather API
    // Example of how it might be implemented with OpenWeatherMap API
    /*
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: location,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });
    
    return {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      conditions: response.data.weather[0].main,
      windSpeed: response.data.wind.speed
    };
    */
    
    // For MVP, return mock weather data
    return {
      temperature: 22,
      humidity: 65,
      conditions: 'Partly Cloudy',
      windSpeed: 10
    };
  } catch (error) {
    console.error(`Error getting current weather: ${error.message}`);
    throw error;
  }
};

/**
 * Get seasonal forecast data from external API (if available)
 * @param {string} country - Country code
 * @param {string} region - Region ID
 * @returns {Object} Seasonal forecast data
 */
exports.getSeasonalForecast = async (country, region) => {
  try {
    // In a production environment, this would call a seasonal forecast API
    // Example of how it might be implemented with a forecast API
    /*
    const response = await axios.get('https://api.seasonalforecast.example/v1/forecast', {
      params: {
        country: country,
        region: region,
        apikey: process.env.FORECAST_API_KEY
      }
    });
    
    return {
      temperature: {
        trend: response.data.temperature.trend,
        confidence: response.data.temperature.confidence
      },
      precipitation: {
        trend: response.data.precipitation.trend,
        confidence: response.data.precipitation.confidence
      },
      growingSeason: {
        start: response.data.growingSeason.start,
        end: response.data.growingSeason.end,
        confidence: response.data.growingSeason.confidence
      }
    };
    */
    
    // For MVP, return mock seasonal forecast based on region data
    const regionsData = JSON.parse(await fs.readFile(REGIONS_PATH, 'utf8'));
    const countryData = regionsData.find(c => c.code === country);
    
    if (!countryData) {
      throw new Error(`Country data not found for ${country}`);
    }
    
    const regionData = countryData.regions.find(r => r.id === region);
    
    if (!regionData) {
      throw new Error(`Region data not found for ${region}`);
    }
    
    return generateMockSeasonalForecast(regionData);
  } catch (error) {
    console.error(`Error getting seasonal forecast: ${error.message}`);
    throw error;
  }
};

/**
 * Generate mock weather data based on region information
 * @param {Object} regionData - Region data
 * @returns {Object} Mock weather data
 */
function generateMockWeatherData(regionData) {
  const climateZone = regionData.climateZone;
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  
  // Determine current season (adjust for southern hemisphere)
  let isSouthernHemisphere = false;
  if (regionData.averageTemperatures && 
      regionData.averageTemperatures.summer && 
      regionData.averageTemperatures.summer.high > 0) {
    // Check if summer is during northern hemisphere winter
    if ((currentMonth >= 12 || currentMonth <= 2) && 
        regionData.averageTemperatures.summer.high > 
        regionData.averageTemperatures.winter.high + 10) {
      isSouthernHemisphere = true;
    }
  }
  
  let season;
  if (isSouthernHemisphere) {
    if (currentMonth >= 12 || currentMonth <= 2) season = 'summer';
    else if (currentMonth >= 3 && currentMonth <= 5) season = 'autumn';
    else if (currentMonth >= 6 && currentMonth <= 8) season = 'winter';
    else season = 'spring';
  } else {
    if (currentMonth >= 12 || currentMonth <= 2) season = 'winter';
    else if (currentMonth >= 3 && currentMonth <= 5) season = 'spring';
    else if (currentMonth >= 6 && currentMonth <= 8) season = 'summer';
    else season = 'autumn';
  }
  
  // Base temperature and precipitation on climate zone and season
  let temperature, rainfall, humidity;
  
  switch (climateZone) {
    case 'tropical':
      temperature = {
        average: season === 'winter' ? 24 : 28,
        min: season === 'winter' ? 18 : 22,
        max: season === 'winter' ? 30 : 34
      };
      rainfall = season === 'winter' ? 'low' : 'high';
      humidity = season === 'winter' ? 'medium' : 'high';
      break;
      
    case 'subtropical':
      temperature = {
        average: season === 'winter' ? 16 : 26,
        min: season === 'winter' ? 10 : 20,
        max: season === 'winter' ? 22 : 32
      };
      rainfall = season === 'winter' ? 'low' : 'medium';
      humidity = season === 'winter' ? 'low' : 'medium';
      break;
      
    case 'mediterranean':
      temperature = {
        average: season === 'winter' ? 10 : 24,
        min: season === 'winter' ? 5 : 16,
        max: season === 'winter' ? 15 : 32
      };
      rainfall = season === 'winter' ? 'medium' : 'very low';
      humidity = season === 'winter' ? 'medium' : 'low';
      break;
      
    case 'continental':
      temperature = {
        average: season === 'winter' ? -5 : 20,
        min: season === 'winter' ? -15 : 12,
        max: season === 'winter' ? 5 : 28
      };
      rainfall = season === 'spring' ? 'medium' : 'low';
      humidity = season === 'winter' ? 'low' : 'medium';
      break;
      
    case 'oceanic':
      temperature = {
        average: season === 'winter' ? 5 : 15,
        min: season === 'winter' ? 0 : 10,
        max: season === 'winter' ? 10 : 20
      };
      rainfall = 'medium';
      humidity = 'medium';
      break;
      
    case 'arid':
      temperature = {
        average: season === 'winter' ? 10 : 30,
        min: season === 'winter' ? 0 : 20,
        max: season === 'winter' ? 20 : 40
      };
      rainfall = 'very low';
      humidity = 'very low';
      break;
      
    case 'semiarid':
      temperature = {
        average: season === 'winter' ? 5 : 25,
        min: season === 'winter' ? -5 : 15,
        max: season === 'winter' ? 15 : 35
      };
      rainfall = 'low';
      humidity = 'low';
      break;
      
    default:
      temperature = {
        average: season === 'winter' ? 5 : 20,
        min: season === 'winter' ? 0 : 15,
        max: season === 'winter' ? 10 : 25
      };
      rainfall = 'medium';
      humidity = 'medium';
  }
  
  // Adjust with region-specific data if available
  if (regionData.averageTemperatures && regionData.averageTemperatures[season]) {
    temperature.min = regionData.averageTemperatures[season].low;
    temperature.max = regionData.averageTemperatures[season].high;
    temperature.average = (temperature.min + temperature.max) / 2;
  }
  
  // Generate growing season information
  const growingSeason = {
    isActive: false,
    timeToStart: null,
    timeToEnd: null
  };
  
  if (regionData.growingSeasons) {
    const startMonth = regionData.growingSeasons.start.month;
    const endMonth = regionData.growingSeasons.end.month;
    
    // Check if we're in growing season
    if (startMonth <= endMonth) {
      // Normal case (e.g., April to October)
      growingSeason.isActive = currentMonth >= startMonth && currentMonth <= endMonth;
    } else {
      // Season spans year boundary (e.g., October to April)
      growingSeason.isActive = currentMonth >= startMonth || currentMonth <= endMonth;
    }
    
    // Calculate time to start or end of growing season
    if (growingSeason.isActive) {
      let monthsToEnd;
      if (currentMonth <= endMonth) {
        monthsToEnd = endMonth - currentMonth;
      } else {
        monthsToEnd = (12 - currentMonth) + endMonth;
      }
      growingSeason.timeToEnd = monthsToEnd;
    } else {
      let monthsToStart;
      if (currentMonth < startMonth) {
        monthsToStart = startMonth - currentMonth;
      } else {
        monthsToStart = (12 - currentMonth) + startMonth;
      }
      growingSeason.timeToStart = monthsToStart;
    }
  }
  
  return {
    currentConditions: {
      temperature: temperature.average,
      humidity: humidityToPercentage(humidity),
      rainfall: rainfallToAmount(rainfall),
      season: season
    },
    temperature: temperature,
    growingSeason: growingSeason,
    regionClimate: climateZone
  };
}

/**
 * Generate mock seasonal forecast based on region data
 * @param {Object} regionData - Region data
 * @returns {Object} Mock seasonal forecast
 */
function generateMockSeasonalForecast(regionData) {
  const climateZone = regionData.climateZone;
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  
  // Generate random temperature trend (-1 to 1)
  const temperatureTrend = Math.round((Math.random() * 2 - 1) * 10) / 10;
  
  // Generate random precipitation trend (-1 to 1)
  const precipitationTrend = Math.round((Math.random() * 2 - 1) * 10) / 10;
  
  // Adjust growing season based on trends
  let growingSeasonAdjustment = 0;
  if (temperatureTrend > 0.5) {
    // Warmer than normal, growing season might start earlier and end later
    growingSeasonAdjustment = 1;
  } else if (temperatureTrend < -0.5) {
    // Cooler than normal, growing season might start later and end earlier
    growingSeasonAdjustment = -1;
  }
  
  // Calculate adjusted growing season
  let growingSeason = {
    start: regionData.growingSeasons ? regionData.growingSeasons.start.month : (climateZone === 'tropical' ? 1 : 4),
    end: regionData.growingSeasons ? regionData.growingSeasons.end.month : (climateZone === 'tropical' ? 12 : 10)
  };
  
  // Adjust start and end months if not tropical climate
  if (climateZone !== 'tropical') {
    growingSeason.start = Math.max(1, growingSeason.start - growingSeasonAdjustment);
    growingSeason.end = Math.min(12, growingSeason.end + growingSeasonAdjustment);
  }
  
  return {
    seasonalOutlook: {
      temperature: {
        trend: temperatureTrend > 0 ? 'above_normal' : (temperatureTrend < 0 ? 'below_normal' : 'normal'),
        confidence: Math.abs(temperatureTrend) > 0.5 ? 'high' : 'medium'
      },
      precipitation: {
        trend: precipitationTrend > 0 ? 'above_normal' : (precipitationTrend < 0 ? 'below_normal' : 'normal'),
        confidence: Math.abs(precipitationTrend) > 0.5 ? 'high' : 'medium'
      }
    },
    growingSeason: {
      projectedStart: {
        month: growingSeason.start,
        confidence: Math.abs(temperatureTrend) > 0.5 ? 'medium' : 'high'
      },
      projectedEnd: {
        month: growingSeason.end,
        confidence: Math.abs(temperatureTrend) > 0.5 ? 'medium' : 'high'
      }
    },
    alerts: generateSeasonalAlerts(climateZone, temperatureTrend, precipitationTrend)
  };
}

/**
 * Generate seasonal alerts based on climate and trends
 * @param {string} climateZone - Climate zone
 * @param {number} temperatureTrend - Temperature trend
 * @param {number} precipitationTrend - Precipitation trend
 * @returns {Array} Seasonal alerts
 */
function generateSeasonalAlerts(climateZone, temperatureTrend, precipitationTrend) {
  const alerts = [];
  
  // Generate alerts based on temperature trend
  if (temperatureTrend > 0.5) {
    if (['tropical', 'subtropical', 'arid', 'semiarid'].includes(climateZone)) {
      alerts.push({
        type: 'temperature',
        severity: 'moderate',
        message: 'Higher than normal temperatures expected. Consider shade cloth for heat-sensitive crops.'
      });
    }
    
    if (['continental', 'temperate'].includes(climateZone)) {
      alerts.push({
        type: 'temperature',
        severity: 'low',
        message: 'Warmer than normal temperatures may extend the growing season.'
      });
    }
  } else if (temperatureTrend < -0.5) {
    if (['continental', 'temperate', 'oceanic'].includes(climateZone)) {
      alerts.push({
        type: 'temperature',
        severity: 'moderate',
        message: 'Cooler than normal temperatures expected. Consider cold frames or row covers.'
      });
    }
    
    if (['mediterranean', 'subtropical'].includes(climateZone)) {
      alerts.push({
        type: 'temperature',
        severity: 'low',
        message: 'Cooler than normal temperatures may delay planting for some crops.'
      });
    }
  }
  
  // Generate alerts based on precipitation trend
  if (precipitationTrend > 0.5) {
    if (['arid', 'semiarid', 'mediterranean'].includes(climateZone)) {
      alerts.push({
        type: 'precipitation',
        severity: 'low',
        message: 'Higher than normal rainfall expected, which may benefit drought-prone regions.'
      });
    }
    
    if (['tropical', 'subtropical', 'oceanic'].includes(climateZone)) {
      alerts.push({
        type: 'precipitation',
        severity: 'moderate',
        message: 'Higher than normal rainfall may increase disease pressure. Ensure good drainage.'
      });
    }
  } else if (precipitationTrend < -0.5) {
    if (['arid', 'semiarid'].includes(climateZone)) {
      alerts.push({
        type: 'precipitation',
        severity: 'high',
        message: 'Lower than normal rainfall expected. Plan for additional irrigation needs.'
      });
    }
    
    if (['mediterranean', 'subtropical'].includes(climateZone)) {
      alerts.push({
        type: 'precipitation',
        severity: 'moderate',
        message: 'Drier than normal conditions expected. Consider water-conserving mulches.'
      });
    }
  }
  
  return alerts;
}

/**
 * Convert humidity descriptor to percentage
 * @param {string} humidity - Humidity descriptor
 * @returns {number} Humidity percentage
 */
function humidityToPercentage(humidity) {
  switch (humidity) {
    case 'very low':
      return 20;
    case 'low':
      return 40;
    case 'medium':
      return 60;
    case 'high':
      return 80;
    case 'very high':
      return 90;
    default:
      return 50;
  }
}

/**
 * Convert rainfall descriptor to amount in mm
 * @param {string} rainfall - Rainfall descriptor
 * @returns {number} Rainfall amount in mm
 */
function rainfallToAmount(rainfall) {
  switch (rainfall) {
    case 'very low':
      return 10;
    case 'low':
      return 30;
    case 'medium':
      return 80;
    case 'high':
      return 150;
    case 'very high':
      return 250;
    default:
      return 50;
  }
}