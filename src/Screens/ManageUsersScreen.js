import React, { useEffect, useState } from "react";
import { collection, doc, getDocs, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import LogInScreen from "./LogInScreen";
import useAppStore from "../useAppStore";
import { useNavigate } from "react-router-dom";
import './ManageUsersScreen.css'; // Custom CSS

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
  const [agents, setAgents] = useState([]);
  const [invoicesOpen, setInvoicesOpen] = useState({});
  const [servicesOpen, setServicesOpen] = useState({});
  const [invoiceDetailsOpen, setInvoiceDetailsOpen] = useState({});
  const [serviceDetailsOpen, setServiceDetailsOpen] = useState({});
  const [newInvoice, setNewInvoice] = useState({ amount: '', from: '', to: '' });
  const [addingInvoiceForAgentId, setAddingInvoiceForAgentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
      const agentsRef = collection(FIRESTORE_DB, "Agents");
      const snapshot = await getDocs(agentsRef);
      const agentsData = [];
      snapshot.forEach((doc) => {
        agentsData.push({ id: doc.id, ...doc.data() });
      });
      setAgents(agentsData);
    };
    fetchAgents();
  }, []);

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

  const toggleInvoices = (index) => {
    setInvoicesOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleInvoiceDetails = (invoiceIndex) => {
    setInvoiceDetailsOpen((prev) => ({
      ...prev,
      [invoiceIndex]: !prev[invoiceIndex],
    }));
  };

  const toggleServices = (index) => {
    setServicesOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleServiceDetails = (serviceIndex) => {
    setServiceDetailsOpen((prev) => ({
      ...prev,
      [serviceIndex]: !prev[serviceIndex],
    }));
  };

  const updateSettledStatus = async (agentId, serviceIndex) => {
    try {
      const agentRef = doc(FIRESTORE_DB, "Agents", agentId);
      const agentSnapshot = await getDoc(agentRef); // Correctly fetch a single document
      const agentData = agentSnapshot.data();

      const updatedServices = agentData.services.map((service, index) => {
        if (index === serviceIndex) {
          return { ...service, Settled: "Yes" }; // Update Settled to "Yes"
        }
        return service;
      });

      // Update only the services field in Firestore
      await updateDoc(agentRef, { services: updatedServices });

      // Update the local state to reflect the change
      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent.id === agentId ? { ...agent, services: updatedServices } : agent
        )
      );
    } catch (error) {
      console.error("Error updating Settled status:", error);
    }
  };

  const handleNewInvoiceChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice({ ...newInvoice, [name]: value });
  };

  const addInvoice = async (agentId) => {
    setAddingInvoiceForAgentId(agentId); // Show the form to add a new invoice
  };

  const handleSubmitNewInvoice = async () => {
    try {
      const agentRef = doc(FIRESTORE_DB, "Agents", addingInvoiceForAgentId);
      const agentSnapshot = await getDoc(agentRef);
      const agentData = agentSnapshot.data();

      // Add the new invoice with input values
      const newInvoiceData = {
        amount: Number(newInvoice.amount),
        from: new Date(newInvoice.from),
        to: new Date(newInvoice.to),
      };

      const updatedInvoices = [...agentData.Invoices, newInvoiceData];

      // Update the Invoices field in Firestore
      await updateDoc(agentRef, { Invoices: updatedInvoices });

      // Update the local state to reflect the added invoice
      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent.id === addingInvoiceForAgentId
            ? { ...agent, Invoices: updatedInvoices }
            : agent
        )
      );

      // Reset form and hide it
      setAddingInvoiceForAgentId(null);
      setNewInvoice({ amount: '', from: '', to: '' });
    } catch (error) {
      console.error("Error adding new invoice:", error);
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

          {agents.map((agent, index) => (
            <div key={agent.id} className="order-details">
              <span>Total Earnings: ${agent.TotalEarnings}</span>
              <span>Net Pay: {agent.NetPay}</span>
              <span>Number of Services: {agent.NumberOfServices}</span>

              <div className="invoices">
                <h4 onClick={() => toggleInvoices(index)}>
                  Payments {invoicesOpen[index] ? "▲" : "▼"}
                </h4>
                <button
                  className="add-invoice-button"
                  onClick={() => addInvoice(agent.id)}
                >
                  Add Payment
                </button>
                {invoicesOpen[index] &&
                  agent.Invoices?.map((invoice, invoiceIndex) => (
                    <div key={invoiceIndex} className="invoice-card">
                      <h5 onClick={() => toggleInvoiceDetails(invoiceIndex)}>
                      Payment {invoiceIndex} {invoiceDetailsOpen[invoiceIndex] ? "▲" : "▼"}
                      </h5>
                      {invoiceDetailsOpen[invoiceIndex] && (
                        <div className="invoice">
                        <span>
                            From: {new Date(invoice.from.seconds * 1000).toLocaleDateString()}
                          </span>
                          <span>
                            To: {new Date(invoice.to.seconds * 1000).toLocaleDateString()}
                          </span>
                          <span>Amount: ${invoice.amount}</span>

                        </div>
                      )}
                    </div>
                  ))}
              </div>

              {addingInvoiceForAgentId === agent.id && (
                <div className="add-invoice-form">
                  <div className="form-header">
                    <h4>Add New Payment</h4>
                    <button className="close-button" onClick={() => setAddingInvoiceForAgentId(null)}>x</button>
                  </div>
                  <label>Amount:</label>
                  <input
                    type="number"
                    name="amount"
                    value={newInvoice.amount}
                    onChange={handleNewInvoiceChange}
                  />
                  <label>From:</label>
                  <input
                    type="date"
                    name="from"
                    value={newInvoice.from}
                    onChange={handleNewInvoiceChange}
                  />
                  <label>To:</label>
                  <input
                    type="date"
                    name="to"
                    value={newInvoice.to}
                    onChange={handleNewInvoiceChange}
                  />
                  <button onClick={handleSubmitNewInvoice}>Submit Payment</button>
                </div>
              )}

              <div className="services">
                <h4 onClick={() => toggleServices(index)}>
                  Services {servicesOpen[index] ? "▲" : "▼"}
                </h4>
                {servicesOpen[index] &&
                  agent.services?.map((service, serviceIndex) => (
                    <div
                      key={serviceIndex}
                      className={`service-card ${service.Settled === "No" ? "unsettled" : "settled"}`}
                    >
                      <h5 onClick={() => toggleServiceDetails(serviceIndex)}>
                        Service {serviceIndex} {serviceDetailsOpen[serviceIndex] ? "▲" : "▼"}
                      </h5>
                      {serviceDetailsOpen[serviceIndex] && (
                        <div className="service">
                          <span>Payment: {service.Payment}</span>
                          <span>Total: ${service.Total}</span>
                          <span>Type: {service.Type}</span>
                          <span>Settled: {service.Settled}</span>
                          {service.Settled === "No" && (
                            <button
                              onClick={() => updateSettledStatus(agent.id, serviceIndex)}
                              className="settle-button"
                            >
                              Mark as Settled
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
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
