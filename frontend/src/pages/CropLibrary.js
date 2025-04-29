import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/pages/CropLibrary.css';

const CropLibrary = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/forecast/crops');
        setCrops(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load crop data. Please try again later.');
        setLoading(false);
        console.error('Error fetching crops:', err);
      }
    };

    fetchCrops();
  }, []);

  // Filter crops based on search term and category
  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         crop.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeCategory === 'all') {
      return matchesSearch;
    }
    
    // This would need to be updated based on how crop categories are structured in your data
    return matchesSearch && crop.category === activeCategory;
  });

  // Group crops by first letter for alphabetical display
  const groupedCrops = filteredCrops.reduce((acc, crop) => {
    const firstLetter = crop.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(crop);
    return acc;
  }, {});

  // Sort the keys alphabetically
  const sortedLetters = Object.keys(groupedCrops).sort();

  if (loading) {
    return (
      <div className="crop-library-container">
        <div className="loading-spinner">Loading crop data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="crop-library-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="crop-library-container">
      <div className="library-header">
        <h1>Crop Library</h1>
        <p className="library-description">
          Browse our comprehensive collection of vegetable crops with detailed growing information, 
          planting calendars, and care requirements for home gardeners.
        </p>
      </div>

      <div className="library-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          <button 
            className={`category-button ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Crops
          </button>
          <button 
            className={`category-button ${activeCategory === 'fruiting' ? 'active' : ''}`}
            onClick={() => setActiveCategory('fruiting')}
          >
            Fruiting Vegetables
          </button>
          <button 
            className={`category-button ${activeCategory === 'leafy' ? 'active' : ''}`}
            onClick={() => setActiveCategory('leafy')}
          >
            Leafy Greens
          </button>
          <button 
            className={`category-button ${activeCategory === 'root' ? 'active' : ''}`}
            onClick={() => setActiveCategory('root')}
          >
            Root Vegetables
          </button>
          <button 
            className={`category-button ${activeCategory === 'brassica' ? 'active' : ''}`}
            onClick={() => setActiveCategory('brassica')}
          >
            Brassicas
          </button>
        </div>
      </div>

      {filteredCrops.length === 0 ? (
        <div className="no-results">
          <p>No crops found matching your search criteria.</p>
        </div>
      ) : (
        <div className="crops-alphabetical">
          {sortedLetters.map(letter => (
            <div key={letter} className="letter-group">
              <h2 className="letter-heading">{letter}</h2>
              <div className="crops-grid">
                {groupedCrops[letter].map(crop => (
                  <div key={crop.id} className="crop-card">
                    <div className="crop-image-container">
                      <img 
                        src={crop.image || '/images/crops/placeholder.jpg'} 
                        alt={crop.name} 
                        className="crop-image"
                      />
                    </div>
                    <div className="crop-info">
                      <h3 className="crop-name">{crop.name}</h3>
                      <p className="crop-scientific">{crop.scientificName}</p>
                      <div className="crop-details">
                        <div className="detail-item">
                          <span className="detail-label">Days to Harvest:</span>
                          <span className="detail-value">{crop.timeToHarvest.min}-{crop.timeToHarvest.max}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Maintenance:</span>
                          <span className="detail-value">{crop.maintenanceLevel}</span>
                        </div>
                      </div>
                      <Link to={`/forecast?crop=${crop.id}`} className="forecast-link">
                        Generate Forecast
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropLibrary;
