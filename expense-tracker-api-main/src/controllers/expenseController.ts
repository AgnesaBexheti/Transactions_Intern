import { Request, Response } from 'express';
import { AppDataSource } from '../../ormconfig';
import { Category } from '../entities/category';
import { Expense } from '../entities/expense';

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenseRepository = AppDataSource.getRepository(Expense);
    const expenses = await expenseRepository.find({ relations: ['category'] });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getExpense = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (isNaN(parseFloat(id))) {
    res.status(400).json({ message: 'expense id needs to be a number' });
    return;
  }
  try {
    const expenseRepository = AppDataSource.getRepository(Expense);
    const expense = await expenseRepository.findOne({
      where: { id: +id },
      relations: ['category'],
    });
    res.json(expense);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createExpense = async (req: Request, res: Response) => {
  const { title, value, categoryId } = req.body;
  try {
    const expenseRepository = AppDataSource.getRepository(Expense);
    const categoryRepository = AppDataSource.getRepository(Category);

    const category = await categoryRepository.findOneBy({ id: categoryId });
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    const expense = expenseRepository.create({ title, value, category });
    await expenseRepository.save(expense);
    res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, value, categoryId } = req.body;
  try {
    const expenseRepository = AppDataSource.getRepository(Expense);
    const categoryRepository = AppDataSource.getRepository(Category);

    const expense = await expenseRepository.findOneBy({ id: Number(id) });
    if (!expense) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    if (categoryId) {
      const category = await categoryRepository.findOneBy({ id: categoryId });
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }
      expense.category = category;
    }

    if (title) expense.title = title;
    if (value) expense.value = value;

    await expenseRepository.save(expense);
    res.json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const expenseRepository = AppDataSource.getRepository(Expense);
    const result = await expenseRepository.delete({ id: Number(id) });

    if (result.affected === 0) {
      res.status(404).json({ message: 'Expense not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
