import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cart from './Cart';
import Api from '../../../services/api';

jest.mock('../../../services/api');

describe('Cart Component', () => {
  const mockCartItems = [
    {
      id: 1,
      product_id: 1,
      product: {
        name: "Product 1",
        vendor: "Test Vendor",
        price: 5000,
      },
      product_image: "https://via.placeholder.com/150",
      quantity: 1,
    },
    {
      id: 2,
      product_id: 2,
      product: {
        name: "Product 2",
        vendor: "Test Vendor",
        price: 30,
      },
      product_image: "https://via.placeholder.com/150",
      quantity: 2,
    }
  ];

  beforeEach(() => {
    Api.fetchCartItems.mockResolvedValue(mockCartItems);
    Api.resetCart.mockResolvedValue([]);
  });

  test('renders the cart with items', async () => {
    render(<Cart />);

    await waitFor(() => {
      expect(screen.getByText('Product 1, Test Vendor')).toBeInTheDocument();
      expect(screen.getByText('Product 2, Test Vendor')).toBeInTheDocument();
    });
  });

  xtest('removes an item from the cart', async () => {
    render(<Cart />);

    await waitFor(() => expect(screen.getByText('Product 1, Test Vendor')).toBeInTheDocument());
    const deleteIcons = await screen.findAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteIcons[0]);

    await waitFor(() => expect(screen.queryByText('Product 1, Test Vendor')).not.toBeInTheDocument());
  });

  test('resets the cart when the reset button is clicked', async () => {
    render(<Cart />);

    await waitFor(() => expect(screen.getByText('Product 1, Test Vendor')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Reset'));

    await waitFor(() => expect(screen.getByText('The cart is empty')).toBeInTheDocument());
  });

  test('clears the cart when checkout button is clicked', async () => {
    render(<Cart />);

    await screen.findByText('Product 1, Test Vendor');
    fireEvent.click(screen.getByText('Checkout'));
    await screen.findByText('The cart is empty');
  });

  test('displays empty cart message when no items are present', async () => {
    Api.fetchCartItems.mockResolvedValue([]);
    render(<Cart />);

    await waitFor(() => expect(screen.getByText('The cart is empty')).toBeInTheDocument());
  });
});
