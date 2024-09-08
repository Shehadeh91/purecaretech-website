import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import './CheckoutForm.css';

const CheckoutForm = ({ amount, apiUrl }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setProcessing] = useState(false);

  // Form state for user details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Fetch the Payment Intent client secret from your backend
      const response = await fetch(`${apiUrl}/payment-sheet-onetime`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          email: email, // Sending email to identify the customer
        }),
      });

      const { paymentIntent } = await response.json();

      // Confirm the payment with the CardElement
      const { error } = await stripe.confirmCardPayment(paymentIntent, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: name,
            email: email,
            address: {
              line1: address,
            },
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setProcessing(false);
      } else {
        setProcessing(false);
        alert('Payment successful!');
        // Optionally, send an order confirmation SMS or any other post-payment actions
      }
    } catch (error) {
      setErrorMessage('An error occurred while processing the payment.');
      console.error('Payment Error:', error);
      setProcessing(false);
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <label htmlFor="name" className="form-label">
        Name
      </label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-field"
        placeholder="Enter your full name"
        required
      />

      <label htmlFor="email" className="form-label">
        Email
      </label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
        placeholder="Enter your email"
        required
      />

      <label htmlFor="address" className="form-label">
        Address
      </label>
      <input
        type="text"
        id="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="input-field"
        placeholder="Enter your address"
        required
      />

      <label htmlFor="card-element" className="form-label">
        Credit or Debit Card
      </label>
      <div className="card-element-container">
        <CardElement id="card-element" className="card-input" options={{
          style: {
            base: {
              iconColor: '#666EE8',
              color: '#31325F',
              fontWeight: 400,
              fontSize: '16px',
              fontSmoothing: 'antialiased',
              '::placeholder': {
                color: '#CFD7E0',
              },
              ':focus': {
                color: '#424770',
              },
            },
            invalid: {
              color: '#E25950',
            },
          },
        }} />
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <button className="pay-btn" type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing...' : `Pay $${(amount).toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
