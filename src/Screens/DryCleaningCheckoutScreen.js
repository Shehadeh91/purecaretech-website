import React, { useEffect, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import useAppStore from "../useAppStore";
import { useNavigate } from "react-router-dom";

import useDryCleanCart from "../useDryCleanStore";
import CheckoutForm from "../Components/CheckoutForm";
import LogInScreen from "./LogInScreen";
import './DryCleaningCheckoutScreen.css';

const DryCleanCheckOutScreen = () => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const navigate = useNavigate(); // Use navigate for navigation
  const stripe = useStripe();
  const [showCardForm, setShowCardForm] = useState(true);
  const [paymentOption, setPaymentOption] = useState("Card");



  const { name, address, user, setUser, setVisible, email, phone } = useAppStore();
  const {
    clearCart,
    getTotalPrice,
    deliveryCost,
    deliveryOption,
    setDeliveryCost,
    setDeliveryOption,
    itemCounts,

    note,
    setNote,
    getItemCountsWithTitles,
    serviceTime,
    setServiceTime,
    date,
    setDate,
    rating
  } = useDryCleanCart();

  const API_URL = 'https://stripeapiendpoint-p2xcnmarfq-uc.a.run.app';

  const handlePaymentSuccess = () => {
    alert("Payment Successful!");
    handleConfirmOrder();
  };

  const handlePaymentFail = (errorMessage) => {
    alert(`Payment Failed: ${errorMessage}`);
  };

  const addDryCleanOrder = async () => {
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

      // Reference to the Dry-Clean order document
      const orderDocRef = doc(FIRESTORE_DB, "Dry-Clean", `${userId}_${orderNumber}`);

      // Write the order to Firestore
      await setDoc(orderDocRef, {
        Email: userId,
        Name: name,
        Address: address,
        Items: getItemCountsWithTitles(),
        Phone: phone,
        Payment: paymentOption,
        Delivery: deliveryOption,
        Total: ((getTotalPrice() + deliveryCost + 4 + ((getTotalPrice() + deliveryCost + 4) * 0.05)).toFixed(2)),
        Status: "InProgress",
        Assigned: "No One",
        Service: "Dry Clean",
        EstimateTime: serviceTime,
        Date: date,
        Rating: rating
      });
  // Update order number in the OrderCounters collection
  await setDoc(counterDocRef, { orderNumber: orderNumber }, { merge: true });
       // Send SMS notification
       const message = "Hooray! There's a new Dry Cleaning order ready for you to fulfill! " + paymentOption;
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
      console.log("Order added successfully");
      window.location.href = "/orderComplete";
    } catch (error) {
      console.error("Error adding dry cleaning order:", error);
      alert("Order Failed! Something went wrong.");
    }
  };


  const handleConfirmOrder = async () => {
    setIsLoading(true);
    try {
      // Add the dry cleaning order
      await addDryCleanOrder();
      console.log("Dry cleaning order has been sent");




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
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setVisible(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!user || !user.emailVerified) return;
        const userDocRef = collection(FIRESTORE_DB, "Users");
        const querySnapshot = await getDocs(userDocRef);
        const userData = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .find(data => data.userId === user.uid);
        if (userData) setUserInfo(userData);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, [user]);

  if (!user || !user.emailVerified) {
    return navigate("/login");
  }

  const totalPrice = (getTotalPrice() + deliveryCost + 4 + ((getTotalPrice() + deliveryCost + 4) * 0.05)).toFixed(2);

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
          <h3>Dry Cleaning Items</h3>
          {getItemCountsWithTitles().map((item, index) => (
            <p key={index}>
              {item.title} X {item.count}
            </p>
          ))}
        </div>

        <div className="checkout-section">
  <h3>Payment</h3>
  <select
    value={paymentOption}
    onChange={(e) => {
      const selectedOption = e.target.value;
      handlePaymentOptionChange(selectedOption);
      setShowCardForm(selectedOption === "Card"); // Set card form visibility based on payment option
    }}
  >
    <option value="Cash">Cash</option>
    <option value="Card">Card</option>
  </select>
</div>


{showCardForm && (
  <CheckoutForm
    amount={parseFloat(totalPrice)}
    apiUrl={API_URL}
    handlePaymentSuccess={handlePaymentSuccess}
    handlePaymentFail={handlePaymentFail}
  />
)}


        <div className="checkout-summary">
          <p>Subtotal: ${(getTotalPrice() + deliveryCost).toFixed(2)}</p>
          <p>Service Fee: $4.00</p>
          <p>Taxes & Other Fees: ${((getTotalPrice() + deliveryCost + 4) * 0.05).toFixed(2)}</p>
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

export default DryCleanCheckOutScreen;
