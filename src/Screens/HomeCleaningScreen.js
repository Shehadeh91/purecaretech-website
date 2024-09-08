import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import roomCleanData from "../assets/roomCleanData.json";
import useRoomCleanCart from "../useRoomCleanStore";
import useAppStore from "../useAppStore";
import { useNavigate } from 'react-router-dom';
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import LocationSearch from "../Components/LocationSearch";
import './HomeCleaningScreen.css'; // External CSS file

const HomeCleaningScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showLocationSearch, setShowLocationSearch] = useState(true);

  const {
    clearCart,
    getTotalPrice,
    deliveryCost,
    supplyCost,
    deliveryOption,
    setDeliveryCost,
    setSupplyCost,
    setDeliveryOption,
    packageCost,
    setPackageCost,
    packageOption,
    setPackageOption,
    supplyOption,
    setSupplyOption,
    paymentOption,
    note,
    setNote,
    getItemCountsWithTitles,
    serviceTime,
    setServiceTime,
    getTotalItemCount,
    date,
    setDate,
  } = useRoomCleanCart();

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
    setDeliveryOption("Schedule");
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

  const handlePackageChange = (newValue) => {
    setPackageOption(newValue);
    updatePackageCost(newValue, getTotalPrice());
  };

  const updatePackageCost = (packageOption) => {
    let updatedPackageCost = 0;
    if (packageOption === "Deep") {
      updatedPackageCost = getTotalPrice() * 1.75 - getTotalPrice();
    }
    setPackageCost(updatedPackageCost);
  };

  const filteredItems = roomCleanData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        setUser(currentUser);
        setLoading(false);
      } else {
        setLoading(false);
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate, setUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const Item = ({ item }) => {
    const { addToCart, removeFromCart, itemCounts } = useRoomCleanCart();
    return (
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
    );
  };

  return (
    <div className="container">
      <div className="subtotal-card">
        Subtotal: ${getTotalPrice() + deliveryCost + supplyCost + packageCost}
      </div>

      <div className="scroll-view">
        <div className="card">
          <h3 className="section-title">Location</h3>
          <div className="card-content">
            {showLocationSearch && <LocationSearch address={address} setAddress={setAddress} />}
          </div>
        </div>



        <div className="card">
          <h3 className="section-title">Clothes</h3>
          <button className="clear-btn" onClick={clearCart}>Clear</button>


          <div className="item-list">
            {filteredItems.map((item) => (
              <Item key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="section-title">Cleaning Supplies</h3>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="Yes, I have"
                checked={supplyOption === "Yes, I have"}
                onChange={() => {
                  setSupplyOption("Yes, I have");
                  setSupplyCost(0);
                }}
              />
              Yes, I have <span className="option-text">+$0</span>
            </label>
            <label>
              <input
                type="radio"
                value="No, I don't have"
                checked={supplyOption === "No, I don't have"}
                onChange={() => {
                  setSupplyOption("No, I don't have");
                  setSupplyCost(15);
                }}
              />
              No, I don't have <span className="option-text">+$15</span>
            </label>
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Select Your Package</h3>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="Basic"
                checked={packageOption === "Basic"}
                onChange={() => handlePackageChange("Basic")}
              />
              Basic Cleaning <span className="option-text">+$0</span>
            </label>
            <label>
              <input
                type="radio"
                value="Deep"
                checked={packageOption === "Deep"}
                onChange={() => handlePackageChange("Deep")}
              />
              Deep Cleaning <span className="option-text">+${
                ((getTotalPrice() * 1.75) - getTotalPrice()).toFixed(2)
              }</span>
            </label>
          </div>
        </div>
        <div className="card">
          <h3 className="section-title">Add Additional Note</h3>
          <textarea
            className="note-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="card">
          <h3 className="section-title">Service Time</h3>
          <select className="service-select" value={deliveryOption} disabled>
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
              navigate("/homeCleaningCheckOut");
            } else {
              alert("Please select a room");
            }
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default HomeCleaningScreen;
