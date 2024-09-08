import React from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

const LocationSearch = ({ address, setAddress }) => {
  return (
    <div>


      {/* Display the address if it's set, otherwise show a default message */}
      {address ? <p> {address}</p> : <p>No location selected</p>}

      {/* Google Places Autocomplete */}
      <GooglePlacesAutocomplete
        selectProps={{
          value: address, // Directly use the address string
          onChange: (location) => setAddress(location.label), // Update address as a string
          placeholder: "Enter your address...",
        }}
      />
    </div>
  );
};

export default LocationSearch;
