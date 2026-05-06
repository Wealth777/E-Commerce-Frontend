import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { X, Loader2 } from 'lucide-react';
import { buyerAPI } from '../../api/apiClient';

const validationSchema = Yup.object({
  reason: Yup.string()
    .required('Reason is required')
    .min(10, 'Reason must be at least 10 characters'),
  details: Yup.string()
    .max(500, 'Details must be less than 500 characters'),
});

const RefundReturnModal = ({ isOpen, onClose, orderId, requestType, onSuccess }) => {
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
        reason: values.reason,
        details: values.details,
      };

      if (requestType === 'refund') {
        await buyerAPI.requestRefund(orderId, data);
        showToast('Refund request submitted successfully', 'success');
      } else {
        await buyerAPI.requestReturn(orderId, data);
        showToast('Return request submitted successfully', 'success');
      }

      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit request. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const title = requestType === 'refund' ? 'Request Refund' : 'Request Return';
  const subtitle = requestType === 'refund'
    ? 'Please provide the reason why you want a refund'
    : 'Please provide the reason why you want to return this order';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md ${cardBg} rounded-2xl border ${cardBorder} shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-inherit">
          <div>
            <h2 className={`text-xl font-bold ${textPrimary}`}>{title}</h2>
            <p className={`text-sm ${textSecondary} mt-1`}>{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
            disabled={submitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <Formik
          initialValues={{ reason: '', details: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, isValid }) => (
            <Form className="p-6 space-y-5">
              {/* Reason Field */}
              <div>
                <label className={`block text-sm font-semibold ${labelText} mb-2`}>
                  Reason <span className="text-red-500">*</span>
                </label>
                <Field
                  as="textarea"
                  name="reason"
                  placeholder="Enter reason for your request..."
                  rows="3"
                  className={`w-full px-4 py-3 rounded-lg border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none ${textPrimary}`}
                />
                <ErrorMessage
                  name="reason"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
                <p className={`text-xs ${textSecondary} mt-1`}>
                  {values.reason.length}/required minimum
                </p>
              </div>

              {/* Details Field */}
              <div>
                <label className={`block text-sm font-semibold ${labelText} mb-2`}>
                  Additional Details <span className="text-gray-400">(optional)</span>
                </label>
                <Field
                  as="textarea"
                  name="details"
                  placeholder="Provide any additional details..."
                  rows="2"
                  className={`w-full px-4 py-3 rounded-lg border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none ${textPrimary}`}
                />
                <ErrorMessage
                  name="details"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
                <p className={`text-xs ${textSecondary} mt-1`}>
                  {values.details.length}/500 characters
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
                  disabled={submitting || !isValid}
                  className={`flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors ${buttonHover} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    `Submit ${title}`
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

export default RefundReturnModal;
