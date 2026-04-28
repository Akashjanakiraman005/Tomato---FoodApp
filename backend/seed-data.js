import mongoose from "mongoose";
import FoodModel from "./models/foodModel.js";
import "dotenv/config";

const seedFoodData = async () => {
    try {
        // Connect to MongoDB - using the same connection as server
        await mongoose.connect('mongodb+srv://Akashjanakiraman:Akashjani1213@cluster0.omy4edf.mongodb.net/tomato');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Clear existing food items
        await FoodModel.deleteMany({});
        console.log("Cleared existing food data");

        // Sample food data
        const foodItems = [
            // Salad category
            {
                name: "Greek Salad",
                description: "Fresh vegetables with feta cheese, olives, and olive oil dressing",
                price: 250,
                image: "food_1.png",
                category: "Salad"
            },
            {
                name: "Caesar Salad",
                description: "Crisp romaine lettuce with parmesan cheese and creamy Caesar dressing",
                price: 280,
                image: "food_2.png",
                category: "Salad"
            },
            {
                name: "Garden Salad",
                description: "Mixed greens with seasonal vegetables and light vinaigrette",
                price: 220,
                image: "food_3.png",
                category: "Salad"
            },
            {
                name: "Spinach Salad",
                description: "Fresh spinach with mushrooms, bacon, and warm bacon dressing",
                price: 270,
                image: "food_4.png",
                category: "Salad"
            },

            // Rolls category
            {
                name: "Chicken Roll",
                description: "Tender chicken rolled in soft flour tortilla with fresh vegetables",
                price: 180,
                image: "food_5.png",
                category: "Rolls"
            },
            {
                name: "Paneer Roll",
                description: "Cottage cheese with herbs and spices in a crispy roll",
                price: 160,
                image: "food_6.png",
                category: "Rolls"
            },
            {
                name: "Veggie Roll",
                description: "Mixed vegetables with hummus in a whole wheat wrap",
                price: 150,
                image: "food_7.png",
                category: "Rolls"
            },
            {
                name: "Spring Roll",
                description: "Crispy fried roll filled with vegetables and served with sweet sauce",
                price: 140,
                image: "food_8.png",
                category: "Rolls"
            },

            // Desserts category
            {
                name: "Chocolate Cake",
                description: "Rich and moist chocolate cake with chocolate frosting",
                price: 350,
                image: "food_9.png",
                category: "Desserts"
            },
            {
                name: "Brownie",
                description: "Fudgy chocolate brownie served warm with a scoop of ice cream",
                price: 200,
                image: "food_10.png",
                category: "Desserts"
            },
            {
                name: "Ice Cream",
                description: "Creamy vanilla, chocolate, or strawberry ice cream",
                price: 120,
                image: "food_11.png",
                category: "Desserts"
            },
            {
                name: "Cheesecake",
                description: "Smooth and creamy cheesecake with fruit topping",
                price: 320,
                image: "food_12.png",
                category: "Desserts"
            },

            // Sandwich category
            {
                name: "Club Sandwich",
                description: "Three layers of bread with chicken, bacon, and fresh vegetables",
                price: 240,
                image: "food_13.png",
                category: "Sandwich"
            },
            {
                name: "Veggie Sandwich",
                description: "Fresh vegetables and hummus on whole wheat bread",
                price: 180,
                image: "food_14.png",
                category: "Sandwich"
            },
            {
                name: "Chicken Sandwich",
                description: "Grilled chicken breast with lettuce, tomato, and mayo",
                price: 200,
                image: "food_15.png",
                category: "Sandwich"
            },
            {
                name: "Paneer Sandwich",
                description: "Marinated paneer with onions and capsicum",
                price: 190,
                image: "food_16.png",
                category: "Sandwich"
            },

            // Cake category
            {
                name: "Vanilla Cake",
                description: "Classic vanilla cake with buttercream frosting",
                price: 300,
                image: "food_17.png",
                category: "Cake"
            },
            {
                name: "Black Forest Cake",
                description: "Chocolate cake with cherry filling and whipped cream",
                price: 380,
                image: "food_18.png",
                category: "Cake"
            },
            {
                name: "Red Velvet Cake",
                description: "Elegant red velvet cake with cream cheese frosting",
                price: 340,
                image: "food_19.png",
                category: "Cake"
            },
            {
                name: "Carrot Cake",
                description: "Moist carrot cake with cream cheese frosting and walnuts",
                price: 310,
                image: "food_20.png",
                category: "Cake"
            },

            // Pure Veg category
            {
                name: "Dal Makhani",
                description: "Creamy lentils with butter, tomato, and aromatic spices",
                price: 280,
                image: "food_21.png",
                category: "Pure Veg"
            },
            {
                name: "Paneer Butter Masala",
                description: "Cottage cheese in a smooth tomato and cream curry",
                price: 320,
                image: "food_22.png",
                category: "Pure Veg"
            },
            {
                name: "Mixed Vegetable Curry",
                description: "Assorted vegetables in a savory Indian spice blend",
                price: 250,
                image: "food_23.png",
                category: "Pure Veg"
            },
            {
                name: "Aloo Gobi",
                description: "Potatoes and cauliflower with turmeric and cumin",
                price: 200,
                image: "food_24.png",
                category: "Pure Veg"
            },

            // Pasta category
            {
                name: "Spaghetti Carbonara",
                description: "Creamy italianpasta with bacon, parmesan, and black pepper",
                price: 320,
                image: "food_25.png",
                category: "Pasta"
            },
            {
                name: "Penne Alfredo",
                description: "Penne pasta with creamy Alfredo sauce and garlic bread",
                price: 300,
                image: "food_26.png",
                category: "Pasta"
            },
            {
                name: "Veggie Pasta",
                description: "Fresh pasta with seasonal vegetables and marinara sauce",
                price: 280,
                image: "food_27.png",
                category: "Pasta"
            },
            {
                name: "Lasagna",
                description: "Layers of pasta sheets with meat sauce and cheese",
                price: 350,
                image: "food_28.png",
                category: "Pasta"
            },

            // Noodles category
            {
                name: "Chow Mein",
                description: "Crispy fried noodles with vegetables and soy sauce",
                price: 200,
                image: "food_29.png",
                category: "Noodles"
            },
            {
                name: "Pad Thai",
                description: "Thai rice noodles with tamarind, peanuts, and lime",
                price: 240,
                image: "food_30.png",
                category: "Noodles"
            },
            {
                name: "Hakka Noodles",
                description: "Stir-fried noodles with vegetables in a tangy sauce",
                price: 220,
                image: "food_31.png",
                category: "Noodles"
            },
            {
                name: "Spicy Noodles",
                description: "Hot and spicy instant noodles with vegetables",
                price: 180,
                image: "food_32.png",
                category: "Noodles"
            }
        ];

        // Insert food items
        const result = await FoodModel.insertMany(foodItems);
        console.log(`Successfully inserted ${result.length} food items`);

        // Show summary
        console.log("\nFood Items Added by Category:");
        console.log("- Salad: 4 items");
        console.log("- Rolls: 4 items");
        console.log("- Desserts: 4 items");
        console.log("- Sandwich: 4 items");
        console.log("- Cake: 4 items");
        console.log("- Pure Veg: 4 items");
        console.log("- Pasta: 4 items");
        console.log("- Noodles: 4 items");
        console.log("\nTotal: 32 items");

        await mongoose.connection.close();
        console.log("\nDatabase connection closed");
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedFoodData();
