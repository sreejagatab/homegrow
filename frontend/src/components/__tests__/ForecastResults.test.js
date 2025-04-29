/**
 * Forecast Results Tests
 * 
 * Tests for the forecast results functionality including:
 * - Results rendering
 * - Chart display
 * - Tab navigation
 * - Saving forecasts
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForecastResults from '../forecast/ForecastResults';
import AuthContext from '../../context/AuthContext';

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Line Chart</div>,
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>
}));

// Mock AuthContext
const mockAuthContext = {
  isAuthenticated: true,
  user: { id: 'user123', name: 'Test User' },
  loading: false
};

// Mock forecast data
const mockForecastData = {
  params: {
    climate: 'mediterranean',
    environment: 'open',
    area: 100,
    crops: ['tomatoes', 'cucumbers']
  },
  results: {
    tomatoes: {
      cropProfile: {
        name: 'Tomatoes',
        scientificName: 'Solanum lycopersicum',
        lifeCycle: 'Annual',
        growthPattern: 'Vine',
        maintenanceLevel: 'Medium',
        keyRequirements: ['Full sun', 'Regular watering', 'Support for vines'],
        image: '/images/crops/tomato.jpg'
      },
      plantingCalendar: {
        seedStartDate: '2023-03-15',
        transplantDate: '2023-04-30',
        harvestStartDate: '2023-07-01',
        harvestEndDate: '2023-08-30',
        totalGrowingDays: 75
      },
      productionMetrics: {
        plantsPerSqMeter: 4,
        totalPlants: 400,
        totalYield: { min: 300, max: 700 },
        yieldPerPlant: { min: 0.75, max: 1.75 }
      },
      riskFactors: [
        {
          category: 'Disease',
          name: 'Late Blight',
          likelihood: 'Medium',
          impact: 'Severe',
          mitigation: 'Use resistant varieties and ensure good air circulation.'
        },
        {
          category: 'Pest',
          name: 'Tomato Hornworm',
          likelihood: 'Medium',
          impact: 'Moderate',
          mitigation: 'Inspect plants regularly and remove hornworms by hand.'
        }
      ],
      recommendations: [
        'Start seeds indoors 6-8 weeks before last frost date.',
        'Provide support for vines using stakes or cages.',
        'Water consistently to prevent blossom end rot.',
        'Mulch to retain moisture and prevent soil-borne diseases.'
      ]
    },
    cucumbers: {
      cropProfile: {
        name: 'Cucumbers',
        scientificName: 'Cucumis sativus',
        lifeCycle: 'Annual',
        growthPattern: 'Vine',
        maintenanceLevel: 'Low',
        keyRequirements: ['Full sun', 'Consistent moisture', 'Warm soil'],
        image: '/images/crops/cucumber.jpg'
      },
      plantingCalendar: {
        seedStartDate: '2023-04-15',
        transplantDate: '2023-05-15',
        harvestStartDate: '2023-07-01',
        harvestEndDate: '2023-09-15',
        totalGrowingDays: 60
      },
      productionMetrics: {
        plantsPerSqMeter: 2,
        totalPlants: 200,
        totalYield: { min: 400, max: 800 },
        yieldPerPlant: { min: 2, max: 4 }
      },
      riskFactors: [
        {
          category: 'Disease',
          name: 'Powdery Mildew',
          likelihood: 'High',
          impact: 'Moderate',
          mitigation: 'Provide good air circulation and avoid overhead watering.'
        }
      ],
      recommendations: [
        'Plant in warm soil, at least 70°F (21°C).',
        'Provide a trellis for vining varieties to save space.',
        'Harvest regularly to encourage continued production.',
        'Keep soil consistently moist but not waterlogged.'
      ]
    }
  }
};

// Mock onSave function
const mockOnSave = jest.fn();

// Render with AuthContext
const renderWithAuthContext = (ui, contextValue = mockAuthContext) => {
  return render(
    <AuthContext.Provider value={contextValue}>
      {ui}
    </AuthContext.Provider>
  );
};

describe('ForecastResults Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should render forecast results with tabs for each crop', () => {
    renderWithAuthContext(
      <ForecastResults forecastData={mockForecastData} onSave={mockOnSave} />
    );
    
    // Check for crop tabs
    expect(screen.getByText(/Tomatoes/i)).toBeInTheDocument();
    expect(screen.getByText(/Cucumbers/i)).toBeInTheDocument();
    
    // Check for sections in the first tab (Tomatoes)
    expect(screen.getByText(/Crop Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Planting Calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/Production Metrics/i)).toBeInTheDocument();
    expect(screen.getByText(/Risk Factors/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommendations/i)).toBeInTheDocument();
    
    // Check for specific data
    expect(screen.getByText(/Solanum lycopersicum/i)).toBeInTheDocument();
    expect(screen.getByText(/Annual/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium/i)).toBeInTheDocument();
    expect(screen.getByText(/Full sun/i)).toBeInTheDocument();
    
    // Check for charts
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
  
  it('should switch between crop tabs', () => {
    renderWithAuthContext(
      <ForecastResults forecastData={mockForecastData} onSave={mockOnSave} />
    );
    
    // Initially, Tomatoes tab should be active
    expect(screen.getByText(/Solanum lycopersicum/i)).toBeInTheDocument();
    expect(screen.queryByText(/Cucumis sativus/i)).not.toBeInTheDocument();
    
    // Click on Cucumbers tab
    fireEvent.click(screen.getByText(/Cucumbers/i));
    
    // Now Cucumbers tab should be active
    expect(screen.queryByText(/Solanum lycopersicum/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Cucumis sativus/i)).toBeInTheDocument();
    expect(screen.getByText(/Warm soil/i)).toBeInTheDocument();
    expect(screen.getByText(/Powdery Mildew/i)).toBeInTheDocument();
    
    // Click back on Tomatoes tab
    fireEvent.click(screen.getByText(/Tomatoes/i));
    
    // Now Tomatoes tab should be active again
    expect(screen.getByText(/Solanum lycopersicum/i)).toBeInTheDocument();
    expect(screen.queryByText(/Cucumis sativus/i)).not.toBeInTheDocument();
  });
  
  it('should display save button when user is authenticated', () => {
    renderWithAuthContext(
      <ForecastResults forecastData={mockForecastData} onSave={mockOnSave} />
    );
    
    // Check for save button
    expect(screen.getByText(/Save Forecast/i)).toBeInTheDocument();
  });
  
  it('should not display save button when user is not authenticated', () => {
    // Mock unauthenticated context
    const unauthenticatedContext = {
      ...mockAuthContext,
      isAuthenticated: false,
      user: null
    };
    
    renderWithAuthContext(
      <ForecastResults forecastData={mockForecastData} onSave={mockOnSave} />,
      unauthenticatedContext
    );
    
    // Check that save button is not present
    expect(screen.queryByText(/Save Forecast/i)).not.toBeInTheDocument();
    
    // Check for login message
    expect(screen.getByText(/Log in to save this forecast/i)).toBeInTheDocument();
  });
  
  it('should call onSave when save button is clicked', () => {
    renderWithAuthContext(
      <ForecastResults forecastData={mockForecastData} onSave={mockOnSave} />
    );
    
    // Click save button
    fireEvent.click(screen.getByText(/Save Forecast/i));
    
    // Check that onSave was called with the forecast data
    expect(mockOnSave).toHaveBeenCalledWith(mockForecastData);
  });
  
  it('should display loading state during save', async () => {
    // Mock onSave to return a promise that resolves after a delay
    mockOnSave.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(resolve, 100);
      });
    });
    
    renderWithAuthContext(
      <ForecastResults forecastData={mockForecastData} onSave={mockOnSave} />
    );
    
    // Click save button
    fireEvent.click(screen.getByText(/Save Forecast/i));
    
    // Check that button shows saving state
    expect(screen.getByText(/Saving.../i)).toBeInTheDocument();
    
    // Wait for save to complete
    await waitFor(() => {
      expect(screen.getByText(/Save Forecast/i)).toBeInTheDocument();
      expect(screen.queryByText(/Saving.../i)).not.toBeInTheDocument();
    });
  });
  
  it('should display success message after saving', async () => {
    // Mock onSave to return a resolved promise
    mockOnSave.mockResolvedValue({ success: true });
    
    renderWithAuthContext(
      <ForecastResults forecastData={mockForecastData} onSave={mockOnSave} />
    );
    
    // Click save button
    fireEvent.click(screen.getByText(/Save Forecast/i));
    
    // Wait for save to complete
    await waitFor(() => {
      expect(screen.getByText(/Forecast saved successfully/i)).toBeInTheDocument();
    });
  });
  
  it('should display error message if save fails', async () => {
    // Mock onSave to return a rejected promise
    mockOnSave.mockRejectedValue(new Error('Save failed'));
    
    renderWithAuthContext(
      <ForecastResults forecastData={mockForecastData} onSave={mockOnSave} />
    );
    
    // Click save button
    fireEvent.click(screen.getByText(/Save Forecast/i));
    
    // Wait for save to fail
    await waitFor(() => {
      expect(screen.getByText(/Error saving forecast/i)).toBeInTheDocument();
    });
  });
});
