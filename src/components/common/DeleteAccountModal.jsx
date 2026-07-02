import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

/**
 * DeleteAccountModal - A premium, accessible, and secure account deletion confirmation workflow.
 */
export default function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  accountType = 'Buyer',
  serialNumber = ''
}) {
  const [reason, setReason] = useState('');
  const [enteredSerial, setEnteredSerial] = useState('');
  const [error, setError] = useState('');

  // DOM Refs for accessibility and focus tracking
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const firstElementRef = useRef(null);
  const lastElementRef = useRef(null);

  // Reset internal states when modal toggles open/close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      setReason('');
      setEnteredSerial('');
      setError('');
      
      // Allow transition tick to execute before grabbing target focus
      setTimeout(() => {
        if (firstElementRef.current) firstElementRef.current.focus();
      }, 50);
    } else {
      if (previousFocusRef.current?.focus) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen]);

  // Handle Escape Key to exit modal cleanly
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus Trapping mechanism inside the modal boundary tree
  const handleFocusTrap = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElementRef.current) {
        lastElementRef.current.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElementRef.current) {
        firstElementRef.current.focus();
        e.preventDefault();
      }
    }
  };

  // Click outside backdrop capture handler
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Secure local form pre-submission interception check
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (enteredSerial.trim() !== serialNumber) {
      setError(`The entered serial number does not match your assigned account records.`);
      return;
    }

    onConfirm({
      reason: reason.trim(),
      serialNumber: enteredSerial.trim()
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      onClick={handleBackdropClick}
      onKeyDown={handleFocusTrap}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      {/* Responsive Layout Dimensions Configured:
        Mobile/Tablet: Responsive self-adjusting padding & width layout boundaries.
        Desktop: Bound to 60vw width & 60vh height constraints.
      */}
      <div
        ref={modalRef}
        className="w-full md:w-[60vw] md:h-auto md:min-h-[60vh] max-w-3xl flex flex-col justify-between bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-y-auto transform scale-100 transition-transform duration-300 animate-in zoom-in-95"
      >
        {/* Header Block Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 dark:bg-red-500/20 rounded-xl text-red-600 dark:text-red-400">
              <AlertTriangle className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="delete-modal-title"
                className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight"
              >
                Delete Account
              </h2>
              <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Authorized Platform Profile ({accountType})
              </span>
            </div>
          </div>
          <button
            ref={firstElementRef}
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Warning Copywriting Blocks */}
        <div id="delete-modal-description" className="mt-6 space-y-3">
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Deleting your account will completely purge your operational storefront, history, purchase records, and data profiles. This process is <strong>permanent</strong> and cannot be self-reversed.
          </p>
          <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/5 px-4 py-2.5 rounded-xl border border-amber-500/10 flex items-center gap-2">
            ⚠️ Once complete, you must contact support directly to establish any future relationships on this engine.
          </p>
        </div>

        {/* Input Target Configuration Elements Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5 flex-grow flex flex-col justify-end">
          {/* Reason text entry section */}
          <div className="flex flex-col">
            <label
              htmlFor="deletion-reason"
              className="text-xs sm:text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300"
            >
              Why are you leaving us? <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="deletion-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please tell us why you're leaving. Your feedback helps us improve."
              className="w-full bg-slate-50 dark:bg-[#161D30] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none transition-all"
            />
          </div>

          {/* Secure validation string configuration text track field */}
          <div className="flex flex-col">
            <label
              htmlFor="serial-confirmation"
              className="text-xs sm:text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300"
            >
              Account Serial Confirmation
            </label>
            <div className="bg-slate-100 dark:bg-[#1b233a] px-3.5 py-1.5 rounded-lg text-xs font-mono mb-2 inline-self-start text-slate-600 dark:text-slate-400 select-all border border-slate-200 dark:border-slate-800">
              Target Code: <span className="font-bold tracking-wider text-slate-900 dark:text-slate-100">{serialNumber}</span>
            </div>
            <input
              id="serial-confirmation"
              type="text"
              autoComplete="off"
              value={enteredSerial}
              onChange={(e) => setEnteredSerial(e.target.value)}
              placeholder={`Type or paste exact ID configuration string`}
              className="w-full font-mono bg-slate-50 dark:bg-[#161D30] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
            <p className="text-xs text-slate-400 mt-1.5">
              Enter your account serial number to confirm this action.
            </p>

            {/* Error Message Anchor */}
            {error && (
              <p className="text-xs font-medium text-red-500 mt-2 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20 animate-in slide-in-from-top-1">
                {error}
              </p>
            )}
          </div>

          {/* Modal Actions Footer row */}
          <div className="pt-6 mt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800/60">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              ref={lastElementRef}
              type="submit"
              disabled={loading || !enteredSerial.trim()}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-red-600/40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl shadow-md shadow-red-600/10 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Purging Profile...</span>
                </>
              ) : (
                <span>Delete Account</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

DeleteAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  accountType: PropTypes.oneOf(['Buyer', 'Vendor']),
  serialNumber: PropTypes.string.isRequired
};