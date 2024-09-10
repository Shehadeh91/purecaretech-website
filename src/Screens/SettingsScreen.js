import React, { useState, useEffect } from 'react';
import { TextField, Button, Divider, List, ListItem, Typography, IconButton } from '@mui/material';
import { AccountCircle, Phone, Lock, Visibility, VisibilityOff, Email } from '@mui/icons-material';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { FIRESTORE_DB } from "../firebaseConfig";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import './SettingsScreen.css'; // Assuming you have a CSS file for styling

const SettingsScreen = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [userInfo, setUserInfo] = useState({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/login'); // Redirect to login if no user is authenticated
    }
  }, [auth, navigate]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (!user || !user.emailVerified) {
        return;
      }

      const userDocRef = collection(FIRESTORE_DB, 'Users');
      const querySnapshot = await getDocs(userDocRef);
      const userData = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .find((data) => data.userId === user.uid);

      if (userData) {
        setUserInfo(userData);
        setName(userData.Name);
        setPhone(userData.Phone);
      }
    };

    fetchUserInfo();
  }, [auth]);

  const updateUserProfile = async () => {
    try {
      const userDocRef = doc(FIRESTORE_DB, "Users", userInfo.id);
      const updates = {};

      if (name !== userInfo.Name) updates.Name = name;
      if (phone !== userInfo.Phone) updates.Phone = phone;

      await updateDoc(userDocRef, updates);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Error: New passwords do not match.");
      return;
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      await updateUserPasswordInFirestore();
      alert("Password changed successfully.");
    } catch (error) {
      alert("Error: Failed to change password.");
    }
  };

  const updateUserPasswordInFirestore = async () => {
    try {
      const userDocRef = doc(FIRESTORE_DB, "Users", userInfo.email);
      await updateDoc(userDocRef, { Password: newPassword });
    } catch (error) {
      console.error("Error updating user password in Firestore:", error);
    }
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">Account Settings</h2>

      <div className="settings-form">
        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={updateUserProfile}
            className="settings-input"
          />
        </div>
        <hr />

        {/* Phone Number Field */}
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={updateUserProfile}
            className="settings-input"
          />
        </div>
        <hr />

        {/* Email Field (Disabled) */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={userInfo.Email || ''}
            disabled
            className="settings-input"
          />
        </div>
        <hr />

        {/* Password Section */}
        <h3 className="password-section-title">Change Password</h3>

        {/* Current Password */}
        <div className="form-group">
          <label htmlFor="current-password">Current Password</label>
          <input
            type={passwordVisible ? 'text' : 'password'}
            id="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="settings-input"
          />
        </div>
        <hr />

        {/* New Password */}
        <div className="form-group">
          <label htmlFor="new-password">New Password</label>
          <div className="password-input-wrapper">
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="settings-input"
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
        <hr />

        {/* Confirm New Password */}
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm New Password</label>
          <input
            type={passwordVisible ? 'text' : 'password'}
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="settings-input"
          />
        </div>
        <hr />

        <button onClick={handleChangePassword} className="settings-button">
          Confirm Password Change
        </button>
      </div>
    </div>
  );

};

export default SettingsScreen;
