# MongoDB Connection Troubleshooting Guide

This guide provides step-by-step instructions for diagnosing and fixing MongoDB connection issues in the HomeGrow Forecast Tool.

## Common MongoDB Connection Issues

1. **Invalid Connection String**
2. **Authentication Failures**
3. **Network Connectivity Issues**
4. **MongoDB Service Not Running**
5. **Database User Permissions**
6. **Firewall Blocking Connections**
7. **Connection Timeout Settings**

## Diagnostic Steps

### 1. Verify MongoDB Service Status

**For local MongoDB:**
```bash
# Check if MongoDB is running
# Windows
sc query MongoDB

# Linux/macOS
sudo systemctl status mongodb
# or
sudo service mongod status
```

**For Docker-based MongoDB:**
```bash
# Check container status
docker ps | grep mongo

# Check container logs
docker logs homegrow-mongo
```

### 2. Test Connection String

**Connection String Format:**
```
mongodb://[username:password@]host[:port][/database][?options]
```

**Example Valid Connection Strings:**
- Local MongoDB: `mongodb://localhost:27017/homegrow`
- MongoDB Atlas: `mongodb+srv://username:password@cluster0.mongodb.net/homegrow?retryWrites=true&w=majority`
- Docker MongoDB: `mongodb://mongo:27017/homegrow`

**Test Connection Using MongoDB CLI:**
```bash
# Basic connection test
mongo "mongodb://localhost:27017/homegrow" --eval "db.adminCommand('ping')"

# Connection with authentication
mongo "mongodb://username:password@localhost:27017/homegrow" --eval "db.adminCommand('ping')"
```

### 3. Check Network Connectivity

```bash
# Test if MongoDB port is reachable
# Windows
telnet localhost 27017

# Linux/macOS
nc -zv localhost 27017
```

### 4. Verify Database User Credentials

1. Connect to MongoDB with admin privileges
2. Check if the user exists and has correct permissions:

```javascript
// Connect to admin database
use admin

// Authenticate as admin
db.auth('adminUsername', 'adminPassword')

// Switch to your application database
use homegrow

// Check users for this database
db.getUsers()

// Create a new user if needed
db.createUser({
  user: "homegrowUser",
  pwd: "securePassword",
  roles: [
    { role: "readWrite", db: "homegrow" }
  ]
})
```

## Common Solutions

### 1. Fix Connection String in .env File

Check your `.env` file and update the MongoDB connection string:

```
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/homegrow

# MongoDB with authentication
MONGODB_URI=mongodb://username:password@localhost:27017/homegrow

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/homegrow?retryWrites=true&w=majority
```

### 2. Implement Connection Retry Logic

Update your MongoDB connection code in `backend/src/server.js`:

```javascript
const mongoose = require('mongoose');
const MAX_RETRIES = 5;
let retryCount = 0;

const connectWithRetry = () => {
  console.log('MongoDB connection attempt #', retryCount + 1);
  
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('MongoDB connected successfully');
    retryCount = 0; // Reset retry count on successful connection
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    retryCount += 1;
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${retryCount * 2} seconds...`);
      setTimeout(connectWithRetry, retryCount * 2000);
    } else {
      console.error('Max retries reached. Could not connect to MongoDB');
      process.exit(1); // Exit with error
    }
  });
};

// Initial connection attempt
connectWithRetry();

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Handle application termination
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed due to application termination');
    process.exit(0);
  });
});
```

### 3. Enable Detailed MongoDB Logging

Update your MongoDB configuration to enable more detailed logging:

**For local MongoDB (mongod.conf):**
```yaml
systemLog:
  destination: file
  path: /var/log/mongodb/mongod.log
  logAppend: true
  verbosity: 1  # Increase to 2 or 3 for more details
```

**For Node.js application:**
```javascript
// Set Mongoose debug mode
mongoose.set('debug', true);
```

### 4. Check for Firewall Issues

**Windows:**
```
# Check Windows Firewall status
netsh advfirewall show currentprofile

# Allow MongoDB through Windows Firewall
netsh advfirewall firewall add rule name="MongoDB" dir=in action=allow protocol=TCP localport=27017
```

**Linux:**
```bash
# Check if firewall is blocking MongoDB port
sudo iptables -L | grep 27017

# Allow MongoDB port
sudo iptables -A INPUT -p tcp --dport 27017 -j ACCEPT
sudo iptables-save
```

## Testing the Fix

After implementing the fixes, test the authentication system:

1. Restart the backend server
2. Try to register a new user
3. Try to log in with existing credentials
4. Verify that user session persists after login

## MongoDB Compass Connection

MongoDB Compass provides a visual way to verify your connection:

1. Download and install [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Enter your connection string
3. Click "Connect"
4. If successful, you should see your database and collections

## Additional Resources

- [MongoDB Connection String URI Format](https://docs.mongodb.com/manual/reference/connection-string/)
- [Mongoose Connection Guide](https://mongoosejs.com/docs/connections.html)
- [MongoDB Atlas Connection Troubleshooting](https://docs.atlas.mongodb.com/troubleshoot-connection/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
