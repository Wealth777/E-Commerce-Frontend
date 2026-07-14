import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { vendorAPI } from '../../api/apiClient';
import { getList, getMessage } from '../../utils/apiResponse';
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

const REVIEWABLE_STATUSES = [
  'pending_review',
  'approved',
  'buyer_shipping',
  'returned',
  'inspection',
];

const VendorReturnRequests = () => {
  const { isDark } = useTheme();
  const { showToast } = useToast();

  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchReturnRequests();
  }, []);

  const fetchReturnRequests = async () => {
    try {
      setLoading(true);
      const response = await vendorAPI.getReturnRequests();
      setReturnRequests(getList(response, ['returnRequests', 'requests']));
    } catch (error) {
      showToast(getMessage(error, 'Failed to load return requests'), 'error');
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
    fetchReturnRequests();
    closeReviewModal();
  };

  const stats = useMemo(() => ({
    total: returnRequests.length,
    pending: returnRequests.filter((r) => r.returnRequest?.status === 'pending_review').length,
    approved: returnRequests.filter((r) => r.returnRequest?.status === 'approved').length,
    inProgress: returnRequests.filter((r) =>
      ['buyer_shipping', 'returned', 'inspection'].includes(r.returnRequest?.status)
    ).length,
    completed: returnRequests.filter((r) => r.returnRequest?.status === 'completed').length,
    rejected: returnRequests.filter((r) => r.returnRequest?.status === 'rejected').length,
  }), [returnRequests]);

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
      case 'buyer_shipping':
      case 'returned':
      case 'inspection':
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
      case 'approved':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'buyer_shipping':
      case 'returned':
      case 'inspection':
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
    return REVIEWABLE_STATUSES.includes(request.returnRequest?.status);
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
              <FileCheck className="w-8 h-8" />
              <h1 className="text-4xl font-black">Return Requests</h1>
            </div>

            <p className="opacity-90">Review and manage customer return requests.</p>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8">
              <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Total</p>
                <p className="text-xl font-black text-blue-500">{stats.total}</p>
              </div>

              <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Pending</p>
                <p className="text-xl font-black text-amber-500">{stats.pending}</p>
              </div>

              <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Approved</p>
                <p className="text-xl font-black text-blue-500">{stats.approved}</p>
              </div>

              <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">In Progress</p>
                <p className="text-xl font-black text-violet-500">{stats.inProgress}</p>
              </div>

              <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Completed</p>
                <p className="text-xl font-black text-emerald-500">{stats.completed}</p>
              </div>

              <div className={`${cardBg} border p-4 rounded-2xl shadow-sm`}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Rejected</p>
                <p className="text-xl font-black text-red-500">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loading text="Loading return requests..." />
          </div>
        ) : returnRequests.length === 0 ? (
          <div className={`${cardBg} border-2 border-dashed rounded-[2.5rem] p-16 text-center shadow-sm`}>
            <FileCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No return requests</h2>
            <p className={`${secondaryText} max-w-xs mx-auto`}>
              Customer return requests will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {returnRequests.map((request) => {
              const returnReq = request.returnRequest;
              const status = returnReq?.status || 'none';

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
                      <p className="font-mono text-sm uppercase font-semibold">
                        {request.orderId?.slice(-8) || request._id?.slice(-8) || 'N/A'}
                      </p>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1.5 ${getStatusStyle(status)}`}>
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
                          Order Amount
                        </p>
                        <p className="text-lg font-black text-green-500">
                          ₦{(request.pricing?.total || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Requested Date
                      </p>
                      <p className={`text-sm ${secondaryText}`}>
                        {returnReq?.requestedAt
                          ? new Date(returnReq.requestedAt).toLocaleDateString('en-US', {
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
                        {returnReq?.reason || 'No reason provided'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        Details
                      </p>
                      <p className={`text-sm ${textColor}`}>
                        {returnReq?.details || 'No details provided'}
                      </p>
                    </div>

                    {returnReq?.inspectionNote && (
                      <div className={`${isDark ? 'bg-gray-950' : 'bg-gray-50'} rounded-xl p-4 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                          Inspection Note
                        </p>
                        <p className={`text-sm ${textColor}`}>
                          {returnReq.inspectionNote}
                        </p>
                      </div>
                    )}

                    {returnReq?.response && (
                      <div className={`${isDark ? 'bg-gray-950' : 'bg-gray-50'} rounded-xl p-4 border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                          Vendor Response
                        </p>
                        <p className={`text-sm ${textColor}`}>
                          {returnReq.response}
                        </p>
                      </div>
                    )}

                    {returnReq?.reviewedAt && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                          Reviewed Date
                        </p>
                        <p className={`text-sm ${secondaryText}`}>
                          {new Date(returnReq.reviewedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    )}

                    {returnReq?.returnedAt && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                          Returned Date
                        </p>
                        <p className={`text-sm ${secondaryText}`}>
                          {new Date(returnReq.returnedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
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
          requestType="return"
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};

export default VendorReturnRequests;