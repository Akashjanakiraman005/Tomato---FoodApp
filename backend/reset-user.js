import mongoose from "mongoose";
import userModel from "./models/userModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const resetUser = async () => {
  try {
    const configuredUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    const localUri = "mongodb://127.0.0.1:27017/tomato";
    const dbName = process.env.MONGODB_DB_NAME || "tomato";

    try {
      if (configuredUri) {
        await mongoose.connect(configuredUri, { dbName, serverSelectionTimeoutMS: 8000 });
        console.log("MongoDB connected using configured URI");
      } else {
        await mongoose.connect(localUri, { dbName, serverSelectionTimeoutMS: 8000 });
        console.log("MongoDB connected using local fallback");
      }
    } catch (err) {
      await mongoose.connect(localUri, { dbName, serverSelectionTimeoutMS: 8000 });
      console.log("Configured MongoDB failed, connected using local fallback");
    }

    // Delete existing user
    await userModel.deleteOne({ email: "akashjani5611@gmail.com" });
    console.log("Deleted existing user");

    // Create fresh user with simple password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const newUser = new userModel({
      name: "Akash Jani",
      email: "akashjani5611@gmail.com",
      password: hashedPassword,
      cartData: {}
    });

    await newUser.save();
    console.log("✓ New user created successfully");
    console.log("\nLogin Credentials:");
    console.log("Email: akashjani5611@gmail.com");
    console.log("Password: password123");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

resetUser();
