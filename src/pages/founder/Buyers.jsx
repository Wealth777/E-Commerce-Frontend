import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/apiClient';
import { getMessage } from '../../utils/apiResponse';
import {
  Users,
  UserCheck,
  Ban,
  Lock,
  Unlock,
  RefreshCw,
  Search,
  LayoutGrid,
  List,
  MoreVertical,
  AlertCircle,
  Mail,
  Phone,
  Building2,
  Calendar,
  Trash2,
  CheckCircle2,
  ShoppingBag,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BuyersManagement() {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // View & Filter States
  const [viewMode, setViewMode] = useState('table');
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Data & API States
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [buyers, setBuyers] = useState([]);
  const [activeActionMenu, setActiveActionMenu] = useState(null);

  // Statistics State
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    locked: 0,
    banned: 0,
    deleted: 0,
  });

  // Fetch Buyers Data
  const fetchBuyers = async () => {
    setLoading(true);
    setHasError(false);

    try {
      const response = await apiClient.get('/founder/buyers');

      const data = response.data?.data || [];

      setBuyers(data);

      setStats({
        total: data.length,
        active: data.filter(
          (buyer) => buyer.accountStatus === 'active'
        ).length,
        locked: data.filter(
          (buyer) => buyer.accountStatus === 'locked'
        ).length,
        banned: data.filter(
          (buyer) => buyer.accountStatus === 'banned'
        ).length,
        deleted: data.filter(
          (buyer) => buyer.accountStatus === 'deleted'
        ).length,
      });
    } catch (err) {
      setHasError(true);
      setErrorMessage(
        getMessage(err, 'Failed to load buyers')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  // Buyer Action Handlers
  const handleBuyerAction = async (buyerId, action) => {
    setActiveActionMenu(null);

    try {
      const endpoint = `/founder/buyers/${buyerId}`;

      if (action === 'delete') {
        await apiClient.delete(endpoint);
      } else {
        await apiClient.patch(`${endpoint}/${action}`);
      }

      const messages = {
        lock: 'Buyer account locked successfully',
        unlock: 'Buyer account unlocked successfully',
        ban: 'Buyer account banned successfully',
        delete: 'Buyer account deleted successfully',
      };

      showToast(messages[action], 'success');

      fetchBuyers();
    } catch (err) {
      showToast(
        getMessage(err, `Failed to ${action} buyer`),
        'error'
      );
    }
  };

  // Filter & Sort Logic
  const filteredBuyers = buyers
    .filter((buyer) => {
      const status = buyer.accountStatus;

      const matchesTab =
        activeTab === 'All'
          ? true
          : activeTab.toLowerCase() === status?.toLowerCase();

      const institutionName =
        typeof buyer.institution === 'object'
          ? buyer.institution?.name
          : buyer.institution;

      const search = searchQuery.toLowerCase();

      const matchesSearch =
        buyer.fullName?.toLowerCase().includes(search) ||
        buyer.email?.toLowerCase().includes(search) ||
        institutionName?.toLowerCase().includes(search) ||
        buyer.phoneNo?.toLowerCase().includes(search);

      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sortBy === 'name') {
        return (a.fullName || '').localeCompare(b.fullName || '');
      }

      return 0;
    });

  // Dynamic Status Badge Helper
  const renderStatusBadge = (status) => {
    const statusMap = {
      active: isDark
        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200',

      suspended: isDark
        ? 'bg-amber-950/80 text-amber-400 border-amber-800'
        : 'bg-amber-50 text-amber-700 border-amber-200',

      locked: isDark
        ? 'bg-purple-950/80 text-purple-400 border-purple-800'
        : 'bg-purple-50 text-purple-700 border-purple-200',

      banned: isDark
        ? 'bg-rose-950/80 text-rose-400 border-rose-800'
        : 'bg-rose-50 text-rose-700 border-rose-200',

      deleted: isDark
        ? 'bg-gray-800 text-gray-400 border-gray-700'
        : 'bg-gray-100 text-gray-600 border-gray-300',
    };

    const labelMap = {
      active: 'Active',
      suspended: 'Suspended',
      locked: 'Locked',
      banned: 'Banned',
      deleted: 'Deleted',
    };

    return (
      <span
        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusMap[status] || statusMap.active
          }`}
      >
        {labelMap[status] || 'Unknown'}
      </span>
    );
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-slate-100' : 'bg-[#F8FAFC] text-slate-800'} p-4 sm:p-6 lg:p-8 transition-colors`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header & Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400 mb-1 font-medium">
              <button onClick={() => navigate(-1)} className={`group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-500 transition-colors mb-2 rounded-full px-3 py-1.5 ${isDark ? "bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 ring-1 ring-white/10" : "bg-white/70 hover:bg-white text-zinc-600 ring-1 ring-zinc-900/5"}`}>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
            </div>
            <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              All Buyers
            </h1>
            <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'} mt-1 max-w-2xl`}>
              Manage student shopping accounts, review active status, handle access locks, and enforce campus trading guidelines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchBuyers}
              disabled={loading}
              className={`px-4 py-2.5 text-xs font-semibold rounded-lg border flex items-center gap-2 transition-all shadow-sm ${isDark
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Buyers */}
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-slate-200'} shadow-sm flex items-start gap-4`}>
            <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-500'}`}>
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">TOTAL BUYERS</p>
              <p className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {hasError ? '—' : stats.total}
              </p>
            </div>
          </div>

          {/* Active Buyers */}
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-emerald-50/40 border-emerald-200/80'} shadow-sm flex items-start gap-4`}>
            <div className={`p-3 rounded-xl ${isDark ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase">ACTIVE BUYERS</p>
              <p className={`text-xl font-bold mt-1 ${isDark ? 'text-emerald-300' : 'text-slate-800'}`}>
                {hasError ? '—' : stats.active}
              </p>
            </div>
          </div>

          {/* Locked Accounts */}
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-slate-200'} shadow-sm flex items-start gap-4`}>
            <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-950/60 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">LOCKED</p>
              <p className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {hasError ? '—' : stats.locked}
              </p>
            </div>
          </div>

          {/* Banned Accounts */}
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-slate-200'} shadow-sm flex items-start gap-4`}>
            <div className={`p-3 rounded-xl ${isDark ? 'bg-rose-950/60 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">BANNED</p>
              <p className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {hasError ? '—' : stats.banned}
              </p>
            </div>
          </div>

          {/* Deleted Accounts */}
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-slate-200'} shadow-sm flex items-start gap-4`}>
            <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-slate-100 text-slate-600'}`}>
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">DELETED</p>
              <p className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {hasError ? '—' : stats.deleted}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className={`rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} shadow-sm transition-all overflow-hidden`}>

          {/* Filters, Search & View Mode Switcher */}
          <div className="p-4 md:p-6 border-b border-slate-200 dark:border-gray-700 space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search buyer name, email, or campus..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border transition-all outline-none ${isDark
                    ? 'bg-gray-900 border-gray-700 text-white focus:border-emerald-500'
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-600 focus:bg-white'
                    }`}
                />
              </div>

              {/* View Mode & Sorting Controls */}
              <div className="flex items-center justify-between lg:justify-end gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`px-3 py-2 text-xs rounded-xl border font-medium outline-none ${isDark
                      ? 'bg-gray-900 border-gray-700 text-gray-200'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="name">Buyer Name</option>
                  </select>
                </div>

                {/* View Switcher Buttons */}
                <div className={`p-1 rounded-xl border flex items-center gap-1 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-slate-100 border-slate-200'}`}>
                  <button
                    onClick={() => setViewMode('table')}
                    title="Table View"
                    className={`p-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'table'
                      ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-gray-300'
                      }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('card')}
                    title="Card View"
                    className={`p-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'card'
                      ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-gray-300'
                      }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar">
              {['All', 'Active', 'Locked', 'Banned', 'Deleted'].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${isActive
                      ? 'bg-[#064E3B] text-white shadow-sm'
                      : isDark
                        ? 'bg-gray-900/60 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body Section: API Error vs Data Views */}
          {hasError ? (
            /* Error Fallback Box */
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-rose-500 mb-3">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-slate-800'} mb-1`}>
                Couldn't load this section
              </h3>
              <p className="text-xs text-slate-400 mb-4 font-mono">{errorMessage}</p>
              <button
                onClick={fetchBuyers}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border flex items-center gap-2 transition-colors ${isDark
                  ? 'border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-200'
                  : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try again</span>
              </button>
            </div>
          ) : filteredBuyers.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center text-xs text-slate-400">
              No buyers found matching your search.
            </div>
          ) : viewMode === 'table' ? (
            /* Layout 1: Table View */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-gray-700 bg-gray-900/40 text-gray-400' : 'border-slate-100 bg-slate-50/50 text-slate-400'} text-[11px] font-bold uppercase tracking-wider`}>
                    <th className="py-3.5 px-6">Buyer Name</th>
                    <th className="py-3.5 px-6">Campus</th>
                    <th className="py-3.5 px-6">Contact Info</th>
                    <th className="py-3.5 px-6">Orders Count</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-700/60 text-xs">
                  {filteredBuyers.map((buyer) => (
                    <tr key={buyer.id || buyer._id} className={`group hover:${isDark ? 'bg-gray-700/30' : 'bg-slate-50/80'} transition-colors`}>
                      <td className="py-4 px-6 font-bold text-slate-800 dark:text-white">
                        {buyer.fullName || 'Student Buyer'}
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-gray-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{buyer.institution?.name || 'Main Campus'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-gray-400 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{buyer.email}</span>
                        </div>
                        {buyer.phoneNo && (
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{buyer.phoneNo}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-700 dark:text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                          <span>{buyer.totalOrder ?? 0} orders</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">{renderStatusBadge(buyer.accountStatus)}</td>
                      <td className="py-4 px-6 text-right relative">
                        <div className="inline-block text-left">
                          <button
                            onClick={() => setActiveActionMenu(activeActionMenu === buyer._id ? null : buyer._id)}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-slate-100 text-slate-500'
                              }`}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Action Dropdown Menu */}
                          {activeActionMenu === buyer._id && (
                            <BuyerActionDropdown
                              buyer={buyer}
                              onAction={handleBuyerAction}
                              onClose={() => setActiveActionMenu(null)}
                              isDark={isDark}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Layout 2: Card Grid View */
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBuyers.map((buyer) => (
                <div
                  key={buyer._id || buyer._id}
                  className={`p-5 rounded-xl border ${isDark ? 'bg-gray-900/60 border-gray-700 hover:border-gray-600' : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                    } transition-all space-y-4 relative flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {buyer.fullName || 'Student Buyer'}
                        </h4>
                        <p className="text-xs text-slate-400">{buyer.institution?.name || 'Campus Student'}</p>
                      </div>
                      {renderStatusBadge(buyer.accountStatus)}
                    </div>

                    <div className="space-y-2 text-xs text-slate-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{buyer.email}</span>
                      </div>
                      {buyer.phoneNo && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{buyer.phoneNo}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                        <span>{buyer.totalOrder ?? 0} Orders</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-3 border-t border-slate-200 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined {new Date(buyer.createdAt || Date.now()).toLocaleDateString()}
                    </span>

                    <div className="relative">
                      <button
                        onClick={() => setActiveActionMenu(activeActionMenu === buyer._id ? null : buyer._id)}
                        className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${isDark ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-slate-200 hover:bg-white text-slate-600'
                          }`}
                      >
                        <span>Actions</span>
                        <MoreVertical className="w-3 h-3" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeActionMenu === buyer._id && (
                        <BuyerActionDropdown
                          buyer={buyer}
                          onAction={handleBuyerAction}
                          onClose={() => setActiveActionMenu(null)}
                          isDark={isDark}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Metadata */}
          <div className="p-4 border-t border-slate-100 dark:border-gray-700/60 text-xs text-slate-400 flex items-center justify-between">
            <span>CampusTrade · Founder Console — data shown reflects live API responses.</span>
            <span>Showing {filteredBuyers.length} buyers</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Dedicated Action Menu Component for Buyers */
function BuyerActionDropdown({ buyer, onAction, onClose, isDark }) {
  const isLocked = buyer.accountStatus === 'locked';
  const isBanned = buyer.accountStatus === 'banned';
  const isDeleted = buyer.accountStatus === 'deleted';

  return (
    <>
      <div
        className="fixed inset-0 z-10"
        onClick={onClose}
      />

      <div
        className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border z-20 py-1.5 text-xs font-medium ${isDark
          ? 'bg-gray-800 border-gray-700 text-gray-200'
          : 'bg-white border-slate-200 text-slate-700'
          }`}
      >
        <div className="px-3 py-1.5 border-b border-slate-100 dark:border-gray-700 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
          Buyer Actions
        </div>

        {!isDeleted && !isBanned && (
          <>
            {!isLocked ? (
              <button
                onClick={() => onAction(buyer._id, 'lock')}
                className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-gray-700 flex items-center gap-2 text-amber-600 dark:text-amber-400"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Account</span>
              </button>
            ) : (
              <button
                onClick={() => onAction(buyer._id, 'unlock')}
                className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-gray-700 flex items-center gap-2 text-emerald-600 dark:text-emerald-400"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Unlock Account</span>
              </button>
            )}

            <button
              onClick={() => onAction(buyer._id, 'ban')}
              className="w-full px-3 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Ban Account</span>
            </button>
          </>
        )}

        {!isDeleted && (
          <>
            <div className="my-1 border-t border-slate-100 dark:border-gray-700" />

            <button
              onClick={() => onAction(buyer._id, 'delete')}
              className="w-full px-3 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account</span>
            </button>
          </>
        )}
      </div>
    </>
  );
}