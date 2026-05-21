import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/apiClient';
import { getList, getMessage, getPayload } from '../../utils/apiResponse';
import { FaBox, FaChevronRight, FaRegCalendarAlt, FaWallet, FaUser, FaShippingFast, FaCheckCircle, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import Loading from '../../components/layout/Loding';

const VendorOrders = () => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/vendor/orders');

      setOrders(getList(response, ['orders']));
    } catch (error) {
      showToast(getMessage(error, 'Failed to load sales orders'), 'error');
    } finally {
      setLoading(false);
    }
  };

  // Theme Styles
  const bgColor = isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900';
  const cardBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-500';
  const textColorr = isDark ? 'text-white' : 'text-gray-900';


  const getPaymentStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  const getDeliveryStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "shipped":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "confirmed":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  return (
    <div className={`min-h-screen ${bgColor} py-10 transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto px-4">
        <Link to="/vendor/dashboard" className={`flex items-center gap-2 text-sm mb-4 ${secondaryText} hover:${textColorr}`}>
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        {/* Header Section */}
        <div className="mb-10 relative overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Sales Management</h1>
          <p className="opacity-90 text-black">Track your store sales and manage customer fulfillments.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Total Revenue</p>
              <p className={`text-xl font-black ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                ₦{orders.reduce((acc, curr) => acc + (curr.pricing?.total || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Incoming Orders</p>
              <p className={`text-xl font-black ${textColor}`}>{orders.length}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loading text='Fetching your sales data...' />
          </div>
        ) : orders.length === 0 ? (
          <div className={`${cardBg} border-2 border-dashed rounded-[2.5rem] p-16 text-center shadow-sm`}>
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBox size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No sales yet</h2>
            <p className={`${secondaryText} max-w-xs mx-auto mb-8`}>Your store orders will appear here once customers start buying.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className={`${cardBg} border rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-300 group`}
              >
                {/* Order Top Bar */}
                <div className="px-6 py-4 border-b border-inherit flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <FaUser className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Customer</p>
                      <p className="font-bold text-sm">{order.buyer?.username || 'Guest User'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="hidden sm:block text-right">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Ordered On</p>
                      <p className="text-sm font-semibold flex items-center gap-1">
                        <FaRegCalendarAlt size={12} className="text-gray-400" />
                        {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    {/* <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase border flex items-center gap-2 ${getStatusStyle(order.payment?.status)}`}>
                      {getStatusIcon(order.payment?.status)}
                      {order.payment?.status || 'Pending'}
                    </div> */}

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Payment Status */}
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getPaymentStyle(order.payment?.status)}`}>
                        <FaWallet className="inline mr-1" /> {order.payment?.status}
                      </div>

                      {/* Delivery Status */}

                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getDeliveryStyle(order.status)}`}>
                        <FaShippingFast className="inline mr-1" /> {order.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">

                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        {/* Product Image Thumbnails */}
                        <div className="flex -space-x-2">
                          {order.items?.slice(0, 3).map((item, i) => (
                            <div key={i} className={`w-12 h-12 rounded-xl border-2 ${isDark ? 'border-gray-900 bg-gray-800' : 'border-white bg-gray-100'} flex items-center justify-center overflow-hidden`}>
                              {item.image ? (
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <FaBox className="text-gray-400" size={14} />
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold ${textColor}`}>
                            {order.items?.[0]?.name} {order.items?.length > 1 && `(+${order.items.length - 1} more)`}
                          </p>
                          <p className={`text-sm ${secondaryText}`}>
                            Qty: {order.items?.reduce((a, b) => a + b.quantity, 0)} • {order.delivery?.method} Shipping
                          </p>
                        </div>
                      </div>

                      {/* Shipping Address Summary */}
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Shipping To</p>
                        <p className="text-xs truncate">{order.delivery?.address}, {order.delivery?.state}</p>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between lg:justify-end gap-8 lg:flex-col lg:items-end lg:gap-4">
                      <div className="text-left lg:text-right">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Earnings</p>
                        <p className="text-2xl font-black text-green-600">₦{order.pricing?.total?.toLocaleString()}</p>
                      </div>
                      <Link
                        to={`/vendor/orders/${order._id}`}
                        className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-yellow-50 hover:bg-yellow-100'} transition-all text-green-600 shadow-sm`}
                      >
                        <FaChevronRight />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Progress bar based on status */}
                <div className="h-1 w-full bg-gray-200 dark:bg-gray-800">
                  <div
                    className={`h-full transition-all duration-700 ${order.status === 'delivered' ? 'w-full bg-emerald-500' :
                      order.status === 'shipped' ? 'w-2/3 bg-blue-500' : 'w-1/3 bg-amber-500'
                      }`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOrders;