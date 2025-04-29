/**
 * Setup Script for HomeGrow Forecast Tool
 * 
 * This script helps set up the application by:
 * 1. Checking environment configuration
 * 2. Verifying MongoDB connection
 * 3. Creating necessary database collections
 * 4. Setting up demo accounts
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { execSync } = require('child_process');

// Check if .env file exists
console.log('Checking environment configuration...');
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.log('No .env file found. Creating from template...');
  
  // Create .env file from .env.example or create a new one
  if (fs.existsSync(path.join(__dirname, '.env.example'))) {
    fs.copyFileSync(path.join(__dirname, '.env.example'), envPath);
    console.log('Created .env file from .env.example');
  } else {
    const defaultEnv = `# Server Configuration
NODE_ENV=development
PORT=5001

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/homegrow

# Authentication
JWT_SECRET=${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}
JWT_EXPIRES_IN=7d

# CORS Settings
CORS_ORIGIN=http://localhost:3000

# Optional Features
ENABLE_USER_ACCOUNTS=true
ENABLE_FORECAST_HISTORY=true
ENABLE_WEATHER_INTEGRATION=true`;

    fs.writeFileSync(envPath, defaultEnv);
    console.log('Created default .env file');
  }
}

// Load environment variables
require('dotenv').config();

// Check MongoDB connection
console.log('Checking MongoDB connection...');

async function checkMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('MongoDB connected successfully!');
    
    // Create collections if they don't exist
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (!collectionNames.includes('users')) {
      console.log('Creating users collection...');
      await mongoose.connection.db.createCollection('users');
      
      // Create indexes
      await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
      console.log('Created users collection with indexes');
    }
    
    if (!collectionNames.includes('forecasts')) {
      console.log('Creating forecasts collection...');
      await mongoose.connection.db.createCollection('forecasts');
      
      // Create indexes
      await mongoose.connection.db.collection('forecasts').createIndex({ userId: 1 });
      await mongoose.connection.db.collection('forecasts').createIndex({ createdAt: -1 });
      console.log('Created forecasts collection with indexes');
    }
    
    // Check if demo users exist
    const adminUser = await mongoose.connection.db.collection('users').findOne({ email: 'admin@homegrow.example' });
    const regularUser = await mongoose.connection.db.collection('users').findOne({ email: 'user@homegrow.example' });
    
    if (!adminUser) {
      console.log('Creating admin demo account...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await mongoose.connection.db.collection('users').insertOne({
        email: 'admin@homegrow.example',
        password: hashedPassword,
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
      
      console.log('Admin demo account created');
    }
    
    if (!regularUser) {
      console.log('Creating regular user demo account...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const user = await mongoose.connection.db.collection('users').insertOne({
        email: 'user@homegrow.example',
        password: hashedPassword,
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
      
      console.log('Regular user demo account created');
      
      // Add a sample forecast for the user
      if (user.insertedId) {
        console.log('Adding sample forecast for demo user...');
        
        await mongoose.connection.db.collection('forecasts').insertOne({
          userId: user.insertedId,
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
                plantingCalendar: {
                  optimalPlantingMonths: [3, 4, 5],
                  harvestMonths: [7, 8, 9],
                  extendedSeason: true
                },
                productionMetrics: {
                  estimatedYield: {
                    min: 53,
                    max: 79,
                    unit: "kg"
                  },
                  timeToHarvest: {
                    min: 65,
                    max: 85,
                    unit: "days"
                  },
                  harvestDuration: {
                    min: 8,
                    max: 12,
                    unit: "weeks"
                  }
                },
                riskFactors: [
                  {
                    category: "Disease",
                    description: "Mediterranean climates can promote fungal diseases like powdery mildew in protected environments.",
                    severity: "medium",
                    mitigation: "Ensure good air circulation and avoid overhead watering. Consider resistant varieties."
                  }
                ],
                recommendations: [
                  {
                    category: "Variety Selection",
                    text: "For protected growing in Mediterranean climates, consider heat-tolerant varieties like 'Heatwave II', 'Solar Fire', or 'Phoenix'."
                  }
                ]
              }
            }
          },
          createdAt: new Date()
        });
        
        console.log('Sample forecast added');
      }
    }
    
    console.log('Database setup complete!');
    
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Please make sure MongoDB is running and the connection string is correct in .env');
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

// Check if MongoDB is running
console.log('Checking if MongoDB is running...');
try {
  if (process.platform === 'win32') {
    const output = execSync('sc query MongoDB').toString();
    if (output.includes('RUNNING')) {
      console.log('MongoDB service is running');
    } else {
      console.log('MongoDB service is not running. Attempting to start...');
      execSync('net start MongoDB');
      console.log('MongoDB service started');
    }
  } else {
    const output = execSync('systemctl is-active mongodb || systemctl is-active mongod').toString().trim();
    if (output === 'active') {
      console.log('MongoDB service is running');
    } else {
      console.log('MongoDB service is not running. Attempting to start...');
      execSync('sudo systemctl start mongodb || sudo systemctl start mongod');
      console.log('MongoDB service started');
    }
  }
} catch (error) {
  console.log('Could not check or start MongoDB service. Please start it manually.');
  console.log('Error:', error.message);
}

// Run MongoDB setup
checkMongoDB().then(() => {
  console.log('Setup completed successfully!');
  console.log('\nDemo accounts:');
  console.log('- Admin: admin@homegrow.example / admin123');
  console.log('- User: user@homegrow.example / password123');
  console.log('\nYou can now start the server with:');
  console.log('npm run server:start');
}).catch(err => {
  console.error('Setup failed:', err);
});
