import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import useAppStore from "../useAppStore";
import useValetCarWashStore from "../useValetCarWashStore";
import CheckoutForm from "../Components/CheckoutForm";
import './ValetCarWashCheckoutScreen.css'; // External CSS file

const ValetCarWashCheckoutScreen = () => {
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
    note,
    protectionCost,
    paintEnhancementCost,
    odorRemovalCost,
    invisibleWipersCost,
    exfoliWaxCost,
    headlightRestorationCost,
    petHairRemovalCost,
    smallScratchesCost,
    stainRemovalCost,
    engineBayDetailCost,
    cockpitDetailCost,
    protectionOption,
    odorRemovalOption,
    paintEnhancmentOption,
    invisibleWipersOption,
    exfoliWaxOption,
    headlightRestorationOption,
    petHairRemovalOption,
    smallScratchRemovalOption,
    stainRemovalOption,
    engineBayDetailOption,
    cockpitDetailOption
  } = useValetCarWashStore();

  const API_URL = 'https://stripeapiendpoint-p2xcnmarfq-uc.a.run.app';

  const handlePaymentSuccess = () => {
    alert("Payment Successful!");
    handleConfirmOrder();
  };

  const handlePaymentFail = (errorMessage) => {
    alert(`Payment Failed: ${errorMessage}`);
  };

  const addValetCarWashOrder = async () => {
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

      // Reference to the Valet Car-Wash order document
      const orderDocRef = doc(FIRESTORE_DB, "Valet-Car-Wash", `${userId}_${orderNumber}`);

      // Write the order to Firestore
      await setDoc(orderDocRef, {
        Email: userId,
        Name: name,
        Phone: phone,
        Address: address,

        BodyType: bodyStyle,
        Preference: prefrenceOption,
        Package: packageOption,
      Protection: protectionOption,
      PaintEnhancement: paintEnhancmentOption,
OdorRemoval: odorRemovalOption,
InvisibleWipers: invisibleWipersOption,
ExfoliWax: exfoliWaxOption,
HeadlightRestoration: headlightRestorationOption,
PetHairRemoval: petHairRemovalOption,
SmallScratchRemoval: smallScratchRemovalOption,
StainRemoval: stainRemovalOption,
EngineBayDetail: engineBayDetailOption,
CockpitDetail: cockpitDetailOption,

        Payment: paymentOption,
        Note: note,
        Delivery: deliveryOption,
        Total: ((bodyStyleCost + prefrenceCost + packageCost + deliveryCost + protectionCost + paintEnhancementCost + odorRemovalCost + invisibleWipersCost + exfoliWaxCost + headlightRestorationCost + petHairRemovalCost + smallScratchesCost + stainRemovalCost + engineBayDetailCost + cockpitDetailCost + 4 + ((bodyStyleCost + prefrenceCost + packageCost + deliveryCost + protectionCost + paintEnhancementCost + odorRemovalCost + invisibleWipersCost + exfoliWaxCost + headlightRestorationCost + petHairRemovalCost + smallScratchesCost + stainRemovalCost + engineBayDetailCost + cockpitDetailCost + 4) * 0.05)).toFixed(2)),
        Status: "InProgress",
        Assigned: "No One",
        Service: "Valet Car Wash",
        EstimateTime: serviceTime,
        Date: date,
        Rating: rating,
      });

      // Update order number in the OrderCounters collection
      await setDoc(counterDocRef, { orderNumber: orderNumber }, { merge: true });

      // Send SMS notification
      const message = "Hooray! There's a new Valet Car Wash order ready for you to fulfill! " + paymentOption;
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
      console.log("Valet car wash order added successfully");
      window.location.href = "/orderComplete";
    } catch (error) {
      console.error("Error adding valet car wash order:", error);
      alert("Order Failed! Please try again.");
    }
  };

  const handleConfirmOrder = async () => {
    setIsLoading(true);
    try {
      // Add the valet car wash order
      await addValetCarWashOrder();
      console.log("Valet car wash order has been sent");
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

  const totalPrice = bodyStyleCost + prefrenceCost + packageCost + deliveryCost + protectionCost + paintEnhancementCost + odorRemovalCost + invisibleWipersCost + exfoliWaxCost + headlightRestorationCost + petHairRemovalCost + smallScratchesCost + stainRemovalCost + engineBayDetailCost + cockpitDetailCost + 4 + (bodyStyleCost + prefrenceCost + packageCost + deliveryCost + protectionCost + paintEnhancementCost + odorRemovalCost + invisibleWipersCost + exfoliWaxCost + headlightRestorationCost + petHairRemovalCost + smallScratchesCost + stainRemovalCost + engineBayDetailCost + cockpitDetailCost + 4) * 0.05;
  const totalPriceInCents = Math.round(totalPrice); // Convert to cents for Stripe or other payment processors

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <div className="checkout-title">
          <h2>Total: ${totalPrice.toFixed(2)}</h2>
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
          <h3>{`${packageOption} ${prefrenceOption} Valet Car Wash`}</h3>
          <div className="car-details">
          <p>Style: {bodyStyle}</p>
          {protectionOption !== "Level0" && <p>Protection: {protectionOption}</p>}
          {paintEnhancmentOption && <p>Paint Enhancement: Yes</p>}
{odorRemovalOption && <p>Odor Removal: Yes</p>}
{invisibleWipersOption && <p>Invisible Wipers: Yes</p>}
{exfoliWaxOption && <p>ExfoliWax: Yes</p>}
{headlightRestorationOption && <p>Headlight Restoration: Yes</p>}
{petHairRemovalOption && <p>Pet Hair Removal: Yes</p>}
{smallScratchRemovalOption && <p>Small Scratch Removal: Yes</p>}
{stainRemovalOption && <p>Stain Removal: Yes</p>}
{engineBayDetailOption && <p>Engine Bay Detail: Yes</p>}
{cockpitDetailOption && <p>Cockpit Detail: Yes</p>}
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
          <p>Subtotal: ${(bodyStyleCost + prefrenceCost + packageCost + deliveryCost + protectionCost + paintEnhancementCost + odorRemovalCost + invisibleWipersCost + exfoliWaxCost + headlightRestorationCost + petHairRemovalCost + smallScratchesCost + stainRemovalCost + engineBayDetailCost + cockpitDetailCost).toFixed(2)}</p>
          <p>Service Fee: $4.00</p>
          <p>Taxes & Other Fees: ${((bodyStyleCost + prefrenceCost + packageCost + deliveryCost + protectionCost + paintEnhancementCost + odorRemovalCost + invisibleWipersCost + exfoliWaxCost + headlightRestorationCost + petHairRemovalCost + smallScratchesCost + stainRemovalCost + engineBayDetailCost + cockpitDetailCost + 4) * 0.05).toFixed(2)}</p>
          <h3>Total: ${totalPrice.toFixed(2)}</h3>
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

export default ValetCarWashCheckoutScreen;
