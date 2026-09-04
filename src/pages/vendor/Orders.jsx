import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBox,
  FaChevronRight,
  FaRegCalendarAlt,
  FaWallet,
  FaUser,
  FaShippingFast,
} from "react-icons/fa";
import { ArrowLeft, RefreshCw } from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import apiClient from "../../api/apiClient";
import { getList, getMessage } from "../../utils/apiResponse";
import Loading from "../../components/layout/Loding";

import {
  setOrders,
  setLoading,
  setError,
} from "../../store/orderSlice";

const VendorOrders = () => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    orders = [],
    loading,
    error,
  } = useSelector((state) => state.orders);

  const fetchOrders = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await apiClient.get("/vendor/orders");
      const vendorOrders = getList(response, ["orders"]);

      dispatch(setOrders(vendorOrders));
    } catch (requestError) {
      const message = getMessage(
        requestError,
        "Failed to load sales orders"
      );

      dispatch(setError(message));
      showToast(message, "error");
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalRevenue = useMemo(() => {
    return orders.reduce((total, order) => {
      return total + Number(order?.pricing?.total || 0);
    }, 0);
  }, [orders]);

  const formatCurrency = (amount) => {
    return `₦${Number(amount || 0).toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown date";
    }

    return parsedDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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

  const getProgressWidth = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "w-full bg-emerald-500";

      case "shipped":
        return "w-2/3 bg-blue-500";

      case "confirmed":
        return "w-1/2 bg-purple-500";

      case "cancelled":
        return "w-full bg-red-500";

      default:
        return "w-1/3 bg-amber-500";
    }
  };

  const getTotalQuantity = (items = []) => {
    return items.reduce(
      (total, item) => total + Number(item?.quantity || 0),
      0
    );
  };

  const getProductName = (item) => {
    return (
      item?.name ||
      item?.productId?.name ||
      "Product"
    );
  };

  const getProductImage = (item) => {
    return (
      item?.image ||
      item?.productId?.image ||
      null
    );
  };

  const handleRetry = () => {
    fetchOrders();
  };

  const bgColor = isDark
    ? "bg-gray-950 text-white"
    : "bg-gray-50 text-gray-900";

  const cardBg = isDark
    ? "bg-gray-900 border-gray-800"
    : "bg-white border-gray-200";

  const textColor = isDark
    ? "text-gray-100"
    : "text-gray-900";

  const secondaryText = isDark
    ? "text-gray-400"
    : "text-gray-500";

  return (
    <div
      className={`min-h-screen ${bgColor} py-10 transition-colors duration-300`}
    >
      <div className="max-w-5xl mx-auto px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`group inline-flex items-center gap-2 text-sm mb-4 rounded-full px-3 py-1.5 transition-colors ${
            isDark
              ? "bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 ring-1 ring-white/10"
              : "bg-white/70 hover:bg-white text-zinc-600 ring-1 ring-zinc-900/5"
          }`}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 rounded-2xl p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
              Sales Management
            </h1>

            <p className="text-black/80">
              Track your store sales and manage customer fulfillments.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div
                className={`${cardBg} border p-4 rounded-2xl shadow-sm`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Total Revenue
                </p>

                <p
                  className={`text-xl font-black ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {formatCurrency(totalRevenue)}
                </p>
              </div>

              <div
                className={`${cardBg} border p-4 rounded-2xl shadow-sm`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Incoming Orders
                </p>

                <p className={`text-xl font-black ${textColor}`}>
                  {orders.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loading text="Fetching your sales data..." />
          </div>
        ) : error && orders.length === 0 ? (
          <div
            className={`${cardBg} border rounded-2xl p-10 text-center mt-6`}
          >
            <FaBox
              size={32}
              className="text-gray-400 mx-auto mb-4"
            />

            <h2 className={`text-xl font-bold ${textColor}`}>
              Unable to load orders
            </h2>

            <p className={`${secondaryText} mt-2 mb-6`}>
              {error}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div
            className={`${cardBg} border-2 border-dashed rounded-[2.5rem] p-16 text-center shadow-sm mt-6`}
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBox size={32} className="text-gray-400" />
            </div>

            <h2 className={`text-2xl font-bold ${textColor}`}>
              No sales yet
            </h2>

            <p className={`${secondaryText} max-w-xs mx-auto mt-2`}>
              Your store orders will appear here once customers start buying.
            </p>
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            {orders.map((order) => {
              const items = order?.items || [];
              const firstItem = items[0];
              const paymentStatus =
                order?.payment?.status || "pending";
              const deliveryStatus =
                order?.status || "pending";

              return (
                <div
                  key={order._id}
                  className={`${cardBg} border rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-300 group`}
                >
                  {/* Order top bar */}
                  <div className="px-6 py-4 border-b border-inherit flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isDark ? "bg-gray-800" : "bg-gray-50"
                        }`}
                      >
                        <FaUser className="text-blue-500" />
                      </div>

                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                          Customer
                        </p>

                        <p className={`font-bold text-sm ${textColor}`}>
                          {order.buyer?.fullName || "Guest User"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="hidden sm:block text-right">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                          Ordered On
                        </p>

                        <p
                          className={`text-sm font-semibold flex items-center gap-1 ${textColor}`}
                        >
                          <FaRegCalendarAlt
                            size={12}
                            className="text-gray-400"
                          />
                          {formatDate(order?.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <div
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getPaymentStyle(
                            paymentStatus
                          )}`}
                        >
                          <FaWallet className="inline mr-1" />
                          {paymentStatus}
                        </div>

                        <div
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getDeliveryStyle(
                            deliveryStatus
                          )}`}
                        >
                          <FaShippingFast className="inline mr-1" />
                          {deliveryStatus}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order body */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex -space-x-2">
                            {items.slice(0, 3).map((item, index) => {
                              const image = getProductImage(item);

                              return (
                                <div
                                  key={`${order._id}-${index}`}
                                  className={`w-12 h-12 rounded-xl border-2 ${
                                    isDark
                                      ? "border-gray-900 bg-gray-800"
                                      : "border-white bg-gray-100"
                                  } flex items-center justify-center overflow-hidden`}
                                >
                                  {image ? (
                                    <img
                                      src={image}
                                      alt={getProductName(item)}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <FaBox
                                      className="text-gray-400"
                                      size={14}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-bold truncate ${textColor}`}
                            >
                              {getProductName(firstItem)}
                              {items.length > 1 &&
                                ` (+${items.length - 1} more)`}
                            </p>

                            <p className={`text-sm ${secondaryText}`}>
                              Qty: {getTotalQuantity(items)}{" "}
                              • {order?.delivery?.method || "Standard"}{" "}
                              Shipping
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                          <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">
                            Shipping To
                          </p>

                          <p className={`text-xs truncate ${textColor}`}>
                            {order?.delivery?.address || "Address unavailable"}
                            {order?.delivery?.state
                              ? `, ${order.delivery.state}`
                              : ""}
                          </p>
                        </div>
                      </div>

                      {/* Price and action */}
                      <div className="flex items-center justify-between lg:justify-end gap-8 lg:flex-col lg:items-end lg:gap-4">
                        <div className="text-left lg:text-right">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                            Earnings
                          </p>

                          <p className="text-2xl font-black text-green-600">
                            {formatCurrency(order?.pricing?.total)}
                          </p>
                        </div>

                        <Link
                          to={`/vendor/orders/${order._id}`}
                          aria-label={`View order ${order._id}`}
                          className={`p-4 rounded-2xl ${
                            isDark
                              ? "bg-gray-800 hover:bg-gray-700"
                              : "bg-yellow-50 hover:bg-yellow-100"
                          } transition-all text-green-600 shadow-sm`}
                        >
                          <FaChevronRight />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1 w-full bg-gray-200 dark:bg-gray-800">
                    <div
                      className={`h-full transition-all duration-700 ${getProgressWidth(
                        deliveryStatus
                      )}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOrders;