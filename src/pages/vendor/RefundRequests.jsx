import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { vendorAPI } from '../../api/apiClient';
import { getList, getMessage } from '../../utils/apiResponse';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  CreditCard,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Loading from '../../components/layout/Loding';
import ReviewRefundReturnModal from '../../components/common/ReviewRefundReturnModal';

const REVIEWABLE_STATUSES = [
  'pending_review',
  'approved',
  'processing',
  'refunded',
];

const VendorRefundRequests = () => {
  const { isDark } = useTheme();
  const { showToast } = useToast();

  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRefundRequests();
  }, []);

  const fetchRefundRequests = async () => {
    try {
      setLoading(true);
      const response = await vendorAPI.getRefundRequests();
      setRefundRequests(getList(response, ['refundRequests', 'requests']));
    } catch (error) {
      showToast(getMessage(error, 'Failed to load refund requests'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (request) => {
    setSelectedRequest(request);
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedRequest(null);
  };

  const handleReviewSuccess = () => {
    fetchRefundRequests();
    closeReviewModal();
  };

  const stats = useMemo(() => {
    return {
      total: refundRequests.length,
      pending: refundRequests.filter(
        (r) => r.refundRequest?.status === 'pending_review'
      ).length,
      approved: refundRequests.filter(
        (r) => r.refundRequest?.status === 'approved'
      ).length,
      completed: refundRequests.filter(
        (r) =>
          r.refundRequest?.status === 'completed' ||
          r.refundRequest?.status === 'refunded'
      ).length,
      rejected: refundRequests.filter(
        (r) => r.refundRequest?.status === 'rejected'
      ).length,
    };
  }, [refundRequests]);

  const bgColor = isDark ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900';
  const cardBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-500';

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'refunded':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'approved':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'processing':
        return 'bg-violet-500/10 text-violet-500 border-violet-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'pending_review':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'refunded':
      case 'approved':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'processing':
        return <Loader2 className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'None';
    return status.replaceAll('_', ' ');
  };

  const canReview = (request) => {
    return REVIEWABLE_STATUSES.includes(request.refundRequest?.status);
  };

  return (
    <div className={`min-h-screen ${bgColor} py-10 transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <Link
            to="/vendor/dashboard"
            className={`flex items-center gap-2 text-sm mb-4 ${secondaryText} hover:${textColor}`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <RotateCcw className="w-8 h-8" />
              <h1 className="text-4xl font-black">Refund Requests</h1>
            </div>

            <p className="opacity-90">Review and manage customer refund requests.</p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
              <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Total
                </p>
                <p className="text-xl font-black text-orange-500">{stats.total}</p>
              </div>

              <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Pending
                </p>
                <p className="text-xl font-black text-amber-500">{stats.pending}</p>
              </div>

              <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Approved
                </p>
                <p className="text-xl font-black text-blue-500">{stats.approved}</p>
              </div>

              <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Completed
                </p>
                <p className="text-xl font-black text-emerald-500">{stats.completed}</p>
              </div>

              <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Rejected
                </p>
                <p className="text-xl font-black text-red-500">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loading text="Loading refund requests..." />
          </div>
        ) : refundRequests.length === 0 ? (
          <div className={`${cardBg} border-2 border-dashed rounded-[2.5rem] p-16 text-center shadow-sm`}>
            <RotateCcw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No refund requests</h2>
            <p className={`${secondaryText} max-w-xs mx-auto`}>
              Customer refund requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {refundRequests.map((request) => {
              const refund = request.refundRequest;
              const status = refund?.status || 'none';

              return (
                <div
                  key={request._id || request.orderId}
                  className={`${cardBg} border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300`}
                >
                  <div className="px-6 py-4 border-b border-inherit flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                        Order ID
                      </p>
                      <p className="font-mono text-sm font-semibold uppercase">
                        {request.orderId?.slice(-8) || request._id?.slice(-8) || 'N/A'}
                      </p>
                    </div>

                    <div
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1.5 ${getStatusStyle(status)}`}
                    >
                      {getStatusIcon(status)}
                      {formatStatus(status)}
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                          Customer
                        </p>
                        <p className={`text-sm font-semibold ${textColor}`}>
                          {request.buyerInfo?.username ||
                            request.buyerInfo?.fullName ||
                            'Unknown'}
                        </p>
                        <p className={`text-xs ${secondaryText}`}>
                          {request.buyerInfo?.email || 'No email'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                          Refund Amount
                        </p>
                        <p className="text-lg font-black text-green-500">
                          ₦{(refund?.refundAmount || request.pricing?.total || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Requested Date
                      </p>
                      <p className={`text-sm ${secondaryText}`}>
                        {refund?.requestedAt
                          ? new Date(refund.requestedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'No date available'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Reason
                      </p>
                      <p className={`text-sm ${textColor}`}>
                        {refund?.reason || 'No reason provided'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Details
                      </p>
                      <p className={`text-sm ${textColor}`}>
                        {refund?.details || 'No details provided'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className={`${isDark ? 'bg-gray-950' : 'bg-gray-50'} rounded-xl p-3 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                        <p className="text-xs font-bold uppercase text-gray-500 mb-1">
                          Account Name
                        </p>
                        <p className={`text-sm ${textColor}`}>
                          {refund?.accountName || 'N/A'}
                        </p>
                      </div>

                      <div className={`${isDark ? 'bg-gray-950' : 'bg-gray-50'} rounded-xl p-3 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                        <p className="text-xs font-bold uppercase text-gray-500 mb-1">
                          Account Number
                        </p>
                        <p className={`text-sm ${textColor}`}>
                          {refund?.accountNumber || 'N/A'}
                        </p>
                      </div>

                      <div className={`${isDark ? 'bg-gray-950' : 'bg-gray-50'} rounded-xl p-3 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                        <p className="text-xs font-bold uppercase text-gray-500 mb-1">
                          Bank
                        </p>
                        <p className={`text-sm ${textColor}`}>
                          {refund?.bankName || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {refund?.triggeredByReturn && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-blue-500">
                        <CreditCard className="w-4 h-4" />
                        Refund was requested after a return flow.
                      </div>
                    )}

                    {refund?.reviewedAt && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                          Reviewed Date
                        </p>
                        <p className={`text-sm ${secondaryText}`}>
                          {new Date(refund.reviewedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    )}

                    {refund?.response && (
                      <div className={`${isDark ? 'bg-gray-950' : 'bg-gray-50'} rounded-xl p-4 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                          Vendor Response
                        </p>
                        <p className={`text-sm ${textColor}`}>{refund.response}</p>
                      </div>
                    )}

                    {canReview(request) && (
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
              );
            })}
          </div>
        )}
      </div>

      {selectedRequest && (
        <ReviewRefundReturnModal
          isOpen={showReviewModal}
          onClose={closeReviewModal}
          request={selectedRequest}
          requestType="refund"
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};

export default VendorRefundRequests;