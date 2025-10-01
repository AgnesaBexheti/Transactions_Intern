// src/test/components/Sidebar.test.tsx
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// fixed auth mock: not authed is fine for these two tests
vi.mock('../../context/AuthContext.jsx', () => ({
  useAuth: () => ({ isAuthed: false, logout: () => {} }),
}));

import Sidebar from '../../components/Sidebar/Sidebar.jsx';

describe('Sidebar', () => {
  test('renders the Home link (smoke)', () => {
    render(
      <MemoryRouter>
        <Sidebar open={true} onClose={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  });

  test('close (✕) button calls onClose', async () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <Sidebar open={true} onClose={onClose} />
      </MemoryRouter>
    );
    await (await import('@testing-library/user-event')).default
      .click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
