Write-Host "Testing authentication endpoints with curl..." -ForegroundColor Green

# Test server availability
Write-Host "Testing server availability..." -ForegroundColor Yellow
curl -s http://localhost:5000/api/test

# Register a new user
Write-Host "`nRegistering a new user..." -ForegroundColor Yellow
$registerResponse = curl -s -X POST -H "Content-Type: application/json" -d '{"name":"Test User","email":"test@example.com","password":"password123"}' http://localhost:5000/api/auth/register
Write-Host $registerResponse

# Extract token from response (if successful)
$token = ($registerResponse | ConvertFrom-Json).token

if ($token) {
    Write-Host "`nRegistration successful! Token received." -ForegroundColor Green
    
    # Test getting current user with token
    Write-Host "`nGetting current user..." -ForegroundColor Yellow
    $meResponse = curl -s -H "Authorization: Bearer $token" http://localhost:5000/api/auth/me
    Write-Host $meResponse
} else {
    # Try login instead (user might already exist)
    Write-Host "`nRegistration failed. Trying login..." -ForegroundColor Yellow
    $loginResponse = curl -s -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}' http://localhost:5000/api/auth/login
    Write-Host $loginResponse
    
    # Extract token from login response
    $token = ($loginResponse | ConvertFrom-Json).token
    
    if ($token) {
        Write-Host "`nLogin successful! Token received." -ForegroundColor Green
        
        # Test getting current user with token
        Write-Host "`nGetting current user..." -ForegroundColor Yellow
        $meResponse = curl -s -H "Authorization: Bearer $token" http://localhost:5000/api/auth/me
        Write-Host $meResponse
    } else {
        Write-Host "`nLogin failed. Authentication system may not be working correctly." -ForegroundColor Red
    }
}

Write-Host "`nAuthentication tests completed." -ForegroundColor Green
