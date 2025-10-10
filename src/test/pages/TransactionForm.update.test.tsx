// src/test/pages/TransactionForm.update.test.tsx
import { describe, test, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// auth ON (simple one-liner)
vi.mock('../../context/AuthContext.jsx', () => ({
  useAuth: () => ({ isAuthed: true }),
}));

// HOISTED navigate spy (so it's defined before the mock factory runs)
const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }));

// mock react-router-dom: just replace useNavigate with our spy
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return { ...actual, useNavigate: () => navigateMock };
});

// mock API used by the page
vi.mock('../../lib/api.js', () => ({
  api: {
    categories: vi.fn().mockResolvedValue([
      { id: 1, name: 'Income' },
      { id: 2, name: 'Food' },
    ]),
    updateExpense: vi.fn().mockResolvedValue({}),
  },
}));
import { api } from '../../lib/api.js';

import { MemoryRouter, Routes, Route } from 'react-router-dom';
import TransactionFormPage from '../../pages/TransactionForm/TransactionFormPage.jsx';

describe('TransactionFormPage (update)', () => {
  test('prefills from route state and submits PUT', async () => {
    const stateItem = {
      id: '123',
      title: 'Old Title',
      value: 10,
      category: { id: 2, name: 'Food' },
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: '/edit/123', state: { item: stateItem } }]}>
        <Routes>
          <Route path="/edit/:id" element={<TransactionFormPage isEditing={true} />} />
        </Routes>
      </MemoryRouter>
    );

    // wait for categories/options before asserting select value
    expect(await screen.findByLabelText(/title/i)).toHaveValue('Old Title');
    expect(screen.getByLabelText(/amount/i)).toHaveValue(10);

    const categorySelect = await screen.findByLabelText(/category/i);
    expect(within(categorySelect).getAllByRole('option').length).toBeGreaterThan(0);
    expect(categorySelect).toHaveValue('2');

    // change title and submit
    await userEvent.clear(screen.getByLabelText(/title/i));
    await userEvent.type(screen.getByLabelText(/title/i), 'New Title');
    await userEvent.click(screen.getByRole('button', { name: /update/i }));

    // PUT payload is correct
    expect(api.updateExpense).toHaveBeenCalledWith('123', {
      title: 'New Title',
      value: 10,
      categoryId: 2,
    });

    // navigated home
    expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
  });
});
