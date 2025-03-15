import React from 'react';
import { render } from '@testing-library/react';
import FlashAlerts from './FlashAlerts';
import '@testing-library/jest-dom';

jest.mock('react-toastify', () => ({
  ToastContainer: jest.fn(() => <div data-testid="toast-container" />),
}));

describe('FlashAlerts Component', () => {
  test('renders the ToastContainer', () => {
    const { getByTestId } = render(<FlashAlerts />);
    expect(getByTestId('toast-container')).toBeInTheDocument();
  });
});
