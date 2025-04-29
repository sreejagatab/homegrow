import React, { useState } from 'react';
import '../styles/components/RiskFactors.css';

/**
 * RiskFactors component displays risk assessment and recommendations
 * @param {Object} props - Component props
 * @param {Array} props.riskData - Risk assessment data
 * @param {Array} props.recommendations - Recommendations data
 * @param {string} props.cropName - Name of the crop
 * @param {string} props.climate - Climate zone
 * @returns {React.ReactNode} RiskFactors component
 */
const RiskFactors = ({ riskData, recommendations, cropName, climate }) => {
  // State for expanded risk items
  const [expandedRisks, setExpandedRisks] = useState([]);

  // Toggle expanded risk
  const toggleRiskExpansion = (index) => {
    if (expandedRisks.includes(index)) {
      setExpandedRisks(expandedRisks.filter(i => i !== index));
    } else {
      setExpandedRisks([...expandedRisks, index]);
    }
  };

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

  // Get severity icon
  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return '⚠️';
      case 'medium':
        return '⚠';
      case 'low':
        return '✓';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="risk-factors">
      <div className="risk-section">
        <h3>{cropName ? `${cropName} Risk Assessment` : 'Risk Assessment'}</h3>
        <p className="section-description">
          The following risks have been identified based on your selected climate zone,
          growing environment, and crop characteristics.
          {climate && <span className="risk-context"> Showing risks for <strong>{climate}</strong> climate zone.</span>}
        </p>

        {riskData && riskData.length > 0 ? (
          <div className="risk-list">
            {riskData.map((risk, index) => {
              const isExpanded = expandedRisks.includes(index);
              return (
                <div
                  key={`${risk.category}-${index}`}
                  className={`risk-item ${getSeverityClass(risk.severity)} ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => toggleRiskExpansion(index)}
                >
                  <div className="risk-header">
                    <div className="risk-title">
                      <span className="severity-icon">{getSeverityIcon(risk.severity)}</span>
                      <h4>{risk.category}</h4>
                    </div>
                    <div className="risk-controls">
                      <span className="severity-badge">
                        {getSeverityName(risk.severity)}
                      </span>
                      <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
                    </div>
                  </div>

                  <div className="risk-content">
                    <p className="risk-description">{risk.description}</p>
                    {risk.mitigation && (
                      <div className="mitigation-tip">
                        <div className="tip-header">
                          <span className="tip-icon">💡</span>
                          <h5>Mitigation Strategy:</h5>
                        </div>
                        <p>{risk.mitigation}</p>
                      </div>
                    )}

                    {risk.impact && (
                      <div className="risk-impact">
                        <h5>Potential Impact:</h5>
                        <p>{risk.impact}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-data">No risk factors identified for this crop.</div>
        )}
      </div>

      <div className="recommendations-section">
        <h3>Personalized Recommendations</h3>
        <p className="section-description">
          Based on the identified risks and your growing conditions, here are our
          recommended strategies to maximize success.
        </p>

        {recommendations && recommendations.length > 0 ? (
          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <div key={`${rec.category}-${index}`} className="recommendation-item">
                <div className="recommendation-header">
                  <span className="recommendation-icon">✅</span>
                  <h4>{rec.category}</h4>
                </div>
                <p>{rec.text}</p>
                {rec.benefits && (
                  <div className="recommendation-benefits">
                    <h5>Benefits:</h5>
                    <ul>
                      {rec.benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}
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
            <div className="tip-header">
              <span className="tip-icon">👁️</span>
              <h4>Monitoring</h4>
            </div>
            <p>
              Regular monitoring is essential. Check plants at least twice weekly for signs of pests,
              disease, or stress. Early detection dramatically improves outcomes.
            </p>
            <div className="tip-action">
              <span className="action-label">Recommended Action:</span>
              <span className="action-text">Set calendar reminders for regular plant checks</span>
            </div>
          </div>

          <div className="success-tip">
            <div className="tip-header">
              <span className="tip-icon">🛡️</span>
              <h4>Prevention</h4>
            </div>
            <p>
              Prevention is more effective than treatment. Follow recommended spacing, implement crop
              rotation, and maintain garden hygiene to prevent problems before they start.
            </p>
            <div className="tip-action">
              <span className="action-label">Recommended Action:</span>
              <span className="action-text">Create a crop rotation plan for next season</span>
            </div>
          </div>

          <div className="success-tip">
            <div className="tip-header">
              <span className="tip-icon">🔄</span>
              <h4>Adaptation</h4>
            </div>
            <p>
              Be prepared to adapt to changing conditions. Have row covers, shade cloth, and organic
              treatments on hand to respond quickly to emerging issues.
            </p>
            <div className="tip-action">
              <span className="action-label">Recommended Action:</span>
              <span className="action-text">Prepare an emergency kit with essential supplies</span>
            </div>
          </div>

          <div className="success-tip">
            <div className="tip-header">
              <span className="tip-icon">📝</span>
              <h4>Record Keeping</h4>
            </div>
            <p>
              Keep notes on planting dates, problems encountered, and successful strategies. This
              information becomes increasingly valuable year after year.
            </p>
            <div className="tip-action">
              <span className="action-label">Recommended Action:</span>
              <span className="action-text">Start a garden journal or use a garden tracking app</span>
            </div>
          </div>
        </div>
      </div>

      <div className="risk-disclaimer">
        <p>
          <strong>Note:</strong> This risk assessment is based on general growing conditions and may vary based on specific local factors.
          Always consult with local agricultural experts for personalized advice.
        </p>
      </div>
    </div>
  );
};

export default RiskFactors;
