import React, { useContext, useState } from 'react';
import { ForecastContext } from '../contexts/ForecastContext';
import '../styles/pages/CropLibrary.css';

const CropLibrary = () => {
  const { crops } = useContext(ForecastContext);
  const [selectedCrop, setSelectedCrop] = useState(null);
  
  return (
    <div className="crop-library-page">
      <div className="container">
        <section className="page-header">
          <h1>Vegetable Crop Library</h1>
          <p className="page-description">
            Explore our comprehensive database of vegetable crops for detailed information on 
            growing requirements, harvesting tips, and best practices.
          </p>
        </section>
        
        <div className="crop-library-content">
          <div className="crop-list">
            <h2>Crop Categories</h2>
            <div className="crop-categories">
              <div className="category-group">
                <h3>Fruiting Vegetables</h3>
                <ul>
                  {crops.filter(crop => ['tomatoes', 'bellPeppers', 'eggplant', 'cucumbers', 'hotPeppers'].includes(crop.id))
                    .map(crop => (
                      <li key={crop.id} 
                          className={selectedCrop === crop.id ? 'active' : ''}
                          onClick={() => setSelectedCrop(crop.id)}>
                        {crop.name}
                      </li>
                    ))}
                </ul>
              </div>
              
              <div className="category-group">
                <h3>Coming Soon</h3>
                <ul className="disabled">
                  <li>Leafy Greens</li>
                  <li>Root Vegetables</li>
                  <li>Brassicas</li>
                  <li>Legumes</li>
                  <li>Alliums</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="crop-details">
            {selectedCrop ? (
              renderCropDetails(crops.find(crop => crop.id === selectedCrop))
            ) : (
              <div className="select-crop-prompt">
                <h3>Select a crop from the list to view detailed information</h3>
                <p>Our crop library contains comprehensive growing guides for popular vegetables.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const renderCropDetails = (crop) => {
  if (!crop) return null;
  
  return (
    <div className="crop-detail-content">
      <div className="crop-header">
        <h2>{crop.name}</h2>
        <p className="scientific-name">{crop.scientificName}</p>
      </div>
      
      <div className="crop-sections">
        <section className="crop-section">
          <h3>Overview</h3>
          <p>
            {getCropOverview(crop.id)}
          </p>
        </section>
        
        <section className="crop-section">
          <h3>Growing Requirements</h3>
          <div className="requirements-grid">
            <div className="requirement">
              <h4>Climate</h4>
              <p>{getClimateRequirements(crop.id)}</p>
            </div>
            <div className="requirement">
              <h4>Soil</h4>
              <p>{getSoilRequirements(crop.id)}</p>
            </div>
            <div className="requirement">
              <h4>Water</h4>
              <p>{getWaterRequirements(crop.id)}</p>
            </div>
            <div className="requirement">
              <h4>Sunlight</h4>
              <p>{getSunlightRequirements(crop.id)}</p>
            </div>
          </div>
        </section>
        
        <section className="crop-section">
          <h3>Planting Guide</h3>
          <div className="planting-info">
            <div className="planting-method">
              <h4>Seed Starting</h4>
              <p>{getSeedStartingInfo(crop.id)}</p>
            </div>
            <div className="planting-method">
              <h4>Transplanting</h4>
              <p>{getTransplantingInfo(crop.id)}</p>
            </div>
            <div className="planting-method">
              <h4>Spacing</h4>
              <p>Plant {crop.spacing?.min || 30}-{crop.spacing?.max || 60} cm apart, with rows spaced {getRowSpacing(crop.id)} cm apart.</p>
            </div>
          </div>
        </section>
        
        <section className="crop-section">
          <h3>Care & Maintenance</h3>
          <ul className="care-list">
            {getCareInstructions(crop.id).map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </section>
        
        <section className="crop-section">
          <h3>Harvesting</h3>
          <p>{getHarvestingInfo(crop.id)}</p>
        </section>
        
        <section className="crop-section">
          <h3>Common Problems</h3>
          <div className="problems-list">
            {getCommonProblems(crop.id).map((problem, index) => (
              <div key={index} className="problem-item">
                <h4>{problem.name}</h4>
                <p>{problem.solution}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Helper functions to provide crop-specific information
const getCropOverview = (cropId) => {
  const overviews = {
    tomatoes: "Tomatoes are warm-season plants that produce juicy fruits in a wide range of sizes, shapes, and colors. They are one of the most popular home garden crops due to their versatility in cooking and superior flavor when homegrown compared to store-bought varieties.",
    cucumbers: "Cucumbers are vining plants that thrive in warm weather and produce crisp, refreshing fruits. They come in slicing varieties for fresh eating and pickling varieties for preservation.",
    bellPeppers: "Bell peppers are colorful, nutritious vegetables that start green and ripen to red, yellow, orange, or purple depending on the variety. They have a mild, sweet flavor and are excellent both raw and cooked.",
    eggplant: "Eggplants are heat-loving plants that produce glossy fruits in various shapes and colors, though purple is most common. They have a meaty texture and absorb flavors well, making them versatile in cooking.",
    hotPeppers: "Hot peppers range from mildly spicy to extremely hot, depending on the variety. They add flavor and heat to dishes and can be used fresh, dried, or preserved."
  };
  
  return overviews[cropId] || "No overview available for this crop.";
};

// Additional helper functions would be implemented for the remaining information sections

export default CropLibrary;