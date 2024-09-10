import React from "react";
import './AgentAdminHelpPage.css';

const AgentAdminHelpPage = () => {
  return (
    <div className="help-page-container">
      <div className="help-page-card">
        <h1 className="help-page-title">Agent/Admin Login Help</h1>
        <p className="help-page-text">
          If you're an agent or admin, please login using your registered agent/admin account.
          Ensure you are using the correct credentials linked to your account.
        </p>
        <p className="help-page-text">
          If you still face any issues accessing your account, feel free to contact us.
        </p>
        <p className="help-page-text">
          Email: <a href="mailto:admin@purecaretech.com" className="help-page-link">admin@purecaretech.com</a>
        </p>
        <p className="help-page-text">
          Phone: <a href="tel:+12048036949" className="help-page-link">+1 (204) 803-6949</a>
        </p>
      </div>
    </div>
  );
};

export default AgentAdminHelpPage;
