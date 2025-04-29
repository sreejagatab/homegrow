Write-Host "Running tests in Docker environment..." -ForegroundColor Green

Write-Host "Building Docker images..." -ForegroundColor Yellow
docker-compose -f docker-compose.test.yml build

Write-Host "Starting containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.test.yml up -d

Write-Host "Containers started. Viewing logs..." -ForegroundColor Green
docker-compose -f docker-compose.test.yml logs -f

# Note: Press Ctrl+C to stop viewing logs
# To stop containers when done:
# Write-Host "Stopping containers..." -ForegroundColor Yellow
# docker-compose -f docker-compose.test.yml down
