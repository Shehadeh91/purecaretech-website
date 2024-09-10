import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import useAppStore from "../useAppStore"; // Zustand store for state management
import "./LogInScreen.css"; // Import custom CSS

const LogInScreen = () => {
  const { setName, setPhone, setUser, email, setEmail } = useAppStore();
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = FIREBASE_AUTH;
  const navigate = useNavigate();

  // Check if user is already logged in and redirect to the appropriate page
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        try {
          const userDocRef = doc(FIRESTORE_DB, "Users", user.email);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setName(userData.Name);
            setPhone(userData.Phone);
            setUser(user);
            switch (userData.Role) {
              case "Client":
                navigate('/account');
                break;
              case "Admin":
                navigate('/admin');
                break;
              case "Agent":
                navigate('/agent');
                break;
              default:
                setError("Access Denied: You do not have permission to access this account.");
            }
          }
        } catch (error) {
          setError("Error: Failed to retrieve user data.");
        }
      }
    });
    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [auth, navigate, setName, setPhone, setUser]);

  const signIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;
      if (user.emailVerified) {
        const userDocRef = doc(FIRESTORE_DB, "Users", user.email);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setName(userData.Name);
          setPhone(userData.Phone);
          setUser(user);
          switch (userData.Role) {
            case "Client":
              navigate('/account');
              break;
            case "Admin":
              navigate('/admin');
              break;
            case "Agent":
              navigate('/agent');
              break;
            default:
              setError("Access Denied: You do not have permission to access this account.");
          }
        } else {
          setError("Error: User data not found.");
        }
      } else {
        setError("Email Verification Required: Please verify your email before logging in.");
      }
    } catch (error) {
      setError("Sign-In Failed: Check your email and password or verify your email address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Log In</h2>
      {error && (
        <div className="login-error">
          {error}
        </div>
      )}
      <div className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              type={passwordVisible ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="password-toggle-icon"
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div className="form-group">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <button onClick={signIn} className="login-button">
              Log In
            </button>
          )}
        </div>
        <div className="form-group">
          <button onClick={() => navigate("/forget")} className="forgot-password-button">
            Forgot Password?
          </button>
        </div>
        <div className="form-group">
          <button onClick={() => navigate("/signup")} className="make-account-button">
            Need An Account? Sign Up
          </button>
        </div>
      </div>
    </div>
  );


};

export default LogInScreen;
