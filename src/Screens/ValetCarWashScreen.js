import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import roomCleanData from "../assets/roomCleanData.json";
import useValetCarWashStore from "../useValetCarWashStore";
import useAppStore from "../useAppStore";
import { useNavigate } from 'react-router-dom';
import valetCarWashData from "../assets/valetCarWashData.json";

import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import LocationSearch from "../Components/LocationSearch";
import './ValetCarWashScreen.css'; // Create a CSS file for the styles



const ValetCarWashScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showLocationSearch, setShowLocationSearch] = useState(true);



  const [mode, setMode] = useState("date");


  const {
    serviceTime,
    setServiceTime,
    paintEnhancmentOption,
    setPaintEnhancmentOption,
    paintEnhancementCost,
    setPaintEnhancementCost,
    protectionOption,
    setProtectionOption,
    protectionCost,
    setProtectionCost,
    odorRemovalOption,
    setOdorRemovalOption,
    odorRemovalCost,
    setOdorRemovalCost,
    invisibleWipersOption,
    setInvisibleWipersOption,
    invisibleWipersCost,
    setInvisibleWipersCost,
    exfoliWaxOption,
    setExfoliWaxOption,
    exfoliWaxCost,
    setExfoliWaxCost,
    headlightRestorationOption,
    setHeadlightRestorationOption,
    headlightRestorationCost,
    setHeadlightRestorationCost,
    petHairRemovalOption,
    setPetHairRemovalOption,
    petHairRemovalCost,
    setPetHairRemovalCost,
    smallScratchRemovalOption,
    setSmallScratchRemovalOption,
    smallScratchesCost,
    setSmallScratchesCost,
    stainRemovalOption,
    setStainRemovalOption,
    stainRemovalCost,
    setStainRemovalCost,
    engineBayDetailOption,
    setEngineBayDetailOption,
    engineBayDetailCost,
    setEngineBayDetailCost,
    cockpitDetailOption,
    setCockpitDetailOption,
    cockpitDetailCost,
    setCockpitDetailCost,
    bodyStyle,
    setBodyStyle,
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
    date,
    setDate,
    rating
  } = useValetCarWashStore();

  const {
    name,
    phone,
    address,
    setAddress,
    user,
    setUser,
    setVisible,
  } = useAppStore();





  const handleBodyStyleChange = (selectedStyle) => {
    // Update the body style and its corresponding cost
    setBodyStyle(selectedStyle);
    const selectedBodyStyleCost = valetCarWashData.bodyStyleCosts[selectedStyle] || 0;
    setBodyStyleCost(selectedBodyStyleCost);


updateServices(selectedStyle);

    // Update the package cost based on the package option and preference cost
    updatePackageCost(packageOption, prefrenceCost, selectedBodyStyleCost);
  };


  const updateServices = (selectedStyle) => {
    // Reset options when the body style changes
    setPrefrenceOption('Exterior'); // Reset preference to 'Exterior'
    setProtectionOption("Level0");
setOdorRemovalOption(false);
setInvisibleWipersOption(false);
setExfoliWaxOption(false);
setHeadlightRestorationOption(false);
setPetHairRemovalOption(false);
setSmallScratchRemovalOption(false);
setStainRemovalOption(false);
setEngineBayDetailOption(false);
setCockpitDetailOption(false);
setPaintEnhancmentOption(false);


    // Set the costs in state
    setOdorRemovalCost(0);
    setInvisibleWipersCost(0);
    setExfoliWaxCost(0);
    setHeadlightRestorationCost(0);
    setPetHairRemovalCost(0);
    setSmallScratchesCost(0);
    setStainRemovalCost(0);
    setEngineBayDetailCost(0);
    setCockpitDetailCost(0);
    setPaintEnhancementCost(0);

    // Reset preference and protection cost
    setPrefrenceCost(0);
    setProtectionCost(0);
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

           setBodyStyle(data.CarBody);

             //setBodyStyle(data.CarBody);
             //setIconBodyStyle(data.CarBodyIcon);
            // setCarBrand(data.CarBrand);

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



//   useEffect(() => {
//    setDate();
//    setVisible(false);
//    setPackageOption("Basic");
//     setPrefrenceOption("Exterior");
//     setPrefrenceCost(0);
//     setPackageCost(0);
//  }, []);

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

 // Combined effect to handle bodyStyle, package, and preference changes
//  useEffect(() => {
//     // Update the bodyStyle cost from data.json when bodyStyle changes
//     const selectedBodyStyleCost = valetCarWashData.bodyStyleCosts[bodyStyle] || 0;
//     setBodyStyleCost(selectedBodyStyleCost);


//     setProtectionOption();
//     setPrefrenceOption('Exterior');
//     setOdorRemovalOption();


//     // Update the package cost based on the package option and preference cost
//     updatePackageCost(packageOption, prefrenceCost, selectedBodyStyleCost);
//   }, [bodyStyle, packageOption, prefrenceCost]);

  const updatePackageCost = (selectedPackageOption, preferenceCost, selectedBodyStyleCost) => {
    const packageModifier = valetCarWashData.packageModifiers[selectedPackageOption] || 0;
    const updatedPackageCost = (selectedBodyStyleCost + preferenceCost) * packageModifier;
    setPackageCost(updatedPackageCost);
  };

  const handlePackageChange = (newPackageOption) => {
    setPackageOption(newPackageOption);
    updatePackageCost(newPackageOption, prefrenceCost, bodyStyleCost); // Use updated bodyStyleCost
  };

  const handleProtectionChange = (newProtectionState) => {
    setProtectionOption(newProtectionState);

    // Get the protection cost based on the selected protection level and body style
    let cost = 0;
    if (newProtectionState === "Level0") {
        cost = valetCarWashData.serviceCosts.protectionOption.level0[bodyStyle];
      } else if (newProtectionState === "Level1") {
      cost = valetCarWashData.serviceCosts.protectionOption.level1[bodyStyle];
    } else if (newProtectionState === "Level2") {
      cost = valetCarWashData.serviceCosts.protectionOption.level2[bodyStyle];
    } else if (newProtectionState === "Level3") {
      cost = valetCarWashData.serviceCosts.protectionOption.level3[bodyStyle];
    }

    setProtectionCost(cost); // Set the calculated protection cost
  };



  const handlePaintEnhancementChange = (newProtectionState) => {
    setPaintEnhancmentOption(newProtectionState);
    // Get protectionOption cost dynamically from the JSON based on body style
    const cost = newProtectionState ? valetCarWashData.serviceCosts.paintEnhancementOption[bodyStyle] : 0;
    setPaintEnhancementCost(cost); // Set the protectionOption cost
  };


  const handleOdorRemovalChange = (newValue) => {
    setOdorRemovalOption(newValue);
    // Get protectionOption cost dynamically from the JSON based on body style
    const cost = newValue ? valetCarWashData.serviceCosts.odorRemovalOption[bodyStyle] : 0;
    setOdorRemovalCost(cost); // Set the protectionOption cost
  };

  const handleInvisibleWipersChange = (newValue) => {
    setInvisibleWipersOption(newValue);
    // Get protectionOption cost dynamically from the JSON based on body style
    const cost = newValue ? valetCarWashData.serviceCosts.invisibleWipersOption[bodyStyle] : 0;
    setInvisibleWipersCost(cost); // Set the protectionOption cost
  };

  const handleHeadlightRestorationChange = (newValue) => {
    setHeadlightRestorationOption(newValue);
    // Get protectionOption cost dynamically from the JSON based on body style
    const cost = newValue ? valetCarWashData.serviceCosts.headlightRestorationOption[bodyStyle] : 0;
    setHeadlightRestorationCost(cost); // Set the protectionOption cost
  };

  const handleExfoliWaxChange = (newValue) => {
    setExfoliWaxOption(newValue);
    // Get protectionOption cost dynamically from the JSON based on body style
    const cost = newValue ? valetCarWashData.serviceCosts.exfoliWaxOption[bodyStyle] : 0;
    setExfoliWaxCost(cost); // Set the protectionOption cost
  };

  const handlePetHairRemovalChange = (newValue) => {
    setPetHairRemovalOption(newValue);
    // Get protectionOption cost dynamically from the JSON based on body style
    const cost = newValue ? valetCarWashData.serviceCosts.petHairRemovalOption[bodyStyle] : 0;
    setPetHairRemovalCost(cost); // Set the protectionOption cost
  };

  const handleSmallScratchRemovalChange = (newValue) => {
    setSmallScratchRemovalOption(newValue);
    // Get protectionOption cost dynamically from the JSON based on body style
    const cost = newValue ? valetCarWashData.serviceCosts.smallScratchRemovalOption[bodyStyle] : 0;
    setSmallScratchesCost(cost); // Set the protectionOption cost
  };

  const handleStainRemovalChange = (newValue) => {
    setStainRemovalOption(newValue);
    // Get protectionOption cost dynamically from the JSON based on body style
    const cost = newValue ? valetCarWashData.serviceCosts.stainRemovalOption[bodyStyle] : 0;
    setStainRemovalCost(cost); // Set the protectionOption cost
  };

  const handleEngineBayDetailChange = (newValue) => {
    setEngineBayDetailOption(newValue);
    // Get protectionOption cost dynamically from the JSON based on body style
    const cost = newValue ? valetCarWashData.serviceCosts.engineBayDetailOption[bodyStyle] : 0;
    setEngineBayDetailCost(cost); // Set the protectionOption cost
  };

  const handleCockpitDetailChange = (newValue) => {
    setCockpitDetailOption(newValue);
    // Get protectionOption cost dynamically from the JSON based on body style
    const cost = newValue ? valetCarWashData.serviceCosts.cockpitDetailOption[bodyStyle] : 0;
    setCockpitDetailCost(cost); // Set the protectionOption cost
  };

  const handlePreferenceChange = (newPreference) => {
    // Ensure bodyStyleCost is set and valid
    const validBodyStyleCost = bodyStyleCost || 0; // Default to 0 if not set

    // Get the modifier based on the selected preference
    const preferenceModifier = valetCarWashData.preferenceModifiers[newPreference] || 0;

    // Calculate the updated preference cost
    const updatedPreferenceCost = validBodyStyleCost * preferenceModifier;

    // Update the preference option and cost
    setPrefrenceOption(newPreference);
    setPrefrenceCost(updatedPreferenceCost);
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

  {/* Subtotal Card */}
  <div className="subtotal-card">
  Subtotal: ${(bodyStyleCost + prefrenceCost + packageCost + deliveryCost + protectionCost + paintEnhancementCost + odorRemovalCost + invisibleWipersCost + exfoliWaxCost + headlightRestorationCost + petHairRemovalCost + smallScratchesCost + stainRemovalCost + engineBayDetailCost + cockpitDetailCost).toFixed(2)}

  </div>
  <div >
  {/* <div>
  <p>Body Style Cost: ${bodyStyleCost.toFixed(2)}</p>
  <p>Preference Cost: ${prefrenceCost.toFixed(2)}</p>
  <p>Package Cost: ${packageCost.toFixed(2)}</p>
  <p>Delivery Cost: ${deliveryCost.toFixed(2)}</p>
  <p>Protection Cost: ${protectionCost.toFixed(2)}</p>
  <p>Paint Enhancement Cost: ${paintEnhancementCost.toFixed(2)}</p>
  <p>Odor Removal Cost: ${odorRemovalCost.toFixed(2)}</p>
  <p>Invisible Wipers Cost: ${invisibleWipersCost.toFixed(2)}</p>
  <p>Exfoli Wax Cost: ${exfoliWaxCost.toFixed(2)}</p>
  <p>Headlight Restoration Cost: ${headlightRestorationCost.toFixed(2)}</p>
  <p>Pet Hair Removal Cost: ${petHairRemovalCost.toFixed(2)}</p>
  <p>Small Scratches Cost: ${smallScratchesCost.toFixed(2)}</p>
  <p>Stain Removal Cost: ${stainRemovalCost.toFixed(2)}</p>
  <p>Engine Bay Detail Cost: ${engineBayDetailCost.toFixed(2)}</p>
  <p>Cockpit Detail Cost: ${cockpitDetailCost.toFixed(2)}</p>
</div> */}

  </div>


  {/* Scrollable View */}
  <div className="scroll-view">

    {/* Location Card */}
    <div className="card">
      <h3 className="section-title">Location</h3>
      <div className="card-content">
        {showLocationSearch && <LocationSearch address={address} setAddress={setAddress} />}
      </div>
    </div>

    {/* Car Body Style Card */}
    <div className="card">
  <h3 className="section-title">Car Body Style</h3>


  <div className="car-description-dropdown-container">



    {/* Dropdown for Car Body Style */}
    <select
      className="car-description-dropdown"
      value={bodyStyle}
      onChange={(e) => handleBodyStyleChange(e.target.value)}
    >
      <option value="" disabled>Select Body Style</option>
      {Object.keys(valetCarWashData.bodyStyleCosts).map((style) => (
        <option key={style} value={style}>
          {style} (+${valetCarWashData.bodyStyleCosts[style]})
        </option>
      ))}
    </select>


  </div>


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
          Premium Detailing   {/* Tooltip button */}
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
      </span><span className="option-text">+${((bodyStyleCost + prefrenceCost) * valetCarWashData.packageModifiers["Detailing"]).toFixed(2)}</span>

        </label>
      </div>
    </div>

{/* Protection Card */}
<div className="card">
  <h3 className="section-title">Select Protection Level </h3>
  <div className="radio-group">
  <label>
      <input
        type="radio"
        value="Level0"
        checked={protectionOption === "Level0"}
        onChange={() => handleProtectionChange("Level0")}
      />
      No Protection {/* Tooltip button */}
        <span className="tooltip-container">
        <button type="button" className="info-button">?</button>
        <span className="tooltip-text">
          <strong>Protection</strong>
          <ul>
          Create a hydrophobic barrier against the elements.
          The added benefit of increased gloss, making it easier to wash, and staying cleaner for longer!
          </ul>
          <strong>Protection Levels</strong>
          <ul>
            <li>Level 1: 6 months</li>
            <li>Level 2: 1 year</li>
            <li>Level 3: 3-5 years</li>

          </ul>
        </span>
      </span><span className="option-text">+${(valetCarWashData.serviceCosts.protectionOption.level0[bodyStyle]).toFixed(2)}</span>
    </label>
    <label>
      <input
        type="radio"
        value="Level1"
        checked={protectionOption === "Level1"}
        onChange={() => handleProtectionChange("Level1")}
      />
      Level 1 Protection   <span className="option-text">+${(valetCarWashData.serviceCosts.protectionOption.level1[bodyStyle]).toFixed(2)}</span>
    </label>
    <label>
      <input
        type="radio"
        value="Level2"
        checked={protectionOption === "Level2"}
        onChange={() => handleProtectionChange("Level2")}
      />
      Level 2 Protection <span className="option-text">+${(valetCarWashData.serviceCosts.protectionOption.level2[bodyStyle]).toFixed(2)}</span>
    </label>
    <label>
      <input
        type="radio"
        value="Level3"
        checked={protectionOption === "Level3"}
        onChange={() => handleProtectionChange("Level3")}
      />
      Level 3 Protection <span className="option-text">+${(valetCarWashData.serviceCosts.protectionOption.level3[bodyStyle]).toFixed(2)}</span>
    </label>
  </div>
</div>


    {/* On The Spot Services */}
    <div className="card">
  <h3 className="section-title">On The Spot Services</h3>

  <div className="service-option">
    <label className="service-label">
      <input
        className="service-checkbox"
        type="checkbox"
        checked={paintEnhancmentOption === true}
        onChange={() => handlePaintEnhancementChange(!paintEnhancmentOption)}
      />
      <span className="service-text">Paint Enhancement</span>
      <span className="service-price">
        +${valetCarWashData.serviceCosts.paintEnhancementOption[bodyStyle].toFixed(2)}
      </span>
    </label>
  </div>

  <div className="service-option">
    <label className="service-label">
      <input
        className="service-checkbox"
        type="checkbox"
        checked={odorRemovalOption === true}
        onChange={() => handleOdorRemovalChange(!odorRemovalOption)}
      />
      <span className="service-text">Odor Removal</span>
      <span className="service-price">
        +${valetCarWashData.serviceCosts.odorRemovalOption[bodyStyle].toFixed(2)}
      </span>
    </label>
  </div>

  <div className="service-option">
    <label className="service-label">
      <input
        className="service-checkbox"
        type="checkbox"
        checked={invisibleWipersOption === true}
        onChange={() => handleInvisibleWipersChange(!invisibleWipersOption)}
      />
      <span className="service-text">Invisible Wipers</span>
      <span className="service-price">
        +${valetCarWashData.serviceCosts.invisibleWipersOption[bodyStyle].toFixed(2)}
      </span>
    </label>
  </div>

  <div className="service-option">
    <label className="service-label">
      <input
        className="service-checkbox"
        type="checkbox"
        checked={exfoliWaxOption === true}
        onChange={() => handleExfoliWaxChange(!exfoliWaxOption)}
      />
      <span className="service-text">ExfoliWax</span>
      <span className="service-price">
        +${valetCarWashData.serviceCosts.exfoliWaxOption[bodyStyle].toFixed(2)}
      </span>
    </label>
  </div>

  <div className="service-option">
    <label className="service-label">
      <input
        className="service-checkbox"
        type="checkbox"
        checked={headlightRestorationOption === true}
        onChange={() => handleHeadlightRestorationChange(!headlightRestorationOption)}
      />
      <span className="service-text">Headlight Restoration</span>
      <span className="service-price">
        +${valetCarWashData.serviceCosts.headlightRestorationOption[bodyStyle].toFixed(2)}
      </span>
    </label>
  </div>

  <div className="service-option">
    <label className="service-label">
      <input
        className="service-checkbox"
        type="checkbox"
        checked={petHairRemovalOption === true}
        onChange={() => handlePetHairRemovalChange(!petHairRemovalOption)}
      />
      <span className="service-text">Pet Hair Removal</span>
      <span className="service-price">
        +${valetCarWashData.serviceCosts.petHairRemovalOption[bodyStyle].toFixed(2)}
      </span>
    </label>
  </div>

  <div className="service-option">
    <label className="service-label">
      <input
        className="service-checkbox"
        type="checkbox"
        checked={smallScratchRemovalOption === true}
        onChange={() => handleSmallScratchRemovalChange(!smallScratchRemovalOption)}
      />
      <span className="service-text">Small Scratch Removal</span>
      <span className="service-price">
        +${valetCarWashData.serviceCosts.smallScratchRemovalOption[bodyStyle].toFixed(2)}
      </span>
    </label>
  </div>

  <div className="service-option">
    <label className="service-label">
      <input
        className="service-checkbox"
        type="checkbox"
        checked={stainRemovalOption === true}
        onChange={() => handleStainRemovalChange(!stainRemovalOption)}
      />
      <span className="service-text">Stain Removal</span>
      <span className="service-price">
        +${valetCarWashData.serviceCosts.stainRemovalOption[bodyStyle].toFixed(2)}
      </span>
    </label>
  </div>

  <div className="service-option">
    <label className="service-label">
      <input
        className="service-checkbox"
        type="checkbox"
        checked={engineBayDetailOption === true}
        onChange={() => handleEngineBayDetailChange(!engineBayDetailOption)}
      />
      <span className="service-text">Engine Bay Detail</span>
      <span className="service-price">
        +${valetCarWashData.serviceCosts.engineBayDetailOption[bodyStyle].toFixed(2)}
      </span>
    </label>
  </div>

  <div className="service-option">
    <label className="service-label">
      <input
        className="service-checkbox"
        type="checkbox"
        checked={cockpitDetailOption === true}
        onChange={() => handleCockpitDetailChange(!cockpitDetailOption)}
      />
      <span className="service-text">Cockpit Detail</span>
      <span className="service-price">
        +${valetCarWashData.serviceCosts.cockpitDetailOption[bodyStyle].toFixed(2)}
      </span>
    </label>
  </div>
</div>




    {/* Additional Note Card */}
    <div className="card">
      <h3 className="section-title">Add Additional Note</h3>
      <textarea
        className="note-input"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </div>

    {/* Service Time Card */}
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

    {/* Confirm Button */}
    <button
      className="confirm-btn"
      onClick={() => {
        if (!date) {
          alert("Please select a date before confirming.");
          return;
        }
        navigate("/valetCarWashCheckOut");
      }}
    >
      Confirm
    </button>
  </div>
</div>

  );
};

export default ValetCarWashScreen;