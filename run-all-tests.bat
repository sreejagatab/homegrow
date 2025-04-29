@echo off
echo HomeGrow Forecast Tool - Comprehensive Test Suite
echo ================================================
echo.

REM Check if Node.js is installed
node --version > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

echo Running server status check...
echo.
cd backend
node server-status.js
echo.

echo Testing MongoDB connection...
echo.
node test-mongodb.js
echo.

echo Running backend tests...
echo.
npm test
echo.

echo Running frontend tests...
echo.
cd ../frontend
npm run test:ci
echo.

echo All tests completed.
echo.

pause
