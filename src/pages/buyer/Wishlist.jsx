import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Wishlist = () => {
  const { isDark } = useTheme();
  const [wishlist, setWishlist] = useState([]);

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  return (
    <div className={`min-h-screen ${bgColor} py-12`}>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className={`text-3xl font-bold ${textColor} mb-8`}>My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className={`${cardBg} shadow rounded-lg p-8 text-center`}>
            <p className={textColor}>Your wishlist is empty</p>
            <a href="/products" className="text-red-600 hover:underline mt-4 inline-block">
              Continue shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Wishlist items would render here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;