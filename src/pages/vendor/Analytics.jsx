import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Analytics = () => {
  const { isDark } = useTheme();

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  return (
    <div className={`min-h-screen ${bgColor} py-12`}>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className={`text-3xl font-bold ${textColor} mb-8`}>Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${cardBg} shadow rounded-lg p-6 text-center`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Sales</p>
            <p className="text-3xl font-bold text-green-600">₦0</p>
          </div>
          <div className={`${cardBg} shadow rounded-lg p-6 text-center`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Orders</p>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className={`${cardBg} shadow rounded-lg p-6 text-center`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Avg Order Value</p>
            <p className="text-3xl font-bold text-purple-600">₦0</p>
          </div>
          <div className={`${cardBg} shadow rounded-lg p-6 text-center`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Completion Rate</p>
            <p className="text-3xl font-bold text-yellow-600">0%</p>
          </div>
        </div>

        <div className={`${cardBg} shadow rounded-lg p-6`}>
          <h3 className={`text-xl font-semibold ${textColor} mb-4`}>Sales Chart</h3>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;