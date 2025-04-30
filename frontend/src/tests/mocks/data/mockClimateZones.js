/**
 * Mock Climate Zones Data
 * 
 * This file contains mock data for climate zones to be used in tests.
 */

const mockClimateZones = [
  {
    id: '1',
    name: 'Zone 1',
    description: 'Below -50°F (-45.6°C)',
    characteristics: 'Extremely cold, short growing season',
    suitableCrops: ['Hardy root vegetables', 'Cold-resistant greens'],
    growingSeasonStart: 'June',
    growingSeasonEnd: 'August',
    averageFrostDates: {
      lastSpring: 'June 1',
      firstFall: 'September 1'
    },
    annualPrecipitation: '10-20 inches',
    soilTypes: ['Sandy', 'Clay'],
    commonChallenges: ['Extremely short growing season', 'Severe cold']
  },
  {
    id: '2',
    name: 'Zone 2',
    description: '-50°F to -40°F (-45.6°C to -40°C)',
    characteristics: 'Very cold, short growing season',
    suitableCrops: ['Root vegetables', 'Cold-hardy greens', 'Some berries'],
    growingSeasonStart: 'Late May',
    growingSeasonEnd: 'Early September',
    averageFrostDates: {
      lastSpring: 'May 15',
      firstFall: 'September 15'
    },
    annualPrecipitation: '15-25 inches',
    soilTypes: ['Loamy', 'Clay'],
    commonChallenges: ['Short growing season', 'Cold temperatures']
  },
  {
    id: '3',
    name: 'Zone 3',
    description: '-40°F to -30°F (-40°C to -34.4°C)',
    characteristics: 'Cold, relatively short growing season',
    suitableCrops: ['Root vegetables', 'Leafy greens', 'Berries', 'Some tree fruits'],
    growingSeasonStart: 'Mid May',
    growingSeasonEnd: 'Late September',
    averageFrostDates: {
      lastSpring: 'May 1',
      firstFall: 'October 1'
    },
    annualPrecipitation: '20-30 inches',
    soilTypes: ['Loamy', 'Sandy loam'],
    commonChallenges: ['Late spring frosts', 'Early fall frosts']
  },
  {
    id: '4',
    name: 'Zone 4',
    description: '-30°F to -20°F (-34.4°C to -28.9°C)',
    characteristics: 'Cold winters, warm summers',
    suitableCrops: ['Root vegetables', 'Leafy greens', 'Berries', 'Tree fruits', 'Some warm-season crops'],
    growingSeasonStart: 'Late April',
    growingSeasonEnd: 'Mid October',
    averageFrostDates: {
      lastSpring: 'April 15',
      firstFall: 'October 15'
    },
    annualPrecipitation: '25-35 inches',
    soilTypes: ['Loamy', 'Clay loam'],
    commonChallenges: ['Variable spring temperatures', 'Early fall frosts']
  },
  {
    id: '5',
    name: 'Zone 5',
    description: '-20°F to -10°F (-28.9°C to -23.3°C)',
    characteristics: 'Cold winters, warm summers, moderate growing season',
    suitableCrops: ['Most vegetables', 'Many fruits', 'Some nuts'],
    growingSeasonStart: 'Mid April',
    growingSeasonEnd: 'Late October',
    averageFrostDates: {
      lastSpring: 'April 1',
      firstFall: 'November 1'
    },
    annualPrecipitation: '30-40 inches',
    soilTypes: ['Loamy', 'Silty'],
    commonChallenges: ['Late spring frosts', 'Variable winter temperatures']
  },
  {
    id: '6',
    name: 'Zone 6',
    description: '-10°F to 0°F (-23.3°C to -17.8°C)',
    characteristics: 'Moderate winters, warm summers, good growing season',
    suitableCrops: ['Most vegetables', 'Many fruits', 'Nuts', 'Some tender perennials'],
    growingSeasonStart: 'Early April',
    growingSeasonEnd: 'Early November',
    averageFrostDates: {
      lastSpring: 'March 15',
      firstFall: 'November 15'
    },
    annualPrecipitation: '35-45 inches',
    soilTypes: ['Loamy', 'Clay loam', 'Sandy loam'],
    commonChallenges: ['Variable winter temperatures', 'Summer drought']
  },
  {
    id: '7',
    name: 'Zone 7',
    description: '0°F to 10°F (-17.8°C to -12.2°C)',
    characteristics: 'Mild winters, hot summers, long growing season',
    suitableCrops: ['Most vegetables', 'Many fruits', 'Nuts', 'Many tender perennials'],
    growingSeasonStart: 'Late March',
    growingSeasonEnd: 'Mid November',
    averageFrostDates: {
      lastSpring: 'March 1',
      firstFall: 'December 1'
    },
    annualPrecipitation: '40-50 inches',
    soilTypes: ['Loamy', 'Sandy', 'Clay'],
    commonChallenges: ['Summer heat and drought', 'Pest pressure']
  },
  {
    id: '8',
    name: 'Zone 8',
    description: '10°F to 20°F (-12.2°C to -6.7°C)',
    characteristics: 'Mild winters, hot summers, long growing season',
    suitableCrops: ['Most vegetables', 'Many fruits', 'Nuts', 'Tender perennials'],
    growingSeasonStart: 'Early March',
    growingSeasonEnd: 'Late November',
    averageFrostDates: {
      lastSpring: 'February 15',
      firstFall: 'December 15'
    },
    annualPrecipitation: '45-55 inches',
    soilTypes: ['Sandy loam', 'Clay', 'Loamy'],
    commonChallenges: ['Summer heat and humidity', 'Pest and disease pressure']
  },
  {
    id: '9',
    name: 'Zone 9',
    description: '20°F to 30°F (-6.7°C to -1.1°C)',
    characteristics: 'Very mild winters, hot summers, very long growing season',
    suitableCrops: ['Most vegetables', 'Many fruits', 'Nuts', 'Citrus', 'Subtropical plants'],
    growingSeasonStart: 'February',
    growingSeasonEnd: 'December',
    averageFrostDates: {
      lastSpring: 'February 1',
      firstFall: 'December 30'
    },
    annualPrecipitation: '50-60 inches',
    soilTypes: ['Sandy', 'Loamy', 'Clay'],
    commonChallenges: ['Summer heat and humidity', 'Pest and disease pressure', 'Winter rains']
  },
  {
    id: '10',
    name: 'Zone 10',
    description: '30°F to 40°F (-1.1°C to 4.4°C)',
    characteristics: 'Very mild winters, hot summers, year-round growing season',
    suitableCrops: ['Most vegetables', 'Tropical fruits', 'Citrus', 'Subtropical plants'],
    growingSeasonStart: 'Year-round',
    growingSeasonEnd: 'Year-round',
    averageFrostDates: {
      lastSpring: 'Rare frost',
      firstFall: 'Rare frost'
    },
    annualPrecipitation: '55-65 inches',
    soilTypes: ['Sandy', 'Loamy', 'Clay'],
    commonChallenges: ['Summer heat and humidity', 'Pest and disease pressure', 'Seasonal drought']
  }
];

export default mockClimateZones;
