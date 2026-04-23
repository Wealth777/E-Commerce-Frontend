import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  MoreHorizontal,
  Package,
  Users,
  Target,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import apiClient from '../../api/apiClient';
import { toast } from 'react-toastify';

const StatCard = ({ title, value, change, isPositive, icon, color, darkColor }) => {
  const { isDark } = useTheme();

  return (
    <div className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl ${isDark
      ? 'border-gray-700/50 bg-gray-800/50 hover:bg-gray-800'
      : 'border-gray-200/60 bg-white hover:bg-gray-50/50'
      }`}>
      {/* Gradient overlay */}
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-30 ${color}`} />

      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} ${darkColor} shadow-lg`}>
            {icon}
          </div>
          <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium ${isPositive
            ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
            : isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'
            }`}>
            {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            {change}
          </div>
        </div>

        <div className="mt-4">
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
          <p className={`mt-1 text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

const ChartPlaceholder = ({ title, type }) => {
  const { isDark } = useTheme();

  return (
    <div className={`relative h-64 w-full rounded-xl border ${isDark ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-200 bg-gray-50/50'} flex items-center justify-center`}>
      <div className="text-center">
        {type === 'line' && <Activity className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />}
        {type === 'bar' && <BarChart3 className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />}
        {type === 'pie' && <PieChart className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />}
        <p className={`mt-3 text-sm font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{title}</p>
        <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Chart component placeholder</p>
      </div>
    </div>
  );
};

const RecentOrderRow = ({ id, customer, amount, status, date }) => {
  const { isDark } = useTheme();

  const statusStyles = {
    completed: isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600',
    pending: isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-600',
    cancelled: isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'
  };

  return (
    <div className={`flex items-center justify-between border-b py-4 last:border-0 ${isDark ? 'border-gray-700/50' : 'border-gray-100'}`}>
      <div className="flex items-center gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <Package className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Order {id}</p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{customer}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{amount}</p>
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{date}</p>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
};

const TopProductRow = ({ name, sales, revenue, trend }) => {
  const { isDark } = useTheme();

  return (
    <div className={`flex items-center justify-between border-b py-4 last:border-0 ${isDark ? 'border-gray-700/50' : 'border-gray-100'}`}>
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg ${isDark ? 'bg-gradient-to-br from-violet-500/30 to-purple-600/30' : 'bg-gradient-to-br from-violet-100 to-purple-100'} flex items-center justify-center`}>
          <Package className={`h-5 w-5 ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
        </div>
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{name}</p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{sales} sold</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{revenue}</p>
        <p className={`text-xs ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </p>
      </div>
    </div>
  );
};

const Analytics = () => {
  const { isDark, toggleTheme } = useTheme();
  const [dateRange, setDateRange] = useState('7d');
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loadingStats, setLoadingStats] = useState(true);


  useEffect(() => {
    const fetchVendorStats = async () => {
      try {
        setLoadingStats(true)

        const res = await apiClient.get('/vendor/analytics');

        setOrders(res.data.data.recentOrders);
        setProducts(res.data.data.topProducts);

      } catch (error) {
        console.error('Failed to load vendor', error);
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoadingStats(false);
      }
    }
    
    fetchVendorStats();
  }, [])

  const stats = [
    {
      title: 'Total Sales',
      value: '₦2,450,000',
      change: '+12.5%',
      isPositive: true,
      icon: <DollarSign className="h-6 w-6 text-white" />,
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      darkColor: 'shadow-emerald-500/30'
    },
    {
      title: 'Total Orders',
      value: '1,284',
      change: '+8.2%',
      isPositive: true,
      icon: <ShoppingBag className="h-6 w-6 text-white" />,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      darkColor: 'shadow-blue-500/30'
    },
    {
      title: 'Avg Order Value',
      value: '₦1,908',
      change: '+3.8%',
      isPositive: true,
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      color: 'bg-gradient-to-br from-violet-500 to-violet-600',
      darkColor: 'shadow-violet-500/30'
    },
    {
      title: 'Completion Rate',
      value: '94.2%',
      change: '-1.2%',
      isPositive: false,
      icon: <CheckCircle className="h-6 w-6 text-white" />,
      color: 'bg-gradient-to-br from-amber-500 to-amber-600',
      darkColor: 'shadow-amber-500/30'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50/50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 border-b backdrop-blur-xl ${isDark ? 'border-gray-700/50 bg-gray-900/80' : 'border-gray-200/60 bg-white/80'}`}>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Analytics Dashboard
              </h1>
              <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Track your store performance and metrics
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Date Range Selector */}
              <div className={`flex items-center rounded-lg border p-1 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                {['24h', '7d', '30d', '90d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${dateRange === range
                      ? isDark
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-900'
                      : isDark
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-500 hover:text-gray-900'
                      }`}
                  >
                    {range === '24h' ? 'Last 24h' : range === '7d' ? '7 days' : range === '30d' ? '30 days' : '90 days'}
                  </button>
                ))}
              </div>

              {/* Export Button */}
              <button className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:shadow-md ${isDark
                ? 'border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}>
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Charts Section */}
        <div className="mt-8 lg:grid-cols-3">
          {/* Sales Chart - Takes 2 columns */}
          <div className={`lg:col-span-2 rounded-2xl border p-6 ${isDark ? 'border-gray-700/50 bg-gray-800/50' : 'border-gray-200/60 bg-white'}`}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Sales Overview</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Revenue over time</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex h-3 w-3 rounded-full bg-emerald-500`} />
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Revenue</span>
                <span className={`ml-4 inline-flex h-3 w-3 rounded-full bg-blue-500`} />
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Orders</span>
              </div>
            </div>
            <ChartPlaceholder title="Sales Chart" type="line" />
          </div>

          {/* Order Status Distribution */}
          {/* <div className={`rounded-2xl border p-6 ${isDark ? 'border-gray-700/50 bg-gray-800/50' : 'border-gray-200/60 bg-white'}`}>
            <div className="mb-6">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Status</h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Distribution breakdown</p>
            </div>
            <ChartPlaceholder title="Status Distribution" type="pie" />


            <div className="mt-4 space-y-2">
              {[
                { label: 'Completed', value: '75%', color: 'bg-emerald-500' },
                { label: 'Pending', value: '18%', color: 'bg-amber-500' },
                { label: 'Cancelled', value: '7%', color: 'bg-red-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.label}</span>
                  </div>
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        {/* Secondary Section */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Orders */}
          <div className={`rounded-2xl border p-6 ${isDark ? 'border-gray-700/50 bg-gray-800/50' : 'border-gray-200/60 bg-white'}`}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Orders</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Latest transactions</p>
              </div>
              <button className={`rounded-lg p-2 transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <MoreHorizontal className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>
            <div className="space-y-1">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <RecentOrderRow 
                    key={order.id}
                    id={order.id} 
                    customer={order.customer} 
                    amount={order.amount} 
                    status={order.status} 
                    date={order.date} 
                  />
                ))
              ) : (
                <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {loadingStats ? 'Loading orders...' : 'No recent orders'}
                </p>
              )}
            </div>
            <button className={`mt-4 w-full rounded-lg border py-2.5 text-sm font-medium transition-colors ${isDark
              ? 'border-gray-700 text-gray-300 hover:bg-gray-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              View All Orders
            </button>
          </div>

          {/* Top Products */}
          <div className={`rounded-2xl border p-6 ${isDark ? 'border-gray-700/50 bg-gray-800/50' : 'border-gray-200/60 bg-white'}`}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Top Products</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Best performing items</p>
              </div>
              <button className={`rounded-lg p-2 transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                <MoreHorizontal className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>
            <div className="space-y-1">
              {products.length > 0 ? (
                products.map((product) => (
                  <TopProductRow 
                    key={product.id}
                    name={product.name} 
                    sales={product.sales} 
                    revenue={product.revenue} 
                    trend={product.trend} 
                  />
                ))
              ) : (
                <p className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {loadingStats ? 'Loading products...' : 'No top products'}
                </p>
              )}
            </div>
            <button className={`mt-4 w-full rounded-lg border py-2.5 text-sm font-medium transition-colors ${isDark
              ? 'border-gray-700 text-gray-300 hover:bg-gray-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              View All Products
            </button>
          </div>
        </div>

        {/* Performance Metrics */}
        {/* <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Conversion Rate', value: '3.24%', icon: Target, color: 'text-pink-500', bg: isDark ? 'bg-pink-500/20' : 'bg-pink-50' },
            { label: 'Active Customers', value: '892', icon: Users, color: 'text-cyan-500', bg: isDark ? 'bg-cyan-500/20' : 'bg-cyan-50' },
            { label: 'Avg Session', value: '4m 32s', icon: Activity, color: 'text-indigo-500', bg: isDark ? 'bg-indigo-500/20' : 'bg-indigo-50' },
            { label: 'Bounce Rate', value: '42.8%', icon: TrendingUp, color: 'text-orange-500', bg: isDark ? 'bg-orange-500/20' : 'bg-orange-50' }
          ].map((metric, index) => (
            <div key={index} className={`flex items-center gap-4 rounded-xl border p-4 ${isDark ? 'border-gray-700/50 bg-gray-800/50' : 'border-gray-200/60 bg-white'}`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${metric.bg}`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{metric.label}</p>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{metric.value}</p>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default Analytics;