import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/apiClient';
import { getMessage } from '../../utils/apiResponse';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  CreditCard,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Calendar,
  User,
  Store,
  MapPin,
  FileText,
  DollarSign,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  X
} from 'lucide-react';
import Loading from '../../components/layout/Loding';

export default function OrdersManagement() {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Filters & Pagination State
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Data States
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [stats, setStats] = useState({
    orders: { total: 0, pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 },
    payments: { pending: 0, paid: 0, failed: 0 },
    disputes: { refundRequests: 0, returnRequests: 0 },
    activity: { today: 0, thisMonth: 0 },
  });

  // Modal State
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);

  // Fetch Stats Data
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await apiClient.get('/founder/orders/stats');
      const data = res.data?.data || res.data || {};
      setStats({
        orders: data.orders || { total: 0, pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 },
        payments: data.payments || { pending: 0, paid: 0, failed: 0 },
        disputes: data.disputes || { refundRequests: 0, returnRequests: 0 },
        activity: data.activity || { today: 0, thisMonth: 0 },
      });
    } catch (err) {
      showToast(getMessage(err, 'Failed to retrieve order statistics'), 'error');
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch Orders List
  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const params = {
        page,
        limit,
      };
      if (activeTab !== 'All') params.status = activeTab.toLowerCase();
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await apiClient.get('/founder/orders', { params });
      const data = res.data?.data || res.data || {};

      setOrders(data.orders || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      showToast(getMessage(err, 'Failed to fetch orders list'), 'error');
    } finally {
      setLoadingOrders(false);
    }
  }, [page, activeTab, searchQuery, showToast]);

  // Fetch Order Details for Modal
  const fetchOrderDetails = async (orderId) => {
    setSelectedOrderId(orderId);
    setLoadingModal(true);
    try {
      const res = await apiClient.get(`/founder/orders/${orderId}`);
      const data = res.data?.data || res.data || res;
      setModalData(data.order || data);
    } catch (err) {
      showToast(getMessage(err, 'Failed to load order details'), 'error');
      setSelectedOrderId(null);
    } finally {
      setLoadingModal(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Badge Status Renderer
  const renderStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const config = {
      pending: { label: 'Pending', icon: Clock, style: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      confirmed: { label: 'Confirmed', icon: CheckCircle2, style: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
      shipped: { label: 'Shipped', icon: Truck, style: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
      delivered: { label: 'Delivered', icon: PackageCheck, style: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
      cancelled: { label: 'Cancelled', icon: XCircle, style: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
    };

    const current = config[statusLower] || { label: status, icon: Clock, style: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
    const Icon = current.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${current.style}`}>
        <Icon className="w-3.5 h-3.5" />
        {current.label}
      </span>
    );
  };

  // Payment Status Badge Renderer
  const renderPaymentBadge = (status, method) => {
    const statusLower = status?.toLowerCase();
    const isPaid = statusLower === 'paid';
    const isFailed = statusLower === 'failed';

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
        isPaid
          ? 'bg-emerald-500/10 text-emerald-500'
          : isFailed
          ? 'bg-rose-500/10 text-rose-500'
          : 'bg-amber-500/10 text-amber-500'
      }`}>
        <CreditCard className="w-3 h-3" />
        {method === 'pod' ? 'POD' : 'PAY NOW'} · {status}
      </span>
    );
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors ${isDark ? 'bg-gray-900 text-slate-100' : 'bg-[#F8FAFC] text-slate-800'}`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className={`group inline-flex items-center gap-2 text-xs font-medium transition-colors mb-2 rounded-full px-3 py-1.5 ${
                isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-white hover:bg-slate-100 text-slate-600 ring-1 ring-slate-200'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Order Management
            </h1>
            <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'} mt-1`}>
              Track customer orders, payment verification, delivery states, and dispute resolution.
            </p>
          </div>

          <button
            onClick={() => {
              fetchStats();
              fetchOrders();
            }}
            disabled={loadingOrders || loadingStats}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl border flex items-center gap-2 transition-all shadow-sm ${
              isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders || loadingStats ? 'animate-spin' : ''}`} />
            <span>Refresh Overview</span>
          </button>
        </div>

        {/* Dynamic Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Orders & Status Breakdown */}
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-slate-200'} shadow-sm space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Volume</span>
              <div className={`p-2 rounded-xl ${isDark ? 'bg-emerald-950/60 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.orders.total}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Orders recorded in system</p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-gray-700/60 grid grid-cols-3 gap-1 text-[11px] text-center">
              <div>
                <span className="block font-bold text-amber-500">{stats.orders.pending}</span>
                <span className="text-slate-400">Pending</span>
              </div>
              <div>
                <span className="block font-bold text-indigo-500">{stats.orders.shipped}</span>
                <span className="text-slate-400">Shipped</span>
              </div>
              <div>
                <span className="block font-bold text-emerald-500">{stats.orders.delivered}</span>
                <span className="text-slate-400">Delivered</span>
              </div>
            </div>
          </div>

          {/* Payments Tracker */}
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-slate-200'} shadow-sm space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Payments Status</span>
              <div className={`p-2 rounded-xl ${isDark ? 'bg-blue-950/60 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.payments.paid}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Successful transactions</p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-gray-700/60 grid grid-cols-2 gap-1 text-[11px] text-center">
              <div>
                <span className="block font-bold text-amber-500">{stats.payments.pending}</span>
                <span className="text-slate-400">Unpaid/Pending</span>
              </div>
              <div>
                <span className="block font-bold text-rose-500">{stats.payments.failed}</span>
                <span className="text-slate-400">Failed</span>
              </div>
            </div>
          </div>

          {/* Active Disputes */}
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-rose-950/10 border-rose-900/30' : 'bg-rose-50/40 border-rose-200/60'} shadow-sm space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Disputes & Returns</span>
              <div className={`p-2 rounded-xl ${isDark ? 'bg-rose-900/50 text-rose-400' : 'bg-rose-100 text-rose-600'}`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className={`text-2xl font-black ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>
                {stats.disputes.refundRequests + stats.disputes.returnRequests}
              </p>
              <p className="text-[11px] text-rose-500/80 mt-0.5">Items requiring resolution</p>
            </div>
            <div className="pt-2 border-t border-rose-100 dark:border-rose-900/40 grid grid-cols-2 gap-1 text-[11px] text-center">
              <div>
                <span className="block font-bold text-rose-500">{stats.disputes.refundRequests}</span>
                <span className="text-slate-400">Refund Claims</span>
              </div>
              <div>
                <span className="block font-bold text-amber-500">{stats.disputes.returnRequests}</span>
                <span className="text-slate-400">Return Claims</span>
              </div>
            </div>
          </div>

          {/* Activity Snapshot */}
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-slate-200'} shadow-sm space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Activity Pulse</span>
              <div className={`p-2 rounded-xl ${isDark ? 'bg-indigo-950/60 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.activity.today}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Orders placed today</p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-gray-700/60 flex justify-between text-[11px] px-1">
              <span className="text-slate-400">This Month:</span>
              <span className="font-bold text-emerald-500">{stats.activity.thisMonth} orders</span>
            </div>
          </div>
        </div>

        {/* Main Orders Table & Controls Container */}
        <div className={`rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} shadow-sm overflow-hidden`}>

          {/* Filter & Search Bar */}
          <div className="p-4 md:p-6 border-b border-slate-200 dark:border-gray-700 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search code, buyer, vendor..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border outline-none transition-all ${
                    isDark
                      ? 'bg-gray-900 border-gray-700 text-white focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-600 focus:bg-white'
                  }`}
                />
              </div>

              {/* Status Tab Navigation */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1 sm:pb-0">
                {['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setPage(1);
                    }}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-[#064E3B] text-white shadow-sm'
                        : isDark
                        ? 'bg-gray-900/60 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table Data */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-700 bg-gray-900/40 text-gray-400' : 'border-slate-100 bg-slate-50/50 text-slate-400'} text-[11px] font-bold uppercase tracking-wider`}>
                  <th className="py-3.5 px-6">Order Ref / Code</th>
                  <th className="py-3.5 px-6">Items Purchased</th>
                  <th className="py-3.5 px-6">Pricing & Payment</th>
                  <th className="py-3.5 px-6">Delivery Target</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-700/60 text-xs">
                {loadingOrders ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      <Loading text='Loading catalog orders...' />
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      <ShoppingBag className="w-8 h-8 opacity-40 mx-auto mb-2" />
                      No orders found matching the filter selection.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id || order.id} className={`hover:${isDark ? 'bg-gray-700/30' : 'bg-slate-50/80'} transition-colors`}>
                      {/* Code & Buyer Info */}
                      <td className="py-4 px-6">
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs block">
                          #{order.code || order._id?.substring(0, 8).toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                          <User className="w-3 h-3" />
                          <span>Buyer ID: {typeof order.buyer === 'object' ? order.buyer?.serialNumber : order.buyer?.serialNumber || 'N/A'}</span>
                          {/* <span>Buyer ID: {typeof order.buyer === 'object' ? order.buyer?._id?.substring(0, 8) : order.buyer?.substring(0, 8) || 'N/A'}</span> */}
                        </div>
                      </td>

                      {/* Items Summary */}
                      <td className="py-4 px-6">
                        <div className="space-y-1 max-w-xs">
                          {order.items && order.items.length > 0 ? (
                            <>
                              <p className={`font-semibold line-clamp-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {order.items[0]?.name || 'Item Name Unspecified'}
                              </p>
                              {order.items.length > 1 && (
                                <p className="text-[10px] text-slate-400">
                                  + {order.items.length - 1} additional item(s)
                                </p>
                              )}
                            </>
                          ) : (
                            <span className="text-slate-400 text-xs">No items listed</span>
                          )}
                        </div>
                      </td>

                      {/* Pricing & Payment Status */}
                      <td className="py-4 px-6">
                        <p className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                          ₦{Number(order.pricing?.total || 0).toLocaleString()}
                        </p>
                        <div className="mt-1">
                          {renderPaymentBadge(order.payment?.status, order.payment?.method)}
                        </div>
                      </td>

                      {/* Delivery Address */}
                      <td className="py-4 px-6">
                        <div className="text-slate-500 dark:text-gray-300 font-medium line-clamp-1">
                          {order.delivery?.address || 'Pickup / Undefined'}
                        </div>
                        <p className="text-[11px] text-slate-400">{order.delivery?.state || 'Campus Area'}</p>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {renderStatusBadge(order.status)}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => fetchOrderDetails(order._id || order.id)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                            isDark
                              ? 'border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-200'
                              : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer & Pagination */}
          <div className="p-4 border-t border-slate-100 dark:border-gray-700/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <span>
              Showing Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages || 1}</strong> ({pagination.total} orders)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPreviousPage || loadingOrders}
                className={`p-1.5 rounded-lg border transition-colors ${
                  pagination.hasPreviousPage && !loadingOrders
                    ? isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    : 'opacity-40 cursor-not-allowed border-transparent'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-semibold text-slate-600 dark:text-slate-300 px-2">
                {pagination.page}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNextPage || loadingOrders}
                className={`p-1.5 rounded-lg border transition-colors ${
                  pagination.hasNextPage && !loadingOrders
                    ? isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    : 'opacity-40 cursor-not-allowed border-transparent'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {(selectedOrderId || loadingModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-3xl max-h-[90vh] rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${
            isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-base">
                  Order Specs #{modalData?.code || selectedOrderId?.substring(0, 8).toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedOrderId(null);
                  setModalData(null);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-slate-100 text-slate-500'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {loadingModal || !modalData ? (
                <div className="py-16 text-center text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-500" />
                  Fetching order records...
                </div>
              ) : (
                <>
                  {/* Primary Banner Status */}
                  <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
                    isDark ? 'bg-gray-900/60 border-gray-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Current Status</span>
                      <div className="mt-1">{renderStatusBadge(modalData.status)}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Payment Verification</span>
                      <div className="mt-1">{renderPaymentBadge(modalData.payment?.status, modalData.payment?.method)}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Amount</span>
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 block mt-0.5">
                        ₦{Number(modalData.pricing?.total || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Buyer & Vendor Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900/40 border-gray-700' : 'bg-slate-50/50 border-slate-200'}`}>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-emerald-500" /> Buyer Record
                      </h4>
                      <p className="text-xs font-semibold">{typeof modalData.buyer === 'object' ? modalData.buyer?.name || modalData.buyer?.email : 'Buyer ID: ' + modalData.buyer}</p>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {modalData.delivery?.address}, {modalData.delivery?.state}
                      </p>
                    </div>

                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900/40 border-gray-700' : 'bg-slate-50/50 border-slate-200'}`}>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-emerald-500" /> Vendor Record
                      </h4>
                      <p className="text-xs font-semibold">{typeof modalData.vendor === 'object' ? modalData.vendor?.storeName || modalData.vendor?.name : 'Vendor ID: ' + modalData.vendor}</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Delivery Method: <span className="uppercase font-bold text-emerald-500">{modalData.delivery?.method || 'Standard'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Purchased Items List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Purchased Items ({modalData.items?.length || 0})</h4>
                    <div className="divide-y divide-slate-100 dark:divide-gray-700/60 border rounded-xl overflow-hidden">
                      {modalData.items?.map((item, idx) => (
                        <div key={idx} className="p-3.5 flex items-center justify-between gap-3 bg-slate-50/30 dark:bg-gray-900/20">
                          <div className="flex items-center gap-3">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg border bg-slate-200 dark:bg-gray-700 flex items-center justify-center text-slate-400">
                                <ShoppingBag className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-bold">{item.name}</p>
                              <p className="text-[11px] text-slate-400">
                                Vendor: {item.vendorName || 'N/A'} · Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            ₦{Number(item.price || 0).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className={`p-4 rounded-xl border space-y-2 text-xs ${isDark ? 'bg-gray-900/40 border-gray-700' : 'bg-slate-50/50 border-slate-200'}`}>
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal</span>
                      <span>₦{Number(modalData.pricing?.subtotal || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Delivery Fee</span>
                      <span>₦{Number(modalData.pricing?.deliveryFee || 0).toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-gray-700 flex justify-between font-bold text-sm">
                      <span>Total</span>
                      <span className="text-emerald-500">₦{Number(modalData.pricing?.total || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Payment Proofs (if any) */}
                  {modalData.payment?.proofs && modalData.payment.proofs.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Proof Attached</h4>
                      <div className="flex gap-2 overflow-x-auto">
                        {modalData.payment.proofs.map((proof, i) => (
                          <a
                            key={i}
                            href={proof.file}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-700 text-xs text-blue-500 hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            View Proof #{i + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Refund Request Block (if triggered) */}
                  {modalData.refundRequest?.requested && (
                    <div className={`p-4 rounded-xl border border-rose-500/30 space-y-2 ${isDark ? 'bg-rose-950/20' : 'bg-rose-50/50'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4" /> Refund Requested
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 uppercase">
                          {modalData.refundRequest.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        <strong>Reason:</strong> {modalData.refundRequest.reason || 'Not specified'}
                      </p>
                      {modalData.refundRequest.details && (
                        <p className="text-[11px] text-slate-400">{modalData.refundRequest.details}</p>
                      )}
                    </div>
                  )}

                  {/* Return Request Block (if triggered) */}
                  {modalData.returnRequest?.requested && (
                    <div className={`p-4 rounded-xl border border-amber-500/30 space-y-2 ${isDark ? 'bg-amber-950/20' : 'bg-amber-50/50'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
                          <RotateCcw className="w-4 h-4" /> Return Requested
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 uppercase">
                          {modalData.returnRequest.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        <strong>Reason:</strong> {modalData.returnRequest.reason || 'Not specified'}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => {
                  setSelectedOrderId(null);
                  setModalData(null);
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                  isDark ? 'border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                }`}
              >
                Close Dialog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}