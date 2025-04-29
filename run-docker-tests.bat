@echo off
echo HomeGrow Forecast Tool - Docker Test Environment
echo ================================================
echo.

REM Check if Docker is installed
docker --version > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Docker is not installed or not in PATH.
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    exit /b 1
)

echo Building Docker test environment...
echo.

REM Build the Docker image for testing
docker build -t homegrow-test -f Dockerfile.test .

if %ERRORLEVEL% NEQ 0 (
    echo Failed to build Docker image.
    exit /b 1
)

echo.
echo Running tests in Docker container...
echo.

REM Run the tests in the Docker container
docker run --name homegrow-test-container -it --rm homegrow-test

echo.
echo Tests completed.
echo.

pause
