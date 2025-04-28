import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-col">
          <h4>HomeGrow Forecast</h4>
          <p>Your comprehensive planning tool for successful home vegetable farming. Optimize your growing space and maximize yields with data-driven forecasts.</p>
          <p className="copyright">© {currentYear} HomeGrow Forecast. All rights reserved.</p>
        </div>
        
        <div className="footer-col">
          <h4>Resources</h4>
          <ul className="footer-links">
            <li className="footer-link">
              <Link to="/crops">Crop Library</Link>
            </li>
            <li className="footer-link">
              <Link to="/climate-zones">Climate Zone Guide</Link>
            </li>
            <li className="footer-link">
              <Link to="/help">Growing Guides</Link>
            </li>
            <li className="footer-link">
              <a href="https://blog.homegrowforecast.com" target="_blank" rel="noopener noreferrer">Blog</a>
            </li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4>Company</h4>
          <ul className="footer-links">
            <li className="footer-link">
              <Link to="/about">About Us</Link>
            </li>
            <li className="footer-link">
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li className="footer-link">
              <Link to="/terms">Terms of Service</Link>
            </li>
            <li className="footer-link">
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4>Connect</h4>
          <div className="social-links">
            <a href="https://twitter.com/homegrowforecast" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="icon-twitter"></i>Twitter
            </a>
            <a href="https://facebook.com/homegrowforecast" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="icon-facebook"></i>Facebook
            </a>
            <a href="https://instagram.com/homegrowforecast" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="icon-instagram"></i>Instagram
            </a>
            <a href="https://pinterest.com/homegrowforecast" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="icon-pinterest"></i>Pinterest
            </a>
          </div>
          <div className="newsletter">
            <h5>Join our newsletter</h5>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" className="newsletter-input" />
              <button type="submit" className="newsletter-button">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
