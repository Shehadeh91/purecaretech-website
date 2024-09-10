import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import AboutScreen from './Screens/AboutScreen';
import HomeScreen from './Screens/HomeScreen';
import CareerScreen from './Screens/CareerScreen';
import TermsScreen from './Screens/TermsScreen';
import PrivacyScreen from './Screens/PrivacyScreen';
import ForgetPasswordScreen from './Screens/ForgetPasswordScreen';
import LogInScreen from './Screens/LogInScreen';
import AccountScreen from './Screens/AccountScreen';
import SignuUpScreen from './Screens/SignUpScreen';
import SettingsScreen from './Screens/SettingsScreen';
import OrderDashboardScreen from './Screens/OrderDashboardScreen';
import DryCleanOrderScreen from './Screens/DryCleaningScreen';
import DryCleanCheckOutScreen from './Screens/DryCleaningCheckoutScreen';
import OrderCompleteScreen from './Screens/OrderCompleteScreen';
import HomeCleaningScreen from './Screens/HomeCleaningScreen';
import HomeCleaningCheckoutScreen from './Screens/HomeCleaningCheckoutScreen';
import CarWashScreen from './Screens/CarWashScreen';
import CarWashCheckoutScreen from './Screens/CarWashCheckoutScreen';
import AdminScreen from './Screens/AdminScreen';
import ManageUsersScreen from './Screens/ManageUsersScreen';
import AgentScreen from './Screens/AgentScreen';
import AgentEarningOverviewScreen from './Screens/EarningOverviewScreen';
import AgentAdminHelpPage from './Screens/AgentAdminHelpPage';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'; // Import routing components
import logo from './assets/Images/PureCare.png'; // Ensure the logo path is correct
import googleLogo from './assets/Images/Google.png'; // Ensure the logo path is correct
import iosLogo from './assets/Images/IOS.png'; // Ensure the logo path is correct

import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "./firebaseConfig"; // Correct path for firebaseConfig

import { CircularProgress } from '@mui/material';
import { purple, red } from '@mui/material/colors';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Your Stripe public key
// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_live_51PIuTYRwhciiEfEmcWuiDdwy9ZvSGPAGX9MjMLYM4VLTpJcqBkoYX3dxZUGoSUOAgrjKOSzESViCOABqLD831TXH00m6iVILkh');



function App() {
  const [initialRoute, setInitialRoute] = useState(null); // Adjust to your app's logic
  const [isLoading, setLoading] = useState(true);
  const [isVisible, setVisible] = useState(true); // Use this for controlling the view
  const auth = getAuth();

  useEffect(() => {
    // Set persistence to local before handling auth state changes
    const setAuthPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        console.log("Persistence set to local");

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          try {
            if (!user || !user.emailVerified) {
              setInitialRoute("home");
              return;
            }

            const userDocRef = doc(FIRESTORE_DB, "Users", user.email);
            const docSnapshot = await getDoc(userDocRef);

            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();
              switch (userData.Role) {
                case "Agent":
                  setInitialRoute("agent");
                  break;
                case "Admin":
                  setInitialRoute("admin");
                  break;
                default:
                  setInitialRoute("home");
              }
            } else {
              console.warn("User document not found.");
              setInitialRoute("home");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            setInitialRoute("home");
          } finally {
            setVisible(false);
            setLoading(false);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error setting persistence:", error);
      }
    };

    setAuthPersistence();
  }, [auth]);

  if (isLoading) {
    return (
      <div style={{ margin: '250px auto', textAlign: 'center' }}>
        <CircularProgress size={75} style={{ color: purple[500] }} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Elements stripe={stripePromise}>
        <div className="content">
          <Routes>

            <Route path="/" element={<HomeScreen />} />
            <Route path="/about" element={<AboutScreen />} />
            <Route path="/career" element={<CareerScreen />} />
            <Route path="/terms" element={<TermsScreen />} />
            <Route path="/privacy" element={<PrivacyScreen />} />
            <Route path="/login" element={<LogInScreen />} />
            <Route path="/account" element={<AccountScreen />} />
            <Route path="/forget" element={<ForgetPasswordScreen />} />
            <Route path="/signup" element={<SignuUpScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/dashboard" element={<OrderDashboardScreen />} />
            <Route path="/dryCleaningOrder" element={<DryCleanOrderScreen />} />
            <Route path="/dryCleanCheckOut" element={<DryCleanCheckOutScreen />} />
            <Route path="/orderComplete" element={<OrderCompleteScreen />} />
            <Route path="/homeCleaningOrder" element={<HomeCleaningScreen />} />
            <Route path="/homeCleaningCheckOut" element={<HomeCleaningCheckoutScreen />} />
            <Route path="/carWashOrder" element={<CarWashScreen />} />
            <Route path="/carWashCheckOut" element={<CarWashCheckoutScreen />} />
            <Route path="/admin" element={<AdminScreen />} />
            <Route path="/users" element={<ManageUsersScreen />} />
            <Route path="/agents" element={<AgentScreen />} />
            <Route path="/earnings" element={<AgentEarningOverviewScreen />} />
            <Route path="/help" element={<AgentAdminHelpPage />} />


  {/* Wrap checkout route in a separate component */}


            {/* Fallback for unmatched routes */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />

          </Routes>
        </div>
        </Elements>
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
                  <li><Link to="/carWashOrder">Mobile Car Wash</Link></li>
                  <li><Link to="/homeCleaningOrder">Home Cleaning</Link></li>
                  <li><Link to="/dryCleaningOrder">Dry Cleaning</Link></li>
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
              <Link to="/account" className="account-link">Account</Link>
              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  <li><Link to="/login">Login</Link></li>
                  <li><Link to="/signup">Signup</Link></li>
                  <li><Link to="/settings">Account Settings</Link></li>
                  <li><Link to="/admin">Admin</Link></li>
        <li><Link to="/agents">Agent</Link></li>

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
              <a href="https://www.facebook.com/profile.php?id=61560480989877" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} size="2x" />
              </a>
              {/* <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a> */}
            </div>
          </div>
        </div>

        <div className="footer-right">
          <p ref={footerRef}>Download our app</p>
          <small className="app-tagline">Book our cleaning services on the go with our mobile app.</small>
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
