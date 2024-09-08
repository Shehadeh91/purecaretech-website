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
    <Container maxWidth="xs" className="login-container">
      <Typography variant="h4" align="center" gutterBottom>
        Log In
      </Typography>
      {error && (
        <Alert severity="error" className="login-error">
          {error}
        </Alert>
      )}
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            type={passwordVisible ? "text" : "password"}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setPasswordVisible((prev) => !prev)}
                  >
                    {passwordVisible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={signIn}
              className="login-button"
            >
              Log In
            </Button>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="text"
            fullWidth
            onClick={() => navigate("/forget")}
          >
            Forgot Password?
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="text"
            fullWidth
            onClick={() => navigate("/signup")}
          >
            Need An Account? Sign Up
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LogInScreen;
