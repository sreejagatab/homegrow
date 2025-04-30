/**
 * Fix API Routes Script
 *
 * This script checks and fixes the API routes for crops and climate-zones.
 */

const fs = require('fs');
const path = require('path');

// Enable more verbose logging
console.log('Starting fix-api-routes.js script...');
console.log('Current directory:', process.cwd());

// Check if data files exist
console.log('Checking data files...');

const dataDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(dataDir)) {
  console.log('Creating data directory...');
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create crops.json if it doesn't exist
const cropsPath = path.join(dataDir, 'crops.json');
if (!fs.existsSync(cropsPath)) {
  console.log('Creating crops.json...');
  const defaultCrops = [
    {
      "id": "tomatoes",
      "name": "Tomatoes",
      "scientificName": "Solanum lycopersicum",
      "image": "/images/crops/tomato.jpg",
      "lifeCycle": "Annual",
      "growthPattern": "Determinate or Indeterminate",
      "baseYield": {
        "min": 3.5,
        "max": 7.0
      },
      "timeToHarvest": {
        "min": 60,
        "max": 85
      },
      "harvestDuration": {
        "min": 4,
        "max": 8
      },
      "maintenanceLevel": "Moderate",
      "keyRequirements": "Full sun, consistent moisture, and well-drained soil. Requires staking or caging for support.",
      "spacing": {
        "min": 45,
        "max": 90
      },
      "seedStartWeeks": 6,
      "protectedExtensionWeeks": 4,
      "plantingMonths": {
        "tropical": {
          "optimal": [9, 10, 11],
          "suitable": [8, 12],
          "risky": [7, 1]
        },
        "subtropical": {
          "optimal": [3, 4, 5],
          "suitable": [2, 6],
          "risky": [1, 7]
        },
        "mediterranean": {
          "optimal": [4, 5],
          "suitable": [3, 6],
          "risky": [2, 7]
        },
        "continental": {
          "optimal": [5],
          "suitable": [4, 6],
          "risky": [3, 7]
        },
        "temperate": {
          "optimal": [4, 5],
          "suitable": [3, 6],
          "risky": [2, 7]
        },
        "oceanic": {
          "optimal": [4, 5],
          "suitable": [3, 6],
          "risky": [2, 7]
        },
        "arid": {
          "optimal": [2, 3, 9, 10],
          "suitable": [1, 4, 8, 11],
          "risky": [5, 7, 12]
        },
        "semiarid": {
          "optimal": [3, 4, 9, 10],
          "suitable": [2, 5, 8, 11],
          "risky": [1, 6, 7, 12]
        }
      },
      "risks": {
        "pests": {
          "level": "High",
          "common": ["Aphids", "Hornworms", "Whiteflies"]
        },
        "diseases": {
          "level": "High",
          "common": ["Early Blight", "Late Blight", "Fusarium Wilt"]
        },
        "environmental": {
          "level": "Medium",
          "factors": ["Temperature fluctuations", "Inconsistent watering"]
        }
      }
    },
    {
      "id": "cucumbers",
      "name": "Cucumbers",
      "scientificName": "Cucumis sativus",
      "image": "/images/crops/cucumber.jpg",
      "lifeCycle": "Annual",
      "growthPattern": "Vine",
      "baseYield": {
        "min": 5.0,
        "max": 10.0
      },
      "timeToHarvest": {
        "min": 50,
        "max": 70
      },
      "harvestDuration": {
        "min": 3,
        "max": 6
      },
      "maintenanceLevel": "Low to Moderate",
      "keyRequirements": "Full sun, consistent moisture, and well-drained soil. Benefits from trellising.",
      "spacing": {
        "min": 30,
        "max": 60
      },
      "seedStartWeeks": 3,
      "protectedExtensionWeeks": 4,
      "plantingMonths": {
        "tropical": {
          "optimal": [9, 10, 11],
          "suitable": [8, 12],
          "risky": [7, 1]
        },
        "subtropical": {
          "optimal": [3, 4, 5],
          "suitable": [2, 6],
          "risky": [1, 7]
        },
        "mediterranean": {
          "optimal": [4, 5],
          "suitable": [3, 6],
          "risky": [2, 7]
        },
        "continental": {
          "optimal": [5, 6],
          "suitable": [4, 7],
          "risky": [3, 8]
        },
        "temperate": {
          "optimal": [5, 6],
          "suitable": [4, 7],
          "risky": [3, 8]
        },
        "oceanic": {
          "optimal": [5, 6],
          "suitable": [4, 7],
          "risky": [3, 8]
        },
        "arid": {
          "optimal": [2, 3, 9, 10],
          "suitable": [1, 4, 8, 11],
          "risky": [5, 7, 12]
        },
        "semiarid": {
          "optimal": [3, 4, 9, 10],
          "suitable": [2, 5, 8, 11],
          "risky": [1, 6, 7, 12]
        }
      },
      "risks": {
        "pests": {
          "level": "Medium",
          "common": ["Cucumber Beetles", "Aphids", "Spider Mites"]
        },
        "diseases": {
          "level": "Medium",
          "common": ["Powdery Mildew", "Downy Mildew", "Bacterial Wilt"]
        },
        "environmental": {
          "level": "Low",
          "factors": ["Cold temperatures", "Drought"]
        }
      }
    },
    {
      "id": "bellPeppers",
      "name": "Bell Peppers",
      "scientificName": "Capsicum annuum",
      "image": "/images/crops/bell-pepper.jpg",
      "lifeCycle": "Annual (Perennial in tropics)",
      "growthPattern": "Bushy",
      "baseYield": {
        "min": 2.5,
        "max": 5.0
      },
      "timeToHarvest": {
        "min": 60,
        "max": 90
      },
      "harvestDuration": {
        "min": 4,
        "max": 8
      },
      "maintenanceLevel": "Moderate",
      "keyRequirements": "Full sun, warm temperatures, and well-drained soil. May need support when fruiting heavily.",
      "spacing": {
        "min": 45,
        "max": 60
      },
      "seedStartWeeks": 8,
      "protectedExtensionWeeks": 6,
      "plantingMonths": {
        "tropical": {
          "optimal": [9, 10, 11],
          "suitable": [8, 12],
          "risky": [7, 1]
        },
        "subtropical": {
          "optimal": [3, 4, 5],
          "suitable": [2, 6],
          "risky": [1, 7]
        },
        "mediterranean": {
          "optimal": [4, 5],
          "suitable": [3, 6],
          "risky": [2, 7]
        },
        "continental": {
          "optimal": [5],
          "suitable": [4, 6],
          "risky": [3, 7]
        },
        "temperate": {
          "optimal": [5],
          "suitable": [4, 6],
          "risky": [3, 7]
        },
        "oceanic": {
          "optimal": [5],
          "suitable": [4, 6],
          "risky": [3, 7]
        },
        "arid": {
          "optimal": [2, 3, 9, 10],
          "suitable": [1, 4, 8, 11],
          "risky": [5, 7, 12]
        },
        "semiarid": {
          "optimal": [3, 4, 9, 10],
          "suitable": [2, 5, 8, 11],
          "risky": [1, 6, 7, 12]
        }
      },
      "risks": {
        "pests": {
          "level": "Medium",
          "common": ["Aphids", "Pepper Maggots", "Spider Mites"]
        },
        "diseases": {
          "level": "Medium",
          "common": ["Bacterial Spot", "Phytophthora Blight", "Anthracnose"]
        },
        "environmental": {
          "level": "Medium",
          "factors": ["Cold temperatures", "Blossom end rot"]
        }
      }
    },
    {
      "id": "eggplant",
      "name": "Eggplant",
      "scientificName": "Solanum melongena",
      "image": "/images/crops/eggplant.jpg",
      "lifeCycle": "Annual (Perennial in tropics)",
      "growthPattern": "Bushy",
      "baseYield": {
        "min": 2.0,
        "max": 4.0
      },
      "timeToHarvest": {
        "min": 65,
        "max": 85
      },
      "harvestDuration": {
        "min": 4,
        "max": 8
      },
      "maintenanceLevel": "Moderate",
      "keyRequirements": "Full sun, warm temperatures, and well-drained soil. May need support when fruiting heavily.",
      "spacing": {
        "min": 45,
        "max": 60
      },
      "seedStartWeeks": 8,
      "protectedExtensionWeeks": 6,
      "plantingMonths": {
        "tropical": {
          "optimal": [9, 10, 11],
          "suitable": [8, 12],
          "risky": [7, 1]
        },
        "subtropical": {
          "optimal": [3, 4, 5],
          "suitable": [2, 6],
          "risky": [1, 7]
        },
        "mediterranean": {
          "optimal": [4, 5],
          "suitable": [3, 6],
          "risky": [2, 7]
        },
        "continental": {
          "optimal": [5],
          "suitable": [4, 6],
          "risky": [3, 7]
        },
        "temperate": {
          "optimal": [5],
          "suitable": [4, 6],
          "risky": [3, 7]
        },
        "oceanic": {
          "optimal": [5],
          "suitable": [4, 6],
          "risky": [3, 7]
        },
        "arid": {
          "optimal": [2, 3, 9, 10],
          "suitable": [1, 4, 8, 11],
          "risky": [5, 7, 12]
        },
        "semiarid": {
          "optimal": [3, 4, 9, 10],
          "suitable": [2, 5, 8, 11],
          "risky": [1, 6, 7, 12]
        }
      },
      "risks": {
        "pests": {
          "level": "Medium",
          "common": ["Flea Beetles", "Colorado Potato Beetles", "Spider Mites"]
        },
        "diseases": {
          "level": "Medium",
          "common": ["Verticillium Wilt", "Phomopsis Blight", "Anthracnose"]
        },
        "environmental": {
          "level": "High",
          "factors": ["Cold temperatures", "Drought", "Excessive heat"]
        }
      }
    },
    {
      "id": "hotPeppers",
      "name": "Hot Peppers",
      "scientificName": "Capsicum spp.",
      "image": "/images/crops/hot-pepper.jpg",
      "lifeCycle": "Annual (Perennial in tropics)",
      "growthPattern": "Bushy",
      "baseYield": {
        "min": 1.5,
        "max": 3.0
      },
      "timeToHarvest": {
        "min": 70,
        "max": 90
      },
      "harvestDuration": {
        "min": 4,
        "max": 8
      },
      "maintenanceLevel": "Low to Moderate",
      "keyRequirements": "Full sun, warm temperatures, and well-drained soil. Drought tolerant once established.",
      "spacing": {
        "min": 30,
        "max": 45
      },
      "seedStartWeeks": 8,
      "protectedExtensionWeeks": 6,
      "plantingMonths": {
        "tropical": {
          "optimal": [5, 6, 7, 8],
          "suitable": [4, 9],
          "risky": [3, 10]
        },
        "subtropical": {
          "optimal": [3, 4, 9, 10],
          "suitable": [2, 5, 8, 11],
          "risky": [1, 6, 7, 12]
        },
        "mediterranean": {
          "optimal": [3, 4, 9, 10],
          "suitable": [2, 5, 8, 11],
          "risky": [1, 6, 7, 12]
        },
        "continental": {
          "optimal": [4, 5, 8, 9],
          "suitable": [3, 6, 7, 10],
          "risky": [2, 11]
        },
        "temperate": {
          "optimal": [4, 5, 8, 9],
          "suitable": [3, 6, 7, 10],
          "risky": [2, 11]
        },
        "oceanic": {
          "optimal": [4, 5, 8, 9],
          "suitable": [3, 6, 7, 10],
          "risky": [2, 11]
        },
        "arid": {
          "optimal": [2, 3, 10, 11],
          "suitable": [1, 4, 9, 12],
          "risky": [5, 8]
        },
        "semiarid": {
          "optimal": [3, 4, 9, 10],
          "suitable": [2, 5, 8, 11],
          "risky": [1, 6, 7, 12]
        }
      },
      "risks": {
        "pests": {
          "level": "Low",
          "common": ["Aphids", "Spider Mites", "Thrips"]
        },
        "diseases": {
          "level": "Low",
          "common": ["Bacterial Spot", "Powdery Mildew", "Anthracnose"]
        },
        "environmental": {
          "level": "Low",
          "factors": ["Cold temperatures", "Excessive moisture"]
        }
      }
    }
  ];

  fs.writeFileSync(cropsPath, JSON.stringify(defaultCrops, null, 2));
  console.log('Created crops.json with default data');
}

// Create climates.json if it doesn't exist
const climatesPath = path.join(dataDir, 'climates.json');
if (!fs.existsSync(climatesPath)) {
  console.log('Creating climates.json...');
  const defaultClimates = [
    {
      "id": "tropical",
      "name": "Tropical",
      "description": "Hot and humid year-round with minimal temperature variation. Typically found near the equator.",
      "characteristics": {
        "minTemp": 18,
        "maxTemp": 35,
        "annualRainfall": "High (>1500mm)",
        "growingSeason": "Year-round",
        "humidity": "High"
      },
      "suitability": {
        "tomatoes": "Good",
        "cucumbers": "Excellent",
        "bellPeppers": "Good",
        "eggplant": "Excellent",
        "hotPeppers": "Excellent"
      },
      "challenges": [
        "High disease pressure due to humidity",
        "Heavy rainfall can damage crops",
        "Pest management is challenging",
        "Some crops may struggle with excessive heat"
      ]
    },
    {
      "id": "subtropical",
      "name": "Subtropical",
      "description": "Hot summers and mild winters with moderate rainfall. Found between tropical and temperate regions.",
      "characteristics": {
        "minTemp": 10,
        "maxTemp": 35,
        "annualRainfall": "Moderate to High (800-1500mm)",
        "growingSeason": "Long (9-12 months)",
        "humidity": "Moderate to High"
      },
      "suitability": {
        "tomatoes": "Excellent",
        "cucumbers": "Excellent",
        "bellPeppers": "Excellent",
        "eggplant": "Excellent",
        "hotPeppers": "Excellent"
      },
      "challenges": [
        "Summer heat can stress some crops",
        "Humidity can increase disease pressure",
        "Occasional frost in winter",
        "Variable rainfall patterns"
      ]
    },
    {
      "id": "mediterranean",
      "name": "Mediterranean",
      "description": "Hot, dry summers and mild, wet winters. Found around the Mediterranean Sea and similar regions.",
      "characteristics": {
        "minTemp": 5,
        "maxTemp": 35,
        "annualRainfall": "Moderate (400-800mm)",
        "growingSeason": "Long (8-10 months)",
        "humidity": "Low to Moderate"
      },
      "suitability": {
        "tomatoes": "Excellent",
        "cucumbers": "Good",
        "bellPeppers": "Excellent",
        "eggplant": "Excellent",
        "hotPeppers": "Excellent"
      },
      "challenges": [
        "Summer drought requires irrigation",
        "Winter rains can cause disease",
        "Occasional frost in winter",
        "Hot, dry winds can damage crops"
      ]
    },
    {
      "id": "continental",
      "name": "Continental",
      "description": "Hot summers and cold winters with moderate rainfall. Found in interior regions away from coasts.",
      "characteristics": {
        "minTemp": -15,
        "maxTemp": 35,
        "annualRainfall": "Moderate (500-800mm)",
        "growingSeason": "Medium (5-7 months)",
        "humidity": "Low to Moderate"
      },
      "suitability": {
        "tomatoes": "Good",
        "cucumbers": "Good",
        "bellPeppers": "Good",
        "eggplant": "Fair",
        "hotPeppers": "Good"
      },
      "challenges": [
        "Short growing season",
        "Late spring and early fall frosts",
        "Summer heat waves",
        "Winter protection needed for perennials"
      ]
    },
    {
      "id": "temperate",
      "name": "Temperate",
      "description": "Moderate temperatures with distinct seasons. Found in mid-latitude regions.",
      "characteristics": {
        "minTemp": -5,
        "maxTemp": 30,
        "annualRainfall": "Moderate (600-1200mm)",
        "growingSeason": "Medium (6-8 months)",
        "humidity": "Moderate"
      },
      "suitability": {
        "tomatoes": "Good",
        "cucumbers": "Good",
        "bellPeppers": "Good",
        "eggplant": "Fair",
        "hotPeppers": "Fair"
      },
      "challenges": [
        "Variable weather conditions",
        "Limited growing season",
        "Spring and fall frosts",
        "Cool summers in some regions"
      ]
    },
    {
      "id": "oceanic",
      "name": "Oceanic",
      "description": "Mild temperatures with high rainfall and cloud cover. Found in coastal regions.",
      "characteristics": {
        "minTemp": 0,
        "maxTemp": 25,
        "annualRainfall": "High (800-2000mm)",
        "growingSeason": "Medium (6-8 months)",
        "humidity": "High"
      },
      "suitability": {
        "tomatoes": "Fair",
        "cucumbers": "Good",
        "bellPeppers": "Fair",
        "eggplant": "Poor",
        "hotPeppers": "Fair"
      },
      "challenges": [
        "Limited sunlight due to cloud cover",
        "High rainfall increases disease risk",
        "Cool summers limit heat-loving crops",
        "Wind exposure in coastal areas"
      ]
    },
    {
      "id": "arid",
      "name": "Arid",
      "description": "Hot days, cool nights, and very low rainfall. Found in desert regions.",
      "characteristics": {
        "minTemp": 0,
        "maxTemp": 45,
        "annualRainfall": "Very Low (<250mm)",
        "growingSeason": "Dependent on irrigation",
        "humidity": "Very Low"
      },
      "suitability": {
        "tomatoes": "Good with irrigation",
        "cucumbers": "Fair with irrigation",
        "bellPeppers": "Good with irrigation",
        "eggplant": "Good with irrigation",
        "hotPeppers": "Excellent with irrigation"
      },
      "challenges": [
        "Extreme heat during day",
        "Water scarcity requires efficient irrigation",
        "Poor soil quality",
        "High evaporation rates",
        "Potential for frost in winter"
      ]
    },
    {
      "id": "semiarid",
      "name": "Semi-arid",
      "description": "Hot summers, cool winters, and low rainfall. Found in steppe regions.",
      "characteristics": {
        "minTemp": -5,
        "maxTemp": 40,
        "annualRainfall": "Low (250-500mm)",
        "growingSeason": "Medium with irrigation",
        "humidity": "Low"
      },
      "suitability": {
        "tomatoes": "Good with irrigation",
        "cucumbers": "Good with irrigation",
        "bellPeppers": "Good with irrigation",
        "eggplant": "Good with irrigation",
        "hotPeppers": "Excellent with irrigation"
      },
      "challenges": [
        "Limited water availability",
        "High temperature fluctuations",
        "Dry winds can damage crops",
        "Soil erosion risks",
        "Occasional drought periods"
      ]
    }
  ];

  fs.writeFileSync(climatesPath, JSON.stringify(defaultClimates, null, 2));
  console.log('Created climates.json with default data');
}

// Create regions.json if it doesn't exist
const regionsPath = path.join(dataDir, 'regions.json');
if (!fs.existsSync(regionsPath)) {
  console.log('Creating regions.json...');
  const defaultRegions = {
    "usa": [
      {
        "id": "northeast",
        "name": "Northeast",
        "climate": "temperate",
        "subregions": [
          { "id": "new-england", "name": "New England" },
          { "id": "mid-atlantic", "name": "Mid-Atlantic" }
        ]
      },
      {
        "id": "midwest",
        "name": "Midwest",
        "climate": "continental",
        "subregions": [
          { "id": "east-north-central", "name": "East North Central" },
          { "id": "west-north-central", "name": "West North Central" }
        ]
      },
      {
        "id": "south",
        "name": "South",
        "climate": "subtropical",
        "subregions": [
          { "id": "south-atlantic", "name": "South Atlantic" },
          { "id": "east-south-central", "name": "East South Central" },
          { "id": "west-south-central", "name": "West South Central" }
        ]
      },
      {
        "id": "west",
        "name": "West",
        "climate": "varied",
        "subregions": [
          { "id": "mountain", "name": "Mountain" },
          { "id": "pacific", "name": "Pacific" }
        ]
      }
    ],
    "canada": [
      {
        "id": "atlantic",
        "name": "Atlantic Provinces",
        "climate": "oceanic",
        "subregions": [
          { "id": "newfoundland", "name": "Newfoundland and Labrador" },
          { "id": "maritimes", "name": "Maritimes" }
        ]
      },
      {
        "id": "central",
        "name": "Central Canada",
        "climate": "continental",
        "subregions": [
          { "id": "quebec", "name": "Quebec" },
          { "id": "ontario", "name": "Ontario" }
        ]
      },
      {
        "id": "prairie",
        "name": "Prairie Provinces",
        "climate": "continental",
        "subregions": [
          { "id": "manitoba", "name": "Manitoba" },
          { "id": "saskatchewan", "name": "Saskatchewan" },
          { "id": "alberta", "name": "Alberta" }
        ]
      },
      {
        "id": "west-coast",
        "name": "West Coast",
        "climate": "oceanic",
        "subregions": [
          { "id": "british-columbia", "name": "British Columbia" }
        ]
      },
      {
        "id": "northern",
        "name": "Northern Territories",
        "climate": "subarctic",
        "subregions": [
          { "id": "yukon", "name": "Yukon" },
          { "id": "northwest", "name": "Northwest Territories" },
          { "id": "nunavut", "name": "Nunavut" }
        ]
      }
    ]
  };

  fs.writeFileSync(regionsPath, JSON.stringify(defaultRegions, null, 2));
  console.log('Created regions.json with default data');
}

// Create yieldFactors.json if it doesn't exist
const yieldFactorsPath = path.join(dataDir, 'yieldFactors.json');
if (!fs.existsSync(yieldFactorsPath)) {
  console.log('Creating yieldFactors.json...');
  const defaultYieldFactors = {
    "climate": {
      "tropical": {
        "tomatoes": 0.9,
        "cucumbers": 1.1,
        "bellPeppers": 0.95,
        "eggplant": 1.1,
        "hotPeppers": 1.2
      },
      "subtropical": {
        "tomatoes": 1.1,
        "cucumbers": 1.1,
        "bellPeppers": 1.1,
        "eggplant": 1.1,
        "hotPeppers": 1.1
      },
      "mediterranean": {
        "tomatoes": 1.2,
        "cucumbers": 1.0,
        "bellPeppers": 1.1,
        "eggplant": 1.1,
        "hotPeppers": 1.1
      },
      "continental": {
        "tomatoes": 0.9,
        "cucumbers": 0.9,
        "bellPeppers": 0.9,
        "eggplant": 0.8,
        "hotPeppers": 0.9
      },
      "temperate": {
        "tomatoes": 0.95,
        "cucumbers": 0.95,
        "bellPeppers": 0.9,
        "eggplant": 0.85,
        "hotPeppers": 0.85
      },
      "oceanic": {
        "tomatoes": 0.8,
        "cucumbers": 0.9,
        "bellPeppers": 0.8,
        "eggplant": 0.7,
        "hotPeppers": 0.8
      },
      "arid": {
        "tomatoes": 0.9,
        "cucumbers": 0.8,
        "bellPeppers": 0.9,
        "eggplant": 0.9,
        "hotPeppers": 1.1
      },
      "semiarid": {
        "tomatoes": 0.95,
        "cucumbers": 0.9,
        "bellPeppers": 0.95,
        "eggplant": 0.95,
        "hotPeppers": 1.05
      }
    },
    "environment": {
      "open": {
        "factor": 1.0,
        "variability": 0.3
      },
      "protected": {
        "factor": 1.3,
        "variability": 0.15
      },
      "greenhouse": {
        "factor": 1.6,
        "variability": 0.1
      },
      "hydroponic": {
        "factor": 2.0,
        "variability": 0.05
      }
    },
    "experience": {
      "beginner": 0.8,
      "intermediate": 1.0,
      "advanced": 1.2
    }
  };

  fs.writeFileSync(yieldFactorsPath, JSON.stringify(defaultYieldFactors, null, 2));
  console.log('Created yieldFactors.json with default data');
}

console.log('Data files check completed!');
console.log('API routes should now work correctly.');
console.log('\nTo test the routes, try accessing:');
console.log('- http://localhost:5001/api/forecast/crops');
console.log('- http://localhost:5001/api/forecast/climate-zones');
