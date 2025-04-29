import React, { useState, useEffect } from 'react';
import { runAllApiTests, formatApiTestResults } from '../utils/testApiConnection';
import '../styles/components/ApiTester.css';

/**
 * ApiTester Component
 * 
 * This component provides a UI for testing the connection between the frontend
 * and backend API. It displays the results of various API tests and allows
 * the user to run the tests manually.
 */
const ApiTester = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Run tests on component mount
  useEffect(() => {
    runTests();
  }, []);

  // Set up auto-refresh if enabled
  useEffect(() => {
    let intervalId;
    
    if (autoRefresh) {
      intervalId = setInterval(() => {
        runTests();
      }, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh]);

  // Run all API tests
  const runTests = async () => {
    setLoading(true);
    
    try {
      const results = await runAllApiTests();
      setTestResults(results);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error running API tests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle expanded view
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  // Render status indicator
  const renderStatusIndicator = (success) => {
    return (
      <span className={`status-indicator ${success ? 'success' : 'failure'}`}>
        {success ? '✓' : '✗'}
      </span>
    );
  };

  // Render test results
  const renderTestResults = () => {
    if (!testResults) return null;
    
    return (
      <div className="test-results">
        <div className="test-summary">
          <h3>API Test Summary</h3>
          <div className="overall-status">
            <span>Overall Status:</span>
            {renderStatusIndicator(testResults.overallSuccess)}
          </div>
          {lastRefresh && (
            <div className="last-refresh">
              Last refreshed: {lastRefresh.toLocaleTimeString()}
            </div>
          )}
        </div>
        
        <div className="test-details">
          {Object.entries(testResults)
            .filter(([key]) => key !== 'timestamp' && key !== 'overallSuccess')
            .map(([key, result]) => (
              <div key={key} className="test-item">
                <div className="test-header">
                  <span className="test-name">{key.toUpperCase()} API</span>
                  {renderStatusIndicator(result.success)}
                </div>
                
                {expanded && (
                  <div className="test-detail-content">
                    <div className="detail-row">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">{result.status || 'N/A'}</span>
                    </div>
                    
                    {result.responseTime && (
                      <div className="detail-row">
                        <span className="detail-label">Response Time:</span>
                        <span className="detail-value">{result.responseTime}ms</span>
                      </div>
                    )}
                    
                    {result.itemCount !== undefined && (
                      <div className="detail-row">
                        <span className="detail-label">Items:</span>
                        <span className="detail-value">{result.itemCount}</span>
                      </div>
                    )}
                    
                    {result.error && (
                      <div className="detail-row error">
                        <span className="detail-label">Error:</span>
                        <span className="detail-value">{result.error}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="api-tester-container">
      <div className="api-tester-header">
        <h2>API Connection Tester</h2>
        <div className="header-actions">
          <button 
            className="refresh-button"
            onClick={runTests}
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Run Tests'}
          </button>
          
          <label className="auto-refresh-label">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={toggleAutoRefresh}
            />
            Auto-refresh
          </label>
        </div>
      </div>
      
      {loading && !testResults && (
        <div className="loading-indicator">
          Running API tests...
        </div>
      )}
      
      {testResults && (
        <>
          {renderTestResults()}
          
          <div className="api-tester-actions">
            <button 
              className="toggle-button"
              onClick={toggleExpanded}
            >
              {expanded ? 'Hide Details' : 'Show Details'}
            </button>
            
            {expanded && (
              <div className="raw-results">
                <h4>Raw Test Results</h4>
                <pre>{formatApiTestResults(testResults)}</pre>
              </div>
            )}
          </div>
        </>
      )}
      
      <div className="api-tester-footer">
        <p>
          This tool tests the connection between the frontend and backend API.
          It helps diagnose API connection issues and verify that the frontend
          can communicate with the backend.
        </p>
      </div>
    </div>
  );
};

export default ApiTester;
