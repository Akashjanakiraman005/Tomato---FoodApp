import { connectFirebase } from '../firebase.js';
const { db } = connectFirebase();
import jwt from 'jsonwebtoken';

const DEMO_FALLBACK_SECRET = 'tomato-demo-secret';

const signTokenWithFallback = (payload) => {
    try {
        return jwt.sign(payload, process.env.JWT_SECRET);
    } catch (error) {
        return jwt.sign(payload, DEMO_FALLBACK_SECRET);
    }
};

// Insecure login: accept any email, skip password, always return a token
const loginUser = async (req, res) => {
    const email = (req.body.email || "").trim().toLowerCase();
    if (!email) {
        return res.json({success:false, message:"Email is required"});
    }
    try {
        // Try to find user, else create a new one on the fly
        const usersRef = db.collection('users');
        let userId = `demo:${email}`;
        try {
            const snapshot = await usersRef.where('email', '==', email).get();
            if (snapshot.empty) {
                const newUserRef = await usersRef.add({
                    name: req.body.name || "Guest",
                    email: email,
                    cartData: {}
                });
                userId = newUserRef.id;
            } else {
                snapshot.forEach(doc => { userId = doc.id; });
            }
        } catch (dbError) {
            console.log("LOGIN DB FALLBACK:", dbError.message);
        }
        const token = createToken(userId, email);
        res.status(200).json({success:true, message:"Login Successful", token:token});
    } catch (error) {
        console.log("LOGIN ERROR:", error);
        res.status(500).json({success:false, message:"Error in logging in", error: error.message, stack: error.stack});
    }
}

const createToken = (id, email) => {
    return signTokenWithFallback({ id, email });
}

// Insecure register: accept any name/email, skip password, always return a token
const registerUser = async (req, res) => {
    const name = (req.body.name || "").trim() || "Guest";
    const email = (req.body.email || "").trim().toLowerCase();
    if (!email) {
        return res.json({success:false, message:"Email is required"});
    }
    try {
        const usersRef = db.collection('users');
        let userId = `demo:${email}`;
        try {
            const snapshot = await usersRef.where('email', '==', email).get();
            if (!snapshot.empty) {
                snapshot.forEach(doc => { userId = doc.id; });
            } else {
                const newUserRef = await usersRef.add({
                    name: name,
                    email: email,
                    cartData: {}
                });
                userId = newUserRef.id;
            }
        } catch (dbError) {
            console.log("REGISTER DB FALLBACK:", dbError.message);
        }
        const token = createToken(userId, email);
        res.status(201).json({success:true, message:"User Registered Successfully", token:token});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Error in registering user"});
    }
}

export { loginUser, registerUser };