import React from 'react';
import '../styles/components/RiskFactors.css';

const RiskFactors = ({ riskData, recommendations }) => {
  // Get severity class name
  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'high':
        return 'high-severity';
      case 'medium':
        return 'medium-severity';
      case 'low':
        return 'low-severity';
      default:
        return '';
    }
  };

  // Get severity display name
  const getSeverityName = (severity) => {
    switch (severity) {
      case 'high':
        return 'High Risk';
      case 'medium':
        return 'Medium Risk';
      case 'low':
        return 'Low Risk';
      default:
        return 'Unknown Risk';
    }
  };

  return (
    <div className="risk-factors">
      <div className="risk-section">
        <h3>Risk Assessment</h3>
        <p className="section-description">
          The following risks have been identified based on your selected climate zone,
          growing environment, and crop characteristics.
        </p>

        {riskData && riskData.length > 0 ? (
          <div className="risk-list">
            {riskData.map((risk, index) => (
              <div 
                key={`${risk.category}-${index}`} 
                className={`risk-item ${getSeverityClass(risk.severity)}`}
              >
                <div className="risk-header">
                  <h4>{risk.category}</h4>
                  <span className="severity-badge">
                    {getSeverityName(risk.severity)}
                  </span>
                </div>
                <p className="risk-description">{risk.description}</p>
                {risk.mitigation && (
                  <div className="mitigation-tip">
                    <h5>Mitigation Strategy:</h5>
                    <p>{risk.mitigation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">No risk factors identified for this crop.</div>
        )}
      </div>

      <div className="recommendations-section">
        <h3>Recommendations</h3>
        <p className="section-description">
          Based on the identified risks and your growing conditions, here are our
          recommended strategies to maximize success.
        </p>

        {recommendations && recommendations.length > 0 ? (
          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <div key={`${rec.category}-${index}`} className="recommendation-item">
                <h4>{rec.category}</h4>
                <p>{rec.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">No specific recommendations available for this crop.</div>
        )}
      </div>

      <div className="success-factors">
        <h3>Keys to Success</h3>
        <div className="success-tips">
          <div className="success-tip">
            <h4>Monitoring</h4>
            <p>
              Regular monitoring is essential. Check plants at least twice weekly for signs of pests, 
              disease, or stress. Early detection dramatically improves outcomes.
            </p>
          </div>
          
          <div className="success-tip">
            <h4>Prevention</h4>
            <p>
              Prevention is more effective than treatment. Follow recommended spacing, implement crop 
              rotation, and maintain garden hygiene to prevent problems before they start.
            </p>
          </div>
          
          <div className="success-tip">
            <h4>Adaptation</h4>
            <p>
              Be prepared to adapt to changing conditions. Have row covers, shade cloth, and organic 
              treatments on hand to respond quickly to emerging issues.
            </p>
          </div>
          
          <div className="success-tip">
            <h4>Record Keeping</h4>
            <p>
              Keep notes on planting dates, problems encountered, and successful strategies. This 
              information becomes increasingly valuable year after year.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskFactors;
