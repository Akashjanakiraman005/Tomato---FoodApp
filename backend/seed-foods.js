import { connectFirebase } from "./firebase.js";

const { db } = connectFirebase();
const foodCollection = db.collection("foods");

const fallbackFoodList = [
    ...[...Array(32)].map((_, i) => ({
        name: [
            "Greek salad", "Veg salad", "Clover Salad", "Chicken Salad", "Lasagna Rolls", "Peri Peri Rolls", "Chicken Rolls", "Veg Rolls",
            "Ripple Ice Cream", "Fruit Ice Cream", "Jar Ice Cream", "Vanilla Ice Cream", "Chicken Sandwich", "Vegan Sandwich", "Grilled Sandwich", "Bread Sandwich",
            "Cup Cake", "Vegan Cake", "Butterscotch Cake", "Sliced Cake", "Garlic Mushroom", "Fried Cauliflower", "Mix Veg Pulao", "Rice Zucchini",
            "Cheese Pasta", "Tomato Pasta", "Creamy Pasta", "Chicken Pasta", "Buttter Noodles", "Veg Noodles", "Somen Noodles", "Cooked Noodles"
        ][i],
        image: `food_${i + 1}.png`,
        price: [12, 18, 16, 24, 14, 12, 20, 15, 14, 22, 10, 12, 12, 18, 16, 24, 14, 12, 20, 15, 14, 22, 10, 12, 12, 18, 16, 24, 14, 12, 20, 15][i],
        description: "Food provides essential nutrients for overall health and well-being",
        category: [
            "Salad", "Salad", "Salad", "Salad", "Rolls", "Rolls", "Rolls", "Rolls",
            "Deserts", "Deserts", "Deserts", "Deserts", "Sandwich", "Sandwich", "Sandwich", "Sandwich",
            "Cake", "Cake", "Cake", "Cake", "Pure Veg", "Pure Veg", "Pure Veg", "Pure Veg",
            "Pasta", "Pasta", "Pasta", "Pasta", "Noodles", "Noodles", "Noodles", "Noodles"
        ][i]
    }))
];

async function seedFoods() {
    try {
        console.log("Checking for existing foods...");
        const snapshot = await foodCollection.limit(1).get();
        if (!snapshot.empty) {
            console.log("Database already contains foods. Skipping seed.");
            process.exit(0);
        }

        console.log("Seeding 32 foods into Firestore...");
        for (const food of fallbackFoodList) {
            await foodCollection.add(food);
            console.log(`Added: ${food.name}`);
        }
        console.log("Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding foods:", error);
        process.exit(1);
    }
}

seedFoods();
