import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import useAppStore from "../useAppStore";
import useCarWashStore from "../useCarWashStore";
import CheckoutForm from "../Components/CheckoutForm";
import LogInScreen from "./LogInScreen";
import './CarWashCheckoutScreen.css'; // External CSS file

const CarWashCheckoutScreen = () => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showCardForm, setShowCardForm] = useState(true);
  const [paymentOption, setPaymentOption] = useState("Card");
  const navigate = useNavigate();

  const { name, address, user, setUser, setVisible, email, phone } = useAppStore();
  const {
    serviceTime,
    carBrand,
    bodyStyle,
    currentColor,
    carPlate,
    deliveryCost,
    prefrenceCost,
    bodyStyleCost,
    packageCost,
    deliveryOption,
    packageOption,
    prefrenceOption,
    date,
    rating,
    note
  } = useCarWashStore();

  const API_URL = 'https://stripeapiendpoint-p2xcnmarfq-uc.a.run.app';

  const handlePaymentSuccess = () => {
    alert("Payment Successful!");
    handleConfirmOrder();
  };

  const handlePaymentFail = (errorMessage) => {
    alert(`Payment Failed: ${errorMessage}`);
  };
  const commonColors = [
    { colorName: "White", colorCode: "#FFFFFF" },
    { colorName: "Black", colorCode: "#000000" },
    { colorName: "Gray", colorCode: "#808080" },
    { colorName: "Silver", colorCode: "#C0C0C0" },
    { colorName: "Blue", colorCode: "#0000FF" },
    { colorName: "Red", colorCode: "#FF0000" },
    { colorName: "Brown", colorCode: "#8B4513" },
    { colorName: "Green", colorCode: "#008000" },
    { colorName: "Orange", colorCode: "#FFA500" },
    { colorName: "Maroon", colorCode: "#A52A2A" },
    { colorName: "Gold", colorCode: "#FFD700" },
    { colorName: "Cyan", colorCode: "#00FFFF" }
  ];
  const addCarWashOrder = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) {
        console.error("No authenticated user found");
        window.location.href = "/login";
        return;
      }

      if (!user.emailVerified) {
        console.error("User email is not verified");
        alert("Please verify your email before placing the order.");
        return;
      }

      const userId = user.email || "UnknownUser";
      const counterDocRef = doc(FIRESTORE_DB, "OrderCounters", userId);
      const counterDocSnap = await getDoc(counterDocRef);

      // Generate order number
      let orderNumber = 1;
      if (counterDocSnap.exists()) {
        const counterData = counterDocSnap.data();
        if (counterData && counterData.orderNumber) {
          orderNumber = counterData.orderNumber + 1;
        }
      }

      // Reference to the Car-Wash order document
      const orderDocRef = doc(FIRESTORE_DB, "Car-Wash", `${userId}_${orderNumber}`);

      // Write the order to Firestore
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
        Rating: rating,
      });

      // Update order number in the OrderCounters collection
      await setDoc(counterDocRef, { orderNumber: orderNumber }, { merge: true });
 // Send SMS notification
 const message = "Hooray! There's a new Car Wash order ready for you to fulfill! " + paymentOption;
 const response = await fetch(`${API_URL}/send-order-confirmation-sms`, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json',
   },
   body: JSON.stringify({ message }),
 });

 if (!response.ok) {
   throw new Error('Failed to send SMS');
 }

 console.log("SMS notification sent successfully");
      console.log("Car wash order added successfully");
      window.location.href = "/orderComplete";
    } catch (error) {
      console.error("Error adding car wash order:", error);
      alert("Order Failed! Please try again.");
    }
  };


  const handleConfirmOrder = async () => {
    setIsLoading(true);
    try {
      // Add the car wash order
      await addCarWashOrder();
      console.log("Car wash order has been sent");






    } catch (error) {
      console.error("Error confirming order or sending SMS:", error);
      alert("There was an issue confirming your order or sending the SMS notification.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentOptionChange = (option) => {
    setPaymentOption(option);
    setShowCardForm(option === "Card");
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
    return navigate("/login");
  }

  const totalPrice = bodyStyleCost + prefrenceCost + packageCost + deliveryCost + 4 + (bodyStyleCost + prefrenceCost + packageCost + deliveryCost + 4) * 0.05;
  const totalPriceInCents = Math.round(totalPrice ); // Convert to cents for Stripe or other payment processors

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <div className="checkout-title">
          <h2>Total: ${totalPrice}</h2>
        </div>

        <div className="checkout-section">
          <h3>Location</h3>
          <p>{address}</p>
        </div>

        <div className="checkout-section">
          <h3>Schedule</h3>
          <p>{deliveryOption === "Schedule" ? date?.toString() : serviceTime}</p>
        </div>

        <div className="checkout-section">
          <h3>{`${packageOption} ${prefrenceOption} Car Wash`}</h3>
          <div className="car-details">
            <p>Brand: {carBrand}</p>
            <p>Style: {bodyStyle}</p>
            <p>Color: {commonColors.find(color => color.colorCode === currentColor)?.colorName || "Unknown"}</p>

            <p>Plate: {carPlate}</p>
          </div>
        </div>

        <div className="checkout-section">
          <h3>Payment</h3>
          <select
            value={paymentOption}
            onChange={(e) => {
              const selectedOption = e.target.value;
              handlePaymentOptionChange(selectedOption);
              setShowCardForm(selectedOption === "Card");
            }}
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
          </select>
        </div>

        {showCardForm && (
  <CheckoutForm
    amount={totalPriceInCents}  // Pass the amount in cents
    apiUrl={API_URL}
    handlePaymentSuccess={handlePaymentSuccess}
    handlePaymentFail={handlePaymentFail}
  />
)}


        <div className="checkout-summary">
          <p>Subtotal: ${(bodyStyleCost + prefrenceCost + packageCost + deliveryCost).toFixed(2)}</p>
          <p>Service Fee: $4.00</p>
          <p>Taxes & Other Fees: ${((bodyStyleCost + prefrenceCost + packageCost + deliveryCost + 4) * 0.05).toFixed(2)}</p>
          <h3>Total: ${totalPrice}</h3>
        </div>

        {isLoading && <div className="loading-indicator">Processing...</div>}

        <button
          className="confirm-button"
          onClick={() => {
            if (paymentOption === "Cash") {
              handleConfirmOrder();
            }
          }}
          disabled={isLoading || showCardForm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default CarWashCheckoutScreen;
