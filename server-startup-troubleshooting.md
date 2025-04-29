# Server Startup Troubleshooting Guide

This guide provides steps to diagnose and fix server startup issues in the HomeGrow Forecast Tool.

## Common Server Startup Issues

1. **Port Already in Use**
2. **MongoDB Connection Failures**
3. **Environment Variable Issues**
4. **Dependency Problems**
5. **File Permission Issues**

## Diagnostic Steps

### 1. Check if the Port is Already in Use

```bash
# Windows
netstat -ano | findstr :5000

# Linux/macOS
lsof -i :5000
```

If the port is in use, you can either:
- Kill the process using that port
- Change the port in the .env file

### 2. Verify MongoDB Connection

```bash
# Check if MongoDB is running
# Windows
sc query MongoDB

# Linux/macOS
systemctl status mongodb

# Docker
docker ps | grep mongo
```

Test the connection string:
```bash
# Using mongo CLI
mongo "mongodb://localhost:27017/homegrow" --eval "db.adminCommand('ping')"
```

### 3. Check Environment Variables

Ensure your .env file exists and has the correct values:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/homegrow
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

Try running the server with explicit environment variables:
```bash
PORT=5000 MONGODB_URI=mongodb://localhost:27017/homegrow node src/server.js
```

### 4. Check for Dependency Issues

```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Check for outdated packages
npm outdated

# Update packages if needed
npm update
```

### 5. Debug with Verbose Logging

```bash
# Run with more verbose output
NODE_DEBUG=* node src/server.js

# Or use the debug package
DEBUG=* node src/server.js
```

### 6. Check for File Permission Issues

```bash
# Windows
icacls src\server.js

# Linux/macOS
ls -la src/server.js
```

## Step-by-Step Server Startup Troubleshooting

1. **Start with a Clean Environment**
   ```bash
   # Kill any running Node processes
   # Windows
   taskkill /F /IM node.exe

   # Linux/macOS
   pkill -f node
   ```

2. **Verify MongoDB is Running**
   ```bash
   # Check MongoDB status
   # Docker
   docker ps | grep mongo
   
   # If not running, start it
   docker-compose up -d mongo
   ```

3. **Test MongoDB Connection Directly**
   ```bash
   # Create a simple test script
   echo "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/homegrow').then(() => console.log('Connected!')).catch(err => console.error('Failed:', err));" > test-mongo.js
   
   # Run the test
   node test-mongo.js
   ```

4. **Run Server with Minimal Configuration**
   ```bash
   # Create a minimal server file
   echo "const express = require('express'); const app = express(); app.get('/', (req, res) => res.send('OK')); app.listen(5000, () => console.log('Server running'));" > minimal-server.js
   
   # Run the minimal server
   node minimal-server.js
   ```

5. **Add Components One by One**
   - Start with a minimal Express server
   - Add MongoDB connection
   - Add routes one by one
   - Add middleware one by one

## Common Solutions

### 1. Fix Port Conflicts

```bash
# Change the port in .env
echo "PORT=5001" >> .env

# Or kill the process using port 5000
# Windows
FOR /F "tokens=5" %P IN ('netstat -ano ^| findstr :5000') DO taskkill /F /PID %P

# Linux/macOS
kill $(lsof -t -i:5000)
```

### 2. Fix MongoDB Connection Issues

```bash
# Update connection string in .env
echo "MONGODB_URI=mongodb://localhost:27017/homegrow" > .env

# For Docker setup
echo "MONGODB_URI=mongodb://mongo:27017/homegrow" > .env

# For MongoDB Atlas
echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/homegrow" > .env
```

### 3. Fix Dependency Issues

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### 4. Fix Environment Variable Issues

```bash
# Create a proper .env file
cat > .env << EOL
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/homegrow
JWT_SECRET=homegrow_development_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
EOL
```

## Testing the Fix

After implementing fixes, test the server:

1. Start the server with verbose logging:
   ```bash
   NODE_DEBUG=express,mongoose node src/server.js
   ```

2. Test a simple API endpoint:
   ```bash
   curl http://localhost:5000/api/test
   ```

3. Test the authentication endpoints:
   ```bash
   # Run the test script
   node test-auth.js
   ```

## Additional Resources

- [Express.js Debugging Guide](https://expressjs.com/en/guide/debugging.html)
- [Mongoose Connection Issues](https://mongoosejs.com/docs/connections.html)
- [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)
