import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/apiClient';
import { FaBox, FaChevronRight, FaRegCalendarAlt, FaWallet, FaShippingFast, FaCheckCircle, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import Loading from '../../components/layout/Loding';

const Orders = () => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const [groupedOrders, setGroupedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/buyer/orders');
      const rawOrders = response.data?.data || response.data?.orders || [];

      const groups = rawOrders.reduce((acc, order) => {
        const ref = order.checkoutRef || order._id;
        if (!acc[ref]) {
          acc[ref] = {
            _id: ref,
            createdAt: order.createdAt,
            paymentStatus: order.payment?.status || "pending",
            deliveryStatus: order.status || "pending",
            delivery: order.delivery,
            payment: order.payment,
            items: [],
            note: order.note,
            totalAmount: 0,
            subtotal: 0,
            deliveryFee: 0,
            tax: 0,
            orderIds: []
          };
        }


        acc[ref].items.push(...order.items);
        acc[ref].totalAmount += (order.pricing?.total || 0);
        acc[ref].subtotal += (order.pricing?.subtotal || 0);
        acc[ref].deliveryFee += (order.pricing?.deliveryFee || 0);
        acc[ref].tax += (order.pricing?.tax || 0);
        acc[ref].orderIds.push(order._id);

        return acc;
      }, {});

      const sortedGroups = Object.values(groups).sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setGroupedOrders(sortedGroups);
    } catch (error) {
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const bgColor = isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900';
  const cardBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-500';

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

        <div className="mb-10 relative overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 rounded-2xl p-8 mb-8 text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-white">My Orders</h1>
          <p className={`text-black`}>Track, manage and view your purchase history.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Total Spent</p>
              <p className={`text-xl font-black ${isDark ? 'text-green-400' : 'text-green-600'}`}>₦{groupedOrders.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}</p>
            </div>
            <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Total Orders</p>
              <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-black'}`}>{groupedOrders.length}</p>
            </div>
          </div>
        </div>


        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loading text='Retrieving your orders...' />
          </div>
        ) : groupedOrders.length === 0 ? (
          <div className={`${cardBg} border-2 border-dashed rounded-[2.5rem] p-16 text-center shadow-sm`}>
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBox size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No orders found</h2>
            <p className={`${secondaryText} max-w-xs mx-auto mb-8`}>Looks like you haven't made any purchases yet.</p>
            <Link to={'/products'}>
              <button className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 shadow-green-600/20">
                <ShoppingBag className='transition-transform' /> Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedOrders.map((order) => (
              <div
                key={order._id}
                className={`${cardBg} border rounded-[2rem] overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group`}
              >
                {/* Order Top Bar */}
                <div className="px-6 py-4 border-b border-inherit flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <FaBox className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Order Ref</p>
                      <p className="font-bold text-sm">#{order._id?.toString().slice(-8).toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="hidden sm:block text-right">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Order Date</p>
                      <p className="text-sm font-semibold flex items-center gap-1">
                        <FaRegCalendarAlt size={12} className="text-gray-400" />
                        {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Payment Status */}
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getPaymentStyle(order.paymentStatus)}`}> <FaWallet className="inline mr-1" /> {order.paymentStatus} </div>

                      {/* Delivery Status */}
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getDeliveryStyle(order.deliveryStatus)}`}> <FaShippingFast className="inline mr-1" />
                        {order.deliveryStatus}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">

                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-3">
                        <div className="flex -space-x-2 overflow-hidden">
                          {order.items?.slice(0, 3).map((item, i) => (
                            <div key={i} className={`w-12 h-12 rounded-xl border-2 ${isDark ? 'border-gray-900 bg-gray-800' : 'border-white bg-gray-100'} flex items-center justify-center overflow-hidden`}>
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <FaBox className="text-gray-400" size={14} />
                              )}
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <div className={`w-12 h-12 rounded-xl border-2 ${isDark ? 'border-gray-900 bg-gray-800' : 'border-white bg-gray-100'} flex items-center justify-center`}>
                              <span className="text-xs font-bold text-gray-500">+{order.items.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold ${textColor} truncate`}>
                            {order.items?.[0]?.name || 'Product'}
                            {order.items?.length > 1 && ` + ${order.items.length - 1} more item${order.items.length - 1 > 1 ? 's' : ''}`}
                          </p>
                          <p className={`text-sm ${secondaryText}`}>
                            {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'} • {order.items?.[0]?.vendorName || "Vendor"}

                          </p>
                        </div>
                      </div>

                      {/* Delivery & Payment Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="font-semibold text-gray-500 uppercase tracking-tighter mb-1">Delivery</p>
                          <p className={`${textColor} capitalize`}>{order.delivery?.method || 'Standard'} to {order.delivery?.state || 'State'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-500 uppercase tracking-tighter mb-1">Payment</p>
                          <p className={`${textColor} capitalize`}>{order.payment?.method} • {order.paymentStatus}</p>
                        </div>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between lg:justify-end gap-8 lg:flex-col lg:items-end lg:gap-4">
                      <div className="text-left lg:text-right">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Amount Paid</p>
                        <p className="text-2xl font-black text-green-600">₦{order.totalAmount?.toLocaleString()}</p>
                        {order.pricing?.subtotal !== order.pricing?.total && (
                          <p className="text-xs text-gray-500">
                            Subtotal: ₦{order.pricing?.subtotal?.toLocaleString()}
                            {order.pricing?.deliveryFee > 0 && ` + Delivery: ₦${order.pricing?.deliveryFee?.toLocaleString()}`}
                            {order.pricing?.tax > 0 && ` + Tax: ₦${order.pricing?.tax?.toLocaleString()}`}
                          </p>
                        )}
                      </div>
                      <Link to={`/buyer/orders/${order._id}`} className={`p-4 rounded-2xl ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-all group-hover:scale-105 active:scale-95 text-green-600 shadow-sm`}>
                        <FaChevronRight />
                      </Link>
                    </div>

                  </div>
                </div>

                {/* Bottom Progress Bar (Visual Only for "Cool" factor) */}
                <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800">
                  <div 
                    className={`h-full transition-all duration-1000 ${ order.deliveryStatus === 'delivered' ? 'w-full bg-emerald-500' : order.deliveryStatus === 'shipped' ? 'w-2/3 bg-blue-500' : 'w-1/3 bg-amber-500' }`
                    } 
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

export default Orders;