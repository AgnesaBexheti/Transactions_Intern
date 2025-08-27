import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Category } from './src/entities/category';
import { Expense } from './src/entities/expense';
import { User } from './src/entities/user';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Category, Expense, User],
  synchronize: true,
  logging: false,
});

export default AppDataSource;
