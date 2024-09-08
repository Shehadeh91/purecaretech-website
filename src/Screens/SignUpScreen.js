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

  const {
    name, setName, phone, setPhone, email, setEmail, carPlate, carBrand, bodyStyle, currentColor, setUser
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
    setError(null);

    if (!/(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{7,}/.test(password)) {
      setError("Password must be at least 7 characters long and include at least one number, one uppercase letter, and one special character.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      await sendEmailVerification(user);
      const usersCollectionRef = collection(FIRESTORE_DB, "Users");
      const userDocRef = doc(usersCollectionRef, user.email);
      await setDoc(userDocRef, {
        userId: user.uid,
        Name: name,
        Email: email,
        Phone: phone,
        CarBrand: carBrand,
        CarBody: bodyStyle,
        CarColor: currentColor,
        PlateNumber: carPlate,
        Role: "Client"
      });
      alert("Check your email for verification.");
    } catch (error) {
      setError("Sign-Up Failed: Please check your details and try again.");
    } finally {
      setLoading(false);
      navigate("/home");
    }
  };

  return (
    <Container maxWidth="xs" className="container">
      <Typography variant="h4" align="center" gutterBottom>
        Sign Up
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
      />

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
      />

      <TextField
        label="Phone Number"
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
      />

      <Typography variant="caption" className="password-instruction">
        Password must be at least 7 characters long and include at least one number, one uppercase letter, and one special character.
      </Typography>

      <TextField
        label="Password"
        type={passwordVisible ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <IconButton onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          ),
        }}
      />

      <TextField
        label="Confirm Password"
        type={passwordVisible ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <IconButton onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          ),
        }}
      />

      {loading ? (
        <CircularProgress className="loader" />
      ) : (
        <Button variant="contained" color="primary" fullWidth onClick={handleSignup} className="button">
          Sign Up
        </Button>
      )}
    </Container>
  );
};

export default SignuUpScreen;
