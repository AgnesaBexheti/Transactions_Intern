import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Fixed mock (this file = always logged IN)
vi.mock('../../context/AuthContext.jsx', () => ({
  useAuth: () => ({ isAuthed: true, logout: () => {} }),
}));

// ⚠️ Adjust if your Sidebar path is different
// import Sidebar from '../../components/Sidebar.jsx';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';

describe('Sidebar (logged in)', () => {
  test('shows Create + Logout and hides Login / Signup', () => {
    render(
      <MemoryRouter>
        <Sidebar open={true} onClose={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /create new transaction/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /login \/ signup/i })).not.toBeInTheDocument();
  });

  test('clicking Logout also calls onClose()', async () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <Sidebar open={true} onClose={onClose} />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
