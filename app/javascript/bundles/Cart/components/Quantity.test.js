import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Quantity from './Quantity'; // Adjust the import path as needed

describe('Quantity Component', () => {
  test('renders with initial quantity', () => {
    render(<Quantity quantity={5} onQuantityChange={() => { }} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('increments quantity when plus button is clicked', () => {
    const mockOnQuantityChange = jest.fn();
    render(<Quantity quantity={5} onQuantityChange={mockOnQuantityChange} />);
  
    const plusButton = screen.getByRole('button', { name: /increase/i });
    fireEvent.click(plusButton);
  
    expect(mockOnQuantityChange).toHaveBeenCalledWith(6);
  });

  test('decrements quantity when minus button is clicked', () => {
    const mockOnQuantityChange = jest.fn();
    render(<Quantity quantity={2} onQuantityChange={mockOnQuantityChange} />);

    const minusButton = screen.getByRole('button', { name: /decrease/i });
    fireEvent.click(minusButton);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(mockOnQuantityChange).toHaveBeenCalledWith(1);
  });
});
