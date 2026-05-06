import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { vendorAPI } from '../../api/apiClient';
import {
  ArrowLeft,
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Loading from '../../components/layout/Loding';
import ReviewRefundReturnModal from '../../components/common/ReviewRefundReturnModal';

const VendorReturnRequests = () => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchReturnRequests();
  }, []);

  const fetchReturnRequests = async () => {
    try {
      setLoading(true);
      const response = await vendorAPI.getReturnRequests();
      setReturnRequests(response.data?.data || []);
    } catch (error) {
      showToast('Failed to load return requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (request) => {
    setSelectedRequest(request);
    setShowReviewModal(true);
  };

  const handleReviewSuccess = () => {
    fetchReturnRequests();
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
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <FileCheck className="w-8 h-8" />
              <h1 className="text-4xl font-black">Return Requests</h1>
            </div>
            <p className="opacity-90">Review and manage customer return requests</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Total Requests</p>
                <p className={`text-xl font-black ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {returnRequests.length}
                </p>
              </div>
              <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Pending</p>
                <p className={`text-xl font-black ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  {returnRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Approved</p>
                <p className={`text-xl font-black ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {returnRequests.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Rejected</p>
                <p className={`text-xl font-black ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  {returnRequests.filter(r => r.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loading text="Loading return requests..." />
          </div>
        ) : returnRequests.length === 0 ? (
          <div className={`${cardBg} border-2 border-dashed rounded-[2.5rem] p-16 text-center shadow-sm`}>
            <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No return requests</h2>
            <p className={`${secondaryText} max-w-xs mx-auto`}>You don't have any return requests yet. Customer return requests will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {returnRequests.map((request) => (
              <div
                key={request._id}
                className={`${cardBg} border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300`}
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-inherit flex flex-wrap items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Order ID</p>
                    <p className="font-mono text-sm font-semibold">{request.orderId?.slice(-8) || request.orderId}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1.5 ${getStatusStyle(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {request.status}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Customer</p>
                      <p className={`text-sm font-semibold ${textColor}`}>{request.buyer?.username || 'Unknown'}</p>
                      <p className={`text-xs ${secondaryText}`}>{request.buyer?.email || 'No email'}</p>
                    </div>

                    {/* Order Amount */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Order Amount</p>
                      <p className={`text-lg font-black ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                        ₦{request.orderAmount?.toLocaleString() || '0'}
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
                    <p className={`text-sm ${textColor}`}>{request.reason}</p>
                  </div>

                  {/* Details */}
                  {request.details && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Details</p>
                      <p className={`text-sm ${secondaryText}`}>{request.details}</p>
                    </div>
                  )}

                  {/* Vendor Response (if reviewed) */}
                  {request.vendorResponse && (
                    <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Vendor Response</p>
                      <p className={`text-sm ${textColor}`}>{request.vendorResponse}</p>
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
          requestType="return"
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};

export default VendorReturnRequests;
