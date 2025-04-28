import React from 'react';
import '../styles/components/CropProfile.css';

const CropProfile = ({ cropData }) => {
  if (!cropData) {
    return <div className="no-crop-data">Crop data not available</div>;
  }

  return (
    <div className="crop-profile">
      <div className="profile-header">
        <div className="crop-info">
          <h3>{cropData.name}</h3>
          <p className="scientific-name">{cropData.scientificName}</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h4>Growth Characteristics</h4>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Life Cycle</div>
              <div className="info-value">{cropData.lifeCycle}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Growth Pattern</div>
              <div className="info-value">{cropData.growthPattern}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Expected Yield</div>
              <div className="info-value">
                {cropData.yieldPerSquareMeter.min}-{cropData.yieldPerSquareMeter.max} kg/m²
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-section">
          <h4>Growing Requirements</h4>
          <div className="requirements-content">
            <p>{cropData.keyRequirements}</p>
            <div className="requirements-icons">
              {getRequirementsIcons(cropData)}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h4>Cultivation Tips</h4>
          <div className="cultivation-tips">
            {getCultivationTips(cropData.name.toLowerCase())}
          </div>
        </div>

        <div className="profile-section">
          <h4>Nutritional Value</h4>
          <div className="nutritional-value">
            {getNutritionalInfo(cropData.name.toLowerCase())}
          </div>
        </div>

        <div className="profile-section">
          <h4>Common Varieties</h4>
          <div className="varieties-content">
            {getCommonVarieties(cropData.name.toLowerCase())}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to generate requirement icons based on crop needs
const getRequirementsIcons = (cropData) => {
  const requirements = [];
  
  // Sun requirement
  if (cropData.keyRequirements.toLowerCase().includes('full sun')) {
    requirements.push(
      <div key="sun" className="req-icon sun-req">
        <i className="icon-sun"></i>
        <span>Full Sun</span>
      </div>
    );
  } else if (cropData.keyRequirements.toLowerCase().includes('partial sun') || 
             cropData.keyRequirements.toLowerCase().includes('partial shade')) {
    requirements.push(
      <div key="sun" className="req-icon sun-req">
        <i className="icon-partial-sun"></i>
        <span>Partial Sun</span>
      </div>
    );
  }
  
  // Water requirement
  if (cropData.keyRequirements.toLowerCase().includes('consistent moisture')) {
    requirements.push(
      <div key="water" className="req-icon water-req">
        <i className="icon-water"></i>
        <span>Regular Water</span>
      </div>
    );
  } else if (cropData.keyRequirements.toLowerCase().includes('moderate water') || 
             cropData.keyRequirements.toLowerCase().includes('moderate moisture')) {
    requirements.push(
      <div key="water" className="req-icon water-req">
        <i className="icon-water-moderate"></i>
        <span>Moderate Water</span>
      </div>
    );
  }
  
  // Temperature requirement
  if (cropData.keyRequirements.toLowerCase().includes('heat-loving') || 
      cropData.keyRequirements.toLowerCase().includes('warm temperatures')) {
    requirements.push(
      <div key="temp" className="req-icon temp-req">
        <i className="icon-temperature-hot"></i>
        <span>Heat Loving</span>
      </div>
    );
  } else if (cropData.keyRequirements.toLowerCase().includes('cool')) {
    requirements.push(
      <div key="temp" className="req-icon temp-req">
        <i className="icon-temperature-cool"></i>
        <span>Cool Weather</span>
      </div>
    );
  }
  
  return requirements;
};

// Helper function for cultivation tips based on crop type
const getCultivationTips = (cropName) => {
  const tips = {
    tomatoes: [
      "Start seeds indoors 6-8 weeks before the last frost date.",
      "Transplant seedlings when they are 6-8 inches tall and soil temperature is at least 15°C (60°F).",
      "Plant deeply, burying up to 2/3 of the stem to develop a stronger root system.",
      "Provide support with cages, stakes, or trellises.",
      "Remove suckers (side shoots) for indeterminate varieties to improve air circulation and direct energy to fruit production.",
      "Water at the base of plants to avoid wetting foliage."
    ],
    cucumbers: [
      "Plant seeds directly in the garden after all danger of frost has passed.",
      "Alternatively, start seeds indoors 3-4 weeks before the last frost date.",
      "Provide a trellis for vining varieties to save space and improve air circulation.",
      "Water deeply and consistently to prevent bitter fruits.",
      "Harvest frequently to encourage continued production.",
      "Pick cucumbers when they reach 6-8 inches for slicing varieties or 3-5 inches for pickling varieties."
    ],
    bellpeppers: [
      "Start seeds indoors 8-10 weeks before the last frost date.",
      "Transplant seedlings after soil temperature is at least 18°C (65°F).",
      "Space plants 18-24 inches apart to allow good air circulation.",
      "Use stake or cage support when plants are heavy with fruit.",
      "Harvest when peppers reach full size and desired color.",
      "The longer peppers remain on the plant, the sweeter they become."
    ],
    eggplant: [
      "Start seeds indoors 8-10 weeks before the last frost date.",
      "Transplant seedlings when soil temperature is at least 18°C (65°F).",
      "Space plants 18-24 inches apart in rows 30-36 inches apart.",
      "Provide stake or cage support as plants grow.",
      "Harvest when fruits are young and glossy for best flavor.",
      "Use pruning scissors to harvest, as stems are tough."
    ],
    hotpeppers: [
      "Start seeds indoors 8-10 weeks before the last frost date.",
      "Transplant seedlings after soil temperature is at least 18°C (65°F).",
      "Space plants 18-24 inches apart with 24-36 inches between rows.",
      "Slightly stressing plants (reduced watering) after fruit set can increase capsaicin levels and heat.",
      "Wear gloves when handling hot peppers during harvest.",
      "Let peppers fully ripen on the plant for maximum heat and flavor."
    ]
  };
  
  // Default to tomatoes if crop not found
  const defaultCrop = 'tomatoes';
  const cropTips = tips[cropName] || tips[defaultCrop];
  
  return (
    <ul className="tips-list">
      {cropTips.map((tip, index) => (
        <li key={index} className="tip-item">{tip}</li>
      ))}
    </ul>
  );
};

// Helper function for nutritional information
const getNutritionalInfo = (cropName) => {
  const nutritionInfo = {
    tomatoes: (
      <div className="nutrition-content">
        <p>Tomatoes are rich in vitamins A and C, as well as lycopene, a powerful antioxidant linked to reduced risk of heart disease and certain cancers.</p>
        <div className="nutrition-highlights">
          <div className="nutrient">
            <span className="nutrient-name">Vitamin C</span>
            <span className="nutrient-value">High</span>
          </div>
          <div className="nutrient">
            <span className="nutrient-name">Vitamin A</span>
            <span className="nutrient-value">Good</span>
          </div>
          <div className="nutrient">
            <span className="nutrient-name">Lycopene</span>
            <span className="nutrient-value">Excellent</span>
          </div>
          <div className="nutrient">
            <span className="nutrient-name">Potassium</span>
            <span className="nutrient-value">Good</span>
          </div>
        </div>
      </div>
    ),
    cucumbers: (
      <div className="nutrition-content">
        <p>Cucumbers are low in calories and contain beneficial antioxidants. They're composed of about 96% water, making them excellent for hydration.</p>
        <div className="nutrition-highlights">
          <div className="nutrient">
            <span className="nutrient-name">Vitamin K</span>
            <span className="nutrient-value">Good</span>
          </div>
          <div className="nutrient">
            <span className="nutrient-name">Vitamin C</span>
            <span className="nutrient-value">Moderate</span>
          </div>
          <div className="nutrient">
            <span className="nutrient-name">Potassium</span>
            <span className="nutrient-value">Moderate</span>
          </div>
          <div className="nutrient">
            <span className="nutrient-name">Magnesium</span>
            <span className="nutrient-value">Low</span>
          </div>
        </div>
      </div>
    ),
    bellpeppers: (
      <div className="nutrition-content">
        <p>Bell peppers are exceptionally rich in vitamin C, with red peppers containing more than oranges. They also provide good amounts of vitamins A and B6.</p>
        <div className="nutrition-highlights">
          <div className="nutrient">
            <span className="nutrient-name">Vitamin C</span>
            <span className="nutrient-value">Excellent</span>
          </div>
          <div className="nutrient">
            <span className="nutrient-name">Vitamin A</span>
            <span className="nutrient-value">High</span>
          </div>
          <div className="nutrient">
            <span className="nutrient-name">Vitamin B6</span>
            <span className="nutrient-value">Good</span>
          </div>
          <div className="nutrient">
            <span className="nutrient-name">Folate</span>
            <span className="nutrient-value">Good</span>
          </div>
        </div>
      </div>
    ),
    eggplant: (
      <div className="nutrition-content">
        <p>Eggplants are low in calories and carbohydrates but high in fiber. They contain nasunin, an antioxidant that helps protect brain cell membranes.</p>
        <div className="nutrition-highlights">
          <div className="nutrient">
            <span className="nutrient-name">Fiber</span>
            <span className="nutrient-value">Good</span>
          </div>
          <div className="nutrient">
            <span className="nutrient-name">Manganese</span>
            <span className="nutrient-value">Good</span>
          </div>
          <div className="nutrient">
            <span className="nutrient-name">Potassium</span>
            <span className="nutrient-value">Moderate</span>
          </div>
          <div className="nutrient">
            <span className="nutrient-name">Anthocyanins</span>
            <span className="nutrient-value">Good</span>
          </div>
        </div>
      </div>
    ),
    hotpeppers: (
      <div className="nutrition-content">
        <p>Hot peppers contain capsaicin, which gives them their heat and has anti-inflammatory properties. They're also rich in vitamins A and C.</p>
        <div className="nutrition-highlights">
          <div className="nutrient">
            <span className="nutrient-name">Vitamin C</span>
            <span className="nutrient-value">High</span>
          </div>
          <div className="nutrient">
            <span className="nutrient-name">Vitamin A</span>
            <span className="nutrient-value">Good</span>
          </div>
          <div className="nutrient">
            <span className="nutrient-name">Capsaicin</span>
            <span className="nutrient-value">High</span>
          </div>
          <div className="nutrient">
            <span className="nutrient-name">Potassium</span>
            <span className="nutrient-value">Moderate</span>
          </div>
        </div>
      </div>
    )
  };
  
  // Default to tomatoes if crop not found
  return nutritionInfo[cropName] || nutritionInfo['tomatoes'];
};

// Helper function for common varieties
const getCommonVarieties = (cropName) => {
  const varieties = {
    tomatoes: (
      <div className="varieties-grid">
        <div className="variety-item">
          <h5>Roma</h5>
          <p>Determinate, plum-type tomato ideal for sauce and canning</p>
        </div>
        <div className="variety-item">
          <h5>Beefsteak</h5>
          <p>Indeterminate with large fruits perfect for slicing</p>
        </div>
        <div className="variety-item">
          <h5>Cherry</h5>
          <p>Small, sweet fruits that are great for salads and snacking</p>
        </div>
        <div className="variety-item">
          <h5>San Marzano</h5>
          <p>Italian heirloom prized for its rich flavor in sauces</p>
        </div>
        <div className="variety-item">
          <h5>Early Girl</h5>
          <p>Early-maturing variety that produces well in cooler climates</p>
        </div>
        <div className="variety-item">
          <h5>Brandywine</h5>
          <p>Heirloom variety known for exceptional flavor</p>
        </div>
      </div>
    ),
    cucumbers: (
      <div className="varieties-grid">
        <div className="variety-item">
          <h5>Marketmore</h5>
          <p>Reliable slicing cucumber with dark green fruit</p>
        </div>
        <div className="variety-item">
          <h5>Lemon</h5>
          <p>Round, yellow cucumber with sweet, mild flavor</p>
        </div>
        <div className="variety-item">
          <h5>English/Hothouse</h5>
          <p>Long, seedless variety with thin skin</p>
        </div>
        <div className="variety-item">
          <h5>Pickling</h5>
          <p>Shorter varieties ideal for preserving</p>
        </div>
        <div className="variety-item">
          <h5>Armenian</h5>
          <p>Ribbed, pale green cucumber with mild flavor</p>
        </div>
        <div className="variety-item">
          <h5>Bush</h5>
          <p>Compact plants ideal for containers or small spaces</p>
        </div>
      </div>
    ),
    bellpeppers: (
      <div className="varieties-grid">
        <div className="variety-item">
          <h5>California Wonder</h5>
          <p>Classic bell shape that ripens from green to red</p>
        </div>
        <div className="variety-item">
          <h5>Purple Beauty</h5>
          <p>Produces deep purple fruits that mature to red</p>
        </div>
        <div className="variety-item">
          <h5>Golden California Wonder</h5>
          <p>Sweet yellow bell pepper</p>
        </div>
        <div className="variety-item">
          <h5>Chocolate Beauty</h5>
          <p>Ripens to a rich chocolate brown color</p>
        </div>
        <div className="variety-item">
          <h5>Coral Bell</h5>
          <p>Early maturing variety that ripens to orange</p>
        </div>
        <div className="variety-item">
          <h5>Gypsy</h5>
          <p>Prolific producer of smaller, sweet peppers</p>
        </div>
      </div>
    ),
    eggplant: (
      <div className="varieties-grid">
        <div className="variety-item">
          <h5>Black Beauty</h5>
          <p>Classic large, dark purple eggplant</p>
        </div>
        <div className="variety-item">
          <h5>Ichiban</h5>
          <p>Long, slender Japanese type</p>
        </div>
        <div className="variety-item">
          <h5>Rosa Bianca</h5>
          <p>Italian heirloom with lavender and white coloration</p>
        </div>
        <div className="variety-item">
          <h5>Fairy Tale</h5>
          <p>Small, purple and white striped fruits</p>
        </div>
        <div className="variety-item">
          <h5>Thai Long Green</h5>
          <p>Long, slender green fruits</p>
        </div>
        <div className="variety-item">
          <h5>Little Fingers</h5>
          <p>Small, finger-sized fruits growing in clusters</p>
        </div>
      </div>
    ),
    hotpeppers: (
      <div className="varieties-grid">
        <div className="variety-item">
          <h5>Jalapeño</h5>
          <p>Medium heat, versatile for many dishes</p>
        </div>
        <div className="variety-item">
          <h5>Habanero</h5>
          <p>Very hot with fruity undertones</p>
        </div>
        <div className="variety-item">
          <h5>Cayenne</h5>
          <p>Long, thin peppers ideal for drying</p>
        </div>
        <div className="variety-item">
          <h5>Serrano</h5>
          <p>Hotter than jalapeños with bright flavor</p>
        </div>
        <div className="variety-item">
          <h5>Thai Bird</h5>
          <p>Small, extremely hot peppers</p>
        </div>
        <div className="variety-item">
          <h5>Poblano</h5>
          <p>Mild pepper often used for stuffing</p>
        </div>
      </div>
    )
  };
  
  // Default to tomatoes if crop not found
  return varieties[cropName] || varieties['tomatoes'];
};

export default CropProfile;
