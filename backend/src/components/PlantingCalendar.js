import React from 'react';
import '../styles/components/PlantingCalendar.css';

const PlantingCalendar = ({ calendarData }) => {
  // Month abbreviations
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Get suitability class name
  const getSuitabilityClass = (suitability) => {
    switch (suitability) {
      case 'optimal':
        return 'optimal';
      case 'suitable':
        return 'suitable';
      case 'risky':
        return 'risky';
      default:
        return 'not-recommended';
    }
  };
  
  // Get suitability display name
  const getSuitabilityName = (suitability) => {
    switch (suitability) {
      case 'optimal':
        return 'Optimal';
      case 'suitable':
        return 'Suitable';
      case 'risky':
        return 'Risky';
      default:
        return 'Not Recommended';
    }
  };

  return (
    <div className="planting-calendar">
      <div className="calendar-header">
        <h3>Planting Calendar</h3>
        <p className="calendar-description">
          The calendar below shows the best times to plant throughout the year based on your climate zone and growing environment.
        </p>
      </div>
      
      <div className="calendar-container">
        <div className="calendar">
          <div className="calendar-header">
            {months.map(month => (
              <div key={month} className="month">{month}</div>
            ))}
          </div>
          <div className="calendar-body">
            {months.map((month, index) => {
              const monthData = calendarData.find(item => item.monthNumber === index + 1);
              const suitabilityClass = monthData ? getSuitabilityClass(monthData.suitability) : 'not-recommended';
              
              return (
                <div key={month} className="calendar-column">
                  <div className={`calendar-cell ${suitabilityClass}`}>
                    {monthData && monthData.suitabilityScore > 1 && (
                      <span className="suitability-icon">✓</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="legend">
          <div className="legend-item">
            <div className="legend-color optimal"></div>
            <span>Optimal</span>
          </div>
          <div className="legend-item">
            <div className="legend-color suitable"></div>
            <span>Suitable</span>
          </div>
          <div className="legend-item">
            <div className="legend-color risky"></div>
            <span>Risky</span>
          </div>
          <div className="legend-item">
            <div className="legend-color not-recommended"></div>
            <span>Not Recommended</span>
          </div>
        </div>
      </div>
      
      <div className="planting-periods">
        <h4>Recommended Planting Periods</h4>
        
        <div className="period-list">
          {calendarData.some(month => month.suitability === 'optimal') ? (
            <div className="period-item">
              <div className="period-label">Optimal Planting:</div>
              <div className="period-value">
                {summarizePeriods(calendarData.filter(month => month.suitability === 'optimal'))}
              </div>
            </div>
          ) : (
            <div className="period-item">
              <div className="period-label">Optimal Planting:</div>
              <div className="period-value none">No optimal planting periods for your climate.</div>
            </div>
          )}
          
          {calendarData.some(month => month.suitability === 'suitable') && (
            <div className="period-item">
              <div className="period-label">Suitable Planting:</div>
              <div className="period-value">
                {summarizePeriods(calendarData.filter(month => month.suitability === 'suitable'))}
              </div>
            </div>
          )}
          
          {calendarData.some(month => month.suitability === 'risky') && (
            <div className="period-item">
              <div className="period-label">Risky Planting:</div>
              <div className="period-value">
                {summarizePeriods(calendarData.filter(month => month.suitability === 'risky'))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="calendar-notes">
        <h4>Planting Notes</h4>
        <div className="notes-content">
          <p>
            <strong>Optimal periods</strong> offer the highest success rates with ideal growing conditions.
          </p>
          <p>
            <strong>Suitable periods</strong> have good growing conditions but may require some additional care.
          </p>
          <p>
            <strong>Risky periods</strong> can work but have higher failure rates due to temperature extremes or other factors.
          </p>
          <p>
            <strong>Advance planning:</strong> Start seeds indoors 6-8 weeks before the optimal outdoor planting date for stronger transplants.
          </p>
          <p>
            <strong>Succession planting:</strong> For continuous harvests, plant new batches every 2-3 weeks during optimal and suitable periods.
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper function to summarize periods
const summarizePeriods = (monthsArray) => {
  if (!monthsArray || monthsArray.length === 0) {
    return 'None';
  }
  
  // Full month names
  const fullMonths = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Sort months by number
  const sortedMonths = [...monthsArray].sort((a, b) => a.monthNumber - b.monthNumber);
  
  // Find continuous periods
  const periods = [];
  let currentPeriod = {
    start: sortedMonths[0],
    end: sortedMonths[0]
  };
  
  for (let i = 1; i < sortedMonths.length; i++) {
    if (sortedMonths[i].monthNumber === sortedMonths[i-1].monthNumber + 1) {
      // Continuous month, extend current period
      currentPeriod.end = sortedMonths[i];
    } else {
      // Gap detected, save current period and start a new one
      periods.push(currentPeriod);
      currentPeriod = {
        start: sortedMonths[i],
        end: sortedMonths[i]
      };
    }
  }
  
  // Add the last period
  periods.push(currentPeriod);
  
  // Format periods as strings
  return periods.map(period => {
    if (period.start.monthNumber === period.end.monthNumber) {
      // Single month
      return fullMonths[period.start.monthNumber - 1];
    } else {
      // Range of months
      return `${fullMonths[period.start.monthNumber - 1]} to ${fullMonths[period.end.monthNumber - 1]}`;
    }
  }).join(', ');
};

export default PlantingCalendar;
