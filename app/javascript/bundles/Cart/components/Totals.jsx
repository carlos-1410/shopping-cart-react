import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { formatCurrency } from '../../../services/ultils';
import { Slider } from '@mui/material';

const Totals = ({ items }) => {
  const [discountAmount, setDiscountAmount] = useState(2500),
    totalPrice = items.reduce((sum, product) => sum + product.total_price, 0),
    totalItems = items.reduce((sum, item) => sum + item.quantity, 0),
    finalPrice = () => {
      if (totalPrice - discountAmount <= 0) {
        return 0;
      } else {
        return totalPrice - discountAmount;
      }
    },
    handleChange = (_, newValue) => {
      setDiscountAmount(newValue);
    };

  return (
    <div className="p-3">
      <div className="row mb-3">
        <div className="col-8">
          {totalItems === 1 ? "1 item" : `${totalItems} items`}
        </div>
        <div className="col-4 d-flex justify-content-end">
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-8">
          <span>Move the slider to specify the discount amount</span>
        </div>
        <div className="col-4 d-flex justify-content-end">
          <span className="text-success">{formatCurrency(discountAmount)}</span>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <Slider
            defaultValue={2500}
            max={10000}
            step={100}
            onChange={handleChange}
            value={discountAmount}
            color="success"
          />
        </div>
      </div>

      <hr />

      <div className="row">
        <div className="col-8 d-flex align-items-center">
          <h5>Total</h5>
        </div>
        <div className="col-4 d-flex align-items-center justify-content-end">
          <h3>{formatCurrency(finalPrice())}</h3>
        </div>
      </div>
    </div>
  );
};

Totals.propTypes = {
  items: PropTypes.array.isRequired
};

export default Totals;
