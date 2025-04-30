/**
 * Mock data for tests
 */

// Mock crop data
const mockCrops = [
  {
    id: 'tomatoes',
    name: 'Tomatoes',
    scientificName: 'Solanum lycopersicum',
    lifeCycle: 'Annual',
    growthPattern: 'Vine',
    baseYield: { min: 3, max: 7 },
    timeToHarvest: { min: 60, max: 85 },
    harvestDuration: { min: 30, max: 60 },
    maintenanceLevel: 'Medium',
    keyRequirements: ['Full sun', 'Regular watering', 'Support for vines'],
    plantingMonths: {
      mediterranean: { start: 3, end: 6 },
      continental: { start: 4, end: 6 },
      tropical: { start: 2, end: 10 }
    },
    spacing: { min: 45, max: 60 },
    seedStartWeeks: 6,
    protectedExtensionWeeks: 4,
    recommendedVarieties: {
      mediterranean: ['Roma', 'San Marzano', 'Brandywine'],
      continental: ['Early Girl', 'Celebrity', 'Better Boy'],
      tropical: ['Heat Master', 'Solar Fire', 'Florida 91']
    },
    beginnerTips: 'Start with cherry tomatoes for an easier growing experience.',
    advancedTips: 'Try grafting tomatoes for increased disease resistance and yield.',
    risks: [
      {
        category: 'Disease',
        name: 'Late Blight',
        likelihood: {
          mediterranean: 'Medium',
          continental: 'High',
          tropical: 'Very High'
        },
        impact: 'Severe',
        mitigation: 'Use resistant varieties and ensure good air circulation.'
      },
      {
        category: 'Pest',
        name: 'Tomato Hornworm',
        likelihood: {
          mediterranean: 'Medium',
          continental: 'High',
          tropical: 'Medium'
        },
        impact: 'Moderate',
        mitigation: 'Inspect plants regularly and remove hornworms by hand.'
      }
    ],
    image: '/images/crops/tomato.jpg'
  },
  {
    id: 'cucumbers',
    name: 'Cucumbers',
    scientificName: 'Cucumis sativus',
    lifeCycle: 'Annual',
    growthPattern: 'Vine',
    baseYield: { min: 5, max: 10 },
    timeToHarvest: { min: 50, max: 70 },
    harvestDuration: { min: 30, max: 60 },
    maintenanceLevel: 'Low',
    keyRequirements: ['Full sun', 'Consistent moisture', 'Warm soil'],
    plantingMonths: {
      mediterranean: { start: 4, end: 6 },
      continental: { start: 5, end: 6 },
      tropical: { start: 3, end: 9 }
    },
    spacing: { min: 30, max: 45 },
    seedStartWeeks: 3,
    protectedExtensionWeeks: 3,
    recommendedVarieties: {
      mediterranean: ['Marketmore', 'Lemon', 'Persian'],
      continental: ['Straight Eight', 'Marketmore', 'Salad Bush'],
      tropical: ['Armenian', 'Poinsett', 'Suyo Long']
    },
    beginnerTips: 'Cucumbers are easy to grow and produce quickly.',
    advancedTips: 'Try succession planting every 2-3 weeks for continuous harvest.',
    risks: [
      {
        category: 'Disease',
        name: 'Powdery Mildew',
        likelihood: {
          mediterranean: 'High',
          continental: 'Medium',
          tropical: 'Very High'
        },
        impact: 'Moderate',
        mitigation: 'Provide good air circulation and avoid overhead watering.'
      }
    ],
    image: '/images/crops/cucumber.jpg'
  }
];

// Mock climate zone data
const mockClimateZones = [
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    description: 'Hot, dry summers and mild, rainy winters',
    growingSeasons: {
      spring: { start: 3, end: 5 },
      summer: { start: 6, end: 8 },
      fall: { start: 9, end: 11 },
      winter: { start: 12, end: 2 }
    },
    averageTemperatures: {
      spring: { min: 10, max: 22 },
      summer: { min: 18, max: 32 },
      fall: { min: 12, max: 25 },
      winter: { min: 5, max: 15 }
    },
    rainfall: {
      spring: 'Moderate',
      summer: 'Low',
      fall: 'Moderate',
      winter: 'High'
    },
    extremeWeatherEvents: ['Drought', 'Heat waves']
  },
  {
    id: 'continental',
    name: 'Continental',
    description: 'Hot summers and cold winters',
    growingSeasons: {
      spring: { start: 4, end: 5 },
      summer: { start: 6, end: 8 },
      fall: { start: 9, end: 10 },
      winter: { start: 11, end: 3 }
    },
    averageTemperatures: {
      spring: { min: 5, max: 18 },
      summer: { min: 15, max: 30 },
      fall: { min: 5, max: 20 },
      winter: { min: -10, max: 5 }
    },
    rainfall: {
      spring: 'High',
      summer: 'Moderate',
      fall: 'Moderate',
      winter: 'Low'
    },
    extremeWeatherEvents: ['Frost', 'Thunderstorms']
  }
];

// Mock yield factors
const mockYieldFactors = {
  climate: {
    mediterranean: {
      tomatoes: 1.2,
      cucumbers: 1.1,
      bellPeppers: 1.3,
      eggplant: 1.4,
      hotPeppers: 1.2
    },
    continental: {
      tomatoes: 1.0,
      cucumbers: 1.0,
      bellPeppers: 0.9,
      eggplant: 0.8,
      hotPeppers: 0.9
    },
    tropical: {
      tomatoes: 0.9,
      cucumbers: 1.2,
      bellPeppers: 1.0,
      eggplant: 1.2,
      hotPeppers: 1.3
    }
  },
  environment: {
    open: 1.0,
    protected: 1.3,
    cooled: 1.5
  },
  experience: {
    beginner: 0.8,
    intermediate: 1.0,
    advanced: 1.2
  }
};

// Mock forecast history
const mockForecastHistory = [
  {
    id: 'forecast1',
    userId: 'user123',
    createdAt: new Date('2023-07-01'),
    params: {
      climate: 'mediterranean',
      environment: 'open',
      area: 100,
      crops: ['tomatoes', 'cucumbers']
    },
    results: {
      tomatoes: {
        cropProfile: { name: 'Tomatoes' },
        productionMetrics: { totalYield: { min: 300, max: 700 } }
      },
      cucumbers: {
        cropProfile: { name: 'Cucumbers' },
        productionMetrics: { totalYield: { min: 400, max: 800 } }
      }
    }
  },
  {
    id: 'forecast2',
    userId: 'user123',
    createdAt: new Date('2023-07-15'),
    params: {
      climate: 'continental',
      environment: 'protected',
      area: 50,
      crops: ['tomatoes']
    },
    results: {
      tomatoes: {
        cropProfile: { name: 'Tomatoes' },
        productionMetrics: { totalYield: { min: 150, max: 350 } }
      }
    }
  }
];

module.exports = {
  mockCrops,
  mockClimateZones,
  mockYieldFactors,
  mockForecastHistory
};
