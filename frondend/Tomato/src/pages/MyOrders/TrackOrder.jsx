import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import OrderTracking from './OrderTracking';

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { url, token } = useContext(StoreContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.post(url + '/api/order/userorders', {}, { headers: { token } });
        if (response.data.success) {
          const found = response.data.data.find(o => o.id === orderId);
          setOrder(found || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId && token) {
      fetchOrder();
      const interval = setInterval(fetchOrder, 1000); // 1-second polling for instant reaction
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [orderId, token, url]);

  if (loading) return <div style={{margin: 40}}>Loading order status...</div>;
  if (!order) return <div style={{margin: 40, color: 'tomato'}}>Order not found.</div>;

  return (
    <div style={{margin: '40px 0'}}>
      <OrderTracking status={order.status} />
    </div>
  );
};

export default TrackOrder;
