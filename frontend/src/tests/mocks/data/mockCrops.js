/**
 * Mock Crops Data
 * 
 * This file contains mock data for crops to be used in tests.
 */

const mockCrops = [
  {
    id: '1',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    description: 'A popular garden vegetable with juicy fruits.',
    growthDays: 80,
    yieldPerSquareFoot: {
      min: 5,
      max: 10,
      unit: 'lbs'
    },
    waterNeeds: 'moderate',
    sunNeeds: 'full',
    soilNeeds: 'well-draining, rich in organic matter',
    companionPlants: ['Basil', 'Marigold', 'Onion'],
    avoidPlants: ['Potato', 'Corn', 'Fennel'],
    plantingDepth: '1/4 inch',
    spacing: '18-24 inches',
    harvestInstructions: 'Harvest when fruits are firm and fully colored.',
    commonPests: ['Aphids', 'Hornworms', 'Whiteflies'],
    diseaseResistance: 'moderate',
    nutritionalValue: 'High in vitamins A and C, potassium, and lycopene.',
    culinaryUses: 'Fresh eating, sauces, salads, sandwiches, cooking.',
    storageInstructions: 'Store at room temperature away from direct sunlight. Do not refrigerate.',
    image: 'tomato.jpg'
  },
  {
    id: '2',
    name: 'Lettuce',
    scientificName: 'Lactuca sativa',
    description: 'A leafy green vegetable used primarily in salads.',
    growthDays: 45,
    yieldPerSquareFoot: {
      min: 0.5,
      max: 1,
      unit: 'lbs'
    },
    waterNeeds: 'moderate',
    sunNeeds: 'partial',
    soilNeeds: 'moist, rich in organic matter',
    companionPlants: ['Carrot', 'Radish', 'Cucumber'],
    avoidPlants: ['Broccoli', 'Cabbage', 'Sunflower'],
    plantingDepth: '1/8 inch',
    spacing: '6-12 inches',
    harvestInstructions: 'Harvest outer leaves as needed or cut the entire plant.',
    commonPests: ['Aphids', 'Slugs', 'Snails'],
    diseaseResistance: 'low',
    nutritionalValue: 'Good source of vitamins A and K, folate, and fiber.',
    culinaryUses: 'Salads, sandwiches, wraps.',
    storageInstructions: 'Store in the refrigerator in a plastic bag for up to 1 week.',
    image: 'lettuce.jpg'
  },
  {
    id: '3',
    name: 'Carrot',
    scientificName: 'Daucus carota',
    description: 'A root vegetable with a crunchy texture and sweet taste.',
    growthDays: 70,
    yieldPerSquareFoot: {
      min: 1,
      max: 2,
      unit: 'lbs'
    },
    waterNeeds: 'moderate',
    sunNeeds: 'full',
    soilNeeds: 'loose, sandy, well-draining',
    companionPlants: ['Onion', 'Lettuce', 'Peas'],
    avoidPlants: ['Dill', 'Parsnip', 'Radish'],
    plantingDepth: '1/4 inch',
    spacing: '2-3 inches',
    harvestInstructions: 'Harvest when roots reach desired size, typically 1-1.5 inches in diameter.',
    commonPests: ['Carrot Rust Fly', 'Wireworms', 'Nematodes'],
    diseaseResistance: 'moderate',
    nutritionalValue: 'High in beta-carotene, fiber, vitamin K, and potassium.',
    culinaryUses: 'Fresh eating, cooking, juicing, baking.',
    storageInstructions: 'Remove tops and store in the refrigerator for up to 2 weeks.',
    image: 'carrot.jpg'
  },
  {
    id: '4',
    name: 'Bell Pepper',
    scientificName: 'Capsicum annuum',
    description: 'A sweet, crunchy vegetable available in various colors.',
    growthDays: 70,
    yieldPerSquareFoot: {
      min: 1,
      max: 3,
      unit: 'lbs'
    },
    waterNeeds: 'moderate',
    sunNeeds: 'full',
    soilNeeds: 'well-draining, rich in organic matter',
    companionPlants: ['Basil', 'Onion', 'Spinach'],
    avoidPlants: ['Fennel', 'Kohlrabi', 'Beans'],
    plantingDepth: '1/4 inch',
    spacing: '18-24 inches',
    harvestInstructions: 'Harvest when peppers reach full size and desired color.',
    commonPests: ['Aphids', 'Pepper Maggots', 'Spider Mites'],
    diseaseResistance: 'moderate',
    nutritionalValue: 'High in vitamins C and A, potassium, and fiber.',
    culinaryUses: 'Fresh eating, cooking, stuffing, roasting.',
    storageInstructions: 'Store in the refrigerator for up to 1-2 weeks.',
    image: 'bell-pepper.jpg'
  },
  {
    id: '5',
    name: 'Cucumber',
    scientificName: 'Cucumis sativus',
    description: 'A refreshing vegetable with high water content.',
    growthDays: 55,
    yieldPerSquareFoot: {
      min: 2,
      max: 5,
      unit: 'lbs'
    },
    waterNeeds: 'high',
    sunNeeds: 'full',
    soilNeeds: 'well-draining, rich in organic matter',
    companionPlants: ['Corn', 'Beans', 'Sunflower'],
    avoidPlants: ['Potato', 'Sage', 'Melons'],
    plantingDepth: '1/2 inch',
    spacing: '12-18 inches',
    harvestInstructions: 'Harvest when cucumbers reach desired size, typically 6-8 inches long.',
    commonPests: ['Cucumber Beetles', 'Aphids', 'Spider Mites'],
    diseaseResistance: 'low',
    nutritionalValue: 'Good source of vitamins K and C, potassium, and magnesium.',
    culinaryUses: 'Fresh eating, salads, pickling.',
    storageInstructions: 'Store in the refrigerator for up to 1 week.',
    image: 'cucumber.jpg'
  }
];

export default mockCrops;
