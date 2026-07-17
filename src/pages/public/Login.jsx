import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from '../../store/authSlice';
import { mergeCart } from '../../store/cartActions';
import apiClient from '../../api/apiClient';
import { getMessage, getTokenFromResponse, getUserFromResponse } from '../../utils/apiResponse';
import { FiMail, FiLock, FiShoppingBag } from 'react-icons/fi';
import { FaFacebook } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const { isAuthenticated, role } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && role === "buyer") {
      navigate("/buyer/dashboard", { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      role: 'buyer',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      role: Yup.string().required('Please select a role'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      dispatch(loginStart());
      try {
        const response = await apiClient.post(`/buyer/auth/login`, {
          email: values.email,
          password: values.password,
        });

        const token = getTokenFromResponse(response);
        const user = getUserFromResponse(response);

        if (!token) {
          throw new Error('Login succeeded but no token was returned by the server.');
        }

        dispatch(loginSuccess({
          user,
          token,
          role: 'buyer',
        }));

        showToast('Login successful!', 'success');
        navigate(`/buyer/dashboard`);
      } catch (error) {
        const message = getMessage(error, 'Login failed.');
        dispatch(loginFailure(message));
        showToast(message, 'error');
      } finally {
        setLoading(false);
      }
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(mergeCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleSocialLogin = (provider) => {
    showToast(`${provider} login coming soon`, 'info');
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await apiClient.post(
        "/buyer/auth/google",
        {
          idToken: credentialResponse.credential,
        }
      );

      const token = getTokenFromResponse(response);
      const user = getUserFromResponse(response);

      dispatch(
        loginSuccess({
          user,
          token,
          role: "buyer",
        })
      );

      showToast("Google login successful", "success");

      if (!user.onboardingCompleted) {
        navigate("/buyer/profile/complete");
        return;
      }

      navigate("/buyer/dashboard");
    } catch (error) {
      showToast(
        getMessage(error, "Google login failed"),
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top Premium Brand Header - Sticky/Top flow fixed */}
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

      {/* Main Content Area - Properly Centers the Login Box */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <Link to="/" className="flex items-center">
                <FiShoppingBag className="h-12 w-12 text-green-600" />
                <div className="ml-3">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    CampusTrade
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Independent platform for the student community
                  </p>
                </div>
              </Link>
            </div>

            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>

            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Or{' '}
              <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                create a new account
              </Link>
            </p>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Or{' '}
              <Link to="/vendor/login" className="font-medium text-green-600 hover:text-green-500">
                are you a vendor
              </Link>
            </p>
          </div>

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
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
                )}
              </div>

              {/* Password Input Field */}
              <div className='flex flex-col'>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <Link to={'/forget-password'} className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-xs text-red-500">{formik.errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-150 ease-in-out font-medium disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Social Logins Wrapper */}
            <div className="mt-6">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center justify-center">
                <div className="flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() =>
                      showToast(
                        "Google login failed",
                        "error"
                      )
                    }
                  />
                </div>

                <button
                  onClick={() => handleSocialLogin('Facebook')}
                  className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                >
                  <FaFacebook className="h-5 w-5 text-blue-600" />
                  <span className="ml-2">Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;