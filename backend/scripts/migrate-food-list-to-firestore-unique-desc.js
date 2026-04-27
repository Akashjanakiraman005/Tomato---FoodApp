// migrate-food-list-to-firestore-unique-desc.js
// Usage: node migrate-food-list-to-firestore-unique-desc.js
// This script uploads all food items from assets.js to Firestore with unique descriptions.

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);
const serviceAccount = require('../Serviceaccountkey.json.json');

// 1. Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

// 2. Food list with unique descriptions
const food_list = [
  { _id: "1", name: "Greek salad", image: "food_1.png", price: 12, description: "A classic Greek salad with fresh veggies and feta cheese.", category: "Salad" },
  { _id: "2", name: "Veg salad", image: "food_2.png", price: 18, description: "A healthy mix of seasonal vegetables and herbs.", category: "Salad" },
  { _id: "3", name: "Clover Salad", image: "food_3.png", price: 16, description: "Crisp greens tossed with a tangy clover dressing.", category: "Salad" },
  { _id: "4", name: "Chicken Salad", image: "food_4.png", price: 24, description: "Grilled chicken breast on a bed of fresh salad.", category: "Salad" },
  { _id: "5", name: "Lasagna Rolls", image: "food_5.png", price: 14, description: "Cheesy lasagna rolled with rich tomato sauce.", category: "Rolls" },
  { _id: "6", name: "Peri Peri Rolls", image: "food_6.png", price: 12, description: "Spicy peri peri rolls with a zesty kick.", category: "Rolls" },
  { _id: "7", name: "Chicken Rolls", image: "food_7.png", price: 20, description: "Juicy chicken wrapped in a soft roll.", category: "Rolls" },
  { _id: "8", name: "Veg Rolls", image: "food_8.png", price: 15, description: "Vegetable rolls with a crunchy filling.", category: "Rolls" },
  { _id: "9", name: "Ripple Ice Cream", image: "food_9.png", price: 14, description: "Creamy ice cream with a ripple of chocolate.", category: "Deserts" },
  { _id: "10", name: "Fruit Ice Cream", image: "food_10.png", price: 22, description: "Ice cream loaded with real fruit pieces.", category: "Deserts" },
  { _id: "11", name: "Jar Ice Cream", image: "food_11.png", price: 10, description: "Delicious ice cream served in a jar.", category: "Deserts" },
  { _id: "12", name: "Vanilla Ice Cream", image: "food_12.png", price: 12, description: "Classic vanilla ice cream, smooth and rich.", category: "Deserts" },
  { _id: "13", name: "Chicken Sandwich", image: "food_13.png", price: 12, description: "Grilled chicken sandwich with fresh lettuce.", category: "Sandwich" },
  { _id: "14", name: "Vegan Sandwich", image: "food_14.png", price: 18, description: "A hearty vegan sandwich with plant-based fillings.", category: "Sandwich" },
  { _id: "15", name: "Grilled Sandwich", image: "food_15.png", price: 16, description: "Toasted sandwich with melted cheese and veggies.", category: "Sandwich" },
  { _id: "16", name: "Bread Sandwich", image: "food_16.png", price: 24, description: "Simple bread sandwich with a tasty spread.", category: "Sandwich" },
  { _id: "17", name: "Cup Cake", image: "food_17.png", price: 14, description: "Moist cupcake topped with creamy frosting.", category: "Cake" },
  { _id: "18", name: "Vegan Cake", image: "food_18.png", price: 12, description: "Delicious vegan cake with no dairy or eggs.", category: "Cake" },
  { _id: "19", name: "Butterscotch Cake", image: "food_19.png", price: 20, description: "Rich butterscotch cake with caramel drizzle.", category: "Cake" },
  { _id: "20", name: "Sliced Cake", image: "food_20.png", price: 15, description: "Soft cake slices perfect for sharing.", category: "Cake" },
  { _id: "21", name: "Garlic Mushroom ", image: "food_21.png", price: 14, description: "Sautéed mushrooms with garlic and herbs.", category: "Pure Veg" },
  { _id: "22", name: "Fried Cauliflower", image: "food_22.png", price: 22, description: "Crispy fried cauliflower bites.", category: "Pure Veg" },
  { _id: "23", name: "Mix Veg Pulao", image: "food_23.png", price: 10, description: "Aromatic rice pulao with mixed vegetables.", category: "Pure Veg" },
  { _id: "24", name: "Rice Zucchini", image: "food_24.png", price: 12, description: "Steamed rice with sautéed zucchini.", category: "Pure Veg" },
  { _id: "25", name: "Cheese Pasta", image: "food_25.png", price: 12, description: "Creamy cheese pasta with herbs.", category: "Pasta" },
  { _id: "26", name: "Tomato Pasta", image: "food_26.png", price: 18, description: "Pasta tossed in a tangy tomato sauce.", category: "Pasta" },
  { _id: "27", name: "Creamy Pasta", image: "food_27.png", price: 16, description: "Rich and creamy pasta with parmesan.", category: "Pasta" },
  { _id: "28", name: "Chicken Pasta", image: "food_28.png", price: 24, description: "Pasta with grilled chicken and veggies.", category: "Pasta" },
  { _id: "29", name: "Buttter Noodles", image: "food_29.png", price: 14, description: "Noodles tossed in butter and spices.", category: "Noodles" },
  { _id: "30", name: "Veg Noodles", image: "food_30.png", price: 12, description: "Stir-fried noodles with fresh vegetables.", category: "Noodles" },
  { _id: "31", name: "Somen Noodles", image: "food_31.png", price: 20, description: "Japanese somen noodles in a light broth.", category: "Noodles" },
  { _id: "32", name: "Cooked Noodles", image: "food_32.png", price: 15, description: "Perfectly cooked noodles with sauce.", category: "Noodles" }
];

// 3. Upload each food item to Firestore
async function migrate() {
  const batch = db.batch();
  const foodsRef = db.collection('foods');
  for (const food of food_list) {
    // Use a placeholder image URL for now
    const imageUrl = `http://localhost:4000/images/${food.image}`;
    const docRef = foodsRef.doc();
    batch.set(docRef, {
      name: food.name,
      price: food.price,
      description: food.description,
      category: food.category,
      image: imageUrl,
    });
  }
  await batch.commit();
  console.log('Migration complete with unique descriptions!');
}

migrate().catch(console.error);
