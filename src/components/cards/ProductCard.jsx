import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { addToCart } from '../../store/cartSlice';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const { role } = useSelector((state) => state.auth);
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-600';

  const handleAddToCart = () => {
    if (role !== 'buyer') {
      toast.error('You must be a buyer to add items to cart');
      return;
    }
    dispatch(addToCart(product));
    toast.success('Added to cart');
  };

  const handleToggleFavorite = () => {
    if (!role) {
      toast.warning('Please login to add to favorites', 'warning');
      return;
    }
    // dispatch(toggleFavorite(product.id));
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    // <div className={`${cardBg} rounded-lg shadow-md overflow-hidden hover:shadow-lg transition`}>
    //   {/* Image */}
    //   <div className="relative pb-full overflow-hidden bg-gray-200 dark:bg-gray-700 h-48">
    //     <Link to={`/product/${product.id}`}>
    //       <img
    //         src={product.image || 'https://via.placeholder.com/300x200'}
    //         alt={product.name}
    //         className="w-full h-full object-cover hover:scale-110 transition duration-300"
    //       />
    //     </Link>
    //   </div>

    //   {/* Content */}
    //   <div className="p-4">
    //     <Link to={`/product/${product.id}`} className="text-lg font-semibold hover:text-red-600 transition">
    //       <h3 className={textColor}>{product.name}</h3>
    //     </Link>

    //     <p className={`${secondaryText} text-sm my-2 line-clamp-2`}>{product.description}</p>

    //     {/* Rating */}
    //     <div className="flex items-center mb-2">
    //       {[...Array(5)].map((_, i) => (
    //         <FaStar
    //           key={i}
    //           size={14}
    //           className={i < (product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}
    //         />
    //       ))}
    //       <span className={`${secondaryText} text-sm ml-2`}>({product.reviews || 0})</span>
    //     </div>

    //     {/* Price */}
    //     <div className="flex items-center justify-between mb-4">
    //       <span className="text-2xl font-bold text-red-600">₦{product.price?.toLocaleString()}</span>
    //       {product.originalPrice && (
    //         <span className={`${secondaryText} line-through text-sm`}>
    //           ₦{product.originalPrice?.toLocaleString()}
    //         </span>
    //       )}
    //     </div>

    //     {/* Stock Status */}
    //     <p className={`text-sm mb-4 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
    //       {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
    //     </p>

    //     {/* Buttons */}
    //     <div className="flex gap-2">
    //       <button
    //         onClick={handleAddToCart}
    //         disabled={product.stock === 0}
    //         className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    //       >
    //         <FaShoppingCart /> Add
    //       </button>
    //       <button className="flex-1 border border-red-600 text-red-600 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-gray-700 transition">
    //         <FaHeart />
    //       </button>
    //     </div>
    //   </div>
    // </div>

    <div className="group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <Link to={`/products/${product.id}`}>
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
          className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${
            product.isFavorite ? 'text-red-500' : 'text-gray-400'
          } hover:text-red-500 transition-colors`}
        >
          <FiHeart className={`h-5 w-5 ${product.isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
            {product.category}
          </span>
          <div className="flex items-center text-sm text-yellow-500">
            <FaStar className="h-4 w-4 fill-current" />
            <span className="ml-1">{product.rating}</span>
            <span className="text-gray-400 dark:text-gray-500 ml-1">
              ({product.reviews})
            </span>
          </div>
        </div>
        
        <Link to={`/products/${product.id}`}>
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
              Seller: {product.sellerName}
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