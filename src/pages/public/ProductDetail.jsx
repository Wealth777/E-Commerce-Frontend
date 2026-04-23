import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaHeart, FaStar, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../../store/cartActions';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const { role } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/buyer/products/${id}`);
      setProduct(response.data.product);
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (role !== 'buyer') {
      toast.error('You must be a buyer to add items to cart');
      return;
    }
    dispatch(addToCart({ ...product, quantity }, toast));
    // toast.success('Added to cart');
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-600';

  if (loading) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
        <p className={textColor}>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
        <p className={textColor}>Product not found</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 mb-8 font-semibold"
        >
          <FaArrowLeft /> Back to Products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className={`${cardBg} rounded-lg overflow-hidden p-4`}>
            <img
              src={product.image || 'https://via.placeholder.com/500x500'}
              alt={product.name}
              className="w-full h-96 object-cover rounded"
            />
          </div>

          {/* Details */}
          <div>
            <h1 className={`text-4xl font-bold ${textColor} mb-4`}>{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < (product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}
                />
              ))}
              <span className={`${secondaryText} ml-2`}>({product.reviews || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-red-600">₦{product.price?.toLocaleString()}</span>
              {product.originalPrice && (
                <span className={`${secondaryText} line-through ml-4`}>
                  ₦{product.originalPrice?.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock */}
            <p className={`text-lg mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>

            {/* Description */}
            <p className={`${secondaryText} mb-8 leading-relaxed`}>{product.description}</p>

            {/* Vendor Info */}
            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg mb-8`}>
              <p className={`${secondaryText} text-sm`}>Sold by</p>
              <p className={`${textColor} font-semibold text-lg`}>{product.vendor || 'CampusTrade'}</p>
            </div>

            {/* Quantity and Action */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={`px-4 py-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  -
                </button>
                <span className={`px-6 py-2 ${textColor}`}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className={`px-4 py-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <FaShoppingCart /> Add to Cart
              </button>

              <button className="border border-red-600 text-red-600 py-2 px-6 rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 transition">
                <FaHeart size={24} />
              </button>
            </div>

            {/* Additional Info */}
            <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-6 rounded-lg space-y-4`}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`${secondaryText} text-sm`}>Category</p>
                  <p className={textColor}>{product.category}</p>
                </div>
                <div>
                  <p className={`${secondaryText} text-sm`}>SKU</p>
                  <p className={textColor}>{product.sku || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;