import React, { useEffect, useState } from "react";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import LogInScreen from "./LogInScreen";
import useAppStore from "../useAppStore";
import { useNavigate } from "react-router-dom";

const ManageUsersScreen = () => {
  const { user, setUser } = useAppStore();
  const auth = FIREBASE_AUTH;
  const [showClients, setShowClients] = useState(true);
  const [showAgents, setShowAgents] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false);
  const [highlightedButton, setHighlightedButton] = useState("Client");
  const [client, setClient] = useState([]);
  const [agent, setAgent] = useState([]);
  const [admin, setAdmin] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user.email) return;
      const ordersRef = collection(FIRESTORE_DB, "Users");
      const querySnapshot = await getDocs(ordersRef);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClient(data.filter((users) => users.Role === "Client").reverse());
      setAgent(data.filter((users) => users.Role === "Agent").reverse());
      setAdmin(data.filter((users) => users.Role === "Admin").reverse());
    };
    fetchOrders();
  }, [user]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, [auth]);

  const handleButtonPress = (role) => {
    setShowClients(role === "Client");
    setShowAgents(role === "Agent");
    setShowAdmins(role === "Admin");
    setHighlightedButton(role);
  };

  const changeToAgent = async (orderId) => {
    try {
      const orderRef = doc(FIRESTORE_DB, "Users", orderId);
      await setDoc(orderRef, { Role: "Agent" }, { merge: true });
      setAgent((prevOrders) => [...prevOrders, ...client]);
      setClient([]);
    } catch (error) {
      console.error("Error marking users as Agent:", error);
    }
  };

  if (!user || !user.emailVerified) {
    return <LogInScreen />;
  }

  return (
    <div className="container">
     <button className="button-manage-users-orders" onClick={() => navigate("/admin")}>
      Manage Orders
    </button>
      <div className="buttons-container">
        <button
          onClick={() => handleButtonPress("Client")}
          className={`buttond ${highlightedButton === "Client" ? "highlighted" : ""}`}
        >
          Clients
        </button>
        <button
          onClick={() => handleButtonPress("Agent")}
          className={`buttond ${highlightedButton === "Agent" ? "highlighted" : ""}`}
        >
          Agents
        </button>
        <button
          onClick={() => handleButtonPress("Admin")}
          className={`buttond ${highlightedButton === "Admin" ? "highlighted" : ""}`}
        >
          Admins
        </button>
      </div>

      {showClients && (
        <div className="orders-list">
          {client.map((user) => (
            <div key={user.id} className="order-item">
              <div className="order-details">
                <span>Email: {user.Email}</span>
                <span>Name: {user.Name}</span>
                <span>Phone: {user.Phone}</span>
                <button className="buttonc" onClick={() => changeToAgent(user.id)}>
                  Become An Agent
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAgents && (
        <div className="orders-list">
          {agent.map((user) => (
            <div key={user.id} className="order-item">
              <div className="order-details">
                <span>Email: {user.Email}</span>
                <span>Name: {user.Name}</span>
                <span>Phone: {user.Phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdmins && (
        <div className="orders-list">
          {admin.map((user) => (
            <div key={user.id} className="order-item">
              <div className="order-details">
                <span>Email: {user.Email}</span>
                <span>Name: {user.Name}</span>
                <span>Phone: {user.Phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageUsersScreen;
