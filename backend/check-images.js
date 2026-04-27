import { connectDB } from './config/db.js';
import FoodModel from './models/foodModel.js';

const checkImages = async () => {
    try {
        await connectDB();
        const foods = await FoodModel.find({}).limit(5);
        console.log('\n=== Sample Food Items ===');
        foods.forEach(food => {
            console.log(`Name: ${food.name}`);
            console.log(`Image: ${food.image}`);
            console.log(`Full URL: http://localhost:4000/images/${food.image}`);
            console.log('---');
        });
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkImages();
