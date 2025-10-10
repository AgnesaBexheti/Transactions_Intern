import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// This file forces "not authenticated"
vi.mock('../../context/AuthContext.jsx', () => ({
  useAuth: () => ({ isAuthed: false }),
}));

import TransactionCard from '../../components/TransactionCard/TransactionCard.js';

const SAMPLE = {
  id: 't1',
  title: 'Groceries',
  category: 'Food',
  amount: -23.5,
  date: '2025-01-15',
};

describe('TransactionCard (logged out)', () => {
  test('renders details and hides Edit/Delete', () => {
    render(
      <TransactionCard
        {...SAMPLE}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );

    // basic fields
    expect(screen.getByText(/groceries/i)).toBeInTheDocument();
    expect(screen.getByText(/food/i)).toBeInTheDocument();

    // amount string includes "-" and "€"
    expect(screen.getByText(/-23\.50€/)).toBeInTheDocument();

    // date is rendered (locale dependent; just assert year shows)
    expect(screen.getByText(/2025/)).toBeInTheDocument();

    // actions hidden
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });
});
