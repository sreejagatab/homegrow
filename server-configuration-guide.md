# HomeGrow Forecast Tool - Server Configuration Guide

This guide provides instructions for setting up and running the HomeGrow Forecast Tool backend server.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/homegrow.git
cd homegrow
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory with the following content:

```
# Server Configuration
NODE_ENV=development
PORT=5001

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/homegrow

# Authentication
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# CORS Settings
CORS_ORIGIN=http://localhost:3000

# Optional Features
ENABLE_USER_ACCOUNTS=true
ENABLE_FORECAST_HISTORY=true
ENABLE_WEATHER_INTEGRATION=true
```

Make sure to replace `your_secret_key_here` with a secure random string.

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Check MongoDB status on Windows
sc query MongoDB

# Start MongoDB if not running
net start MongoDB
```

### 5. Start the Backend Server

```bash
cd backend
npm run dev
```

The server should start on port 5001 (or the port specified in your `.env` file).

### 6. Start the Frontend Development Server

```bash
cd frontend
npm start
```

The frontend development server should start on port 3000.

## Troubleshooting

### Port Already in Use

If you see an error like `EADDRINUSE: address already in use :::5000`, it means another process is already using that port. You can:

1. Change the port in the `.env` file (e.g., from 5000 to 5001)
2. Find and terminate the process using the port:

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/macOS
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Issues

If the server fails to connect to MongoDB:

1. Make sure MongoDB is running
2. Check the connection string in the `.env` file
3. Verify MongoDB is listening on the default port (27017)

### API Endpoints Not Working

If the API endpoints are not responding:

1. Check the server logs for errors
2. Verify the server is running on the correct port
3. Check for any CORS issues in the browser console
4. Make sure the frontend is configured to use the correct API URL

## Demo Accounts

The following demo accounts are available for testing:

**Admin User:**
- Email: admin@homegrow.example
- Password: admin123

**Regular User:**
- Email: user@homegrow.example
- Password: password123

## API Endpoints

The backend provides the following RESTful API endpoints:

### Authentication Endpoints

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login a user
- `GET /api/auth/me`: Get current user information
- `GET /api/auth/logout`: Logout a user

### Forecast Endpoints

- `POST /api/forecast`: Generate a crop forecast
- `GET /api/forecast/crops`: Get available crops for forecasting
- `GET /api/forecast/climate-zones`: Get climate zones information
- `GET /api/forecast/regions/:country`: Get regions for a specific country
- `GET /api/forecast/history/:userId`: Get forecast history for a user
- `POST /api/forecast/save/:userId`: Save a forecast to user's history
