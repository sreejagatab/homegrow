/**
 * Mock Forecasts Data
 * 
 * This file contains mock data for saved forecasts to be used in tests.
 */

const mockForecasts = [
  {
    id: '1',
    userId: '1',
    cropId: '1',
    cropName: 'Tomato',
    climateZone: '5',
    plantingDate: '2023-05-15',
    harvestDate: '2023-08-03',
    gardenArea: 10,
    yieldEstimate: {
      min: 50,
      max: 100,
      unit: 'lbs'
    },
    waterNeeds: 'moderate',
    sunNeeds: 'full',
    soilNeeds: 'well-draining, rich in organic matter',
    companionPlants: ['Basil', 'Marigold', 'Onion'],
    avoidPlants: ['Potato', 'Corn', 'Fennel'],
    growthStages: [
      {
        name: 'Germination',
        startDay: 0,
        endDay: 8,
        description: 'Seeds germinate and seedlings emerge'
      },
      {
        name: 'Vegetative Growth',
        startDay: 9,
        endDay: 32,
        description: 'Plants develop leaves and stems'
      },
      {
        name: 'Flowering',
        startDay: 33,
        endDay: 48,
        description: 'Plants produce flowers'
      },
      {
        name: 'Fruit Development',
        startDay: 49,
        endDay: 72,
        description: 'Fruits or vegetables develop'
      },
      {
        name: 'Maturation',
        startDay: 73,
        endDay: 80,
        description: 'Fruits or vegetables ripen and are ready for harvest'
      }
    ],
    notes: 'Planning to use drip irrigation and mulch to conserve water.',
    createdAt: '2023-04-10T12:00:00Z',
    updatedAt: '2023-04-10T12:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    cropId: '2',
    cropName: 'Lettuce',
    climateZone: '5',
    plantingDate: '2023-04-01',
    harvestDate: '2023-05-16',
    gardenArea: 5,
    yieldEstimate: {
      min: 2.5,
      max: 5,
      unit: 'lbs'
    },
    waterNeeds: 'moderate',
    sunNeeds: 'partial',
    soilNeeds: 'moist, rich in organic matter',
    companionPlants: ['Carrot', 'Radish', 'Cucumber'],
    avoidPlants: ['Broccoli', 'Cabbage', 'Sunflower'],
    growthStages: [
      {
        name: 'Germination',
        startDay: 0,
        endDay: 4,
        description: 'Seeds germinate and seedlings emerge'
      },
      {
        name: 'Vegetative Growth',
        startDay: 5,
        endDay: 18,
        description: 'Plants develop leaves and stems'
      },
      {
        name: 'Leaf Development',
        startDay: 19,
        endDay: 27,
        description: 'Plants develop full-sized leaves'
      },
      {
        name: 'Head Formation',
        startDay: 28,
        endDay: 40,
        description: 'Heads form and develop'
      },
      {
        name: 'Maturation',
        startDay: 41,
        endDay: 45,
        description: 'Heads reach full size and are ready for harvest'
      }
    ],
    notes: 'Will plant in succession every 2 weeks for continuous harvest.',
    createdAt: '2023-03-15T10:30:00Z',
    updatedAt: '2023-03-15T10:30:00Z'
  },
  {
    id: '3',
    userId: '1',
    cropId: '3',
    cropName: 'Carrot',
    climateZone: '5',
    plantingDate: '2023-04-15',
    harvestDate: '2023-06-24',
    gardenArea: 8,
    yieldEstimate: {
      min: 8,
      max: 16,
      unit: 'lbs'
    },
    waterNeeds: 'moderate',
    sunNeeds: 'full',
    soilNeeds: 'loose, sandy, well-draining',
    companionPlants: ['Onion', 'Lettuce', 'Peas'],
    avoidPlants: ['Dill', 'Parsnip', 'Radish'],
    growthStages: [
      {
        name: 'Germination',
        startDay: 0,
        endDay: 7,
        description: 'Seeds germinate and seedlings emerge'
      },
      {
        name: 'Seedling',
        startDay: 8,
        endDay: 28,
        description: 'Seedlings develop first true leaves'
      },
      {
        name: 'Root Development',
        startDay: 29,
        endDay: 42,
        description: 'Roots begin to enlarge'
      },
      {
        name: 'Root Enlargement',
        startDay: 43,
        endDay: 63,
        description: 'Roots continue to enlarge and develop color'
      },
      {
        name: 'Maturation',
        startDay: 64,
        endDay: 70,
        description: 'Roots reach full size and are ready for harvest'
      }
    ],
    notes: 'Need to prepare soil well to ensure straight roots.',
    createdAt: '2023-03-20T14:45:00Z',
    updatedAt: '2023-03-20T14:45:00Z'
  }
];

export default mockForecasts;
