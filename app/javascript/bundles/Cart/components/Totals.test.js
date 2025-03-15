import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Totals from './Totals';
import { formatCurrency } from '../../../services/ultils';

jest.mock('../../../services/ultils', () => ({
  formatCurrency: jest.fn((value) => `$${(value / 100).toFixed(2)}`),
}));

describe('Totals Component', () => {
  const mockItems = [
    { id: 1, total_price: 3000, quantity: 2 },
    { id: 2, total_price: 4500, quantity: 1 },
  ]; // Total price: 7500 cents (or $75.00), 3 items

  test('renders correctly with given items', () => {
    render(<Totals items={mockItems} />);

    expect(screen.getByText('3 items')).toBeInTheDocument();
    expect(screen.getByText('$75.00')).toBeInTheDocument(); // Total price
    expect(screen.getByText('$25.00')).toBeInTheDocument(); // Default discount
  });

  test('updates discount amount when slider is moved', () => {
    render(<Totals items={mockItems} />);

    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();

    fireEvent.change(slider, { target: { value: 5000 } });

    expect(formatCurrency).toHaveBeenCalledWith(5000);
    expect(screen.getByText('$50.00')).toBeInTheDocument();
  });

  test('displays zero when discount is greater than total price', () => {
    render(<Totals items={mockItems} />);

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 10000 } });

    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });
});
