#!/bin/bash

echo "HomeGrow Forecast Tool - Load Testing"
echo "===================================="
echo

# Check if Artillery is installed
if ! command -v artillery &> /dev/null; then
    echo "Artillery is not installed. Installing..."
    npm install -g artillery
fi

echo "Starting backend server for load testing..."
echo
cd backend
npm run server:start &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 10

echo "Running load tests..."
echo
cd ..
npx artillery run load-test.yml -o load-test-report.json

echo "Generating HTML report..."
npx artillery report load-test-report.json

echo "Load testing completed."
echo "HTML report generated at load-test-report.html"
echo

echo "Stopping backend server..."
kill $SERVER_PID

echo
echo "Load testing completed."
echo

# Make the script executable
chmod +x run-load-tests.sh
