import mongoose from "mongoose";
import FoodModel from "./models/foodModel.js";
import "dotenv/config";

const updateFoodImagesWithBetter = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb+srv://Akashjanakiraman:Akashjani1213@cluster0.omy4edf.mongodb.net/tomato');
        console.log("Connected to MongoDB");

        // Define food images mapping with working placeholder URLs
        const imageMap = {
            "Greek Salad": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop",
            "Caesar Salad": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
            "Garden Salad": "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=300&h=200&fit=crop",
            "Spinach Salad": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
            
            "Chicken Roll": "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300&h=200&fit=crop",
            "Paneer Roll": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop",
            "Veggie Roll": "https://images.unsplash.com/photo-1623428454612-abaa0cafc218?w=300&h=200&fit=crop",
            "Spring Roll": "https://images.unsplash.com/photo-1626704117764-b0c5b7f8c89e?w=300&h=200&fit=crop",
            
            "Chocolate Cake": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop",
            "Brownie": "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=300&h=200&fit=crop",
            "Ice Cream": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop",
            "Cheesecake": "https://images.unsplash.com/photo-1533134242443-d4e1e96cf1d8?w=300&h=200&fit=crop",
            
            "Club Sandwich": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&h=200&fit=crop",
            "Veggie Sandwich": "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=300&h=200&fit=crop",
            "Chicken Sandwich": "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=300&h=200&fit=crop",
            "Paneer Sandwich": "https://images.unsplash.com/photo-1621852004158-f3bc188ace2d?w=300&h=200&fit=crop",
            
            "Vanilla Cake": "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=300&h=200&fit=crop",
            "Black Forest Cake": "https://images.unsplash.com/photo-1606890737921-4fd7c1f86228?w=300&h=200&fit=crop",
            "Red Velvet Cake": "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=300&h=200&fit=crop",
            "Carrot Cake": "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=300&h=200&fit=crop",
            
            "Dal Makhani": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop",
            "Paneer Butter Masala": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop",
            "Mixed Vegetable Curry": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop",
            "Aloo Gobi": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop",
            
            "Spaghetti Carbonara": "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&h=200&fit=crop",
            "Penne Alfredo": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=200&fit=crop",
            "Veggie Pasta": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=200&fit=crop",
            "Lasagna": "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=300&h=200&fit=crop",
            
            "Chow Mein": "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&h=200&fit=crop",
            "Pad Thai": "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=300&h=200&fit=crop",
            "Hakka Noodles": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=200&fit=crop",
            "Spicy Noodles": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop"
        };

        // Get all food items
        const foods = await FoodModel.find({});
        console.log(`Found ${foods.length} food items\n`);

        // Update each item with appropriate image
        let count = 1;
        for (const food of foods) {
            const imageUrl = imageMap[food.name] || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop`;
            
            food.image = imageUrl;
            await food.save();
            console.log(`${count++}. ${food.name} -> ${imageUrl.substring(0, 60)}...`);
        }

        console.log("\n✅ All food items updated with Unsplash images!");
        
        await mongoose.connection.close();
        console.log("Database connection closed");
    } catch (error) {
        console.error("Error updating images:", error);
        process.exit(1);
    }
};

updateFoodImagesWithBetter();
