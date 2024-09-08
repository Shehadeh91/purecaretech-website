import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import useAppStore from '../useAppStore';
import './CheckoutForm.css';

const CheckoutForm = ({ amount, apiUrl, handlePaymentSuccess, handlePaymentFail }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setProcessing] = useState(false);

  const { name, address, email, setAddress, setName, setEmail } = useAppStore();

  // Function to fetch payment intent and customer info from the backend
  const fetchPaymentIntent = async () => {
    const customerIdResponse = await fetch(`${apiUrl}/retrieveOrCreateCustomer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const { customerId } = await customerIdResponse.json();

    const response = await fetch(`${apiUrl}/payment-sheet-onetime`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount, // Pass the amount directly (no need to multiply by 100)
        customerId,
      }),
    });

    const { paymentIntent } = await response.json();
    return paymentIntent;
  };

  // Function to handle form submission and payment processing
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe.js has not yet loaded.');
      return;
    }

    setProcessing(true);

    try {
      const paymentIntentClientSecret = await fetchPaymentIntent();

      const cardElement = elements.getElement(CardElement);

      // Confirm the payment using the payment intent client secret
      const { error, paymentIntent } = await stripe.confirmCardPayment(paymentIntentClientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
            email,
            address: {
              city: 'Winnipeg',
              state: 'MB',
              country: 'CA',
            },
          },
        },
      });

      if (error) {
        console.error('Payment failed:', error.message);
        setErrorMessage(error.message);
        setProcessing(false);
        handlePaymentFail(error.message);  // Call handlePaymentFail on error
        return;
      }

      console.log('Payment successful:', paymentIntent);
      handlePaymentSuccess();  // Call handlePaymentSuccess on success
      alert('Payment successful!');
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('An error occurred during payment.');
      handlePaymentFail(error.message);  // Call handlePaymentFail on error
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <label htmlFor="name" className="form-label">Name</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-field"
        placeholder="Enter your full name"
        required
      />

      <label htmlFor="email" className="form-label">Email</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
        placeholder="Enter your email"
        required
      />

      <label htmlFor="address" className="form-label">Address</label>
      <input
        type="text"
        id="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="input-field"
        placeholder="Enter your address"
        required
      />

      <label htmlFor="card-element" className="form-label">Credit or Debit Card</label>
      <div className="card-element-container">
        <CardElement id="card-element" className="card-input" />
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <button className="pay-btn" type="submit" disabled={isProcessing}>
        {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
