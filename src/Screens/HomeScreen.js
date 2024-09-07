import React, { useRef } from "react";
import { Card } from "@mui/material"; // Material UI v5
import useAppStore from "../useAppStore"; // Zustand for state management
import './HomeScreen.css'; // Custom CSS

// Importing images for the services
import carCleanImage from '../assets/Images/CarClean.png';
import houseCleanImage from '../assets/Images/HouseClean.png';
import dryCleanImage from '../assets/Images/DryClean.png';
import logoImage from '../assets/Images/PureCare.png';

// Importing step images for "How It Works"
// import step1Image from '../assets/Images/Logout.png';
// import step2Image from '../assets/Images/Logout.png';
// import step3Image from '../assets/Images/Logout.png';
// import step4Image from '../assets/Images/Logout.png';
// import step5Image from '../assets/Images/Logout.png';

// Example: import your self-hosted video (optional depending on where the video is)
import promoVideo from '../assets/Videos/PureCare Tech Last.mp4';  // Adjust path to the actual location

import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import PaymentIcon from '@mui/icons-material/Payment';
import SendIcon from '@mui/icons-material/Send';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const HomeScreen = () => {
  const { setVisible, setIndexBottom } = useAppStore();

  // Create refs for each section
  const servicesRef = useRef(null);
  const howItWorksRef = useRef(null);
  const headerRef = useRef(null);

  // Scroll to the respective section
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  // Example data for the services
  const services = [
    {
      id: "1",
      title: "Mobile Car Wash",
      image: carCleanImage,
      screen: "carWashOrder",
    },
    {
      id: "2",
      title: "Room Cleaning",
      image: houseCleanImage,
      screen: "roomCleanOrder",
    },
    {
      id: "3",
      title: "Dry Cleaning",
      image: dryCleanImage,
      screen: "dryCleanOrder",
    },
  ];

  // Function to render each card for the services
  const renderServiceItem = (item) => (
    <div className="card-container" key={item.id}>
      <Card
        className="card"
        onClick={() => {
          setVisible(false); // Update Zustand store state
        }}
      >
        <div className="card-title">{item.title}</div>
        <img src={item.image} alt={item.title} className="card-image" />
      </Card>
    </div>
  );

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero-section" >
        <h1 className="hero-heading">Effortless Cleaning at Your Fingertips</h1>
        <p className="hero-subheading">Book a mobile car wash, dry cleaning, or home cleaning in seconds.</p>
        <div className="hero-buttons">
          <button className="cta-button" onClick={() => scrollToSection(servicesRef)}>Book Now</button>
          <button className="cta-button" onClick={() => scrollToSection(howItWorksRef)}>Learn More</button>
          <button className="cta-button" onClick={() => scrollToSection(headerRef)}>Download the App</button>
        </div>
      </div>

      {/* Promo Video Section */}
      <div className="promo-video-section">
        <h2 className="section-title">Watch Our Promo</h2>
        <div className="video-container"  ref={howItWorksRef}>
          {/* Replace the YouTube iframe with your self-hosted video */}
          <video width="100%" height="400px" controls>
            <source src={promoVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <div className="how-it-works-steps">
          <div className="step">
          <SearchIcon fontSize="large" alt="Step 1" />
            <p>Choose Your Service</p>
          </div>
          <div className="step">
          <SettingsIcon fontSize="large"  alt="Step 2" />
            <p>Customize Your Order</p>
          </div>
          <div className="step">
          <PaymentIcon fontSize="large"alt="Step 3" />
            <p>Confirm and Pay</p>
          </div>
          <div className="step">
          <SendIcon fontSize="large"  alt="Step 4" />
            <p>Order is Sent to Service Providers</p>
          </div>
          <div className="step" ref={servicesRef}>
          <DirectionsCarIcon fontSize="large" alt="Step 5" />
            <p>A Provider Picks Up and Arrives</p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="services-section" >
        <h2 className="section-title">Our Services</h2>
        <div className="grid-container">
          {services.map((item) => renderServiceItem(item))}
        </div>
      </div>

      {/* Additional sections like Testimonials, Promo, etc. */}
      <div className="testimonials-section">
        <h2 className="section-title">What Our Customers Say</h2>
        <div className="testimonial-carousel">
          <div className="testimonial">
            <p>"Amazing service! My car looks brand new."</p>
            <span>- John Doe</span>
          </div>
          <div className="testimonial">
            <p>"Fast and professional. Highly recommended."</p>
            <span>- Jane Smith</span>
          </div>
        </div>
      </div>

      {/* Promo Section */}
      <div className="promo-section">
        <h2 className="promo-title">Get 10% off Your First Service!</h2>
        <p>Sign up today and enjoy exclusive offers.</p>
        {/* <button className="promo-button" onClick={() => navigate("/signup")}>Sign Up Now</button> */}
      </div>

      {/* Order Dashboard Section (For Logged-In Users) */}
      <div className="order-dashboard-section" ref={headerRef}>
        <h2 className="section-title">Manage Your Orders</h2>
        {/* <button className="cta-button" onClick={() => navigate("/dashboard")}>Go to Dashboard</button> */}
      </div>
    </div>
  );
};

export default HomeScreen;
