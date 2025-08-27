import express from 'express';
import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import categoryRoutes from './routes/categoryRoutes';
import expenseRoutes from './routes/expenseRoutes';
import authRoutes from './routes/authRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
    credentials: true,
  })
);
app.use('/api', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', expenseRoutes);

export default app;
