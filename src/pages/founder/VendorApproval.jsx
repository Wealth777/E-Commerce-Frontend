
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/apiClient';
import { getMessage } from '../../utils/apiResponse';
import {
    ShieldCheck,
    Search,
    RefreshCw,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Clock,
    Eye,
    User,
    Store,
    GraduationCap,
    Building,
    CreditCard,
    FileText,
    ExternalLink,
    Phone,
    Mail,
    MapPin,
    X,
    AlertTriangle,
    Globe,
    Share2,
    Calendar,
    CheckSquare,
    Square,
    AlertCircle
} from 'lucide-react';
import Loading from "../../components/layout/Loding";

export default function VendorVerificationApprovals() {
    const { isDark } = useTheme();
    const { showToast } = useToast();
    const navigate = useNavigate();

    // Data States
    const [loadingList, setLoadingList] = useState(false);
    const [vendors, setVendors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Review Modal States
    const [selectedVendorId, setSelectedVendorId] = useState(null);
    const [vendorDetails, setVendorDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Action Confirmation Modal States
    const [actionType, setActionType] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [submittingAction, setSubmittingAction] = useState(false);

    // 1. Fetch Pending Approvals List
    const fetchPendingApprovals = useCallback(async () => {
        setLoadingList(true);
        try {
            const response = await apiClient.get('/founder/vendors/approvals');
            const data = response.data?.data || response.data?.vendors || response.data || [];
            const vendorList = Array.isArray(data) ? data : data.vendors || [];
            setVendors(vendorList);
        } catch (err) {
            showToast(getMessage(err, 'Failed to fetch pending vendor approvals'), 'error');
        } finally {
            setLoadingList(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchPendingApprovals();
    }, [fetchPendingApprovals]);

    // 2. Fetch Detailed Onboarding Info for a Vendor
    const openVendorReview = async (vendor) => {
        const id = vendor._id || vendor.id;
        setSelectedVendorId(id);
        setLoadingDetails(true);
        try {
            const response = await apiClient.get(`/founder/vendors/${id}/onboarding`);
            const data = response.data?.data || response.data?.vendors || response.data || {};
            const details = Array.isArray(data) ? data[0] : data.vendor || data;
            setVendorDetails(details || vendor);
        } catch (err) {
            showToast(getMessage(err, 'Failed to load vendor onboarding details'), 'error');
            setVendorDetails(vendor);
        } finally {
            setLoadingDetails(false);
        }
    };

    // Close Detail Drawer/Modal
    const closeVendorReview = () => {
        setSelectedVendorId(null);
        setVendorDetails(null);
        setActionType(null);
        setRejectionReason('');
    };

    // 3. Handle Approve API Call
    const handleApprove = async () => {
        if (!selectedVendorId) return;
        setSubmittingAction(true);
        try {
            await apiClient.patch(`/founder/vendors/${selectedVendorId}/approve`);
            showToast('Vendor approved successfully!', 'success');
            closeVendorReview();
            fetchPendingApprovals();
        } catch (err) {
            showToast(getMessage(err, 'Failed to approve vendor'), 'error');
        } finally {
            setSubmittingAction(false);
        }
    };

    // 4. Handle Reject API Call
    const handleReject = async () => {
        if (!selectedVendorId) return;
        if (!rejectionReason.trim()) {
            showToast('Please provide a reason for rejection', 'error');
            return;
        }

        setSubmittingAction(true);
        try {
            await apiClient.patch(`/founder/vendors/${selectedVendorId}/reject`, {
                rejectionReason: rejectionReason.trim(),
            });
            showToast('Vendor verification rejected', 'info');
            closeVendorReview();
            fetchPendingApprovals();
        } catch (err) {
            showToast(getMessage(err, 'Failed to reject vendor'), 'error');
        } finally {
            setSubmittingAction(false);
        }
    };

    // Filtered List Client-Side Search
    const filteredVendors = vendors.filter((v) => {
        const query = searchQuery.toLowerCase();
        const name = v.fullName?.toLowerCase() || '';
        const email = v.email?.toLowerCase() || '';
        const store = v.business?.storeName?.toLowerCase() || '';
        const serial = v.serialNumber?.toLowerCase() || '';
        const matric = v.student?.matricNumber?.toLowerCase() || '';
        return (
            name.includes(query) ||
            email.includes(query) ||
            store.includes(query) ||
            serial.includes(query) ||
            matric.includes(query)
        );
    });

    return (
        <div className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors ${isDark ? 'bg-gray-900 text-slate-100' : 'bg-[#F8FAFC] text-slate-800'}`}>
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Page Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className={`group inline-flex items-center gap-2 text-xs font-medium transition-colors mb-2 rounded-full px-3 py-1.5 ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-white hover:bg-slate-100 text-slate-600 ring-1 ring-slate-200'
                                }`}
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            Back
                        </button>
                        <h1 className={`text-2xl md:text-3xl font-bold flex items-center gap-2.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            <ShieldCheck className="w-7 h-7 text-emerald-500" />
                            Vendor Approvals
                        </h1>
                        <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'} mt-1`}>
                            Review student merchant applications, identity proofs, and business onboarding files.
                        </p>
                    </div>

                    <button
                        onClick={fetchPendingApprovals}
                        disabled={loadingList}
                        className={`px-4 py-2.5 text-xs font-semibold rounded-xl border flex items-center gap-2 transition-all shadow-sm ${isDark
                            ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-200'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                            }`}
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingList ? 'animate-spin' : ''}`} />
                        <span>Refresh Queue</span>
                    </button>
                </div>

                {/* Status / Quick Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-slate-200'} shadow-sm flex items-center justify-between`}>
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pending Applications</span>
                            <span className={`text-2xl font-black ${isDark ? 'text-amber-400' : 'text-amber-600'} mt-1 block`}>
                                {vendors.length}
                            </span>
                        </div>
                        <div className={`p-3 rounded-xl ${isDark ? 'bg-amber-950/60 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>

                    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-slate-200'} shadow-sm flex items-center justify-between`}>
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed Onboarding</span>
                            <span className={`text-2xl font-black ${isDark ? 'text-emerald-400' : 'text-emerald-600'} mt-1 block`}>
                                {vendors.filter((v) => v.onboardingCompleted).length}
                            </span>
                        </div>
                        <div className={`p-3 rounded-xl ${isDark ? 'bg-emerald-950/60 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </div>

                    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-slate-200'} shadow-sm flex items-center justify-between`}>
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Incomplete Profiles</span>
                            <span className={`text-2xl font-black ${isDark ? 'text-rose-400' : 'text-rose-600'} mt-1 block`}>
                                {vendors.filter((v) => !v.onboardingCompleted).length}
                            </span>
                        </div>
                        <div className={`p-3 rounded-xl ${isDark ? 'bg-rose-950/60 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Vendors List Section */}
                <div className={`rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} shadow-sm overflow-hidden`}>

                    {/* Search Header */}
                    <div className="p-4 md:p-6 border-b border-slate-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search store, merchant, email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 text-xs rounded-xl border outline-none transition-all ${isDark
                                    ? 'bg-gray-900 border-gray-700 text-white focus:border-emerald-500'
                                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-600 focus:bg-white'
                                    }`}
                            />
                        </div>
                        <span className="text-xs text-slate-400 font-medium">
                            Showing {filteredVendors.length} applicant(s)
                        </span>
                    </div>

                    {/* Vendors Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`border-b ${isDark ? 'border-gray-700 bg-gray-900/40 text-gray-400' : 'border-slate-100 bg-slate-50/50 text-slate-400'} text-[11px] font-bold uppercase tracking-wider`}>
                                    <th className="py-3.5 px-6">Merchant & Store</th>
                                    <th className="py-3.5 px-6">Institution / Student</th>
                                    <th className="py-3.5 px-6">Business Type</th>
                                    <th className="py-3.5 px-6">Onboarding</th>
                                    <th className="py-3.5 px-6">Submission Date</th>
                                    <th className="py-3.5 px-6">Verification Status</th>
                                    <th className="py-3.5 px-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-gray-700/60 text-xs">
                                {loadingList ? (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center text-slate-400">
                                            <Loading text='Loading vendor verification requests...' />
                                        </td>
                                    </tr>
                                ) : filteredVendors.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center text-slate-400">
                                            <ShieldCheck className="w-8 h-8 opacity-40 mx-auto mb-2" />
                                            No pending vendor approvals found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVendors.map((vendor) => (
                                        <tr key={vendor._id} className={`hover:${isDark ? 'bg-gray-700/30' : 'bg-slate-50/80'} transition-colors`}>
                                            {/* Merchant & Store */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    {vendor.business?.logo ? (
                                                        <img src={vendor.business.logo} alt="" className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-gray-700" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-sm">
                                                            {vendor.business?.storeName ? vendor.business.storeName.charAt(0).toUpperCase() : vendor.fullName?.charAt(0) || 'V'}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                            {vendor.business?.storeName || 'Store Name Not Set'}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400 font-medium">
                                                            {vendor.fullName} ({vendor.serialNumber || 'N/A'})
                                                        </p>
                                                        <p className="text-[10px] text-slate-500">{vendor.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Student Info */}
                                            <td className="py-4 px-6">
                                                <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                                    {vendor.student?.matricNumber || 'Matric N/A'}
                                                </p>
                                                <p className="text-[11px] text-slate-400 line-clamp-1">
                                                    {vendor.student?.department || 'Department N/A'}
                                                </p>
                                            </td>

                                            {/* Business Type */}
                                            <td className="py-4 px-6">
                                                <span className="capitalize font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md text-[11px]">
                                                    {vendor.business?.type || 'General Merchant'}
                                                </span>
                                            </td>

                                            {/* Onboarding Completed */}
                                            <td className="py-4 px-6">
                                                {vendor.onboardingCompleted ? (
                                                    <span className="inline-flex items-center gap-1 text-emerald-500 font-medium text-[11px]">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-amber-500 font-medium text-[11px]">
                                                        <Clock className="w-3.5 h-3.5" /> Incomplete
                                                    </span>
                                                )}
                                            </td>

                                            {/* Submission Date */}
                                            <td className="py-4 px-6 text-slate-400 text-[11px]">
                                                {vendor.onboardingCompletedAt
                                                    ? new Date(vendor.onboardingCompletedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                                                    : vendor.createdAt
                                                        ? new Date(vendor.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                                                        : 'N/A'}
                                            </td>

                                            {/* Verification Status */}
                                            <td className="py-4 px-6">
                                                {(() => {
                                                    // Normalizing status to lowercase string (or checking direct property)
                                                    const status = (
                                                        vendor.verificationStatus ||
                                                        vendor.vendorDetails?.verificationStatus ||
                                                        'pending'
                                                    ).toString().toLowerCase();

                                                    if (status === 'approved' || status === 'true') {
                                                        return (
                                                            <span className="inline-flex items-center gap-1.5 text-emerald-500 font-medium text-[11px] bg-emerald-500/10 px-2.5 py-1 rounded-md">
                                                                <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                                                            </span>
                                                        );
                                                    } else if (status === 'rejected') {
                                                        return (
                                                            <span className="inline-flex items-center gap-1.5 text-rose-500 font-medium text-[11px] bg-rose-500/10 px-2.5 py-1 rounded-md">
                                                                <AlertCircle className="w-3.5 h-3.5" /> Rejected
                                                            </span>
                                                        );
                                                    } else {
                                                        return (
                                                            <span className="inline-flex items-center gap-1.5 text-amber-500 font-medium text-[11px] bg-amber-500/10 px-2.5 py-1 rounded-md">
                                                                <Clock className="w-3.5 h-3.5" /> Pending
                                                            </span>
                                                        );
                                                    }
                                                })()}
                                            </td>

                                            {/* Action */}
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => openVendorReview(vendor)}
                                                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${isDark
                                                        ? 'border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-200'
                                                        : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                                                        }`}
                                                >
                                                    <Eye className="w-3.5 h-3.5 text-emerald-500" />
                                                    <span>Review Application</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Verification Review Modal / Modal Drawer */}
            {selectedVendorId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className={`w-full max-w-4xl max-h-[90vh] rounded-2xl border shadow-2xl overflow-hidden flex flex-col my-auto ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                        }`}>

                        {/* Modal Header */}
                        <div className="p-5 border-b border-slate-200 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                <div>
                                    <h3 className="font-bold text-base">
                                        Verification Review: {vendorDetails?.business?.storeName || vendorDetails?.fullName}
                                    </h3>
                                    <p className="text-[11px] text-slate-400">
                                        Serial: {vendorDetails?.serialNumber || 'N/A'} · Status: <span className="uppercase text-amber-500 font-bold">{vendorDetails?.verificationStatus || 'Pending'}</span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeVendorReview}
                                className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-slate-100 text-slate-500'
                                    }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto space-y-6">
                            {loadingDetails ? (
                                <div className="py-16 text-center text-slate-400">
                                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-500" />
                                    Fetching full onboarding verification files...
                                </div>
                            ) : vendorDetails ? (
                                <>
                                    {/* Store Banner & Brand Header */}
                                    {vendorDetails.business?.banner && (
                                        <div className="relative h-36 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-gray-700">
                                            <img src={vendorDetails.business.banner} alt="Store Banner" className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    {/* Merchant & Business Basic Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Personal / Student Info */}
                                        <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900/40 border-gray-700' : 'bg-slate-50/60 border-slate-200'} space-y-3`}>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5 text-emerald-500" /> Personal & Student Profile
                                            </h4>

                                            <div className="flex items-center gap-3">
                                                {vendorDetails.student?.profilePhoto ? (
                                                    <img src={vendorDetails.student.profilePhoto} alt="" className="w-12 h-12 rounded-full object-cover border" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center font-bold text-slate-500">
                                                        {vendorDetails.fullName?.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-sm">{vendorDetails.fullName}</p>
                                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" /> {vendorDetails.email}
                                                    </p>
                                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Phone className="w-3 h-3" /> {vendorDetails.phoneNo}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-slate-200 dark:border-gray-700/60 space-y-1 text-xs">
                                                <p className="flex justify-between">
                                                    <span className="text-slate-400">Gender:</span>
                                                    <span className="font-semibold capitalize">{vendorDetails.student?.gender || 'N/A'}</span>
                                                </p>
                                                <p className="flex justify-between">
                                                    <span className="text-slate-400">Matriculation No:</span>
                                                    <span className="font-mono font-bold text-emerald-500">{vendorDetails.student?.matricNumber || 'N/A'}</span>
                                                </p>
                                                <p className="flex justify-between">
                                                    <span className="text-slate-400">Faculty / Dept:</span>
                                                    <span className="font-semibold">{vendorDetails.student?.faculty || 'N/A'} / {vendorDetails.student?.department || 'N/A'}</span>
                                                </p>
                                                <p className="flex justify-between">
                                                    <span className="text-slate-400">Academic Level:</span>
                                                    <span className="font-semibold">{vendorDetails.student?.level || 'N/A'}</span>
                                                </p>
                                                <p className="flex justify-between">
                                                    <span className="text-slate-400">Residence:</span>
                                                    <span className="font-semibold capitalize">{vendorDetails.student?.residence || 'N/A'}</span>
                                                </p>
                                                <p className="flex justify-between">
                                                    <span className="text-slate-400">Address:</span>
                                                    <span className="font-semibold">{vendorDetails.student?.address || 'N/A'}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Business Profile */}
                                        <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900/40 border-gray-700' : 'bg-slate-50/60 border-slate-200'} space-y-3`}>
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                                <Store className="w-3.5 h-3.5 text-emerald-500" /> Business Details
                                            </h4>

                                            <div className="flex items-center gap-3">
                                                {vendorDetails.business?.logo ? (
                                                    <img src={vendorDetails.business.logo} alt="" className="w-12 h-12 rounded-xl object-cover border" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                                                        <Store className="w-6 h-6" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-sm">{vendorDetails.business?.storeName || 'N/A'}</p>
                                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 uppercase mt-1">
                                                        {vendorDetails.business?.type || 'Merchant'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="pt-2 border-t border-slate-200 dark:border-gray-700/60 text-xs space-y-2">
                                                <div>
                                                    <span className="text-slate-400 block text-[11px] mb-0.5">Store Description:</span>
                                                    <p className={`p-2.5 rounded-lg border text-xs leading-relaxed ${isDark ? 'bg-gray-900/60 border-gray-700 text-gray-300' : 'bg-white border-slate-200 text-slate-600'
                                                        }`}>
                                                        {vendorDetails.business?.description || 'No description provided.'}
                                                    </p>
                                                </div>

                                                {/* Social Links */}
                                                <div className="pt-1">
                                                    <span className="text-slate-400 block text-[11px] mb-1">Social Handles:</span>
                                                    <div className="flex flex-wrap gap-2 text-[11px]">
                                                        {vendorDetails.business?.socials?.whatsapp && (
                                                            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">
                                                                WA: {vendorDetails.business.socials.whatsapp}
                                                            </span>
                                                        )}
                                                        {vendorDetails.business?.socials?.instagram && (
                                                            <span className="px-2 py-1 rounded bg-pink-500/10 text-pink-500 border border-pink-500/20 font-mono">
                                                                IG: @{vendorDetails.business.socials.instagram}
                                                            </span>
                                                        )}
                                                        {vendorDetails.business?.socials?.tiktok && (
                                                            <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 font-mono">
                                                                TikTok: {vendorDetails.business.socials.tiktok}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Verification Documents Section */}
                                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900/40 border-gray-700' : 'bg-slate-50/60 border-slate-200'} space-y-3`}>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <FileText className="w-3.5 h-3.5 text-emerald-500" /> Verification Documents Submitted
                                        </h4>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* School ID Card */}
                                            <div className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
                                                }`}>
                                                <span className="text-xs font-bold text-slate-400">School ID Card</span>
                                                {vendorDetails.verificationDocuments?.schoolIdCard ? (
                                                    <div className="w-full space-y-2">
                                                        <img
                                                            src={vendorDetails.verificationDocuments.schoolIdCard}
                                                            alt="School ID"
                                                            className="h-32 w-full object-cover rounded-lg border"
                                                        />
                                                        <a
                                                            href={vendorDetails.verificationDocuments.schoolIdCard}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline font-semibold"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" /> View Full Image
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-rose-500 py-4 font-medium">Document Missing</p>
                                                )}
                                            </div>

                                            {/* National ID */}
                                            <div className={`p-3 rounded-xl border flex flex-col items-center text-center gap-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
                                                }`}>
                                                <span className="text-xs font-bold text-slate-400">National ID (NIN / Voter / Passport)</span>
                                                {vendorDetails.verificationDocuments?.nationalId ? (
                                                    <div className="w-full space-y-2">
                                                        <img
                                                            src={vendorDetails.verificationDocuments.nationalId}
                                                            alt="National ID"
                                                            className="h-32 w-full object-cover rounded-lg border"
                                                        />
                                                        <a
                                                            href={vendorDetails.verificationDocuments.nationalId}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline font-semibold"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" /> View Full Image
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-rose-500 py-4 font-medium">Document Missing</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bank & Financial Details */}
                                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900/40 border-gray-700' : 'bg-slate-50/60 border-slate-200'} space-y-2`}>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <CreditCard className="w-3.5 h-3.5 text-emerald-500" /> Payout Bank Details
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                            <div>
                                                <span className="text-slate-400 block text-[10px]">Bank Name</span>
                                                <span className="font-bold">{vendorDetails.bankDetails?.bankName || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block text-[10px]">Account Name</span>
                                                <span className="font-bold">{vendorDetails.bankDetails?.accountName || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block text-[10px]">Account Number</span>
                                                <span className="font-mono font-bold text-emerald-500">{vendorDetails.bankDetails?.accountNumber || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Policy Acceptance Terms */}
                                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900/40 border-gray-700' : 'bg-slate-50/60 border-slate-200'} space-y-2`}>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Policy Consent & Acceptance</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                            <div className="flex items-center gap-1.5 text-slate-300">
                                                {vendorDetails.terms?.acceptedVendorTerms ? (
                                                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                                                ) : (
                                                    <Square className="w-4 h-4 text-slate-500" />
                                                )}
                                                <span>Vendor Terms</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-300">
                                                {vendorDetails.terms?.acceptedMarketplacePolicy ? (
                                                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                                                ) : (
                                                    <Square className="w-4 h-4 text-slate-500" />
                                                )}
                                                <span>Marketplace Policy</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-300">
                                                {vendorDetails.terms?.acceptedFraudPolicy ? (
                                                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                                                ) : (
                                                    <Square className="w-4 h-4 text-slate-500" />
                                                )}
                                                <span>Fraud Policy</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rejection Form Box (If actionType === 'reject') */}
                                    {actionType === 'reject' && (
                                        <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 space-y-3 animate-fadeIn">
                                            <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                                                <AlertTriangle className="w-4 h-4" /> Reject Verification Request
                                            </h4>
                                            <p className="text-xs text-slate-300">
                                                Please state the precise reason for rejection. This reason will be logged and communicated to the vendor.
                                            </p>
                                            <textarea
                                                rows="3"
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                placeholder="e.g., School ID image is blurry, National ID number does not match provided name..."
                                                className={`w-full p-3 text-xs rounded-xl border outline-none transition-all ${isDark ? 'bg-gray-900 border-rose-500/40 text-white' : 'bg-white border-rose-300 text-slate-800'
                                                    }`}
                                            />
                                            <div className="flex justify-end gap-2 pt-1">
                                                <button
                                                    onClick={() => setActionType(null)}
                                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-600 hover:bg-slate-700 text-slate-300"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleReject}
                                                    disabled={submittingAction}
                                                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5"
                                                >
                                                    {submittingAction && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                                                    Confirm Rejection
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : null}
                        </div>

                        {/* Modal Footer Controls */}
                        <div className="p-4 border-t border-slate-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
                            <button
                                onClick={closeVendorReview}
                                className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-colors ${isDark ? 'border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                                    }`}
                            >
                                Close Panel
                            </button>

                            <div className="flex items-center gap-2">
                                {actionType !== 'reject' && (
                                    <button
                                        onClick={() => setActionType('reject')}
                                        disabled={submittingAction}
                                        className="px-4 py-2 text-xs font-semibold rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 flex items-center gap-1.5 transition-all"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Reject Application
                                    </button>
                                )}

                                <button
                                    onClick={handleApprove}
                                    disabled={submittingAction}
                                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center gap-1.5 transition-all"
                                >
                                    {submittingAction ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    Approve Verification
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}