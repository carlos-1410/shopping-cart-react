import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Api from '../../../services/api';
import Product from './Product';

const ProductList = ({ cartItems }) => {
  const [products, setProducts] = useState([]),
    [loading, setLoading] = useState(true),
    [imagesLoaded, setImagesLoaded] = useState(0),
    allImagesLoaded = products.length > 0 && imagesLoaded >= products.length,
    fetchProducts = useCallback(async () => {
      await Api.fetchProducts()
        .then((response) => {
          setProducts(response);
        }).finally(() => {
          setLoading(false);
        });
    }, []),
    handleRemoveProduct = useCallback((productId) => {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    }, []),
    handleImageLoad = useCallback(() => {
      setImagesLoaded((prev) => (prev + 1));
    }, []),
    memoizedProducts = useMemo(() => {
      return products.map((product) => (
        <Product
          key={product.id}
          product={product}
          quantityInCart={
            cartItems.find((item) => item.product_id === product.id)?.quantity || 0
          }
          onRemove={() => handleRemoveProduct(product.id)}
          onImageLoad={handleImageLoad}
        />
      ));
    }, [products, cartItems, handleRemoveProduct]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className='container w-75 position-relative'>
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
        {memoizedProducts}
        {products.length === 0 && !loading &&
          <div className="text-center">
            <strong>There are no products in the catalog. Add some!</strong>
          </div>
        }
      </div>
      {(loading || (products.length > 0 && !allImagesLoaded)) && (
        <div className="loader-overlay">
          <div className="loader" data-testid="loader"></div>
        </div>
      )}
    </div>
  );
};

ProductList.propTypes = {
  cartItems: PropTypes.array.isRequired
};

export default ProductList;
