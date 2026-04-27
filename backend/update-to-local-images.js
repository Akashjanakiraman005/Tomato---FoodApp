import mongoose from "mongoose";
import FoodModel from "./models/foodModel.js";
import "dotenv/config";

const updateToLocalImages = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb+srv://Akashjanakiraman:Akashjani1213@cluster0.omy4edf.mongodb.net/tomato');
        console.log("Connected to MongoDB");

        // Food items mapping to match assets
        const foodMapping = [
            { name: "Greek Salad", image: "food_1.png", category: "Salad" },
            { name: "Caesar Salad", image: "food_2.png", category: "Salad" },
            { name: "Garden Salad", image: "food_3.png", category: "Salad" },
            { name: "Spinach Salad", image: "food_4.png", category: "Salad" },
            
            { name: "Chicken Roll", image: "food_5.png", category: "Rolls" },
            { name: "Paneer Roll", image: "food_6.png", category: "Rolls" },
            { name: "Veggie Roll", image: "food_7.png", category: "Rolls" },
            { name: "Spring Roll", image: "food_8.png", category: "Rolls" },
            
            { name: "Chocolate Cake", image: "food_9.png", category: "Desserts" },
            { name: "Brownie", image: "food_10.png", category: "Desserts" },
            { name: "Ice Cream", image: "food_11.png", category: "Desserts" },
            { name: "Cheesecake", image: "food_12.png", category: "Desserts" },
            
            { name: "Club Sandwich", image: "food_13.png", category: "Sandwich" },
            { name: "Veggie Sandwich", image: "food_14.png", category: "Sandwich" },
            { name: "Chicken Sandwich", image: "food_15.png", category: "Sandwich" },
            { name: "Paneer Sandwich", image: "food_16.png", category: "Sandwich" },
            
            { name: "Vanilla Cake", image: "food_17.png", category: "Cake" },
            { name: "Black Forest Cake", image: "food_18.png", category: "Cake" },
            { name: "Red Velvet Cake", image: "food_19.png", category: "Cake" },
            { name: "Carrot Cake", image: "food_20.png", category: "Cake" },
            
            { name: "Dal Makhani", image: "food_21.png", category: "Pure Veg" },
            { name: "Paneer Butter Masala", image: "food_22.png", category: "Pure Veg" },
            { name: "Mixed Vegetable Curry", image: "food_23.png", category: "Pure Veg" },
            { name: "Aloo Gobi", image: "food_24.png", category: "Pure Veg" },
            
            { name: "Spaghetti Carbonara", image: "food_25.png", category: "Pasta" },
            { name: "Penne Alfredo", image: "food_26.png", category: "Pasta" },
            { name: "Veggie Pasta", image: "food_27.png", category: "Pasta" },
            { name: "Lasagna", image: "food_28.png", category: "Pasta" },
            
            { name: "Chow Mein", image: "food_29.png", category: "Noodles" },
            { name: "Pad Thai", image: "food_30.png", category: "Noodles" },
            { name: "Hakka Noodles", image: "food_31.png", category: "Noodles" },
            { name: "Spicy Noodles", image: "food_32.png", category: "Noodles" }
        ];

        // Get all food items
        const foods = await FoodModel.find({});
        console.log(`Found ${foods.length} food items\n`);

        // Update each item
        let count = 0;
        for (let i = 0; i < foods.length && i < foodMapping.length; i++) {
            const food = foods[i];
            const mapping = foodMapping[i];
            
            food.image = mapping.image;
            await food.save();
            count++;
            console.log(`${count}. ${food.name} -> ${mapping.image}`);
        }

        console.log(`\n✅ Updated ${count} food items with local asset images!`);
        
        await mongoose.connection.close();
        console.log("Database connection closed");
    } catch (error) {
        console.error("Error updating images:", error);
        process.exit(1);
    }
};

updateToLocalImages();
