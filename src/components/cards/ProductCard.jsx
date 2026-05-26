import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';
import { addToCart } from '../../store/cartActions';
import { toast } from 'react-toastify';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import apiClient from '../../api/apiClient';
import { getMessage } from '../../utils/apiResponse';
import { useToast } from '../../context/ToastContext';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);
  const { showToast } = useToast();

  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);

  const productId = product._id || product.id;

  const handleAddToCart = () => {
    if (role !== 'buyer') {
      toast.error('You must be a buyer to add items to cart');
      return;
    }
    dispatch(addToCart({
      ...product,
      id: productId
    }, toast));
  };

  const handleToggleFavorite = async () => {
    if (!role) {
      showToast('Please login to add to favorites', 'warning');
      return;
    }
    try {
      if (!isFavorite) {
        await apiClient.post('/buyer/wishlist', {
          productId: productId
        });

        setIsFavorite(true);
        showToast('Added to wishlist', 'success');
      } else {
        await apiClient.delete(`/buyer/wishlist/${productId}`);

        setIsFavorite(false);
        showToast('Removed from wishlist', 'success');
      }
    } catch (error) {
      showToast(getMessage(error, 'Wishlist action failed'), 'error');
    }


  };

  const categoryName =
    typeof product.category === 'object'
      ? product.category?.name
      : product.category || product.categoryName || 'Uncategorized';

  const subCategoryName =
    typeof product.subCategory === 'object'
      ? product.subCategory?.name
      : product.subCategory || '';

  const vendorName =
    product?.vendor?.storeName ||
    product?.vendorName ||
    (typeof product?.vendor === 'string' ? product.vendor : '') ||
    'Unknown vendor';

  const vendorId =
    product?.vendor?._id ||
    product?.vendor?.id ||
    product?.vendorId ||
    '';

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <Link to={`/product/${productId}`}>
          <img
            src={product.image || 'https://via.placeholder.com/300x200'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}

        <button
          onClick={handleToggleFavorite}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${product.isFavorite ? 'text-red-500' : 'text-gray-400'
            } hover:text-red-500 transition-colors`}
        >
          <FiHeart className={`h-5 w-5 ${product.isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
            {categoryName}
            {subCategoryName ? ` / ${subCategoryName}` : ''}
          </span>
          <div className="flex items-center text-sm text-yellow-500">
            <FaStar className="h-4 w-4 fill-current" />
            <span className="ml-1">{product.rating}</span>
            <span className="text-gray-400 dark:text-gray-500 ml-1">
              ({product.reviews})
            </span>
          </div>
        </div>

        <Link to={`/products/${productId}`}>
          <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1 hover:text-green-600">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {product.description}
          </p>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ₦{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                  ₦{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Seller:{' '}
              {vendorId ? (
                <Link
                  to={`/vendor/${vendorId}`}
                  className="hover:underline hover:text-blue-400 text-blue-500"
                >
                  {vendorName}
                </Link>
              ) : (
                <span>{vendorName}</span>
              )}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
            disabled={product.stock === 0}
          >
            <FiShoppingCart className="h-5 w-5" />
          </button>
        </div>

        {product.stock === 0 ? (
          <span className="inline-block mt-2 text-xs text-red-500 font-medium">
            Out of stock
          </span>
        ) : product.stock < 10 ? (
          <span className="inline-block mt-2 text-xs text-yellow-600 font-medium">
            Only {product.stock} left
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCard;