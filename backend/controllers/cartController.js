import { connectFirebase } from "../firebase.js";
const { db } = connectFirebase();

const isDemoUser = (userId) => typeof userId === "string" && userId.startsWith("demo:");

const ensureUserDoc = async (userId) => {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    await userRef.set({
      name: "Guest",
      email: isDemoUser(userId) ? userId.replace("demo:", "") : "guest@example.com",
      cartData: {}
    }, { merge: true });
    const createdDoc = await userRef.get();
    return { userRef, userDoc: createdDoc };
  }
  return { userRef, userDoc };
};

// Add item to cart (Firestore)
const addToCart = async (req, res) => {
  try {
    const { userRef, userDoc } = await ensureUserDoc(req.userId);
    const userData = userDoc.data();
    const cartData = userData.cartData || {};
    const itemId = req.body.itemId;
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    await userRef.update({ cartData });
    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.log("addToCart error:", error.message);
    res.json({ success: false, message: "Failed to add item to cart", error: error.message });
  }
};

// Remove item from cart (Firestore)
const removeFromCart = async (req, res) => {
  try {
    const { userRef, userDoc } = await ensureUserDoc(req.userId);
    const userData = userDoc.data();
    const cartData = userData.cartData || {};
    const itemId = req.body.itemId;
    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) delete cartData[itemId];
    }
    await userRef.update({ cartData });
    res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.log("removeFromCart error:", error.message);
    res.json({ success: false, message: "Failed to remove item from cart", error: error.message });
  }
};

// Get cart items for a user (Firestore)
const getCart = async (req, res) => {
  try {
    const { userDoc } = await ensureUserDoc(req.userId);
    const userData = userDoc.data();
    res.json({ success: true, cartData: userData.cartData || {} });
  } catch (error) {
    console.log("getCart error:", error.message);
    res.json({ success: false, message: "Failed to fetch cart", error: error.message });
  }
};

export { addToCart, removeFromCart, getCart };