import 'reflect-metadata';
import 'dotenv/config';
import AppDataSource from '../ormconfig';
import app from './app';

const PORT = process.env.PORT || 8080;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((error) => console.log('Database connection error:', error));
