import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Package,
  Activity,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import apiClient from '../../api/apiClient';
import { getMessage, getPayload } from '../../utils/apiResponse';
import { useToast } from '../../context/ToastContext';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  Area
} from "recharts";
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, change, isPositive, icon, color, darkColor }) => {
  const { isDark } = useTheme();
  return (
    <div className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl ${isDark
      ? 'border-gray-700/50 bg-gray-800/80 hover:bg-gray-800'
      : 'border-gray-200/60 bg-white hover:bg-gray-50/50'
      }`}>
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20 ${color}`} />
      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} ${darkColor} shadow-lg text-white`}>
            {icon}
          </div>
          {change && (
            <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium ${isPositive
              ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
              : isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600'
              }`}>
              {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {change}
            </div>
          )}
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

const RecentOrderRow = ({ id, customer, amount, date }) => {
  const { isDark } = useTheme();
  return (
    <div className={`flex items-center justify-between border-b py-4 last:border-0 ${isDark ? 'border-gray-700/50' : 'border-gray-100'}`}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <Package className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <div className="min-w-0">
          <p className={`truncate text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Order #{id.slice(-6)}</p>
          <p className={`truncate text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{customer?.username || 'Unknown Buyer'}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-right">
        <div className="hidden sm:block">
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>₦{amount.toLocaleString()}</p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{new Date(date).toLocaleDateString()}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-medium ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
          Paid
        </span>
      </div>
    </div>
  );
};

const TopProductRow = ({ name, sales, price, stock }) => {
  const { isDark } = useTheme();
  return (
    <div className={`flex items-center justify-between border-b py-4 last:border-0 ${isDark ? 'border-gray-700/50' : 'border-gray-100'}`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={`h-10 w-10 flex-shrink-0 rounded-lg ${isDark ? 'bg-violet-500/20' : 'bg-violet-50'} flex items-center justify-center`}>
          <Package className={`h-5 w-5 ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
        </div>
        <div className="min-w-0">
          <p className={`truncate text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{name}</p>
          <p className={`truncate text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{sales} sold • {stock} in stock</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>₦{price.toLocaleString()}</p>
      </div>
    </div>
  );
};

const Analytics = () => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const [dateRange, setDateRange] = useState('7days');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({ totalSales: 0, totalOrders: 0, avgOrderValue: 0 });
  const [salesOverview, setSalesOverview] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchVendorStats = async () => {
    try {
      setLoadingStats(true);
      const res = await apiClient.get(`/vendor/analytics?range=${dateRange}`);
      const payload = getPayload(res, {});
      setOrders(payload.recentOrders || []);
      setProducts(payload.topProducts || []);
      setSalesOverview(payload.salesOverview || []);
      setSummary(payload.summary || { totalSales: 0, totalOrders: 0, avgOrderValue: 0 });
    } catch (error) {
      showToast(getMessage(error, 'Failed to load dashboard stats'), 'error');
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchVendorStats();
  }, [dateRange]);

  const handleExportPDF = async (e) => {
    e.stopPropagation();
    try {
      const response = await apiClient.get(`/vendor/analytics/export/pdf?range=${dateRange}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-${dateRange}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      showToast(getMessage(error, 'Failed to export PDF'), 'error');
    }
  };

  const statCards = [
    {
      title: 'Total Sales',
      value: `₦${summary.totalSales.toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-emerald-500',
      darkColor: 'shadow-emerald-500/20'
    },
    {
      title: 'Paid Orders Only',
      value: summary.totalOrders,
      icon: <ShoppingBag className="h-6 w-6" />,
      color: 'bg-blue-500',
      darkColor: 'shadow-blue-500/20'
    },
    {
      title: 'Avg Order Value',
      value: `₦${summary.avgOrderValue.toLocaleString()}`,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-violet-500',
      darkColor: 'shadow-violet-500/20'
    }
  ];

  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-500';
  const textColorr = isDark ? 'text-white' : 'text-gray-900';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-gray-50/50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/vendor/dashboard" className={`flex items-center gap-2 text-sm mb-4 ${secondaryText} hover:${textColorr}`}>
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        {/* Responsive Header Section */}
        <div className={`sticky top-4 z-30 overflow-hidden rounded-2xl ${isDark ? 'bg-gradient-to-r from-green-600 via-green-500 to-yellow-500' : 'bg-gradient-to-r from-green-600 via-green-500 to-yellow-500'} p-1 mb-8 shadow-lg`}>
          <div className="relative bg-inherit rounded-[14px] px-6 py-8">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Analytics Dashboard</h1>
                <p className="mt-1 text-green-50">Track your performance and sales metrics</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Fixed Date Range Container */}
                <div className={`flex items-center rounded-xl border p-1 shadow-inner ${isDark ? 'border-white/10 bg-black/20' : 'border-black/5 bg-white/20'}`}>
                  {[
                    { label: '24h', value: '24h' },
                    { label: '7d', value: '7days' },
                    { label: '30d', value: '30days' },
                    { label: '90d', value: '90days' }
                  ].map((range) => (
                    <button
                      key={range.value}
                      onClick={(e) => {
                        e.preventDefault();
                        setDateRange(range.value);
                      }}
                      className={`relative z-40 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all ${dateRange === range.value
                        ? 'bg-white text-green-700 shadow-sm'
                        : 'text-white hover:bg-white/10'
                        }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleExportPDF}
                  className="z-40 flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-green-700 transition-all hover:bg-green-50 hover:shadow-lg active:scale-95"
                >
                  <Download className="h-4 w-4" /> Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {statCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Sales Chart */}
        <div className="mt-8">
          <div className={`rounded-2xl border p-4 sm:p-6 ${isDark ? 'border-gray-700/50 bg-gray-800/50' : 'border-gray-200/60 bg-white shadow-sm'}`}>
            <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Sales Overview</h3>
            <div className={`h-72 w-full rounded-xl p-2 sm:p-4 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              {salesOverview.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={100}>
                  <AreaChart data={salesOverview} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#e2e8f0"} />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1e293b' : '#fff',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        color: isDark ? '#fff' : '#000'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#22c55e"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorSales)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Activity className="h-8 w-8 text-gray-500 mb-2 opacity-20" />
                  <p className="text-gray-500 text-sm italic">No sales data found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lists Section */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Orders */}
          <div className={`rounded-2xl border p-6 ${isDark ? 'border-gray-700/50 bg-gray-800/50' : 'border-gray-200/60 bg-white shadow-sm'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Paid Orders</h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {loadingStats ? (
                <div className="flex justify-center py-8"><div className="animate-spin h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full" /></div>
              ) : orders.length > 0 ? (
                orders.map((order) => <RecentOrderRow key={order._id} id={order._id} customer={order.buyer} amount={order.pricing?.total || 0} date={order.createdAt} />)
              ) : (
                <p className="text-center py-8 text-gray-500">No orders found</p>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className={`rounded-2xl border p-6 ${isDark ? 'border-gray-700/50 bg-gray-800/50' : 'border-gray-200/60 bg-white shadow-sm'}`}>
            <div className="p-5 border-b ${borderColor} flex items-center justify-between">
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Top Products</h3>
              <Link to='/vendor/products' className="text-sm font-semibold text-green-600 flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {loadingStats ? (
                <div className="flex justify-center py-8"><div className="animate-spin h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full" /></div>
              ) : products.length > 0 ? (
                products.map((product) => <TopProductRow key={product._id} name={product.name} sales={product.sold} price={product.price} stock={product.stock} />)
              ) : (
                <p className="text-center py-8 text-gray-500">No products found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;