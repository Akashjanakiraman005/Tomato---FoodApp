import { connectFirebase } from './firebase.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const testLogin = async () => {
    try {
        const { db } = connectFirebase();
        console.log("Firebase connected");
        const email = "akashjani5611@gmail.com";
        const password = "Akashjani@1213";
        
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();
        if(snapshot.empty){
            console.log("User not found");
            return;
        }
        
        let userDoc;
        snapshot.forEach(doc => { userDoc = { id: doc.id, ...doc.data() } });
        console.log("User doc:", userDoc);

        const isMatch = await bcrypt.compare(password, userDoc.password);
        console.log("Is Match?", isMatch);
    } catch(err) {
        console.error("Caught error:", err);
    }
}
testLogin();
