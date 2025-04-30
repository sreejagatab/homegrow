@echo off
echo Starting MongoDB container...
docker-compose up -d mongo
echo.
echo Testing MongoDB connection...
cd backend
node docker-mongo-test.js
cd ..
echo.
echo If the connection test was successful, you can now start the backend server with:
echo npm run server:start
