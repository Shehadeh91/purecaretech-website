import React from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import './LocationSearch.css';

const LocationSearch = ({ address, setAddress }) => {
  return (
    <div className="location-search-container">
      {/* Display the address if it's set, otherwise show a default message */}
      <p className="location-display">
        {address ? address : "No location selected"}
      </p>

      {/* Google Places Autocomplete */}
      <GooglePlacesAutocomplete
        selectProps={{
          value: address, // Directly use the address string
          onChange: (location) => setAddress(location.label), // Update address as a string
          placeholder: "Enter your address...",
          classNamePrefix: "google-autocomplete", // Apply the class prefix
        }}
      />
    </div>
  );
};

export default LocationSearch;
