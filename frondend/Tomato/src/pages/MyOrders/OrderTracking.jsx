import React from 'react';
import './OrderTracking.css';

const statusSteps = [
  'Food Processing',
  'Out for Delivery',
  'Delivered'
];

const OrderTracking = ({ status }) => {
  const currentStep = statusSteps.indexOf(status);

  if (status === 'Delivered') {
    return (
      <div className="delivered-container">
        <div className="delivered-card">
          <div className="delivered-icon-wrapper">
            <span role="img" aria-label="party">🎉</span>
          </div>
          <h1 className="delivered-title">Order Delivered!</h1>
          <p className="delivered-subtitle">Thank you for visiting Tomato.</p>
          <p className="delivered-text">We hope you enjoy your delicious meal. We can't wait to serve you again!</p>
          <button className="royal-btn" style={{marginTop: '10px'}} onClick={() => window.location.href = '/'}>
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-tracking">
      <h2>Order Tracking</h2>
      <div className="tracking-steps">
        {statusSteps.map((step, idx) => (
          <div key={step} className={`tracking-step${idx <= currentStep ? ' active' : ''}`}>
            <div className="circle">{idx + 1}</div>
            <div className="label">{step}</div>
            {idx < statusSteps.length - 1 && <div className="bar" />}
          </div>
        ))}
      </div>
      <div className="current-status">Current status: <b>{status}</b></div>
    </div>
  );
};

export default OrderTracking;
