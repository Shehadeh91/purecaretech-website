import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';
import { getDocs, collection } from 'firebase/firestore';
import useAppStore from '../useAppStore';
import LogInScreen from './LogInScreen';
import useCarWashStore from '../useCarWashStore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import GavelIcon from '@mui/icons-material/Gavel';
import ShieldIcon from '@mui/icons-material/Shield';
import './AccountScreen.css';

const AccountScreen = () => {
  const navigate = useNavigate();
  const auth = FIREBASE_AUTH;
  const { setAddress, setUser, user } = useAppStore();
  const { setCarBrand, setBodyStyle, setCurrentColor, setCarPlate } = useCarWashStore();
  const [userInfo, setUserInfo] = useState({});

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
            ...doc.data()
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
    auth.signOut()
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

  if (!user || !user.emailVerified) {
    return <LogInScreen />;
  }

  return (
    <Container maxWidth="md" style={{ marginTop: 30 }}>
      <Typography variant="h4" gutterBottom>User Account</Typography>
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
      {/* <Box mt={5}>
        <Button
          startIcon={<GavelIcon />}
          variant="outlined"
          onClick={() => navigate('/termOfService')}
          style={{ marginRight: 10 }}
        >
          Terms of Service
        </Button>
        <Button
          startIcon={<ShieldIcon />}
          variant="outlined"
          onClick={() => navigate('/privacyControl')}
        >
          Privacy Control
        </Button>
      </Box> */}
      <Typography variant="caption" style={{ marginTop: 20, display: 'block', color: 'grey' }}>
        To delete your account, please email admin@purecaretech.com with your registered email address.
      </Typography>
    </Container>
  );
};

export default AccountScreen;
