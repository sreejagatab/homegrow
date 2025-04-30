@echo off
echo HomeGrow Forecast Tool - Load Testing
echo ====================================
echo.

REM Check if Artillery is installed
where artillery >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Artillery is not installed. Installing...
    npm install -g artillery
)

echo Starting backend server for load testing...
echo.
cd backend
start /B npm run server:start

echo Waiting for server to start...
timeout /t 10 /nobreak > nul

echo Running load tests...
echo.
cd ..
artillery run load-test.yml -o load-test-report.json

echo Generating HTML report...
artillery report load-test-report.json

echo Load testing completed.
echo HTML report generated at load-test-report.html
echo.

echo Stopping backend server...
cd backend
npm run server:stop

echo.
echo Load testing completed.
echo.

pause
