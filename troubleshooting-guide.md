# HomeGrow Forecast Tool - Troubleshooting Guide

This guide provides solutions for common issues you might encounter when running the HomeGrow Forecast Tool.

## Table of Contents

1. [Server Connection Issues](#server-connection-issues)
2. [Database Connection Issues](#database-connection-issues)
3. [API Endpoint Errors](#api-endpoint-errors)
4. [Authentication Problems](#authentication-problems)
5. [Frontend Display Issues](#frontend-display-issues)
6. [Performance Problems](#performance-problems)

## Server Connection Issues

### "No response from server. Please check your internet connection."

This error occurs when the frontend cannot connect to the backend server.

**Possible Causes:**
- The backend server is not running
- The server is running on a different port than expected
- A firewall is blocking the connection
- The proxy configuration is incorrect

**Solutions:**

1. **Check if the server is running:**
   ```bash
   # Check server status
   cd backend
   node server-manager.js status
   
   # Start the server if it's not running
   node server-manager.js start
   ```

2. **Verify the server port:**
   - Check the `PORT` value in `backend/.env` (should be 5001)
   - Make sure the `proxy` field in `frontend/package.json` matches this port

3. **Check for port conflicts:**
   ```bash
   # Windows
   netstat -ano | findstr :5001
   
   # Linux/macOS
   lsof -i :5001
   ```

4. **Restart the development server:**
   ```bash
   # Stop any running servers
   cd backend
   node server-manager.js stop
   
   # Start a new server
   node server-manager.js start
   ```

5. **Check server logs:**
   ```bash
   # View server logs
   cd backend
   cat server.log
   cat server-error.log
   ```

## Database Connection Issues

### "Database issue: disconnected" or "Database issue: error"

This error occurs when the server cannot connect to the MongoDB database.

**Possible Causes:**
- MongoDB is not running
- The connection string is incorrect
- Authentication credentials are invalid
- Network issues preventing connection

**Solutions:**

1. **Check if MongoDB is running:**
   ```bash
   # Windows
   sc query MongoDB
   
   # Linux/macOS
   systemctl status mongodb
   ```

2. **Start MongoDB if it's not running:**
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/macOS
   sudo systemctl start mongodb
   ```

3. **Verify the connection string in `.env`:**
   ```
   MONGODB_URI=mongodb://localhost:27017/homegrow
   ```

4. **Test the connection directly:**
   ```bash
   # Connect to MongoDB shell
   mongo
   
   # In the MongoDB shell
   use homegrow
   db.stats()
   ```

5. **Check MongoDB logs:**
   ```bash
   # Windows
   type "C:\\Program Files\\MongoDB\\Server\\5.0\\log\\mongod.log"
   
   # Linux/macOS
   tail -100 /var/log/mongodb/mongod.log
   ```

## API Endpoint Errors

### "Failed to load crop data" or "Failed to load climate zone data"

These errors occur when specific API endpoints fail but the server is running.

**Possible Causes:**
- The endpoint route is incorrect
- The data files are missing or corrupted
- Server-side errors when processing the request

**Solutions:**

1. **Check the API endpoint directly:**
   ```bash
   # Using curl
   curl http://localhost:5001/api/forecast/crops
   curl http://localhost:5001/api/forecast/climate-zones
   ```

2. **Verify data files exist:**
   - Check that `backend/src/data/crops.json` exists
   - Check that `backend/src/data/climates.json` exists

3. **Check server logs for specific errors:**
   ```bash
   cd backend
   cat server-error.log
   ```

4. **Restart the server:**
   ```bash
   cd backend
   node server-manager.js restart
   ```

5. **Use the fallback data:**
   - The application should automatically use fallback data when API endpoints fail
   - Check the browser console for messages about using fallback data

## Authentication Problems

### "Login failed" or "Registration failed"

These errors occur when there are issues with the authentication system.

**Possible Causes:**
- Database connection issues
- Invalid credentials
- JWT token issues
- Server-side validation errors

**Solutions:**

1. **Check if the database is connected:**
   - Use the health check endpoint: `http://localhost:5001/api/health`
   - Verify that `database.status` is `connected`

2. **Try the demo accounts:**
   - Admin: admin@homegrow.example / admin123
   - User: user@homegrow.example / password123
   - Test: test@example.com / password123

3. **Check JWT configuration:**
   - Verify that `JWT_SECRET` is set in `backend/.env`
   - Verify that `JWT_EXPIRES_IN` is set (e.g., `7d`)

4. **Clear browser storage:**
   - Open browser developer tools
   - Go to Application > Storage > Clear Site Data
   - Try logging in again

5. **Check for validation errors:**
   - Make sure email is in valid format
   - Password should be at least 6 characters
   - Name should be provided

## Frontend Display Issues

### "Components not rendering correctly" or "Styles not applying"

These issues occur when there are problems with the frontend rendering.

**Possible Causes:**
- CSS files not loading
- React component errors
- Missing dependencies
- Browser compatibility issues

**Solutions:**

1. **Check browser console for errors:**
   - Open browser developer tools
   - Look for errors in the Console tab

2. **Verify CSS files are loading:**
   - Check the Network tab in developer tools
   - Look for any failed CSS requests

3. **Clear browser cache:**
   - Press Ctrl+F5 or Cmd+Shift+R to force reload
   - Or clear browser cache from settings

4. **Check for missing dependencies:**
   ```bash
   cd frontend
   npm install
   ```

5. **Try a different browser:**
   - Test in Chrome, Firefox, or Edge
   - Compare behavior across browsers

## Performance Problems

### "Slow loading times" or "Unresponsive application"

These issues occur when the application is performing poorly.

**Possible Causes:**
- Large data transfers
- Inefficient database queries
- Memory leaks
- Resource-intensive operations

**Solutions:**

1. **Check server resource usage:**
   - Use the health check endpoint: `http://localhost:5001/api/health`
   - Check `system.memory.usage` for high memory usage

2. **Monitor network requests:**
   - Use the Network tab in browser developer tools
   - Look for slow requests or large response sizes

3. **Optimize database queries:**
   - Check server logs for slow query warnings
   - Consider adding indexes to frequently queried fields

4. **Implement caching:**
   - Cache frequently accessed data
   - Use browser localStorage for client-side caching

5. **Reduce bundle size:**
   - Use code splitting for large components
   - Optimize image sizes and formats

## Additional Resources

- [Server Configuration Guide](server-configuration-guide.md)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Express.js Documentation](https://expressjs.com/)

## Getting Help

If you continue to experience issues after trying these troubleshooting steps, please:

1. Check the GitHub repository for known issues
2. Search the project documentation for similar problems
3. Contact the development team with:
   - A detailed description of the issue
   - Steps to reproduce the problem
   - Error messages and logs
   - Environment information (OS, browser, Node.js version)
