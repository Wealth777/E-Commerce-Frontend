import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import apiClient from "../../api/apiClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
} from "lucide-react";
import Loading from "../../components/layout/Loding";

// ... animation variants stay the same ...

export default function VendorOrdersDetails() {
  const { orderId } = useParams();
  const { isDark } = useTheme();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [showProofModal, setShowProofModal] = useState(false);
  const [activeProof, setActiveProof] = useState(null);

  // Safe order ID to prevent crashes if order not loaded
  const safeOrderId = order?._id;

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      // FIXED: Pointing to the vendor-specific endpoint defined in your router
      const res = await apiClient.get(`/vendor/orders/${orderId}`);
      setOrder(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const copyOrderId = () => {
    if (order?._id) {
      navigator.clipboard.writeText(order._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Re-using your existing status config logic
  const getStatusConfig = (status) => {
    const s = status?.toLowerCase() || "pending";
    const configs = {
      delivered: { icon: <CheckCircle2 className="w-5 h-5" />, color: "text-emerald-600", bg: isDark ? "bg-emerald-500/15" : "bg-emerald-50", label: "Delivered" },
      shipped: { icon: <Truck className="w-5 h-5" />, color: "text-green-600", bg: isDark ? "bg-green-500/15" : "bg-green-50", label: "Shipped" },
      processing: { icon: <Package className="w-5 h-5" />, color: "text-violet-600", bg: isDark ? "bg-violet-500/15" : "bg-violet-50", label: "Processing" },
      cancelled: { icon: <CircleDot className="w-5 h-5" />, color: "text-red-600", bg: isDark ? "bg-red-500/15" : "bg-red-50", label: "Cancelled" },
      default: { icon: <Clock className="w-5 h-5" />, color: "text-amber-600", bg: isDark ? "bg-amber-500/15" : "bg-amber-50", label: "Pending" }
    };
    return configs[s] || configs.default;
  };

  const confirmPayment = async (status) => {
    if (!safeOrderId) {
      toast.error("Order not loaded");
      return;
    }
    try {
      setActionLoading(`payment-${status}`);
      await apiClient.post("/vendor/orders/action/confirmpayment", {
        orderId: safeOrderId,
        status,
      });
      toast.success("Payment updated");
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment update failed");
    } finally {
      setActionLoading("");
    }
  };

  const confirmOrder = async () => {
    if (!safeOrderId) {
      toast.error("Order not loaded");
      return;
    }
    try {
      setActionLoading("confirm-order");
      await apiClient.post("/vendor/orders/action/confirmorder", {
        orderId: safeOrderId,
      });
      toast.success("Order confirmed");
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || "Order confirm failed");
    } finally {
      setActionLoading("");
    }
  };

  const markShipped = async () => {
    if (!safeOrderId) {
      toast.error("Order not loaded");
      return;
    }
    try {
      setActionLoading("mark-shipped");
      await apiClient.post("/vendor/orders/action/confirmshipped", {
        orderId: safeOrderId,
      });
      toast.success("Marked as shipped");
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || "Shipping update failed");
    } finally {
      setActionLoading("");
    }
  };

  if (!order?._id) return null;

  const openProof = (file) => {
    setActiveProof(file);
    setShowProofModal(true);
  };

  const closeProof = () => {
    setShowProofModal(false);
    setActiveProof(null);
  };

  const downloadProof = async () => {
    try {
      const res = await fetch(activeProof);
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${order._id}.jpg`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Download failed");
    }
  };

  // Style variables
  const bgColor = isDark ? "bg-[#0a0a0f]" : "bg-gray-50";
  const cardBg = isDark ? "bg-[#13131a]" : "bg-white";
  const cardBorder = isDark ? "border-white/[0.06]" : "border-gray-200";
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-500";
  const textMuted = isDark ? "text-gray-500" : "text-gray-400";

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgColor}`}>
        <Loading text="Loading order details..." />
      </div>
    );
  }

  if (!order) return (
    <div className={`min-h-screen flex items-center justify-center ${bgColor}`}>
      <div className="text-center space-y-3">
        <Package className={`w-12 h-12 mx-auto ${textMuted}`} />
        <p className={`text-lg font-medium ${textPrimary}`}>Order not found</p>
        <Link to="/vendor/orders" className="text-green-500 hover:underline">Back to Dashboard</Link>
      </div>
    </div>
  );

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className={`min-h-screen ${bgColor} pb-16`}>
      <ToastContainer theme={isDark ? "dark" : "light"} />

      {/* Header */}
      <div className={`sticky top-0 z-30 ${isDark ? "bg-[#0a0a0f]/80" : "bg-gray-50/80"} backdrop-blur-xl border-b ${cardBorder}`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/vendor/orders" className={`flex items-center gap-2 text-sm font-medium ${textSecondary} hover:${textPrimary}`}>
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
          <button onClick={copyOrderId} className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border ${cardBorder} ${textMuted}`}>
            {copied ? "Copied!" : `#${order._id.slice(-8).toUpperCase()}`}
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </div>

      <motion.div className="max-w-6xl mx-auto px-4 pt-8" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold ${textPrimary} tracking-tight`}>Order Details</h1>
          <p className={`mt-1 text-sm ${textSecondary}`}>
            Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </motion.div>

        {/* Order Action */}
        <motion.div variants={itemVariants} className="mb-8">
          <h4 className={`text-1xl sm:text-1xl font-bold ${textPrimary} tracking-tight`}>Order Action</h4>
          <div className="flex flex-wrap gap-3 mt-3">
            <button
              onClick={() => confirmPayment("paid")}
              disabled={order.payment?.status !== "pending" || actionLoading === "payment-paid"}
              className={`px-4 py-2 rounded-lg bg-green-600 text-white text-sm ${order.payment?.status !== "pending" || actionLoading === "payment-paid" ? "opacity-40 cursor-not-allowed" : "hover:bg-green-700 transition-colors"}`}
            >
              {actionLoading === "payment-paid" ? "Updating..." : "Mark Payment Paid"}
            </button>

            <button
              onClick={() => confirmPayment("failed")}
              disabled={order.payment?.status !== "pending" || actionLoading === "payment-failed"}
              className={`px-4 py-2 rounded-lg bg-red-600 text-white text-sm ${order.payment?.status !== "pending" || actionLoading === "payment-failed" ? "opacity-40 cursor-not-allowed" : "hover:bg-red-700 transition-colors"}`}
            >
              {actionLoading === "payment-failed" ? "Updating..." : "Mark Payment Failed"}
            </button>

            <button
              onClick={confirmOrder}
              disabled={order.status !== "pending" || actionLoading === "confirm-order"}
              className={`px-4 py-2 rounded-lg bg-blue-600 text-white text-sm ${order.status !== "pending" || actionLoading === "confirm-order" ? "opacity-40 cursor-not-allowed" : "hover:bg-blue-700 transition-colors"}`}
            >
              {actionLoading === "confirm-order" ? "Confirming..." : "Confirm Order"}
            </button>

            <button
              onClick={markShipped}
              disabled={order.status !== "confirmed" || actionLoading === "mark-shipped"}
              className={`px-4 py-2 rounded-lg bg-purple-600 text-white text-sm ${order.status !== "confirmed" || actionLoading === "mark-shipped" ? "opacity-40 cursor-not-allowed" : "hover:bg-purple-700 transition-colors"}`}
            >
              {actionLoading === "mark-shipped" ? "Updating..." : "Mark Shipped"}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


          <div className="lg:col-span-2 space-y-6">
            {/* Status & Buyer Info */}
            <motion.div variants={itemVariants} className={`${cardBg} border ${cardBorder} rounded-2xl p-6 flex flex-wrap justify-between items-center gap-4`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${statusConfig.bg} ${statusConfig.color} flex items-center justify-center`}>
                  {statusConfig.icon}
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase ${textMuted}`}>Order Status</p>
                  <h2 className={`text-lg font-bold ${textPrimary}`}>{statusConfig.label}</h2>
                </div>
              </div>

              {/* Buyer Details (Populated from your controller) */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-100 dark:border-white/10">
                <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center ${textSecondary}`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase ${textMuted}`}>Customer</p>
                  <h2 className={`text-sm font-semibold ${textPrimary}`}>{order.buyer?.username}</h2>
                  <p className="text-xs text-blue-500">{order.buyer?.email}</p>
                </div>
              </div>
            </motion.div>

            {/* Items for this Vendor */}
            <motion.div variants={itemVariants} className={`${cardBg} border ${cardBorder} rounded-2xl overflow-hidden`}>
              <div className="px-6 py-4 border-b border-inherit">
                <h3 className={`text-sm font-bold uppercase ${textMuted}`}>Products Ordered</h3>
              </div>
              <div className="divide-y divide-inherit">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="p-6 flex gap-4 items-center">
                    <img
                      src={item.productId?.image || "/placeholder.png"}
                      alt={item.productId?.name}
                      className="w-16 h-16 rounded-lg object-cover border border-inherit"
                    />
                    <div className="flex-1">
                      <h4 className={`font-semibold ${textPrimary}`}>{item.productId?.name}</h4>
                      <p className={`text-xs ${textMuted}`}>Qty: {item.quantity}</p>
                    </div>
                    <p className={`font-bold ${textPrimary}`}>₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div variants={itemVariants} className={`${cardBg} border ${cardBorder} rounded-2xl p-6`}>
              <h3 className={`text-xs font-bold uppercase ${textMuted} mb-3`}>Shipping Address</h3>
              <p className={`text-sm ${textPrimary} leading-relaxed`}>
                {order.delivery?.address}<br />
                {order.delivery?.city}, {order.delivery?.state}
              </p>
            </motion.div>

            {/* Note Card */}
            <motion.div variants={itemVariants} className={`${cardBg} border ${cardBorder} rounded-2xl overflow-hidden`}>
              <div className={`px-6 sm:px-8 py-5 border-b ${cardBorder}`}>
                <h3 className={`text-sm font-semibold uppercase tracking-wider ${textMuted}`}>Note</h3>
              </div>
              <div className={`divide-y mb-2`}>
                <div className="mt-3 p-2 ">
                  <p className={`text-sm pl-4 ${textPrimary}`}>{order?.note || 'No note added'}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Financials */}
          <div className="lg:col-span-1">
            <motion.div variants={itemVariants} className={`${cardBg} border ${cardBorder} rounded-2xl p-6 sticky top-24`}>
              <h3 className={`text-xs font-bold uppercase ${textMuted} mb-4`}>Payment Info</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>Method</span>
                  <span className={`font-medium ${textPrimary}`}>{order.payment?.method}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>Status</span>
                  <span className={`font-bold ${order.payment?.status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {order.payment?.status?.toUpperCase()}
                  </span>
                </div>
                {order.payment?.method !== "pod" &&
                  order.payment?.proofs?.length > 0 &&
                  order.payment.proofs.map((proof, i) => (
                    <button
                      key={i}
                      onClick={() => openProof(proof.file)}
                      className="text-xs text-green-500 flex items-center gap-1 hover:underline"
                    >
                      <Receipt className="w-3 h-3" />
                      View Receipt {i + 1}
                    </button>
                  ))}
              </div>

              <div className={`pt-4 border-t ${cardBorder} space-y-2`}>
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-bold ${textPrimary}`}>Vendor Earnings</span>
                  <span className="text-xl font-black text-green-500">
                    ₦{order.pricing?.total?.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 italic text-right">Includes taxes and shipping</p>
              </div>

              <div className="pt-6 border-t border-inherit">
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/20">
                  <p className="text-xs text-red-600 dark:text-red-400 font-bold leading-relaxed">
                    Tip: POD means Payment On Delivery. PAY_NOW - You've paid for the good's brought
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {showProofModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="relative max-w-3xl w-full mx-4">
              {/* Close button */}
              <button
                onClick={closeProof}
                className="absolute top-2 right-2 bg-red-600 text-white hover:bg-red-900 font-black px-3 py-1 rounded-lg text-sm"
              >
                Close
              </button>
              {/* Image */}
              <img
                src={activeProof}
                alt="Payment Proof"
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
              <button
                onClick={downloadProof}
                className="absolute bottom-2 right-2 bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-900"
              >
                Download
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}