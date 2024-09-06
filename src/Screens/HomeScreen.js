import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate for React Router v6
import { Card } from "@mui/material";  // Material UI v5
import useAppStore from "../useAppStore";  // Zustand for state management
import './HomeScreen.css';  // Custom CSS

// Importing images from src/assets/Images
import carCleanImage from '../assets/Images/CarClean.png';
import houseCleanImage from '../assets/Images/HouseClean.png';
import dryCleanImage from '../assets/Images/DryClean.png';
import logoImage from '../assets/Images/PureCare.png';

const HomeScreen = () => {
  const navigate = useNavigate();  // useNavigate replaces useHistory in React Router v6
  const { setVisible, setIndexBottom } = useAppStore();

  // Example data for the services, now with imported images
  const data = [
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
  const renderItem = (item) => (
    <div className="card-container" key={item.id}>
      <Card
        className="card"
        onClick={() => {
          navigate(`/${item.screen}`);
          setVisible(false);  // Update Zustand store state
        }}
      >
        <div className="card-title">{item.title}</div>
        <img src={item.image} alt={item.title} className="card-image" />
      </Card>
    </div>
  );

  return (
    <div className="container">
      <h1 className="title">PureCare</h1>
      <h2 className="subTitle">Anywhere, Anytime</h2>
      <img
        className="logo"
        src={logoImage}
        alt="PureCare Logo"
      />
      <div className="grid-container">
        {data.map((item) => renderItem(item))}
      </div>
    </div>
  );
};

export default HomeScreen;
