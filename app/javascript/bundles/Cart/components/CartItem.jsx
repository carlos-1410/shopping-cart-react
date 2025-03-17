import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import Quantity from './Quantity';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../../../services/ultils';
import Api from '../../../services/api';

const CartItem = ({ item, onUpdate, onRemove, onImageLoad }) => {
  const [cartItem, setCartItem] = useState(item),
    handleRemove = useCallback(async () => {
      if (window.confirm("Are you sure you want to remove this item from your cart?")) {
        await Api.removeCartItem(cartItem.id).then(() => onRemove(cartItem.id));
      }
    }, [cartItem.id, onRemove]),
    handleUpdate = useCallback(async (quantity) => {
      if (quantity > 0) {
        await Api.updateCartItem({ product_id: cartItem.product_id, quantity: quantity }).then((response) => {
          const updatedItem = response.cart_item;
          setCartItem({
            ...updatedItem,
            total_price: updatedItem.quantity * cartItem.product.price, // Calculate total manually
          });
          onUpdate(updatedItem);
        });
      } else {
        handleRemove(cartItem.id);
      }
    }, [cartItem.product_id, handleRemove, onUpdate]),
    formattedPrice = useMemo(() => formatCurrency(cartItem.product.price), [cartItem.product.price]);

  return (
    <div className="row align-items-center mb-2">
      <div className="col-12 col-md-2 text-center mb-2 mb-md-0">
        <img
          src={cartItem.product_image}
          alt={cartItem.product.name}
          className="w-24 h-24 sm:w-36 sm:h-36 object-cover rounded"
          style={{ maxWidth: "100%", height: "auto" }}
          onLoad={onImageLoad}
          onError={onImageLoad}
          loading="lazy"
        />
      </div>

      <div className="col-12 col-md-4 h-100 text-center justify-xs-center text-md-start d-flex align-items-center">
        <p className='mb-0'>{cartItem.product.name}, {cartItem.product.vendor}</p>
      </div>

      <div className="col-12 col-md-4 text-center text-md-start">
        <Quantity quantity={cartItem.quantity || 0} onQuantityChange={handleUpdate} />
      </div>

      <div className="col-12 col-md-2 d-flex flex-column align-items-center align-items-md-end">
        <Trash2
          size={25}
          onClick={() => handleRemove(cartItem.id)}
          className="text-secondary cursor-pointer"
          role="button"
          aria-label="delete"
        />
        <p className="text-lg fw-bold py-2">{formattedPrice}</p>
      </div>

      <hr className="text-secondary w-100 mt-2" />
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onImageLoad: PropTypes.func.isRequired
};

export default CartItem;
