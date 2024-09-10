import { collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useTheme } from "@mui/material/styles";

import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import useAppStore from "../useAppStore";
import 'material-icons/iconfont/material-icons.css';

import LogInScreen from "./LogInScreen";
import './OrderDashboardScreen.css'; // Custom CSS

const OrderDashboardScreen = () => {
  const auth = FIREBASE_AUTH;
  const { user, setUser, setVisible } = useAppStore();
  const [showInProgress, setShowInProgress] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);
  const [highlightedButton, setHighlightedButton] = useState("InProgress");
  const [inProgressOrders, setInProgressOrders] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  const theme = useTheme();




  // Function to set service rating
  const markOrderRating = async (orderId, serviceType, rating) => {
    try {
      // Mapping service types to Firestore collection names
      const serviceCollectionMap = {
        "Dry Clean": "Dry-Clean",
        "Car Wash": "Car-Wash",
        "Room Clean": "Room-Clean"
      };
      // Get the collection name based on service type
      const collectionName = serviceCollectionMap[serviceType];
      if (!collectionName) {
        console.error("Invalid service type:", serviceType);
        return;
      }
      // Reference to the appropriate collection
      const ordersRef = collection(FIRESTORE_DB, collectionName);
      const orderDocRef = doc(ordersRef, orderId);
      // Update the Rating field in the specified document
      await updateDoc(orderDocRef, { Rating: rating });
      console.log(`Rating "${rating}" set for order ID "${orderId}" in collection "${collectionName}".`);
      handleButtonPress("Completed");
    } catch (error) {
      console.error("Error setting service rating:", error);
    }
  };

  const markOrderAsCanceled = async (orderId, serviceType) => {
    try {
      if (serviceType === "Dry Clean") {
        const dryCleanOrdersRef = collection(FIRESTORE_DB, "Dry-Clean");
        await setDoc(doc(dryCleanOrdersRef, orderId), { Status: "Canceled" }, { merge: true });
      } else if (serviceType === "Car Wash") {
        const carWashOrdersRef = collection(FIRESTORE_DB, "Car-Wash");
        await setDoc(doc(carWashOrdersRef, orderId), { Status: "Canceled" }, { merge: true });
      } else if (serviceType === "Room Clean") {
        const roomCleanOrdersRef = collection(FIRESTORE_DB, "Room-Clean");
        await setDoc(doc(roomCleanOrdersRef, orderId), { Status: "Canceled" }, { merge: true });
      } else {
        // console.error("Invalid service type:", serviceType);
        return;
      }
      // console.log("Order marked as Canceled.");

      // Update state after canceling the serviceOrder
      setInProgressOrders((prevOrders) =>
        prevOrders.filter((serviceOrder) => serviceOrder.id !== orderId)
      );
      setCanceledOrders((prevOrders) => [
        // Place the claimed serviceOrder at the top of MyOrders
        { id: orderId, ...inProgressOrders.find((serviceOrder) => serviceOrder.id === orderId) },
        ...prevOrders.filter((serviceOrder) => serviceOrder.id !== orderId), // Filter out the old serviceOrder if it exists
      ]);
    } catch (error) {
      // console.error("Error marking serviceOrder as Canceled:", error);
    }
  };
  const handleButtonPress = (status) => {
    setShowInProgress(status === "InProgress");
    setShowCompleted(status === "Completed");
    setShowCanceled(status === "Canceled");
    setHighlightedButton(status);

    const fetchOrders = async () => {
      try {
        const carWashOrdersRef = collection(FIRESTORE_DB, "Car-Wash");
        const dryCleanOrdersRef = collection(FIRESTORE_DB, "Dry-Clean");
        const roomCleanOrdersRef = collection(FIRESTORE_DB, "Room-Clean");

        const carWashQuerySnapshot = await getDocs(carWashOrdersRef);
        const dryCleanQuerySnapshot = await getDocs(dryCleanOrdersRef);
        const roomCleanQuerySnapshot = await getDocs(roomCleanOrdersRef);

        const carWashOrders = carWashQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const dryCleanOrders = dryCleanQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const roomCleanOrders = roomCleanQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const userInProgressOrders = [
          ...carWashOrders.filter((order) => order.Email === user.email && order.Status === "InProgress" && order.Service === "Car Wash").reverse(),
          ...dryCleanOrders.filter((order) => order.Email === user.email && order.Status === "InProgress" && order.Service === "Dry Clean").reverse(),
          ...roomCleanOrders.filter((order) => order.Email === user.email && order.Status === "InProgress" && order.Service === "Room Clean").reverse(),
        ];

        const userCanceledOrders = [
          ...carWashOrders.filter((order) => order.Email === user.email && order.Status === "Canceled" && order.Service === "Car Wash").reverse(),
          ...dryCleanOrders.filter((order) => order.Email === user.email && order.Status === "Canceled" && order.Service === "Dry Clean").reverse(),
          ...roomCleanOrders.filter((order) => order.Email === user.email && order.Status === "Canceled" && order.Service === "Room Clean").reverse(),
        ];

        const userCompletedOrders = [
          ...carWashOrders.filter((order) => order.Email === user.email && order.Status === "Completed" && order.Service === "Car Wash").reverse(),
          ...dryCleanOrders.filter((order) => order.Email === user.email && order.Status === "Completed" && order.Service === "Dry Clean").reverse(),
          ...roomCleanOrders.filter((order) => order.Email === user.email && order.Status === "Completed" && order.Service === "Room Clean").reverse(),
        ];

        setInProgressOrders(userInProgressOrders);
        setCanceledOrders(userCanceledOrders);
        setCompletedOrders(userCompletedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  };

  const carBrandIcons = {
    Mazda: require("../assets/CarBrandIcons/mazda.png"),
    Mercedes: require("../assets/CarBrandIcons/mercedes.png"),
    BMW: require("../assets/CarBrandIcons/bmw.png"),
    Honda: require("../assets/CarBrandIcons/honda.png"),
    Hyundai: require("../assets/CarBrandIcons/hyundai.png"),
    Ford: require("../assets/CarBrandIcons/ford.png"),
    Chevrolet: require("../assets/CarBrandIcons/chevrolet.png"),
    Toyota: require("../assets/CarBrandIcons/toyota.png"),
    GMC: require("../assets/CarBrandIcons/gmc.png"),
    Dodge: require("../assets/CarBrandIcons/dodge.png"),
    Jeep: require("../assets/CarBrandIcons/jeep.png"),
    Nissan: require("../assets/CarBrandIcons/nissan.png"),
    KIA: require("../assets/CarBrandIcons/kia.png"),
    Subaru: require("../assets/CarBrandIcons/subaru.png"),
    Volkswagen: require("../assets/CarBrandIcons/volkswagen.png"),
    Audi: require("../assets/CarBrandIcons/audi.png"),
    Chrysler: require("../assets/CarBrandIcons/chrysler.png"),
    Lexus: require("../assets/CarBrandIcons/lexus.png"),
    Cadilac: require("../assets/CarBrandIcons/cadilac.png"),
    Buick: require("../assets/CarBrandIcons/buick.png"),
    Tesla: require('../assets/CarBrandIcons/tesla.png'),
  };
  const bodyTypeIcons = {
    Sedan: require("../assets/CarStyleIcons/Sedan.png"),
    Coupe: require("../assets/CarStyleIcons/Coupe.png"),
    Hatchback: require("../assets/CarStyleIcons/Hatchback.png"),
    PickupTruck: require("../assets/CarStyleIcons/PickupTruck.png"),
    SUV: require("../assets/CarStyleIcons/SUV.png"),
    MiniVan: require("../assets/CarStyleIcons/MiniVan.png"),
  };
  const getIconSource = (type, value) => {
    if (type === "carBrand") {
      return carBrandIcons[value] || null;
    } else if (type === "bodyType") {
      return bodyTypeIcons[value] || null;
    }
  };

  useEffect(() => {
    setVisible(true);
    return () => {
      setVisible(false);
    };
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user || !user.email) {
          return;
        }

        const carWashOrdersRef = collection(FIRESTORE_DB, "Car-Wash");
        const dryCleanOrdersRef = collection(FIRESTORE_DB, "Dry-Clean");
        const roomCleanOrdersRef = collection(FIRESTORE_DB, "Room-Clean");

        const carWashQuerySnapshot = await getDocs(carWashOrdersRef);
        const dryCleanQuerySnapshot = await getDocs(dryCleanOrdersRef);
        const roomCleanQuerySnapshot = await getDocs(roomCleanOrdersRef);

        const carWashOrders = carWashQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const dryCleanOrders = dryCleanQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const roomCleanOrders = roomCleanQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const userInProgressOrders = [
          ...carWashOrders.filter((order) => order.Email === user.email && order.Status === "InProgress" && order.Service === "Car Wash"),
          ...dryCleanOrders.filter((order) => order.Email === user.email && order.Status === "InProgress" && order.Service === "Dry Clean"),
          ...roomCleanOrders.filter((order) => order.Email === user.email && order.Status === "InProgress" && order.Service === "Room Clean"),
        ];

        const userCanceledOrders = [
          ...carWashOrders.filter((order) => order.Email === user.email && order.Status === "Canceled" && order.Service === "Car Wash"),
          ...dryCleanOrders.filter((order) => order.Email === user.email && order.Status === "Canceled" && order.Service === "Dry Clean"),
          ...roomCleanOrders.filter((order) => order.Email === user.email && order.Status === "Canceled" && order.Service === "Room Clean"),
        ];

        const userCompletedOrders = [
          ...carWashOrders.filter((order) => order.Email === user.email && order.Status === "Completed" && order.Service === "Car Wash"),
          ...dryCleanOrders.filter((order) => order.Email === user.email && order.Status === "Completed" && order.Service === "Dry Clean"),
          ...roomCleanOrders.filter((order) => order.Email === user.email && order.Status === "Completed" && order.Service === "Room Clean"),
        ];

        setInProgressOrders(userInProgressOrders);
        setCanceledOrders(userCanceledOrders);
        setCompletedOrders(userCompletedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate(); // Use navigate for navigation

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        setUser(currentUser); // User is logged in and verified
        setLoading(false); // Stop loading after the user is set

      } else {
        setLoading(false); // Stop loading
        navigate("/login"); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe();
  }, [auth, navigate, setUser]);

  // Show a loading spinner or message while the user state is being checked
  if (loading) {
    return <div>Loading...</div>; // Replace with your own loading component
  }


  return (
    <div className="container">
     <div className="buttons-container">
  <button
    onClick={() => handleButtonPress("InProgress")}
    className={`buttond ${highlightedButton === "InProgress" ? "highlighted" : ""}`}
  >
    {highlightedButton === "InProgress" ? "Currently In Progress" : "InProgress"}
  </button>

  <button
    onClick={() => handleButtonPress("Completed")}
    className={`buttond ${highlightedButton === "Completed" ? "highlighted" : ""}`}
  >
    {highlightedButton === "Completed" ? "Already Completed" : "Completed"}
  </button>

  <button
    onClick={() => handleButtonPress("Canceled")}
    className={`buttond ${highlightedButton === "Canceled" ? "highlighted" : ""}`}
  >
    {highlightedButton === "Canceled" ? "Recently Canceled" : "Canceled"}
  </button>
</div>


      {showInProgress && (
        <div className="orders-list">
          {inProgressOrders.map((serviceOrder) => (
            <div key={serviceOrder.id} className="order-item">
              {serviceOrder.Service === "Car Wash" && (
                <div className="order-details car-wash-order">
                  <span className="order-service">
                    {`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total}`}
                  </span>
                  <div className="order-icons">
                    {getIconSource("bodyType", serviceOrder.BodyType) && (
                      <img
                        src={getIconSource("bodyType", serviceOrder.BodyType)}
                        alt={`${serviceOrder.BodyType} icon`}
                        className="order-icon"
                      />
                    )}
                    {getIconSource("carBrand", serviceOrder.CarBrand) && (
                      <img
                        src={getIconSource("carBrand", serviceOrder.CarBrand)}
                        alt={`${serviceOrder.CarBrand} icon`}
                        className="order-icon"
                      />
                    )}
                    <i className="material-icons" style={{ color: serviceOrder.Color }}>format_paint</i>
                    <span className="order-text">{serviceOrder.PlateNumber}</span>
                    <span className="order-text">{serviceOrder.Preference}</span>
                    <span className="order-text">{serviceOrder.Package}</span>
                  </div>
                  <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
                  <button
                    className = 'buttonc'
                    onClick={() => markOrderAsCanceled(serviceOrder.id, serviceOrder.Service)}
                  >
                    Cancel
                  </button>
                </div>
              )}
              {serviceOrder.Service === "Dry Clean" && (
                <div className="order-details dry-clean-order">
                  <span className="order-service">
                    {`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total}`}
                  </span>
                  {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <span key={index} className="order-item-detail">
                        {item.title.padEnd(37)} x{item.count}
                      </span>
                    ))}
                  <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
                  <button
                    className = 'buttonc'
                    onClick={() => markOrderAsCanceled(serviceOrder.id, serviceOrder.Service)}
                  >
                    Cancel
                  </button>
                </div>
              )}
              {serviceOrder.Service === "Room Clean" && (
                <div className="order-details room-clean-order">
                  <span className="order-service">
                    {`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total}`}
                  </span>
                  {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <span key={index} className="order-item-detail">
                        {item.title.padEnd(37)} x{item.count}
                      </span>
                    ))}
                  <p className="order-supply">Cleaning Supply: {serviceOrder.Supply}</p>
                  <p className="order-package">Package: {serviceOrder.Package} Cleaning</p>
                  <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
                  <button
                    className = 'buttonc'
                    onClick={() => markOrderAsCanceled(serviceOrder.id, serviceOrder.Service)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
          {/* <p className="order-cancel-instructions">Click "Cancel" to cancel an order.</p> */}
        </div>
      )}

      {showCompleted && (
  <div className="orders-list">
    {completedOrders.map((serviceOrder) => (
      <div key={serviceOrder.id} className="order-item">
        {serviceOrder.Service === "Car Wash" && (
          <div className="order-details car-wash-order">
            <span className="order-service">
              {serviceOrder.Service.padEnd(20) + " $" + serviceOrder.Total}
            </span>
            <div className="order-icons">
              {getIconSource("bodyType", serviceOrder.BodyType) && (
                <img
                  src={getIconSource("bodyType", serviceOrder.BodyType)}
                  alt={`${serviceOrder.BodyType} icon`}
                  className="order-icon"
                />
              )}
              {getIconSource("carBrand", serviceOrder.CarBrand) && (
                <img
                  src={getIconSource("carBrand", serviceOrder.CarBrand)}
                  alt={`${serviceOrder.CarBrand} icon`}
                  className="order-icon"
                />
              )}
              <i className="material-icons" style={{ color: serviceOrder.Color }}>format_paint</i>
              <span className="order-text">{serviceOrder.PlateNumber}</span>
              <span className="order-text">{serviceOrder.Preference}</span>
              <span className="order-text">{serviceOrder.Package}</span>
            </div>
            <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
            {/* Review Section */}
            <div className="review-section">
              <span>Service Rating: {serviceOrder.Rating}</span>
              {!['Excellent', 'Fair', 'Poor'].includes(serviceOrder.Rating) && (
                <div className="rating-buttons">
                  {['Excellent', 'Fair', 'Poor'].map((rating, index) => (
                    <button
                     className = 'buttonr'
                      key={index}
                      variant="text"
                      onClick={() => markOrderRating(serviceOrder.id, serviceOrder.Service, rating)}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {serviceOrder.Service === "Dry Clean" && (
          <div className="order-details dry-clean-order">
            <span className="order-service">
              {serviceOrder.Service.padEnd(20) + " $" + serviceOrder.Total}
            </span>
            {Array.isArray(serviceOrder.Items) &&
              serviceOrder.Items.map((item, index) => (
                <span key={index} className="order-item-detail">
                  {item.title.padEnd(37)} x{item.count}
                </span>
              ))}
            <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
            {/* Review Section */}
            <div className="review-section">
              <span>Service Rating: {serviceOrder.Rating}</span>
              {!['Excellent', 'Fair', 'Poor'].includes(serviceOrder.Rating) && (
                <div className="rating-buttons">
                  {['Excellent', 'Fair', 'Poor'].map((rating, index) => (
                    <button
                     className = 'buttonr'
                      key={index}
                      variant="text"
                      onClick={() => markOrderRating(serviceOrder.id, serviceOrder.Service, rating)}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {serviceOrder.Service === "Room Clean" && (
          <div className="order-details room-clean-order">
            <span className="order-service">
              {serviceOrder.Service.padEnd(20) + " $" + serviceOrder.Total}
            </span>
            {Array.isArray(serviceOrder.Items) &&
              serviceOrder.Items.map((item, index) => (
                <span key={index} className="order-item-detail">
                  {item.title.padEnd(37)} x{item.count}
                </span>
              ))}
            <p className="order-supply">Cleaning Supply: {serviceOrder.Supply}</p>
            <p className="order-package">Package: {serviceOrder.Package} Cleaning</p>
            <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
            {/* Review Section */}
            <div className="review-section">
              <span>Service Rating: {serviceOrder.Rating}</span>
              {!['Excellent', 'Fair', 'Poor'].includes(serviceOrder.Rating) && (
                <div className="rating-buttons">
                  {['Excellent', 'Fair', 'Poor'].map((rating, index) => (
                    <button
                     className = 'buttonr'
                      key={index}
                      variant="text"
                      onClick={() => markOrderRating(serviceOrder.id, serviceOrder.Service, rating)}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
)}
{showCanceled && (
  <div className="orders-list">
    {canceledOrders.map((serviceOrder) => (
      <div key={serviceOrder.id} className="order-item">
        {serviceOrder.Service === "Car Wash" && (
          <div className="order-details car-wash-order">
            <span className="order-service">
              {serviceOrder.Service.padEnd(20) + " $" + serviceOrder.Total}
            </span>
            <div className="order-icons">
              {getIconSource("bodyType", serviceOrder.BodyType) && (
                <img
                  src={getIconSource("bodyType", serviceOrder.BodyType)}
                  alt={`${serviceOrder.BodyType} icon`}
                  className="order-icon"
                />
              )}
              {getIconSource("carBrand", serviceOrder.CarBrand) && (
                <img
                  src={getIconSource("carBrand", serviceOrder.CarBrand)}
                  alt={`${serviceOrder.CarBrand} icon`}
                  className="order-icon"
                />
              )}
              <i className="material-icons" style={{ color: serviceOrder.Color }}>format_paint</i>
              <span className="order-text">{serviceOrder.PlateNumber}</span>
              <span className="order-text">{serviceOrder.Preference}</span>
              <span className="order-text">{serviceOrder.Package}</span>
            </div>
          </div>
        )}
        {serviceOrder.Service === "Dry Clean" && (
          <div className="order-details dry-clean-order">
            <span className="order-service">
              {serviceOrder.Service.padEnd(20) + " $" + serviceOrder.Total}
            </span>
            {Array.isArray(serviceOrder.Items) &&
              serviceOrder.Items.map((item, index) => (
                <span key={index} className="order-item-detail">
                  {item.title.padEnd(37)} x{item.count}
                </span>
              ))}
          </div>
        )}
        {serviceOrder.Service === "Room Clean" && (
          <div className="order-details room-clean-order">
            <span className="order-service">
              {serviceOrder.Service.padEnd(20) + " $" + serviceOrder.Total}
            </span>
            {Array.isArray(serviceOrder.Items) &&
              serviceOrder.Items.map((item, index) => (
                <span key={index} className="order-item-detail">
                  {item.title.padEnd(37)} x{item.count}
                </span>
              ))}
            <p className="order-supply">Cleaning Supply: {serviceOrder.Supply}</p>
            <p className="order-package">Package: {serviceOrder.Package} Cleaning</p>
          </div>
        )}
      </div>
    ))}
  </div>
)}

    </div>
  );



};

export default OrderDashboardScreen;
