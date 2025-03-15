import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Product from './Product';
import Api from '../../../services/api';

jest.mock('../../../services/api');

describe('Product Component', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    vendor: 'Test Vendor',
    price: 100,
    product_image: 'test-image.jpg',
  };

  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders product details correctly', () => {
    render(<Product quantityInCart={2} product={mockProduct} onRemove={mockOnRemove} />);

    expect(screen.getByText(/Test Product, Test Vendor/i)).toBeInTheDocument();
    expect(screen.getByText(/\$1\.00/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Test Product/i })).toHaveAttribute('src', 'test-image.jpg');
  });

  test('calls API to add product to cart and updates quantity', async () => {
    Api.updateCartItem.mockResolvedValueOnce({ cart_item: { quantity: 3 } });

    render(<Product quantityInCart={2} product={mockProduct} onRemove={mockOnRemove} />);

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(Api.updateCartItem).toHaveBeenCalledWith({ product_id: mockProduct.id, quantity: 3 });
    });
  });

  test('calls API to remove a product after confirmation', async () => {
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    Api.removeProduct.mockResolvedValueOnce({});

    render(<Product quantityInCart={2} product={mockProduct} onRemove={mockOnRemove} />);

    const removeButton = screen.getByTitle('Remove product');
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(Api.removeProduct).toHaveBeenCalledWith(mockProduct.id);
      expect(mockOnRemove).toHaveBeenCalledWith(mockProduct);
    });
  });

  test('does not remove product if user cancels confirmation', async () => {
    jest.spyOn(window, 'confirm').mockImplementation(() => false);
    render(<Product quantityInCart={2} product={mockProduct} onRemove={mockOnRemove} />);

    const removeButton = screen.getByTitle('Remove product');
    fireEvent.click(removeButton);

    expect(Api.removeProduct).not.toHaveBeenCalled();
    expect(mockOnRemove).not.toHaveBeenCalled();
  });
});
