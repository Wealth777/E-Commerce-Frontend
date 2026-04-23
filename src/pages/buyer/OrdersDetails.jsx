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
  MapPin,
  CreditCard,
  Receipt,
  FileText,
  ChevronRight,
  Copy,
  CircleDot,
  Circle,
} from "lucide-react";
import { useSelector } from "react-redux";
import Loading from "../../components/layout/Loding";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function OrdersDetails() {
  const { user } = useSelector((state) => state.auth);
  const { orderId } = useParams();
  const { isDark } = useTheme();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [showProofModal, setShowProofModal] = useState(false);
  const [activeProof, setActiveProof] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/buyer/orders/${orderId}`);
      setOrder(res.data.data);
    } catch (err) {
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelivery = async () => {
    try {
      setActionLoading("deliver");

      await apiClient.post("/buyer/orders/action/confirmdelivered", {
        orderId: order._id,
      });

      toast.success("Order marked as delivered");
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to confirm delivery");
    } finally {
      setActionLoading("");
    }
  };

  const cancelOrder = async () => {
    try {
      setActionLoading("cancel");

      await apiClient.post("/buyer/orders/action/cancelorder", {
        orderId: order._id,
      });

      toast.success("Order cancelled");
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    } finally {
      setActionLoading("");
    }
  };

  const copyOrderId = () => {
    if (order?._id) {
      navigator.clipboard.writeText(order._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

  // Fixed: Now accepts status as a parameter
  const getStatusConfig = (status) => {
    const s = status?.toLowerCase() || "pending";
    switch (s) {
      case "delivered":
        return {
          icon: <CheckCircle2 className="w-5 h-5" />,
          color: "text-emerald-600",
          bg: isDark ? "bg-emerald-500/15" : "bg-emerald-50",
          border: isDark ? "border-emerald-500/30" : "border-emerald-200",
          label: "Delivered",
          dot: "bg-emerald-500",
        };
      case "shipped":
        return {
          icon: <Truck className="w-5 h-5" />,
          color: "text-green-600",
          bg: isDark ? "bg-green-500/15" : "bg-green-50",
          border: isDark ? "border-green-500/30" : "border-green-200",
          label: "Shipped",
          dot: "bg-green-500",
        };
      case "processing":
        return {
          icon: <Package className="w-5 h-5" />,
          color: "text-violet-600",
          bg: isDark ? "bg-violet-500/15" : "bg-violet-50",
          border: isDark ? "border-violet-500/30" : "border-violet-200",
          label: "Processing",
          dot: "bg-violet-500",
        };
      case "cancelled":
        return {
          icon: <CircleDot className="w-5 h-5" />,
          color: "text-red-600",
          bg: isDark ? "bg-red-500/15" : "bg-red-50",
          border: isDark ? "border-red-500/30" : "border-red-200",
          label: "Cancelled",
          dot: "bg-red-500",
        };
      default:
        return {
          icon: <Clock className="w-5 h-5" />,
          color: "text-amber-600",
          bg: isDark ? "bg-amber-500/15" : "bg-amber-50",
          border: isDark ? "border-amber-500/30" : "border-amber-200",
          label: "Pending",
          dot: "bg-amber-500",
        };
    }
  };

  const bgColor = isDark ? "bg-[#0a0a0f]" : "bg-gray-50";
  const cardBg = isDark ? "bg-[#13131a]" : "bg-white";
  const cardBorder = isDark ? "border-white/[0.06]" : "border-gray-200";
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-500";
  const textMuted = isDark ? "text-gray-500" : "text-gray-400";
  const divider = isDark ? "bg-white/[0.06]" : "bg-gray-100";

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgColor}`}>
        <Loading text="Loading order details..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bgColor}`}>
        <div className="text-center space-y-3">
          <Package className={`w-12 h-12 mx-auto ${textMuted}`} />
          <p className={`text-lg font-medium ${textPrimary}`}>Order not found</p>
          <Link to="/buyer/orders" className="text-green-500 hover:underline text-sm">Back to Orders</Link>
        </div>
      </div>
    );
  }

  // Dynamic Logic variables
  const statusConfig = getStatusConfig(order.status);
  const orderRef = order._id ? `#${order._id.slice(-8).toUpperCase()}` : "N/A";

  return (
    <div className={`min-h-screen ${bgColor} pb-16`}>
      <ToastContainer theme={isDark ? "dark" : "light"} />

      <div className={`sticky top-0 z-30 ${isDark ? "bg-[#0a0a0f]/80" : "bg-gray-50/80"} backdrop-blur-xl border-b ${cardBorder}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/buyer/orders" className={`flex items-center gap-2 text-sm font-medium ${textSecondary} hover:${textPrimary} transition-colors group`}>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Orders
          </Link>
          <button onClick={copyOrderId} className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border ${cardBorder} ${textMuted} hover:${textSecondary} transition-colors`}>
            {copied ? "Copied!" : orderRef}
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </div>

      <motion.div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold ${textPrimary} tracking-tight`}>Order Details</h1>
          <p className={`mt-1 text-sm ${textSecondary}`}>
            Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </motion.div>

        {/* Order Action */}
        <motion.div variants={itemVariants} className="mb-8">
          <h4 className={`text-1xl sm:text-1xl font-bold ${textPrimary} tracking-tight`}>Order Action</h4>
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={confirmDelivery}
              disabled={order.status !== "shipped" || actionLoading === "deliver"}
              className={`px-4 py-2 rounded-lg text-sm text-white bg-green-600 ${order.status !== "shipped" ? "opacity-40 cursor-not-allowed" : ""}`}>
              {actionLoading === "deliver" ? "Updating..." : "Confirm Delivered"}
            </button>

            <button
              onClick={cancelOrder}
              disabled={order.status !== "pending" || actionLoading === "cancel"}
              className={`px-4 py-2 rounded-lg text-sm text-white bg-red-600 ${order.status !== "pending" ? "opacity-40 cursor-not-allowed" : ""}`}>
              {actionLoading === "cancel" ? "Cancelling..." : "Cancel Order"}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Status Card */}
            <motion.div variants={itemVariants} className={`${cardBg} border ${cardBorder} rounded-2xl p-6 sm:p-8`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border} flex items-center justify-center`}>
                    {statusConfig.icon}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${textMuted} mb-0.5`}>Current Status</p>
                    <h2 className={`text-xl font-bold ${textPrimary}`}>{statusConfig.label}</h2>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Items Card */}
            <motion.div variants={itemVariants} className={`${cardBg} border ${cardBorder} rounded-2xl overflow-hidden`}>
              <div className={`px-6 sm:px-8 py-5 border-b ${cardBorder}`}>
                <h3 className={`text-sm font-semibold uppercase tracking-wider ${textMuted}`}>Items ({order.items?.length || 0})</h3>
              </div>
              <div className={`divide-y ${cardBorder}`}>
                {order.items?.map((item, idx) => (
                  <div key={item.productId || idx} className={`px-6 sm:px-8 py-5 flex gap-4 sm:gap-5 group hover:${isDark ? "bg-white/[0.02]" : "bg-gray-50/50"} transition-colors`}>
                    <img src={item.image} alt={item.name} className={`w-20 h-20 rounded-xl object-cover border ${cardBorder}`} />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className={`text-sm sm:text-base font-semibold ${textPrimary}`}>{item.name}</p>
                        <p className={`text-xs ${textMuted}`}>Sold by {item.vendor?.storeName || item.vendorName || "N/A"}  </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className={`text-xs ${textMuted}`}>{item.quantity} × ₦{item.price?.toLocaleString()}</p>
                        <p className={`text-sm font-bold ${textPrimary}`}>₦{(item.price * item.quantity)?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

            {/* Dynamic Delivery & Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className={`${cardBg} border ${cardBorder} rounded-2xl p-6`}>
                <h3 className={`text-xs font-semibold uppercase tracking-wider ${textMuted} mb-4`}>Delivery</h3>
                <div className="space-y-3">
                  <p className={`text-sm font-medium ${textPrimary}`}>{user?.identity?.fullName || user?.fullName}</p>
                  <p className={`text-sm ${textSecondary}`}>{order.delivery?.address}, {order.delivery?.state}</p>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded bg-gray-100 text-[10px] font-bold ${isDark ? "bg-white/5" : "bg-gray-100"} ${textSecondary}`}>
                    <Truck className="w-3 h-3" /> {order.delivery?.method || "Standard"}
                  </span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className={`${cardBg} border ${cardBorder} rounded-2xl p-6`}>
                <h3 className={`text-xs font-semibold uppercase tracking-wider ${textMuted} mb-4`}>Payment</h3>
                <div className="space-y-3">
                  <p className={`text-sm font-medium uppercase ${textPrimary}`}>{order.payment?.method || "N/A"}</p>
                  <p className={`text-xs font-bold uppercase ${order.payment?.status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {order.payment?.status?.toUpperCase() || "PENDING"}
                  </p>
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

          {/* SUMMARY COLUMN */}
          <div className="lg:col-span-1">
            <motion.div variants={itemVariants} className={`lg:sticky lg:top-24 ${cardBg} border ${cardBorder} rounded-2xl p-6`}>
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${textMuted} mb-6`}>Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>Subtotal</span>
                  <span className={textPrimary}>₦{order.pricing?.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>Shipping</span>
                  <span className={textPrimary}>₦{order.pricing?.deliveryFee?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={textSecondary}>Tax</span>
                  <span className={textPrimary}>₦{order.pricing?.tax?.toLocaleString()}</span>
                </div>
                <div className={`h-px ${divider}`} />
                <div className="flex justify-between items-end">
                  <span className={`font-bold ${textPrimary}`}>Total</span>
                  <span className={`text-xl font-extrabold ${isDark ? "text-green-400" : "text-green-600"}`}>
                    ₦{order.pricing?.total?.toLocaleString()}
                  </span>
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