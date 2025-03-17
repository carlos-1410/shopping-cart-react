import React, { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductList from './ProductList';
import Api from '../../../services/api';

jest.mock('../../../services/api', () => ({
  fetchProducts: jest.fn(),
  removeProduct: jest.fn()
}));

const mockProducts = [
  { id: 1, name: 'Product A', vendor: 'Vendor A', price: 100, product_image: 'img1.png' },
  { id: 2, name: 'Product B', vendor: 'Vendor B', price: 200, product_image: 'img2.png' },
];

describe('ProductList Component', () => {
  beforeEach(() => {
    Api.fetchProducts.mockResolvedValue(mockProducts);
  });

  test('calls fetchProducts on mount and displays products', async () => {
    render(<ProductList cartItems={[]} />);

    await waitFor(() => {
      expect(Api.fetchProducts).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Product A, Vendor A')).toBeInTheDocument();
      expect(screen.getByText('Product B, Vendor B')).toBeInTheDocument();
    });
  });

  test('shows loader while fetching products', async () => {
    let resolveFetch;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });
    Api.fetchProducts.mockReturnValue(fetchPromise);

    render(<ProductList cartItems={[]} />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    await act(async () => resolveFetch(mockProducts));

    const images = screen.getAllByRole('img');
    images.forEach((img) => img.dispatchEvent(new Event('load')));

    await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());
  });

  test('displays products after fetching and waits for images to load', async () => {
    Api.fetchProducts.mockResolvedValue(mockProducts);
    render(<ProductList cartItems={[]} />);

    await waitFor(() => {
      expect(Api.fetchProducts).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Product A, Vendor A')).toBeInTheDocument();
      expect(screen.getByText('Product B, Vendor B')).toBeInTheDocument();
    });

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    const images = screen.getAllByRole('img');
    images.forEach((img) => img.dispatchEvent(new Event('load')));

    await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());
  });

  test('shows message when no products are available', async () => {
    Api.fetchProducts.mockImplementation(() =>
      new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    render(<ProductList cartItems={[]} />);

    await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());

    expect(screen.getByText(/There are no products in the catalog/i)).toBeInTheDocument();
  });

  test('removes a product when onRemove is triggered', async () => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(Api, 'removeProduct').mockResolvedValue({ message: 'Product removed' });

    render(<ProductList cartItems={[]} />);

    await waitFor(() => {
      expect(Api.fetchProducts).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Product A, Vendor A')).toBeInTheDocument();
    });

    const removeButtons = await screen.findAllByRole('button', { name: /delete/i });
    expect(removeButtons.length).toBeGreaterThan(0);
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(Api.removeProduct).toHaveBeenCalledTimes(1);
      expect(screen.queryByText(/Product A, Vendor A/i)).not.toBeInTheDocument();
    });
  });
});
