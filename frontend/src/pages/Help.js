import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/Help.css';

const Help = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [activeFaq, setActiveFaq] = useState(null);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    // Reset active FAQ when changing categories
    setActiveFaq(null);
  };

  const handleFaqClick = (faqId) => {
    setActiveFaq(activeFaq === faqId ? null : faqId);
  };

  return (
    <div className="help-container">
      <div className="help-header">
        <h1>Help & Support</h1>
        <p className="help-description">
          Find answers to common questions and learn how to get the most out of the HomeGrow Forecast Tool.
        </p>
      </div>

      <div className="help-content">
        <div className="help-sidebar">
          <h3>Categories</h3>
          <ul className="category-list">
            <li 
              className={activeCategory === 'getting-started' ? 'active' : ''}
              onClick={() => handleCategoryClick('getting-started')}
            >
              Getting Started
            </li>
            <li 
              className={activeCategory === 'using-forecasts' ? 'active' : ''}
              onClick={() => handleCategoryClick('using-forecasts')}
            >
              Using Forecasts
            </li>
            <li 
              className={activeCategory === 'crop-data' ? 'active' : ''}
              onClick={() => handleCategoryClick('crop-data')}
            >
              Crop Information
            </li>
            <li 
              className={activeCategory === 'climate-zones' ? 'active' : ''}
              onClick={() => handleCategoryClick('climate-zones')}
            >
              Climate Zones
            </li>
            <li 
              className={activeCategory === 'account' ? 'active' : ''}
              onClick={() => handleCategoryClick('account')}
            >
              Account & Settings
            </li>
            <li 
              className={activeCategory === 'troubleshooting' ? 'active' : ''}
              onClick={() => handleCategoryClick('troubleshooting')}
            >
              Troubleshooting
            </li>
          </ul>

          <div className="contact-support">
            <h3>Need More Help?</h3>
            <p>Can't find what you're looking for? Contact our support team.</p>
            <Link to="/contact" className="contact-button">Contact Support</Link>
          </div>
        </div>

        <div className="help-main">
          {activeCategory === 'getting-started' && (
            <div className="help-section">
              <h2>Getting Started with HomeGrow</h2>
              
              <div className="help-intro">
                <p>
                  Welcome to HomeGrow Forecast Tool! This guide will help you understand how to use our 
                  platform to optimize your vegetable garden planning and maximize your harvests.
                </p>
              </div>
              
              <div className="faq-list">
                <div 
                  className={`faq-item ${activeFaq === 'gs1' ? 'active' : ''}`}
                  onClick={() => handleFaqClick('gs1')}
                >
                  <div className="faq-question">
                    <h3>How do I create my first forecast?</h3>
                    <span className="faq-icon">{activeFaq === 'gs1' ? '−' : '+'}</span>
                  </div>
                  {activeFaq === 'gs1' && (
                    <div className="faq-answer">
                      <p>Creating your first forecast is simple:</p>
                      <ol>
                        <li>From the homepage, click on "Create Forecast" or navigate to the Forecast page</li>
                        <li>Select your country and region to set your location</li>
                        <li>Choose your climate zone (or let us detect it based on your region)</li>
                        <li>Select your growing environment (open field, greenhouse, etc.)</li>
                        <li>Enter your growing area in square meters</li>
                        <li>Select the crops you want to grow</li>
                        <li>Click "Generate Forecast" to see your personalized growing plan</li>
                      </ol>
                      <p>Your forecast will include planting calendars, expected yields, and risk assessments for each crop.</p>
                    </div>
                  )}
                </div>
                
                <div 
                  className={`faq-item ${activeFaq === 'gs2' ? 'active' : ''}`}
                  onClick={() => handleFaqClick('gs2')}
                >
                  <div className="faq-question">
                    <h3>What information do I need to provide for accurate forecasts?</h3>
                    <span className="faq-icon">{activeFaq === 'gs2' ? '−' : '+'}</span>
                  </div>
                  {activeFaq === 'gs2' && (
                    <div className="faq-answer">
                      <p>For the most accurate forecasts, we recommend providing:</p>
                      <ul>
                        <li><strong>Location details</strong>: Your country and specific region</li>
                        <li><strong>Growing environment</strong>: Whether you're growing in an open field, protected environment (like a greenhouse), or climate-controlled space</li>
                        <li><strong>Growing area</strong>: The approximate square meters you plan to use for each crop</li>
                        <li><strong>Experience level</strong> (optional): Beginner, intermediate, or advanced</li>
                      </ul>
                      <p>The more specific information you provide, the more tailored your forecast will be.</p>
                    </div>
                  )}
                </div>
                
                <div 
                  className={`faq-item ${activeFaq === 'gs3' ? 'active' : ''}`}
                  onClick={() => handleFaqClick('gs3')}
                >
                  <div className="faq-question">
                    <h3>How do I determine my climate zone?</h3>
                    <span className="faq-icon">{activeFaq === 'gs3' ? '−' : '+'}</span>
                  </div>
                  {activeFaq === 'gs3' && (
                    <div className="faq-answer">
                      <p>You can determine your climate zone in several ways:</p>
                      <ul>
                        <li>Use our automatic detection based on your region selection</li>
                        <li>Visit our <Link to="/climate-zones">Climate Zones</Link> page to view detailed descriptions and a map</li>
                        <li>Select the zone that best matches your local conditions:
                          <ul>
                            <li>Tropical: Year-round warm temperatures with wet and dry seasons</li>
                            <li>Subtropical: Hot summers, mild winters, and moderate rainfall</li>
                            <li>Mediterranean: Hot, dry summers and mild, wet winters</li>
                            <li>Continental: Four distinct seasons with cold winters and warm summers</li>
                            <li>Temperate: Moderate temperatures year-round with no extreme heat or cold</li>
                            <li>Oceanic: Cool summers, mild winters, and year-round rainfall</li>
                            <li>Arid: Very dry with hot days and cool nights</li>
                            <li>Semiarid: Limited rainfall with hot summers and cold winters</li>
                          </ul>
                        </li>
                      </ul>
                      <p>If you're still unsure, select the closest match and adjust based on your local knowledge.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'using-forecasts' && (
            <div className="help-section">
              <h2>Using Your Forecasts</h2>
              
              <div className="help-intro">
                <p>
                  Learn how to interpret and apply the forecast data to maximize your garden's productivity.
                </p>
              </div>
              
              <div className="faq-list">
                <div 
                  className={`faq-item ${activeFaq === 'uf1' ? 'active' : ''}`}
                  onClick={() => handleFaqClick('uf1')}
                >
                  <div className="faq-question">
                    <h3>How do I read the planting calendar?</h3>
                    <span className="faq-icon">{activeFaq === 'uf1' ? '−' : '+'}</span>
                  </div>
                  {activeFaq === 'uf1' && (
                    <div className="faq-answer">
                      <p>The planting calendar uses color coding to show the best times to plant throughout the year:</p>
                      <ul>
                        <li><strong style={{color: 'green'}}>Green (Optimal)</strong>: The best time to plant with highest success rates</li>
                        <li><strong style={{color: 'orange'}}>Yellow (Suitable)</strong>: Good conditions but may require additional care</li>
                        <li><strong style={{color: 'orange'}}>Orange (Risky)</strong>: Possible to grow but with higher risk of problems</li>
                        <li><strong style={{color: 'gray'}}>Gray (Not Recommended)</strong>: Avoid planting during these periods</li>
                      </ul>
                      <p>The calendar shows months from January to December, and recommendations are specific to your climate zone and growing environment.</p>
                    </div>
                  )}
                </div>
                
                <div 
                  className={`faq-item ${activeFaq === 'uf2' ? 'active' : ''}`}
                  onClick={() => handleFaqClick('uf2')}
                >
                  <div className="faq-question">
                    <h3>What do the production metrics mean?</h3>
                    <span className="faq-icon">{activeFaq === 'uf2' ? '−' : '+'}</span>
                  </div>
                  {activeFaq === 'uf2' && (
                    <div className="faq-answer">
                      <p>Production metrics provide estimates for your harvest:</p>
                      <ul>
                        <li><strong>Expected Yield</strong>: The estimated harvest weight based on your growing area</li>
                        <li><strong>Time to First Harvest</strong>: Days from planting until you can begin harvesting</li>
                        <li><strong>Harvest Duration</strong>: How many weeks you can expect to harvest from the crop</li>
                        <li><strong>Plants per Area</strong>: Recommended number of plants for your space</li>
                        <li><strong>Yield per Plant</strong>: Average production per plant</li>
                      </ul>
                      <p>These metrics are adjusted based on your climate zone, growing environment, and local conditions.</p>
                    </div>
                  )}
                </div>
                
                <div 
                  className={`faq-item ${activeFaq === 'uf3' ? 'active' : ''}`}
                  onClick={() => handleFaqClick('uf3')}
                >
                  <div className="faq-question">
                    <h3>How should I use the risk assessment information?</h3>
                    <span className="faq-icon">{activeFaq === 'uf3' ? '−' : '+'}</span>
                  </div>
                  {activeFaq === 'uf3' && (
                    <div className="faq-answer">
                      <p>The risk assessment helps you prepare for potential challenges:</p>
                      <ul>
                        <li>Each risk factor is rated by severity (low, medium, high)</li>
                        <li>Risk categories include disease pressure, pest challenges, temperature extremes, and more</li>
                        <li>Each risk includes specific mitigation strategies</li>
                      </ul>
                      <p>Use this information to:</p>
                      <ul>
                        <li>Prepare preventative measures before planting</li>
                        <li>Stock necessary supplies (like row covers or organic pest controls)</li>
                        <li>Adjust planting locations or timing to minimize risks</li>
                        <li>Monitor your plants for early signs of the identified issues</li>
                      </ul>
                      <p>Being proactive about potential risks significantly increases your chances of a successful harvest.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Additional category content would be added here */}
          
          {activeCategory === 'crop-data' && (
            <div className="help-section">
              <h2>Crop Information</h2>
              <div className="help-intro">
                <p>
                  Learn about the crop data in our system and how to use it for better growing results.
                </p>
              </div>
              <div className="faq-list">
                {/* Crop data FAQs would go here */}
                <p>This section is under development. Please check back soon for more information about crop data.</p>
              </div>
            </div>
          )}
          
          {activeCategory === 'climate-zones' && (
            <div className="help-section">
              <h2>Climate Zones</h2>
              <div className="help-intro">
                <p>
                  Understanding climate zones and how they affect your growing conditions.
                </p>
              </div>
              <div className="faq-list">
                {/* Climate zones FAQs would go here */}
                <p>This section is under development. Please check back soon for more information about climate zones.</p>
              </div>
            </div>
          )}
          
          {activeCategory === 'account' && (
            <div className="help-section">
              <h2>Account & Settings</h2>
              <div className="help-intro">
                <p>
                  Manage your account, saved forecasts, and application settings.
                </p>
              </div>
              <div className="faq-list">
                {/* Account FAQs would go here */}
                <p>This section is under development. Please check back soon for more information about account management.</p>
              </div>
            </div>
          )}
          
          {activeCategory === 'troubleshooting' && (
            <div className="help-section">
              <h2>Troubleshooting</h2>
              <div className="help-intro">
                <p>
                  Solutions for common issues and technical problems.
                </p>
              </div>
              <div className="faq-list">
                {/* Troubleshooting FAQs would go here */}
                <p>This section is under development. Please check back soon for troubleshooting guidance.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;
