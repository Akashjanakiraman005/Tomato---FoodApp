import { connectFirebase } from "../firebase.js";

const { db } = connectFirebase();
const tableCollection = db.collection("tables");

let fallbackTables = [];

// List all tables
const listTables = async (req, res) => {
    try {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Firestore timeout")), 100)
        );
        const snapshot = await Promise.race([tableCollection.get(), timeoutPromise]);
        
        let tables = snapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() }));
        if (tables.length === 0 && fallbackTables.length > 0) {
             tables = fallbackTables;
        }
        res.status(200).json({ success: true, data: tables });
    } catch (error) {
        console.log("Firestore quota exceeded or timeout. Using fallback tables list.");
        res.status(200).json({ success: true, data: fallbackTables, isFallback: true });
    }
};

// Add new table
const addTable = async (req, res) => {
    try {
        const tableData = {
            number: Number(req.body.number),
            capacity: Number(req.body.capacity),
            status: "Available" // Default status
        };

        try {
            const docRef = await tableCollection.add(tableData);
            res.status(201).json({ success: true, message: "Table added successfully", data: { _id: docRef.id, id: docRef.id, ...tableData } });
        } catch (dbError) {
             console.error("Firestore quota exceeded, using fallback memory for addTable.");
             const newTable = { _id: "fallback-table-" + Date.now(), id: "fallback-table-" + Date.now(), ...tableData };
             fallbackTables.push(newTable);
             res.status(201).json({ success: true, message: "Table added successfully (Fallback)", data: newTable });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to add table", error: error.message });
    }
};

// Update table status
const updateStatus = async (req, res) => {
    try {
        const tableId = req.body.tableId;
        const status = req.body.status;

        try {
            await tableCollection.doc(tableId).update({ status: status });
        } catch (e) {
            console.log("Firestore update failed, trying fallback.");
        }

        const fallbackTable = fallbackTables.find(t => t.id === tableId || t._id === tableId);
        if (fallbackTable) {
            fallbackTable.status = status;
        }

        res.json({ success: true, message: "Table status updated" });
    } catch (error) {
        console.log("Error in updateStatus:", error);
        res.json({ success: false, message: "Error: " + error.message });
    }
};

// Remove table
const removeTable = async (req, res) => {
    try {
        const tableId = req.body.tableId;

        try {
            await tableCollection.doc(tableId).delete();
        } catch (e) {
            console.log("Firestore delete failed, trying fallback.");
        }

        fallbackTables = fallbackTables.filter(t => t.id !== tableId && t._id !== tableId);
        res.json({ success: true, message: "Table removed successfully" });
    } catch (error) {
        console.log("Error in removeTable:", error);
        res.json({ success: false, message: "Error: " + error.message });
    }
};

export { addTable, listTables, updateStatus, removeTable };
