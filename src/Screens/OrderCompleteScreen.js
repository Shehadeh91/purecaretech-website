import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import `Link` and `useNavigate`
import logo from '../assets/Images/PureCare.png'; // Ensure the logo path is correct
import './OrderCompleteScreen.css'; // Import the CSS file

const OrderCompleteScreen = () => {
  const navigate = useNavigate();


  const goToHome = () => {
    navigate('/');
  };

  const goToOrders = () => {
    navigate('/dashboard');
  };

  return (
    <div className="order-complete-container">
      {/* Logo Link */}
      <Link to="/">
        <img src={logo} alt="PureCare Tech Logo" className="order-complete-logo" />
      </Link>

      {/* Order confirmation messages */}
      <p className="order-complete-text">Thank you for choosing PureCare Tech!</p>
      <p className="order-complete-text">Your order has been successfully placed and is now being processed.</p>

      {/* Buttons to navigate to Home and Orders */}
      <button className="order-complete-button" onClick={goToHome}>Home</button>
      <button className="order-complete-button" onClick={goToOrders}>Orders</button>
    </div>
  );
};

export default OrderCompleteScreen;
