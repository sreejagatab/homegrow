// This script initializes the MongoDB database on container startup
db = db.getSiblingDB('homegrow');

// Create collections
db.createCollection('users');
db.createCollection('forecasts');
db.createCollection('gardens');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.forecasts.createIndex({ userId: 1 });
db.forecasts.createIndex({ createdAt: -1 });
db.gardens.createIndex({ userId: 1 });

// Insert admin user (for development and testing only)
// In production, use strong password hashing
db.users.insertOne({
  email: 'admin@homegrow.example',
  password: '$2a$10$qPnTwLmMGP6AbCMEEJdB4eufgT4.xCZZ1AgbxOYb4VsqokLCoEFvG', // 'admin123' hashed with bcrypt
  name: 'Admin User',
  createdAt: new Date(),
  updatedAt: new Date(),
  roles: ['admin', 'user'],
  preferences: {
    defaultCountry: 'usa',
    defaultClimate: 'temperate',
    defaultEnvironment: 'open',
    defaultArea: 10,
    preferredCrops: ['tomatoes', 'cucumbers', 'bellPeppers']
  }
});

// Insert test user (for development and testing only)
db.users.insertOne({
  email: 'user@homegrow.example',
  password: '$2a$10$tNJC0Ly0oRJ7ZrGqXsMYlOc5xbt1p0TLJp715YpdnmQHMfSuAqxAK', // 'password123' hashed with bcrypt
  name: 'Test User',
  createdAt: new Date(),
  updatedAt: new Date(),
  roles: ['user'],
  preferences: {
    defaultCountry: 'usa',
    defaultRegion: 'west-coast',
    defaultClimate: 'mediterranean',
    defaultEnvironment: 'protected',
    defaultArea: 5,
    preferredCrops: ['tomatoes', 'bellPeppers', 'hotPeppers']
  }
});

// Insert sample forecast for test user
const testUserId = db.users.findOne({ email: 'user@homegrow.example' })._id;

db.forecasts.insertOne({
  userId: testUserId,
  name: 'Summer Garden 2025',
  params: {
    country: 'usa',
    region: 'west-coast',
    climate: 'mediterranean',
    environment: 'protected',
    area: 5,
    crops: ['tomatoes', 'bellPeppers', 'hotPeppers'],
    experience: 'intermediate'
  },
  results: {
    meta: {
      generated: new Date(),
      params: {
        country: 'usa',
        region: 'west-coast',
        climate: 'mediterranean',
        environment: 'protected',
        area: 5
      }
    },
    crops: {
      tomatoes: {
        cropProfile: {
          name: 'Tomatoes',
          scientificName: 'Solanum lycopersicum',
          lifeCycle: '90-150 days from seed to harvest, depending on variety',
          growthPattern: 'Indeterminate varieties continue producing throughout the season; determinate varieties produce a single harvest',
          yieldPerSquareMeter: {
            min: 10.6,
            max: 15.8
          },
          keyRequirements: 'Full sun (6+ hours daily), consistent moisture, temperatures between 18-29°C (65-85°F)'
        },
        plantingCalendar: [
          { month: 1, suitability: 'not_recommended' },
          { month: 2, suitability: 'not_recommended' },
          { month: 3, suitability: 'suitable' },
          { month: 4, suitability: 'optimal' },
          { month: 5, suitability: 'optimal' },
          { month: 6, suitability: 'suitable' },
          { month: 7, suitability: 'risky' },
          { month: 8, suitability: 'risky' },
          { month: 9, suitability: 'suitable' },
          { month: 10, suitability: 'optimal' },
          { month: 11, suitability: 'suitable' },
          { month: 12, suitability: 'not_recommended' }
        ],
        productionMetrics: {
          totalYield: {
            min: 53.0,
            max: 79.0
          },
          timeToHarvest: '70-90 days after transplanting',
          harvestDuration: '8-12 weeks for indeterminate varieties',
          maintenanceLevel: 'Medium to High'
        },
        riskFactors: [
          {
            category: 'Temperature Extremes',
            description: 'Temperatures below 10°C (50°F) or above 35°C (95°F) can cause blossom drop and reduce fruit set.',
            severity: 'medium',
            mitigation: 'Use row covers or shade cloth depending on the temperature extreme. Consider heat-tolerant varieties in hot regions.'
          },
          {
            category: 'Disease Pressure',
            description: 'High humidity increases risk of fungal diseases like early blight and late blight.',
            severity: 'high',
            mitigation: 'Maintain good air circulation, use drip irrigation, and apply organic fungicides preventatively in humid conditions.'
          }
        ],
        recommendations: [
          {
            category: 'Variety Selection',
            text: 'Consider Mediterranean-appropriate varieties like San Marzano, Brandywine, and Marmande.'
          },
          {
            category: 'Planting Strategy',
            text: 'In your protected environment, you can extend growing seasons by 4 weeks.'
          }
        ]
      },
      bellPeppers: {
        cropProfile: {
          name: 'Bell Peppers',
          scientificName: 'Capsicum annuum',
          lifeCycle: '60-90 days from transplant to first harvest',
          growthPattern: 'Compact bushy plants that may require staking when heavy with fruit',
          yieldPerSquareMeter: {
            min: 4.0,
            max: 7.9
          },
          keyRequirements: 'Full sun, warm temperatures (21-29°C/70-85°F), moderate but consistent moisture'
        },
        plantingCalendar: [
          { month: 1, suitability: 'not_recommended' },
          { month: 2, suitability: 'suitable' },
          { month: 3, suitability: 'optimal' },
          { month: 4, suitability: 'optimal' },
          { month: 5, suitability: 'suitable' },
          { month: 6, suitability: 'risky' },
          { month: 7, suitability: 'not_recommended' },
          { month: 8, suitability: 'not_recommended' },
          { month: 9, suitability: 'risky' },
          { month: 10, suitability: 'suitable' },
          { month: 11, suitability: 'suitable' },
          { month: 12, suitability: 'risky' }
        ],
        productionMetrics: {
          totalYield: {
            min: 20.0,
            max: 39.5
          },
          timeToHarvest: '60-90 days after transplanting',
          harvestDuration: '8-10 weeks with proper care',
          maintenanceLevel: 'Medium'
        },
        riskFactors: [
          {
            category: 'Temperature Sensitivity',
            description: 'Flower drop occurs below 15°C (59°F) or above 32°C (90°F).',
            severity: 'medium',
            mitigation: 'Use row covers for cold protection and shade cloth during heat waves. Avoid planting during extreme temperature periods.'
          }
        ],
        recommendations: [
          {
            category: 'Variety Selection',
            text: 'Consider Mediterranean-appropriate varieties like Corno di Toro, Marconi, and Sweet Italian.'
          }
        ]
      }
    }
  },
  createdAt: new Date()
});

// Insert sample garden for test user
db.gardens.insertOne({
  userId: testUserId,
  name: 'Backyard Garden',
  description: 'My small backyard vegetable garden with raised beds',
  area: 8,
  location: {
    country: 'usa',
    region: 'west-coast',
    latitude: 34.052235,
    longitude: -118.243683
  },
  environment: 'protected',
  crops: [
    {
      cropId: 'tomatoes',
      plantedArea: 3,
      plantedDate: new Date('2025-03-15'),
      expectedHarvestDate: new Date('2025-06-15'),
      notes: 'Roma and San Marzano varieties'
    },
    {
      cropId: 'bellPeppers',
      plantedArea: 2,
      plantedDate: new Date('2025-03-20'),
      expectedHarvestDate: new Date('2025-06-20'),
      notes: 'Sweet red and yellow varieties'
    },
    {
      cropId: 'hotPeppers',
      plantedArea: 1,
      plantedDate: new Date('2025-03-20'),
      expectedHarvestDate: new Date('2025-07-01'),
      notes: 'Jalapeño and Habanero'
    },
    {
      cropId: 'cucumbers',
      plantedArea: 2,
      plantedDate: new Date('2025-04-01'),
      expectedHarvestDate: new Date('2025-06-01'),
      notes: 'Trellised along fence'
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
});