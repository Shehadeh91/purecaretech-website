import React, { useEffect, useState } from "react";
import { getDocs, collection, doc , getDoc} from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Button, IconButton } from "@mui/material"; // Use Material UI for buttons
import useAppStore from "../useAppStore";
import LogInScreen from "./LogInScreen";
import "./AdminScreen.css"; // Add necessary styles here

const AdminScreen = () => {
    const auth = FIREBASE_AUTH;
    const { user, setUser, setVisible } = useAppStore();
    const [showAvailable, setShowAvailable] = useState(true);
    const [showCompleted, setShowCompleted] = useState(false);
    const [showAssigned, setShowAssigned] = useState(false);
    const [showCanceled, setShowCanceled] = useState(false);
    const [highlightedButton, setHighlightedButton] = useState("Available");
    const [availableOrders, setAvailableOrders] = useState([]);
    const [assignedOrders, setAssignedOrders] = useState([]);
    const [canceledOrders, setCanceledOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const user = auth.currentUser; // Get the currently logged-in user

        if (!user) {
          navigate('/'); // Redirect to home if no user is logged in
          return;
        }

        const userDocRef = doc(FIRESTORE_DB, 'Users', user.email); // Reference to the user's Firestore document
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();

          if (userData.Role !== 'Admin') {
            navigate('/help'); // Redirect to home if the user is not an admin
          }
        } else {
          setError('User data not found');
          navigate('/help'); // Redirect if user data is missing
        }
      } catch (error) {
        setError('Error occurred while checking admin access');
        navigate('/help'); // Redirect on error
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }




  const handleButtonPress = (status) => {
    setShowAvailable(status === "Available");
    setShowCompleted(status === "Completed");
    setShowAssigned(status === "Assigned");
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
        // Filter orders by user's email
        //const userOrders = data.filter((carWashOrder) => carWashOrder.Email === user.email);
          // Update state by reversing the carWashOrder of new orders
          setAvailableOrders([
            ...carWashOrders
              .filter((serviceOrder) => serviceOrder.Assigned === "No One")
              .reverse(),
            ...dryCleanOrders
              .filter((serviceOrder) => serviceOrder.Assigned === "No One")
              .reverse(),
              ...roomCleanOrders
              .filter((serviceOrder) => serviceOrder.Assigned === "No One")
              .reverse(),
          ]);
          setAssignedOrders([
            ...carWashOrders
              .filter((serviceOrder) => serviceOrder.Assigned !== "No One")
              .reverse(),
            ...dryCleanOrders
              .filter((serviceOrder) => serviceOrder.Assigned !== "No One")
              .reverse(),
              ...roomCleanOrders
              .filter((serviceOrder) => serviceOrder.Assigned !== "No One")
              .reverse(),
          ]);
          setCompletedOrders([
            ...carWashOrders
              .filter((serviceOrder) => serviceOrder.Status === "Completed")
              .reverse(),
            ...dryCleanOrders
              .filter((serviceOrder) => serviceOrder.Status === "Completed")
              .reverse(),
              ...roomCleanOrders
              .filter((serviceOrder) => serviceOrder.Status === "Completed")
              .reverse(),
          ]);
          setCanceledOrders([
            ...carWashOrders
              .filter((serviceOrder) => serviceOrder.Status === "Canceled")
              .reverse(),
            ...dryCleanOrders
              .filter((serviceOrder) => serviceOrder.Status === "Completed")
              .reverse(),
              ...roomCleanOrders
              .filter((serviceOrder) => serviceOrder.Status === "Completed")
              .reverse(),
          ]);
      } catch (error) {
       // console.error("Error fetching orders:", error);
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

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((currentUser) => {
//       setUser(currentUser);
//     });
//     return unsubscribe;
//   }, [auth]);

  if (!user || !user.emailVerified) {
    return <LogInScreen />;
  }
  return (
    <div className="container">
  <button className="button-manage-users-orders" onClick={() => navigate("/users")}>
      Manage Users
    </button>
      <div className="buttons-container">
        <button
          onClick={() => handleButtonPress("Available")}
          className={`buttond ${highlightedButton === "Available" ? "highlighted" : ""}`}
        >
          {highlightedButton === "Available" ? "Currently Available" : "Available"}
        </button>

        <button
          onClick={() => handleButtonPress("Assigned")}
          className={`buttond ${highlightedButton === "Assigned" ? "highlighted" : ""}`}
        >
          {highlightedButton === "Assigned" ? "Already Assigned" : "Assigned"}
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

      {showAvailable && (
        <div className="orders-list">
          {availableOrders.map((serviceOrder) => (
            <div key={serviceOrder.id} className="order-item">
              {serviceOrder.Service === "Car Wash" && (
                <div className="order-details car-wash-order">
                  <span className="order-service">{`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total} ${serviceOrder.Payment}`}</span>
                  <div className="order-icons">
                    {getIconSource("bodyType", serviceOrder.BodyType) && (
                      <img src={getIconSource("bodyType", serviceOrder.BodyType)} alt={`${serviceOrder.BodyType} icon`} className="order-icon" />
                    )}
                    {getIconSource("carBrand", serviceOrder.CarBrand) && (
                      <img src={getIconSource("carBrand", serviceOrder.CarBrand)} alt={`${serviceOrder.CarBrand} icon`} className="order-icon" />
                    )}
                    <i className="material-icons" style={{ color: serviceOrder.Color }}>format_paint</i>
                    <span className="order-text">{serviceOrder.PlateNumber}</span>
                    <span className="order-text">{serviceOrder.Preference}</span>
                  </div>
                  <p className="order-date"> {serviceOrder.Address}</p>
                  <p className="order-date">Name: {serviceOrder.Name}</p>
                  <p className="order-date">Phone: {serviceOrder.Name}</p>
                  <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
                </div>
              )}
              {serviceOrder.Service === "Dry Clean" && (
                <div className="order-details dry-clean-order">
                  <span className="order-service">{`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total} ${serviceOrder.Payment}`}</span>
                  {Array.isArray(serviceOrder.Items) && serviceOrder.Items.map((item, index) => (
                    <span key={index} className="order-item-detail">{item.title.padEnd(37)} x{item.count}</span>
                  ))}
                  <p className="order-date"> {serviceOrder.Address}</p>
                  <p className="order-date">Name: {serviceOrder.Name}</p>
                  <p className="order-date">Phone: {serviceOrder.Name}</p>
                  <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
                </div>
              )}
              {serviceOrder.Service === "Room Clean" && (
                <div className="order-details room-clean-order">
                  <span className="order-service">{`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total} ${serviceOrder.Payment}`}</span>
                  {Array.isArray(serviceOrder.Items) && serviceOrder.Items.map((item, index) => (
                    <span key={index} className="order-item-detail">{item.title.padEnd(37)} x{item.count}</span>
                  ))}
                  <p className="order-supply">Cleaning Supply: {serviceOrder.Supply}</p>
                  <p className="order-package">Package: {serviceOrder.Package} Cleaning</p>
                  <p className="order-date"> {serviceOrder.Address}</p>
                  <p className="order-date">Name: {serviceOrder.Name}</p>
                  <p className="order-date">Phone: {serviceOrder.Name}</p>
                  <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAssigned && (
        <div className="orders-list">
          {assignedOrders.map((serviceOrder) => (
            <div key={serviceOrder.id} className="order-item">
              {serviceOrder.Service === "Car Wash" && (
                <div className="order-details car-wash-order">
                  <span className="order-service">{`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total} ${serviceOrder.Payment}`}</span>
                  <div className="order-icons">
                    {getIconSource("bodyType", serviceOrder.BodyType) && (
                      <img src={getIconSource("bodyType", serviceOrder.BodyType)} alt={`${serviceOrder.BodyType} icon`} className="order-icon" />
                    )}
                    {getIconSource("carBrand", serviceOrder.CarBrand) && (
                      <img src={getIconSource("carBrand", serviceOrder.CarBrand)} alt={`${serviceOrder.CarBrand} icon`} className="order-icon" />
                    )}
                    <i className="material-icons" style={{ color: serviceOrder.Color }}>format_paint</i>
                    <span className="order-text">{serviceOrder.PlateNumber}</span>
                    <span className="order-text">{serviceOrder.Preference}</span>
                  </div>
                  <p className="order-date"> {serviceOrder.Address}</p>
                  <p className="order-date">Name: {serviceOrder.Name}</p>
                  <p className="order-date">Phone: {serviceOrder.Name}</p>
                  <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
                  <p className="assigned-text">{`Assigned: ${serviceOrder.Assigned}`}</p>
                </div>
              )}
              {/* Similar structure for Dry Clean and Room Clean */}
            </div>
          ))}
        </div>
      )}
      {showCompleted && (
  <div className="orders-list">
    {completedOrders.map((serviceOrder) => (
      <div key={serviceOrder.id} className="order-item">
        {serviceOrder.Service === "Car Wash" && (
          <div className="order-details car-wash-order">
            <span className="order-service">{`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total} ${serviceOrder.Payment}`}</span>
            <div className="order-icons">
              {getIconSource("bodyType", serviceOrder.BodyType) && (
                <img src={getIconSource("bodyType", serviceOrder.BodyType)} alt={`${serviceOrder.BodyType} icon`} className="order-icon" />
              )}
              {getIconSource("carBrand", serviceOrder.CarBrand) && (
                <img src={getIconSource("carBrand", serviceOrder.CarBrand)} alt={`${serviceOrder.CarBrand} icon`} className="order-icon" />
              )}
              <i className="material-icons" style={{ color: serviceOrder.Color }}>format_paint</i>
              <span className="order-text">{serviceOrder.PlateNumber}</span>
              <span className="order-text">{serviceOrder.Preference}</span>
            </div>
            <p className="order-date"> {serviceOrder.Address}</p>
                  <p className="order-date">Name: {serviceOrder.Name}</p>
                  <p className="order-date">Phone: {serviceOrder.Name}</p>
            <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
            <p className="assigned-text">{`Assigned: ${serviceOrder.Assigned}`}</p>
            <p className="rating-text"> {`Service Rating: ${serviceOrder.Rating}`}</p>
          </div>
        )}
        {serviceOrder.Service === "Dry Clean" && (
          <div className="order-details dry-clean-order">
            <span className="order-service">{`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total} ${serviceOrder.Payment}`}</span>
            {Array.isArray(serviceOrder.Items) && serviceOrder.Items.map((item, index) => (
              <span key={index} className="order-item-detail">{item.title.padEnd(37)} x{item.count}</span>
            ))}
            <p className="order-date"> {serviceOrder.Address}</p>
                  <p className="order-date">Name: {serviceOrder.Name}</p>
                  <p className="order-date">Phone: {serviceOrder.Name}</p>
            <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
            <p className="assigned-text">{`Assigned: ${serviceOrder.Assigned}`}</p>
            <p className="rating-text"> {`Service Rating: ${serviceOrder.Rating}`}</p>
          </div>
        )}
        {serviceOrder.Service === "Room Clean" && (
          <div className="order-details room-clean-order">
            <span className="order-service">{`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total} ${serviceOrder.Payment}`}</span>
            {Array.isArray(serviceOrder.Items) && serviceOrder.Items.map((item, index) => (
              <span key={index} className="order-item-detail">{item.title.padEnd(37)} x{item.count}</span>
            ))}
            <p className="order-supply">Cleaning Supply: {serviceOrder.Supply}</p>
            <p className="order-package">Package: {serviceOrder.Package} Cleaning</p>
            <p className="order-date"> {serviceOrder.Address}</p>
                  <p className="order-date">Name: {serviceOrder.Name}</p>
                  <p className="order-date">Phone: {serviceOrder.Name}</p>
            <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
            <p className="assigned-text">{`Assigned: ${serviceOrder.Assigned}`}</p>
            <p className="rating-text"> {`Service Rating: ${serviceOrder.Rating}`}</p>
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
            <span className="order-service">{`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total} ${serviceOrder.Payment}`}</span>
            <div className="order-icons">
              {getIconSource("bodyType", serviceOrder.BodyType) && (
                <img src={getIconSource("bodyType", serviceOrder.BodyType)} alt={`${serviceOrder.BodyType} icon`} className="order-icon" />
              )}
              {getIconSource("carBrand", serviceOrder.CarBrand) && (
                <img src={getIconSource("carBrand", serviceOrder.CarBrand)} alt={`${serviceOrder.CarBrand} icon`} className="order-icon" />
              )}
              <i className="material-icons" style={{ color: serviceOrder.Color }}>format_paint</i>
              <span className="order-text">{serviceOrder.PlateNumber}</span>
              <span className="order-text">{serviceOrder.Preference}</span>
            </div>
            <p className="order-date"> {serviceOrder.Address}</p>
                  <p className="order-date">Name: {serviceOrder.Name}</p>
                  <p className="order-date">Phone: {serviceOrder.Name}</p>
            <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
            <p className="assigned-text">{`Assigned: ${serviceOrder.Assigned}`}</p>
            </div>
        )}
        {serviceOrder.Service === "Dry Clean" && (
          <div className="order-details dry-clean-order">
            <span className="order-service">{`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total} ${serviceOrder.Payment}`}</span>
            {Array.isArray(serviceOrder.Items) && serviceOrder.Items.map((item, index) => (
              <span key={index} className="order-item-detail">{item.title.padEnd(37)} x{item.count}</span>
            ))}
            <p className="order-date"> {serviceOrder.Address}</p>
                  <p className="order-date">Name: {serviceOrder.Name}</p>
                  <p className="order-date">Phone: {serviceOrder.Name}</p>
            <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
            <p className="assigned-text">{`Assigned: ${serviceOrder.Assigned}`}</p>
            </div>
        )}
        {serviceOrder.Service === "Room Clean" && (
          <div className="order-details room-clean-order">
            <span className="order-service">{`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total} ${serviceOrder.Payment}`}</span>
            {Array.isArray(serviceOrder.Items) && serviceOrder.Items.map((item, index) => (
              <span key={index} className="order-item-detail">{item.title.padEnd(37)} x{item.count}</span>
            ))}
            <p className="order-supply">Cleaning Supply: {serviceOrder.Supply}</p>
            <p className="order-package">Package: {serviceOrder.Package} Cleaning</p>
            <p className="order-date"> {serviceOrder.Address}</p>
                  <p className="order-date">Name: {serviceOrder.Name}</p>
                  <p className="order-date">Phone: {serviceOrder.Name}</p>
            <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
            <p className="assigned-text">{`Assigned: ${serviceOrder.Assigned}`}</p>
            </div>
        )}
      </div>
    ))}
  </div>
)}

    </div>
  );

};


export default AdminScreen;