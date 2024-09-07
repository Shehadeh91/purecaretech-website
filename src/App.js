import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import AboutScreen from './Screens/AboutScreen';
import HomeScreen from './Screens/HomeScreen'; // Ensure this path is correct
import CareerScreen from './Screens/CareerScreen';
import TermsScreen from './Screens/TermsScreen';
import PrivacyScreen from './Screens/PrivacyScreen';
import ForgetPassword from './Screens/ForgetPasswordScreen';
import LogInScreen from './Screens/LogInScreen';
import AccountScreen from './Screens/AccountScreen';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'; // Import routing components
import logo from './assets/Images/PureCare.png'; // Ensure the logo path is correct
import googleLogo from './assets/Images/Google.png'; // Ensure the logo path is correct
import iosLogo from './assets/Images/IOS.png'; // Ensure the logo path is correct





function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <div className="content">
        <Routes>


          {/* HomeScreen route */}
          <Route path="/" element={<HomeScreen />} />
          <Route path="/about" element={<AboutScreen />} />
          <Route path="/career" element={<CareerScreen />} />
          <Route path="/terms" element={<TermsScreen />} />
          <Route path="/privacy" element={<PrivacyScreen />} />
          <Route path="/login" element={<LogInScreen />} />
          <Route path="/account" element={<AccountScreen />} />
          {/* Additional routes can be added here in the future */}
          {/* Example: <Route path="/about" element={<AboutScreen />} /> */}

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <nav className="nav">
          <ul>
          <li
              className="dropdown"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              ref={dropdownRef}
            >
              <span className="about-link">About</span>
              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  <li><Link to="/about">About PureCare Tech</Link></li>
                  <li><Link to="/career">Career</Link></li>
             </ul>
              )}
            </li>
            <li><Link to="/">Home</Link></li>

            <li
              className="dropdown"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              ref={dropdownRef}
            >
              <span className="services-link">Services</span>
              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  <li><Link to="/login">Mobile Car Wash</Link></li>
                  <li><Link to="/signup">Home Cleaning</Link></li>
                  <li><Link to="/account-settings">Dry Cleaning</Link></li>
                  {/* <li><Link to="/support">Support</Link></li> */}
                </ul>
              )}
            </li>
            <li><Link to="/dashboard">Order Dashboard</Link></li>
            <li
              className="dropdown"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              ref={dropdownRef}
            >
              <span className="account-link">Account</span>
              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/signup">Signup</Link></li>
                  <li><Link to="/account-settings">Account Settings</Link></li>
                  {/* <li><Link to="/support">Support</Link></li> */}
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};



const Footer = () => {
  const footerRef = useRef(null); // Create footer ref
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-links">
            <Link to="/">Home</Link> |
            <Link to="/terms">Terms of Service</Link> |
            <Link to="/privacy">Privacy Control</Link>
          </div>
          <div className="footer-contact">
            <p>Contact us at: admin@purecaretech.com</p>
            <p>Phone: +1 (204) 803-6949</p> {/* Phone number added here */}
            <div className="social-media">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-right">
          <p ref={footerRef}>Download our app</p>
          <small className="app-tagline">Book our cleaning services on the go with our mobile app.</small> {/* New tagline added */}
          <div className="download-buttons">
            <a href="https://play.google.com/store/apps" target="_blank" rel="noopener noreferrer">
              <img src={googleLogo} alt="Android" className="download-icon" />
            </a>
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
              <img src={iosLogo} alt="iOS" className="download-icon" />
            </a>
          </div>
        </div>
      </div>
      <p className="footer-bottom">© 2024 PureCare Tech. All Rights Reserved.</p>
    </footer>
  );
};





export default App;

