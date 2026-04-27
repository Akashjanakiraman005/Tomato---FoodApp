import dotenv from 'dotenv';
dotenv.config();
import PDFDocument from "pdfkit";
import { connectFirebase } from "../firebase.js";
import fs from "fs";

const { db } = connectFirebase();

let fallbackOrders = []; // In-memory fallback for orders when quota is exceeded

// Place an order and save to Firestore (no Stripe)
const placeOrder = async (req, res) => {
    try {
        let orderId = "";
        try {
            const orderRef = await db.collection("orders").add({
                userId: req.userId,
                items: req.body.items,
                amount: req.body.amount,
                address: req.body.address,
                status: "Food Processing",
                payment: req.body.paymentMethod ? true : false,
                paymentMethod: req.body.paymentMethod || "",
                orderType: req.body.orderType || "delivery",
                selectedSeats: req.body.selectedSeats || [],
                createdAt: new Date()
            });
            orderId = orderRef.id;

            // Maintain queue of 10 orders max (delete oldest if > 10)
            const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
            if (snapshot.size > 10) {
                const docsToDelete = snapshot.docs.slice(10);
                const batch = db.batch();
                docsToDelete.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
            }
        } catch (dbError) {
            console.error("Firestore quota exceeded, using fallback memory for order placement.");
            orderId = "fallback-order-" + Date.now();
            fallbackOrders.push({
                id: orderId,
                userId: req.userId,
                items: req.body.items,
                amount: req.body.amount,
                address: req.body.address,
                status: "Food Processing",
                payment: req.body.paymentMethod ? true : false,
                paymentMethod: req.body.paymentMethod || "",
                orderType: req.body.orderType || "delivery",
                selectedSeats: req.body.selectedSeats || [],
                createdAt: { toDate: () => new Date(), _seconds: Math.floor(Date.now() / 1000) }
            });
            if (fallbackOrders.length > 10) {
                fallbackOrders = fallbackOrders.slice(fallbackOrders.length - 10);
            }
        }

        try {
            await db.collection("users").doc(req.userId).set({ cartData: {} }, { merge: true });
        } catch (e) {}

        res.json({ success: true, orderId: orderId });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error", error: error.message });
    }
};

// Generate and stream PDF bill directly
const generateBill = async (req, res) => {
    try {
        const { orderId } = req.body;
        let order = null;
        try {
            const orderDoc = await db.collection("orders").doc(orderId).get();
            if (orderDoc.exists) order = orderDoc.data();
        } catch (e) {
            console.error("Firestore quota exceeded, using fallback memory for generate bill.");
        }
        
        if (!order) {
            order = fallbackOrders.find(o => o.id === orderId);
        }

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="bill_${orderId}.pdf"`);
        const doc = new PDFDocument({ margin: 50 });
        doc.pipe(res);

        // Header Background
        doc.rect(0, 0, doc.page.width, 100).fill('#FF6347');
        
        // Header Text
        doc.fillColor('white').fontSize(28).text("Tomato", 0, 30, { align: "center", bold: true });
        doc.fontSize(14).text("Royal Bill", 0, 65, { align: "center" });
        
        // Reset color and move down below header
        doc.fillColor('#333333');
        doc.moveDown(4);

        // Customer Details Box
        doc.rect(50, 120, doc.page.width - 100, 120).fillAndStroke('#FFF5F5', '#FFB3A7');
        doc.fillColor('#FF6347').fontSize(16).text("Order Details", 60, 130);
        
        doc.fillColor('#555555').fontSize(12);
        doc.text(`Order ID: ${orderId}`, 60, 155);
        doc.text(`Name: ${order.address.firstName} ${order.address.lastName}`, 60, 175);
        doc.text(`Phone: ${order.address.phone}`, 60, 195);
        doc.text(`Address: ${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zipCode}`, 60, 215);

        // Items section
        let y = 270;
        doc.fillColor('#FF6347').fontSize(16).text("Items Ordered", 50, y);
        doc.moveTo(50, y + 20).lineTo(doc.page.width - 50, y + 20).stroke('#FFB3A7');
        
        y += 30;
        doc.fillColor('#333333').fontSize(12);
        order.items.forEach((item, idx) => {
            doc.text(`${idx + 1}. ${item.name}`, 50, y);
            doc.text(`x${item.quantity}`, 350, y);
            doc.text(`₹${item.price * item.quantity}`, 450, y);
            y += 25;
        });

        // Total
        doc.moveTo(50, y).lineTo(doc.page.width - 50, y).stroke('#FFB3A7');
        y += 15;
        
        doc.rect(doc.page.width - 200, y, 150, 40).fill('#FF6347');
        doc.fillColor('white').fontSize(16).text(`Total: ₹${order.amount}`, doc.page.width - 190, y + 12);
        
        // Footer
        doc.fillColor('#999999').fontSize(10).text("Thank you for ordering with Tomato!", 0, doc.page.height - 50, { align: "center" });

        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to generate bill" });
    }
};

const verifyOrder = async (req, res) => {
    const { success, orderId } = req.body;
    try{
        if(success === "true" || success === true){
            try { await db.collection("orders").doc(orderId).update({payment: true}); } catch(e) {}
            const fallbackOrder = fallbackOrders.find(o => o.id === orderId);
            if(fallbackOrder) fallbackOrder.payment = true;
            res.json({success: true, message: "Order Placed Successfully"})
        }
        else {
            try { await db.collection("orders").doc(orderId).delete(); } catch(e) {}
            fallbackOrders = fallbackOrders.filter(o => o.id !== orderId);
            res.json({success: false, message: "Payment Failed. Order Cancelled."})
        }
    } catch(error){
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}

const userOrders = async (req, res) => {
    try{
        let orders = [];
        try {
            const snapshot = await db.collection("orders").where('userId', '==', req.userId).get();
            snapshot.forEach(doc => {
                orders.push({ id: doc.id, ...doc.data() });
            });
        } catch(e) {
            orders = fallbackOrders.filter(o => o.userId === req.userId);
        }
        
        // Sort by createdAt descending
        orders.sort((a, b) => {
            const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt?._seconds * 1000 || 0);
            const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt?._seconds * 1000 || 0);
            return timeB - timeA;
        });
        
        res.json({success: true, data: orders})
    } catch(error){
        console.log("Error in userOrders:", error);
        res.json({success: false, message: "Error: " + error.message})
    }
}

// Admin order list
const listOrders = async (req, res) => {
    try{
        let orders = [];
        try {
            const snapshot = await db.collection("orders").get();
            snapshot.forEach(doc => {
                orders.push({ id: doc.id, ...doc.data() });
            });
        } catch(e) {
            orders = [...fallbackOrders];
        }
        res.json({success: true, data: orders})
    } catch(error){
        console.log("Error in listOrders:", error);
        res.json({success: false, message: "Error: " + error.message})
    }
}

//api for updating order status
const updateStatus = async (req, res) => {
    try{
        try {
            await db.collection("orders").doc(req.body.orderId).update({status: req.body.status});
        } catch(e) {}
        const fallbackOrder = fallbackOrders.find(o => o.id === req.body.orderId);
        if(fallbackOrder) fallbackOrder.status = req.body.status;
        res.json({success: true, message: "Status Updated"})
    }catch(error){
        console.log("Error in updateStatus:", error);
        res.json({success: false, message: "Error: " + error.message})
    }
}

// api for removing order from admin panel
const removeOrder = async (req, res) => {
    try {
        try {
            await db.collection("orders").doc(req.body.orderId).delete();
        } catch(e) {}
        fallbackOrders = fallbackOrders.filter(o => o.id !== req.body.orderId);
        res.json({success: true, message: "Order Removed"});
    } catch (error) {
        console.log("Error in removeOrder:", error);
        res.json({success: false, message: "Error: " + error.message});
    }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus,removeOrder,generateBill};