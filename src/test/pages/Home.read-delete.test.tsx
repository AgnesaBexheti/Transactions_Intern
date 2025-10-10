// src/test/pages/Home.read-delete.test.tsx
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// auth always ON for this file (so New + Edit/Delete appear)
vi.mock('../../context/AuthContext.jsx', () => ({
  useAuth: () => ({ isAuthed: true, logout: () => {} }),
}));

// mock api: list + delete
vi.mock('../../lib/api.js', () => ({
  api: {
    getExpenses: vi.fn().mockResolvedValue([
      { id: '1', title: 'Groceries', value: -23.5, category: { id: 2, name: 'Food' }, createdAt: '2025-01-15T12:00:00Z' },
      { id: '2', title: 'Salary',    value: 1200,  category: { id: 1, name: 'Income' }, createdAt: '2025-02-01T12:00:00Z' },
    ]),
    deleteExpense: vi.fn().mockResolvedValue({}),
  },
}));
import { api } from '../../lib/api.js';

import Home from '../../pages/Home/Home.js';

describe('Home page (read + delete)', () => {
  beforeEach(() => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  test('renders list from API and shows New button when authed', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    // items appear
    expect(await screen.findByText(/groceries/i)).toBeInTheDocument();
    expect(screen.getByText(/salary/i)).toBeInTheDocument();

    // "New" button visible for authed user
    expect(screen.getByRole('link', { name: /new/i })).toBeInTheDocument();
  });

  test('clicking Delete calls api.deleteExpense and removes the item optimistically', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    );

    // wait for list
    const card = await screen.findByText(/groceries/i);
    const article = card.closest('article')!;
    const delBtn = within(article).getByRole('button', { name: /delete/i });

    await userEvent.click(delBtn);

    expect(api.deleteExpense).toHaveBeenCalledWith('1');
    // optimistic removal: the first title should disappear
    expect(screen.queryByText(/groceries/i)).not.toBeInTheDocument();
  });
});
