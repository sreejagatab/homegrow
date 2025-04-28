import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import App from '../../App';
import { climateZonesMock, cropsMock, forecastResultMock } from '../mocks/data';

// Create axios mock
const mockAxios = new MockAdapter(axios);

describe('Forecast Flow Integration Tests', () => {
  beforeAll(() => {
    // Setup API mocks
    mockAxios.onGet('/api/forecast/crops').reply(200, { 
      success: true, 
      data: cropsMock 
    });
    
    mockAxios.onGet('/api/forecast/climate-zones').reply(200, { 
      success: true, 
      data: climateZonesMock 
    });
    
    mockAxios.onGet('/api/users/current').reply(401, { 
      success: false, 
      message: 'Not authenticated' 
    });
    
    mockAxios.onPost('/api/forecast').reply(200, { 
      success: true, 
      data: forecastResultMock 
    });
  });
  
  afterAll(() => {
    mockAxios.restore();
  });
  
  test('complete forecast generation flow', async () => {
    // Render app
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading HomeGrow Forecast Tool...')).not.toBeInTheDocument();
    });
    
    // Check that the home page is displayed
    expect(screen.getByText('HomeGrow Forecast Tool')).toBeInTheDocument();
    expect(screen.getByText('Optimize your home vegetable garden with data-driven planting forecasts')).toBeInTheDocument();
    
    // Fill in forecast form
    // Select climate zone
    const climateSelect = screen.getByLabelText('Climate Zone');
    userEvent.selectOptions(climateSelect, 'mediterranean');
    
    // Select environment
    const environmentSelect = screen.getByLabelText('Cultivation Environment');
    userEvent.selectOptions(environmentSelect, 'protected');
    
    // Enter area
    const areaInput = screen.getByLabelText('Growing Area (m²)');
    userEvent.clear(areaInput);
    userEvent.type(areaInput, '15');
    
    // Ensure default crops are selected (they should be by default)
    const tomatoCrop = screen.getByText('Tomatoes').closest('.crop-option');
    const cucumberCrop = screen.getByText('Cucumbers').closest('.crop-option');
    expect(tomatoCrop).toHaveClass('selected');
    expect(cucumberCrop).toHaveClass('selected');
    
    // Generate forecast
    const generateButton = screen.getByText('Generate Forecast');
    userEvent.click(generateButton);
    
    // Wait for forecast results to load
    await waitFor(() => {
      expect(screen.getByText('Your Crop Forecast')).toBeInTheDocument();
    });
    
    // Check that forecast results are displayed
    expect(screen.getByText('Start New Forecast')).toBeInTheDocument();
    
    // Check crop tabs are present
    expect(screen.getByText('Tomatoes')).toBeInTheDocument();
    expect(screen.getByText('Cucumbers')).toBeInTheDocument();
    
    // Check initial crop profile is shown
    expect(screen.getByText('Crop Profile')).toBeInTheDocument();
    
    // Click on Planting Calendar tab
    userEvent.click(screen.getByText('Planting Calendar'));
    
    // Verify planting calendar is shown
    await waitFor(() => {
      expect(screen.getByText('Recommended Planting Periods')).toBeInTheDocument();
    });
    
    // Click on Production Metrics tab
    userEvent.click(screen.getByText('Production Metrics'));
    
    // Verify production metrics are shown
    await waitFor(() => {
      expect(screen.getByText('Production Overview')).toBeInTheDocument();
      expect(screen.getByText('Expected Total Yield')).toBeInTheDocument();
    });
    
    // Click on Risk Factors tab
    userEvent.click(screen.getByText('Risk Factors'));
    
    // Verify risk factors are shown
    await waitFor(() => {
      expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
      expect(screen.getByText('Recommendations')).toBeInTheDocument();
    });
    
    // Click on Start New Forecast to reset
    userEvent.click(screen.getByText('Start New Forecast'));
    
    // Verify we're back to the form
    await waitFor(() => {
      expect(screen.getByText('Forecast Parameters')).toBeInTheDocument();
    });
  });
});