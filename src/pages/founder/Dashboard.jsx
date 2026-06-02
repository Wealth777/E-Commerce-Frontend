import React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';

const FounderDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { isDark } = useTheme();

  // Theme styling helpers
  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  // --- PHASE 1 MOCK DATA ---
  const stats = [
    { title: 'Total Users', value: '1,245', color: 'text-indigo-600' },
    { title: 'Total Buyers', value: '850', color: 'text-red-600' },
    { title: 'Total Vendors', value: '395', color: 'text-blue-600' },
    { title: 'Total Products', value: '432', color: 'text-purple-600' },
    { title: 'Total Orders', value: '1,120', color: 'text-green-600' },
    { title: 'Total Revenue', value: '₦2,450,000', color: 'text-yellow-600' },
    { title: 'Pending Approvals', value: '14', color: 'text-orange-500 font-black animate-pulse' },
  ];

  const recentActivities = [
    { id: 1, user: 'Emeka O.', action: 'registered as a vendor', time: '5 mins ago' },
    { id: 2, user: 'Aisha Y.', action: 'purchased "Calculus 101 Textbook"', time: '12 mins ago' },
    { id: 3, user: 'John Doe', action: 'listed a new product: "Electric Kettle"', time: '45 mins ago' },
    { id: 4, user: 'Blessing W.', action: 'account was suspended due to policy violation', time: '2 hours ago' },
  ];

  const notifications = [
    { id: 1, text: 'New vendor registration request awaiting approval.', urgent: true },
    { id: 2, text: 'System backup completed successfully.', urgent: false },
    { id: 3, text: '5 products flagged by users for review.', urgent: true },
  ];

  return (
    <div className={`min-h-screen ${bgColor} py-12 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Title */}
        <h1 className={`text-3xl font-bold ${textColor} mb-8`}>Dashboard Overview</h1>

        {/* Welcome Block */}
        <div className={`${cardBg} shadow-lg rounded-xl p-8 mb-8 border ${borderColor}`}>
          <h2 className={`text-2xl font-semibold ${textColor}`}>Welcome back, {user?.fullName || 'Admin'}!</h2>
          <p className={subTextColor}>Here is the current state of CampusTrade today.</p>
        </div>

        {/* 1. Statistics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className={`${cardBg} shadow-md rounded-xl p-6 border ${borderColor} flex flex-col justify-between`}>
              <p className={`text-sm font-medium ${subTextColor}`}>{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left/Middle Column: Analytics Placeholder & Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Analytics/Charts Card Placeholder */}
            <div className={`${cardBg} shadow-md rounded-xl p-6 border ${borderColor}`}>
              <h3 className={`text-xl font-semibold ${textColor} mb-4`}>Statistics & Analytics Chart</h3>
              <div className={`h-64 rounded-lg border-2 border-dashed ${borderColor} flex items-center justify-center ${subTextColor}`}>
                [ Visual Analytics & Growth Chart Rendering Space ]
              </div>
            </div>

            {/* Recent Activities List */}
            <div className={`${cardBg} shadow-md rounded-xl p-6 border ${borderColor}`}>
              <h3 className={`text-xl font-semibold ${textColor} mb-4`}>Recent Activities</h3>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentActivities.map((act) => (
                  <div key={act.id} className="py-3 flex justify-between items-center">
                    <div>
                      <span className={`font-semibold ${textColor}`}>{act.user} </span>
                      <span className={subTextColor}>{act.action}</span>
                    </div>
                    <span className="text-xs text-gray-500">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Quick Links & Notifications Summary */}
          <div className="space-y-8">
            
            {/* Notifications Summary Widget */}
            <div className={`${cardBg} shadow-md rounded-xl p-6 border ${borderColor}`}>
              <h3 className={`text-xl font-semibold ${textColor} mb-4`}>Notifications Summary</h3>
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-3 rounded-lg text-sm border ${
                      notif.urgent 
                        ? 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50' 
                        : 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50'
                    }`}
                  >
                    {notif.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Management Links */}
            <div className={`${cardBg} shadow-md rounded-xl p-6 border ${borderColor}`}>
              <h3 className={`text-xl font-semibold ${textColor} mb-4`}>Platform Controls</h3>
              <ul className="space-y-3">
                <li><a href="/founder/users?role=buyer" className="text-emerald-600 hover:underline font-medium">→ Go to Buyer Management</a></li>
                <li><a href="/founder/users?role=vendor" className="text-emerald-600 hover:underline font-medium">→ Go to Vendor Management</a></li>
                <li><a href="/founder/analytics" className="text-emerald-600 hover:underline font-medium">→ Comprehensive Reports</a></li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default FounderDashboard;