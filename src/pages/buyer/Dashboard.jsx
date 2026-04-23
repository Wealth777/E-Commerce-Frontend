import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import apiClient from '../../api/apiClient';
import {
  ShoppingCart,
  Package,
  Heart,
  CreditCard,
  Search,
  Bell,
  Menu,
  Home,
  ShoppingBag,
  Settings,
  User,
  LogOut,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Eye,
  Edit,
  X,
  PhoneCall,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Loading from '../../components/layout/Loding';

const App = () => {
  const { user } = useSelector((state) => state.auth);
  const { isDark } = useTheme();
  const cartItems = useSelector((state) => state.cart.items || []);
  const cart = cartItems;
  // const wishlist = []; 
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

        setOrders(ordersRes.data?.data || ordersRes.data?.orders || []);
        setWishlist(wishlistRes.data?.data?.items || []);
        setActivities((activitiesRes.data?.data || []).slice(0, 3));
      } catch (error) {
        console.error('Failed to load dashboard data', error);
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
      bgLight: 'bg-blue-50',
      change: `+${cart.length} in cart`,
      changeType: 'positive',
    },
    {
      title: 'Active Orders',
      value: activeOrders,
      icon: Package,
      gradient: 'from-emerald-500 to-teal-500',
      bgLight: 'bg-emerald-50',
      change: `${activeOrders} in transit`,
      changeType: 'neutral',
    },
    {
      title: 'Total Spent',
      value: `₦${totalSpent.toLocaleString()}`,
      icon: CreditCard,
      gradient: 'from-orange-500 to-amber-500',
      bgLight: 'bg-orange-50',
      change: `+₦${totalSpent.toLocaleString()} spent`,
      changeType: 'positive',
    },
    {
      title: 'Wishlist',
      value: wishlist.length,
      icon: Heart,
      gradient: 'from-rose-500 to-pink-500',
      bgLight: 'bg-rose-50',
      change: `${wishlist.length} new items`,
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
      status: order.payment?.status || order.status,
      total: order.pricing?.total || order.total || 0,
      items: order.items?.length || 0,
      image: order.items?.[0]?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=60&h=60',
    }));

  const quickActions = [
    {
      title: 'Browse Products',
      description: 'Discover new items',
      icon: ShoppingBag,
      href: '/products',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'My Orders',
      description: 'Track your packages',
      icon: Package,
      href: '/buyer/orders',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Shopping Cart',
      description: `${cart.length} items waiting`,
      icon: ShoppingCart,
      href: '/cart',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      title: 'Wishlist',
      description: 'Saved for later',
      icon: Heart,
      href: '/buyer/wishlist',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700';
      case 'in transit':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'in transit':
        return <TrendingUp className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatAction = (action) => {
    switch (action) {
      case 'LOGIN':
        return 'Logged into account';
      case 'UPDATE_ACCOUNT':
        return 'Updated account details';
      case 'ADD_TO_CART':
        return 'Product added to cart';
      default:
        return action;
    }
  };

  return (
    <div className={`min-h-screen ${bgColor} flex`}>
      {/* Main Content */}
      <div className={`max-w-7xl mx-auto px-4 transition-all duration-300`}>
        <main className="p-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 rounded-2xl p-8 mb-8 text-white">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div>
                  <p className="text-white text-sm font-medium mb-1">Welcome back,</p>
                  <h1 className="text-3xl font-bold text-yellow-400 mb-2">{user?.identity?.fullName || user?.fullName}!</h1>
                  <p className="text-white">Discover amazing deals and manage your shopping experience</p>
                </div>
                <Link to="/products" className="flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <ShoppingBag className="w-5 h-5" />
                  Start Shopping
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>


          {/* Main Grid */}
          {loading ? (
            <div className={`${bgColor} flex items-center justify-center`}>
              <Loading text='Loading dashboard...' />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${cardBg} rounded-2xl p-6 border ${borderColor} hover:shadow-xl transition-all duration-300 group cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-emerald-600' : 'text-blue-600'
                    } bg-opacity-10 px-2 py-1 rounded-lg ${stat.changeType === 'positive' ? 'bg-emerald-50' : 'bg-blue-50'
                    }`}>
                    {stat.change}
                  </span>
                </div>
                <p className={`text-sm ${subTextColor} mb-1`}>{stat.title}</p>
                <p className={`text-2xl font-bold ${textColor}`}>{stat.value}</p>
              </div>
            );
          })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${textColor}`}>Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <a
                    key={index}
                    href={action.href}
                    className={`${cardBg} rounded-xl p-5 border ${borderColor} hover:shadow-lg hover:border-gray-600 transition-all duration-300 group flex items-center gap-4`}
                  >
                    <div className={`p-3 rounded-xl ${action.bg} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${action.color}`} />
                    </div>
                    <div>
                      <p className={`font-semibold ${textColor} transition-colors`}>{action.title}</p>
                      <p className={`text-sm ${subTextColor}`}>{action.description}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${subTextColor} ml-auto group-hover:translate-x-1 transition-all`} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Recent Orders */}
          <div className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${textColor}`}>Recent Orders</h2>
                <Link to={'/buyer/orders'} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {recentOrders.map((order, index) => (
                <div key={order.id || index} className={`p-6 ${hoverBg} transition-colors cursor-pointer`}>
                  <div className="flex items-center gap-4">
                    <img
                      src={order.image}
                      alt={order.id}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <Link to={`/buyer/orders/${order.rawId || order._id}`}>
                          <p className={`font-semibold ${textColor} hover:text-blue-500`}>{order.id}</p>
                        </Link>
                        <p className={`font-bold ${textColor}`}>{order.total?.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <p className={`text-sm ${subTextColor}`}>{order.items} items</p>
                          <p className={`text-sm ${subTextColor}`}>•</p>
                          <p className={`text-sm ${subTextColor}`}>{order.date}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Preview */}
          {cart.length > 0 && (
            <div className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-bold ${textColor}`}>Shopping Cart ({cart.length})</h2>
                  <Link to={'/cart'} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View cart <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {cart.slice(0, 3).map((item, index) => (
                  <div key={item.id || index} className={`p-4 ${hoverBg} transition-colors`}>
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${textColor} truncate`}>{item.name}</p>
                        <p className={`text-sm ${subTextColor}`}>Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${textColor}`}>₦{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm text-black`}>Subtotal</p>
                    <p className={`text-lg font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-[22px] font-bold tracking-tight text-transparent`}>
                      ₦{cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
                    </p>
                  </div>
                  <Link to={'/checkout'} className="flex group/btn items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all">
                    <CheckCircle className="w-4 h-4 ml-2 group-hover/btn:scale-110 transition-transform" /> Checkout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Recent Activity */}
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
          </div>

          {/* Need Help */}
          <div className="bg-gradient-to-br from-green-600 to-yellow-500 rounded-2xl p-6 text-white">
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Need Help?</h3>
            <p className="text-blue-100 text-sm mb-4">
              Our customer support team is ready to assist you 24/7.
            </p>
            <Link to={'/contactus'} className="flex-1 group/btn inline-flex items-center justify-center gap-3 w-full py-2.5 bg-white text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors">
              <PhoneCall className="text-sm group-hover/btn:scale-110 transition-transform" /> Contact Support
            </Link>
          </div>
        </div>
      </div>
            </>
          )}
    </main>
      </div >
    </div >
  );
};

export default App;