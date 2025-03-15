import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CartItem from './CartItem';
import Api from '../../../services/api';
import { formatCurrency } from '../../../services/ultils';

jest.mock('../../../services/api', () => ({
  removeCartItem: jest.fn(() => Promise.resolve()),
  updateCartItem: jest.fn(() =>
    Promise.resolve({
      cart_item: {
        id: 1, 
        product_id: 101, 
        quantity: 2, 
        product: {
          name: 'Test Product',
          vendor: 'Test Vendor',
          price: 5000,
        },
        product_image: 'https://via.placeholder.com/150'
      }
    })
  ),
}));

describe('CartItem Component', () => {
  const mockItem = {
    id: 1,
    product_id: 101,
    product: {
      name: 'Test Product',
      vendor: 'Test Vendor',
      price: 5000,
    },
    product_image: 'https://via.placeholder.com/150',
    quantity: 1,
  };

  const mockOnUpdate = jest.fn();
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders CartItem correctly', () => {
    render(<CartItem item={mockItem} onUpdate={mockOnUpdate} onRemove={mockOnRemove} />);

    expect(screen.getByText(`${mockItem.product.name}, ${mockItem.product.vendor}`)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: mockItem.product.name })).toBeInTheDocument();
    expect(screen.getByText(formatCurrency(mockItem.product.price))).toBeInTheDocument();
  });

  test('calls onUpdate when quantity is changed', async () => {
    render(<CartItem item={mockItem} onUpdate={mockOnUpdate} onRemove={mockOnRemove} />);

    const plusButton = screen.getByRole('button', { name: /increase/i });
    fireEvent.click(plusButton);

    expect(Api.updateCartItem).toHaveBeenCalledWith({
      product_id: mockItem.product_id,
      quantity: 2,
    });

    await screen.findByText(formatCurrency(mockItem.product.price));
    expect(mockOnUpdate).toHaveBeenCalled();
  });

  test('calls onRemove when trash icon is clicked', async () => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    render(<CartItem item={mockItem} onUpdate={mockOnUpdate} onRemove={mockOnRemove} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(Api.removeCartItem).toHaveBeenCalledWith(mockItem.id);
      expect(mockOnRemove).toHaveBeenCalledWith(mockItem.id);
    });
  });

  test('removes item when quantity is reduced to 0', async () => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    render(<CartItem item={mockItem} onUpdate={mockOnUpdate} onRemove={mockOnRemove} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(Api.removeCartItem).toHaveBeenCalledWith(mockItem.id);
      expect(mockOnRemove).toHaveBeenCalledWith(mockItem.id);
    });
  });
});
