// Script to migrate food_list from frontend assets and images to Firestore and Firebase Storage

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectFirebase } from '../firebase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copy-paste the food_list array here from assets.js
const food_list = [
  { _id: "1", name: "Greek salad", image: "food_1.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Salad" },
  { _id: "2", name: "Veg salad", image: "food_2.png", price: 18, description: "Food provides essential nutrients for overall health and well-being", category: "Salad" },
  { _id: "3", name: "Clover Salad", image: "food_3.png", price: 16, description: "Food provides essential nutrients for overall health and well-being", category: "Salad" },
  { _id: "4", name: "Chicken Salad", image: "food_4.png", price: 24, description: "Food provides essential nutrients for overall health and well-being", category: "Salad" },
  { _id: "5", name: "Lasagna Rolls", image: "food_5.png", price: 14, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls" },
  { _id: "6", name: "Peri Peri Rolls", image: "food_6.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls" },
  { _id: "7", name: "Chicken Rolls", image: "food_7.png", price: 20, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls" },
  { _id: "8", name: "Veg Rolls", image: "food_8.png", price: 15, description: "Food provides essential nutrients for overall health and well-being", category: "Rolls" },
  { _id: "9", name: "Ripple Ice Cream", image: "food_9.png", price: 14, description: "Food provides essential nutrients for overall health and well-being", category: "Deserts" },
  { _id: "10", name: "Fruit Ice Cream", image: "food_10.png", price: 22, description: "Food provides essential nutrients for overall health and well-being", category: "Deserts" },
  { _id: "11", name: "Jar Ice Cream", image: "food_11.png", price: 10, description: "Food provides essential nutrients for overall health and well-being", category: "Deserts" },
  { _id: "12", name: "Vanilla Ice Cream", image: "food_12.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Deserts" },
  { _id: "13", name: "Chicken Sandwich", image: "food_13.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich" },
  { _id: "14", name: "Vegan Sandwich", image: "food_14.png", price: 18, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich" },
  { _id: "15", name: "Grilled Sandwich", image: "food_15.png", price: 16, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich" },
  { _id: "16", name: "Bread Sandwich", image: "food_16.png", price: 24, description: "Food provides essential nutrients for overall health and well-being", category: "Sandwich" },
  { _id: "17", name: "Cup Cake", image: "food_17.png", price: 14, description: "Food provides essential nutrients for overall health and well-being", category: "Cake" },
  { _id: "18", name: "Vegan Cake", image: "food_18.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Cake" },
  { _id: "19", name: "Butterscotch Cake", image: "food_19.png", price: 20, description: "Food provides essential nutrients for overall health and well-being", category: "Cake" },
  { _id: "20", name: "Sliced Cake", image: "food_20.png", price: 15, description: "Food provides essential nutrients for overall health and well-being", category: "Cake" },
  { _id: "21", name: "Garlic Mushroom ", image: "food_21.png", price: 14, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg" },
  { _id: "22", name: "Fried Cauliflower", image: "food_22.png", price: 22, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg" },
  { _id: "23", name: "Mix Veg Pulao", image: "food_23.png", price: 10, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg" },
  { _id: "24", name: "Rice Zucchini", image: "food_24.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Pure Veg" },
  { _id: "25", name: "Cheese Pasta", image: "food_25.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta" },
  { _id: "26", name: "Tomato Pasta", image: "food_26.png", price: 18, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta" },
  { _id: "27", name: "Creamy Pasta", image: "food_27.png", price: 16, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta" },
  { _id: "28", name: "Chicken Pasta", image: "food_28.png", price: 24, description: "Food provides essential nutrients for overall health and well-being", category: "Pasta" },
  { _id: "29", name: "Buttter Noodles", image: "food_29.png", price: 14, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles" },
  { _id: "30", name: "Veg Noodles", image: "food_30.png", price: 12, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles" },
  { _id: "31", name: "Somen Noodles", image: "food_31.png", price: 20, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles" },
  { _id: "32", name: "Cooked Noodles", image: "food_32.png", price: 15, description: "Food provides essential nutrients for overall health and well-being", category: "Noodles" }
];

const { db, bucket } = connectFirebase();
const foodCollection = db.collection('foods');

async function uploadImageAndGetUrl(localImagePath, destFileName) {
  await bucket.upload(localImagePath, {
    destination: `foods/${destFileName}`,
    metadata: {
      contentType: 'image/png',
    },
  });
  const file = bucket.file(`foods/${destFileName}`);
  await file.makePublic();
  return file.publicUrl();
}

async function migrate() {
  for (const food of food_list) {
    const localImagePath = path.join(
      __dirname,
      '..',
      '..',
      'frondend',
      'Tomato',
      'src',
      'assets',
      food.image
    );
    let imageUrl = '';
    try {
      imageUrl = await uploadImageAndGetUrl(localImagePath, food.image);
      console.log(`Uploaded ${food.image} to Firebase Storage.`);
    } catch (err) {
      console.error(`Failed to upload ${food.image}:`, err);
      continue;
    }
    const foodData = {
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
      image: imageUrl,
    };
    await foodCollection.add(foodData);
    console.log(`Added food: ${food.name}`);
  }
  console.log('Migration complete!');
  process.exit(0);
}

migrate();
