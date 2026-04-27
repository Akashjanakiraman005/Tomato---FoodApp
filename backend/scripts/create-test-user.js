// Script to create a test user in Firestore for cart functionality
import { connectFirebase } from '../firebase.js';

const { db } = connectFirebase();

const userId = process.argv[2] || 'testuser'; // Pass userId as argument or use 'testuser'

async function createTestUser() {
  try {
    await db.collection('users').doc(userId).set({
      cartData: {},
      email: 'testuser@example.com',
      name: 'Test User',
      createdAt: new Date()
    });
    console.log(`Test user '${userId}' created successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
