import React, { act } from 'react';
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
        name: "Product A",
        vendor: "Vendor A",
        price: 5000,
      },
      product_image: "img1.png",
      quantity: 1,
    },
    {
      id: 2,
      product_id: 2,
      product: {
        name: "Product B",
        vendor: "Vendor B",
        price: 30,
      },
      product_image: "img2.png",
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
      expect(Api.fetchCartItems).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Product A, Vendor A')).toBeInTheDocument();
      expect(screen.getByText('Product B, Vendor B')).toBeInTheDocument();
    });
  });

  test('shows loader while fetching cart items', async () => {
    let resolveFetch;
    new Promise((resolve) => {
      resolveFetch = resolve;
    });

    render(<Cart />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    await act(async () => resolveFetch(mockCartItems));

    const images = screen.getAllByRole('img');
    images.forEach((img) => img.dispatchEvent(new Event('load')));

    await waitFor(() => {
      expect(Api.fetchCartItems).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
      expect(screen.getByText('Product A, Vendor A')).toBeInTheDocument();
      expect(screen.getByText('Product B, Vendor B')).toBeInTheDocument();
    });
  });

  test('displays cart items after fetching and waits for images to load', async () => {
    let resolveFetch;
    new Promise((resolve) => {
      resolveFetch = resolve;
    });

    render(<Cart />);

    await act(async () => resolveFetch(mockCartItems));

    await waitFor(() => {
      expect(Api.fetchCartItems).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Product A, Vendor A')).toBeInTheDocument();
      expect(screen.getByText('Product B, Vendor B')).toBeInTheDocument();
    });

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    const images = screen.getAllByRole('img');
    images.forEach((img) => img.dispatchEvent(new Event('load')));

    await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());
  });

  test('removes an item from the cart', async () => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(Api, 'removeCartItem').mockResolvedValue({ message: 'Product removed' });
    render(<Cart />);

    await waitFor(() => expect(screen.getByText('Product A, Vendor A')).toBeInTheDocument());

    const deleteIcons = await screen.findAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteIcons[0]);

    await waitFor(() => {
      expect(Api.fetchCartItems).toHaveBeenCalledTimes(1);
      expect(Api.removeCartItem).toHaveBeenCalledWith(mockCartItems[0].id);
      expect(screen.queryByText('Product A, Vendor A')).not.toBeInTheDocument();
    });
  });

  test('resets the cart when the reset button is clicked', async () => {
    render(<Cart />);

    await waitFor(() => expect(screen.getByText('Product A, Vendor A')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Reset'));

    await waitFor(() => expect(screen.getByText('The cart is empty')).toBeInTheDocument());
  });

  test('clears the cart when checkout button is clicked', async () => {
    render(<Cart />);

    await screen.findByText('Product A, Vendor A');
    fireEvent.click(screen.getByText('Checkout'));
    await screen.findByText('The cart is empty');
  });

  test('displays empty cart message when no items are present', async () => {
    Api.fetchCartItems.mockResolvedValue([]);
    render(<Cart />);

    await waitFor(() => expect(screen.getByText('The cart is empty')).toBeInTheDocument());
  });
});
