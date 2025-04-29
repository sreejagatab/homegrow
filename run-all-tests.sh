#!/bin/bash

echo "HomeGrow Forecast Tool - Comprehensive Test Suite"
echo "================================================"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed or not in PATH."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Running server status check..."
echo
cd backend
node server-status.js
echo

echo "Testing MongoDB connection..."
echo
node test-mongodb.js
echo

echo "Running backend tests..."
echo
npm test
echo

echo "Running frontend tests..."
echo
cd ../frontend
npm run test:ci
echo

echo "All tests completed."
echo
