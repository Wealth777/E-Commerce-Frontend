import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/apiClient';
import { getMessage } from '../../utils/apiResponse';

import {
    Activity,
    AlertCircle,
    Search,
    Calendar,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
} from 'lucide-react';
import Loading from '../../components/layout/Loding';
import { useNavigate } from 'react-router-dom';

const FounderActivities = () => {
    const { showToast } = useToast();
    const { isDark } = useTheme();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [page, setPage] = useState(1);

    const limit = 10;

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    const fetchActivities = useCallback(async () => {
        setLoading(true);

        try {
            const params = {
                page,
                limit,
            };

            const res = await apiClient.get('/founder/activities', {
                params,
            });

            const data = res.data?.data || res.data || {};

            setActivities(
                Array.isArray(data.activities)
                    ? data.activities
                    : []
            );

            if (data.pagination) {
                setPagination({
                    page: data.pagination.page || page,
                    limit: data.pagination.limit || limit,
                    total: data.pagination.total || 0,
                    totalPages: data.pagination.totalPages || 1,
                    hasNextPage: Boolean(data.pagination.hasNextPage),
                    hasPreviousPage: Boolean(
                        data.pagination.hasPreviousPage
                    ),
                });
            } else {
                setPagination({
                    page,
                    limit,
                    total: data.activities?.length || 0,
                    totalPages: 1,
                    hasNextPage: false,
                    hasPreviousPage: false,
                });
            }
        } catch (error) {
            showToast(
                getMessage(
                    error,
                    'Failed to load user activities'
                ),
                'error'
            );
        } finally {
            setLoading(false);
        }
    }, [page, limit, showToast]);

    // Fetch whenever page changes
    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    // Search and role filtering
    const filteredActivities = activities.filter((item) => {
        const search = searchTerm.trim().toLowerCase();

        const searchableValues = [
            item.user?.fullName,
            item.user?.email,
            item.user?.serialNumber,
            item.actor?.fullName,
            item.actor?.email,
            item.actor?.serialNumber,
            item.action,
            item.entity,
            item.entityId,
            item.reason,
            item.role,
            item.actorRole,
        ];

        const matchesSearch =
            !search ||
            searchableValues.some((value) =>
                String(value || '')
                    .toLowerCase()
                    .includes(search)
            );

        const matchesRole =
            roleFilter === 'all' ||
            item.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    // Action badge
    const getActionBadgeColor = (action) => {
        const normalizedAction =
            action?.toUpperCase() || '';

        if (
            normalizedAction.includes('LOCKED') ||
            normalizedAction.includes('DELETE') ||
            normalizedAction.includes('BAN')
        ) {
            return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        }

        if (
            normalizedAction.includes('UPDATE') ||
            normalizedAction.includes('EDIT') ||
            normalizedAction.includes('MODIFY')
        ) {
            return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        }

        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    };

    // Go to previous page
    const handlePreviousPage = () => {
        if (
            pagination.hasPreviousPage &&
            !loading
        ) {
            setPage((currentPage) =>
                Math.max(1, currentPage - 1)
            );
        }
    };

    // Go to next page
    const handleNextPage = () => {
        if (
            pagination.hasNextPage &&
            !loading
        ) {
            setPage((currentPage) =>
                currentPage + 1
            );
        }
    };

    // Refresh current page
    const handleRefresh = () => {
        fetchActivities();
    };

    // Format date
    const formatDate = (date) => {
        if (!date) {
            return 'N/A';
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return 'N/A';
        }

        return parsedDate.toLocaleString();
    };

    return (
        <div
            className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors ${isDark
                    ? 'bg-gray-900 text-slate-100'
                    : 'bg-[#F8FAFC] text-slate-800'
                }`}
        >
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className={`group inline-flex items-center gap-2 text-xs font-medium transition-colors mb-2 rounded-full px-3 py-1.5 ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-white hover:bg-slate-100 text-slate-600 ring-1 ring-slate-200'
                                }`}
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            Back
                        </button>

                        <h1
                            className={`text-2xl md:text-3xl font-bold flex items-center gap-2 ${isDark
                                    ? 'text-white'
                                    : 'text-slate-900'
                                }`}
                        >
                            <Activity className="w-6 h-6 text-emerald-500" />
                            User Activity Logs
                        </h1>

                        <p
                            className={`text-xs md:text-sm mt-1 ${isDark
                                    ? 'text-gray-400'
                                    : 'text-slate-500'
                                }`}
                        >
                            Monitor security events, account modifications,
                            and system-wide activities.
                        </p>
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className={`px-4 py-2.5 text-xs font-semibold rounded-xl border flex items-center gap-2 transition-all shadow-sm ${isDark
                                ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200'
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                            } ${loading
                                ? 'opacity-60 cursor-not-allowed'
                                : ''
                            }`}
                    >
                        <RefreshCw
                            className={`w-3.5 h-3.5 ${loading
                                    ? 'animate-spin'
                                    : ''
                                }`}
                        />

                        <span>Refresh Activities</span>
                    </button>
                </div>

                {/* Search & Filters */}
                <div
                    className={`rounded-2xl border p-4 md:p-6 shadow-sm ${isDark
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-white border-slate-200'
                        }`}
                >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                        {/* Search */}
                        <div className="relative w-full sm:w-96">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                            <input
                                type="text"
                                placeholder="Search user, email, action..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(
                                        e.target.value
                                    )
                                }
                                className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border outline-none transition-all ${isDark
                                        ? 'bg-gray-900 border-gray-700 text-white focus:border-emerald-500'
                                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-600 focus:bg-white'
                                    }`}
                            />
                        </div>

                        {/* Role Filter */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Role:
                            </span>

                            <select
                                value={roleFilter}
                                onChange={(e) =>
                                    setRoleFilter(
                                        e.target.value
                                    )
                                }
                                className={`w-full sm:w-auto px-3 py-2.5 text-xs rounded-xl border outline-none ${isDark
                                        ? 'bg-gray-900 border-gray-700 text-white focus:border-emerald-500'
                                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-600'
                                    }`}
                            >
                                <option value="all">
                                    All Roles
                                </option>

                                <option value="buyer">
                                    Buyer
                                </option>

                                <option value="vendor">
                                    Vendor
                                </option>

                                <option value="founder">
                                    Founder
                                </option>

                                <option value="admin">
                                    Admin
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Activity Summary */}
                <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-slate-400">
                        Showing{' '}
                        <strong
                            className={
                                isDark
                                    ? 'text-slate-200'
                                    : 'text-slate-700'
                            }
                        >
                            {filteredActivities.length}
                        </strong>{' '}
                        activities on this page
                    </p>

                    <p className="text-xs text-slate-400">
                        Total:{' '}
                        <strong
                            className={
                                isDark
                                    ? 'text-slate-200'
                                    : 'text-slate-700'
                            }
                        >
                            {pagination.total.toLocaleString()}
                        </strong>
                    </p>
                </div>

                {/* Activity Table */}
                <div
                    className={`rounded-2xl border shadow-sm overflow-hidden ${isDark
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-white border-slate-200'
                        }`}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">

                            {/* Table Header */}
                            <thead>
                                <tr
                                    className={`border-b text-[11px] font-bold uppercase tracking-wider ${isDark
                                            ? 'border-gray-700 bg-gray-900/40 text-gray-400'
                                            : 'border-slate-100 bg-slate-50/50 text-slate-400'
                                        }`}
                                >
                                    <th className="py-3.5 px-6">
                                        User
                                    </th>

                                    <th className="py-3.5 px-6">
                                        Action / Entity
                                    </th>

                                    <th className="py-3.5 px-6">
                                        Actor
                                    </th>

                                    <th className="py-3.5 px-6">
                                        Reason / Details
                                    </th>

                                    <th className="py-3.5 px-6">
                                        Timestamp
                                    </th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody
                                className={`divide-y ${isDark
                                        ? 'divide-gray-700/60'
                                        : 'divide-slate-100'
                                    }`}
                            >
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="py-16 text-center text-slate-400"
                                        >
                                            <Loading text='Loading activity logs...' />
                                        </td>
                                    </tr>
                                ) : filteredActivities.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="py-16 text-center text-slate-400"
                                        >
                                            <AlertCircle className="w-8 h-8 opacity-40 mx-auto mb-2" />

                                            <p className="text-xs">
                                                {activities.length === 0
                                                    ? 'No activity logs found.'
                                                    : 'No activity logs found matching your criteria.'}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredActivities.map(
                                        (item, index) => (
                                            <tr
                                                key={
                                                    item._id ||
                                                    `${item.createdAt}-${index}`
                                                }
                                                className={`transition-colors ${isDark
                                                        ? 'hover:bg-gray-700/30'
                                                        : 'hover:bg-slate-50/80'
                                                    }`}
                                            >
                                                {/* User */}
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span
                                                            className={`text-sm font-semibold ${isDark
                                                                    ? 'text-white'
                                                                    : 'text-slate-800'
                                                                }`}
                                                        >
                                                            {item.user
                                                                ?.fullName ||
                                                                'Unknown User'}
                                                        </span>

                                                        <span className="text-[11px] text-slate-400 mt-0.5">
                                                            {item.user
                                                                ?.email ||
                                                                'No email'}
                                                        </span>

                                                        <span className="text-[10px] text-slate-400 font-mono mt-1">
                                                            {item.user
                                                                ?.serialNumber ||
                                                                'No serial number'}
                                                        </span>

                                                        <span className="text-[10px] text-slate-400 mt-0.5">
                                                            Role:{' '}
                                                            <span className="uppercase">
                                                                {item.role ||
                                                                    'N/A'}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Action / Entity */}
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <div className="flex flex-col items-start gap-1.5">
                                                        <span
                                                            className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${getActionBadgeColor(
                                                                item.action
                                                            )}`}
                                                        >
                                                            {item.action ||
                                                                'Unknown Action'}
                                                        </span>

                                                        <span className="text-[11px] text-slate-400">
                                                            Entity:{' '}
                                                            <strong
                                                                className={
                                                                    isDark
                                                                        ? 'text-gray-300'
                                                                        : 'text-slate-700'
                                                                }
                                                            >
                                                                {item.entity ||
                                                                    'N/A'}
                                                            </strong>
                                                        </span>

                                                        {item.entityId && (
                                                            <span className="text-[10px] text-slate-400 font-mono">
                                                                ID:{' '}
                                                                {item.entityId}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Actor */}
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span
                                                            className={`text-sm font-semibold ${isDark
                                                                    ? 'text-white'
                                                                    : 'text-slate-800'
                                                                }`}
                                                        >
                                                            {item.actor
                                                                ?.fullName ||
                                                                'System'}
                                                        </span>

                                                        <span className="text-[11px] text-slate-400 mt-0.5">
                                                            {item.actor
                                                                ?.email ||
                                                                'No email'}
                                                        </span>

                                                        <span className="text-[10px] text-slate-400 font-mono mt-1">
                                                            {item.actor
                                                                ?.serialNumber ||
                                                                'No serial number'}
                                                        </span>

                                                        <span className="text-[10px] text-slate-400 mt-0.5">
                                                            Role:{' '}
                                                            <span className="uppercase">
                                                                {item.actorRole ||
                                                                    'N/A'}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Reason / Details */}
                                                <td className="py-4 px-6">
                                                    <div className="max-w-xs">
                                                        <p
                                                            className={`text-xs truncate ${isDark
                                                                    ? 'text-gray-300'
                                                                    : 'text-slate-700'
                                                                }`}
                                                            title={
                                                                item.reason ||
                                                                ''
                                                            }
                                                        >
                                                            {item.reason ||
                                                                'No specific reason provided.'}
                                                        </p>

                                                        {item.metadata &&
                                                            Object.keys(
                                                                item.metadata
                                                            ).length > 0 && (
                                                                <details className="mt-2">
                                                                    <summary className="cursor-pointer text-[10px] text-emerald-500 hover:text-emerald-400">
                                                                        View metadata
                                                                    </summary>

                                                                    <pre
                                                                        className={`mt-2 max-w-xs max-h-32 overflow-auto p-2 rounded-lg text-[9px] ${isDark
                                                                                ? 'bg-gray-900 text-gray-400'
                                                                                : 'bg-slate-50 text-slate-500'
                                                                            }`}
                                                                    >
                                                                        {JSON.stringify(
                                                                            item.metadata,
                                                                            null,
                                                                            2
                                                                        )}
                                                                    </pre>
                                                                </details>
                                                            )}
                                                    </div>
                                                </td>

                                                {/* Timestamp */}
                                                <td className="py-4 px-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                        <Calendar className="w-3.5 h-3.5" />

                                                        {formatDate(
                                                            item.createdAt
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div
                        className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 ${isDark
                                ? 'border-gray-700/60'
                                : 'border-slate-100'
                            }`}
                    >
                        <span>
                            Showing Page{' '}
                            <strong
                                className={
                                    isDark
                                        ? 'text-slate-200'
                                        : 'text-slate-700'
                                }
                            >
                                {pagination.page}
                            </strong>{' '}
                            of{' '}
                            <strong
                                className={
                                    isDark
                                        ? 'text-slate-200'
                                        : 'text-slate-700'
                                }
                            >
                                {pagination.totalPages || 1}
                            </strong>{' '}
                            ({pagination.total.toLocaleString()}{' '}
                            activities)
                        </span>

                        <div className="flex items-center gap-2">
                            {/* Previous */}
                            <button
                                onClick={handlePreviousPage}
                                disabled={
                                    !pagination.hasPreviousPage ||
                                    loading
                                }
                                className={`p-1.5 rounded-lg border transition-colors ${pagination.hasPreviousPage &&
                                        !loading
                                        ? isDark
                                            ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white'
                                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                                        : 'opacity-40 cursor-not-allowed border-transparent'
                                    }`}
                                title="Previous page"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* Current Page */}
                            <span
                                className={`font-semibold px-2 ${isDark
                                        ? 'text-slate-300'
                                        : 'text-slate-600'
                                    }`}
                            >
                                {pagination.page}
                            </span>

                            {/* Next */}
                            <button
                                onClick={handleNextPage}
                                disabled={
                                    !pagination.hasNextPage ||
                                    loading
                                }
                                className={`p-1.5 rounded-lg border transition-colors ${pagination.hasNextPage &&
                                        !loading
                                        ? isDark
                                            ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white'
                                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                                        : 'opacity-40 cursor-not-allowed border-transparent'
                                    }`}
                                title="Next page"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FounderActivities;
