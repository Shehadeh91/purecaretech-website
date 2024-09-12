import React, { useEffect, useState, useCallback } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import './EarningOverviewScreen.css';

const AgentEarningOverviewScreen = () => {
  const [agentData, setAgentData] = useState(null);
  const navigate = useNavigate();

  const fetchAgentData = useCallback(async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const agentDocRef = doc(FIRESTORE_DB, "Agents", user.email);

        const agentDocSnap = await getDoc(agentDocRef);
        if (agentDocSnap.exists()) {
          const data = agentDocSnap.data();
          if (data.Invoices) {
            data.netPay = data.Invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
          }
          setAgentData(data);
        } else {
          console.log("Agent document does not exist");
        }
      }
    } catch (error) {
      console.error("Error fetching agent's data:", error);
    }
  }, []);

  useEffect(() => {
    fetchAgentData();
  }, [fetchAgentData]);

  const formatDate = (date) => {
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="agent-earning-overview-container">
      <div className="agent-earning-overview-header-container">
        <img
          className="agent-earning-overview-avatar"
          src={require("../assets/Images/agentFace.png")}
          alt="Agent"
        />
        <div className="agent-earning-overview-info-container">
          <h2 className="agent-earning-overview-agent-name">
            {agentData ? agentData.Name : ""}
          </h2>
          <p className="agent-earning-overview-agent-info">
            {agentData ? agentData.Phone : ""}
          </p>
          <p className="agent-earning-overview-agent-info">
            {agentData ? agentData.Email : ""}
          </p>
        </div>

      </div>

      <div className="agent-earning-overview-card-container">
        <div className="agent-earning-overview-card">
          <div className="agent-earning-overview-card-title">
            <img
              className="agent-earning-overview-card-icon"
              src={require("../assets/Images/completed Services.png")}
              alt="Completed Services"
            />
            <div>
              <h3>Completed Services</h3>
              <p>{agentData ? agentData.NumberOfServices : "0"}</p>

            </div>

          </div>
          <button className="button-manage-my-orders" onClick={() => navigate("/agents")}>
     Manage My Orders
    </button>
        </div>
        <div className="agent-earning-overview-card">
          <div className="agent-earning-overview-card-title">
            <img
              className="agent-earning-overview-card-icon"
              src={require("../assets/Images/ManageOrders.png")}
              alt="Completed Services"
            />
            <div>
              <h3>Your Average Rating</h3>
              <p>{agentData ? agentData.AgentRating + "/5" : "0"}</p>

            </div>

          </div>

        </div>

        <div className="agent-earning-overview-card">
          <div className="agent-earning-overview-card-title">
            <img
              className="agent-earning-overview-card-icon"
              src={require("../assets/Images/GrossEarnings.png")}
              alt="Total Earnings"
            />
            <div>
              <h3>Net Pay</h3>
              <p>${agentData ? agentData.netPay.toFixed(2) : "0.00"}</p>
            </div>
          </div>
          <p className="agent-earning-overview-earnings-info">
            Your earnings will be deposited into your bank account every Friday.
          </p>
        </div>
      </div>

      <h4 className="agent-earning-overview-invoices-title">Payments</h4>
      <div className="agent-earning-overview-invoices-container-scroll">
        {agentData && agentData.Invoices ? (
          agentData.Invoices.slice().reverse().map((invoice, index) => (
            <div key={index} className="agent-earning-overview-invoice-card">
              <p>
                Payment {agentData.Invoices.length - index}
              </p>
              <p>
                From: {invoice["from"] ? formatDate(invoice["from"].toDate()) : "N/A"}
              </p>
              <p>
                To: {invoice["to"] ? formatDate(invoice["to"].toDate()) : "N/A"}
              </p>
              <p>Amount: ${invoice.amount}</p>
            </div>
          ))
        ) : (
          <p>No Payment found</p>
        )}
      </div>
    </div>
  );
};

export default AgentEarningOverviewScreen;
