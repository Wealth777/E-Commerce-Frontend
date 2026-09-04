import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Receipt,
  Copy,
  CircleDot,
  User,
  Download,
  X,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import apiClient from "../../api/apiClient";
import { getMessage, getPayload } from "../../utils/apiResponse";
import { useToast } from "../../context/ToastContext";
import Loading from "../../components/layout/Loding";

import {
  addOrder,
  setSelectedOrder,
} from "../../store/orderSlice";

export default function VendorOrdersDetails() {
  const { orderId } = useParams();
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    orders = [],
    selectedOrder,
  } = useSelector((state) => state.orders);

  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [showProofModal, setShowProofModal] = useState(false);
  const [activeProof, setActiveProof] = useState(null);

  const order = useMemo(() => {
    if (selectedOrder?._id === orderId) {
      return selectedOrder;
    }

    return (
      orders.find((item) => item?._id === orderId) || null
    );
  }, [orders, selectedOrder, orderId]);

  const safeOrderId = order?._id || orderId;

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;

    try {
      setLoading(true);

      const response = await apiClient.get(
        `/vendor/orders/${orderId}`
      );

      const fetchedOrder = getPayload(response, null);

      if (!fetchedOrder) {
        throw new Error("Order not found");
      }

      dispatch(addOrder(fetchedOrder));
      dispatch(setSelectedOrder(fetchedOrder));
    } catch (error) {
      showToast(
        getMessage(error, "Failed to load order details"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch, orderId, showToast]);

  useEffect(() => {
    const existingOrder = orders.find(
      (item) => item?._id === orderId
    );

    if (existingOrder) {
      dispatch(setSelectedOrder(existingOrder));
      setLoading(false);
      return;
    }

    fetchOrder();
  }, [dispatch, fetchOrder, orderId, orders]);

  const refreshOrder = async () => {
    await fetchOrder();
  };

  const updateOrderAction = async ({
    actionKey,
    endpoint,
    payload,
    successMessage,
    errorMessage,
  }) => {
    if (!safeOrderId) {
      showToast("Order not loaded", "warning");
      return;
    }

    try {
      setActionLoading(actionKey);

      const response = await apiClient.post(endpoint, {
        orderId: safeOrderId,
        ...payload,
      });

      const updatedOrder = getPayload(response, null);

      if (updatedOrder?._id) {
        dispatch(addOrder(updatedOrder));
        dispatch(setSelectedOrder(updatedOrder));
      } else {
        await fetchOrder();
      }

      showToast(successMessage, "success");
    } catch (error) {
      showToast(
        getMessage(error, errorMessage),
        "error"
      );
    } finally {
      setActionLoading("");
    }
  };

  const confirmPayment = async (status) => {
    await updateOrderAction({
      actionKey: `payment-${status}`,
      endpoint: "/vendor/orders/action/confirmpayment",
      payload: { status },
      successMessage:
        status === "paid"
          ? "Payment marked as paid"
          : "Payment marked as failed",
      errorMessage: "Payment update failed",
    });
  };

  const confirmOrder = async () => {
    await updateOrderAction({
      actionKey: "confirm-order",
      endpoint: "/vendor/orders/action/confirmorder",
      payload: {},
      successMessage: "Order confirmed",
      errorMessage: "Order confirmation failed",
    });
  };

  const markShipped = async () => {
    await updateOrderAction({
      actionKey: "mark-shipped",
      endpoint: "/vendor/orders/action/confirmshipped",
      payload: {},
      successMessage: "Order marked as shipped",
      errorMessage: "Shipping update failed",
    });
  };

  const copyOrderId = async () => {
    if (!order?._id) {
      showToast("Order ID is unavailable", "warning");
      return;
    }

    try {
      await navigator.clipboard.writeText(order._id);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      showToast("Unable to copy order ID", "error");
    }
  };

  const openProof = (file) => {
    if (!file) {
      showToast("Payment proof is unavailable", "warning");
      return;
    }

    setActiveProof(file);
    setShowProofModal(true);
  };

  const closeProof = () => {
    setShowProofModal(false);
    setActiveProof(null);
  };

  const downloadProof = async () => {
    if (!activeProof || !order?._id) {
      showToast("Payment proof is unavailable", "warning");
      return;
    }

    try {
      const response = await fetch(activeProof);

      if (!response.ok) {
        throw new Error("Failed to fetch payment proof");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${order._id}.jpg`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch {
      showToast("Download failed", "error");
    }
  };

  const getStatusConfig = (status) => {
    const normalizedStatus = status?.toLowerCase() || "pending";

    const configs = {
      delivered: {
        icon: <CheckCircle2 className="w-5 h-5" />,
        color: "text-emerald-600",
        bg: isDark ? "bg-emerald-500/15" : "bg-emerald-50",
        label: "Delivered",
      },

      shipped: {
        icon: <Truck className="w-5 h-5" />,
        color: "text-green-600",
        bg: isDark ? "bg-green-500/15" : "bg-green-50",
        label: "Shipped",
      },

      confirmed: {
        icon: <Package className="w-5 h-5" />,
        color: "text-blue-600",
        bg: isDark ? "bg-blue-500/15" : "bg-blue-50",
        label: "Confirmed",
      },

      processing: {
        icon: <Package className="w-5 h-5" />,
        color: "text-violet-600",
        bg: isDark ? "bg-violet-500/15" : "bg-violet-50",
        label: "Processing",
      },

      cancelled: {
        icon: <CircleDot className="w-5 h-5" />,
        color: "text-red-600",
        bg: isDark ? "bg-red-500/15" : "bg-red-50",
        label: "Cancelled",
      },

      default: {
        icon: <Clock className="w-5 h-5" />,
        color: "text-amber-600",
        bg: isDark ? "bg-amber-500/15" : "bg-amber-50",
        label: "Pending",
      },
    };

    return configs[normalizedStatus] || configs.default;
  };

  const formatCurrency = (amount) => {
    return `₦${Number(amount || 0).toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown date";
    }

    return parsedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
      "/placeholder.png"
    );
  };

  const canMarkPayment = order?.payment?.status === "pending";
  const canConfirmOrder = order?.status === "pending";
  const canMarkShipped = order?.status === "confirmed";

  const statusConfig = getStatusConfig(order?.status);

  const bgColor = isDark
    ? "bg-[#0a0a0f]"
    : "bg-gray-50";

  const cardBg = isDark
    ? "bg-[#13131a]"
    : "bg-white";

  const cardBorder = isDark
    ? "border-white/[0.06]"
    : "border-gray-200";

  const textPrimary = isDark
    ? "text-gray-100"
    : "text-gray-900";

  const textSecondary = isDark
    ? "text-gray-400"
    : "text-gray-500";

  const textMuted = isDark
    ? "text-gray-500"
    : "text-gray-400";

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading && !order) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${bgColor}`}
      >
        <Loading text="Loading order details..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${bgColor}`}
      >
        <div className="text-center space-y-3">
          <Package
            className={`w-12 h-12 mx-auto ${textMuted}`}
          />

          <p className={`text-lg font-medium ${textPrimary}`}>
            Order not found
          </p>

          <Link
            to="/vendor/orders"
            className="text-green-500 hover:underline"
          >
            Back to Sales
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} pb-16`}>
      {/* Header */}
      <div
        className={`sticky top-0 z-30 ${isDark
            ? "bg-[#0a0a0f]/80"
            : "bg-gray-50/80"
          } backdrop-blur-xl border-b ${cardBorder}`}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`group inline-flex items-center gap-2 text-sm rounded-full px-3 py-1.5 transition-colors ${isDark
                ? "bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 ring-1 ring-white/10"
                : "bg-white/70 hover:bg-white text-zinc-600 ring-1 ring-zinc-900/5"
              }`}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <button
            type="button"
            onClick={copyOrderId}
            className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border ${cardBorder} ${textMuted}`}
          >
            {copied
              ? "Copied!"
              : `#${order._id?.slice(-8).toUpperCase()}`}
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </div>

      <motion.div
        className="max-w-6xl mx-auto px-4 pt-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <h1
            className={`text-2xl sm:text-3xl font-bold ${textPrimary} tracking-tight`}
          >
            Order Details
          </h1>

          <p className={`mt-1 text-sm ${textSecondary}`}>
            Placed on {formatDate(order.createdAt)}
          </p>
        </motion.div>

        {/* Order actions */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <div className="flex items-center justify-between gap-4">
            <h4
              className={`text-lg font-bold ${textPrimary} tracking-tight`}
            >
              Order Actions
            </h4>

            {loading && (
              <span className={`text-xs ${textSecondary}`}>
                Refreshing...
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-3">
            <button
              type="button"
              onClick={() => confirmPayment("paid")}
              disabled={
                !canMarkPayment ||
                actionLoading === "payment-paid"
              }
              className={`px-4 py-2 rounded-lg bg-green-600 text-white text-sm ${!canMarkPayment ||
                  actionLoading === "payment-paid"
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-green-700 transition-colors"
                }`}
            >
              {actionLoading === "payment-paid"
                ? "Updating..."
                : "Mark Payment Paid"}
            </button>

            <button
              type="button"
              onClick={() => confirmPayment("failed")}
              disabled={
                !canMarkPayment ||
                actionLoading === "payment-failed"
              }
              className={`px-4 py-2 rounded-lg bg-red-600 text-white text-sm ${!canMarkPayment ||
                  actionLoading === "payment-failed"
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-red-700 transition-colors"
                }`}
            >
              {actionLoading === "payment-failed"
                ? "Updating..."
                : "Mark Payment Failed"}
            </button>

            <button
              type="button"
              onClick={confirmOrder}
              disabled={
                !canConfirmOrder ||
                actionLoading === "confirm-order"
              }
              className={`px-4 py-2 rounded-lg bg-blue-600 text-white text-sm ${!canConfirmOrder ||
                  actionLoading === "confirm-order"
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-blue-700 transition-colors"
                }`}
            >
              {actionLoading === "confirm-order"
                ? "Confirming..."
                : "Confirm Order"}
            </button>

            <button
              type="button"
              onClick={markShipped}
              disabled={
                !canMarkShipped ||
                actionLoading === "mark-shipped"
              }
              className={`px-4 py-2 rounded-lg bg-purple-600 text-white text-sm ${!canMarkShipped ||
                  actionLoading === "mark-shipped"
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-purple-700 transition-colors"
                }`}
            >
              {actionLoading === "mark-shipped"
                ? "Updating..."
                : "Mark Shipped"}
            </button>

            <button
              type="button"
              onClick={refreshOrder}
              disabled={loading}
              className={`px-4 py-2 rounded-lg border ${cardBorder} ${textPrimary} text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
            >
              Refresh
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Status and buyer info */}
            <motion.div
              variants={itemVariants}
              className={`${cardBg} border ${cardBorder} rounded-2xl p-6 flex flex-wrap justify-between items-center gap-4`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${statusConfig.bg} ${statusConfig.color} flex items-center justify-center`}
                >
                  {statusConfig.icon}
                </div>

                <div>
                  <p
                    className={`text-xs font-bold uppercase ${textMuted}`}
                  >
                    Order Status
                  </p>

                  <h2
                    className={`text-lg font-bold ${textPrimary}`}
                  >
                    {statusConfig.label}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-100 dark:border-white/10">
                <div
                  className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center ${textSecondary}`}
                >
                  <User className="w-5 h-5" />
                </div>

                <div>
                  <p
                    className={`text-xs font-bold uppercase ${textMuted}`}
                  >
                    Customer
                  </p>

                  <h2
                    className={`text-sm font-semibold ${textPrimary}`}
                  >
                    {order.buyer?.fullName || "Guest User"}
                  </h2>

                  {order.buyer?.email && (
                    <p className="text-xs text-blue-500">
                      {order.buyer.email || 'Null'}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Products */}
            <motion.div
              variants={itemVariants}
              className={`${cardBg} border ${cardBorder} rounded-2xl overflow-hidden`}
            >
              <div
                className={`px-6 py-4 border-b ${cardBorder}`}
              >
                <h3
                  className={`text-sm font-bold uppercase ${textMuted}`}
                >
                  Products Ordered
                </h3>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-white/10">
                {order.items?.map((item, index) => (
                  <div
                    key={`${item.productId || item._id || "item"}-${index}`}
                    className="p-6 flex gap-4 items-center"
                  >
                    <img
                      src={getProductImage(item)}
                      alt={getProductName(item)}
                      className="w-16 h-16 rounded-lg object-cover border border-inherit"
                    />

                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-semibold ${textPrimary} truncate`}
                      >
                        {getProductName(item)}
                      </h4>

                      <p className={`text-xs ${textMuted}`}>
                        Qty: {item.quantity || 0}
                      </p>
                    </div>

                    <p
                      className={`font-bold ${textPrimary} whitespace-nowrap`}
                    >
                      {formatCurrency(
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Delivery address */}
            <motion.div
              variants={itemVariants}
              className={`${cardBg} border ${cardBorder} rounded-2xl p-6`}
            >
              <h3
                className={`text-xs font-bold uppercase ${textMuted} mb-3`}
              >
                Shipping Address
              </h3>

              <p
                className={`text-sm ${textPrimary} leading-relaxed`}
              >
                {order.delivery?.address || "Address unavailable"}
                {order.delivery?.state
                  ? `, ${order.delivery.state}`
                  : ""}
              </p>
            </motion.div>

            {/* Customer note */}
            <motion.div
              variants={itemVariants}
              className={`${cardBg} border ${cardBorder} rounded-2xl overflow-hidden`}
            >
              <div
                className={`px-6 sm:px-8 py-5 border-b ${cardBorder}`}
              >
                <h3
                  className={`text-sm font-semibold uppercase tracking-wider ${textMuted}`}
                >
                  Customer Note
                </h3>
              </div>

              <div className="p-6">
                <p className={`text-sm ${textPrimary}`}>
                  {order.note || "No note added"}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Financial information */}
          <div className="lg:col-span-1">
            <motion.div
              variants={itemVariants}
              className={`${cardBg} border ${cardBorder} rounded-2xl p-6 sticky top-24`}
            >
              <h3
                className={`text-xs font-bold uppercase ${textMuted} mb-4`}
              >
                Payment Information
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm gap-4">
                  <span className={textSecondary}>Method</span>

                  <span
                    className={`font-medium ${textPrimary} uppercase`}
                  >
                    {order.payment?.method || "Unavailable"}
                  </span>
                </div>

                <div className="flex justify-between text-sm gap-4">
                  <span className={textSecondary}>Status</span>

                  <span
                    className={`font-bold ${order.payment?.status === "paid"
                        ? "text-emerald-500"
                        : order.payment?.status === "failed"
                          ? "text-red-500"
                          : "text-amber-500"
                      }`}
                  >
                    {order.payment?.status?.toUpperCase() ||
                      "PENDING"}
                  </span>
                </div>

                {order.payment?.method !== "pod" &&
                  order.payment?.proofs?.length > 0 &&
                  order.payment.proofs.map((proof, index) => (
                    <button
                      type="button"
                      key={`${proof.file || "proof"}-${index}`}
                      onClick={() => openProof(proof.file)}
                      className="text-xs text-green-500 flex items-center gap-1 hover:underline"
                    >
                      <Receipt className="w-3 h-3" />
                      View Receipt {index + 1}
                    </button>
                  ))}
              </div>

              <div
                className={`pt-4 border-t ${cardBorder} space-y-2`}
              >
                <div className="flex justify-between items-center gap-4">
                  <span
                    className={`text-sm font-bold ${textPrimary}`}
                  >
                    Vendor Earnings
                  </span>

                  <span className="text-xl font-black text-green-500 whitespace-nowrap">
                    {formatCurrency(order.pricing?.total)}
                  </span>
                </div>

                <p className="text-[10px] text-gray-500 italic text-right">
                  Includes taxes and shipping
                </p>
              </div>

              <div
                className={`pt-6 mt-6 border-t ${cardBorder}`}
              >
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/20">
                  <p className="text-xs text-red-600 dark:text-red-400 font-bold leading-relaxed">
                    POD means Payment On Delivery. PAY_NOW means
                    the buyer paid before delivery.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Payment proof modal */}
        {showProofModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Payment proof"
          >
            <div className="relative max-w-3xl w-full">
              <button
                type="button"
                onClick={closeProof}
                aria-label="Close payment proof"
                className="absolute top-2 right-2 z-10 bg-red-600 text-white hover:bg-red-700 font-black p-2 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>

              <img
                src={activeProof}
                alt="Payment proof"
                className="w-full max-h-[80vh] object-contain rounded-xl bg-black"
              />

              <button
                type="button"
                onClick={downloadProof}
                className="absolute bottom-2 right-2 bg-green-600 text-white px-3 py-2 rounded-lg text-xs hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-3 h-3" />
                Download
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}