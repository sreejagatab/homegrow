# HomeGrow Forecast Tool - Forecast Feature Testing Script

This document provides a comprehensive testing script for the Forecast Form and Data Visualization components of the HomeGrow Forecast Tool.

## Prerequisites

- HomeGrow Forecast Tool running locally
- Backend server running on port 5001
- Frontend server running on port 3000 or 3001
- MongoDB connected and running
- Test user accounts available:
  - Admin: admin@homegrow.example / admin123
  - User: user@homegrow.example / password123

## Test Environment Setup

1. Start the backend server:
   ```bash
   cd backend
   npm run start
   ```

2. Start the frontend server:
   ```bash
   cd frontend
   npm start
   ```

3. Open the application in a browser at http://localhost:3000 or http://localhost:3001

## Test Cases

### 1. Forecast Form Functionality

#### 1.1 Form Loading

| Test ID | Description | Steps | Expected Result | Status |
|---------|-------------|-------|----------------|--------|
| FL-01 | Form loads correctly | 1. Navigate to homepage<br>2. Observe the forecast form | Form displays with all inputs and labels visible | |
| FL-02 | Form loads climate zones | 1. Navigate to homepage<br>2. Check climate zone dropdown | Dropdown contains all climate zones (Tropical, Subtropical, Mediterranean, etc.) | |
| FL-03 | Form loads crops | 1. Navigate to homepage<br>2. Check crop selection area | All available crops are displayed with images and names | |

#### 1.2 Form Validation

| Test ID | Description | Steps | Expected Result | Status |
|---------|-------------|-------|----------------|--------|
| FV-01 | Climate zone validation | 1. Leave climate zone empty<br>2. Click Generate Forecast | Error message appears indicating climate zone is required | |
| FV-02 | Environment validation | 1. Leave environment empty<br>2. Click Generate Forecast | Error message appears indicating environment is required | |
| FV-03 | Area validation - empty | 1. Leave area empty<br>2. Click Generate Forecast | Error message appears indicating area is required | |
| FV-04 | Area validation - negative | 1. Enter -10 for area<br>2. Click Generate Forecast | Error message appears indicating area must be positive | |
| FV-05 | Area validation - zero | 1. Enter 0 for area<br>2. Click Generate Forecast | Error message appears indicating area must be greater than zero | |
| FV-06 | Area validation - non-numeric | 1. Enter "abc" for area<br>2. Click Generate Forecast | Error message appears indicating area must be a number | |
| FV-07 | Crop selection validation | 1. Deselect all crops<br>2. Click Generate Forecast | Error message appears indicating at least one crop must be selected | |

#### 1.3 Form Submission

| Test ID | Description | Steps | Expected Result | Status |
|---------|-------------|-------|----------------|--------|
| FS-01 | Successful submission | 1. Fill all required fields<br>2. Click Generate Forecast | Loading indicator appears, then forecast results are displayed | |
| FS-02 | Loading state | 1. Fill all required fields<br>2. Click Generate Forecast<br>3. Observe button state | Button shows loading spinner and "Generating Forecast..." text | |
| FS-03 | Error handling | 1. Disconnect from internet<br>2. Fill form and submit<br>3. Reconnect to internet | Error message appears with clear instructions | |

### 2. Data Visualization Components

#### 2.1 Crop Tabs

| Test ID | Description | Steps | Expected Result | Status |
|---------|-------------|-------|----------------|--------|
| CT-01 | Tabs display correctly | 1. Generate a forecast with multiple crops<br>2. Observe the crop tabs | Tabs for each selected crop are displayed | |
| CT-02 | Tab switching | 1. Generate a forecast with multiple crops<br>2. Click on different crop tabs | Content updates to show selected crop's data | |
| CT-03 | Loading state | 1. Generate a forecast<br>2. Click between tabs<br>3. Observe loading state | Brief loading indicator appears when switching tabs | |

#### 2.2 Crop Profile

| Test ID | Description | Steps | Expected Result | Status |
|---------|-------------|-------|----------------|--------|
| CP-01 | Profile content | 1. Generate a forecast<br>2. View the Crop Profile tab | Crop name, scientific name, life cycle, and other details are displayed | |
| CP-02 | Profile formatting | 1. Generate a forecast<br>2. View the Crop Profile tab | Content is well-formatted and readable | |

#### 2.3 Production Metrics

| Test ID | Description | Steps | Expected Result | Status |
|---------|-------------|-------|----------------|--------|
| PM-01 | Metrics content | 1. Generate a forecast<br>2. Click on Production Metrics tab | Yield estimates, harvest timeline, and other metrics are displayed | |
| PM-02 | Charts rendering | 1. Generate a forecast<br>2. Click on Production Metrics tab | Charts are properly rendered and labeled | |
| PM-03 | Area calculation | 1. Generate a forecast with area = 10<br>2. View yield estimates<br>3. Generate a new forecast with area = 20<br>4. View yield estimates | Yield estimates should scale proportionally with area | |

#### 2.4 Risk Factors

| Test ID | Description | Steps | Expected Result | Status |
|---------|-------------|-------|----------------|--------|
| RF-01 | Risk factors content | 1. Generate a forecast<br>2. Click on Risk Factors tab | Risk factors and recommendations are displayed | |
| RF-02 | Risk severity indicators | 1. Generate a forecast<br>2. Click on Risk Factors tab | Risk severity is clearly indicated (High, Medium, Low) | |
| RF-03 | Climate-specific risks | 1. Generate a forecast with Mediterranean climate<br>2. Note the risks<br>3. Generate a new forecast with Continental climate<br>4. Compare risks | Different climate zones should show different risk factors | |

### 3. Cross-Browser Testing

| Test ID | Description | Steps | Expected Result | Status |
|---------|-------------|-------|----------------|--------|
| CB-01 | Chrome compatibility | 1. Open application in Chrome<br>2. Complete a forecast generation flow | All features work correctly | |
| CB-02 | Firefox compatibility | 1. Open application in Firefox<br>2. Complete a forecast generation flow | All features work correctly | |
| CB-03 | Edge compatibility | 1. Open application in Edge<br>2. Complete a forecast generation flow | All features work correctly | |

### 4. Responsive Design Testing

| Test ID | Description | Steps | Expected Result | Status |
|---------|-------------|-------|----------------|--------|
| RD-01 | Desktop layout | 1. Open application on desktop<br>2. Resize window to different widths | Layout adjusts appropriately | |
| RD-02 | Tablet layout | 1. Use device emulation for tablet<br>2. Complete a forecast generation flow | All elements are properly sized and positioned | |
| RD-03 | Mobile layout | 1. Use device emulation for mobile<br>2. Complete a forecast generation flow | All elements are properly sized and positioned | |
| RD-04 | Form controls on mobile | 1. Use device emulation for mobile<br>2. Interact with form controls | Controls are usable on touch devices | |
| RD-05 | Charts on mobile | 1. Generate a forecast on mobile<br>2. View charts in Production Metrics | Charts are readable and properly sized | |

### 5. Integration Testing

| Test ID | Description | Steps | Expected Result | Status |
|---------|-------------|-------|----------------|--------|
| IT-01 | End-to-end forecast flow | 1. Navigate to homepage<br>2. Fill out form completely<br>3. Generate forecast<br>4. View all tabs for each crop | Complete flow works without errors | |
| IT-02 | Authentication integration | 1. Log in as test user<br>2. Generate a forecast<br>3. Save the forecast<br>4. View saved forecasts | Forecast is saved and retrievable | |
| IT-03 | API error handling | 1. Modify API endpoint to return an error<br>2. Submit forecast form<br>3. Observe error handling | Error is displayed clearly to user | |

## Test Execution

For each test case:

1. Execute the steps in the order listed
2. Compare actual results with expected results
3. Mark the test as:
   - PASS: All expected results were observed
   - FAIL: One or more expected results were not observed
   - BLOCKED: Unable to complete the test due to a prerequisite failure
4. For failed tests, document:
   - Actual behavior observed
   - Screenshots or videos if applicable
   - Console errors if applicable
   - Environment details (browser, screen size, etc.)

## Reporting

Compile test results into a summary report including:

1. Total tests executed
2. Pass/fail/blocked counts
3. Critical issues identified
4. Screenshots of any visual defects
5. Recommendations for fixes

## Regression Testing

After implementing fixes for any identified issues:

1. Re-run all failed tests
2. Run a subset of passed tests to ensure no regressions
3. Document the results of regression testing

---

This testing script provides a comprehensive approach to verifying the functionality, usability, and reliability of the HomeGrow Forecast Tool's forecast feature. By systematically executing these tests, we can ensure a high-quality user experience.
