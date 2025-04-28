# HomeGrow Forecast Tool

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
npm run dev

# Start frontend development server (from frontend directory)
npm start
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
