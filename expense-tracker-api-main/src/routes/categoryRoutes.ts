import { Router } from 'express';
import { getCategories } from '../controllers/categoryController';

const router = Router();

// Define the route to get categories
router.get('/categories', getCategories);

export default router;
