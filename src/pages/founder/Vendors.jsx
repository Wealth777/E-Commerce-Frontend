import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/apiClient';
import { getMessage } from '../../utils/apiResponse';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  ShieldCheck,
  UserCheck,
  Ban,
  RefreshCw,
  Search,
  LayoutGrid,
  List,
  MoreVertical,
  Lock,
  Unlock,
  AlertCircle,
  Mail,
  Phone,
  Building2,
  Calendar,
  Trash2,
  ArrowLeft,
  X
} from 'lucide-react';

export default function VendorsManagement() {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // View & Filter States
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'card'
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Data & API States
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [vendors, setVendors] = useState([]);
  const [activeActionMenu, setActiveActionMenu] = useState(null);

  // Modal Action State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    vendor: null,
    action: null, // 'lock' | 'unlock' | 'ban' | 'delete'
    reason: '',
    isSubmitting: false,
  });

  // Statistics State
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    suspended: 0,
    locked: 0,
    banned: 0,
    deleted: 0,
  });

  // Fetch Vendors Data
  const fetchVendors = async () => {
    setLoading(true);
    setHasError(false);
    setErrorMessage('');

    try {
      const response = await apiClient.get('/founder/vendors');

      const vendorsData =
        response.data?.data?.vendors ||
        response.data?.vendors ||
        response.data?.data ||
        [];

      setVendors(Array.isArray(vendorsData) ? vendorsData : []);

      const data = Array.isArray(vendorsData) ? vendorsData : [];

      setStats({
        total: data.length,
        pending: data.filter(
          (v) => v.accountStatus?.toLowerCase() === 'pending'
        ).length,
        active: data.filter(
          (v) => v.accountStatus?.toLowerCase() === 'active'
        ).length,
        suspended: data.filter(
          (v) => v.accountStatus?.toLowerCase() === 'suspended'
        ).length,
        locked: data.filter(
          (v) => v.accountStatus?.toLowerCase() === 'locked'
        ).length,
        banned: data.filter(
          (v) => v.accountStatus?.toLowerCase() === 'banned'
        ).length,
        deleted: data.filter(
          (v) => v.accountStatus?.toLowerCase() === 'deleted'
        ).length,
      });
    } catch (err) {
      console.error('Fetch vendors error:', err);

      setVendors([]);
      setStats({
        total: 0,
        pending: 0,
        active: 0,
        suspended: 0,
        locked: 0,
        banned: 0,
        deleted: 0,
      });

      setHasError(true);
      setErrorMessage(
        getMessage(err, 'Failed to fetch vendors')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Initiate action: Open confirmation modal
  const openActionModal = (vendor, action) => {
    setActiveActionMenu(null);
    setConfirmModal({
      isOpen: true,
      vendor,
      action,
      reason: '',
      isSubmitting: false,
    });
  };

  // Submit action request with reason
  const handleConfirmAction = async () => {
    const { vendor, action, reason } = confirmModal;

    if (!reason.trim()) {
      showToast('Please enter a reason for this action', 'error');
      return;
    }

    const vendorId = vendor.id || vendor._id;
    setConfirmModal((prev) => ({ ...prev, isSubmitting: true }));

    try {
      if (action === 'delete') {
        await apiClient.delete(`/founder/vendors/${vendorId}`, {
          data: { reason },
        });
      } else {
        await apiClient.patch(`/founder/vendors/${vendorId}/${action}`, {
          reason,
        });
      }
      showToast(`Vendor account updated (${action}) successfully`, 'success');
      setConfirmModal({ isOpen: false, vendor: null, action: null, reason: '', isSubmitting: false });
      fetchVendors();
    } catch (err) {
      console.log(err)
      showToast(getMessage(err, `Failed to perform ${action} on vendor`), 'error');
      setConfirmModal((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const filteredVendors = vendors
    .filter((vendor) => {
      const status = vendor.accountStatus?.toLowerCase();

      const matchesTab =
        activeTab === 'All'
          ? true
          : status === activeTab.toLowerCase();

      const matchesSearch =
        vendor.business?.storeName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        vendor.fullName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        vendor.email
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

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
        return (a.business?.storeName || '').localeCompare(
          b.business?.storeName || ''
        );
      }

      return 0;
    });

  const renderStatusBadge = (status) => {
    const formattedStatus = status?.toLowerCase() || 'pending';

    const statusMap = {
      active: isDark ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pending: isDark ? 'bg-amber-950/80 text-amber-400 border-amber-800' : 'bg-amber-50 text-amber-700 border-amber-200',
      suspended: isDark ? 'bg-orange-950/80 text-orange-400 border-orange-800' : 'bg-orange-50 text-orange-700 border-orange-200',
      locked: isDark ? 'bg-purple-950/80 text-purple-400 border-purple-800' : 'bg-purple-50 text-purple-700 border-purple-200',
      banned: isDark ? 'bg-rose-950/80 text-rose-400 border-rose-800' : 'bg-rose-50 text-rose-700 border-rose-200',
      deleted: isDark ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-300',
    };

    return (
      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border capitalize ${statusMap[formattedStatus] || statusMap.pending}`}>
        {formattedStatus}
      </span>
    );
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-slate-100' : 'bg-[#F8FAFC] text-slate-800'} p-4 sm:p-6 lg:p-8 transition-colors`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400 mb-1 font-medium">
              <button onClick={() => navigate(-1)} className={`group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-500 transition-colors mb-2 rounded-full px-3 py-1.5 ${isDark ? "bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 ring-1 ring-white/10" : "bg-white/70 hover:bg-white text-zinc-600 ring-1 ring-zinc-900/5"}`}>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
            </div>
            <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              All Vendors
            </h1>
            <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'} mt-1 max-w-2xl`}>
              Review every store on CampusTrade, manage vendor standings, lock/unlock accounts, or apply bans.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchVendors}
              disabled={loading}
              className={`px-4 py-2.5 text-xs font-semibold rounded-lg border flex items-center gap-2 transition-all shadow-sm ${isDark
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-[#064E3B] hover:bg-[#04382B] text-white flex items-center gap-2 transition-all shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Review pending</span>
            </button>
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-slate-200'} shadow-sm flex items-center gap-3`}>
            <div className={`p-2.5 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-500'}`}>
              <Store className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">TOTAL</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{hasError ? '—' : stats.total}</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'bg-amber-950/20 border-amber-900/40' : 'bg-[#FFFBEB] border-amber-200/80'} shadow-sm flex items-center gap-3`}>
            <div className={`p-2.5 rounded-lg ${isDark ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-600/80 dark:text-amber-400 tracking-wider uppercase">PENDING</p>
              <p className={`text-lg font-bold ${isDark ? 'text-amber-300' : 'text-slate-800'}`}>{hasError ? '—' : stats.pending}</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'bg-emerald-950/20 border-emerald-900/40' : 'bg-emerald-50/50 border-emerald-200/80'} shadow-sm flex items-center gap-3`}>
            <div className={`p-2.5 rounded-lg ${isDark ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">ACTIVE</p>
              <p className={`text-lg font-bold ${isDark ? 'text-emerald-300' : 'text-slate-800'}`}>{hasError ? '—' : stats.active}</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'bg-purple-950/20 border-purple-900/40' : 'bg-purple-50/50 border-purple-200/80'} shadow-sm flex items-center gap-3`}>
            <div className={`p-2.5 rounded-lg ${isDark ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 tracking-wider uppercase">LOCKED</p>
              <p className={`text-lg font-bold ${isDark ? 'text-purple-300' : 'text-slate-800'}`}>{hasError ? '—' : stats.locked}</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'bg-rose-950/20 border-rose-900/40' : 'bg-rose-50/50 border-rose-200/80'} shadow-sm flex items-center gap-3`}>
            <div className={`p-2.5 rounded-lg ${isDark ? 'bg-rose-900/50 text-rose-400' : 'bg-rose-100 text-rose-600'}`}>
              <Ban className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 tracking-wider uppercase">BANNED</p>
              <p className={`text-lg font-bold ${isDark ? 'text-rose-300' : 'text-slate-800'}`}>{hasError ? '—' : stats.banned}</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-slate-200'} shadow-sm flex items-center gap-3`}>
            <div className={`p-2.5 rounded-lg ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-slate-100 text-slate-600'}`}>
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">DELETED</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{hasError ? '—' : stats.deleted}</p>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className={`rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} shadow-sm transition-all overflow-hidden`}>

          {/* Controls Header */}
          <div className="p-4 md:p-6 border-b border-slate-200 dark:border-gray-700 space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search store, owner or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border transition-all outline-none ${isDark
                    ? 'bg-gray-900 border-gray-700 text-white focus:border-emerald-500'
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-600 focus:bg-white'
                    }`}
                />
              </div>

              {/* View Switcher & Sorting Controls */}
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
                    <option value="name">Store Name</option>
                  </select>
                </div>

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
              {['All', 'pending', 'active', 'suspended', 'locked', 'banned', 'deleted'].map((tab) => {
                const isActive = activeTab.toLowerCase() === tab.toLowerCase();
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize whitespace-nowrap ${isActive
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

          {/* Section Body */}
          {hasError ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-rose-500 mb-3">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-slate-800'} mb-1`}>
                Couldn't load this section
              </h3>
              <p className="text-xs text-slate-400 mb-4 font-mono">{errorMessage}</p>
              <button
                onClick={fetchVendors}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border flex items-center gap-2 transition-colors ${isDark
                  ? 'border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-200'
                  : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try again</span>
              </button>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No vendors found matching your criteria.
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
            <div className="overflow-x-auto min-h-[320px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-gray-700 bg-gray-900/40 text-gray-400' : 'border-slate-100 bg-slate-50/50 text-slate-400'} text-[11px] font-bold uppercase tracking-wider`}>
                    <th className="py-3.5 px-6">Store & Owner</th>
                    <th className="py-3.5 px-6">Campus</th>
                    <th className="py-3.5 px-6">Contact</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-700/60 text-xs">
                  {filteredVendors.map((vendor) => {
                    const vendorId = vendor.id || vendor._id;
                    return (
                      <tr key={vendorId} className={`group hover:${isDark ? 'bg-gray-700/30' : 'bg-slate-50/80'} transition-colors`}>
                        <td className="py-4 px-6">
                          <div>
                            <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{vendor.business?.storeName || 'Unnamed Store'}</p>
                            <p className="text-slate-400 text-[11px] mt-0.5">{vendor.fullName || 'Unknown Owner'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-500 dark:text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{vendor.student?.institution?.name || 'Main Campus'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-500 dark:text-gray-400 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{vendor.email}</span>
                          </div>
                          {vendor.phoneNo && (
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{vendor.phoneNo}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">{renderStatusBadge(vendor.accountStatus)}</td>
                        <td className="py-4 px-6 text-right relative">
                          <div className="inline-block text-left relative">
                            <button
                              onClick={() => setActiveActionMenu(activeActionMenu === vendorId ? null : vendorId)}
                              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-slate-100 text-slate-500'}`}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {activeActionMenu === vendorId && (
                              <ActionDropdown
                                vendor={vendor}
                                onAction={(v, act) => openActionModal(v, act)}
                                onClose={() => setActiveActionMenu(null)}
                                isDark={isDark}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Card Grid View */
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVendors.map((vendor) => {
                const vendorId = vendor.id || vendor._id;
                return (
                  <div
                    key={vendorId}
                    className={`p-5 rounded-xl border ${isDark ? 'bg-gray-900/60 border-gray-700 hover:border-gray-600' : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'} transition-all space-y-4 relative flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{vendor.business?.storeName}</h4>
                          <p className="text-xs text-slate-400">{vendor.fullName}</p>
                        </div>
                        {renderStatusBadge(vendor.accountStatus)}
                      </div>

                      <div className="space-y-2 text-xs text-slate-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{vendor.student?.institution?.name || 'Main Campus'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{vendor.email}</span>
                        </div>
                        {vendor.phoneNo && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{vendor.phoneNo}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-gray-700 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Joined {new Date(vendor.createdAt || Date.now()).toLocaleDateString()}
                      </span>

                      <div className="relative">
                        <button
                          onClick={() => setActiveActionMenu(activeActionMenu === vendorId ? null : vendorId)}
                          className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${isDark ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-slate-200 hover:bg-white text-slate-600'}`}
                        >
                          <span>Actions</span>
                          <MoreVertical className="w-3 h-3" />
                        </button>

                        {activeActionMenu === vendorId && (
                          <ActionDropdown
                            vendor={vendor}
                            onAction={(v, act) => openActionModal(v, act)}
                            onClose={() => setActiveActionMenu(null)}
                            isDark={isDark}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer Metadata */}
          <div className="p-4 border-t border-slate-100 dark:border-gray-700/60 text-xs text-slate-400 flex items-center justify-between">
            <span>CampusTrade · Founder Console — data shown reflects live API responses.</span>
            <span>Showing {filteredVendors.length} vendors</span>
          </div>
        </div>
      </div>

      {/* Reason Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold capitalize flex items-center gap-2">
                {confirmModal.action === 'lock' && <Lock className="w-4 h-4 text-purple-500" />}
                {confirmModal.action === 'unlock' && <Unlock className="w-4 h-4 text-emerald-500" />}
                {confirmModal.action === 'ban' && <Ban className="w-4 h-4 text-rose-500" />}
                {confirmModal.action === 'delete' && <Trash2 className="w-4 h-4 text-rose-500" />}
                {confirmModal.action} Account
              </h3>
              <button
                onClick={() => setConfirmModal({ isOpen: false, vendor: null, action: null, reason: '', isSubmitting: false })}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-gray-400 mb-4">
              Please state the reason for updating <span className="font-semibold text-slate-700 dark:text-slate-200">{confirmModal.vendor?.business?.storeName || confirmModal.vendor?.fullName}</span>. This reason will be logged for administrative tracking.
            </p>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Reason / Justification
              </label>
              <textarea
                rows="3"
                value={confirmModal.reason}
                onChange={(e) => setConfirmModal((prev) => ({ ...prev, reason: e.target.value }))}
                placeholder={`Enter reason for ${confirmModal.action}ing this account...`}
                className={`w-full p-3 text-xs rounded-xl border outline-none transition-all resize-none ${isDark
                  ? 'bg-gray-900 border-gray-700 text-white focus:border-emerald-500'
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-600 focus:bg-white'
                  }`}
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal({ isOpen: false, vendor: null, action: null, reason: '', isSubmitting: false })}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-colors ${isDark ? 'border-gray-700 hover:bg-gray-700 text-gray-300' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmModal.isSubmitting || !confirmModal.reason.trim()}
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-xs font-semibold rounded-xl text-white transition-all flex items-center gap-2 ${
                  confirmModal.action === 'lock'
                    ? 'bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400'
                    : confirmModal.action === 'unlock'
                    ? 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400'
                    : 'bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400'
                }`}
              >
                {confirmModal.isSubmitting && <RefreshCw className="w-3 h-3 animate-spin" />}
                Confirm {confirmModal.action}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Action Menu Component: Conditionally displays Lock vs Unlock based on vendor status */
function ActionDropdown({ vendor, onAction, onClose, isDark }) {
  const isLocked = vendor?.accountStatus?.toLowerCase() === 'locked';

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose}></div>

      <div
        className={`absolute right-0 top-full mt-1 w-48 rounded-xl shadow-xl border z-40 py-1.5 text-xs font-medium lg:right-0 lg:left-auto ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-slate-200 text-slate-700'}`}
      >
        <div className="px-3 py-1.5 border-b border-slate-100 dark:border-gray-700 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
          Vendor Actions
        </div>

        {/* Dynamic Lock vs Unlock Check */}
        {isLocked ? (
          <button
            onClick={() => onAction(vendor, 'unlock')}
            className="w-full px-3 py-2 text-left hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center gap-2"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Unlock Account</span>
          </button>
        ) : (
          <button
            onClick={() => onAction(vendor, 'lock')}
            className="w-full px-3 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Account</span>
          </button>
        )}

        {/* Ban Action */}
        <button
          onClick={() => onAction(vendor, 'ban')}
          className="w-full px-3 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2"
        >
          <Ban className="w-3.5 h-3.5" />
          <span>Ban Vendor</span>
        </button>

        <div className="my-1 border-t border-slate-100 dark:border-gray-700"></div>

        {/* Delete Action */}
        <button
          onClick={() => onAction(vendor, 'delete')}
          className="w-full px-3 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Store</span>
        </button>
      </div>
    </>
  );
}