import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const {getTotalCartAmount,token,food_list,cartItems,url} = useContext(StoreContext);
  const authToken = token || localStorage.getItem("token") || "";
  const [data,setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const [orderType, setOrderType] = useState('dinein');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const tables = [
    { id: 1, seats: 2, row: 1 },
    { id: 2, seats: 4, row: 1 },
    { id: 3, seats: 2, row: 1 },
    { id: 4, seats: 2, row: 2 },
    { id: 5, seats: 4, row: 2 },
    { id: 6, seats: 2, row: 2 },
    { id: 7, seats: 2, row: 3 },
    { id: 8, seats: 4, row: 3 },
    { id: 9, seats: 2, row: 3 },
  ];
  const orderTypes = [
    { key: 'dinein', label: 'Dine In', icon: assets.bag_icon },
    { key: 'takeaway', label: 'Takeaway', icon: assets.parcel_icon },
    { key: 'delivery', label: 'Delivery', icon: assets.basket_icon },
  ];

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData(data => ({...data, [name]: value}));
  };

  const handleOrderTypeChange = (type) => {
    setOrderType(type);
    if (type !== 'dinein') setSelectedSeats([]);
  };

  const handleSeatClick = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [orderId, setOrderId] = useState("");
  const [billUrl, setBillUrl] = useState("");
  const [showPaidButton, setShowPaidButton] = useState(false);

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!authToken) {
      alert("Please login to place an order");
      return;
    }
    const orderItems = food_list
      .filter((item) => (cartItems[item._id] || 0) > 0)
      .map((item) => ({
        ...item,
        quantity: cartItems[item._id],
      }));
    if (orderItems.length === 0) {
      return;
    }
    setShowPaymentOptions(true);
  };

  const handlePaymentSelect = (method) => {
    setSelectedPayment(method);
    setShowPaidButton(method === 'upi' || method === 'card');
    if (method === 'cash') {
      handlePaid(method);
    }
  };

  const handlePaid = async (overrideMethod) => {
    const methodToUse = typeof overrideMethod === 'string' ? overrideMethod : selectedPayment;
    // Save order with payment method
    const orderItems = food_list
      .filter((item) => (cartItems[item._id] || 0) > 0)
      .map((item) => ({
        ...item,
        quantity: cartItems[item._id],
      }));
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      paymentMethod: methodToUse,
      orderType: orderType,
      selectedSeats: selectedSeats
    };
    try {
      let response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token: authToken },
      });
      if (response.data.success) {
        setOrderId(response.data.orderId);
        // Generate bill and auto-download
        const billRes = await axios.post(
          url + "/api/order/generate-bill",
          { orderId: response.data.orderId },
          { 
            headers: { token: authToken },
            responseType: 'blob' 
          }
        );
        const billUrl = window.URL.createObjectURL(billRes.data);
        setBillUrl(billUrl);
      } else {
        alert("Order Error: " + (response.data.error || response.data.message));
      }
    } catch (error) {
      alert("Order failed. Please try again.");
    }
  };

  // Removed handleSend

  return (
    <div className="place-order-container">
      <div className="place-order-flex">
        <div className="place-order-left">
          <h2 style={{ marginBottom: 16 }}>Place Your Order</h2>
          <div className="order-type-radios">
            {orderTypes.map((type) => (
              <label key={type.key} className={`order-type-option${orderType === type.key ? ' selected' : ''}`}
                onClick={() => handleOrderTypeChange(type.key)}>
                <img src={type.icon} alt={type.label} style={{ width: 32, height: 32, marginRight: 8 }} />
                {type.label}
                <input
                  type="radio"
                  name="orderType"
                  value={type.key}
                  checked={orderType === type.key}
                  onChange={() => handleOrderTypeChange(type.key)}
                  style={{ display: 'none' }}
                />
              </label>
            ))}
          </div>
          <div className="cart-total">
            <h3>Cart Summary</h3>
            <div className="cart-total-details">
              <span>Subtotal</span>
              <span>₹{getTotalCartAmount()}</span>
            </div>
            <div className="cart-total-details">
              <span>Delivery</span>
              <span>₹2</span>
            </div>
            <div className="cart-total-details" style={{ fontWeight: 'bold' }}>
              <span>Total</span>
              <span>₹{getTotalCartAmount() + 2}</span>
            </div>
          </div>
          <div style={{ height: 24 }} />
        </div>
        <div className="place-order-right">
          <h3>Customer Details</h3>
          <form className="customer-details-form" onSubmit={placeOrder}>
            <div className="form-row">
              <input type="text" name="firstName" placeholder="First Name" value={data.firstName} onChange={handleChange} required />
              <input type="text" name="lastName" placeholder="Last Name" value={data.lastName} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <input type="email" name="email" placeholder="Email" value={data.email} onChange={handleChange} required />
              <input type="text" name="phone" placeholder="Phone" value={data.phone} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <input type="text" name="street" placeholder="Street Address" value={data.street} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <input type="text" name="city" placeholder="City" value={data.city} onChange={handleChange} required />
              <input type="text" name="state" placeholder="State" value={data.state} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <input type="text" name="zipCode" placeholder="Zip Code" value={data.zipCode} onChange={handleChange} required />
              <input type="text" name="country" placeholder="Country" value={data.country} onChange={handleChange} required />
            </div>
            <button type="submit" className="proceed-to-pay-btn">Proceed to Pay</button>
          </form>
          {showPaymentOptions && (
            <div className="payment-modal royal-modal">
              <h2 style={{fontWeight:800, fontSize:'2rem', color:'tomato', marginBottom:8, letterSpacing:1}}>Royal Payment</h2>
              <div className="payment-options">
                <button className={`royal-btn${selectedPayment === 'upi' ? ' selected' : ''}`} onClick={() => handlePaymentSelect('upi')}>
                  <span role="img" aria-label="UPI" style={{fontSize:'1.3em',marginRight:8}}>💸</span>UPI
                </button>
                <button className={`royal-btn${selectedPayment === 'cash' ? ' selected' : ''}`} onClick={() => handlePaymentSelect('cash')}>
                  <span role="img" aria-label="Cash" style={{fontSize:'1.3em',marginRight:8}}>💵</span>Cash
                </button>
                <button className={`royal-btn${selectedPayment === 'card' ? ' selected' : ''}`} onClick={() => handlePaymentSelect('card')}>
                  <span role="img" aria-label="Card" style={{fontSize:'1.3em',marginRight:8}}>💳</span>Card
                </button>
              </div>
              {selectedPayment === 'upi' && (
                <div className="upi-section">
                  <img src={assets.upi} alt="UPI QR" style={{ width: 220, margin: 16, borderRadius: 18, boxShadow: '0 4px 24px rgba(255,99,71,0.18)' }} />
                  <p style={{fontWeight:700, color:'#ff7e5f', fontSize:'1.18rem', marginBottom: 12}}>Scan this QR to pay via UPI</p>
                  <button className="royal-btn paid-btn" style={{marginTop:8}} onClick={handlePaid} type="button">I Have Paid, Generate Bill</button>
                </div>
              )}
              {selectedPayment === 'card' && (
                <div className="card-section royal-text">
                  <p style={{fontWeight:600, color:'#ff7e5f', fontSize:'1.1rem'}}>Please use our card machine for payment.</p>
                </div>
              )}
              {showPaidButton && selectedPayment !== 'upi' && (
                <button className="royal-btn paid-btn" onClick={handlePaid} type="button">Mark as Paid</button>
              )}
              {billUrl && (
                <div className="bill-section" style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
                  <a href={billUrl} download={`bill_${orderId}.pdf`} className="royal-btn" style={{width: '100%', boxSizing: 'border-box'}}>Download Royal Bill (PDF)</a>
                  <button className="track-order-btn" onClick={() => window.location.href = `/trackorder?orderId=${orderId}`}>
                    <span role="img" aria-label="track" style={{fontSize: '1.2em'}}>🚚</span> Track Order
                  </button>
                </div>
              )}
            </div>
          )}
          {orderType === 'dinein' && (
            <div className="dinein-seats" style={{marginTop: 32}}>
              <h4>Select Your Table(s)</h4>
              <div className="tables-grid">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className={`table-box${selectedSeats.includes(table.id) ? ' selected' : ''}`}
                    onClick={() => handleSeatClick(table.id)}
                  >
                    Table {table.id} ({table.seats} seats)
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
