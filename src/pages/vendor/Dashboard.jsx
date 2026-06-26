import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/apiClient';
import { getList, getMessage, getPayload } from '../../utils/apiResponse';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Clock,
  Plus,
  Eye,
  BarChart3,
  ChevronRight,
  RotateCcw,
  MessageCircle
} from 'lucide-react';

const VendorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { showToast } = useToast();
  const { isDark } = useTheme();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchVendorStats = async () => {
      try {
        setLoadingStats(true);
        const [productsRes, ordersRes, activityRes] = await Promise.all([
          apiClient.get('/vendor/product/me'),
          apiClient.get('/vendor/orders'),
          apiClient.get('/vendor/activity'),
        ]);

        setProducts(getList(productsRes, ['products']));
        setOrders(getList(ordersRes, ['orders']));
        setActivity(getList(activityRes, ['activity', 'activities']).slice(0, 3));
      } catch (error) {
        showToast(getMessage(error, 'Failed to load dashboard stats'), 'error');
      } finally {
        setLoadingStats(false);
      }
    };

    fetchVendorStats();
  }, []);

  const totalProducts = products.length;
  const totalOrders = orders.length;

  const totalRevenue = orders.reduce((sum, order) => {
    const value =
      order?.pricing?.total ||
      order?.totalAmount ||
      order?.total ||
      order?.amount ||
      0;
    return sum + Number(value);
  }, 0);

  const pendingOrders = orders.filter(
    (order) => order?.status?.toString().toLowerCase() === 'pending'
  ).length;

  const stats = [
    {
      title: 'Total Products',
      value: loadingStats ? '...' : totalProducts,
      icon: Package,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-400/20'
    },
    {
      title: 'Total Orders',
      value: loadingStats ? '...' : totalOrders,
      icon: ShoppingCart,
      gradient: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-400/20'
    },
    {
      title: 'Total Revenue',
      value: loadingStats ? '...' : `₦${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      gradient: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-400/20',
    },
    {
      title: 'Pending Orders',
      value: loadingStats ? '...' : pendingOrders,
      icon: Clock,
      gradient: 'from-rose-500 to-pink-500',
      bgColor: 'bg-rose-400/20',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'List a new item',
      icon: Plus,
      href: '/vendor/products/add',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'View Products',
      description: 'Manage inventory',
      icon: Eye,
      href: '/vendor/products',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'View Orders',
      description: 'Check customer orders',
      icon: ShoppingCart,
      href: '/vendor/orders',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'View Refund Request',
      description: 'Check customer refund requests',
      icon: RotateCcw,
      href: '/vendor/refund-requests',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'View Return Request',
      description: 'Check customer return requests',
      icon: RotateCcw,
      href: '/vendor/return-requests',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    },
    {
      title: 'Messages',
      description: 'Chat with buyers',
      icon: MessageCircle,
      href: '/vendor/messages',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Analytics',
      description: 'Store performance',
      icon: BarChart3,
      href: '/vendor/analytics',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const formatAction = (action) => {
    switch (action) {
      case 'LOGIN': return 'Logged into account';
      case 'UPDATE_ACCOUNT': return 'Updated account details';
      case 'ADD_PRODUCT': return 'Added new product';
      default: return action;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 p-6 md:p-10 mb-8">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-white/90 mb-1">
              Welcome back,
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
              {user?.store?.storeName || 'Vendor'}!
            </h2>
            <p className="text-black text-sm md:text-base max-w-xl leading-relaxed">
              Manage your store, track orders, and grow your business all in one place.
            </p>
          </div>
        </div>

        {/* Stats Grid - production optimized layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
                  border rounded-xl p-5 md:p-6 transition-all duration-200 hover:shadow-lg group relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className={`p-3 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className={`absolute -right-2 -top-2 w-16 h-16 opacity-10 bg-gradient-to-br ${stat.gradient} rounded-full blur-xl`}></div>
                </div>
                <p className={`text-xs md:text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                  {stat.title}
                </p>
                <p className={`text-xl md:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <a
                    key={index}
                    href={action.href}
                    className={`group ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
                      border rounded-xl p-4 md:p-5 transition-all duration-200 hover:shadow-md hover:border-green-500/50`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${action.bgColor} flex-shrink-0 transition-transform group-hover:scale-110`}>
                        <Icon className={`w-5 h-5 ${action.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-sm md:text-base ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                          {action.title}
                        </h4>
                        <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                          {action.description}
                        </p>
                      </div>
                      <ChevronRight className={`w-4 h-4 md:w-5 md:h-5 ${isDark ? 'text-gray-600' : 'text-gray-400'} group-hover:translate-x-1 transition-transform flex-shrink-0`} />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Recent Activity
              </h3>
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-xl p-4 md:p-6`}>
                {activity?.length > 0 ? (
                  <div className="space-y-4">
                    {activity.map((item, index) => (
                      <div key={item._id || index} className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-xl p-4 border ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <p className={`text-sm font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{formatAction(item.action)}</p>
                          <span className={`text-[10px] uppercase font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</span>
                        </div>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.entity || 'System update'}</p>
                        {item.metadata && (
                          <div className="mt-2 p-2 bg-black/5 rounded text-[10px] font-mono break-all opacity-60">
                            {JSON.stringify(item.metadata)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className={`p-4 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} mb-3`}>
                      <Clock className={`w-6 h-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      No recent activity.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Store Status Card */}
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-xl p-5 md:p-6`}>
              <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Store Status
              </h4>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Store is active
                </span>
              </div>
              <div className={`p-3 md:p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                <p className={`text-[10px] uppercase font-bold tracking-tight ${isDark ? 'text-gray-500' : 'text-gray-400'} mb-1`}>
                  Live Store URL
                </p>
                <p className={`text-xs md:text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'} truncate`}>
                  campustrade.com/{user?.store?.storeName?.toLowerCase().replace(/\s+/g, '-') || 'shop'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;