import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { formatCurrency } from '../../../services/ultils';
import Api from '../../../services/api';

const Product = ({ quantityInCart, product, onRemove, onImageLoad }) => {
  const [quantity, setQuantity] = useState(quantityInCart),
    handleAddToCart = useCallback(async () => {
      await Api.updateCartItem({ product_id: product.id, quantity: quantity + 1 })
        .then((response) => setQuantity(response.cart_item.quantity));
    }),
    handleDestroy = useCallback(async () => {
      if (window.confirm("Are you sure you want to remove this product?")) {
        await Api.removeProduct(product.id).then(() => onRemove(product));
      }
    }, [product, onRemove]);

  return (
    <div className="row align-items-center">
      <div className="col-12 col-md-2 text-center mb-2 mb-md-0">
        <img
          src={product.product_image}
          alt={product.name}
          className="w-24 h-24 sm:w-36 sm:h-36 object-cover rounded"
          style={{ maxWidth: "100%", height: "auto" }}
          onLoad={onImageLoad}
          onError={onImageLoad}
          loading="lazy"
        />
      </div>

      <div className="col-12 col-md-4 h-100 justify-xs-center text-center text-md-start d-flex align-items-center">
        <p className='mb-0'>{product.name}, {product.vendor}</p>
      </div>

      <div className="col-12 col-md-2 d-flex flex-column align-items-center items-center mt-md-0">
        <p className="text-lg fw-bold mt-3">{formatCurrency(product.price)}</p>
      </div>

      <div className="col-12 col-md-4 text-center d-flex justify-content-end gap-2">
        <button className="btn btn-light" onClick={handleAddToCart}>Add to cart</button>
        <a href={`/products/${product.id}/edit`} className="btn btn-light" title="Edit product">
          <i className="fa fa-pencil"></i>
        </a>
        <button className="btn btn-light" onClick={handleDestroy} title="Remove product" role="button" aria-label="delete">
          <i className="fa fa-trash"></i>
        </button>
      </div>

      <hr className="text-secondary w-100 mt-2" />
    </div>
  );
};

Product.propTypes = {
  item: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
  onImageLoad: PropTypes.func.isRequired
};

export default Product;
