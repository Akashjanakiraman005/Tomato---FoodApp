import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOOJ9mUbak2NCpDDpYmhMO1-rb31ick4g",
  authDomain: "tomato-8c432.firebaseapp.com",
  projectId: "tomato-8c432",
  storageBucket: "tomato-8c432.firebasestorage.app",
  messagingSenderId: "1036389392478",
  appId: "1:1036389392478:web:9f4dc36f15d0cbf5d114cf",
  measurementId: "G-QPQZCR0VRF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
