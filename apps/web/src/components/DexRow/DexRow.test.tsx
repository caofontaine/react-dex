import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DexRow from './DexRow';
import { expect, test, vi } from 'vitest';

const entry = {
  dexnum: '0025',
  name: 'Pikachu',
  type1: 'Electric',
  type2: null,
  region: 'Kanto'
};

test('renders dex row data and toggles caught', async () => {
  const user = userEvent.setup();
  const onToggleCaught = vi.fn();

  render(
    <table>
      <tbody>
        <DexRow entry={entry} caught={false} onToggleCaught={onToggleCaught} />
      </tbody>
    </table>
  );

  expect(screen.getByRole('img', { name: 'Pikachu' })).toBeInTheDocument();
  expect(screen.getByText('Pikachu', { selector: 'td' })).toBeInTheDocument();
  expect(screen.getByRole('cell', { name: 'Electric' })).toBeInTheDocument();

  const checkbox = screen.getByRole('checkbox', { name: /mark pikachu as caught/i });
  await user.click(checkbox);

  expect(onToggleCaught).toHaveBeenCalledWith('0025');
});
