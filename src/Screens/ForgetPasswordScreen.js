import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import './ForgetPasswordScreen.css'; // Import the CSS for styling

const ForgetPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const auth = getAuth();
  const navigate = useNavigate(); // Use useNavigate for redirection

  const handleSendEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent successfully.");
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      setError("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Reset Password</h2>
      {error && <p className="error-message">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="input"
      />
      <button onClick={handleSendEmail} className="button">
        Send Reset Password
      </button>
    </div>
  );
};

export default ForgetPasswordScreen;
