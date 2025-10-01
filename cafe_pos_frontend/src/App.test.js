import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navigation', () => {
  render(<App />);
  const navItem = screen.getByText(/Menu/i);
  expect(navItem).toBeInTheDocument();
});
