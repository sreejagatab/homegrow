// Fallback crop data in case the API fails
export const fallbackCrops = [
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
    "keyRequirements": "Full sun, consistent moisture, and well-drained soil. Requires staking or caging for support."
  },
  {
    "id": "cucumbers",
    "name": "Cucumbers",
    "scientificName": "Cucumis sativus",
    "image": "/images/crops/cucumber.jpg",
    "lifeCycle": "Annual",
    "growthPattern": "Vining",
    "baseYield": {
      "min": 5.0,
      "max": 10.0
    },
    "timeToHarvest": {
      "min": 50,
      "max": 70
    },
    "harvestDuration": {
      "min": 4,
      "max": 6
    },
    "maintenanceLevel": "Low to Moderate",
    "keyRequirements": "Full sun, consistent moisture, and well-drained soil. Benefits from trellising."
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
    "keyRequirements": "Full sun, warm temperatures, and well-drained soil. May need staking as plants get heavy with fruit."
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
      "max": 6
    },
    "maintenanceLevel": "Moderate",
    "keyRequirements": "Full sun, warm temperatures, and well-drained soil. Benefits from staking as plants get heavy with fruit."
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
      "min": 60,
      "max": 90
    },
    "harvestDuration": {
      "min": 4,
      "max": 8
    },
    "maintenanceLevel": "Low to Moderate",
    "keyRequirements": "Full sun, warm temperatures, and well-drained soil. Generally more heat and drought tolerant than bell peppers."
  }
];
