import { useNavigate } from "react-router-dom";
import { collection, getDocs, Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert
} from "react-bootstrap"; // You can replace this with any library or custom alert
import { Button } from "@mui/material"; // Material UI for buttons
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import useAppStore from "../useAppStore";
import LogInScreen from "./LogInScreen";
import "./AgentScreen.css"; // Assuming styles are defined in a separate CSS file

const AgentScreen = () => {
  const navigate = useNavigate(); // Replacing useNavigation with useNavigate for web
  const auth = FIREBASE_AUTH;
  const {
    name,
    setName,
    phone,
    setPhone,
    address,
    setAddress,
    indexBottom,
    setIndexBottom,
    user,
    setUser,
    visible,
    setVisible,
    email,
    setEmail,
  } = useAppStore();
  const [orders, setOrders] = useState([]);
  const [showAvailable, setShowAvailable] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [highlightedButton, setHighlightedButton] = useState("Available");
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const swipeableRef = useRef(null);
  const [error, setError] = useState(null);



  const handleButtonPress = (status) => {
    setShowAvailable(status === "Available");
    setShowCompleted(status === "Completed");
    setShowMyOrders(status === "MyOrders");
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

        setAvailableOrders([
          ...carWashOrders.filter(
            (serviceOrder) =>
              serviceOrder.Assigned === "No One" &&
              serviceOrder.Status === "InProgress" &&
              serviceOrder.Service === "Car Wash"
          ),
          ...dryCleanOrders.filter(
            (serviceOrder) =>
              serviceOrder.Assigned === "No One" &&
              serviceOrder.Status === "InProgress" &&
              serviceOrder.Service === "Dry Clean"
          ),
          ...roomCleanOrders.filter(
            (serviceOrder) =>
              serviceOrder.Assigned === "No One" &&
              serviceOrder.Status === "InProgress" &&
              serviceOrder.Service === "Room Clean"
          ),
        ]);

        setMyOrders([
          ...carWashOrders.filter(
            (serviceOrder) =>
              serviceOrder.Assigned === user.email &&
              serviceOrder.Status === "InProgress" &&
              serviceOrder.Service === "Car Wash"
          ),
          ...dryCleanOrders.filter(
            (serviceOrder) =>
              serviceOrder.Assigned === user.email &&
              serviceOrder.Status === "InProgress" &&
              serviceOrder.Service === "Dry Clean"
          ),
          ...roomCleanOrders.filter(
            (serviceOrder) =>
              serviceOrder.Assigned === user.email &&
              serviceOrder.Status === "InProgress" &&
              serviceOrder.Service === "Room Clean"
          ),
        ]);

        setCompletedOrders([
          ...carWashOrders.filter(
            (serviceOrder) =>
              serviceOrder.Status === "Completed" &&
              serviceOrder.Assigned === user.email &&
              serviceOrder.Service === "Car Wash"
          ),
          ...dryCleanOrders.filter(
            (serviceOrder) =>
              serviceOrder.Status === "Completed" &&
              serviceOrder.Assigned === user.email &&
              serviceOrder.Service === "Dry Clean"
          ),
          ...roomCleanOrders.filter(
            (serviceOrder) =>
              serviceOrder.Status === "Completed" &&
              serviceOrder.Assigned === user.email &&
              serviceOrder.Service === "Room Clean"
          ),
        ]);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  };


  useEffect(() => {
    const checkAgentAccess = async () => {
      try {
        const user = auth.currentUser; // Get the currently logged-in user

        if (!user) {
          navigate('/help'); // Redirect to home if no user is logged in
          return;
        }

        const userDocRef = doc(FIRESTORE_DB, 'Users', user.email); // Reference to the user's Firestore document
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();

          if (userData.Role !== 'Agent') {
            navigate('/help'); // Redirect to home if the user is not an admin
          }
        } else {
          setError('User data not found');
          navigate('/help'); // Redirect if user data is missing
        }
      } catch (error) {
        setError('Error occurred while checking agent access');
        navigate('/help'); // Redirect on error
      } finally {
        setLoading(false);
      }
    };

    checkAgentAccess();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


//   useEffect(() => {
//     let isMounted = true;
//     const fetchOrders = async () => {
//       try {
//         if (!user || !user.email) {
//           console.error("User is not logged in or has no email.");
//           return;
//         }

//         const carWashOrdersRef = collection(FIRESTORE_DB, "Car-Wash");
//         const dryCleanOrdersRef = collection(FIRESTORE_DB, "Dry-Clean");
//         const roomCleanOrdersRef = collection(FIRESTORE_DB, "Room-Clean");
//         const carWashQuerySnapshot = await getDocs(carWashOrdersRef);
//         const dryCleanQuerySnapshot = await getDocs(dryCleanOrdersRef);
//         const roomCleanQuerySnapshot = await getDocs(roomCleanOrdersRef);
//         const carWashOrders = carWashQuerySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         const dryCleanOrders = dryCleanQuerySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         const roomCleanOrders = roomCleanQuerySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         if (isMounted) {
//           setAvailableOrders([
//             ...carWashOrders.filter(
//               (serviceOrder) =>
//                 serviceOrder.Assigned === "No One" &&
//                 serviceOrder.Status === "InProgress" &&
//                 serviceOrder.Service === "Car Wash"
//             ),
//             ...dryCleanOrders.filter(
//               (serviceOrder) =>
//                 serviceOrder.Assigned === "No One" &&
//                 serviceOrder.Status === "InProgress" &&
//                 serviceOrder.Service === "Dry Clean"
//             ),
//             ...roomCleanOrders.filter(
//               (serviceOrder) =>
//                 serviceOrder.Assigned === "No One" &&
//                 serviceOrder.Status === "InProgress" &&
//                 serviceOrder.Service === "Room Clean"
//             ),
//           ]);
//           setMyOrders([
//             ...carWashOrders.filter(
//               (serviceOrder) =>
//                 serviceOrder.Assigned === user.email &&
//                 serviceOrder.Status === "InProgress" &&
//                 serviceOrder.Service === "Car Wash"
//             ),
//             ...dryCleanOrders.filter(
//               (serviceOrder) =>
//                 serviceOrder.Assigned === user.email &&
//                 serviceOrder.Status === "InProgress" &&
//                 serviceOrder.Service === "Dry Clean"
//             ),
//             ...roomCleanOrders.filter(
//               (serviceOrder) =>
//                 serviceOrder.Assigned === user.email &&
//                 serviceOrder.Status === "InProgress" &&
//                 serviceOrder.Service === "Room Clean"
//             ),
//           ]);
//           setCompletedOrders([
//             ...carWashOrders.filter(
//               (serviceOrder) =>
//                 serviceOrder.Status === "Completed" &&
//                 serviceOrder.Assigned === user.email &&
//                 serviceOrder.Service === "Car Wash"
//             ),
//             ...dryCleanOrders.filter(
//               (serviceOrder) =>
//                 serviceOrder.Status === "Completed" &&
//                 serviceOrder.Assigned === user.email &&
//                 serviceOrder.Service === "Dry Clean"
//             ),
//             ...roomCleanOrders.filter(
//               (serviceOrder) =>
//                 serviceOrder.Status === "Completed" &&
//                 serviceOrder.Assigned === user.email &&
//                 serviceOrder.Service === "Room Clean"
//             ),
//           ]);
//         }
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };
//     fetchOrders();

//     return () => {
//       isMounted = false;
//     };
//   }, [user]);

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

//   const openSmsApp = (phoneNumber, message) => {
//     const url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
//     window.open(url);
//   };

  const claimOrder = async (orderId, serviceType, clientPhone) => {
    try {
      if (serviceType === "Dry Clean") {
        const dryCleanOrdersRef = collection(FIRESTORE_DB, "Dry-Clean");
        await setDoc(doc(dryCleanOrdersRef, orderId), { Assigned: user.email }, { merge: true });
      } else if (serviceType === "Car Wash") {
        const carWashOrdersRef = collection(FIRESTORE_DB, "Car-Wash");
        await setDoc(doc(carWashOrdersRef, orderId), { Assigned: user.email }, { merge: true });
      } else if (serviceType === "Room Clean") {
        const roomCleanOrdersRef = collection(FIRESTORE_DB, "Room-Clean");
        await setDoc(doc(roomCleanOrdersRef, orderId), { Assigned: user.email }, { merge: true });
      }



      setAvailableOrders((prevOrders) =>
        prevOrders.filter((serviceOrder) => serviceOrder.id !== orderId)
      );
      setMyOrders((prevOrders) => [
        {
          id: orderId,
          ...availableOrders.find((serviceOrder) => serviceOrder.id === orderId),
        },
        ...prevOrders.filter((serviceOrder) => serviceOrder.id !== orderId),
      ]);
    } catch (error) {
      console.error("Error claiming order:", error);
    }
  };

  const markOrderAsComplete = async (orderId, serviceType, serviceTotal, servicePayment) => {
    try {
      if (serviceType === "Dry Clean") {
        const dryCleanOrdersRef = collection(FIRESTORE_DB, "Dry-Clean");
        await setDoc(doc(dryCleanOrdersRef, orderId), { Status: "Completed" }, { merge: true });
      } else if (serviceType === "Car Wash") {
        const carWashOrdersRef = collection(FIRESTORE_DB, "Car-Wash");
        await setDoc(doc(carWashOrdersRef, orderId), { Status: "Completed" }, { merge: true });
      } else if (serviceType === "Room Clean") {
        const roomCleanOrdersRef = collection(FIRESTORE_DB, "Room-Clean");
        await setDoc(doc(roomCleanOrdersRef, orderId), { Status: "Completed" }, { merge: true });
      }

      setMyOrders((prevOrders) => prevOrders.filter((serviceOrder) => serviceOrder.id !== orderId));
      setCompletedOrders((prevOrders) => [
        {
          id: orderId,
          ...myOrders.find((serviceOrder) => serviceOrder.id === orderId),
        },
        ...prevOrders.filter((serviceOrder) => serviceOrder.id !== orderId),
      ]);
    } catch (error) {
      console.error("Error marking order as complete:", error);
    }
  };

  const setEstimatedServiceTime = async (orderId, serviceType, setDate) => {
    try {
      if (serviceType === "Dry Clean") {
        const dryCleanOrdersRef = collection(FIRESTORE_DB, "Dry-Clean");
        await setDoc(doc(dryCleanOrdersRef, orderId), { Note: setDate }, { merge: true });
      } else if (serviceType === "Car Wash") {
        const carWashOrdersRef = collection(FIRESTORE_DB, "Car-Wash");
        await setDoc(doc(carWashOrdersRef, orderId), { Note: setDate }, { merge: true });
      }

      setMyOrders((prevOrders) =>
        prevOrders.map((serviceOrder) => (serviceOrder.id === orderId ? { ...serviceOrder, Note: setDate } : serviceOrder))
      );
    } catch (error) {
      console.error("Error setting estimated service time:", error);
    }
  };

//

  if (!user || !user.emailVerified) {
    return <LogInScreen />;
  }



  return (
    <div className="container">
     <button className="button-earning" onClick={() => navigate("/earnings")}>
      Earning Overview
    </button>
    <div className="buttons-container">
      <button
        onClick={() => handleButtonPress("Available")}
        className={`buttond ${highlightedButton === "Available" ? "highlighted" : ""}`}
      >
        {highlightedButton === "Available" ? "Currently Available" : "Available"}
      </button>

      <button
        onClick={() => handleButtonPress("MyOrders")}
        className={`buttond ${highlightedButton === "MyOrders" ? "highlighted" : ""}`}
      >
        {highlightedButton === "MyOrders" ? "Currently My Orders" : "My Orders"}
      </button>

      <button
        onClick={() => handleButtonPress("Completed")}
        className={`buttond ${highlightedButton === "Completed" ? "highlighted" : ""}`}
      >
        {highlightedButton === "Completed" ? "Already Completed" : "Completed"}
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
              <i className="material-icons" style={{ color: serviceOrder.Color }}>
                format_paint
              </i>
              <span className="order-text">{serviceOrder.PlateNumber}</span>
              <span className="order-text">{serviceOrder.Preference}</span>
            </div>
            <p className="order-date">{serviceOrder.Address}</p>
            <p className="order-date">Name: {serviceOrder.Name}</p>
            <p className="order-date">Phone: {serviceOrder.Phone}</p>
            <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
            <button className="claim-button" onClick={() => claimOrder(serviceOrder.id, serviceOrder.Service, serviceOrder.Phone)}>
              Claim
            </button>

          </div>
        )}
        {serviceOrder.Service === "Dry Clean" && (
          <div className="order-details dry-clean-order">
            <span className="order-service">{`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total} ${serviceOrder.Payment}`}</span>
            {Array.isArray(serviceOrder.Items) &&
              serviceOrder.Items.map((item, index) => (
                <span key={index} className="order-item-detail">
                  {item.title.padEnd(37)} x{item.count}
                </span>
              ))}
            <p className="order-date">{serviceOrder.Address}</p>
            <p className="order-date">Name: {serviceOrder.Name}</p>
            <p className="order-date">Phone: {serviceOrder.Phone}</p>
            <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
            <button className="claim-button" onClick={() => claimOrder(serviceOrder.id, serviceOrder.Service, serviceOrder.Phone)}>
              Claim
            </button>
          </div>
        )}
        {serviceOrder.Service === "Room Clean" && (
          <div className="order-details room-clean-order">
            <span className="order-service">{`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total} ${serviceOrder.Payment}`}</span>
            {Array.isArray(serviceOrder.Items) &&
              serviceOrder.Items.map((item, index) => (
                <span key={index} className="order-item-detail">
                  {item.title.padEnd(37)} x{item.count}
                </span>
              ))}
            <p className="order-supply">Cleaning Supply: {serviceOrder.Supply}</p>
            <p className="order-package">Package: {serviceOrder.Package} Cleaning</p>
            <p className="order-date">{serviceOrder.Address}</p>
            <p className="order-date">Name: {serviceOrder.Name}</p>
            <p className="order-date">Phone: {serviceOrder.Phone}</p>
            <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
            <button className="claim-button" onClick={() => claimOrder(serviceOrder.id, serviceOrder.Service, serviceOrder.Phone)}>
              Claim
            </button>
          </div>
        )}
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
            </div>
            <p className="order-date">{serviceOrder.Address}</p>
            <p className="rating-text"> {`Service Rating: ${serviceOrder.Rating}`}</p>
          </div>
        )}
        {serviceOrder.Service === "Dry Clean" && (
          <div className="order-details dry-clean-order">
            <span className="order-service">{`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total} ${serviceOrder.Payment}`}</span>
            {Array.isArray(serviceOrder.Items) &&
              serviceOrder.Items.map((item, index) => (
                <span key={index} className="order-item-detail">
                  {item.title.padEnd(37)} x{item.count}
                </span>
              ))}
            <p className="order-date">{serviceOrder.Address}</p>
            <p className="rating-text"> {`Service Rating: ${serviceOrder.Rating}`}</p>
          </div>
        )}
        {serviceOrder.Service === "Room Clean" && (
          <div className="order-details room-clean-order">
            <span className="order-service">{`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total} ${serviceOrder.Payment}`}</span>
            {Array.isArray(serviceOrder.Items) &&
              serviceOrder.Items.map((item, index) => (
                <span key={index} className="order-item-detail">
                  {item.title.padEnd(37)} x{item.count}
                </span>
              ))}
            <p className="order-supply">Cleaning Supply: {serviceOrder.Supply}</p>
            <p className="order-package">Package: {serviceOrder.Package} Cleaning</p>
            <p className="order-date">{serviceOrder.Address}</p>
            <p className="rating-text"> {`Service Rating: ${serviceOrder.Rating}`}</p>
          </div>
        )}
      </div>
    ))}
  </div>
)}
{showMyOrders && (
  <div className="orders-list">
    {myOrders.map((serviceOrder) => (
      <div key={serviceOrder.id} className="order-item">
        {serviceOrder.Service === "Car Wash" && (
          <div className="order-details car-wash-order">
            <span className="order-service">{`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total} ${serviceOrder.Payment}`}</span>
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
              <i className="material-icons" style={{ color: serviceOrder.Color }}>
                format_paint
              </i>
              <span className="order-text">{serviceOrder.PlateNumber}</span>
              <span className="order-text">{serviceOrder.Preference}</span>
            </div>
            <p className="order-date">{serviceOrder.Address}</p>
            <p className="order-note">{serviceOrder.Note}</p>
            <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
            <button className="done-button" onClick={() => markOrderAsComplete(serviceOrder.id, serviceOrder.Service, serviceOrder.Total, serviceOrder.Payment)}>
              Done
            </button>
          </div>
        )}
        {serviceOrder.Service === "Dry Clean" && (
          <div className="order-details dry-clean-order">
            <span className="order-service">{`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total} ${serviceOrder.Payment}`}</span>
            {Array.isArray(serviceOrder.Items) &&
              serviceOrder.Items.map((item, index) => (
                <span key={index} className="order-item-detail">
                  {item.title.padEnd(37)} x{item.count}
                </span>
              ))}
            <p className="order-note">{serviceOrder.Note}</p>
            <p className="order-date">{serviceOrder.Address}</p>
            <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
            <button className="done-button" onClick={() => markOrderAsComplete(serviceOrder.id, serviceOrder.Service, serviceOrder.Total, serviceOrder.Payment)}>
              Done
            </button>
          </div>
        )}
        {serviceOrder.Service === "Room Clean" && (
          <div className="order-details room-clean-order">
            <span className="order-service">{`${serviceOrder.Service.padEnd(20)} $${serviceOrder.Total} ${serviceOrder.Payment}`}</span>
            {Array.isArray(serviceOrder.Items) &&
              serviceOrder.Items.map((item, index) => (
                <span key={index} className="order-item-detail">
                  {item.title.padEnd(37)} x{item.count}
                </span>
              ))}
            <p className="order-supply">Cleaning Supply: {serviceOrder.Supply}</p>
            <p className="order-package">Package: {serviceOrder.Package} Cleaning</p>
            <p className="order-note">{serviceOrder.Note}</p>
            <p className="order-date">{serviceOrder.Address}</p>
            <p className="order-date">Scheduled at: {serviceOrder.Date}</p>
            <button className="done-button" onClick={() => markOrderAsComplete(serviceOrder.id, serviceOrder.Service, serviceOrder.Total, serviceOrder.Payment)}>
              Done
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
)}


  </div>

  );
};

export default AgentScreen;
