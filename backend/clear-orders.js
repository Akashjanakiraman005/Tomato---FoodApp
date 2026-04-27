import { connectFirebase } from "./firebase.js";

const { db } = connectFirebase();

async function clearOrders() {
    try {
        const snapshot = await db.collection("orders").get();
        if (snapshot.size === 0) {
            console.log("No orders found to delete.");
            process.exit(0);
        }
        
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        
        await batch.commit();
        console.log(`Successfully deleted ${snapshot.size} orders. Tables will now be fully green!`);
        process.exit(0);
    } catch (error) {
        console.error("Error clearing orders:", error);
        process.exit(1);
    }
}

clearOrders();
