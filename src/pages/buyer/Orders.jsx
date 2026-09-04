import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import apiClient from "../../api/apiClient";
import { getList, getMessage } from "../../utils/apiResponse";
import {
  FaBox,
  FaChevronRight,
  FaRegCalendarAlt,
  FaWallet,
  FaShippingFast,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Loading from "../../components/layout/Loding";
import { setOrders } from "../../store/orderSlice";

const Orders = () => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orders, loading: reduxLoading, error } = useSelector(
    (state) => state.orders
  );

  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const response = await apiClient.get("/buyer/orders");

      const rawOrders = getList(response, ["orders"]);

      dispatch(setOrders(rawOrders));
    } catch (error) {
      showToast(
        getMessage(error, "Failed to load orders"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch, showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const groupedOrders = useMemo(() => {
    return [...orders].sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    );
  }, [orders]);

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

  const getRequestStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";

      case "approved":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";

      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";

      case "processing":
      case "inspection":
      case "buyer_shipping":
      case "returned":
      case "refunded":
        return "bg-violet-500/10 text-violet-500 border-violet-500/20";

      default:
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    }
  };

  const shouldDisplayRequestStatus = (request) => {
    return Boolean(
      request?.requested &&
      [
        "pending",
        "pending_review",
        "approved",
        "processing",
        "buyer_shipping",
        "returned",
        "inspection",
        "refunded",
        "rejected",
        "completed",
      ].includes(request.status)
    );
  };

  const totalSpent = useMemo(() => {
    return groupedOrders.reduce(
      (total, order) =>
        total + Number(order?.pricing?.total || 0),
      0
    );
  }, [groupedOrders]);

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

  const isLoading = loading || reduxLoading;

  return (
    <div
      className={`min-h-screen ${bgColor} py-10 transition-colors duration-300`}
    >


      <div className="w-full max-w-5xl mx-auto px-4 overflow-hidden">
        <button
          onClick={() => navigate(-1)}
          className={`group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-500 transition-colors mb-2 rounded-full px-3 py-1.5 ${isDark
            ? "bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 ring-1 ring-white/10"
            : "bg-white/70 hover:bg-white text-zinc-600 ring-1 ring-zinc-900/5"
            }`}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        {/* Header */}
        <div className="mb-10 relative overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 rounded-2xl p-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />

          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <h1 className="text-4xl font-black tracking-tight mb-2 text-white">
            My Orders
          </h1>

          <p className="text-black">
            Track, manage and view your purchase history.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div
              className={`${cardBg} border p-4 rounded-2xl shadow-sm`}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Total Spent
              </p>

              <p
                className={`text-xl font-black ${isDark
                  ? "text-green-400"
                  : "text-green-600"
                  }`}
              >
                ₦{totalSpent.toLocaleString()}
              </p>
            </div>

            <div
              className={`${cardBg} border p-4 rounded-2xl shadow-sm`}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                Total Orders
              </p>

              <p
                className={`text-xl font-black ${isDark
                  ? "text-white"
                  : "text-black"
                  }`}
              >
                {groupedOrders.length}
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && !isLoading && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-red-500">
                {error}
              </p>

              <button
                onClick={fetchOrders}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loading text="Retrieving your orders..." />
          </div>
        ) : groupedOrders.length === 0 ? (
          <div
            className={`${cardBg} border-2 border-dashed rounded-[2.5rem] p-16 text-center shadow-sm`}
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBox
                size={32}
                className="text-gray-400"
              />
            </div>

            <h2 className="text-2xl font-bold mb-2">
              No orders found
            </h2>

            <p
              className={`${secondaryText} max-w-xs mx-auto mb-8`}
            >
              Looks like you haven't made any purchases
              yet.
            </p>

            <Link to="/products">
              <button className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 shadow-green-600/20">
                <ShoppingBag />
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedOrders.map((order) => {
              const paymentStatus =
                order.payment?.status ||
                "pending";

              const deliveryStatus =
                order.status || "pending";

              const firstItem =
                order.items?.[0];

              const refundVisible =
                shouldDisplayRequestStatus(
                  order.refundRequest
                );

              const returnVisible =
                shouldDisplayRequestStatus(
                  order.returnRequest
                );

              return (
                <div
                  key={order._id}
                  className={`${cardBg} border rounded-[2rem] overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group`}
                >
                  {/* Top Bar */}
                  <div className="px-4 sm:px-6 py-4 border-b border-inherit flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark
                          ? "bg-gray-800"
                          : "bg-gray-100"
                          }`}
                      >
                        <FaBox className="text-green-500" />
                      </div>

                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                          Order Ref
                        </p>

                        <p className="font-bold text-sm">
                          #
                          {order._id
                            ?.toString()
                            .slice(-8)
                            .toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="w-full md:w-auto flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                      <div className="hidden sm:block text-right">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                          Order Date
                        </p>

                        <p className="text-sm font-semibold flex items-center justify-end gap-1">
                          <FaRegCalendarAlt
                            size={12}
                            className="text-gray-400"
                          />

                          {order.createdAt
                            ? new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                            : "N/A"}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 max-w-full">
                        {!refundVisible &&
                          !returnVisible && (
                            <>
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
                            </>
                          )}

                        {refundVisible && (
                          <div
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getRequestStyle(
                              order.refundRequest
                                ?.status
                            )}`}
                          >
                            Refund:{" "}
                            {
                              order.refundRequest
                                ?.status
                            }
                          </div>
                        )}

                        {returnVisible && (
                          <div
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getRequestStyle(
                              order.returnRequest
                                ?.status
                            )}`}
                          >
                            Return:{" "}
                            {
                              order.returnRequest
                                ?.status
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 min-w-0">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-3 min-w-0">
                          <div className="flex -space-x-2 overflow-hidden">
                            {order.items
                              ?.slice(0, 3)
                              .map((item, i) => (
                                <div
                                  key={
                                    item.productId ||
                                    item._id ||
                                    i
                                  }
                                  className={`w-12 h-12 rounded-xl border-2 ${isDark
                                    ? "border-gray-900 bg-gray-800"
                                    : "border-white bg-gray-100"
                                    } flex items-center justify-center overflow-hidden`}
                                >
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={
                                        item.name ||
                                        "Product"
                                      }
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <FaBox
                                      className="text-gray-400"
                                      size={14}
                                    />
                                  )}
                                </div>
                              ))}

                            {order.items?.length >
                              3 && (
                                <div
                                  className={`w-12 h-12 rounded-xl border-2 ${isDark
                                    ? "border-gray-900 bg-gray-800"
                                    : "border-white bg-gray-100"
                                    } flex items-center justify-center`}
                                >
                                  <span className="text-xs font-bold text-gray-500">
                                    +
                                    {order.items
                                      .length - 3}
                                  </span>
                                </div>
                              )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-bold ${textColor} line-clamp-2 break-words`}
                            >
                              {firstItem?.name ||
                                "Product"}

                              {order.items?.length >
                                1 &&
                                ` + ${order.items.length -
                                1
                                } more item${order.items
                                  .length -
                                  1 >
                                  1
                                  ? "s"
                                  : ""
                                }`}
                            </p>

                            <p
                              className={`text-sm ${secondaryText} break-words`}
                            >
                              {order.items?.length ||
                                0}{" "}
                              {order.items?.length ===
                                1
                                ? "item"
                                : "items"}{" "}
                              •{" "}
                              {firstItem?.vendor
                                ?.storeName ||
                                firstItem?.vendorName ||
                                order.vendor?.storeName ||
                                "Vendor"}
                            </p>
                          </div>
                        </div>

                        {/* Delivery & Payment */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="font-semibold text-gray-500 uppercase tracking-tighter mb-1">
                              Delivery
                            </p>

                            <p
                              className={`${textColor} capitalize`}
                            >
                              {order.delivery
                                ?.method ||
                                "Standard"}{" "}
                              to{" "}
                              {order.delivery
                                ?.state ||
                                "State"}
                            </p>
                          </div>

                          <div>
                            <p className="font-semibold text-gray-500 uppercase tracking-tighter mb-1">
                              Payment
                            </p>

                            <p
                              className={`${textColor} capitalize`}
                            >
                              {order.payment
                                ?.method ||
                                "N/A"}{" "}
                              •{" "}
                              {paymentStatus}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Price + Action */}
                      <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-4 lg:flex-col lg:items-end lg:gap-4 shrink-0">
                        <div className="text-left lg:text-right">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                            Total
                          </p>

                          <p className="text-xl sm:text-2xl font-black text-green-600 whitespace-nowrap">
                            ₦
                            {Number(
                              order.pricing
                                ?.total || 0
                            ).toLocaleString()}
                          </p>

                          {Number(
                            order.pricing
                              ?.subtotal || 0
                          ) !==
                            Number(
                              order.pricing
                                ?.total || 0
                            ) && (
                              <p className="text-xs text-gray-500 max-w-[260px] break-words">
                                Subtotal: ₦
                                {Number(
                                  order.pricing
                                    ?.subtotal || 0
                                ).toLocaleString()}

                                {Number(
                                  order.pricing
                                    ?.deliveryFee || 0
                                ) > 0 &&
                                  ` + Delivery: ₦${Number(
                                    order.pricing
                                      ?.deliveryFee || 0
                                  ).toLocaleString()}`}

                                {Number(
                                  order.pricing?.tax ||
                                  0
                                ) > 0 &&
                                  ` + Tax: ₦${Number(
                                    order.pricing?.tax ||
                                    0
                                  ).toLocaleString()}`}
                              </p>
                            )}
                        </div>

                        <Link
                          to={`/buyer/orders/${order._id}`}
                          className={`p-4 rounded-2xl ${isDark
                            ? "bg-gray-800 hover:bg-gray-700"
                            : "bg-gray-100 hover:bg-gray-200"
                            } transition-all group-hover:scale-105 active:scale-95 text-green-600 shadow-sm`}
                        >
                          <FaChevronRight />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-800">
                    <div
                      className={`h-full transition-all duration-1000 ${deliveryStatus ===
                        "delivered"
                        ? "w-full bg-emerald-500"
                        : deliveryStatus ===
                          "shipped"
                          ? "w-2/3 bg-blue-500"
                          : deliveryStatus ===
                            "confirmed"
                            ? "w-1/2 bg-purple-500"
                            : deliveryStatus ===
                              "cancelled"
                              ? "w-full bg-red-500"
                              : "w-1/3 bg-amber-500"
                        }`}
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

export default Orders;