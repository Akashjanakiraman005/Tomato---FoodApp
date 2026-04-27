import React, { useState, useEffect } from 'react';
import './Finance.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const Finance = ({ url }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${url}/api/order/list`);
                if (response.data.success) {
                    setOrders(response.data.data);
                } else {
                    toast.error("Failed to fetch financial data");
                }
            } catch (error) {
                toast.error("Error fetching financial data");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [url]);

    // Robust Date Parser for Firestore Timestamps & JSON Dates
    const parseDate = (createdAt) => {
        if (!createdAt) return new Date();
        if (createdAt._seconds) return new Date(createdAt._seconds * 1000);
        if (typeof createdAt === 'string' || typeof createdAt === 'number') return new Date(createdAt);
        return new Date();
    };

    // Calculate Metrics based ONLY on PAID orders
    const paidOrders = orders.filter(order => order.payment === true);

    const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const totalPaidOrdersCount = paidOrders.length;
    const averageOrderValue = totalPaidOrdersCount > 0 ? (totalRevenue / totalPaidOrdersCount).toFixed(2) : 0;

    // Current Month Metrics
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthOrders = paidOrders.filter(order => {
        const date = parseDate(order.createdAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    const monthlyRevenue = currentMonthOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

    // Prepare Data for Bar Chart (Monthly Revenue for Current Year)
    const monthlyDataMap = {
        0: 'Jan', 1: 'Feb', 2: 'Mar', 3: 'Apr', 4: 'May', 5: 'Jun',
        6: 'Jul', 7: 'Aug', 8: 'Sep', 9: 'Oct', 10: 'Nov', 11: 'Dec'
    };

    const barChartData = Object.keys(monthlyDataMap).map(monthIndex => ({
        name: monthlyDataMap[monthIndex],
        Revenue: 0
    }));

    paidOrders.forEach(order => {
        const date = parseDate(order.createdAt);
        if (date.getFullYear() === currentYear) {
            const month = date.getMonth();
            barChartData[month].Revenue += (order.amount || 0);
        }
    });

    // Prepare Data for Pie Chart (Order Types)
    let dinein = 0, takeaway = 0, delivery = 0;
    paidOrders.forEach(order => {
        if (order.orderType === 'dinein') dinein++;
        else if (order.orderType === 'takeaway') takeaway++;
        else delivery++; // default or 'delivery'
    });

    const pieChartData = [
        { name: 'Dine In', value: dinein },
        { name: 'Delivery', value: delivery },
        { name: 'Takeaway', value: takeaway },
    ];
    const COLORS = ['#FF6347', '#4CAF50', '#FFC107'];

    if (loading) {
        return <div className="finance-container"><h2>Loading Financial Data...</h2></div>;
    }

    return (
        <div className="finance-container">
            <div className="finance-header">
                <h2>Finance & Analytics</h2>
                <p>Real-time financial performance and revenue metrics</p>
            </div>

            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-title">Total Revenue</div>
                    <h3 className="metric-value">₹{totalRevenue}</h3>
                    <div className="metric-subtitle">
                        <span>Lifetime earnings</span>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-title">This Month</div>
                    <h3 className="metric-value">₹{monthlyRevenue}</h3>
                    <div className="metric-subtitle">
                        <span>Current month revenue</span>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-title">Total Orders</div>
                    <h3 className="metric-value">{totalPaidOrdersCount}</h3>
                    <div className="metric-subtitle">
                        <span>Successfully paid orders</span>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-title">Average Order Value</div>
                    <h3 className="metric-value">₹{averageOrderValue}</h3>
                    <div className="metric-subtitle">
                        <span>Per transaction</span>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Monthly Revenue Overview</h3>
                        <p>Income generated per month in {currentYear}</p>
                    </div>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888'}} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip 
                                    cursor={{fill: '#f9f9f9'}}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="Revenue" fill="#FF6347" radius={[6, 6, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <div className="chart-header">
                        <h3>Order Distribution</h3>
                        <p>By order type</p>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Finance;
