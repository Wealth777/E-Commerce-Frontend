import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Mail,
  HelpCircle,
  GraduationCap,
  BookOpen,
  Store,
  Sparkles,
  VerifiedIcon,
  MailCheckIcon
} from 'lucide-react';
import apiClient from '../../api/apiClient';
import { getMessage } from '../../utils/apiResponse';
import Loading from '../../components/layout/Loding';

export function CampusIllustration() {
  return (
    <div className="relative h-full w-full overflow-hidden">

      {/* Dark premium visual backdrop depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/15 via-transparent to-[#F59E0B]/5" />
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#10B981]/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#F59E0B]/5 blur-3xl" />

      {/* Stylized background architectural grid pattern */}
      <svg
        className="absolute inset-0 h-full w-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Floating high-fidelity glassmorphic cards */}
      <div className="relative flex h-full w-full items-center justify-center p-8">
        <div className="relative h-[420px] w-full max-w-[520px]">

          {/* Main welcome content tray */}
          <div className="absolute left-1/2 top-1/2 h-64 w-80 -translate-x-1/2 -translate-y-1/2 rotate-[-2deg] rounded-3xl border border-gray-800 bg-gray-900/90 p-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#10B981] to-[#0D9488] text-white shadow-md">
                <GraduationCap className="h-5.5 w-5.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400">
                  Email Change
                </div>
                <div className="text-sm font-extrabold text-white">
                  Account Security
                </div>
              </div>
            </div>

            {/* Simulated Dynamic Feed Activity List */}
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center gap-3 rounded-xl bg-gray-800/40 p-3 border border-gray-800/60">
                <div className="h-8 w-8 rounded-lg bg-[#10B981]/15 flex items-center justify-center">
                  <MailCheckIcon className="w-4 h-4 text-[#10B981]" />
                </div>
                <div className="flex-grow space-y-1">
                  <div className="h-2 w-3/4 rounded-full bg-gray-700" />
                  <div className="h-2 w-1/2 rounded-full bg-gray-800" />
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-gray-800/40 p-3 border border-gray-800/60">
                <div className="h-8 w-8 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center">
                  <VerifiedIcon className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div className="flex-grow space-y-1">
                  <div className="h-2 w-2/3 rounded-full bg-gray-700" />
                  <div className="h-2 w-1/2 rounded-full bg-gray-800" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating animated icon badges */}
          <FloatBadge
            icon={<BookOpen className="h-5 w-5" />}
            className="absolute left-0 top-8 rotate-[-8deg]"
            color="emerald"
            delay={0}
          />
          <FloatBadge
            icon={<VerifiedIcon className="h-5 w-5" />}
            className="absolute right-2 top-16 rotate-[6deg]"
            color="gold"
            delay={1.2}
          />
          <FloatBadge
            icon={<Sparkles className="h-5 w-5" />}
            className="absolute bottom-12 left-8 rotate-[12deg]"
            color="teal"
            delay={2.4}
          />
          <FloatBadge
            icon={<MailCheckIcon className="h-5 w-5" />}
            className="absolute bottom-4 right-12 rotate-[-6deg]"
            color="emerald"
            delay={0.6}
          />

          {/* Glowing floating constellation particles */}
          <div className="absolute left-1/4 top-1/4 h-2 w-2 animate-ping rounded-full bg-[#10B981]" />
          <div className="absolute right-1/4 bottom-1/3 h-2 w-2 animate-ping rounded-full bg-[#F59E0B] [animation-delay:0.5s]" />
        </div>
      </div>
    </div>
  );
}

// FLOAT BADGE SUB-UTILITY
function FloatBadge({ icon, className, color, delay }) {
  const colorMap = {
    emerald: "bg-gradient-to-br from-[#10B981] to-[#0D9488] shadow-[#10B981]/25",
    teal: "bg-gradient-to-br from-[#0D9488] to-[#059669] shadow-emerald-950",
    gold: "bg-gradient-to-br from-[#F59E0B] to-[#D97706] shadow-[#F59E0B]/10",
  };

  return (
    <div
      className={`${className} animate-bounce flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-xl ${colorMap[color]}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: '5s'
      }}
    >
      {icon}
    </div>
  );
}

const VerifyChangeEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(5);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const hasVerified = useRef(false);
  const [redirectTo, setRedirectTo] = useState("/vendor/login");

  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('Verification token is missing. Please check your verification link.');
        return;
      }

      setLoading(true);

      try {
        const response = await apiClient.get("/auth/verify-changed-email", {
          params: { token },
        });

        setRedirectTo(response.data.data.redirectTo);
        setStatus("success");
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          getMessage(
            error,
            "This verification link is invalid or has expired."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    if (hasVerified.current) return;
    hasVerified.current = true;

    verifyEmailToken();
  }, [token]);

  useEffect(() => {
    let timer;

    if (status === "success" && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(c => c - 1);
      }, 1000);
    }

    if (status === "success" && countdown === 0) {
      navigate(redirectTo);
    }

    return () => clearTimeout(timer);
  }, [status, countdown, navigate]);


  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#10B981]/10 selection:text-[#10B981]">

      {/* Top Premium Brand Header */}
      <header className="w-full bg-[#1F2937] border-b border-gray-800 py-5 px-6 sm:px-12 flex justify-between items-center z-10">
        <div className="flex items-center space-x-2">
          {/* Green-to-Gold Accent Bar behind Logo area */}
          <div className="h-8 w-1 bg-gradient-to-b from-[#10B981] to-[#F59E0B] rounded-full" />
          <span className="text-xl font-extrabold tracking-tight text-white">
            Campus<span className="text-[#10B981]">Trade</span>
          </span>
        </div>
        <div className="flex items-center text-xs tracking-wider uppercase text-gray-400 font-bold space-x-1">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>Email Change Verification</span>
        </div>
      </header>

      {/* Main Split Screen Area */}
      <div className="flex-grow flex flex-col lg:flex-row">

        {/* Left Side: Verification Status Card */}
        <main className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative">
          <div className="relative w-full max-w-md z-10">
            {/* Subtle Backglow Accent Decorative Blobs */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#10B981]/5 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#F59E0B]/5 rounded-full blur-3xl -z-10" />

            {/* Verification Platform Card */}
            <div className="w-full bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(16,185,129,0.06)]">

              {/* Top Accent Gradient Bar matching brand details */}
              <div className="h-[4px] w-full bg-gradient-to-r from-[#10B981] via-[#10B981] to-[#F59E0B]" />

              {/* Inner Content Block */}
              <div className="p-8 sm:p-10 text-center">

                {/* STATE 1: VERIFYING ACTIVE PROCESS */}
                {status === 'verifying' && (
                  <div className="space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#10B981]/5 text-[#10B981] animate-pulse">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">
                        Verifying New Email Address
                      </h2>
                      <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                        Please wait while we verify your new email address and update your account.
                      </p>
                    </div>
                  </div>
                )}

                {/* STATE 2: SUCCESS PANEL */}
                {status === 'success' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-[#10B981] border border-emerald-100">
                      <CheckCircle className="w-9 h-9" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">
                        🎉 Your email address has been updated successfully.
                      </h2>
                      <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                        Your new email address has been verified and is now active on your account.
                      </p>
                    </div>

                    <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]">
                      <p className="text-xs text-gray-500 font-medium">
                        Redirecting you to the login page in{' '}
                        <span className="text-[#10B981] font-bold text-sm">{countdown}</span> seconds...
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(redirectTo)}
                      className="w-full inline-flex items-center justify-center px-5 py-3.5 bg-[#10B981] hover:bg-[#0D9488] active:scale-[0.98] text-white text-sm font-bold rounded-xl shadow-md shadow-[#10B981]/10 transition-all duration-200 group"
                    >
                      <span>Go to Login</span>
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                    </button>
                  </div>
                )}

                {/* STATE 3: ERROR / EXPIRED LINK PANEL */}
                {status === 'error' && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 text-rose-500 border border-rose-100">
                      <XCircle className="w-9 h-9" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">
                        Verification Failed
                      </h2>
                      <p className="text-sm text-rose-500 font-medium px-2 py-1 bg-rose-50 rounded-lg inline-block text-xs">
                        {errorMessage}
                      </p>
                      <p className="text-xs text-gray-400 mt-2 max-w-xs mx-auto">
                        This email change verification link is invalid, expired, or has already been used.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => navigate('/vendor/login')}
                        className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-gray-700 text-xs font-bold rounded-xl transition-all duration-150"
                      >
                        <HelpCircle className="w-4 h-4 mr-1.5 text-gray-400" />
                        Back to Login
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </main>

        {/* Right Side: Campus Illustration (Hidden on screens below 'lg') */}
        <div className="hidden lg:block lg:w-1/2 bg-gray-950 border-l border-gray-900">
          <CampusIllustration />
        </div>

      </div>

      {/* Production-Level Compliance Footer */}
      <footer className="w-full bg-[#1F2937] border-t border-gray-800 py-6 px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
        <p>&copy; {new Date().getFullYear()} CampusTrade System Registry. All rights reserved.</p>
        <div className="flex space-x-6">
          <Link to="/terms" className="hover:text-white transition-colors duration-150">Terms of Use</Link>
          <Link to="/privacy" className="hover:text-white transition-colors duration-150">Security Protocols</Link>
          <Link to="/contact" className="hover:text-white transition-colors duration-150">System Desk</Link>
        </div>
      </footer>
    </div>
  );
};

export default VerifyChangeEmail;