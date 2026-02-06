import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from './Search';
import { expect, test, vi } from 'vitest';

test('calls onChange when typing', async () => {
  const user = userEvent.setup();
  const handleChange = vi.fn();

  render(<Search value="" onChange={handleChange} />);

  const input = screen.getByRole('textbox', { name: /search pokémon/i });
  await user.type(input, 'Pika');

  expect(handleChange).toHaveBeenCalled();
});
