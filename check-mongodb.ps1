Write-Host "Checking MongoDB status..."

# Check if MongoDB is installed
$mongoInstalled = $false
try {
    $mongodVersion = mongod --version
    $mongoInstalled = $true
    Write-Host "MongoDB is installed: $mongodVersion"
} catch {
    Write-Host "MongoDB is not installed or not in PATH."
}

# Check if MongoDB service is running (Windows)
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($mongoService) {
    Write-Host "MongoDB service status: $($mongoService.Status)"
    if ($mongoService.Status -ne "Running") {
        Write-Host "Starting MongoDB service..."
        Start-Service MongoDB
        Write-Host "MongoDB service started."
    }
} else {
    Write-Host "MongoDB service is not installed."
}

# Check if Docker is running
$dockerRunning = $false
try {
    $dockerPs = docker ps
    $dockerRunning = $true
    Write-Host "Docker is running."
} catch {
    Write-Host "Docker is not running or not installed."
}

# Check if MongoDB container is running
if ($dockerRunning) {
    $mongoContainer = docker ps --filter "name=mongo" --format "{{.Names}}"
    if ($mongoContainer) {
        Write-Host "MongoDB container is running: $mongoContainer"
    } else {
        Write-Host "MongoDB container is not running."
        Write-Host "Starting MongoDB container..."
        docker-compose up -d mongo
        Write-Host "MongoDB container started."
    }
}

# Update .env file
$envFile = "backend\.env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    
    if ($mongoContainer) {
        # Using Docker MongoDB
        $newEnvContent = $envContent -replace "MONGODB_URI=.*", "MONGODB_URI=mongodb://mongo:27017/homegrow"
        Set-Content $envFile $newEnvContent
        Write-Host "Updated .env file with Docker MongoDB connection string."
    } elseif ($mongoService -and $mongoService.Status -eq "Running") {
        # Using local MongoDB
        $newEnvContent = $envContent -replace "MONGODB_URI=.*", "MONGODB_URI=mongodb://localhost:27017/homegrow"
        Set-Content $envFile $newEnvContent
        Write-Host "Updated .env file with local MongoDB connection string."
    } else {
        Write-Host "No running MongoDB instance found. Please install and start MongoDB, or use Docker."
    }
} else {
    Write-Host ".env file not found at: $envFile"
}

Write-Host "`nMongoDB connection setup complete."
Write-Host "You can now start the backend server with: npm run server:start"
