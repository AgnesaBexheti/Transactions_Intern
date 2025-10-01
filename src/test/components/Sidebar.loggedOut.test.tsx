import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Fixed mock (this file = always logged OUT)
vi.mock('../../context/AuthContext.jsx', () => ({
  useAuth: () => ({ isAuthed: false, logout: () => {} }),
}));

import Sidebar from '../../components/Sidebar/Sidebar.jsx';

describe('Sidebar (logged out)', () => {
  test('shows Login / Signup and hides Create + Logout', () => {
    render(
      <MemoryRouter>
        <Sidebar open={true} onClose={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login \/ signup/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /create new transaction/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });
});
