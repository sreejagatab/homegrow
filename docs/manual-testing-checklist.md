# HomeGrow Manual Testing Checklist

This document provides a checklist for manual testing of the HomeGrow Forecast Tool application. It covers all major features and functionality.

## Authentication

### Registration

- [ ] User can register with valid name, email, and password
- [ ] System validates required fields
- [ ] System validates email format
- [ ] System validates password strength
- [ ] System prevents duplicate email registration
- [ ] User receives appropriate error messages for invalid inputs
- [ ] User is redirected to dashboard after successful registration
- [ ] JWT token is stored in localStorage

### Login

- [ ] User can login with valid email and password
- [ ] System validates required fields
- [ ] System displays appropriate error messages for invalid credentials
- [ ] User is redirected to dashboard after successful login
- [ ] JWT token is stored in localStorage

### Logout

- [ ] User can logout from any page
- [ ] JWT token is removed from localStorage
- [ ] User is redirected to home page after logout

### Password Reset

- [ ] User can request password reset with valid email
- [ ] User receives password reset email
- [ ] User can reset password with valid token
- [ ] User can login with new password

## Forecast Generation

### Forecast Form

- [ ] Form displays all required fields (climate zone, environment, area, crops)
- [ ] System validates required fields
- [ ] User can select multiple crops
- [ ] User can select only one climate zone
- [ ] User can select only one environment
- [ ] User can enter growing area
- [ ] System validates growing area (positive number)
- [ ] User can submit form with valid inputs

### Forecast Results

- [ ] System displays forecast results for all selected crops
- [ ] User can switch between crop tabs
- [ ] System displays crop profile information
- [ ] System displays planting calendar
- [ ] System displays production metrics
- [ ] System displays risk factors
- [ ] System displays recommendations
- [ ] Charts are displayed correctly
- [ ] Authenticated users can save forecast
- [ ] Unauthenticated users see login prompt instead of save button

## User Dashboard

### Forecast History

- [ ] User can view saved forecasts
- [ ] User can view forecast details
- [ ] User can delete saved forecasts
- [ ] User can filter forecasts by date
- [ ] User can sort forecasts by different criteria

### User Profile

- [ ] User can view profile information
- [ ] User can update profile information
- [ ] User can change password
- [ ] System validates password change

## API Status

- [ ] API status page displays correct status for all endpoints
- [ ] API status updates in real-time
- [ ] System displays appropriate error messages for API issues

## Responsive Design

- [ ] Application displays correctly on desktop (1920x1080)
- [ ] Application displays correctly on laptop (1366x768)
- [ ] Application displays correctly on tablet (768x1024)
- [ ] Application displays correctly on mobile (375x667)
- [ ] Navigation menu adapts to different screen sizes
- [ ] Forms adapt to different screen sizes
- [ ] Charts adapt to different screen sizes

## Browser Compatibility

- [ ] Application works correctly in Chrome
- [ ] Application works correctly in Firefox
- [ ] Application works correctly in Safari
- [ ] Application works correctly in Edge

## Performance

- [ ] Pages load within 3 seconds
- [ ] Forecast generation completes within 5 seconds
- [ ] Charts render within 2 seconds
- [ ] No visible lag when switching between tabs
- [ ] No visible lag when navigating between pages

## Accessibility

- [ ] All images have alt text
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] All form fields have associated labels
- [ ] All interactive elements are keyboard accessible
- [ ] Screen reader can navigate the application
- [ ] Focus states are visible

## Security

- [ ] JWT tokens expire after the configured time
- [ ] Protected routes require authentication
- [ ] API endpoints validate user permissions
- [ ] Forms are protected against CSRF
- [ ] API is protected against CSRF
- [ ] API is protected against rate limiting
- [ ] Passwords are hashed in the database

## Error Handling

- [ ] Application displays appropriate error messages for API errors
- [ ] Application displays appropriate error messages for network errors
- [ ] Application displays appropriate error messages for validation errors
- [ ] Application displays appropriate error messages for authentication errors
- [ ] Application displays appropriate error messages for authorization errors
- [ ] Application recovers gracefully from errors

## Notes

Use this section to record any additional observations, issues, or feedback during testing.
