import React, { useMemo, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { X, Loader2 } from 'lucide-react';
import { buyerAPI } from '../../api/apiClient';

const buildValidationSchema = (requestType) =>
  Yup.object({
    reason: Yup.string()
      .required('Reason is required')
      .min(10, 'Reason must be at least 10 characters')
      .max(300, 'Reason must be less than 300 characters'),

    details: Yup.string().max(500, 'Details must be less than 500 characters'),

    accountName:
      requestType === 'refund'
        ? Yup.string().required('Account name is required')
        : Yup.string(),

    accountNumber:
      requestType === 'refund'
        ? Yup.string()
            .required('Account number is required')
            .matches(/^[0-9]{10}$/, 'Account number must be 10 digits')
        : Yup.string(),

    bankName:
      requestType === 'refund'
        ? Yup.string().required('Bank name is required')
        : Yup.string(),
  });

const RefundReturnModal = ({
  isOpen,
  onClose,
  orderId,
  requestType,
  onSuccess,
}) => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const validationSchema = useMemo(
    () => buildValidationSchema(requestType),
    [requestType]
  );

  const cardBg = isDark ? 'bg-[#13131a]' : 'bg-white';
  const cardBorder = isDark ? 'border-white/[0.06]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = isDark
    ? 'bg-gray-900 border-gray-800'
    : 'bg-gray-50 border-gray-200';
  const labelText = isDark ? 'text-gray-300' : 'text-gray-700';

  const isRefund = requestType === 'refund';

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);

      const data = {
        reason: values.reason.trim(),
        details: values.details?.trim() || '',
      };

      if (isRefund) {
        data.accountName = values.accountName.trim();
        data.accountNumber = values.accountNumber.trim();
        data.bankName = values.bankName.trim();

        await buyerAPI.requestRefund(orderId, data);
        showToast('Refund request submitted successfully', 'success');
      } else {
        await buyerAPI.requestReturn(orderId, data);
        showToast('Return request submitted successfully', 'success');
      }

      onSuccess?.();
      onClose?.();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to submit request. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const title = isRefund ? 'Request Refund' : 'Request Return';
  const subtitle = isRefund
    ? 'Provide refund reason and bank details for payment reversal.'
    : 'Provide why you want to return this order.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md ${cardBg} rounded-2xl border ${cardBorder} shadow-2xl`}>
        <div className="flex items-center justify-between p-6 border-b border-inherit">
          <div>
            <h2 className={`text-xl font-bold ${textPrimary}`}>{title}</h2>
            <p className={`text-sm ${textSecondary} mt-1`}>{subtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className={`p-2 rounded-lg ${
              isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            } transition-colors disabled:opacity-50`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Formik
          initialValues={{
            reason: '',
            details: '',
            accountName: '',
            accountNumber: '',
            bankName: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isValid }) => (
            <Form className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div>
                <label className={`block text-sm font-semibold ${labelText} mb-2`}>
                  Reason <span className="text-red-500">*</span>
                </label>

                <Field
                  as="textarea"
                  name="reason"
                  placeholder={
                    isRefund
                      ? 'Explain why you need a refund...'
                      : 'Explain why you want to return this order...'
                  }
                  rows="3"
                  className={`w-full px-4 py-3 rounded-lg border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none ${textPrimary}`}
                />

                <ErrorMessage
                  name="reason"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />

                <p className={`text-xs ${textSecondary} mt-1`}>
                  {values.reason.length}/300 characters
                </p>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${labelText} mb-2`}>
                  Additional Details <span className="text-gray-400">(optional)</span>
                </label>

                <Field
                  as="textarea"
                  name="details"
                  placeholder="Add extra information for the vendor..."
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

              {isRefund && (
                <div className={`p-4 rounded-xl border ${cardBorder} space-y-4`}>
                  <p className={`text-sm font-bold ${textPrimary}`}>
                    Refund Bank Details
                  </p>

                  <div>
                    <label className={`block text-sm font-semibold ${labelText} mb-2`}>
                      Account Name <span className="text-red-500">*</span>
                    </label>

                    <Field
                      type="text"
                      name="accountName"
                      placeholder="Account holder name"
                      className={`w-full px-4 py-3 rounded-lg border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 ${textPrimary}`}
                    />

                    <ErrorMessage
                      name="accountName"
                      component="p"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${labelText} mb-2`}>
                      Account Number <span className="text-red-500">*</span>
                    </label>

                    <Field
                      type="text"
                      name="accountNumber"
                      placeholder="10-digit account number"
                      maxLength="10"
                      className={`w-full px-4 py-3 rounded-lg border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 ${textPrimary}`}
                    />

                    <ErrorMessage
                      name="accountNumber"
                      component="p"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${labelText} mb-2`}>
                      Bank Name <span className="text-red-500">*</span>
                    </label>

                    <Field
                      type="text"
                      name="bankName"
                      placeholder="Bank name"
                      className={`w-full px-4 py-3 rounded-lg border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 ${textPrimary}`}
                    />

                    <ErrorMessage
                      name="bankName"
                      component="p"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className={`flex-1 px-4 py-2 rounded-lg border ${cardBorder} ${textPrimary} font-medium text-sm transition-colors ${
                    isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-50'
                  } disabled:opacity-50`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting || !isValid}
                  className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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