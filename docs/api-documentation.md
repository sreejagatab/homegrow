# HomeGrow Forecast Tool - API Documentation

This document provides detailed information about the HomeGrow Forecast Tool API endpoints, request/response formats, and authentication requirements.

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:5001/api
```

For production environments, replace with your domain.

## Authentication

Most endpoints require authentication using JSON Web Tokens (JWT).

### Authentication Headers

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Obtaining a Token

To obtain a token, use the login endpoint:

```
POST /auth/login
```

## API Endpoints

### Authentication Endpoints

#### Register a New User

```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### Login User

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### Get Current User

```
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Forecast Endpoints

#### Generate a Crop Forecast

```
POST /forecast
```

**Authentication:** Optional (authenticated users can save forecasts)

**Request Body:**
```json
{
  "climate": "mediterranean",
  "environment": "protected",
  "area": 15,
  "crops": ["tomatoes", "cucumbers", "bellPeppers"],
  "experience": "intermediate"
}
```

**Parameters:**
- `climate` (required): Climate zone identifier (string)
  - Options: "tropical", "subtropical", "mediterranean", "continental", "temperate", "oceanic", "arid", "semi-arid"
- `environment` (required): Growing environment (string)
  - Options: "open", "protected", "controlled", "non-cooled"
- `area` (required): Growing area in square meters (number)
- `crops` (required): Array of crop identifiers (string[])
  - Options: "tomatoes", "cucumbers", "bellPeppers", "eggplant", "hotPeppers"
- `experience` (optional): Gardener experience level (string)
  - Options: "beginner", "intermediate", "advanced"
  - Default: "intermediate"

**Response:**
```json
{
  "success": true,
  "data": {
    "tomatoes": {
      "cropProfile": {
        "name": "Tomatoes",
        "scientificName": "Solanum lycopersicum",
        "lifeCycle": "Annual",
        "growthPattern": "Indeterminate or determinate",
        "yieldPerSquareMeter": {
          "min": 5,
          "max": 15
        },
        "keyRequirements": [
          "Full sun",
          "Well-drained soil",
          "Regular watering",
          "Support for indeterminate varieties"
        ]
      },
      "plantingCalendar": {
        "optimal": ["March", "April", "May"],
        "suitable": ["February", "June"],
        "risky": ["January", "July"],
        "notRecommended": ["August", "September", "October", "November", "December"]
      },
      "productionMetrics": {
        "totalYield": {
          "min": 75,
          "max": 225
        },
        "timeToHarvest": {
          "min": 60,
          "max": 85
        },
        "harvestDuration": {
          "min": 30,
          "max": 90
        },
        "maintenanceLevel": "Medium"
      },
      "riskFactors": [
        {
          "name": "Late Blight",
          "severity": "High",
          "description": "Fungal disease common in humid conditions",
          "mitigation": "Ensure good air circulation, avoid overhead watering"
        },
        {
          "name": "Blossom End Rot",
          "severity": "Medium",
          "description": "Calcium deficiency often caused by irregular watering",
          "mitigation": "Maintain consistent soil moisture, add calcium if needed"
        }
      ],
      "recommendations": [
        "Choose disease-resistant varieties for Mediterranean climate",
        "Install drip irrigation to maintain consistent soil moisture",
        "Provide afternoon shade during hottest summer months",
        "Mulch soil to retain moisture and prevent weeds"
      ]
    },
    "cucumbers": {
      // Similar structure to tomatoes
    },
    "meta": {
      "params": {
        "climate": "mediterranean",
        "environment": "protected",
        "area": 15,
        "crops": ["tomatoes", "cucumbers", "bellPeppers"]
      },
      "generatedAt": "2023-07-15T14:30:45.123Z"
    }
  }
}
```

#### Get Available Crops

```
GET /forecast/crops
```

**Authentication:** None

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "tomatoes",
      "name": "Tomatoes",
      "image": "/images/crops/tomato.jpg",
      "description": "Popular garden vegetable with many varieties"
    },
    {
      "id": "cucumbers",
      "name": "Cucumbers",
      "image": "/images/crops/cucumber.jpg",
      "description": "Refreshing summer vegetable, great for salads"
    },
    // Additional crops...
  ]
}
```

#### Get Climate Zones

```
GET /forecast/climate-zones
```

**Authentication:** None

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "mediterranean",
      "name": "Mediterranean",
      "description": "Hot, dry summers and mild, wet winters",
      "regions": ["Southern Europe", "California", "Central Chile", "South Africa", "Southwest Australia"]
    },
    {
      "id": "continental",
      "name": "Continental",
      "description": "Four distinct seasons with cold winters and warm summers",
      "regions": ["Central/Eastern Europe", "Central North America", "Northern China"]
    },
    // Additional climate zones...
  ]
}
```

#### Get Regions for a Country

```
GET /forecast/regions/:country
```

**Authentication:** None

**Parameters:**
- `country` (required): Country code or name (string)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "california",
      "name": "California",
      "climateZone": "mediterranean"
    },
    {
      "id": "midwest",
      "name": "Midwest",
      "climateZone": "continental"
    },
    // Additional regions...
  ]
}
```

#### Get Forecast History

```
GET /forecast/history
```

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "createdAt": "2023-07-10T14:30:45.123Z",
      "params": {
        "climate": "mediterranean",
        "environment": "protected",
        "area": 15,
        "crops": ["tomatoes", "cucumbers"]
      }
    },
    // Additional forecast history entries...
  ]
}
```

#### Save a Forecast

```
POST /forecast/save
```

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "name": "Summer Garden Plan",
  "forecastData": {
    // The complete forecast data object returned from POST /forecast
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Summer Garden Plan",
    "createdAt": "2023-07-15T14:30:45.123Z"
  }
}
```

### System Status Endpoints

#### Get API Health Status

```
GET /health
```

**Authentication:** None

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "database": "connected",
    "uptime": 3600
  }
}
```

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": [
      {
        "field": "area",
        "message": "Area must be a positive number"
      }
    ]
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Invalid input parameters
- `AUTHENTICATION_ERROR`: Authentication failed or token expired
- `AUTHORIZATION_ERROR`: User not authorized to access resource
- `NOT_FOUND`: Requested resource not found
- `SERVER_ERROR`: Internal server error

## Rate Limiting

API requests are subject to rate limiting to prevent abuse:

- Unauthenticated requests: 30 requests per minute
- Authenticated requests: 60 requests per minute

When rate limit is exceeded, the API returns a 429 Too Many Requests response with a Retry-After header.

## Versioning

The current API version is v1. All endpoints are prefixed with `/api`.

Future API versions will be accessible via `/api/v2`, etc.

## Support

For API support or to report issues, contact:

- Email: api-support@homegrowforecast.com
- GitHub Issues: https://github.com/yourusername/homegrow-forecast/issues
