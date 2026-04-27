import { connectFirebase } from './firebase.js';

const checkOrders = async () => {
    try {
        const { db } = connectFirebase();
        console.log("Firebase connected");
        
        const snapshot = await db.collection('orders').get();
        const orders = [];
        snapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`Found ${orders.length} orders.`);
        orders.forEach(order => {
            console.log("Order ID:", order.id);
            console.log("- Status:", order.status);
            console.log("- Address exists?", !!order.address);
            console.log("- Items exist?", !!(order.items || order.item));
            console.log("- Payment:", order.payment);
        });
    } catch(err) {
        console.error("Error:", err);
    }
}
checkOrders();
