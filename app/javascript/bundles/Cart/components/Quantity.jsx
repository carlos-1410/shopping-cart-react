import PropTypes from 'prop-types';
import React, { useState } from 'react';

const Quantity = ({ quantity, onQuantityChange }) => {
  const [productQuantity, setProductQuantity] = useState(quantity || 0);

  const updateQuantity = (change) => {
    const newQuantity = productQuantity + change;
    setProductQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  return (
    <div className="flex items-center mt-2">
      <span className="input-group-btn">
        <button type="button" className="btn btn-light" onClick={() => updateQuantity(-1)} aria-label="decrease">
          <span className="fa fa-minus"></span>
        </button>
      </span>
      <span className="mx-3 fw-bold">{productQuantity}</span>
      <span className="input-group-btn">
        <button type="button" className="btn btn-light" onClick={() => updateQuantity(1)} aria-label="increase">
          <span className="fa fa-plus"></span>
        </button>
      </span>
    </div>
  );
};

Quantity.propTypes = {
  quantity: PropTypes.number,
  onQuantityChange: PropTypes.func
};

export default Quantity;
