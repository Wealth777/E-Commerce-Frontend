import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';
import { addToCart } from '../../store/cartActions';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import apiClient from '../../api/apiClient';
import { getMessage, getPayload } from '../../utils/apiResponse';
import { useToast } from '../../context/ToastContext';

const getObjectId = (value) => {
  if (!value) return '';

  if (typeof value === 'string') {
    return value;
  }

  return (
    value._id ||
    value.id ||
    value.userId ||
    value.user ||
    value.accountId ||
    ''
  );
};

const getVendorChatUserId = (product) => {
  const possibleIds = [
    product?.vendor?.user,
    product?.vendor?.userId,
    product?.vendor?.authUser,
    product?.vendor?.account,
    product?.vendor?.accountId,
    product?.vendor?.owner,
    product?.vendor?.ownerId,
    product?.vendor?._id,
    product?.vendor?.id,
    product?.vendorId,
    product?.vendorUserId,
  ];

  for (const value of possibleIds) {
    const id = getObjectId(value);

    if (id) {
      return id;
    }
  }

  return '';
};

const getConversationId = (payload) => {
  const conversation =
    payload?.conversation ||
    payload?.data?.conversation ||
    payload?.data ||
    payload;

  return (
    conversation?._id ||
    conversation?.id ||
    conversation?.conversationId ||
    payload?.conversationId ||
    payload?.data?.conversationId ||
    ''
  );
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role, isAuthenticated } = useSelector((state) => state.auth);
  const { showToast } = useToast();

  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);
  const [vendorAction, setVendorAction] = useState('');
  const [startingChat, setStartingChat] = useState(false);

  const productId = product._id || product.id;

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
    product?.vendor?.businessName ||
    product?.vendor?.fullName ||
    product?.vendorName ||
    'Unknown vendor';

  const vendorId =
    product?.vendor?._id ||
    product?.vendor?.id ||
    product?.vendorId ||
    '';

  const handleAddToCart = () => {
    if (role !== 'buyer') {
      showToast('You must be a buyer to add items to cart', 'warning');
      return;
    }

    const stock = Number(product.stock ?? product.countInStock ?? 0);

    if (stock <= 0) {
      showToast('Product is out of stock', 'error');
      return;
    }

    dispatch(
      addToCart({
        ...product,
        _id: productId,
        id: productId,
        stock,
        quantity: 1,
      })
    );
  };

  const handleToggleFavorite = async () => {
    if (!role) {
      showToast('Please login to add to favorites', 'warning');
      return;
    }

    try {
      if (!isFavorite) {
        await apiClient.post('/buyer/wishlist', {
          productId,
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

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      showToast('Please login as a buyer to message this vendor.', 'warning');
      navigate('/login', {
        state: {
          from: vendorId ? `/vendor/${vendorId}` : `/product/${productId}`,
        },
      });
      return;
    }

    if (role !== 'buyer') {
      showToast('Only buyers can start a chat with vendors.', 'warning');
      return;
    }

    const targetUserId = getVendorChatUserId(product);

    if (!targetUserId) {
      showToast('Unable to identify this vendor for chat.', 'error');
      return;
    }

    try {
      setStartingChat(true);

      const response = await apiClient.post('/chat/conversations', {
        targetUserId,
        targetRole: 'vendor',
      });

      const payload = getPayload(response, {});
      const conversationId = getConversationId(payload);

      if (conversationId) {
        navigate(`/buyer/messages?conversationId=${encodeURIComponent(conversationId)}`);
        return;
      }

      navigate(
        `/buyer/messages?targetUserId=${encodeURIComponent(targetUserId)}&targetRole=vendor`
      );
    } catch (error) {
      showToast(getMessage(error, 'Failed to start chat with vendor'), 'error');
    } finally {
      setStartingChat(false);
    }
  };

  const handleVendorActionChange = async (event) => {
    const action = event.target.value;

    setVendorAction(action);

    if (action === 'view') {
      if (!vendorId) {
        showToast('Vendor details are not available for this product.', 'error');
        setVendorAction('');
        return;
      }

      navigate(`/vendor/${vendorId}`);
      return;
    }

    if (action === 'chat') {
      await handleStartChat();
      setVendorAction('');
    }
  };

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
          type="button"
          onClick={handleToggleFavorite}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${isFavorite ? 'text-red-500' : 'text-gray-400'
            } hover:text-red-500 transition-colors`}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
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
            <span className="ml-1">{product.rating || 0}</span>
            <span className="text-gray-400 dark:text-gray-500 ml-1">
              ({product.reviews || 0})
            </span>
          </div>
        </div>

        <Link to={`/product/${productId}`}>
          <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1 hover:text-green-600">
            {product.name}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {product.description}
          </p>
        </Link>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ₦{Number(product.price || 0).toLocaleString()}
              </span>

              {product.originalPrice && (
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                  ₦{Number(product.originalPrice || 0).toLocaleString()}
                </span>
              )}
            </div>

            <label className="mt-2 block text-xs text-gray-500 dark:text-gray-400">
              Seller action
              <select
                value={vendorAction}
                onChange={handleVendorActionChange}
                disabled={startingChat}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              >
                <option value="">{vendorName}</option>
                <option value="view">View vendor details</option>
                <option value="chat">
                  {startingChat ? 'Opening chat...' : 'Start chat'}
                </option>
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
            disabled={Number(product.stock ?? product.countInStock ?? 0) <= 0}
            aria-label="Add to cart"
          >
            <FiShoppingCart className="h-5 w-5" />
          </button>
        </div>

        {Number(product.stock ?? product.countInStock ?? 0) <= 0 ? (
          <span className="inline-block mt-2 text-xs text-red-500 font-medium">
            Out of stock
          </span>
        ) : Number(product.stock ?? product.countInStock ?? 0) < 10 ? (
          <span className="inline-block mt-2 text-xs text-yellow-600 font-medium">
            Only {Number(product.stock ?? product.countInStock ?? 0)} left
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default ProductCard;