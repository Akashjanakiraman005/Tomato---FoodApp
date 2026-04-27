import React from 'react'
import './Orders.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets'

const Orders = ({url}) => {
    const [orders, setOrders] = React.useState([]);

    const fetchOrders = async () => {
      try {
        const response = await axios.get(url + '/api/order/list');
        if (response.data.success) {
          const ordersArr = response.data.data;
          ordersArr.sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt._seconds * 1000).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt._seconds * 1000).getTime() : 0;
            return timeB - timeA;
          });
          setOrders(ordersArr);
        }
      } catch (error) {
        console.error("Failed to fetch orders via API", error);
      }
    };

    React.useEffect(() => {
      fetchOrders();
      const interval = setInterval(fetchOrders, 3000);
      return () => clearInterval(interval);
    }, [url]);

    const handleDeleteOrder = async (orderId) => {
      try {
        const response = await axios.post(url + '/api/order/remove', { orderId });
        if (response.data.success) {
          toast.success('Order deleted');
          await fetchOrders();
        } else {
          toast.error('Failed to delete order');
        }
      } catch (error) {
        toast.error('Error deleting order');
      }
    }

    const statushandler = async(event,orderId) =>{
      const response = await axios.post(url+"/api/order/updateStatus",{orderId: orderId, status: event.target.value});
      if(response.data.success){
        await fetchOrders(); // Instantly update the UI without waiting for the next poll
        toast.success("Status Updated");
      }
    }

    const formatDate = (timestamp) => {
        if (!timestamp || !timestamp._seconds) return 'Unknown Date';
        const date = new Date(timestamp._seconds * 1000);
        return date.toLocaleString('en-US', { 
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true 
        });
    }

  return (
    <div className='order-container'>
     <h1>Admin Panel - Order Management</h1>
     <div className="order-list">
      {orders.map((order,index)=>{
          const itemsArray = order.items || order.item || [];
          return (
            <div key={index} className="order-item">
             
             <div className="order-icon-container">
               <img src={assets.parcel_icon} alt="Parcel" />
             </div>

             <div className="order-details-col">
              <p className='order-item-food'>
                {itemsArray.map((item, itemIndex) => {
                  if(itemIndex === itemsArray.length - 1){
                    return item.name + " x " + item.quantity;
                  }
                  else{
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              
              <div className="order-customer-info">
                  <p className='order-item-name'>
                    {order.address.firstName + " " + order.address.lastName}
                  </p>
                  <div className="order-item-address">
                    <p>{order.address.street + ","}</p>
                    <p>{order.address.city + ", " + order.address.state + ", " + order.address.zipCode + ", " + order.address.country}</p>
                  </div>
                  <p className='order-item-phone'>{order.address.phone}</p>
              </div>
            </div>

            <div className="order-meta-col">
              <p className="order-date">{formatDate(order.createdAt)}</p>
              <p className="order-items-count">Items: {itemsArray.length}</p>
              <p className="order-amount">₹{order.amount}.00</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '5px' }}>
                <div className={`payment-badge ${order.payment ? 'paid' : 'unpaid'}`}>
                    {order.payment ? 'Paid' : 'Unpaid'}
                </div>
                {order.paymentMethod && (
                  <div className="payment-method-badge" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555', background: '#eee', padding: '4px 8px', borderRadius: '6px' }}>
                    {order.paymentMethod.toUpperCase()}
                  </div>
                )}
              </div>
              {order.orderType && (
                <div className="order-type-badge" style={{marginTop: '8px', fontSize: '0.9rem', fontWeight: 'bold', color: 'tomato', background: '#ffe5d0', padding: '4px 8px', borderRadius: '6px', display: 'inline-block'}}>
                  {order.orderType === 'dinein' 
                    ? `🍽️ Dine In (Tables: ${order.selectedSeats?.length > 0 ? order.selectedSeats.join(', ') : 'None'})` 
                    : order.orderType === 'takeaway' 
                      ? '🥡 Takeaway' 
                      : '🛵 Delivery'}
                </div>
              )}
            </div>

            <div className="order-actions-col">
              <select onChange={(event)=>statushandler(event,order.id)} value={order.status || 'Food Processing'}>
                <option value="Food Processing">Food processing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
              <button className="delete-btn" onClick={() => handleDeleteOrder(order.id)}>
                 Remove Order
              </button>
            </div>

            </div>
          )
      })}
      </div>    
    </div>
  )
}

export default Orders
