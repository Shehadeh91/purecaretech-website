import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import roomCleanData from "../assets/roomCleanData.json";
import useCarWashStore from "../useCarWashStore";
import useAppStore from "../useAppStore";
import { useNavigate } from 'react-router-dom';
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import LocationSearch from "../Components/LocationSearch";
import './CarWashScreen.css'; // External CSS file


const CarWashScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showLocationSearch, setShowLocationSearch] = useState(true);


  const [isModalBrandVisible, setIsModalBrandVisible] = useState(false);
  const [isModalBodyStyleVisible, setIsModalBodyStyleVisible] = useState(false);
  const [isModalColorWheelVisible, setIsModalColorWheelVisible] = useState(false);

  const showModalBrand = () => setIsModalBrandVisible(true);
  const closeModalBrand = () => setIsModalBrandVisible(false);

  const showModalBodyStyle = () => setIsModalBodyStyleVisible(true);
  const closeModalBodyStyle = () => setIsModalBodyStyleVisible(false);

  const showModalColorWheel = () => setIsModalColorWheelVisible(true);
  const closeModalColorWheel = () => setIsModalColorWheelVisible(false);







  const handleBrandSelection = (brand) => {
    setCarBrand(brand); // Handle selected brand logic
    closeModalBrand();
  };

  const handleBodyStyleSelection = (style) => {
    setBodyStyle(style); // Handle selected body style logic
    closeModalBodyStyle();
  };

  const handleColorSelection = (color) => {
    setCurrentColor(color); // Handle selected color logic
    closeModalColorWheel();
  };

  const [visibleDialog, setVisibleDialog] = useState(false);
  const showDialog = () => setVisibleDialog(true);
  const hideDialog = () => setVisibleDialog(false);

  const [mode, setMode] = useState("date");


  const {
    serviceTime,
    setServiceTime,
    carBrand,
    setCarBrand,
    bodyStyle,
    setBodyStyle,
    iconBrand,
    setIconBrand,
    iconBodyStyle,
    setIconBodyStyle,
    currentColor,
    setCurrentColor,
    carPlate,
    setCarPlate,
    deliveryCost,
    setDeliveryCost,
    packageCost,
    setPackageCost,
    prefrenceCost,
    setPrefrenceCost,
    bodyStyleCost,
    setBodyStyleCost,
    updateTotalCost,
    note,
    setNote,
    deliveryOption,
    setDeliveryOption,
    packageOption,
    setPackageOption,
    prefrenceOption,
    setPrefrenceOption,
    paymentOption,
    date,
    setDate,
    rating  } = useCarWashStore();

  const {
    name,
    phone,
    address,
    setAddress,
    user,
    setUser,
    setVisible,
  } = useAppStore();

  const bodyStyleCosts = {
    Sedan: 35,
    Coupe: 35,
    Hatchback: 35,
    PickupTruck: 40,
    SUV: 40,
    MiniVan: 50,
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

  const carBrands = [
    "Mazda",
    "Mercedes",
    "BMW",
    "Honda",
    "Hyundai",
    "Ford",
    "Chevrolet",
    "Toyota",
    "GMC",
    "Dodge",
    "Jeep",
    "Nissan",
    "KIA",
    "Subaru",
    "Volkswagen",
    "Audi",
    "Chrysler",
    "Lexus",
    "Cadillac",
    "Buick",
    "Tesla"
  ];

  const handleBodyStyleChange = (selectedBodyStyle) => {
    setBodyStyle(selectedBodyStyle);
    setBodyStyleCost(bodyStyleCosts[selectedBodyStyle]);

     // Recalculate preference and package costs based on the selected body style
  handlePreferenceChange(prefrenceOption);  // Recalculate preference cost based on current preference
  updatePackageCost(packageOption, prefrenceCost);
  };

  const handleColorChange = (selectedColor) => {
    setCurrentColor(selectedColor);
  };



  useEffect(() => {
    setDeliveryOption("Schedule");
    setDate("");



    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.email) {
        try {
          const docRef = doc(FIRESTORE_DB, 'Users', user.email); // Get the document reference
          const docSnap = await getDoc(docRef); // Fetch the document
          if (docSnap.exists()) {
            const data = docSnap.data();
            //setUserData(data); // Set user data
           setAddress(data.Address); // Set address state
           setCarPlate(data.PlateNumber);
           setBodyStyle(data.CarBody);
           setCarBrand(data.CarBrand);
             //setBodyStyle(data.CarBody);
             //setIconBodyStyle(data.CarBodyIcon);
            // setCarBrand(data.CarBrand);
             setCurrentColor(data.CarColor);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [user]);



  useEffect(() => {
   setDate();
   setVisible(false);
   setPackageOption("Basic");
    setPrefrenceOption("Exterior");
    setPrefrenceCost(0);
    setPackageCost(0);
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


  useEffect(() => {
    // console.log('Current Color:', currentColor); // Debug logging
    // Any other logic related to color change
  }, [currentColor]);
//   const handleColorSelect = (color) => {
//     setCurrentColor(color);
//     hideModalColorWheel();
//   };

const handlePreferenceChange = (newValue) => {
    let updatedPreferenceCost;

    if (newValue === "Exterior" || newValue === "Interior") {
      updatedPreferenceCost = 0;
    } else if (newValue === "Int/Ext") {
      updatedPreferenceCost = bodyStyleCost * 0.75;
    }

    setPrefrenceOption(newValue);  // Make sure to update the preference option state
    setPrefrenceCost(updatedPreferenceCost);
    updatePackageCost(packageOption, updatedPreferenceCost);
  };

  const handlePackageChange = (newValue) => {
    setPackageOption(newValue);
    updatePackageCost(newValue, prefrenceCost);
  };
  const updatePackageCost = (packageOption, preferenceCost) => {
    let updatedPackageCost;
    if (packageOption === "Basic") {
      updatedPackageCost = 0;
    } else if (packageOption === "Detailing") {
      updatedPackageCost = (bodyStyleCost + preferenceCost) * 1.5;
    }
    setPackageCost(updatedPackageCost);
  };




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



  return (
    <div className="container">
      <div className="subtotal-card">
        Subtotal: ${bodyStyleCost + prefrenceCost + packageCost + deliveryCost}
      </div>

      <div className="scroll-view">
        <div className="card">
          <h3 className="section-title">Location</h3>
          <div className="card-content">
            {showLocationSearch && <LocationSearch address={address} setAddress={setAddress} />}
          </div>
        </div>



        <div className="card">
  <h3 className="section-title">Car Description</h3>
  <p className="car-description-text">Select your car details by using the dropdowns.</p>

  <div className="car-description-dropdown-container">
    {/* Dropdown for Car Brand */}
    <select
      className="car-description-dropdown"
      value={carBrand}
      onChange={(e) => setCarBrand(e.target.value)}
    >
      <option value="" disabled>Select Car Brand</option>
      {carBrands.map((brand) => (
        <option key={brand} value={brand}>
          {brand}
        </option>
      ))}
    </select>

    {/* Dropdown for Car Body Style */}
    <select
      className="car-description-dropdown"
      value={bodyStyle}
      onChange={(e) => handleBodyStyleChange(e.target.value)}
    >
      <option value="" disabled>Select Body Style</option>
      {Object.keys(bodyStyleCosts).map((style) => (
        <option key={style} value={style}>
          {style} (+${bodyStyleCosts[style]})
        </option>
      ))}
    </select>

    {/* Dropdown for Car Color */}
    <select
      className="car-description-dropdown"
      value={currentColor}
      onChange={(e) => handleColorChange(e.target.value)}
    >
      <option value="" disabled>Select Car Color</option>
      {commonColors.map((color) => (
        <option key={color.colorCode} value={color.colorCode}>
          {color.colorName}
        </option>
      ))}
    </select>
  </div>

  {/* Label and Input for Car Plate */}
  <label className="car-description-plate-label" htmlFor="carPlate">Enter Car Plate:</label>
  <input
    id="carPlate"
    className="car-description-plate-input"
    type="text"
    placeholder="Car Plate"
    value={carPlate}
    maxLength={9}
    onChange={(e) => setCarPlate(e.target.value)}
    style={{ textTransform: "uppercase" }}
  />
</div>






{/* Preference Card */}
<div className="card">
  <h3 className="section-title">Preference</h3>
  <div className="radio-group">
    <label>
      <input
        type="radio"
        value="Exterior"
        checked={prefrenceOption === "Exterior"}
        onChange={() => handlePreferenceChange("Exterior")}
      />
      Exterior <span className="option-text">+$0</span>
    </label>
    <label>
      <input
        type="radio"
        value="Interior"
        checked={prefrenceOption === "Interior"}
        onChange={() => handlePreferenceChange("Interior")}
      />
      Interior <span className="option-text">+$0</span>
    </label>
    <label>
      <input
        type="radio"
        value="Int/Ext"
        checked={prefrenceOption === "Int/Ext"}
        onChange={() => handlePreferenceChange("Int/Ext")}
      />
      Int/Ext <span className="option-text">+${(bodyStyleCost * 0.75).toFixed(2)}</span>
    </label>
  </div>
</div>


{/* Package Card */}
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
        value="Detailing"
        checked={packageOption === "Detailing"}
        onChange={() => handlePackageChange("Detailing")}
      />
      Premium Detailing
        {/* Tooltip button */}
        <span className="tooltip-container">
        <button type="button" className="info-button">?</button>
        <span className="tooltip-text">
          <strong>Full Interior Detail</strong>
          <ul>
            <li>Carpet Shampoo</li>
            <li>Fabric Shampoo</li>
            <li>Leather Deep Clean</li>
            <li>Leather Conditioning</li>
            <li>Steam Clean All Areas</li>
          </ul>
          <strong>Full Exterior Detail</strong>
          <ul>
            <li>Hand Wash & Dry</li>
            <li>Clay Bar Treatment</li>
            <li>Wax & Polish</li>
            <li>Tire and Wheel Cleaning</li>
            <li>Glass Cleaning</li>
          </ul>
        </span>
      </span>
      <span className="option-text">+${((bodyStyleCost + prefrenceCost) * 1.5)}</span>

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
            else {
                navigate("/carWashCheckOut");
            }
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default CarWashScreen;
