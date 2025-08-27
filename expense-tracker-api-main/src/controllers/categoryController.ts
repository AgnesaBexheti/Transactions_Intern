import { Request, Response } from 'express';
import { Category } from '../entities/category';
import AppDataSource from '../../ormconfig';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categoryRepository = AppDataSource.getRepository(Category);
    const categories = await categoryRepository.find();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
