import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
    Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Zap, BarChart3, Loader2
} from 'lucide-react';
import { FiShoppingBag } from 'react-icons/fi';
import { getMessage } from '../../utils/apiResponse';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/apiClient';

export default function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();
    
    // Extract token and email parameters from URL query params
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
                .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
                .matches(/[0-9]/, 'Password must contain at least one number')
                .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Please confirm your password')
        }),
        onSubmit: async (values) => {
            if (loading) return;

            if (!token) {
                showToast('Reset token is missing or has expired. Please request a new password reset link.', 'error');
                return;
            }

            setLoading(true);
            try {
                const payload = {
                    token,
                    email,
                    newPassword: values.password,
                };
                
                const res = await apiClient.post(`/auth/reset-password`, payload);
                showToast(res.data?.message || 'Password reset successful!', 'success');
                navigate('/login');
            } catch (error) {
                showToast(getMessage(error, 'Reset password failed'), 'error');
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] flex flex-col lg:flex-row font-sans selection:bg-emerald-500/20 selection:text-emerald-500">

            {/* LEFT SIDEBAR: Premium Branding & Social Proof */}
            <div className="relative w-full lg:w-[45%] xl:w-[40%] bg-slate-900 dark:bg-[#070A13] p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
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
                            Build your student commerce empire.
                        </h1>
                        <p className="text-base text-slate-400 max-w-md leading-relaxed">
                            Join over 2,400+ campus merchants scaling their service businesses, clothing lines, and tech stores inside the student community.
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
                            <h4 className="text-sm font-semibold text-slate-200">Instant Digital Storefront</h4>
                            <p className="text-xs text-slate-400 mt-0.5">Go live inside your local university network within 5 minutes of verification.</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="mt-0.5 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-emerald-400">
                            <BarChart3 className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-200">Optimized Student Analytics</h4>
                            <p className="text-xs text-slate-400 mt-0.5">Track real-time search volume, trends, and demands active across your targeted campus.</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="mt-0.5 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-emerald-400">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-200">Escrow-backed Transactions</h4>
                            <p className="text-xs text-slate-400 mt-0.5">Automated secure payouts ensuring full seller protection and prompt delivery receipts.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDEBAR: Form Layout Container */}
            <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-12 lg:px-16 xl:px-24 py-12 lg:py-16 overflow-y-auto">
                <div className="w-full max-w-md space-y-8">

                    {/* Form Intro Meta */}
                    <div className="flex flex-col space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Reset Your Password
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Please set up a strong new secure password for your account.
                        </p>
                    </div>

                    {/* Main Form Container */}
                    <div className="bg-white dark:bg-[#111625] border border-slate-200/80 dark:border-slate-800/80 shadow-xl shadow-slate-100/50 dark:shadow-none rounded-2xl p-6 sm:p-8">
                        <form onSubmit={formik.handleSubmit} className="space-y-5">
                            
                            {/* New Password */}
                            <div className="flex flex-col">
                                <label htmlFor="password" className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 uppercase">
                                    New Password
                                </label>

                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        id="password"
                                        value={formik.values.password}
                                        placeholder="••••••••"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`w-full bg-slate-50 dark:bg-[#161D30] border ${
                                            formik.touched.password && formik.errors.password 
                                                ? 'border-red-500 focus:ring-red-500/20' 
                                                : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20 focus:border-emerald-500'
                                        } rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200`}
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

                            {/* Confirm Password */}
                            <div className="flex flex-col">
                                <label htmlFor="confirmPassword" className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 uppercase">
                                    Confirm New Password
                                </label>

                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        value={formik.values.confirmPassword}
                                        placeholder="••••••••"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`w-full bg-slate-50 dark:bg-[#161D30] border ${
                                            formik.touched.confirmPassword && formik.errors.confirmPassword 
                                                ? 'border-red-500 focus:ring-red-500/20' 
                                                : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20 focus:border-emerald-500'
                                        } rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>

                                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                    <p className="mt-1.5 text-xs text-red-500">
                                        {formik.errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            {/* Password Checklist Requirements Indicator */}
                            {formik.values.password.length > 0 && (
                                <div className="p-3 bg-slate-100/60 dark:bg-[#161D30]/60 border border-slate-200/50 dark:border-slate-800/50 rounded-xl space-y-1.5 transition-all duration-300 ease-in-out">
                                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">Password Requirements:</p>
                                    <div className="grid grid-cols-1 gap-1 text-xs">
                                        <div className={`flex items-center space-x-2 ${formik.values.password.length >= 8 ? 'text-emerald-500 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                                            <span className="text-[10px]">{formik.values.password.length >= 8 ? '✓' : '○'}</span>
                                            <span>At least 8 characters</span>
                                        </div>
                                        <div className={`flex items-center space-x-2 ${/[A-Z]/.test(formik.values.password) ? 'text-emerald-500 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                                            <span className="text-[10px]">{/[A-Z]/.test(formik.values.password) ? '✓' : '○'}</span>
                                            <span>At least one uppercase letter</span>
                                        </div>
                                        <div className={`flex items-center space-x-2 ${/[a-z]/.test(formik.values.password) ? 'text-emerald-500 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                                            <span className="text-[10px]">{/[a-z]/.test(formik.values.password) ? '✓' : '○'}</span>
                                            <span>At least one lowercase letter</span>
                                        </div>
                                        <div className={`flex items-center space-x-2 ${/[0-9]/.test(formik.values.password) ? 'text-emerald-500 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                                            <span className="text-[10px]">{/[0-9]/.test(formik.values.password) ? '✓' : '○'}</span>
                                            <span>At least one number</span>
                                        </div>
                                        <div className={`flex items-center space-x-2 ${/[!@#$%^&*]/.test(formik.values.password) ? 'text-emerald-500 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                                            <span className="text-[10px]">{/[!@#$%^&*]/.test(formik.values.password) ? '✓' : '○'}</span>
                                            <span>At least one special character (!@#$%^&*)</span>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Reset Password</span>
                                            <ArrowRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-0.5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Bottom Micro-copy Disclaimer */}
                    <p className="text-center text-xs text-slate-400 dark:text-slate-500 px-4">
                        Protected by enterprise-grade cryptographic validation frameworks. By continuing, you agree to comply with system distribution guardrails.
                    </p>
                </div>
            </div>

        </div>
    );
}