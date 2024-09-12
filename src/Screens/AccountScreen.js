import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';
import { getDocs, collection, doc, deleteDoc } from 'firebase/firestore';
import { reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth';
import useAppStore from '../useAppStore';
import LogInScreen from './LogInScreen';
import useCarWashStore from '../useCarWashStore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import './AccountScreen.css';

const AccountScreen = () => {
  const navigate = useNavigate();
  const auth = FIREBASE_AUTH;
  const { setAddress, setUser, setName, user,  phone, setPhone} = useAppStore();
  const { setCarBrand, setBodyStyle, setCurrentColor, setCarPlate } = useCarWashStore();
  const [userInfo, setUserInfo] = useState({});
  const [password, setPassword] = useState('');
  const [deletionReason, setDeletionReason] = useState('');
  const [deletionError, setDeletionError] = useState(null); // Error handling state



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Update user state
    });
    return unsubscribe; // Clean up subscription
  }, [auth, setUser]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!user || !user.emailVerified) {
          return;
        }
        const userDocRef = collection(FIRESTORE_DB, 'Users');
        const querySnapshot = await getDocs(userDocRef);
        const userData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .find((data) => data.userId === user.uid);
        if (userData) {
          setUserInfo(userData);


        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, [user]);

  const handleLogout = useCallback(() => {
    auth
      .signOut()
      .then(() => {
        setAddress('Winnipeg, MB, Canada');
        setCarPlate('');
        setCarBrand('Mazda');
        setBodyStyle('Sedan');
        setCurrentColor('');
        navigate('/login');
      })
      .catch((error) => console.error('Logout failed:', error));
  }, [auth, setAddress, setCarPlate, setCarBrand, setBodyStyle, setCurrentColor, navigate]);

  const handleDeleteAccount = async () => {
    if (!deletionReason.trim() || !password) {
      setDeletionError('Please provide a reason and your password to delete your account.');
      return;
    }

    try {
      // Reauthenticate the user with their password before deleting
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Delete user from Firestore
      const userDocRef = doc(FIRESTORE_DB, 'Users', user.email);
      await deleteDoc(userDocRef);

      // Delete user from Firebase Authentication
      await deleteUser(user);

      alert('Success: Your account has been deleted.');
      navigate('/login'); // Redirect to login page after deletion
    } catch (error) {
      console.error('Account deletion failed:', error);
      setDeletionError('Failed to delete account. Please try again.');
    }
  };

  if (!user || !user.emailVerified) {
    return navigate("/login");
  }

  return (
    <Container maxWidth="md" className="account-container">
      <Typography variant="h4" gutterBottom>
        User Account
      </Typography>
      <List>
        <ListItem>
          <AccountCircleIcon style={{ marginRight: 10 }} />
          <ListItemText primary="Name" secondary={userInfo.Name || 'N/A'} />
        </ListItem>
        <Divider />
        <ListItem>
          <PhoneIcon style={{ marginRight: 10 }} />
          <ListItemText primary="Phone Number" secondary={userInfo.Phone || 'N/A'} />
        </ListItem>
        <Divider />
        <ListItem>
          <EmailIcon style={{ marginRight: 10 }} />
          <ListItemText primary="Email" secondary={userInfo.Email || 'N/A'} />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => navigate('/settings')}>
          <EditIcon style={{ marginRight: 10 }} />
          <ListItemText primary="Edit Account" />
        </ListItem>
        <Divider />
        <ListItem button onClick={handleLogout}>
          <LogoutIcon style={{ marginRight: 10 }} />
          <ListItemText primary="Log Out" />
        </ListItem>
      </List>

      <div className="delete-account-section">
        <Typography variant="h6" gutterBottom>
          Delete Account
        </Typography>
        {deletionError && <Typography color="error">{deletionError}</Typography>}
        <div>
  <label>Reason for Deletion</label>
  <input
    type="text"
    value={deletionReason}
    onChange={(e) => setDeletionReason(e.target.value)}
    placeholder="Enter reason"
    className="input-field"
  />
</div>
<div>
  <label>Enter Password</label>
  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Enter password"
    className="input-field"
  />
</div>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleDeleteAccount}
          className="delete-account-button"
        >
          Delete Account
        </Button>
      </div>

      {/* <Typography variant="caption" className="account-info-text">
        To delete your account, please email admin@purecaretech.com with your registered email address.
      </Typography> */}
    </Container>
  );
};

export default AccountScreen;
