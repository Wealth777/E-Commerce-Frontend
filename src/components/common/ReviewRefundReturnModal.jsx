import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { X, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { vendorAPI } from '../../api/apiClient';

const validationSchema = Yup.object({
  action: Yup.string()
    .required('Please select an action')
    .oneOf(['approved', 'rejected'], 'Invalid action'),
  response: Yup.string()
    .when('action', {
      is: 'rejected',
      then: () => Yup.string()
        .required('Response is required when rejecting')
        .min(5, 'Response must be at least 5 characters'),
      otherwise: () => Yup.string()
        .max(500, 'Response must be less than 500 characters'),
    }),
});

const ReviewRefundReturnModal = ({ isOpen, onClose, request, requestType, onSuccess }) => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const cardBg = isDark ? 'bg-[#13131a]' : 'bg-white';
  const cardBorder = isDark ? 'border-white/[0.06]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200';
  const buttonHover = isDark ? 'hover:bg-opacity-90' : 'hover:bg-opacity-90';
  const labelText = isDark ? 'text-gray-300' : 'text-gray-700';

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const data = {
        action: values.action,
        response: values.response,
      };

      if (requestType === 'refund') {
        await vendorAPI.reviewRefundRequest(request.orderId, data);
        showToast('Refund request reviewed successfully', 'success');
      } else {
        await vendorAPI.reviewReturnRequest(request.orderId, data);
        showToast('Return request reviewed successfully', 'success');
      }

      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to review request. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const title = requestType === 'refund' ? 'Review Refund Request' : 'Review Return Request';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md ${cardBg} rounded-2xl border ${cardBorder} shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-inherit">
          <h2 className={`text-xl font-bold ${textPrimary}`}>{title}</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
            disabled={submitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Request Summary */}
        <div className={`px-6 py-4 border-b border-inherit ${isDark ? 'bg-gray-900/50' : 'bg-gray-50/50'}`}>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className={textSecondary}>Order ID:</span>
              <span className={`font-mono font-semibold uppercase ${textPrimary}`}>{request.orderId?.slice(-8)}</span>
            </div>
            <div className="flex justify-between">
              <span className={textSecondary}>Customer:</span>
              <span className={`font-semibold ${textPrimary}`}>{request.buyerInfo?.username || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className={textSecondary}>Reason:</span>
              <span className={`font-semibold ${textPrimary}`}>{request.refundRequest?.reason?.substring(0, 20) || 'No reason provided'}...</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <Formik
          initialValues={{ action: '', response: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, isValid }) => (
            <Form className="p-6 space-y-5">
              {/* Action Field */}
              <div>
                <label className={`block text-sm font-semibold ${labelText} mb-3`}>
                  Action <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className={`flex items-center gap-3 p-3 rounded-lg border ${inputBg} cursor-pointer hover:opacity-80 transition-opacity`}>
                    <Field
                      type="radio"
                      name="action"
                      value="approved"
                      className="w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <p className={`text-sm font-semibold flex items-center gap-2 ${textPrimary}`}>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Approve Request
                      </p>
                      <p className={`text-xs ${textSecondary}`}>Accept the {requestType} request</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-lg border ${inputBg} cursor-pointer hover:opacity-80 transition-opacity`}>
                    <Field
                      type="radio"
                      name="action"
                      value="rejected"
                      className="w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <p className={`text-sm font-semibold flex items-center gap-2 ${textPrimary}`}>
                        <XCircle className="w-4 h-4 text-red-500" />
                        Reject Request
                      </p>
                      <p className={`text-xs ${textSecondary}`}>Deny the {requestType} request</p>
                    </div>
                  </label>
                </div>
                <ErrorMessage
                  name="action"
                  component="p"
                  className="text-red-500 text-xs mt-2"
                />
              </div>

              {/* Response Field */}
              <div>
                <label className={`block text-sm font-semibold ${labelText} mb-2`}>
                  Response {values.action === 'rejected' && <span className="text-red-500">*</span>}
                  <span className="text-gray-400 font-normal ml-2">(optional for approval)</span>
                </label>
                <Field
                  as="textarea"
                  name="response"
                  placeholder={
                    values.action === 'rejected'
                      ? "Explain why you're rejecting this request..."
                      : "Add any additional comments or instructions..."
                  }
                  rows="3"
                  className={`w-full px-4 py-3 rounded-lg border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none ${textPrimary}`}
                />
                <ErrorMessage
                  name="response"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
                <p className={`text-xs ${textSecondary} mt-1`}>
                  {values.response.length}/500 characters
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className={`flex-1 px-4 py-2 rounded-lg border ${cardBorder} ${textPrimary} font-medium text-sm transition-colors ${isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-50'} disabled:opacity-50`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !isValid || !values.action}
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    values.action === 'rejected'
                      ? 'bg-red-600 hover:bg-red-700'
                      : values.action === 'approved'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-gray-400'
                  } text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Reviewing...
                    </>
                  ) : (
                    <>
                      {values.action === 'rejected' && <XCircle className="w-4 h-4" />}
                      {values.action === 'approved' && <CheckCircle2 className="w-4 h-4" />}
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ReviewRefundReturnModal;
