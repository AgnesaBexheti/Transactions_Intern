import 'reflect-metadata';
import AppDataSource from '../../ormconfig';
import { Category } from '../entities/category';

const seedDatabase = async () => {
  await AppDataSource.initialize();
  const categoryRepository = AppDataSource.getRepository(Category);

  const initialCategories = [
    { name: 'Technology' },
    { name: 'Science' },
    { name: 'Health' },
    { name: 'Sports' },
  ];

  await categoryRepository.save(initialCategories);
  console.log('Database seeded with initial categories');
  process.exit();
};

seedDatabase().catch((error) => console.error('Seeding error:', error));
