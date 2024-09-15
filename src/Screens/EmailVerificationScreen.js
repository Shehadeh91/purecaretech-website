import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FIREBASE_AUTH } from "../firebaseConfig"; // Import Firebase setup
import "./EmailVerificationScreen.css"; // Import custom CSS

const EmailVerificationScreen = () => {
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const oobCode = query.get("oobCode");
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    const verifyEmail = async () => {
      if (oobCode) {
        try {
          await auth.applyActionCode(oobCode);
          setMessage("Your email has been successfully verified!");
        } catch (error) {
          setError("Email verification failed. The link may be invalid or expired.");
        }
      } else {
        setError("Invalid verification link.");
      }
    };
    verifyEmail();
  }, [oobCode]);

  return (
    <div className="verify-container">
      <h2 className="verify-title">Email Verification</h2>
      {error ? (
        <div className="verify-error">{error}</div>
      ) : (
        <div className="verify-message">{message}</div>
      )}
      <div className="verify-button-group">
        <button
          onClick={() => navigate("/login")}
          className="verify-login-button"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationScreen;
