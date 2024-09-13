import React, { useState } from 'react';
import './AgentRegistration.css'; // Ensure you create this CSS file for styling

const AgentRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('https://us-central1-purecare-2a506.cloudfunctions.net/receiveEmails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });


      if (response.ok) {
        alert('Registration submitted successfully!');
      } else {
        alert('Failed to submit the registration.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  return (
    <div className="agent-registration-container">
      <h1>Join PureCare Tech</h1>
      <p>
        If you are a service provider and would like to join and use our platform, please fill out the form below.
      </p>

      <form className="agent-registration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Your Name/Company Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="service">What Service Do You Provide?</label>
          <input
            type="text"
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>

      <p className="note">
        If you are already a registered agent but are having trouble signing in, please email <a href="mailto:admin@purecaretech.com">admin@purecaretech.com</a> or call us at +1 (204) 803-6949.
      </p>
    </div>
  );
};

export default AgentRegistration;
