import React, { useState, useEffect } from 'react';
import './Tables.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Tables = ({ url }) => {
    const [orders, setOrders] = useState([]);

    // Static layout exactly like the customer PlaceOrder page
    const staticTables = [
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

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/order/list`);
            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                toast.error("Failed to fetch orders");
            }
        } catch (error) {
            toast.error("Error fetching orders");
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Poll for real-time updates every 5 seconds
        const interval = setInterval(() => {
            fetchOrders();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Calculate occupancy from orders
    // Orders that are 'Delivered' means the customer left, so their seats are freed.
    const occupiedSeats = new Set();
    orders.forEach(order => {
        if (order.status !== 'Delivered' && order.selectedSeats && order.selectedSeats.length > 0) {
            order.selectedSeats.forEach(seatId => occupiedSeats.add(seatId));
        }
    });

    const totalTables = staticTables.length;
    const occupiedCount = occupiedSeats.size;
    const availableCount = totalTables - occupiedCount;

    return (
        <div className="tables-container">
            <div className="tables-header">
                <div>
                    <h2>Live Table Occupancy</h2>
                    <p style={{ color: '#666', marginTop: '5px' }}>Derived from active customer Dine-In orders.</p>
                </div>
                <div className="tables-stats">
                    <div className="stat-card">
                        <h3>{totalTables}</h3>
                        <p>Total Tables</p>
                    </div>
                    <div className="stat-card" style={{ borderColor: '#4CAF50' }}>
                        <h3 style={{ color: '#4CAF50' }}>{availableCount}</h3>
                        <p>Available</p>
                    </div>
                    <div className="stat-card" style={{ borderColor: '#f44336' }}>
                        <h3 style={{ color: '#f44336' }}>{occupiedCount}</h3>
                        <p>Occupied</p>
                    </div>
                </div>
            </div>

            <div className="theatre-stage">
                <span>FRONT DESK / ENTRANCE</span>
            </div>

            <div className="theatre-grid">
                {staticTables.map((table) => {
                    const isOccupied = occupiedSeats.has(table.id);
                    return (
                        <div 
                            key={table.id} 
                            className={`theatre-table ${isOccupied ? 'occupied' : 'available'}`}
                        >
                            <div className="table-number">Table {table.id}</div>
                            <div className="table-seats">{table.seats} Seats</div>
                            <div className="table-status">
                                {isOccupied ? 'BOOKED' : 'OPEN'}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="legend">
                <div className="legend-item">
                    <div className="legend-color available"></div>
                    <span>Available</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color occupied"></div>
                    <span>Occupied (Active Order)</span>
                </div>
            </div>
        </div>
    );
};

export default Tables;
