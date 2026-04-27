import express from 'express';
import cors from 'cors';
import foodRouter from './routes/foodRouter.js';
import userRouter from './routes/userRouter.js';
import cartRouter from './routes/cartRouter.js';
import orderRouter from './routes/orderRoute.js';
import tableRouter from './routes/tableRoute.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/food', foodRouter);
app.use('/images', express.static('uploads'));
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/table', tableRouter);

app.get('/', (req, res) => {
  res.send('Hello from backend');
});

export default app;