// import React, { useMemo, useState } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { useTheme } from '../../context/ThemeContext';
// import { useToast } from '../../context/ToastContext';
// import { X, Loader2, CheckCircle2, XCircle } from 'lucide-react';
// import { vendorAPI } from '../../api/apiClient';

// const getActions = (requestType) => {
//   if (requestType === 'refund') {
//     return [
//       { value: 'approved', label: 'Approve Refund', hint: 'Accept this refund request' },
//       { value: 'processing', label: 'Mark Processing', hint: 'Refund is being processed' },
//       { value: 'refunded', label: 'Mark Refunded', hint: 'Money has been sent back' },
//       { value: 'completed', label: 'Complete Refund', hint: 'Close this refund case' },
//       { value: 'rejected', label: 'Reject Refund', hint: 'Deny this refund request' },
//     ];
//   }

//   return [
//     { value: 'approved', label: 'Approve Return', hint: 'Accept this return request' },
//     { value: 'buyer_shipping', label: 'Buyer Shipping Item', hint: 'Buyer should send item back' },
//     { value: 'returned', label: 'Mark Returned', hint: 'Item has been returned' },
//     { value: 'inspection', label: 'Mark Inspection', hint: 'Returned item is being checked' },
//     { value: 'completed', label: 'Complete Return', hint: 'Close this return case' },
//     { value: 'rejected', label: 'Reject Return', hint: 'Deny this return request' },
//   ];
// };

// const buildValidationSchema = (allowedActions) =>
//   Yup.object({
//     action: Yup.string()
//       .required('Please select an action')
//       .oneOf(allowedActions, 'Invalid action'),
//     response: Yup.string().when('action', {
//       is: 'rejected',
//       then: () =>
//         Yup.string()
//           .required('Response is required when rejecting')
//           .min(5, 'Response must be at least 5 characters')
//           .max(500, 'Response must be less than 500 characters'),
//       otherwise: () =>
//         Yup.string().max(500, 'Response must be less than 500 characters'),
//     }),
//   });

// const ReviewRefundReturnModal = ({
//   isOpen,
//   onClose,
//   request,
//   requestType,
//   onSuccess,
// }) => {
//   const { isDark } = useTheme();
//   const { showToast } = useToast();
//   const [submitting, setSubmitting] = useState(false);

//   const actions = useMemo(() => getActions(requestType), [requestType]);
//   const validationSchema = useMemo(
//     () => buildValidationSchema(actions.map((action) => action.value)),
//     [actions]
//   );

//   const activeRequest =
//     requestType === 'refund'
//       ? request?.refundRequest
//       : request?.returnRequest;

//   const title =
//     requestType === 'refund'
//       ? 'Review Refund Request'
//       : 'Review Return Request';

//   const cardBg = isDark ? 'bg-[#13131a]' : 'bg-white';
//   const cardBorder = isDark ? 'border-white/[0.06]' : 'border-gray-200';
//   const textPrimary = isDark ? 'text-gray-100' : 'text-gray-900';
//   const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
//   const inputBg = isDark
//     ? 'bg-gray-900 border-gray-800'
//     : 'bg-gray-50 border-gray-200';
//   const labelText = isDark ? 'text-gray-300' : 'text-gray-700';

//   const handleSubmit = async (values) => {
//     try {
//       setSubmitting(true);

//       const data = {
//         action: values.action,
//         response: values.response?.trim() || '',
//       };

//       if (requestType === 'refund') {
//         await vendorAPI.reviewRefundRequest(request.orderId, data);
//         showToast('Refund request updated successfully', 'success');
//       } else {
//         await vendorAPI.reviewReturnRequest(request.orderId, data);
//         showToast('Return request updated successfully', 'success');
//       }

//       onSuccess?.();
//       onClose?.();
//     } catch (error) {
//       const message =
//         error.response?.data?.message ||
//         'Failed to review request. Please try again.';
//       showToast(message, 'error');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!isOpen || !request) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//       <div className={`w-full max-w-md ${cardBg} rounded-2xl border ${cardBorder} shadow-2xl`}>
//         <div className="flex items-center justify-between p-6 border-b border-inherit">
//           <h2 className={`text-xl font-bold ${textPrimary}`}>{title}</h2>

//           <button
//             type="button"
//             onClick={onClose}
//             disabled={submitting}
//             className={`p-2 rounded-lg ${
//               isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
//             } transition-colors disabled:opacity-50`}
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className={`px-6 py-4 border-b border-inherit ${isDark ? 'bg-gray-900/50' : 'bg-gray-50/50'}`}>
//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between gap-4">
//               <span className={textSecondary}>Order ID:</span>
//               <span className={`font-mono font-semibold uppercase ${textPrimary}`}>
//                 {request.orderId?.slice(-8) || 'N/A'}
//               </span>
//             </div>

//             <div className="flex justify-between gap-4">
//               <span className={textSecondary}>Customer:</span>
//               <span className={`font-semibold ${textPrimary}`}>
//                 {request.buyerInfo?.username ||
//                   request.buyerInfo?.fullName ||
//                   'Unknown'}
//               </span>
//             </div>

//             <div className="flex justify-between gap-4">
//               <span className={textSecondary}>Current Status:</span>
//               <span className={`font-semibold capitalize ${textPrimary}`}>
//                 {activeRequest?.status || 'none'}
//               </span>
//             </div>

//             <div className="flex justify-between gap-4">
//               <span className={textSecondary}>Reason:</span>
//               <span className={`font-semibold text-right ${textPrimary}`}>
//                 {activeRequest?.reason || 'No reason provided'}
//               </span>
//             </div>
//           </div>
//         </div>

//         <Formik
//           initialValues={{ action: '', response: '' }}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ values, isValid }) => (
//             <Form className="p-6 space-y-5">
//               <div>
//                 <label className={`block text-sm font-semibold ${labelText} mb-3`}>
//                   Action <span className="text-red-500">*</span>
//                 </label>

//                 <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
//                   {actions.map((action) => {
//                     const isRejected = action.value === 'rejected';

//                     return (
//                       <label
//                         key={action.value}
//                         className={`flex items-center gap-3 p-3 rounded-lg border ${inputBg} cursor-pointer hover:opacity-80 transition-opacity`}
//                       >
//                         <Field
//                           type="radio"
//                           name="action"
//                           value={action.value}
//                           className="w-4 h-4 cursor-pointer"
//                         />

//                         <div>
//                           <p className={`text-sm font-semibold flex items-center gap-2 ${textPrimary}`}>
//                             {isRejected ? (
//                               <XCircle className="w-4 h-4 text-red-500" />
//                             ) : (
//                               <CheckCircle2 className="w-4 h-4 text-emerald-500" />
//                             )}
//                             {action.label}
//                           </p>

//                           <p className={`text-xs ${textSecondary}`}>
//                             {action.hint}
//                           </p>
//                         </div>
//                       </label>
//                     );
//                   })}
//                 </div>

//                 <ErrorMessage
//                   name="action"
//                   component="p"
//                   className="text-red-500 text-xs mt-2"
//                 />
//               </div>

//               <div>
//                 <label className={`block text-sm font-semibold ${labelText} mb-2`}>
//                   Response
//                   {values.action === 'rejected' && (
//                     <span className="text-red-500"> *</span>
//                   )}
//                   <span className="text-gray-400 font-normal ml-2">
//                     {values.action === 'rejected'
//                       ? '(required for rejection)'
//                       : '(optional)'}
//                   </span>
//                 </label>

//                 <Field
//                   as="textarea"
//                   name="response"
//                   placeholder={
//                     values.action === 'rejected'
//                       ? "Explain why you're rejecting this request..."
//                       : 'Add comments, instructions, or next steps...'
//                   }
//                   rows="4"
//                   className={`w-full px-4 py-3 rounded-lg border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none ${textPrimary}`}
//                 />

//                 <ErrorMessage
//                   name="response"
//                   component="p"
//                   className="text-red-500 text-xs mt-1"
//                 />

//                 <p className={`text-xs ${textSecondary} mt-1`}>
//                   {values.response.length}/500 characters
//                 </p>
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   disabled={submitting}
//                   className={`flex-1 px-4 py-2 rounded-lg border ${cardBorder} ${textPrimary} font-medium text-sm transition-colors ${
//                     isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-50'
//                   } disabled:opacity-50`}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={submitting || !isValid || !values.action}
//                   className={`flex-1 px-4 py-2 rounded-lg ${
//                     values.action === 'rejected'
//                       ? 'bg-red-600 hover:bg-red-700'
//                       : values.action
//                       ? 'bg-emerald-600 hover:bg-emerald-700'
//                       : 'bg-gray-400'
//                   } text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
//                 >
//                   {submitting ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       Updating...
//                     </>
//                   ) : (
//                     <>
//                       {values.action === 'rejected' ? (
//                         <XCircle className="w-4 h-4" />
//                       ) : (
//                         values.action && <CheckCircle2 className="w-4 h-4" />
//                       )}
//                       Submit
//                     </>
//                   )}
//                 </button>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default ReviewRefundReturnModal;

import React, { useMemo, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { X, Loader2, CheckCircle2, XCircle, CircleDot } from 'lucide-react';
import { vendorAPI } from '../../api/apiClient';

const ACTION_FLOW = {
  refund: {
    pending_review: [
      { value: 'approved', label: 'Approve Refund', hint: 'Accept this refund request' },
      { value: 'rejected', label: 'Reject Refund', hint: 'Deny this refund request' },
    ],
    approved: [
      { value: 'processing', label: 'Mark Processing', hint: 'Refund is being processed' },
    ],
    processing: [
      { value: 'refunded', label: 'Mark Refunded', hint: 'Money has been sent back' },
    ],
    refunded: [
      { value: 'completed', label: 'Complete Refund', hint: 'Close this refund case' },
    ],
  },

  return: {
    pending_review: [
      { value: 'approved', label: 'Approve Return', hint: 'Accept this return request' },
      { value: 'rejected', label: 'Reject Return', hint: 'Deny this return request' },
    ],
    approved: [
      { value: 'buyer_shipping', label: 'Buyer Shipping Item', hint: 'Buyer should send item back' },
    ],
    buyer_shipping: [
      { value: 'returned', label: 'Mark Returned', hint: 'Item has been returned' },
    ],
    returned: [
      { value: 'inspection', label: 'Mark Inspection', hint: 'Returned item is being checked' },
    ],
    inspection: [
      { value: 'completed', label: 'Complete Return', hint: 'Close this return case' },
    ],
  },
};

const buildValidationSchema = (allowedActions) =>
  Yup.object({
    action: Yup.string()
      .required('Please select an action')
      .oneOf(allowedActions, 'Invalid action'),

    response: Yup.string().when('action', {
      is: 'rejected',
      then: () =>
        Yup.string()
          .required('Response is required when rejecting')
          .min(5, 'Response must be at least 5 characters')
          .max(500, 'Response must be less than 500 characters'),
      otherwise: () =>
        Yup.string().max(500, 'Response must be less than 500 characters'),
    }),

    refundReference: Yup.string().when('action', {
      is: 'refunded',
      then: () =>
        Yup.string()
          .required('Refund reference is required')
          .min(3, 'Refund reference must be at least 3 characters'),
      otherwise: () => Yup.string(),
    }),

    inspectionNote: Yup.string().when('action', {
      is: 'inspection',
      then: () =>
        Yup.string().max(500, 'Inspection note must be less than 500 characters'),
      otherwise: () => Yup.string(),
    }),
  });

const formatStatus = (status) => {
  if (!status) return 'None';
  return status.replaceAll('_', ' ');
};

const ReviewRefundReturnModal = ({
  isOpen,
  onClose,
  request,
  requestType,
  onSuccess,
}) => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const activeRequest =
    requestType === 'refund' ? request?.refundRequest : request?.returnRequest;

  const currentStatus = activeRequest?.status || 'none';

  const actions = useMemo(() => {
    return ACTION_FLOW[requestType]?.[currentStatus] || [];
  }, [requestType, currentStatus]);

  const validationSchema = useMemo(
    () => buildValidationSchema(actions.map((action) => action.value)),
    [actions]
  );

  const title =
    requestType === 'refund'
      ? 'Review Refund Request'
      : 'Review Return Request';

  const cardBg = isDark ? 'bg-[#13131a]' : 'bg-white';
  const cardBorder = isDark ? 'border-white/[0.06]' : 'border-gray-200';
  const textPrimary = isDark ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = isDark
    ? 'bg-gray-900 border-gray-800'
    : 'bg-gray-50 border-gray-200';
  const labelText = isDark ? 'text-gray-300' : 'text-gray-700';

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);

      const data = {
        action: values.action,
        response: values.response?.trim() || '',
      };

      if (values.action === 'refunded') {
        data.refundReference = values.refundReference.trim();
      }

      if (values.action === 'inspection') {
        data.inspectionNote = values.inspectionNote?.trim() || '';
      }

      if (requestType === 'refund') {
        await vendorAPI.reviewRefundRequest(request.orderId, data);
        showToast('Refund request updated successfully', 'success');
      } else {
        await vendorAPI.reviewReturnRequest(request.orderId, data);
        showToast('Return request updated successfully', 'success');
      }

      onSuccess?.();
      onClose?.();
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Failed to review request. Please try again.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md ${cardBg} rounded-2xl border ${cardBorder} shadow-2xl`}>
        <div className="flex items-center justify-between p-6 border-b border-inherit">
          <h2 className={`text-xl font-bold ${textPrimary}`}>{title}</h2>

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

        <div className={`px-6 py-4 border-b border-inherit ${
          isDark ? 'bg-gray-900/50' : 'bg-gray-50/50'
        }`}>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className={textSecondary}>Order ID:</span>
              <span className={`font-mono font-semibold uppercase ${textPrimary}`}>
                {request.orderId?.slice(-8) || 'N/A'}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className={textSecondary}>Customer:</span>
              <span className={`font-semibold ${textPrimary}`}>
                {request.buyerInfo?.username ||
                  request.buyerInfo?.fullName ||
                  'Unknown'}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className={textSecondary}>Current Status:</span>
              <span className={`font-semibold capitalize ${textPrimary}`}>
                {formatStatus(currentStatus)}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className={textSecondary}>Reason:</span>
              <span className={`font-semibold text-right ${textPrimary}`}>
                {activeRequest?.reason || 'No reason provided'}
              </span>
            </div>
          </div>
        </div>

        <Formik
          initialValues={{
            action: '',
            response: '',
            refundReference: '',
            inspectionNote: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, isValid }) => (
            <Form className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {actions.length === 0 ? (
                <div className={`p-4 rounded-xl border ${cardBorder}`}>
                  <p className={`text-sm font-semibold ${textPrimary}`}>
                    No next action available
                  </p>
                  <p className={`text-xs mt-1 ${textSecondary}`}>
                    This request is already {formatStatus(currentStatus)}.
                  </p>
                </div>
              ) : (
                <div>
                  <label className={`block text-sm font-semibold ${labelText} mb-3`}>
                    Next Action <span className="text-red-500">*</span>
                  </label>

                  <div className="space-y-2">
                    {actions.map((action) => {
                      const isRejected = action.value === 'rejected';

                      return (
                        <label
                          key={action.value}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${inputBg} cursor-pointer hover:opacity-80 transition-opacity`}
                        >
                          <Field
                            type="radio"
                            name="action"
                            value={action.value}
                            className="w-4 h-4 cursor-pointer"
                          />

                          <div>
                            <p className={`text-sm font-semibold flex items-center gap-2 ${textPrimary}`}>
                              {isRejected ? (
                                <XCircle className="w-4 h-4 text-red-500" />
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              )}
                              {action.label}
                            </p>

                            <p className={`text-xs ${textSecondary}`}>
                              {action.hint}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <ErrorMessage
                    name="action"
                    component="p"
                    className="text-red-500 text-xs mt-2"
                  />
                </div>
              )}

              {values.action === 'refunded' && (
                <div>
                  <label className={`block text-sm font-semibold ${labelText} mb-2`}>
                    Refund Reference <span className="text-red-500">*</span>
                  </label>

                  <Field
                    type="text"
                    name="refundReference"
                    placeholder="Enter transfer/reference ID"
                    className={`w-full px-4 py-3 rounded-lg border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 ${textPrimary}`}
                  />

                  <ErrorMessage
                    name="refundReference"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              )}

              {values.action === 'inspection' && (
                <div>
                  <label className={`block text-sm font-semibold ${labelText} mb-2`}>
                    Inspection Note <span className="text-gray-400">(optional)</span>
                  </label>

                  <Field
                    as="textarea"
                    name="inspectionNote"
                    placeholder="Add condition notes after inspecting the returned item..."
                    rows="3"
                    className={`w-full px-4 py-3 rounded-lg border ${inputBg} text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none ${textPrimary}`}
                  />

                  <ErrorMessage
                    name="inspectionNote"
                    component="p"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              )}

              <div>
                <label className={`block text-sm font-semibold ${labelText} mb-2`}>
                  Response
                  {values.action === 'rejected' && (
                    <span className="text-red-500"> *</span>
                  )}
                  <span className="text-gray-400 font-normal ml-2">
                    {values.action === 'rejected'
                      ? '(required for rejection)'
                      : '(optional)'}
                  </span>
                </label>

                <Field
                  as="textarea"
                  name="response"
                  placeholder={
                    values.action === 'rejected'
                      ? "Explain why you're rejecting this request..."
                      : 'Add comments, instructions, or next steps...'
                  }
                  rows="4"
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
                  disabled={submitting || !isValid || !values.action || actions.length === 0}
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    values.action === 'rejected'
                      ? 'bg-red-600 hover:bg-red-700'
                      : values.action
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-gray-400'
                  } text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      {values.action === 'rejected' ? (
                        <XCircle className="w-4 h-4" />
                      ) : values.action ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <CircleDot className="w-4 h-4" />
                      )}
                      Submit
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