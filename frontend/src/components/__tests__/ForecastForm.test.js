/**
 * Forecast Form Tests
 * 
 * Tests for the forecast form functionality including:
 * - Form rendering
 * - Form validation
 * - Form submission
 * - Loading states
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import ForecastForm from '../forecast/ForecastForm';

// Mock axios
jest.mock('axios');

// Mock crop and climate data
const mockCrops = [
  { id: 'tomatoes', name: 'Tomatoes', image: '/images/crops/tomato.jpg' },
  { id: 'cucumbers', name: 'Cucumbers', image: '/images/crops/cucumber.jpg' },
  { id: 'bellPeppers', name: 'Bell Peppers', image: '/images/crops/bell-pepper.jpg' }
];

const mockClimateZones = [
  { id: 'mediterranean', name: 'Mediterranean', description: 'Hot, dry summers and mild, rainy winters' },
  { id: 'continental', name: 'Continental', description: 'Hot summers and cold winters' },
  { id: 'tropical', name: 'Tropical', description: 'Hot and humid year-round' }
];

// Mock onSubmit function
const mockOnSubmit = jest.fn();

describe('ForecastForm Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock API responses
    axios.get.mockImplementation((url) => {
      if (url === '/api/forecast/crops') {
        return Promise.resolve({ data: { success: true, data: mockCrops } });
      } else if (url === '/api/forecast/climate-zones') {
        return Promise.resolve({ data: { success: true, data: mockClimateZones } });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });
  
  it('should render the forecast form with all fields', async () => {
    render(<ForecastForm onSubmit={mockOnSubmit} />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByLabelText(/Climate Zone/i)).toBeInTheDocument();
    });
    
    // Check for form elements
    expect(screen.getByLabelText(/Climate Zone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Growing Environment/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Garden Area/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Experience Level/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Crops/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Forecast/i })).toBeInTheDocument();
    
    // Check that crop options are rendered
    expect(screen.getByText(/Tomatoes/i)).toBeInTheDocument();
    expect(screen.getByText(/Cucumbers/i)).toBeInTheDocument();
    expect(screen.getByText(/Bell Peppers/i)).toBeInTheDocument();
    
    // Check that climate zone options are rendered
    expect(screen.getByText(/Mediterranean/i)).toBeInTheDocument();
    expect(screen.getByText(/Continental/i)).toBeInTheDocument();
    expect(screen.getByText(/Tropical/i)).toBeInTheDocument();
  });
  
  it('should handle form submission with valid data', async () => {
    render(<ForecastForm onSubmit={mockOnSubmit} />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByLabelText(/Climate Zone/i)).toBeInTheDocument();
    });
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Climate Zone/i), {
      target: { value: 'mediterranean' }
    });
    
    fireEvent.change(screen.getByLabelText(/Growing Environment/i), {
      target: { value: 'open' }
    });
    
    fireEvent.change(screen.getByLabelText(/Garden Area/i), {
      target: { value: '100' }
    });
    
    fireEvent.change(screen.getByLabelText(/Experience Level/i), {
      target: { value: 'intermediate' }
    });
    
    // Select crops
    fireEvent.click(screen.getByLabelText(/Tomatoes/i));
    fireEvent.click(screen.getByLabelText(/Cucumbers/i));
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Generate Forecast/i }));
    
    // Check that onSubmit was called with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        climate: 'mediterranean',
        environment: 'open',
        area: 100,
        experience: 'intermediate',
        crops: ['tomatoes', 'cucumbers']
      });
    });
  });
  
  it('should validate form input', async () => {
    render(<ForecastForm onSubmit={mockOnSubmit} />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByLabelText(/Climate Zone/i)).toBeInTheDocument();
    });
    
    // Submit without filling out the form
    fireEvent.click(screen.getByRole('button', { name: /Generate Forecast/i }));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/Please select a climate zone/i)).toBeInTheDocument();
      expect(screen.getByText(/Please select a growing environment/i)).toBeInTheDocument();
      expect(screen.getByText(/Please enter a garden area/i)).toBeInTheDocument();
      expect(screen.getByText(/Please select at least one crop/i)).toBeInTheDocument();
    });
    
    // Check that onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  
  it('should validate garden area input', async () => {
    render(<ForecastForm onSubmit={mockOnSubmit} />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByLabelText(/Climate Zone/i)).toBeInTheDocument();
    });
    
    // Fill out the form with invalid area
    fireEvent.change(screen.getByLabelText(/Climate Zone/i), {
      target: { value: 'mediterranean' }
    });
    
    fireEvent.change(screen.getByLabelText(/Growing Environment/i), {
      target: { value: 'open' }
    });
    
    fireEvent.change(screen.getByLabelText(/Garden Area/i), {
      target: { value: '-50' } // Negative area
    });
    
    fireEvent.change(screen.getByLabelText(/Experience Level/i), {
      target: { value: 'intermediate' }
    });
    
    // Select crops
    fireEvent.click(screen.getByLabelText(/Tomatoes/i));
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Generate Forecast/i }));
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/Garden area must be a positive number/i)).toBeInTheDocument();
    });
    
    // Check that onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  
  it('should show loading state during API requests', async () => {
    // Mock slow API responses
    axios.get.mockImplementation((url) => {
      return new Promise(resolve => {
        setTimeout(() => {
          if (url === '/api/forecast/crops') {
            resolve({ data: { success: true, data: mockCrops } });
          } else if (url === '/api/forecast/climate-zones') {
            resolve({ data: { success: true, data: mockClimateZones } });
          }
        }, 100);
      });
    });
    
    render(<ForecastForm onSubmit={mockOnSubmit} />);
    
    // Check for loading indicators
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      expect(screen.getByLabelText(/Climate Zone/i)).toBeInTheDocument();
    });
  });
  
  it('should handle API errors gracefully', async () => {
    // Mock API error
    axios.get.mockRejectedValue(new Error('API Error'));
    
    render(<ForecastForm onSubmit={mockOnSubmit} />);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Error loading form data/i)).toBeInTheDocument();
    });
    
    // Check that form is not rendered
    expect(screen.queryByLabelText(/Climate Zone/i)).not.toBeInTheDocument();
  });
  
  it('should disable submit button during submission', async () => {
    // Mock onSubmit to return a promise that resolves after a delay
    mockOnSubmit.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(resolve, 100);
      });
    });
    
    render(<ForecastForm onSubmit={mockOnSubmit} />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByLabelText(/Climate Zone/i)).toBeInTheDocument();
    });
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Climate Zone/i), {
      target: { value: 'mediterranean' }
    });
    
    fireEvent.change(screen.getByLabelText(/Growing Environment/i), {
      target: { value: 'open' }
    });
    
    fireEvent.change(screen.getByLabelText(/Garden Area/i), {
      target: { value: '100' }
    });
    
    // Select crops
    fireEvent.click(screen.getByLabelText(/Tomatoes/i));
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Generate Forecast/i }));
    
    // Check that button is disabled during submission
    expect(screen.getByRole('button', { name: /Generating.../i })).toBeDisabled();
    
    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Generate Forecast/i })).not.toBeDisabled();
    });
  });
});
