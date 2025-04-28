-- HomeGrow Forecast Tool Database Schema

-- Create database (if not exists - handled by MongoDB automatically)
-- USE homegrow;

-- Users collection schema
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'name', 'createdAt'],
      properties: {
        email: {
          bsonType: 'string',
          description: 'must be a valid email address and is required'
        },
        password: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        name: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        createdAt: {
          bsonType: 'date',
          description: 'must be a date and is required'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'must be a date'
        },
        preferences: {
          bsonType: 'object',
          properties: {
            defaultCountry: {
              bsonType: 'string',
              description: 'user default country'
            },
            defaultRegion: {
              bsonType: 'string',
              description: 'user default region'
            },
            defaultClimate: {
              bsonType: 'string',
              description: 'user default climate zone'
            },
            defaultEnvironment: {
              bsonType: 'string',
              description: 'user default growing environment'
            },
            defaultArea: {
              bsonType: 'double',
              description: 'user default growing area in square meters'
            },
            preferredCrops: {
              bsonType: 'array',
              items: {
                bsonType: 'string'
              },
              description: 'array of user preferred crops'
            }
          }
        }
      }
    }
  }
});

// Create unique index on email field
db.users.createIndex({ email: 1 }, { unique: true });

-- Forecasts collection schema
db.createCollection('forecasts', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'params', 'results', 'createdAt'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'must be an objectId reference to user and is required'
        },
        name: {
          bsonType: 'string',
          description: 'custom name for the forecast'
        },
        params: {
          bsonType: 'object',
          required: ['climate', 'environment', 'area', 'crops'],
          properties: {
            country: {
              bsonType: 'string',
              description: 'country code'
            },
            region: {
              bsonType: 'string',
              description: 'region id'
            },
            climate: {
              bsonType: 'string',
              description: 'climate zone id'
            },
            environment: {
              bsonType: 'string',
              description: 'growing environment'
            },
            area: {
              bsonType: 'double',
              description: 'growing area in square meters'
            },
            crops: {
              bsonType: 'array',
              items: {
                bsonType: 'string'
              },
              description: 'array of crop ids included in forecast'
            },
            experience: {
              bsonType: 'string',
              description: 'gardener experience level'
            }
          }
        },
        results: {
          bsonType: 'object',
          description: 'forecast results data'
        },
        createdAt: {
          bsonType: 'date',
          description: 'timestamp when forecast was created'
        }
      }
    }
  }
});

// Create index on userId for faster queries
db.forecasts.createIndex({ userId: 1 });
// Create index on createdAt for sorting by date
db.forecasts.createIndex({ createdAt: -1 });

-- UserGardens collection schema
db.createCollection('gardens', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'name', 'area', 'createdAt'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'must be an objectId reference to user and is required'
        },
        name: {
          bsonType: 'string',
          description: 'garden name'
        },
        description: {
          bsonType: 'string',
          description: 'garden description'
        },
        area: {
          bsonType: 'double',
          description: 'garden area in square meters'
        },
        location: {
          bsonType: 'object',
          properties: {
            country: {
              bsonType: 'string',
              description: 'country code'
            },
            region: {
              bsonType: 'string',
              description: 'region id'
            },
            latitude: {
              bsonType: 'double',
              description: 'latitude coordinate'
            },
            longitude: {
              bsonType: 'double',
              description: 'longitude coordinate'
            }
          }
        },
        environment: {
          bsonType: 'string',
          description: 'growing environment'
        },
        crops: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['cropId', 'plantedArea'],
            properties: {
              cropId: {
                bsonType: 'string',
                description: 'crop id'
              },
              plantedArea: {
                bsonType: 'double',
                description: 'area allocated to this crop'
              },
              plantedDate: {
                bsonType: 'date',
                description: 'date when planted'
              },
              expectedHarvestDate: {
                bsonType: 'date',
                description: 'expected harvest date'
              },
              notes: {
                bsonType: 'string',
                description: 'custom notes for this crop'
              }
            }
          }
        },
        createdAt: {
          bsonType: 'date',
          description: 'timestamp when garden was created'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'timestamp when garden was last updated'
        }
      }
    }
  }
});

// Create index on userId for faster queries
db.gardens.createIndex({ userId: 1 });
