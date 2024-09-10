import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Typography,
  Container,
  Alert
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../firebaseConfig";
import useAppStore from "../useAppStore"; // Zustand for state management
import "./SignUpScreen.css"; // Import the custom CSS for styling

const SignuUpScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = FIREBASE_AUTH;
  const {
    name, setName, phone, address, setPhone, email, setEmail, carPlate, carBrand, bodyStyle, currentColor, setUser
  } = useAppStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
      if (currentUser) {
        if (currentUser.emailVerified) {
          navigate("/account");
        } else {
          alert("Please verify your email to sign in.");
        }
      } else {
        setUser(null);
        setName("");
        setPhone("");
        setEmail("");
        setPassword("");
      }
    });
    return unsubscribe;
  }, [navigate, setUser, setName, setPhone, setEmail]);

  const handleSignup = async () => {
    if (!validateInput()) return; // Validate user input first

    setLoading(true); // Set loading state to true
    try {
      // Create the user with email and password
      const { user } = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);

      // Store user data in Firestore using the user's email as the document ID
      await setDoc(doc(FIRESTORE_DB, "Users", user.email), {
        userId: user.uid,
        Name: name,
        Email: email,
        Address: address,
        CarBrand: carBrand,
        CarBody: bodyStyle,
        CarColor: currentColor,
        PlateNumber: carPlate,
        Phone: phone,
        Role: "Client",
      });

      // Send email verification
      await sendEmailVerification(user);
      alert("Success! Check your email for verification.");

      // Reset state (optional, depends on how you manage state)
      setName('');
      setPhone('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Clear form, stop loading, and navigate to login page
      setLoading(false);
      setTimeout(() => {
        navigate("/login"); // Use React Router for web-based navigation
      }, 1000);
    } catch (error) {
      setLoading(false); // Stop loading on error
      if (error.code === 'permission-denied') {
        alert("Sign-Up Failed: Permission denied. Please check your Firestore security rules.");
      } else {
        alert(`Sign-Up Failed: ${error.message}`);
      }
    }
  };


  const validateInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{7,}/;

    // Clear previous error messages
    document.getElementById('name-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('phone-error').textContent = '';
    document.getElementById('password-error').textContent = '';
    document.getElementById('confirm-password-error').textContent = '';

    if (!name) {
      document.getElementById('name-error').textContent = "Name is required.";
      return false;
    }
    if (!emailRegex.test(email)) {
      document.getElementById('email-error').textContent = "Invalid email format.";
      return false;
    }
    if (!phoneRegex.test(phone)) {
      document.getElementById('phone-error').textContent = "Please enter a valid 10-digit phone number.";
      return false;
    }
    if (!passwordRegex.test(password)) {
      document.getElementById('password-error').textContent = "Password must be at least 7 characters long and include a number, uppercase letter, and special character.";
      return false;
    }
    if (password !== confirmPassword) {
      document.getElementById('confirm-password-error').textContent = "Passwords do not match.";
      return false;
    }
    return true;
  };




  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>

      {error && (
        <div className="signup-error">
          {error}
        </div>
      )}

      <div className="signup-form">
        <div className="form-group">
          <label htmlFor="full-name">Full Name</label>
          <input
            type="text"
            id="full-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="signup-input"
          />
           <div id="name-error" class="error-message"></div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input"
          />
           <div id="email-error" class="error-message"></div>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="signup-input"
          />
           <div id="phone-error" class="error-message"></div>
        </div>

        <p className="password-instruction">
          Password must be at least 7 characters long and include at least one number, one uppercase letter, and one special character.
        </p>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signup-input"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="password-toggle-icon"
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>
          <div id="password-error" class="error-message"></div>
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <div className="password-input-wrapper">
            <input
              type={passwordVisible ? "text" : "password"}
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="signup-input"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="password-toggle-icon"
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>
          <div id="confirm-password-error" class="error-message"></div>

        </div>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <button onClick={handleSignup} className="signup-button">
            Sign Up
          </button>
        )}
      </div>
    </div>
  );

};

export default SignuUpScreen;
