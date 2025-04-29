@echo off
echo Running tests in Docker environment...

echo Building Docker images...
docker-compose -f docker-compose.test.yml build

echo Starting containers...
docker-compose -f docker-compose.test.yml up -d mongo

echo Waiting for MongoDB to start...
timeout /t 5

echo Running authentication tests...
docker-compose -f docker-compose.test.yml run --rm backend-test

echo Tests completed.
echo Stopping containers...
docker-compose -f docker-compose.test.yml down

echo Done.
