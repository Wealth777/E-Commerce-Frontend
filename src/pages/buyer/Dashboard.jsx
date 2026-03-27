import React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';

const BuyerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { isDark } = useTheme();
  const { items } = useSelector((state) => state.cart);

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  return (
    <div className={`min-h-screen ${bgColor} py-12`}>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className={`text-3xl font-bold ${textColor} mb-8`}>Buyer Dashboard</h1>

        {/* Welcome */}
        <div className={`${cardBg} shadow-lg rounded-lg p-8 mb-8`}>
          <h2 className={`text-2xl font-semibold ${textColor}`}>Welcome, {user?.fullName}!</h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Manage your orders and shopping</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${cardBg} shadow rounded-lg p-6 text-center`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Cart Items</p>
            <p className="text-3xl font-bold text-red-600">{items.length}</p>
          </div>
          <div className={`${cardBg} shadow rounded-lg p-6 text-center`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Active Orders</p>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className={`${cardBg} shadow rounded-lg p-6 text-center`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Spent</p>
            <p className="text-3xl font-bold text-green-600">₦0</p>
          </div>
          <div className={`${cardBg} shadow rounded-lg p-6 text-center`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Wishlist</p>
            <p className="text-3xl font-bold text-yellow-600">0</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${cardBg} shadow rounded-lg p-6`}>
            <h3 className={`text-xl font-semibold ${textColor} mb-4`}>Quick Actions</h3>
            <ul className="space-y-3">
              <li><a href="/products" className="text-red-600 hover:underline">Continue Shopping</a></li>
              <li><a href="/buyer/orders" className="text-red-600 hover:underline">View Orders</a></li>
              <li><a href="/cart" className="text-red-600 hover:underline">View Cart</a></li>
              <li><a href="/buyer/wishlist" className="text-red-600 hover:underline">View Wishlist</a></li>
            </ul>
          </div>
          <div className={`${cardBg} shadow rounded-lg p-6`}>
            <h3 className={`text-xl font-semibold ${textColor} mb-4`}>Account</h3>
            <ul className="space-y-3">
              <li><a href="/buyer/profile" className="text-red-600 hover:underline">Update Profile</a></li>
              <li><a href="/buyer/settings" className="text-red-600 hover:underline">Settings</a></li>
              <li><a href="/privacy" className="text-red-600 hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;