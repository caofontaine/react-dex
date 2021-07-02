import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders React Dex title', () => {
  render(<App />);
  const linkElement = screen.getByText(/React Dex/i);
  expect(linkElement).toBeInTheDocument();
});
