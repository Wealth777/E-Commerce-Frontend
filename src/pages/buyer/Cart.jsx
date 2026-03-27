import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import { removeFromCart, updateQuantity } from '../../store/cartSlice';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { items, total } = useSelector((state) => state.cart);

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-600';

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Item removed from cart');
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      handleRemove(id);
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  return (
    <div className={`min-h-screen ${bgColor} py-12`}>
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 mb-8 font-semibold"
        >
          <FaArrowLeft /> Continue Shopping
        </button>

        <h1 className={`text-3xl font-bold ${textColor} mb-8`}>Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {items.length === 0 ? (
              <div className={`${cardBg} shadow rounded-lg p-8 text-center`}>
                <p className={textColor}>Your cart is empty</p>
                <Link to="/products" className="text-red-600 hover:underline mt-4 inline-block">
                  Start shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className={`${cardBg} shadow rounded-lg p-6 flex gap-4`}>
                    <img
                      src={item.image || 'https://via.placeholder.com/100x100'}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${textColor}`}>{item.name}</h3>
                      <p className={secondaryText}>₦{item.price?.toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className={`px-2 py-1 rounded border ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                        >
                          -
                        </button>
                        <span className={textColor}>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className={`px-2 py-1 rounded border ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${textColor}`}>₦{(item.price * item.quantity)?.toLocaleString()}</p>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-600 hover:text-red-700 mt-4"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className={`${cardBg} shadow rounded-lg p-6 h-fit`}>
            <h3 className={`text-xl font-semibold ${textColor} mb-6`}>Order Summary</h3>
            <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-4 space-y-3`}>
              <div className="flex justify-between">
                <span className={secondaryText}>Subtotal</span>
                <span className={textColor}>₦{total?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className={secondaryText}>Shipping</span>
                <span className={textColor}>₦0</span>
              </div>
              <div className="flex justify-between">
                <span className={secondaryText}>Tax</span>
                <span className={textColor}>₦0</span>
              </div>
              <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-3 flex justify-between`}>
                <span className={`font-semibold ${textColor}`}>Total</span>
                <span className="text-lg font-bold text-red-600">₦{total?.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              disabled={items.length === 0}
              className="w-full mt-6 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;