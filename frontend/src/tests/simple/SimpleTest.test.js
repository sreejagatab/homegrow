/**
 * Simple Test
 * 
 * This is a simple test file that doesn't use MSW.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Simple Test', () => {
  it('should pass', () => {
    // Render a simple component
    render(<div data-testid="test">Test</div>);
    
    // Check that it renders correctly
    expect(screen.getByTestId('test')).toHaveTextContent('Test');
  });
});
