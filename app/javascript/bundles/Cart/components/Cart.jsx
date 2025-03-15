import React, { useEffect, useState } from 'react';
import Api from '../../../services/api';
import CartItem from './CartItem';
import Totals from './Totals';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]),
    fetchCartItems = async () => {
      await Api.fetchCartItems().then((response) => setCartItems(response));
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
          <img src="/assets/box-icon.png" alt="Empty Cart" className="mb-3" style={{ width: "100px", height: "100px" }} />
          <h2 className="fw-bold text-dark">The cart is empty</h2>
          <p className="text-muted">Add items from <a href="/products">the catalog</a></p>
        </div>
      }
    </div>
  );
};

export default Cart;
