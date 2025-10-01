// src/test/pages/TransactionForm.create.test.tsx
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// auth ON for this file
vi.mock('../../context/AuthContext.jsx', () => ({
  useAuth: () => ({ isAuthed: true }),
}));

// mock api: categories + create
vi.mock('../../lib/api.js', () => ({
  api: {
    categories: vi.fn().mockResolvedValue([
      { id: 1, name: 'Income' },
      { id: 2, name: 'Food' },
    ]),
    createExpense: vi.fn().mockResolvedValue({}),
  },
}));
import { api } from '../../lib/api.js';

// mock useNavigate so we can assert redirect to '/'
vi.mock('react-router-dom', async (orig) => {
  const mod = await orig();
  return {
    ...mod,
    useNavigate: () => vi.fn(), // we’ll spy on it below if needed
  };
});

import TransactionFormPage from '../../pages/TransactionForm/TransactionFormPage.jsx';

describe('TransactionFormPage (create)', () => {
  test('submits payload and navigates home', async () => {
    const navCalls: any[] = [];
    // capture navigate calls
    vi.doMock('react-router-dom', async (orig) => {
      const mod = await orig();
      return {
        ...mod,
        useNavigate: () => (path: any, opts?: any) => navCalls.push([path, opts]),
      };
    });

    // re-import component after doMock
    const { default: FormPage } = await import('../../pages/TransactionForm/TransactionFormPage.jsx');

    render(
      <MemoryRouter initialEntries={['/create']}>
        <Routes>
          <Route path="/create" element={<FormPage isEditing={false} />} />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/title/i), 'Lunch');
    await userEvent.type(screen.getByLabelText(/amount/i), '12.5');
    await userEvent.selectOptions(screen.getByLabelText(/category/i), '2');
    await userEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(api.createExpense).toHaveBeenCalledWith({
      title: 'Lunch',
      value: 12.5,
      categoryId: 2,
    });

    // navigated to home
    expect(navCalls[0][0]).toBe('/');
  });
});
