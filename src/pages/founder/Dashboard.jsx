import React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';

const FounderDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { isDark } = useTheme();

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  return (
    <div className={`min-h-screen ${bgColor} py-12`}>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className={`text-3xl font-bold ${textColor} mb-8`}>Admin Dashboard</h1>

        {/* Welcome */}
        <div className={`${cardBg} shadow-lg rounded-lg p-8 mb-8`}>
          <h2 className={`text-2xl font-semibold ${textColor}`}>Welcome, {user?.fullName}!</h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Manage the platform</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${cardBg} shadow rounded-lg p-6 text-center`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Buyers</p>
            <p className="text-3xl font-bold text-red-600">0</p>
          </div>
          <div className={`${cardBg} shadow rounded-lg p-6 text-center`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Vendors</p>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className={`${cardBg} shadow rounded-lg p-6 text-center`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Orders</p>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className={`${cardBg} shadow rounded-lg p-6 text-center`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Platform Revenue</p>
            <p className="text-3xl font-bold text-yellow-600">₦0</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${cardBg} shadow rounded-lg p-6`}>
            <h3 className={`text-xl font-semibold ${textColor} mb-4`}>User Management</h3>
            <ul className="space-y-3">
              <li><a href="/founder/users?role=buyer" className="text-red-600 hover:underline">Manage Buyers</a></li>
              <li><a href="/founder/users?role=vendor" className="text-red-600 hover:underline">Manage Vendors</a></li>
              <li><a href="/founder/settings" className="text-red-600 hover:underline">Settings</a></li>
            </ul>
          </div>
          <div className={`${cardBg} shadow rounded-lg p-6`}>
            <h3 className={`text-xl font-semibold ${textColor} mb-4`}>Platform Analytics</h3>
            <ul className="space-y-3">
              <li><a href="/founder/analytics" className="text-red-600 hover:underline">View Analytics</a></li>
              <li><a href="/founder/reports" className="text-red-600 hover:underline">Reports</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderDashboard;