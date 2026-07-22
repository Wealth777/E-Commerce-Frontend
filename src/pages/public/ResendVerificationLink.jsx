import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { FiShoppingBag } from 'react-icons/fi';
import apiClient from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';
import { getMessage } from '../../utils/apiResponse';

const ResendVerificationLink = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
    }),
    onSubmit: async (values) => {
      if (loading) return;
      setLoading(true);
      try {
        const payload = {
          email: values.email,
        };
        
        await apiClient.post('/auth/resend-verification', payload);

        showToast('Verification link sent successfully! Please check your inbox.', 'success');
        formik.resetForm();
      } catch (error) {
        const message = getMessage(error, 'Failed to resend verification link. Please try again.');
        showToast(message, 'error');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top Premium Brand Header */}
      <header className="w-full bg-[#1F2937] border-b border-gray-800 py-4 px-6 sm:px-12 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-1 bg-gradient-to-b from-[#10B981] to-[#F59E0B] rounded-full" />
          <span className="text-xl font-extrabold tracking-tight text-white">
            Campus<span className="text-[#10B981]">Trade</span>
          </span>
        </div>
        <div className="flex items-center text-xs tracking-wider uppercase text-gray-400 font-bold space-x-1">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>Secure Gateway</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          
          {/* Logo and Typography */}
          <div>
            <div className="flex justify-center">
              <button onClick={() => navigate('/')} className="flex items-center cursor-pointer">
                <FiShoppingBag className="h-12 w-12 text-green-600" />
                <div className="ml-3 text-left">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    CampusTrade
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Independent platform for the student community
                  </p>
                </div>
              </button>
            </div>

            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
              Resend Email Verification Link
            </h2>

            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Enter your registered email address and we'll dispatch a fresh security link to verify your profile.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={formik.handleSubmit}>
              
              {/* Email Input Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="you@example.com"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-150 ease-in-out font-medium disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Sending link...</span>
                  </>
                ) : (
                  'Send Verification Link'
                )}
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-6 flex justify-center border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500 transition-colors cursor-pointer"
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResendVerificationLink;