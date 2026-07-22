import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ShieldCheck,
  ShieldAlert,
  LoaderCircle,
  Mail,
  Lock,
  MapPin,
  Laptop,
  Clock3,
  CheckCircle2,
  XCircle,
  ArrowRight,
  LifeBuoy,
  HelpCircle,
} from "lucide-react";

import FAQ from "../../components/layout/FAQ";
import { getMessage } from "../../utils/apiResponse";
import apiClient from "../../api/apiClient";

export default function UnauthorizedEmailChange() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");

  const handleSecurityReport = async () => {
    try {
      setLoading(true);

      const response = await apiClient.post(
        `/security/unauthorized-email-change`,
        {
          token,
        }
      );

      setCompleted(true);
      setAccount(response.data.data);
    } catch (err) {
      setError(
        getMessage(err, "Unable to verify this security request.")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("This security link is invalid or has expired.");
      return;
    }

    handleSecurityReport();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans text-gray-800 dark:text-slate-100 transition-colors duration-200 selection:bg-[#10B981]/10 selection:text-[#10B981]">
      
      {/* Top Header Bar */}
      <header className="w-full bg-[#1F2937] dark:bg-slate-900 border-b border-gray-800 dark:border-slate-800 py-5 px-6 sm:px-12 flex justify-between items-center z-10">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-2 bg-gradient-to-b from-[#79b801] to-[#F59E0B] rounded-full" />
          <img src="https://res.cloudinary.com/dnao9hmx9/image/upload/v1784039850/Campus_trade_logo_green_2_oz2dil.png" width={70} alt="CampusTrade" />
        </div>
        <div className="flex items-center text-xs tracking-wider uppercase text-gray-300 dark:text-gray-400 font-bold space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>Security Center</span>
        </div>
      </header>

      {/* Main Single-Column Content Area */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-8 relative">
        <div className="w-full relative z-10">
          
          {/* Subtle Backglow Accent Blobs */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#10B981]/5 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#F59E0B]/5 rounded-full blur-3xl -z-10" />

          {/* Loading State Card */}
          {loading ? (
            <div className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center shadow-sm dark:shadow-2xl transition-colors duration-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 mb-6 animate-pulse">
                <LoaderCircle size={36} className="animate-spin" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                Verifying Security Request
              </h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
                Please hold on while we evaluate your security token and secure your account.
              </p>
            </div>
          ) : (
            /* Main Security Action Card */
            <div className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl transition-all duration-300">
              
              {/* Header Banner */}
              <div
                className={`p-6 sm:p-10 relative overflow-hidden ${
                  completed
                    ? "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600"
                    : "bg-gradient-to-r from-rose-600 via-red-600 to-amber-600"
                }`}
              >
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white shrink-0">
                    {completed ? (
                      <ShieldCheck size={40} />
                    ) : (
                      <ShieldAlert size={40} />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                      {completed
                        ? "Your Account Has Been Protected"
                        : "Unauthorized Email Change"}
                    </h1>
                    <p className="text-white/80 text-sm sm:text-base max-w-2xl">
                      {completed
                        ? "We successfully received your security report and initiated protection protocols for your CampusTrade account."
                        : "Someone may have attempted to change your registered account email without authorization."}
                    </p>
                  </div>
                </div>

                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-10 space-y-8">
                
                {/* Status Alert Banner */}
                {!completed ? (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-200">
                      <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-rose-900 dark:text-rose-100 text-base mb-1">
                          Verification Failed
                        </h5>
                        <p className="text-sm text-rose-700 dark:text-rose-200/80 leading-relaxed">
                          {error}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-800 space-y-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        What happened?
                      </h4>
                      <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">
                        We couldn't verify this security request. This usually happens when the link has expired, was already processed, or is invalid.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex items-start gap-4 p-5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-emerald-900 dark:text-emerald-100 text-base mb-1">
                          Security Report Received
                        </h5>
                        <p className="text-sm text-emerald-700 dark:text-emerald-200/80 leading-relaxed">
                          We've flagged your account for immediate protection. Unrecognized activity has been halted.
                        </p>
                      </div>
                    </div>

                    {/* Protection Overview Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 rounded-xl bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                          <Mail size={20} />
                        </div>
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">
                          Email Modification Restricted
                        </h5>
                        <p className="text-gray-600 dark:text-slate-400 text-xs leading-relaxed">
                          Your email settings are temporarily locked to prevent malicious takeover.
                        </p>
                      </div>

                      <div className="p-5 rounded-xl bg-gray-50 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
                          <Lock size={20} />
                        </div>
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">
                          Sessions Reviewed
                        </h5>
                        <p className="text-gray-600 dark:text-slate-400 text-xs leading-relaxed">
                          Active logins are restricted and extra verification challenges are enabled.
                        </p>
                      </div>
                    </div>

                    {/* Metadata Details */}
                    {account && (
                      <div className="space-y-3 pt-2">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                          Report Details
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-800/30 border border-gray-200 dark:border-slate-800 flex items-center gap-3">
                            <Laptop size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <div className="overflow-hidden">
                              <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                                Device
                              </span>
                              <span className="block text-xs font-semibold text-gray-800 dark:text-slate-200 truncate">
                                {account.device || "Unknown Device"}
                              </span>
                            </div>
                          </div>

                          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-800/30 border border-gray-200 dark:border-slate-800 flex items-center gap-3">
                            <MapPin size={18} className="text-rose-600 dark:text-rose-400 shrink-0" />
                            <div className="overflow-hidden">
                              <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                                Location
                              </span>
                              <span className="block text-xs font-semibold text-gray-800 dark:text-slate-200 truncate">
                                {account.location || "Unknown Location"}
                              </span>
                            </div>
                          </div>

                          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-800/30 border border-gray-200 dark:border-slate-800 flex items-center gap-3">
                            <Clock3 size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
                            <div className="overflow-hidden">
                              <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                                Time
                              </span>
                              <span className="block text-xs font-semibold text-gray-800 dark:text-slate-200 truncate">
                                {account.reportedAt || "Just now"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Automated Safeguards Section */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                    Automated Protection Measures
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/30 border border-gray-200 dark:border-slate-800/60 space-y-1">
                      <ShieldCheck size={22} className="text-emerald-600 dark:text-emerald-400 mb-1" />
                      <h6 className="font-semibold text-gray-900 dark:text-slate-100 text-xs">
                        Audit Log Logged
                      </h6>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">
                        A security event has been registered for system investigation.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/30 border border-gray-200 dark:border-slate-800/60 space-y-1">
                      <Lock size={22} className="text-rose-600 dark:text-rose-400 mb-1" />
                      <h6 className="font-semibold text-gray-900 dark:text-slate-100 text-xs">
                        Unrecognized Logins Cleared
                      </h6>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">
                        Unauthenticated active sessions are scheduled for termination.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/30 border border-gray-200 dark:border-slate-800/60 space-y-1">
                      <LifeBuoy size={22} className="text-amber-600 dark:text-amber-400 mb-1" />
                      <h6 className="font-semibold text-gray-900 dark:text-slate-100 text-xs">
                        Support Escalation
                      </h6>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">
                        Our desk has been notified for secondary review.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommended Next Action Steps */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                    Recommended Action Steps
                  </h4>

                  <div className="p-5 rounded-xl bg-gray-50 dark:bg-slate-800/30 border border-gray-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <h6 className="font-semibold text-gray-800 dark:text-slate-200 text-xs">
                          Check Your Primary Inbox
                        </h6>
                        <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">
                          Verify confirmation details sent to your registered email address.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <h6 className="font-semibold text-gray-800 dark:text-slate-200 text-xs">
                          Reset Password Immediately
                        </h6>
                        <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">
                          Update your password using a complex combination of credentials.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <h6 className="font-semibold text-gray-800 dark:text-slate-200 text-xs">
                          Enable Two-Factor Authentication (2FA)
                        </h6>
                        <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">
                          Add multi-factor security barriers to ensure your account remains safe.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Integrated FAQ */}
                <div className="pt-2 border-t border-gray-200 dark:border-slate-800">
                  <FAQ />
                </div>

                {/* Bottom Navigation CTA */}
                <div className="pt-4 border-t border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h6 className="font-semibold text-gray-900 dark:text-slate-200 text-xs">
                      CampusTrade System Registry
                    </h6>
                    <p className="text-[11px] text-gray-500 dark:text-slate-500">
                      Protecting user accounts and security integrity.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      to="/"
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 font-semibold text-xs transition-colors text-center"
                    >
                      Home
                    </Link>

                    <Link
                      to="/login"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-emerald-500/10"
                    >
                      <span>Login</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#1F2937] dark:bg-slate-900 border-t border-gray-800 dark:border-slate-800 py-6 px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-4">
        <p>&copy; {new Date().getFullYear()} CampusTrade System Registry. All rights reserved.</p>
        <div className="flex space-x-6">
          <Link to="/terms" className="hover:text-white transition-colors duration-150">Terms of Use</Link>
          <Link to="/privacy" className="hover:text-white transition-colors duration-150">Security Protocols</Link>
          <Link to="/contact" className="hover:text-white transition-colors duration-150">System Desk</Link>
        </div>
      </footer>
    </div>
  );
}