import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../../components/Header/Header.jsx';


describe('Header', () => {
  test('renders brand title and subtitle', () => {
    render(<Header onMenu={() => {}} />);

    expect(screen.getByRole('heading', { name: /transactions/i })).toBeInTheDocument();
    expect(screen.getByText(/first react task/i)).toBeInTheDocument();
  });

  test('menu button calls onMenu when clicked', async () => {
    const onMenu = vi.fn();
    render(<Header onMenu={onMenu} />);

    const btn = screen.getByRole('button', { name: /toggle sidebar/i });
    await userEvent.click(btn);

    expect(onMenu).toHaveBeenCalledTimes(1);
  });
});
