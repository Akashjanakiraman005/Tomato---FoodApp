import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, removeOrder, generateBill } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", authMiddleware, verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list",  listOrders);
orderRouter.post("/updateStatus",  updateStatus);
orderRouter.post("/remove", removeOrder);

// PDF bill generation endpoint (protected)
orderRouter.post("/generate-bill", authMiddleware, generateBill);

export default orderRouter;