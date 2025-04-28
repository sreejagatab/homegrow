import { createContext } from 'react';

// Create the Forecast Context
export const ForecastContext = createContext({
  forecastData: null,
  forecastParams: {
    country: '',
    region: '',
    climate: '',
    environment: 'open',
    area: 10,
    experience: 'intermediate'
  },
  crops: [],
  climateZones: [],
  updateForecast: () => {},
  updateForecastParams: () => {},
  resetForecast: () => {}
});
