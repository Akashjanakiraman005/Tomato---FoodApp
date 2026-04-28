import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
// import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRouter.js';
import userRouter from './routes/userRouter.js';
import 'dotenv/config';
import cartRouter from './routes/cartRouter.js';
import orderRouter from './routes/orderRoute.js';
import tableRouter from './routes/tableRoute.js';

//app config
const app = express();

//middlewares
app.use(express.json());
app.use(cors());

//api endpoints
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/table", tableRouter);

app.get("/", (req, res) => {
    res.send("Hello from backend");
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Export the Express API for Vercel serverless functions
export default app;

if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });
}

//mongodb+srv://Akashjanakiraman:Akashjani1213@cluster0.omy4edf.mongodb.net/?
