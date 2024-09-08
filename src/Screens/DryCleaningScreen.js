import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import dryCleanData from "../assets/dryCleanData.json";
import useDryCleanCart from "../useDryCleanStore";
import useAppStore from "../useAppStore";
import { useNavigate } from 'react-router-dom';
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";

import './DryCleaningScreen.css';  // External CSS file

const DryCleanOrderScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate(); // Use navigate for navigation


  const auth = FIREBASE_AUTH;

  const {
    clearCart,
    getTotalPrice,
    deliveryCost,
    deliveryOption,
    setDeliveryCost,
    setDeliveryOption,
    itemCounts,
    paymentOption,
    setPaymentOption,
    note,
    setNote,
    getItemCountsWithTitles,
    serviceTime,
    setServiceTime,
    date,
    setDate,
    getTotalItemCount

  } = useDryCleanCart();

  const {
    name,
    phone,
    address,
    setAddress,
    user,
    setUser,
    setVisible,
  } = useAppStore();


  useEffect(() => {
    setDeliveryOption("Schedule"); // Set default to "Schedule"
    setDate("");
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (user && user.email) {
      try {
        const docRef = doc(FIRESTORE_DB, 'Users', user.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAddress(data.Address);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  const handleConfirm = (event) => {
    const dateTime = new Date(event.target.value);
    const formattedDate = dateTime.toLocaleString('default', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    setDate(formattedDate);
  };

  const filteredItems = dryCleanData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const Item = ({ item }) => {
    const { addToCart, removeFromCart, itemCounts } = useDryCleanCart();
    return (
      <>
        <div className="item-container">
          <div className="item-details">
            <p className="item-title">{item?.title}</p>
            <p className="item-price">${item?.price}</p>
          </div>
          <div className="item-actions">
            <button className="qty-btn" onClick={() => removeFromCart(item.id)}>-</button>
            <span className="item-count">{itemCounts[item.id]}</span>
            <button className="qty-btn" onClick={() => addToCart(item?.id)}>+</button>
          </div>
        </div>
      </>
    );
  };

 return (
  <div className="container">
    <div className="subtotal-card">
      Subtotal: ${getTotalPrice() + deliveryCost}
    </div>

    <div className="scroll-view">
      {/* Location card */}
      <div className="card">
        <h3 className="section-title">Location</h3>
        <div className="card-content">
          <p>{address}</p>
        </div>
      </div>

      {/* Clothes card */}
      <div className="card">
        <div className="header">
          <h3 className="section-title">Clothes</h3>
          <button className="clear-btn" onClick={clearCart}>Clear</button>
        </div>
        <input
          className="search-input"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="item-list">
          {filteredItems.map((item) => (
            <Item key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Additional Note card */}
      <div className="card">
        <h3 className="section-title">Add Additional Note</h3>
        <textarea
          className="note-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* Service Time card */}
      <div className="card">
        <h3 className="section-title">Service Time</h3>
        <select
          className="service-select"
          value={deliveryOption}
          disabled // Disable the select field since only "Schedule" is available
        >
          <option value="Schedule">Schedule</option>
        </select>
        {deliveryOption === "Schedule" && (
          <input type="datetime-local" className="datetime-input" onChange={handleConfirm} />
        )}
        <p className="date-text">{date && date.toString()}</p>
      </div>

      <button
        className="confirm-btn"
        onClick={() => {
          if (!date) {
            alert("Please select a date before confirming.");
            return;
          }
          if (getTotalItemCount() > 0) {
            navigate("/dryCleanCheckOut");
          } else {
            alert("Please select clothes");
          }
        }}
      >
        Confirm
      </button>
    </div>
  </div>
);

};

export default DryCleanOrderScreen;
