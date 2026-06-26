import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import apiClient from '../../api/apiClient';
import { getCartItems, getList, getMessage } from '../../utils/apiResponse';
import {
  ShoppingCart,
  Package,
  Heart,
  CreditCard,
  ShoppingBag,
  ChevronRight,
  Clock,
  CheckCircle,
  ArrowRight,
  PhoneCall,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Loading from '../../components/layout/Loading';
import { useToast } from '../../context/ToastContext';
import { FaShippingFast, FaWallet } from 'react-icons/fa';

const App = () => {
  const { user } = useSelector((state) => state.auth);
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const cartItems = useSelector((state) => state.cart.items || []);
  const cart = cartItems;
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activity, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, wishlistRes, activitiesRes] = await Promise.all([
          apiClient.get('/buyer/orders'),
          apiClient.get('/buyer/wishlist'),
          apiClient.get('/buyer/activity'),
        ]);

        setOrders(getList(ordersRes, ['orders']));
        setWishlist(getCartItems(wishlistRes));
        setActivities(getList(activitiesRes, ['activity', 'activities']).slice(0, 3));
      } catch (error) {
        showToast(getMessage(error, 'Failed to load dashboard data'), 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-100';
  const hoverBg = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  const totalSpent = (orders || []).reduce((sum, order) => {
    return sum + (order.pricing?.total || 0);
  }, 0);

  const activeOrders = (orders || []).filter(order => {
    const status = (order.payment?.status || order.status || '').toLowerCase();
    return ['pending', 'processing', 'in transit', 'shipped'].includes(status);
  }).length;

  const stats = [
    {
      title: 'Cart Items',
      value: cart.length,
      icon: ShoppingCart,
      gradient: 'from-blue-500 to-cyan-500',
      change: `+${cart.length} in cart`,
      changeType: 'positive',
    },
    {
      title: 'Active Orders',
      value: activeOrders,
      icon: Package,
      gradient: 'from-emerald-500 to-teal-500',
      change: `${activeOrders} in transit`,
      changeType: 'neutral',
    },
    {
      title: 'Total Spent',
      value: `₦${totalSpent.toLocaleString()}`,
      icon: CreditCard,
      gradient: 'from-orange-500 to-amber-500',
      change: `+₦${totalSpent.toLocaleString()}`,
      changeType: 'positive',
    },
    {
      title: 'Wishlist',
      value: wishlist.length,
      icon: Heart,
      gradient: 'from-rose-500 to-pink-500',
      change: `${wishlist.length} items`,
      changeType: 'positive',
    },
  ];

  const formatOrderRef = (id) => {
    if (!id) return 'UNKNOWN';
    return `#${id.toString().slice(-8).toUpperCase()}`;
  };

  const recentOrders = (orders || [])
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)
    .map(order => ({
      id: formatOrderRef(order._id),
      rawId: order._id,
      date: new Date(order.createdAt).toLocaleDateString(),
      paymentStatus: order.payment?.status || "pending",
      deliveryStatus: order.status || "pending",
      total: order.pricing?.total || order.total || 0,
      items: order.items?.length || 0,
      image: order.items?.[0]?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=60&h=60',
    }));

  const quickActions = [
    { title: 'Browse Products', description: 'Discover new items', icon: ShoppingBag, href: '/products', color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'My Orders', description: 'Track packages', icon: Package, href: '/buyer/orders', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Shopping Cart', description: `${cart.length} items`, icon: ShoppingCart, href: '/cart', color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Wishlist', description: 'Saved for later', icon: Heart, href: '/buyer/wishlist', color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const getPaymentStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "paid": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "failed": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  const getDeliveryStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "shipped": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  const formatAction = (action) => {
    const actions = { LOGIN: 'Logged into account', UPDATE_ACCOUNT: 'Updated account details', ADD_TO_CART: 'Product added to cart' };
    return actions[action] || action;
  };

  return (
    <div className={`min-h-screen ${bgColor} flex flex-col`}>
      <div className="w-full max-w-7xl mx-auto transition-all duration-300">
        <main className="p-4 md:p-8">
          {/* Hero Banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 rounded-2xl p-6 md:p-10 mb-8 text-white">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-white text-sm font-medium mb-1 uppercase tracking-wider">Welcome back,</p>
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
                  {user?.identity?.fullName || user?.fullName || 'User'}!
                </h1>
                <p className="text-black text-sm md:text-base opacity-90">
                  Manage your vendor dashboard and track your sales performance in real-time.
                </p>
              </div>
              <Link to="/products" className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-all shadow-lg active:scale-95 self-start lg:self-center">
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loading text='Loading dashboard...' />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className={`${cardBg} rounded-2xl p-5 border ${borderColor} hover:shadow-md transition-all group`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-sm group-hover:scale-105 transition-transform`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md bg-opacity-10 ${stat.changeType === 'positive' ? 'text-emerald-600 bg-emerald-600' : 'text-blue-600 bg-blue-600'}`}>
                          {stat.change}
                        </span>
                      </div>
                      <p className={`text-xs uppercase tracking-wider font-semibold ${subTextColor} mb-1`}>{stat.title}</p>
                      <p className={`text-2xl font-bold ${textColor}`}>{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Actions & Orders */}
                <div className="lg:col-span-2 space-y-8">
                  <section>
                    <h2 className={`text-xl font-bold ${textColor} mb-6`}>Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                          <a key={index} href={action.href} className={`${cardBg} rounded-xl p-4 border ${borderColor} hover:border-green-500 transition-all flex items-center gap-4 group`}>
                            <div className={`p-3 rounded-xl ${action.bg} shrink-0`}>
                              <Icon className={`w-6 h-6 ${action.color}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`font-bold ${textColor} truncate`}>{action.title}</p>
                              <p className={`text-xs ${subTextColor} truncate`}>{action.description}</p>
                            </div>
                            <ChevronRight className={`w-5 h-5 ${subTextColor} shrink-0 group-hover:translate-x-1 transition-transform`} />
                          </a>
                        );
                      })}
                    </div>
                  </section>

                  {/* Recent Orders Section */}
                  <section className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden shadow-sm`}>
                    <div className="p-5 border-b ${borderColor} flex items-center justify-between">
                      <h2 className={`text-lg font-bold ${textColor}`}>Recent Orders</h2>
                      <Link to='/buyer/orders' className="text-sm font-semibold text-green-600 flex items-center gap-1">
                        View All <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {recentOrders.map((order, index) => (
                        <div key={order.id || index} className={`p-4 md:p-6 ${hoverBg} transition-colors`}>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <img src={order.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                <Link to={`/buyer/orders/${order.rawId}`}>
                                  <p className={`font-bold ${textColor} hover:text-green-600 truncate`}>{order.id}</p>
                                </Link>
                                <p className={`font-bold ${textColor}`}>₦{order.total?.toLocaleString()}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                                <span className={`text-xs ${subTextColor}`}>{order.items} items • {order.date}</span>
                                <div className="flex flex-wrap gap-2">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getPaymentStyle(order.paymentStatus)}`}>
                                    <FaWallet className="inline mr-1 mb-0.5" /> {order.paymentStatus}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getDeliveryStyle(order.deliveryStatus)}`}>
                                    <FaShippingFast className="inline mr-1 mb-0.5" /> {order.deliveryStatus}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right Column: Activity & Support */}
                <div className="space-y-6">
                  <section>
                    <h3 className={`text-lg font-bold ${textColor} mb-4`}>Recent Activity</h3>
                    <div className={`${cardBg} border ${borderColor} rounded-2xl p-5 shadow-sm`}>
                      {activity?.length > 0 ? (
                        <div className="space-y-4">
                          {activity.map((item, index) => (
                            <div key={item._id || index} className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-xl p-4 border ${borderColor}`}>
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <p className={`text-sm font-bold ${textColor}`}>{formatAction(item.action)}</p>
                                <span className={`text-[10px] uppercase font-medium ${subTextColor}`}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</span>
                              </div>
                              <p className={`text-xs ${subTextColor}`}>{item.entity || 'System update'}</p>
                              {item.metadata && (
                                <div className="mt-2 p-2 bg-black/5 rounded text-[10px] font-mono break-all opacity-60">
                                  {JSON.stringify(item.metadata)}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <Clock className={`w-10 h-10 ${subTextColor} mx-auto mb-3 opacity-20`} />
                          <p className={`text-sm ${subTextColor}`}>No activity recorded yet.</p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Help Card */}
                  <div className="bg-gradient-to-br from-green-700 to-green-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold mb-2">Need assistance?</h3>
                      <p className="text-sm text-green-50 mb-6">Our dedicated vendor support team is available 24/7 to help you.</p>
                      <Link to='/contactus' className="flex items-center justify-center gap-2 w-full py-3 bg-white text-green-700 font-bold rounded-xl hover:bg-yellow-400 hover:text-green-900 transition-all">
                        <PhoneCall className="w-4 h-4" /> Contact Support
                      </Link>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;