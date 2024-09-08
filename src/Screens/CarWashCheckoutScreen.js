import React, { useEffect, useState } from "react";
import { useRoute, useNavigate } from "react-router-dom";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import useAppStore from "../useAppStore";
import useCarWashStore from "../useCarWashStore";
import LogInScreen from "./LogInScreen";
import './CarWashCheckoutScreen.css'; // External CSS file

const CarWashCheckoutScreen = () => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const route = useRoute();
  const navigate = useNavigate();

  const { name, address, user, setUser, setVisible, email, phone } = useAppStore();
  const {
    serviceTime,
    setServiceTime,
    getFormattedDate,
    carBrand,
    setCarBrand,
    bodyStyle,
    setBodyStyle,
    currentColor,
    setCurrentColor,
    carPlate,
    setCarPlate,
    deliveryCost,
    setDeliveryCost,
    prefrenceCost,
    setPrefrenceCost,
    bodyStyleCost,
    setBodyStyleCost,
    totalCost,
    updateTotalCost,
    note,
    setNote,
    deliveryOption,
    setDeliveryOption,
    packageCost,
    setPackageCost,
    packageOption,
    setPackageOption,
    prefrenceOption,
    setPrefrenceOption,
    paymentOption,
    setPaymentOption,
    date,
    setDate,
    rating
  } = useCarWashStore();


  const API_URL = 'https://stripeapiendpoint-p2xcnmarfq-uc.a.run.app';

  const addCarWashOrder = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user || !user.emailVerified) {
        navigate("/login");
        return;
      }
      const userId = user.email || "UnknownUser";
      const counterDocRef = doc(FIRESTORE_DB, "OrderCounters", userId);
      const counterDocSnap = await getDoc(counterDocRef);
      let orderNumber = 1;
      if (counterDocSnap.exists()) {
        const counterData = counterDocSnap.data();
        if (counterData && counterData.orderNumber) {
          orderNumber = counterData.orderNumber + 1;
        }
      }
      const orderDocRef = doc(FIRESTORE_DB, "Car-Wash", `${userId}_${orderNumber}`);
      await setDoc(orderDocRef, {
        Email: userId,
        Name: name,
        Phone: phone,
        Address: address,
        CarBrand: carBrand,
        BodyType: bodyStyle,
        Preference: prefrenceOption,
        Package: packageOption,
        Color: currentColor,
        PlateNumber: carPlate,
        Payment: paymentOption,
        Note: note,
        Delivery: deliveryOption,
        Total: ((bodyStyleCost + prefrenceCost + packageCost + deliveryCost + 4 + ((bodyStyleCost + prefrenceCost + packageCost + deliveryCost + 4) * 0.05)).toFixed(2)),
        Status: "InProgress",
        Assigned: "No One",
        Service: "Car Wash",
        EstimateTime: serviceTime,
        Date: date,
        Rating: rating
      });
      await setDoc(counterDocRef, { orderNumber: orderNumber }, { merge: true });

      navigate("/orderComplete");
    } catch (error) {
      console.error("Error adding Car Wash order:", error);
      alert('Order Failed', 'Something went wrong while placing your order. Please try again.');
    }
  };

  const handleConfirmOrder = async () => {
    setIsLoading(true);
    try {
      await addCarWashOrder();
    } catch (error) {
      console.error('Error confirming order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(currentUser => {
      setUser(currentUser);
      setVisible(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!user || !user.emailVerified) return;
        const userDocRef = collection(FIRESTORE_DB, 'Users');
        const querySnapshot = await getDocs(userDocRef);
        const userData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).find(data => data.userId === user.uid);
        if (userData) setUserInfo(userData);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, [user]);

  if (!user || !user.emailVerified) {
    return <LogInScreen />;
  }

  return (
    <div className="checkout-container">
      <h2 className="total-title">
        Total: ${(bodyStyleCost + prefrenceCost + packageCost + deliveryCost + 4 + ((bodyStyleCost + prefrenceCost + packageCost + deliveryCost + 4) * 0.05)).toFixed(2)}
      </h2>

      <div className="checkout-card">
        <h3>Location</h3>
        <p>{address}</p>
      </div>

      <div className="checkout-card">
        <h3>{deliveryOption}</h3>
        <p>{deliveryOption === "Schedule" ? date?.toString() : serviceTime}</p>
      </div>

      <div className="checkout-card">
        <h3>{`${packageOption} ${prefrenceOption} Car Wash`}</h3>
        <div className="car-details">
          <p>Brand: {carBrand}</p>
          <p>Style: {bodyStyle}</p>
          <p>Color: {currentColor}</p>
          <p>Plate: {carPlate}</p>
        </div>
      </div>

      <div className="checkout-card">
        <h3>Payment</h3>
        <label>
          <input
            type="radio"
            value="Cash"
            checked={paymentOption === "Cash"}
            onChange={() => setPaymentOption("Cash")}
            disabled={isLoading}
          />
          Cash
        </label>
        <label>
          <input
            type="radio"
            value="Card"
            checked={paymentOption === "Card"}
            onChange={() => setPaymentOption("Card")}
            disabled={isLoading}
          />
          Card
        </label>
      </div>

      <div className="checkout-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${(bodyStyleCost + prefrenceCost + packageCost + deliveryCost).toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Service Fee</span>
          <span>$4.00</span>
        </div>
        <div className="summary-row">
          <span>Taxes & Other Fees</span>
          <span>${((bodyStyleCost + prefrenceCost + packageCost + deliveryCost + 4) * 0.05).toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>${(bodyStyleCost + prefrenceCost + packageCost + deliveryCost + 4 + ((bodyStyleCost + prefrenceCost + packageCost + deliveryCost + 4) * 0.05)).toFixed(2)}</span>
        </div>
      </div>

      {isLoading && <div className="loading">Loading...</div>}

      <button
        className="confirm-button"
        onClick={handleConfirmOrder}
        disabled={isLoading}
      >
        Confirm
      </button>
    </div>
  );
};

export default CarWashCheckoutScreen;
