import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { applyActionCode, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig"; // Import Firebase setup
import "./AuthActionScreen.css"; // Custom CSS

const AuthActionScreen = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const query = new URLSearchParams(useLocation().search);
  const mode = query.get("mode"); // Firebase action type (resetPassword or verifyEmail)
  const oobCode = query.get("oobCode");
  const auth = FIREBASE_AUTH;
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === "verifyEmail") {
      handleEmailVerification();
    } else if (mode === "resetPassword") {
      handlePasswordResetCodeVerification();
    } else {
      setError("Invalid action mode.");
    }
  }, [mode, oobCode]);

  // Handle email verification
  const handleEmailVerification = async () => {
    setLoading(true);
    try {
      await applyActionCode(auth, oobCode);
      setMessage("Email verified successfully! You can now log in.");
    } catch (error) {
      setError("Email verification failed. The link may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset verification
  const handlePasswordResetCodeVerification = async () => {
    try {
      await verifyPasswordResetCode(auth, oobCode);
      setMessage("Please enter your new password.");
    } catch (error) {
      setError("Password reset failed. The link may be invalid or expired.");
    }
  };

  // Handle the actual password reset
  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setMessage("Password has been successfully reset! You can now log in.");
    } catch (error) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-action-container">
      <h2 className="auth-action-title">Authentication Action</h2>
      {error && <div className="auth-action-error">{error}</div>}
      {message && <div className="auth-action-message">{message}</div>}

      {mode === "resetPassword" && (
        <div className="auth-action-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-action-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="auth-action-input"
            />
          </div>
          <button onClick={handlePasswordReset} className="auth-action-button" disabled={loading}>
            {loading ? "Processing..." : "Reset Password"}
          </button>
        </div>
      )}

      <button onClick={() => navigate("/login")} className="auth-action-back-to-login">
        Back to Log In
      </button>
    </div>
  );
};

export default AuthActionScreen;
