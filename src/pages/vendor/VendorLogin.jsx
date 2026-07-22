import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import {
    Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck,
    Zap, BarChart3, Loader2
} from 'lucide-react';
import { FiShoppingBag } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/apiClient';
import { useDispatch, useSelector } from 'react-redux'
import { loginFailure, loginStart, loginSuccess } from '../../store/authSlice';
import { getMessage, getTokenFromResponse, getUserFromResponse } from '../../utils/apiResponse';

export default function VendorLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const dispatch = useDispatch();
    const { isAuthenticated, role } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isAuthenticated && role === "vendor") {
            navigate("/vendor/dashboard", { replace: true });
        }
    }, [isAuthenticated, role, navigate]);

    const isEmailVerificationError = (message) => {
        const lowerMessage = String(message || '').toLowerCase();
        return (
            lowerMessage.includes('verify') && (lowerMessage.includes('email') || lowerMessage.includes('verification'))
        ) || lowerMessage.includes('email not verified') || lowerMessage.includes('not verified');
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            role: 'vendor',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values) => {
            if (loading) return;
            setLoading(true);
            dispatch(loginStart());
            try {
                const payload = {
                    email: values.email,
                    password: values.password,
                };

                const response = await apiClient.post(`/vendor/auth/login`, payload);

                const token = getTokenFromResponse(response);
                const user = getUserFromResponse(response);

                if (!token) {
                    throw new Error('Login succeeded but no token was returned by the server.');
                }

                dispatch(loginSuccess({
                    user,
                    token,
                    role: 'vendor',
                }));


                showToast('Login successful.', 'success');
                navigate('/vendor/dashboard');
            } catch (error) {
                const message = getMessage(error, 'Unable to login. Please try again.');
                dispatch(loginFailure(message));
                showToast(message, 'error');

                if (isEmailVerificationError(message)) {
                    setTimeout(() => navigate('/resend-verification-email', { replace: true }), 150);
                }
            } finally {
                setLoading(false);
            }
        }
    });


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] flex flex-col lg:flex-row font-sans selection:bg-emerald-500/20 selection:text-emerald-500">

            {/* LEFT SIDEBAR: Premium Branding & Social Proof */}
            <div className="relative w-full lg:w-[45%] xl:w-[40%] bg-slate-900 dark:bg-[#070A13] p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
                {/* Background Ambient Gradients */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-10 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Top Section: App Identity */}
                <div className="relative z-10">
                    <Link to="/" className="inline-flex items-center space-x-3 group">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center transition-transform group-hover:scale-105">
                            <FiShoppingBag className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-white tracking-tight">Campus<span className="text-emerald-400">Trade</span></span>
                            <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Vendor Suite</span>
                        </div>
                    </Link>

                    {/* Onboarding Value Pitch */}
                    <div className="mt-16 lg:mt-24 space-y-6">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                            Manage your store with confidence.
                        </h1>
                        <p className="text-base text-slate-400 max-w-md leading-relaxed">
                            Welcome back. Sign in to manage your products, process customer orders, respond to buyers, and grow your business on CampusTrade.
                        </p>
                    </div>
                </div>

                {/* Bottom Section: Feature Trust Elements */}
                <div className="mt-12 lg:mt-0 relative z-10 space-y-5 border-t border-slate-800/60 pt-8">
                    <div className="flex items-start space-x-4">
                        <div className="mt-0.5 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-emerald-400">
                            <Zap className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-200">Instant Order Management</h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Receive new orders instantly, process requests faster, and keep your customers updated.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="mt-0.5 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-emerald-400">
                            <BarChart3 className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-200">Sales & Store Insights</h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Monitor sales performance, customer activity, and product demand from your dashboard.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="mt-0.5 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-emerald-400">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-200">Secure Payments</h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Trade with confidence through verified transactions and protected payment processing.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDEBAR: Elegant Form Framework */}
            <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-12 lg:px-16 xl:px-24 py-12 lg:py-16 overflow-y-auto max-h-screen">
                <div className="w-full max-w-md space-y-8">

                    {/* Form Intro Meta */}
                    <div className="flex flex-col space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Sign in to your Merchant Portal
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            New to the platform?{' '}
                            <Link to="/vendor/register" className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
                                Apply for a vendor account
                            </Link>
                        </p>
                    </div>

                    {/* Main Form Container */}
                    <div className="bg-white dark:bg-[#111625] border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-100/50 dark:shadow-none rounded-2xl p-6 sm:p-8">
                        <form onSubmit={formik.handleSubmit} className="space-y-5">

                            {/* email */}
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 uppercase">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formik.values.email}
                                        placeholder='vendor@example.com'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full bg-slate-50 dark:bg-[#161D30] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200 border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20"
                                    />
                                </div>

                                {formik.touched.email && formik.errors.email && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {formik.errors.email}
                                    </p>
                                )}
                            </div>

                            {/* password */}
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                                        Password
                                    </label>
                                    <Link to={'/forget-password'} className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        id="password"
                                        value={formik.values.password}
                                        placeholder='••••••••'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full bg-slate-50 dark:bg-[#161D30] border rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200 border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>

                                {formik.touched.password && formik.errors.password && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {formik.errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Submit CTA */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full relative bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/70 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/10 dark:shadow-none transition-all duration-200 flex items-center justify-center space-x-2 text-sm transform active:scale-[0.99] disabled:transform-none disabled:cursor-not-allowed group"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                                            <span>Authenticating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-0.5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Bottom Micro-copy Disclaimer */}
                    <p className="text-center text-xs text-slate-400 dark:text-slate-500 px-4">
                        CampusTrade uses secure authentication to protect your account and business information. By continuing, you agree to comply with system distribution guardrails.
                    </p>
                </div>
            </div>

        </div>
    );
}