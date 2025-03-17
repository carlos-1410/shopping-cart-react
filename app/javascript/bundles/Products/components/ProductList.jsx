import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Api from '../../../services/api';
import Product from './Product';

const ProductList = ({ cartItems }) => {
  const [products, setProducts] = useState([]),
    [loading, setLoading] = useState(true),
    quantityInCart = (productId) => {
      const cartItem = cartItems.find((item) => item.product_id === productId);

      if (cartItem) {
        return cartItem.quantity;
      } else {
        return 0;
      }
    },
    fetchProducts = async () => {
      await Api.fetchProducts()
        .then((response) => {
          setProducts(response);
        }).finally(() => {
          setLoading(false);
        });
    },
    handleRemoveProduct = (productId) => {
      setProducts(products.filter((product) => product.id !== productId));
    };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <div className="loader" data-testid="loader"></div>
        </div>
      ) : (
        <div className='container w-75'>
          <div className='row mb-5'>
            <div className='col-6'>
              <h2 className='text-2xl font-bold'>Products</h2>
            </div>
            <div className="col-6 d-flex justify-content-end align-items-center gap-2">
              <a href="/cart" className="btn btn-light">
                <i className="fa fa-shopping-cart"></i>
              </a>
              <a href="/products/new" className="btn btn-success">
                <i className="fa fa-plus"></i>
              </a>
            </div>
          </div>

          <div className='container'>
            {products.length > 0 && products.map((product) => (
              <Product
                key={product.id}
                product={product}
                quantityInCart={quantityInCart(product.id)}
                onRemove={() => handleRemoveProduct(product.id)}
              />
            ))}
            {products.length === 0 &&
              <div className="text-center">
                <strong>There are no products in the catalog. Add some!</strong>
              </div>
            }
          </div>
        </div>
      )}
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.array.isRequired
};

export default ProductList;
