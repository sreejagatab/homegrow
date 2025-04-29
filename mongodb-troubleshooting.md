# MongoDB Connection Troubleshooting Guide

This guide provides solutions for common MongoDB connection issues in the HomeGrow Forecast Tool.

## Connection Issues

### 1. MongoDB Not Running

**Symptoms:**
- "Connection refused" errors
- "Failed to connect to localhost:27017" errors

**Solutions:**

**For Windows:**
1. Check if MongoDB service is running:
   - Open Services (services.msc)
   - Look for "MongoDB" service
   - If not running, right-click and select "Start"

2. Start MongoDB manually:
   ```
   "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --dbpath="C:\data\db"
   ```

**For macOS:**
1. Check if MongoDB is running:
   ```
   brew services list
   ```

2. Start MongoDB:
   ```
   brew services start mongodb-community
   ```

**For Linux:**
1. Check MongoDB status:
   ```
   sudo systemctl status mongodb
   ```

2. Start MongoDB:
   ```
   sudo systemctl start mongodb
   ```

### 2. Authentication Issues

**Symptoms:**
- "Authentication failed" errors
- "not authorized on admin to execute command" errors

**Solutions:**
1. Check your connection string in `.env` file:
   ```
   MONGODB_URI=mongodb://username:password@localhost:27017/homegrow
   ```

2. For local development without authentication:
   ```
   MONGODB_URI=mongodb://localhost:27017/homegrow
   ```

3. Verify user credentials:
   - Connect to MongoDB shell:
     ```
     mongo
     ```
   - Switch to admin database:
     ```
     use admin
     ```
   - Create a new user if needed:
     ```
     db.createUser({
       user: "homegrow",
       pwd: "password",
       roles: [{ role: "readWrite", db: "homegrow" }]
     })
     ```

### 3. Network Issues

**Symptoms:**
- Timeout errors
- "No connection could be made because the target machine actively refused it"

**Solutions:**
1. Check firewall settings:
   - Ensure port 27017 is open for MongoDB

2. Check MongoDB binding:
   - MongoDB might be bound to 127.0.0.1 only
   - Edit mongod.conf to bind to all interfaces if needed:
     ```
     net:
       bindIp: 0.0.0.0
     ```

3. For cloud MongoDB (Atlas):
   - Ensure your IP is whitelisted in the Atlas dashboard
   - Check network access settings

### 4. Database Not Found

**Symptoms:**
- "Database not found" errors
- Empty database after connection

**Solutions:**
1. Check if the database exists:
   ```
   mongo
   show dbs
   ```

2. Create the database if it doesn't exist:
   ```
   use homegrow
   db.createCollection("users")
   ```

3. Run the setup script:
   ```
   npm run setup
   ```

## Testing Connection

Use the provided test script to verify your MongoDB connection:

```
node test-mongodb.js
```

This script will:
1. Check if MongoDB is running
2. Attempt to connect using your .env configuration
3. Provide detailed error information if connection fails

## Docker Testing Environment

If you're having persistent issues, try using the Docker testing environment:

```
run-docker-tests.bat
```

This will:
1. Create a containerized environment with MongoDB
2. Run the connection tests in isolation
3. Help identify if the issue is with your local environment

## Common Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| ECONNREFUSED | Connection refused | Check if MongoDB is running |
| ETIMEDOUT | Connection timed out | Check network/firewall settings |
| 18 | Authentication failed | Check username/password |
| 13 | Unauthorized | Check user permissions |
| 8000 | Not primary | Replica set issues, try connecting to primary |

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Connection String URI Format](https://docs.mongodb.com/manual/reference/connection-string/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

If you continue to experience issues after trying these solutions, please check the project's issue tracker or contact support.
