import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Api from '../../../services/api';
import CartItem from './CartItem';
import Totals from './Totals';

const Cart = ({ boxIconPath }) => {
  const [cartItems, setCartItems] = useState([]),
    [loading, setLoading] = useState(true),
    fetchCartItems = async () => {
      await Api.fetchCartItems()
        .then((response) => {
          setCartItems(response);
          setLoading(false);
        }).finally(() => {
          setLoading(false);
        });
    },
    handleRemoveCartItem = (itemId) => {
      setCartItems(cartItems.filter((item) => item.id !== itemId));
    },
    handleUpdateCartItem = (updatedItem) => {
      setCartItems((prevItems) =>
        prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
    },
    resetCart = async () => {
      await Api.resetCart().then(setCartItems([]));
    };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <div className="loader" data-testid="loader"></div>
        </div>
      ) : (
        <div className="container w-75">
          <div className="row mb-5">
            <div className="col-6">
              <h2 className="text-2xl font-bold">Cart</h2>
            </div>
            {cartItems.length > 0 &&
              <div className="col-6 d-flex justify-content-end align-items-center">
                <button onClick={resetCart} className="btn btn-light">Reset</button>
              </div>
            }
          </div>
          {cartItems.length > 0 &&
            <div>
              <div className="container">
                {cartItems.map((cartItem) => (
                  <CartItem
                    key={cartItem.id}
                    item={cartItem}
                    onUpdate={handleUpdateCartItem}
                    onRemove={handleRemoveCartItem}
                  />
                ))}
              </div>
              <div className="container border rounded pt-3 px-2 mb-4">
                <Totals items={cartItems} />
              </div>
              <div className="container">
                <div className="row">
                  <button className="btn btn-success w-100" onClick={resetCart}>Checkout</button>
                </div>
              </div>
            </div>
          }
          {cartItems.length === 0 &&
            <div className="d-flex flex-column align-items-center justify-content-center min-vh-60 text-center">
              <img
                src={boxIconPath}
                alt="Empty Cart"
                className="mb-3"
                style={{ width: "100px", height: "100px" }}
                loading="lazy"
              />
              <h2 className="fw-bold text-dark">The cart is empty</h2>
              <p className="text-muted">Add items from <a href="/products">the catalog</a></p>
            </div>
          }
        </div>
      )}
    </div>
  );
};

Cart.propTypes = {
  boxIconPath: PropTypes.string.isRequired
};

export default Cart;
