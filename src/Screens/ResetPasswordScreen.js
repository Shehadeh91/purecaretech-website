import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebaseConfig"; // Import Firebase setup
import "./ResetPasswordScreen.css"; // Custom CSS

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const query = new URLSearchParams(useLocation().search);
  const oobCode = query.get("oobCode");
  const navigate = useNavigate();
  const auth = FIREBASE_AUTH;

  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setMessage("Password has been successfully reset. You can now log in.");
    } catch (error) {
      setError("Failed to reset password. The link may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <h2 className="reset-title">Reset Your Password</h2>
      {error && <div className="reset-error">{error}</div>}
      {message ? (
        <div className="reset-message">{message}</div>
      ) : (
        <div className="reset-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="reset-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="reset-input"
            />
          </div>
          <div className="form-group">
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <button onClick={handlePasswordReset} className="reset-button">
                Reset Password
              </button>
            )}
          </div>
        </div>
      )}
      <div className="form-group">
        <button onClick={() => navigate("/login")} className="back-to-login-button">
          Back to Log In
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;
