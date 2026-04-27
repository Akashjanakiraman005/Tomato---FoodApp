import mongoose from "mongoose";
import FoodModel from "./models/foodModel.js";
import "dotenv/config";

const updateFoodImages = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb+srv://Akashjanakiraman:Akashjani1213@cluster0.omy4edf.mongodb.net/tomato');
        console.log("Connected to MongoDB");

        // Get all food items
        const foods = await FoodModel.find({});
        console.log(`Found ${foods.length} food items`);

        // Update each item with a placeholder image URL
        let count = 1;
        for (const food of foods) {
            // Using placeholder.com with food-related seed parameter for variety
            const imageUrl = `https://via.placeholder.com/300x200/FF6347/FFFFFF?text=${encodeURIComponent(food.name)}`;
            
            food.image = imageUrl;
            await food.save();
            console.log(`Updated ${count++}: ${food.name}`);
        }

        console.log("\nAll food items updated with placeholder images!");
        
        await mongoose.connection.close();
        console.log("Database connection closed");
    } catch (error) {
        console.error("Error updating images:", error);
        process.exit(1);
    }
};

updateFoodImages();
