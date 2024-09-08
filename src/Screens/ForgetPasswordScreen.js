import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import './ForgetPasswordScreen.css'; // Import the CSS for styling

const ForgetPasswordScreen = ({ history }) => {
  const [email, setEmail] = useState("");
  const auth = getAuth();

  const handleSendEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent successfully.");
      history.goBack();
    } catch (error) {
      alert("Failed to send password reset email.");
    }
  };

  return (
    <div className="container">
      <h2>Reset Password</h2>
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
