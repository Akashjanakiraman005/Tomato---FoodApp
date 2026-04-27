import React from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
    const { token, url } = React.useContext(StoreContext);
    const [data, setData] = React.useState([]);

    // Fetch orders from backend to bypass Firebase rules
    const fetchOrders = async () => {
        if (!token) return;
        try {
            const response = await axios.post(url + '/api/order/userorders', {}, { headers: { token } });
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            console.log('Error fetching orders:', error);
        }
    }

    const navigate = useNavigate();

    const handleTrackOrder = (orderId) => {
        navigate(`/trackorder?orderId=${orderId}`);
    }

    React.useEffect(() => {
        if(token){
            fetchOrders();
            const interval = setInterval(fetchOrders, 1000); // 1-second polling for instant reaction
            return () => clearInterval(interval);
        }
    }, [token, url])

    return (
        <div className='myorders'>
            <h2>My Orders</h2>
            <div className="container">
                {data && data.length > 0 ? data.map((order, index) => {
                    return (
                        <div key={index} className="my-orders-order">
                            <img src={assets.parcel_icon} alt="order" />
                            <p>
                                {(order.items || order.item) && (order.items || order.item).length > 0 ? (order.items || order.item).map((item, idx) => (
                                    <span key={idx}>
                                        {item.name} x {item.quantity}
                                        {idx !== (order.items || order.item).length - 1 ? ", " : ""}
                                    </span>
                                )) : "No items"}
                            </p>
                            <p>${order.amount}.00</p>
                            <p> Items: {(order.items || order.item) ? (order.items || order.item).length : 0}</p>
                            <p><span>&#x25cf;</span> <b>{order.status}</b> </p>
                            <button onClick={() => handleTrackOrder(order.id)}>Track Order</button>
                        </div>
                    )
                }) : <p>No orders found</p>}
            </div>
        </div>
    )
}

export default MyOrders
