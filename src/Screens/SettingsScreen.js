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
      <Typography variant="h4" align="center" gutterBottom>
        Account Settings
      </Typography>

      <List>
        <ListItem>
          <AccountCircle />
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={updateUserProfile}
          />
        </ListItem>
        <Divider />

        <ListItem>
          <Phone />
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={updateUserProfile}

          />
        </ListItem>
        <Divider />

        <ListItem>
          <Email />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={userInfo.Email || ''}
            disabled
          />
        </ListItem>
        <Divider />

        <Typography variant="h6" className="password-section-title">
          Change Password
        </Typography>

        <ListItem>
          <Lock />
          <TextField
            label="Current Password"
            variant="outlined"
            fullWidth
            type={passwordVisible ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </ListItem>
        <Divider />

        <ListItem>
          <Lock />
          <TextField
            label="New Password"
            variant="outlined"
            fullWidth
            type={passwordVisible ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <IconButton onClick={() => setPasswordVisible(!passwordVisible)}>
            {passwordVisible ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </ListItem>
        <Divider />

        <ListItem>
          <Lock />
          <TextField
            label="Confirm New Password"
            variant="outlined"
            fullWidth
            type={passwordVisible ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </ListItem>
        <Divider />
      </List>

      <Button variant="contained" color="primary" fullWidth onClick={handleChangePassword}>
        Confirm Password Change
      </Button>
    </div>
  );
};

export default SettingsScreen;
