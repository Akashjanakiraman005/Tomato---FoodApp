import { connectFirebase } from "../firebase.js";

const { db, bucket } = connectFirebase();
const foodCollection = db.collection("foods");

// Add food item to Firestore and upload image to Firebase Storage
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }
        // Upload image directly from memory buffer to Firebase Storage
        const destination = `foods/${Date.now()}-${req.file.originalname}`;
        const file = bucket.file(destination);
        
        await file.save(req.file.buffer, {
            metadata: {
                contentType: req.file.mimetype,
            },
        });
        await file.makePublic();
        const imageUrl = file.publicUrl();

        const foodData = {
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price),
            category: req.body.category,
            image: imageUrl
        };
        const docRef = await foodCollection.add(foodData);
        res.status(201).json({ message: "Food item added successfully", id: docRef.id, food: foodData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to add food item", error: error.message });
    }
};

const fallbackFoodList = [
    ...[...Array(32)].map((_, i) => ({
        _id: (i + 1).toString(),
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

// List all food items from Firestore
const listFood = async (req, res) => {
    try {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Firestore timeout")), 50)
        );
        const snapshot = await Promise.race([foodCollection.get(), timeoutPromise]);
        
        const foods = snapshot.docs.map(doc => ({ _id: doc.id, id: doc.id, ...doc.data() }));
        if (foods.length === 0) {
            console.log("Database is empty. Using fallback food list.");
            return res.status(200).json({ success: true, data: fallbackFoodList, isFallback: true });
        }
        res.status(200).json({ success: true, data: foods });
    } catch (error) {
        console.log("Firestore quota exceeded, failed, or timed out. Using fallback food list.");
        res.status(200).json({ success: true, data: fallbackFoodList, isFallback: true });
    }
};

// Remove food item from Firestore
const removeFood = async (req, res) => {
    try {
        const foodId = req.body.id;
        const foodDoc = await foodCollection.doc(foodId).get();
        if (!foodDoc.exists) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }
        await foodCollection.doc(foodId).delete();
        res.status(200).json({ success: true, message: "Food item removed successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to remove food item" });
    }
};

export { addFood, listFood, removeFood };