import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/apiClient';
import { vendorAPI } from '../../api/apiClient';
import {
    ArrowLeft,
    RotateCcw,
    CheckCircle2,
    XCircle,
    Clock,
    Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Loading from '../../components/layout/Loding';
import ReviewRefundReturnModal from '../../components/common/ReviewRefundReturnModal';

const VendorRefundRequests = () => {
    const { isDark } = useTheme();
    const { showToast } = useToast();
    const [refundRequests, setRefundRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewingId, setReviewingId] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        fetchRefundRequests();
    }, []);

    const fetchRefundRequests = async () => {
        try {
            setLoading(true);
            const response = await vendorAPI.getRefundRequests();
            setRefundRequests(response.data?.data || []);
        } catch (error) {
            showToast('Failed to load refund requests', 'error');
        } finally {
            setLoading(false);
        }
    };

    const openReviewModal = (request) => {
        setSelectedRequest(request);
        setShowReviewModal(true);
    };

    const handleReviewSuccess = () => {
        fetchRefundRequests();
        setShowReviewModal(false);
        setSelectedRequest(null);
    };

    // Theme styles
    const bgColor = isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900';
    const cardBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
    const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
    const secondaryText = isDark ? 'text-gray-400' : 'text-gray-500';

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'approved':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'rejected':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'pending':
                return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return <CheckCircle2 className="w-4 h-4" />;
            case 'approved':
                return <CheckCircle2 className="w-4 h-4" />;
            case 'rejected':
                return <XCircle className="w-4 h-4" />;
            case 'pending':
                return <Clock className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className={`min-h-screen ${bgColor} py-10 transition-colors duration-300`}>
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/vendor/dashboard" className={`flex items-center gap-2 text-sm mb-4 ${secondaryText} hover:${textColor}`}>
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <RotateCcw className="w-8 h-8" />
                            <h1 className="text-4xl font-black">Refund Requests</h1>
                        </div>
                        <p className="opacity-90">Review and manage customer refund requests</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                            <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Total Requests</p>
                                <p className={`text-xl font-black ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                                    {refundRequests.length}
                                </p>
                            </div>
                            <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Pending</p>
                                <p className={`text-xl font-black ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                                    {refundRequests.filter(r => r.refundRequest?.status === 'pending').length}
                                </p>
                            </div>
                            <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Approved</p>
                                <p className={`text-xl font-black ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                    {refundRequests.filter(r => r.refundRequest?.status === 'approved').length}
                                </p>
                            </div>
                            <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Rejected</p>
                                <p className={`text-xl font-black ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                                    {refundRequests.filter(r => r.refundRequest?.status === 'rejected').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loading text="Loading refund requests..." />
                    </div>
                ) : refundRequests.length === 0 ? (
                    <div className={`${cardBg} border-2 border-dashed rounded-[2.5rem] p-16 text-center shadow-sm`}>
                        <RotateCcw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">No refund requests</h2>
                        <p className={`${secondaryText} max-w-xs mx-auto`}>You don't have any refund requests yet. Customer refund requests will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {refundRequests.map((request) => (
                            <div
                                key={request._id}
                                className={`${cardBg} border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300`}
                            >
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-inherit flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Order ID</p>
                                        <p className="font-mono text-sm font-semibold uppercase">{request.orderId?.slice(-8) || request.orderId}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1.5 ${getStatusStyle(request.orderStatus)}`}>
                                            {getStatusIcon(request.orderStatus)}
                                            {request.orderStatus}
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Customer Info */}
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Customer</p>
                                            <p className={`text-sm font-semibold ${textColor}`}>{request.buyerInfo?.username || 'Unknown'}</p>
                                            <p className={`text-xs ${secondaryText}`}>{request.buyerInfo?.email || 'No email'}</p>
                                        </div>

                                        {/* Order Amount */}
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Order Amount</p>
                                            <p className={`text-lg font-black ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                                ₦{request.pricing?.total?.toLocaleString() || '0'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Requested Date */}
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Requested Date</p>
                                        <p className={`text-sm ${secondaryText}`}>{new Date(request.requestedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>

                                    {/* Reason */}
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Reason</p>
                                        <p className={`text-sm ${textColor}`}>{request.refundRequest?.reason || 'No reason provided'}</p>
                                    </div>

                                    {/* Details */}
                                    {request.details && (
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Details</p>
                                            <p className={`text-sm ${secondaryText}`}>{request.refundRequest?.details && (
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Details</p>
                                                    <p className={`text-sm ${secondaryText}`}>{request.refundRequest.details}</p>
                                                </div>
                                            )}</p>
                                        </div>
                                    )}

                                    {request.refundRequest?.status === 'pending' && (
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={() => openReviewModal(request)}
                                                className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Review Request
                                            </button>
                                        </div>
                                    )}

                                    {/* Reviewed Date (if reviewed) */}
                                    {request.reviewedAt && (
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Reviewed Date</p>
                                            <p className={`text-sm ${secondaryText}`}>{new Date(request.reviewedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    {request.status === 'pending' && (
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={() => openReviewModal(request)}
                                                className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Review Request
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {selectedRequest && (
                <ReviewRefundReturnModal
                    isOpen={showReviewModal}
                    onClose={() => setShowReviewModal(false)}
                    request={selectedRequest}
                    requestType="refund"
                    onSuccess={handleReviewSuccess}
                />
            )}
        </div>
    );
};

export default VendorRefundRequests;
