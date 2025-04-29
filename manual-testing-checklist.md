# HomeGrow Forecast Tool - Manual Testing Checklist

This checklist provides a comprehensive guide for manually testing all aspects of the HomeGrow Forecast Tool.

## Server and Database

- [ ] **Server Startup**
  - [ ] Server starts successfully with `npm run server:start`
  - [ ] Server status can be checked with `npm run server:status`
  - [ ] Server can be stopped with `npm run server:stop`
  - [ ] Server automatically reconnects to MongoDB if connection is lost

- [ ] **MongoDB Connection**
  - [ ] MongoDB connection test passes (`node test-mongodb.js`)
  - [ ] Server connects to MongoDB on startup
  - [ ] Server handles MongoDB connection errors gracefully
  - [ ] Server reconnects to MongoDB if connection is lost

- [ ] **API Health**
  - [ ] `/api/health` endpoint returns server and database status
  - [ ] `/api/test` endpoint returns success message
  - [ ] API status component shows correct status

## Authentication

- [ ] **User Registration**
  - [ ] User can register with valid credentials
  - [ ] Registration fails with invalid email format
  - [ ] Registration fails with password less than 6 characters
  - [ ] Registration fails with existing email
  - [ ] User receives JWT token after successful registration
  - [ ] User data is stored in the database

- [ ] **User Login**
  - [ ] User can login with valid credentials
  - [ ] Login fails with invalid email
  - [ ] Login fails with invalid password
  - [ ] User receives JWT token after successful login
  - [ ] Login form shows appropriate error messages

- [ ] **Authentication Middleware**
  - [ ] Protected routes require valid JWT token
  - [ ] Invalid tokens are rejected
  - [ ] Expired tokens are rejected
  - [ ] User is redirected to login page when accessing protected routes without authentication

- [ ] **User Profile**
  - [ ] User can view their profile
  - [ ] User can update their preferences
  - [ ] User preferences are saved to the database
  - [ ] User preferences are loaded when user logs in

## Forecast Functionality

- [ ] **Forecast Form**
  - [ ] Form loads with all fields
  - [ ] Climate zones are loaded from the API
  - [ ] Crops are loaded from the API
  - [ ] Form validation works for all fields
  - [ ] Form submission works with valid data
  - [ ] Form shows loading state during submission
  - [ ] Form handles API errors gracefully

- [ ] **Forecast Results**
  - [ ] Results are displayed after form submission
  - [ ] Crop tabs work for switching between crops
  - [ ] Planting calendar is displayed correctly
  - [ ] Production metrics are calculated correctly
  - [ ] Risk factors are displayed correctly
  - [ ] Recommendations are displayed correctly
  - [ ] Charts are rendered correctly
  - [ ] Save button is displayed for authenticated users
  - [ ] Forecast can be saved to user history
  - [ ] Save button shows loading state during save
  - [ ] Success message is displayed after successful save
  - [ ] Error message is displayed if save fails

- [ ] **Forecast History**
  - [ ] User can view their forecast history
  - [ ] Forecast history is loaded from the API
  - [ ] User can view details of a saved forecast
  - [ ] User can delete a saved forecast
  - [ ] Forecast history is updated after saving a new forecast

## UI/UX

- [ ] **Responsive Design**
  - [ ] Application works on desktop browsers
  - [ ] Application works on tablet devices
  - [ ] Application works on mobile devices
  - [ ] Layout adjusts appropriately for different screen sizes
  - [ ] Touch targets are large enough on mobile devices

- [ ] **Browser Compatibility**
  - [ ] Application works in Chrome
  - [ ] Application works in Firefox
  - [ ] Application works in Safari
  - [ ] Application works in Edge

- [ ] **Accessibility**
  - [ ] All form fields have labels
  - [ ] All images have alt text
  - [ ] Color contrast is sufficient
  - [ ] Keyboard navigation works
  - [ ] Screen readers can navigate the application

- [ ] **Error Handling**
  - [ ] Form validation errors are displayed clearly
  - [ ] API errors are displayed clearly
  - [ ] Network errors are handled gracefully
  - [ ] Server errors are handled gracefully
  - [ ] User is notified of errors in a user-friendly way

## Performance

- [ ] **Load Time**
  - [ ] Application loads quickly
  - [ ] API requests complete in a reasonable time
  - [ ] Charts render quickly
  - [ ] Loading indicators are displayed during long operations

- [ ] **Resource Usage**
  - [ ] Application does not use excessive CPU
  - [ ] Application does not use excessive memory
  - [ ] Application does not make excessive API requests
  - [ ] Application does not cause browser performance issues

## Security

- [ ] **Authentication**
  - [ ] Passwords are hashed in the database
  - [ ] JWT tokens are securely stored
  - [ ] JWT tokens expire after the specified time
  - [ ] Protected routes are properly secured

- [ ] **Input Validation**
  - [ ] All user input is validated on the server
  - [ ] SQL injection is prevented
  - [ ] XSS attacks are prevented
  - [ ] CSRF attacks are prevented

- [ ] **API Security**
  - [ ] API rate limiting works
  - [ ] API endpoints are properly secured
  - [ ] API errors do not expose sensitive information
  - [ ] API requests require proper authentication

## Testing Tools

- [ ] **API Status Component**
  - [ ] Component shows correct status for all endpoints
  - [ ] Component updates when status changes
  - [ ] Component shows error messages when endpoints are down
  - [ ] Component provides troubleshooting tips

- [ ] **API Tester Component**
  - [ ] Component runs tests for all endpoints
  - [ ] Component shows test results
  - [ ] Component allows running tests manually
  - [ ] Component shows detailed test results
  - [ ] Auto-refresh works correctly

- [ ] **MongoDB Connection Test**
  - [ ] Test connects to MongoDB
  - [ ] Test reports connection status
  - [ ] Test provides detailed error information
  - [ ] Test suggests troubleshooting steps

- [ ] **Server Status Check**
  - [ ] Check reports server environment
  - [ ] Check reports MongoDB status
  - [ ] Check reports port availability
  - [ ] Check reports dependency status

## Deployment

- [ ] **Production Build**
  - [ ] Frontend builds successfully with `npm run build`
  - [ ] Backend runs in production mode
  - [ ] Environment variables are properly set
  - [ ] Static files are served correctly

- [ ] **Environment Configuration**
  - [ ] Development environment works
  - [ ] Production environment works
  - [ ] Environment-specific variables are set
  - [ ] Sensitive information is not exposed

## Documentation

- [ ] **README**
  - [ ] Installation instructions are clear
  - [ ] Usage instructions are clear
  - [ ] API documentation is complete
  - [ ] Troubleshooting information is provided

- [ ] **Code Documentation**
  - [ ] Code is well-commented
  - [ ] Functions have JSDoc comments
  - [ ] Complex logic is explained
  - [ ] API endpoints are documented

## Notes

Use this section to record any issues or observations during testing:

- 
- 
- 

## Test Results

**Tester Name**: ________________________

**Date**: ________________________

**Overall Result**: ☐ Pass ☐ Fail

**Comments**:

