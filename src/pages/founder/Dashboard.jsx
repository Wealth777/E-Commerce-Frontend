import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import apiClient from "../../api/apiClient";
import { getMessage } from "../../utils/apiResponse";

import {
  Users,
  Store,
  Package,
  ShoppingBag,
  Headphones,
  Settings,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Clock3,
  Activity,
} from "lucide-react";

export default function FounderDashboard() {
  const { user } = useSelector((state) => state.auth);
  const { showToast } = useToast();
  const { isDark } = useTheme();

  const [syncedTime, setSyncedTime] = useState(
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [statsData, setStatsData] = useState({
    users: 0,
    buyers: 0,
    vendors: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    pendingApprovals: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);

  const [sectionErrors, setSectionErrors] = useState({
    overview: false,
    recentActivities: false,
    recentSupport: false,
  });

  const fetchFounderStats = async () => {
    setIsRefreshing(true);

    try {
      const response = await apiClient.get("/founder/dashboard/stats");

      const responseData = response?.data || {};

      const payload =
        responseData?.data &&
        typeof responseData.data === "object"
          ? responseData.data
          : responseData;

      setStatsData({
        users: payload?.totalUsers ?? 0,
        buyers: payload?.totalBuyers ?? 0,
        vendors: payload?.totalVendors ?? 0,
        products: payload?.totalProducts ?? 0,
        orders: payload?.totalOrders ?? 0,

        revenue: payload?.totalRevenue ?? 0,

        pendingApprovals:
          payload?.pendingVendorApprovals ?? 0,
      });

      setRecentActivities(
        Array.isArray(payload?.recentActivities)
          ? payload.recentActivities
          : []
      );

      setSectionErrors((prev) => ({
        ...prev,
        overview: false,
        recentActivities: false,
      }));

      setSyncedTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch (error) {
      const message = getMessage(
        error,
        "Failed to update founder dashboard stats"
      );

      showToast(message, "error");

      setSectionErrors((prev) => ({
        ...prev,
        overview: true,
        recentActivities: true,
      }));
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFounderStats();
  }, []);

  const handleRetry = () => {
    fetchFounderStats();
  };

  // Dynamic founder name
  const founderName =
    user?.fullName ||
    user?.name ||
    user?.firstName ||
    "Founder";

  // Format activity action
  const formatActivityAction = (action) => {
    if (!action) {
      return "performed an activity";
    }

    return action
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // Get actor name
  const getActivityActor = (activity) => {
    return (
      activity?.actor?.fullName ||
      activity?.user?.fullName ||
      "Unknown user"
    );
  };

  // Get actor serial number
  const getActivitySerialNumber = (activity) => {
    return (
      activity?.actor?.serialNumber ||
      activity?.user?.serialNumber ||
      null
    );
  };

  // Get activity role
  const getActivityRole = (activity) => {
    return (
      activity?.actorRole ||
      activity?.role ||
      null
    );
  };

  // Format role
  const formatRole = (role) => {
    if (!role) {
      return "";
    }

    return role
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // Format activity time
  const formatActivityDate = (date) => {
    if (!date) {
      return "Unknown time";
    }

    const activityDate = new Date(date);

    if (Number.isNaN(activityDate.getTime())) {
      return "Unknown time";
    }

    const now = new Date();
    const difference =
      now.getTime() - activityDate.getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} minute${
        minutes === 1 ? "" : "s"
      } ago`;
    }

    if (hours < 24) {
      return `${hours} hour${
        hours === 1 ? "" : "s"
      } ago`;
    }

    if (days < 7) {
      return `${days} day${
        days === 1 ? "" : "s"
      } ago`;
    }

    return activityDate.toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? "bg-gray-900 text-slate-100"
          : "bg-[#F8FAFC] text-slate-800"
      } transition-all duration-300 antialiased font-sans selection:bg-green-500 selection:text-white`}
    >
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">

          {/* Welcome Banner Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 p-6 md:p-10 shadow-md">
            <div className="absolute inset-0 opacity-10">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 100 C 20 0 50 0 100 100 Z"
                  fill="white"
                />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm font-medium text-white/90 mb-1">
                  Welcome back,
                </p>

                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                  {founderName}!
                </h1>

                <p className="text-black text-sm md:text-base max-w-xl leading-relaxed">
                  Here's a clear overview of your platform's performance, activity, and pending tasks for today.
                </p>
              </div>

              <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                <button
                  onClick={fetchFounderStats}
                  disabled={isRefreshing}
                  className="w-full md:w-auto bg-[#052E16] hover:bg-[#14532D] text-white text-xs font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />

                  <span>
                    {isRefreshing
                      ? "Refreshing..."
                      : "Refresh data"}
                  </span>
                </button>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-white/20 flex items-center gap-4 text-xs text-white/80">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                Founder access · {founderName}
              </span>

              <span>|</span>

              <span>Synced {syncedTime}</span>
            </div>
          </div>

          {/* Platform Overview Metrics */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className={`text-base font-bold ${
                    isDark
                      ? "text-white"
                      : "text-slate-800"
                  }`}
                >
                  Platform Overview
                </h3>

                <p
                  className={`text-xs ${
                    isDark
                      ? "text-gray-400"
                      : "text-slate-400"
                  }`}
                >
                  Live marketplace figures across users, catalogue and revenue.
                </p>
              </div>

              {sectionErrors.overview && (
                <span className="bg-rose-50 text-rose-600 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-rose-100">
                  Statistics unavailable
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {[
                {
                  title: "TOTAL USERS",
                  desc: "All registered accounts",
                  value: statsData.users,
                  icon: Users,
                },
                {
                  title: "TOTAL BUYERS",
                  desc: "Students shopping on campus",
                  value: statsData.buyers,
                  icon: ShoppingBag,
                },
                {
                  title: "TOTAL VENDORS",
                  desc: "Active selling accounts",
                  value: statsData.vendors,
                  icon: Store,
                },
                {
                  title: "TOTAL PRODUCTS",
                  desc: "Listings across all stores",
                  value: statsData.products,
                  icon: Package,
                },
                {
                  title: "TOTAL ORDERS",
                  desc: "Orders placed to date",
                  value: statsData.orders,
                  icon: ShoppingBag,
                },

                // Revenue remains part of the original page.
                // Backend does not currently send totalRevenue.
                // {
                //   title: "TOTAL REVENUE",
                //   desc: "Gross marketplace value",
                //   value: statsData.revenue
                //     ? `₦${Number(
                //         statsData.revenue
                //       ).toLocaleString()}`
                //     : null,
                //   icon: Store,
                // },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className={`${
                    isDark
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-slate-200"
                  } border rounded-xl p-5 flex justify-between items-start transition-colors transition-all`}
                >
                  <div>
                    <p
                      className={`text-[11px] font-bold ${
                        isDark
                          ? "text-gray-400"
                          : "text-slate-400"
                      } tracking-wider mb-1`}
                    >
                      {card.title}
                    </p>

                    <p
                      className={`text-xl font-bold ${
                        isDark
                          ? "text-white"
                          : "text-slate-700"
                      } mb-2`}
                    >
                      {sectionErrors.overview
                        ? "—"
                        : card.value ?? "—"}
                    </p>

                    <p
                      className={`text-xs ${
                        isDark
                          ? "text-gray-400"
                          : "text-slate-400"
                      }`}
                    >
                      {card.desc}
                    </p>
                  </div>

                  <div
                    className={`p-2.5 ${
                      isDark
                        ? "bg-green-400/20 border-gray-600 text-gray-300"
                        : "bg-green-400/20 border-slate-100 text-slate-400"
                    } border rounded-lg group-hover:scale-110 transition-transform`}
                  >
                    <card.icon className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pending Approvals */}
          <section
            className={`${
              isDark
                ? "bg-amber-950/20 border-amber-900/40"
                : "bg-amber-50/40 border-amber-200/60"
            } border rounded-xl p-5 flex items-center justify-between`}
          >
            <div>
              <p
                className={`text-[11px] font-bold ${
                  isDark
                    ? "text-amber-400"
                    : "text-slate-500"
                } uppercase tracking-wider mb-1`}
              >
                PENDING APPROVALS
              </p>

              <p
                className={`text-lg font-bold ${
                  isDark
                    ? "text-white"
                    : "text-slate-700"
                } mb-1`}
              >
                {sectionErrors.overview
                  ? "—"
                  : statsData.pendingApprovals}
              </p>

              <p
                className={`text-xs ${
                  isDark
                    ? "text-gray-400"
                    : "text-slate-500"
                }`}
              >
                Requests waiting on your review
              </p>
            </div>

            <div
              className={`p-2 ${
                isDark
                  ? "bg-amber-900/50 text-amber-300"
                  : "bg-amber-100/50 text-amber-600"
              } rounded-lg`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
          </section>

          {/* Quick Links */}
          <section>
            <div className="mb-4">
              <h3
                className={`text-base font-bold ${
                  isDark
                    ? "text-white"
                    : "text-slate-800"
                }`}
              >
                Quick Links
              </h3>

              <p
                className={`text-xs ${
                  isDark
                    ? "text-gray-400"
                    : "text-slate-400"
                }`}
              >
                Jump straight into the areas you manage most.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Manage Users",
                  sub: "Buyers & accounts",
                  icon: Users,
                  href: "/founder/buyers",
                },
                {
                  title: "Manage Vendors",
                  sub: "Stores & approvals",
                  icon: Store,
                  href: "/founder/vendors",
                },
                {
                  title: "Manage Products",
                  sub: "Catalogue control",
                  icon: Package,
                  href: "/founder/products",
                },
                {
                  title: "Manage Orders",
                  sub: "Transactions",
                  icon: ShoppingBag,
                  href: "/founder/orders",
                },
                {
                  title: "Support Tickets",
                  sub: "Complaints queue",
                  icon: Headphones,
                  href: "/founder/support",
                },
                {
                  title: "Settings",
                  sub: "Platform config",
                  icon: Settings,
                  href: "/founder/settings",
                },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className={`group ${
                    isDark
                      ? "bg-gray-800 border-gray-700 hover:border-emerald-500"
                      : "bg-white border-slate-200 hover:border-emerald-600"
                  } border rounded-xl p-5 flex justify-between items-start transition-all shadow-sm hover:shadow-md`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`p-2.5 ${
                        isDark
                          ? "bg-emerald-950/60 text-emerald-400"
                          : "bg-emerald-50 text-emerald-700"
                      } rounded-lg`}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>

                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          isDark
                            ? "text-white group-hover:text-emerald-400"
                            : "text-slate-800 group-hover:text-emerald-700"
                        } transition-colors`}
                      >
                        {item.title}
                      </h4>

                      <p
                        className={`text-xs ${
                          isDark
                            ? "text-gray-400"
                            : "text-slate-400"
                        }`}
                      >
                        {item.sub}
                      </p>
                    </div>
                  </div>

                  <ExternalLink
                    className={`w-3.5 h-3.5 ${
                      isDark
                        ? "text-gray-500 group-hover:text-emerald-400"
                        : "text-slate-300 group-hover:text-emerald-600"
                    } transition-colors`}
                  />
                </a>
              ))}
            </div>
          </section>

          {/* Revenue Performance & Marketplace Mix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Revenue Performance Card */}
            <div
              className={`lg:col-span-2 ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-slate-200"
              } border rounded-xl p-6 min-h-[260px] flex flex-col justify-between`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4
                    className={`text-sm font-bold ${
                      isDark
                        ? "text-white"
                        : "text-slate-800"
                    }`}
                  >
                    Revenue Performance
                  </h4>

                  <p
                    className={`text-xs ${
                      isDark
                        ? "text-gray-400"
                        : "text-slate-400"
                    }`}
                  >
                    Gross marketplace revenue reported by the API
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-[10px] font-bold ${
                      isDark
                        ? "text-gray-400"
                        : "text-slate-400"
                    } uppercase`}
                  >
                    TOTAL REVENUE
                  </p>

                  <p
                    className={`text-sm font-bold ${
                      isDark
                        ? "text-white"
                        : "text-slate-700"
                    }`}
                  >
                    {sectionErrors.overview
                      ? "—"
                      : statsData.revenue
                      ? `₦${Number(
                          statsData.revenue
                        ).toLocaleString()}`
                      : "—"}
                  </p>
                </div>
              </div>

              {sectionErrors.overview ? (
                <div
                  className={`my-6 py-6 border border-dashed ${
                    isDark
                      ? "border-gray-700 bg-gray-900/50"
                      : "border-slate-200 bg-slate-50/50"
                  } rounded-lg flex flex-col items-center justify-center text-center`}
                >
                  <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-2">
                    <AlertCircle className="w-4 h-4" />
                  </div>

                  <p
                    className={`text-sm font-semibold ${
                      isDark
                        ? "text-gray-300"
                        : "text-slate-700"
                    } mb-0.5`}
                  >
                    Couldn't load this section
                  </p>

                  <p className="text-xs text-slate-400 mb-3 font-mono">
                    Check API status endpoint
                  </p>

                  <button
                    onClick={handleRetry}
                    className={`px-3 py-1.5 border ${
                      isDark
                        ? "border-gray-600 hover:bg-gray-800 text-gray-300"
                        : "border-slate-300 hover:bg-white text-slate-600"
                    } rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Try again</span>
                  </button>
                </div>
              ) : (
                <div
                  className={`my-6 py-8 flex items-center justify-center ${
                    isDark
                      ? "text-gray-400"
                      : "text-slate-400"
                  } text-sm`}
                >
                  [Chart Rendered Successfully]
                </div>
              )}
            </div>

            {/* Marketplace Mix */}
            <div
              className={`${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-slate-200"
              } border rounded-xl p-6 flex flex-col justify-between`}
            >
              <div>
                <h4
                  className={`text-sm font-bold ${
                    isDark
                      ? "text-white"
                      : "text-slate-800"
                  }`}
                >
                  Marketplace Mix
                </h4>

                <p
                  className={`text-xs ${
                    isDark
                      ? "text-gray-400"
                      : "text-slate-400"
                  }`}
                >
                  Buyers and vendors share of total platform
                </p>
              </div>

              <div className="my-8 text-center">
                <p
                  className={`text-xs ${
                    isDark
                      ? "text-gray-400"
                      : "text-slate-400"
                  } max-w-[200px] mx-auto`}
                >
                  Composition unavailable while statistics can't be loaded.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activities Section */}
          <section
            className={`${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-slate-200"
            } border rounded-xl p-6`}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4
                  className={`text-sm font-bold ${
                    isDark
                      ? "text-white"
                      : "text-slate-800"
                  }`}
                >
                  Recent Activities
                </h4>

                <p
                  className={`text-xs ${
                    isDark
                      ? "text-gray-400"
                      : "text-slate-400"
                  }`}
                >
                  Registrations, orders, onboarding and payments
                </p>
              </div>

              <a
                href="/founder/activities"
                className={`text-xs font-bold ${
                  isDark
                    ? "text-emerald-400"
                    : "text-emerald-700"
                } hover:underline flex items-center gap-1`}
              >
                <span>View All Activities</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {sectionErrors.recentActivities ? (
              <div
                className={`py-10 border border-dashed ${
                  isDark
                    ? "border-gray-700 bg-gray-900/50"
                    : "border-slate-200 bg-slate-50/50"
                } rounded-lg flex flex-col items-center justify-center text-center`}
              >
                <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-2">
                  <AlertCircle className="w-4 h-4" />
                </div>

                <p
                  className={`text-sm font-semibold ${
                    isDark
                      ? "text-gray-300"
                      : "text-slate-700"
                  } mb-0.5`}
                >
                  Couldn't load this section
                </p>

                <p className="text-xs text-slate-400 mb-3 font-mono">
                  Check API status endpoint
                </p>

                <button
                  onClick={handleRetry}
                  className={`px-3 py-1.5 border ${
                    isDark
                      ? "border-gray-600 hover:bg-gray-800 text-gray-300"
                      : "border-slate-300 hover:bg-white text-slate-600"
                  } rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors`}
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Try again</span>
                </button>
              </div>
            ) : recentActivities.length === 0 ? (
              <div
                className={`py-10 border border-dashed ${
                  isDark
                    ? "border-gray-700 bg-gray-900/50"
                    : "border-slate-200 bg-slate-50/50"
                } rounded-lg flex flex-col items-center justify-center text-center`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    isDark
                      ? "bg-gray-700 text-gray-400"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  <Activity className="w-4 h-4" />
                </div>

                <p
                  className={`text-sm font-semibold ${
                    isDark
                      ? "text-gray-300"
                      : "text-slate-700"
                  } mb-0.5`}
                >
                  No recent activities
                </p>

                <p className="text-xs text-slate-400">
                  No activities have been recorded yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity, index) => {
                  const actor =
                    activity?.actor?.fullName ||
                    activity?.user?.fullName ||
                    "Unknown user";

                  const actorSerial =
                    activity?.actor?.serialNumber ||
                    activity?.user?.serialNumber ||
                    null;

                  const targetUser =
                    activity?.user?.fullName || null;

                  const targetSerial =
                    activity?.user?.serialNumber || null;

                  const role =
                    activity?.actorRole ||
                    activity?.role ||
                    null;

                  const action = formatActivityAction(
                    activity?.action
                  );

                  return (
                    <div
                      key={
                        activity?._id ||
                        activity?.id ||
                        index
                      }
                      className={`flex items-start gap-4 p-4 rounded-xl border ${
                        isDark
                          ? "bg-gray-900/40 border-gray-700"
                          : "bg-slate-50/60 border-slate-100"
                      }`}
                    >
                      {/* Activity Icon */}
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          isDark
                            ? "bg-emerald-950/70 text-emerald-400"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        <Activity className="w-5 h-5" />
                      </div>

                      {/* Activity Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div>
                            <p
                              className={`text-sm font-semibold ${
                                isDark
                                  ? "text-white"
                                  : "text-slate-800"
                              }`}
                            >
                              {actor}{" - "}
                              <span className="font-normal">
                                {action.toLowerCase()}
                              </span>
                            </p>

                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              {actorSerial && (
                                <span
                                  className={`text-[11px] font-medium ${
                                    isDark
                                      ? "text-emerald-400"
                                      : "text-emerald-700"
                                  }`}
                                >
                                  {actorSerial}
                                </span>
                              )}

                              {role && (
                                <>
                                  {actorSerial && (
                                    <span
                                      className={
                                        isDark
                                          ? "text-gray-600"
                                          : "text-slate-300"
                                      }
                                    >
                                      •
                                    </span>
                                  )}

                                  <span
                                    className={`text-[11px] ${
                                      isDark
                                        ? "text-gray-400"
                                        : "text-slate-500"
                                    }`}
                                  >
                                    {formatRole(role)}
                                  </span>
                                </>
                              )}

                              {activity?.entity && (
                                <>
                                  <span
                                    className={
                                      isDark
                                        ? "text-gray-600"
                                        : "text-slate-300"
                                    }
                                  >
                                    •
                                  </span>

                                  <span
                                    className={`text-[11px] ${
                                      isDark
                                        ? "text-gray-400"
                                        : "text-slate-500"
                                    }`}
                                  >
                                    {activity.entity}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 text-[11px] flex-shrink-0 ${
                              isDark
                                ? "text-gray-500"
                                : "text-slate-400"
                            }`}
                          >
                            <Clock3 className="w-3.5 h-3.5" />

                            <span>
                              {formatActivityDate(
                                activity?.createdAt
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Target User */}
                        {targetUser && (
                          <div className="mt-2">
                            <p
                              className={`text-xs ${
                                isDark
                                  ? "text-gray-500"
                                  : "text-slate-400"
                              }`}
                            >
                              User:{" "}
                              <span
                                className={
                                  isDark
                                    ? "text-gray-300"
                                    : "text-slate-600"
                                }
                              >
                                {targetUser}
                              </span>

                              {targetSerial && (
                                <span className="ml-1">
                                  ({targetSerial})
                                </span>
                              )}
                            </p>
                          </div>
                        )}

                        {/* Reason */}
                        {activity?.reason && (
                          <p
                            className={`text-xs mt-2 ${
                              isDark
                                ? "text-gray-500"
                                : "text-slate-400"
                            }`}
                          >
                            Reason:{" "}
                            <span
                              className={
                                isDark
                                  ? "text-gray-300"
                                  : "text-slate-600"
                              }
                            >
                              {activity.reason}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Recent Support Section */}
          <section
            className={`${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-slate-200"
            } border rounded-xl p-6`}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4
                  className={`text-sm font-bold ${
                    isDark
                      ? "text-white"
                      : "text-slate-800"
                  }`}
                >
                  Recent Support
                </h4>

                <p
                  className={`text-xs ${
                    isDark
                      ? "text-gray-400"
                      : "text-slate-400"
                  }`}
                >
                  Complaints raised by buyers and vendors
                </p>
              </div>

              <a
                href="/founder/support"
                className={`text-xs font-bold ${
                  isDark
                    ? "text-emerald-400"
                    : "text-emerald-700"
                } hover:underline flex items-center gap-1`}
              >
                <span>View All Support Tickets</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* 
              Support backend is not connected yet.
              The section stays on the page.
            */}
            {sectionErrors.recentSupport ? (
              <div
                className={`py-10 border border-dashed ${
                  isDark
                    ? "border-gray-700 bg-gray-900/50"
                    : "border-slate-200 bg-slate-50/50"
                } rounded-lg flex flex-col items-center justify-center text-center`}
              >
                <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-2">
                  <AlertCircle className="w-4 h-4" />
                </div>

                <p
                  className={`text-sm font-semibold ${
                    isDark
                      ? "text-gray-300"
                      : "text-slate-700"
                  } mb-0.5`}
                >
                  Couldn't load this section
                </p>

                <p className="text-xs text-slate-400 mb-3 font-mono">
                  Check API status endpoint
                </p>

                <button
                  onClick={handleRetry}
                  className={`px-3 py-1.5 border ${
                    isDark
                      ? "border-gray-600 hover:bg-gray-800 text-gray-300"
                      : "border-slate-300 hover:bg-white text-slate-600"
                  } rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors`}
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Try again</span>
                </button>
              </div>
            ) : (
              <div
                className={`py-4 text-center text-xs ${
                  isDark
                    ? "text-gray-400"
                    : "text-slate-500"
                }`}
              >
                Support tickets loaded.
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}