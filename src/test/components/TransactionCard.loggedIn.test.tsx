import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// This file forces "authenticated"
vi.mock('../../context/AuthContext.jsx', () => ({
  useAuth: () => ({ isAuthed: true }),
}));

import TransactionCard from '../../components/TransactionCard/TransactionCard.js';

const SAMPLE = {
  id: 't2',
  title: 'Salary',
  category: 'Income',
  amount: 1200,
  date: '2025-02-01',
};

describe('TransactionCard (logged in)', () => {
  test('shows Edit/Delete', () => {
    render(<TransactionCard {...SAMPLE} />);
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  test('clicking Edit/Delete triggers callbacks with id', async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(<TransactionCard {...SAMPLE} onEdit={onEdit} onDelete={onDelete} />);

    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    await userEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(onEdit).toHaveBeenCalledWith('t2');
    expect(onDelete).toHaveBeenCalledWith('t2');
  });
});
