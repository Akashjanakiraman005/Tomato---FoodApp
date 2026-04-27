import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { connectFirebase } from "./firebase.js";

dotenv.config();

const seedTestUser = async () => {
  try {
    const { db } = connectFirebase();
    console.log("Firebase connected");

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', 'akashjani5611@gmail.com').get();

    if (!snapshot.empty) {
      console.log("User already exists, updating password...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Akashjani@1213", salt);
      
      let docId;
      snapshot.forEach(doc => { docId = doc.id; });
      
      await usersRef.doc(docId).update({
          password: hashedPassword
      });
      console.log("Password updated successfully");
    } else {
      console.log("Creating new test user...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Akashjani@1213", salt);

      await usersRef.add({
        name: "Akash Jani",
        email: "akashjani5611@gmail.com",
        password: hashedPassword,
        cartData: {}
      });

      console.log("Test user created successfully");
    }

    console.log(
      "Now you can login with: akashjani5611@gmail.com / Akashjani@1213"
    );
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedTestUser();
