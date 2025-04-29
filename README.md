# HomeGrow Forecast Tool

### https://github.com/sreejagatab/homegrow

A comprehensive forecasting application for home vegetable farmers to optimize planting, growth, and harvest of key crops based on local conditions and growing environments.

## Features

- **Detailed Crop Forecasting**: Generate specific forecasts for tomatoes, cucumbers, bell peppers, eggplant, and hot peppers
- **Climate-Specific Recommendations**: Tailored advice based on your climate zone and region
- **Growing Environment Options**: Supports open field, protected (greenhouse), climate-controlled, and non-cooled environments
- **Visual Planting Calendars**: See optimal planting times throughout the agricultural year (July-June)
- **Production Metrics**: Get detailed yield estimates, harvest timelines, and space optimization recommendations
- **Risk Assessment**: Identify and mitigate potential risks specific to your crops and environment

## Technology Stack

### Frontend
- React.js
- Chart.js for data visualization
- React Router for navigation
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB for data storage
- JWT for authentication
- RESTful API architecture

### Deployment
- Docker containers for easy deployment
- Docker Compose for orchestration
- Configurable environment variables

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Docker and Docker Compose (for containerized setup)

### Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/homegrow-forecast.git
cd homegrow-forecast
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create environment files:
```bash
# In the backend directory
touch .env
```

Add the following to the backend `.env` file:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/homegrow
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=http://localhost:3000
```

4. Start the development servers:
```bash
# Start backend server (from backend directory)
npm run server:start

# Start frontend development server (from frontend directory)
npm start
```

5. Check server status:
```bash
# From backend directory
node server-status.js
```

### Docker Setup

1. Build and start the containers:
```bash
docker-compose up -d
```

2. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Project Structure

```
homegrow-forecast/
├── frontend/             # React frontend application
│   ├── public/           # Static assets
│   ├── src/              # Source code
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React contexts for state management
│   │   ├── pages/        # Page components
│   │   ├── styles/       # CSS styles
│   │   └── utils/        # Helper functions and API clients
├── backend/              # Node.js backend application
│   ├── src/              # Source code
│   │   ├── controllers/  # Request handlers
│   │   ├── data/         # Data files (crops, climate zones, etc.)
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic services
│   │   └── utils/        # Helper functions
├── docker/               # Docker configuration
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
└── docker-compose.yml    # Docker Compose configuration
```

## API Documentation

The backend provides the following RESTful API endpoints:

### Forecast Endpoints

- `POST /api/forecast`: Generate a crop forecast
- `GET /api/forecast/crops`: Get available crops for forecasting
- `GET /api/forecast/climate-zones`: Get climate zones information
- `GET /api/forecast/regions/:country`: Get regions for a specific country
- `GET /api/forecast/history/:userId`: Get forecast history for a user
- `POST /api/forecast/save/:userId`: Save a forecast to user's history

### Weather Endpoints

- `GET /api/weather/:country/:region`: Get weather data for a specific region

### User Endpoints

- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: Log in user
- `GET /api/users/current`: Get current user

## Troubleshooting

If you encounter issues with the application, we've provided several diagnostic tools:

### MongoDB Connection Issues

Run the MongoDB connection test script:
```bash
# From backend directory
node test-mongodb.js
```

For detailed troubleshooting steps, see [MongoDB Troubleshooting Guide](mongodb-troubleshooting.md).

### Server Startup Issues

Run the server status script to check your environment:
```bash
# From backend directory
node server-status.js
```

For detailed troubleshooting steps, see [Server Startup Troubleshooting Guide](server-startup-troubleshooting.md).

### API Connection Issues

Use the API Status component in the frontend to check API connectivity:
```
http://localhost:3000/api-status
```

Or use the API Tester component for more detailed testing:
```
import { ApiTester } from './components/ApiTester';
```

### Docker Testing Environment

To test in an isolated Docker environment:
```bash
run-docker-tests.bat
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data sources for climate zones and crop information
- Open-source libraries and frameworks that made this project possible

## Key features of the website include:

### Interactive Planning Interface:

Country and region selection that adapts to specific growing conditions
Climate zone selection for accurate forecasting
Cultivation environment options (open field, protected, cooled, non-cooled)
Growing area input to calculate total yield expectations


### Comprehensive Crop Data:

Detailed profiles for each vegetable crop
Complete life cycle information (days to maturity)
Expected yields per square meter, adjusted based on climate and growing conditions
Maintenance requirements and difficulty levels


### Seasonal Planning Tools:

Visual planting calendars covering the July-June agricultural cycle
Color-coded planting windows (optimal, suitable, risky, not recommended)
Climate-specific adjustments to planting dates


### Risk Assessment:

Weather fluctuation impacts for each crop
Pest and disease vulnerability analysis
Temperature sensitivity thresholds
Environmental stress factors


### Production Metrics:

Expected total yields based on input area
Harvest duration estimates
Time to first harvest information
Maintenance level requirements



### The website features a user-friendly interface with:

Intuitive navigation
Interactive elements that update forecasts based on your selections
Mobile-responsive design
Clear visual indicators for optimal planting times

# Data Expansion Roadmap
## 1. Add More Vegetable Crops
Additional Crops to Implement:

### Leafy Greens

Lettuce (various types: romaine, butterhead, loose-leaf)
Spinach
Kale
Swiss chard
Arugula


### Root Vegetables

Carrots
Radishes
Beets
Turnips
Potatoes
Sweet potatoes


### Brassicas

Broccoli
Cauliflower
Brussels sprouts
Cabbage


### Legumes

Green beans (bush and pole varieties)
Peas (snap, snow, and garden)
Fava beans


### Squash Family

Zucchini
Winter squash (butternut, acorn, spaghetti)
Pumpkins
Melons (watermelon, cantaloupe)


### Alliums

Onions
Garlic
Leeks
Shallots


### Herbs

Basil
Cilantro
Parsley
Mint
Rosemary
Thyme



## Implementation Plan:

Create standardized data templates for each crop category
Research and compile crop-specific data:

Growth cycles and requirements
Climate-specific planting dates
Yield expectations for different environments
Common varieties for different climates
Risk factors and mitigation strategies


Add new data files to the backend/src/data/ directory
Update the crop selection interface to include new categories and crops
Add crop images to the frontend/public/images/crops/ directory

## 2. Expand Regional Climate Data
Regional Expansion Priorities:

Asia: Japan, China, India, Thailand, Vietnam
South America: Brazil, Argentina, Chile, Peru
Africa: South Africa, Kenya, Morocco, Egypt
Middle East: Israel, UAE, Turkey
Eastern Europe: Poland, Ukraine, Hungary
Additional Regions: New Zealand, Mexico, Caribbean islands

Data Points to Add:

Microclimate information within existing regions
Regional growing season variations
Elevation-based climate adjustments
Frost date records for the past 10 years
Rainfall patterns and intensity
Humidity profiles
Wind patterns affecting growing conditions
Soil types common to specific regions

Implementation Plan:

Enhance the regions.json data structure to include more detailed climate parameters
Create subregions with more granular climate data
Implement a searchable location database to allow users to find their specific area
Add GIS integration to automatically detect climate data based on user location
Include support for southern hemisphere growing seasons and reversed seasonal calendars

## 3. Integrate Real-Time Weather APIs
Weather Data Sources:

OpenWeatherMap API
AccuWeather API
Weather.gov API (for US locations)
Weatherbit.io
ClimaCell API
Local meteorological services for specific countries

Weather Data to Incorporate:

7-day forecasts to influence immediate planting decisions
Historical weather data to improve planting recommendations
Growing degree days calculations for crop development tracking
Frost alerts and warnings
Drought monitoring and water availability predictions
Extreme weather event predictions (heatwaves, storms)
Seasonal forecasts for long-term planning

Implementation Plan:

Create a weather service adapter in backend/src/services/weatherService.js that can work with multiple weather APIs
Implement caching to reduce API calls and handle rate limits
Develop a fallback mechanism for when weather services are unavailable
Add user location detection (with permission) to automatically fetch local weather
Create weather-based alerts and notifications for critical planting or protective actions
Implement a dashboard showing relevant weather patterns for active gardens
Add weather-adjusted recommendations for current plantings

Technical Requirements:

API key management system
Geolocation services integration
Data normalization for different weather services
Error handling for service outages
Throttling to manage API request limits
Background processing for regular weather updates

This expanded data roadmap will significantly enhance the accuracy and usefulness of the HomeGrow Forecast Tool, providing users with increasingly personalized and precise growing recommendations based on their specific location and current conditions.
