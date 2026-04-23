import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Clock,
  Plus,
  Eye,
  BarChart3,
  Store,
  ChevronRight,
  Bell,
  Search
} from 'lucide-react';

const VendorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  // const { product } = useSelector((state) => state.product);
  const { isDark } = useTheme();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchVendorStats = async () => {
      try {
        setLoadingStats(true);
        // const [productsRes, ordersRes, activityRes] = await Promise.all([
        const [productsRes, ordersRes, activityRes] = await Promise.all([
          apiClient.get('/vendor/product/me'),
          apiClient.get('/vendor/orders'),
          apiClient.get('/vendor/activity'),
        ]);

        setProducts(productsRes.data?.data || []);
        setOrders(ordersRes.data?.data || []);
        setActivity((activityRes.data?.data || []).slice(0, 3));
      } catch (error) {
        console.error('Failed to load vendor dashboard stats', error);
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoadingStats(false);
      }
    };

    fetchVendorStats();
  }, []);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  // const totalRevenue = orders.reduce(
  //   (sum, order) => sum + Number(order?.total ?? order?.amount ?? 0),
  //   0
  // );

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
      bgLight: 'bg-blue-50'
    },
    {
      title: 'Total Orders',
      value: loadingStats ? '...' : totalOrders,
      icon: ShoppingCart,
      gradient: 'from-emerald-500 to-teal-500',
      bgLight: 'bg-emerald-50'
    },
    {
      title: 'Total Revenue',
      value: loadingStats ? '...' : `₦${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      gradient: 'from-orange-500 to-amber-500',
      bgLight: 'bg-orange-50',
    },
    {
      title: 'Pending Orders',
      value: loadingStats ? '...' : pendingOrders,
      icon: Clock,
      gradient: 'from-rose-500 to-pink-500',
      bgLight: 'bg-rose-50',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'List a new item in your store',
      icon: Plus,
      href: '/vendor/products/add',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'View Products',
      description: 'Manage your inventory',
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
      title: 'Analytics',
      description: 'View store performance',
      icon: BarChart3,
      href: '/vendor/analytics',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const formatAction = (action) => {
    switch (action) {
      case 'LOGIN':
        return 'Logged into account';
      case 'UPDATE_ACCOUNT':
        return 'Updated account details';
      case 'ADD_PRODUCT':
        return 'Added new product';
      default:
        return action;
    }
  };


  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className={`relative overflow-hidden rounded-2xl ${isDark ? 'bg-gradient-to-r from-green-600 via-green-500 to-yellow-500' : 'bg-gradient-to-r from-green-600 via-green-500 to-yellow-500'} p-8 mb-8`}>
          <div className="relative z-10">
            <p className={`text-sm font-medium ${isDark ? 'text-white-400' : 'text-white'} mb-1`}>
              Welcome back,
            </p>
            <h2 className={`text-3xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-400'} mb-2`}>
              {user?.store?.storeName || 'Vendor'}!
            </h2>
            <p className={`${isDark ? 'text-white' : 'text-white'} max-w-xl`}>
              Manage your store, track orders, and grow your business all in one place.
            </p>
          </div>
          <div className={`absolute top-0 right-0 w-64 h-64 ${isDark ? 'bg-red-500/10' : 'bg-white/10'} rounded-full -mr-16 -mt-16 blur-3xl`}></div>
          <div className={`absolute bottom-0 right-20 w-32 h-32 ${isDark ? 'bg-blue-500/10' : 'bg-white/5'} rounded-full -mb-10 blur-2xl`}></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} 
                  border rounded-xl p-6 transition-all duration-200 hover:shadow-lg ${stat.gradient}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgColor}shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 text-white  `} />
                  </div>
                </div>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    className={`group ${isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-100 hover:border-red-200'} 
                      border rounded-xl p-5 transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${action.bgColor} transition-transform group-hover:scale-110`}>
                        <Icon className={`w-5 h-5 ${action.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                          {action.title}
                        </h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {action.description}
                        </p>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-600' : 'text-gray-400'} group-hover:translate-x-1 transition-transform`} />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <div className="lg:col-span-1">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Recent Activity
            </h3>
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-xl p-6`}>
              {activity?.length > 0 ? (
                <div className="space-y-4">
                  {activity.map((item, index) => (
                    <div key={item._id || index} className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-100'} border rounded-2xl p-4`}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {formatAction(item.action)}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                            {item.entity ? `${item.entity}` : 'General activity'}
                          </p>
                        </div>
                        <p className={`text-[11px] uppercase tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                      {item.metadata && Object.keys(item.metadata).length > 0 && (
                        <div className="mt-3 text-xs text-gray-400 break-words">
                          {JSON.stringify(item.metadata)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className={`p-4 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
                    <Clock className={`w-8 h-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    No recent activity yet. <br />
                    Start by adding your first product!
                  </p>
                </div>
              )}
            </div>

            {/* Store Status Card */}
            <div className={`mt-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border rounded-xl p-6`}>
              <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Store Status
              </h4>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Store is active
                </span>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                  Store URL
                </p>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} truncate`}>
                  {/* {user?.store?.storeName.toLowerCase().replace(/\s+/g, '-') || 'vendor'} */}
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