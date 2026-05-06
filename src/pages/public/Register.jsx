import React from 'react';
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import apiClient from '../../api/apiClient';
import { FiMail, FiLock, FiUser, FiPhone, FiBriefcase, FiShoppingBag } from 'react-icons/fi'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext';

const Register = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate();
  const { showToast } = useToast();

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phoneNo: '',
      password: '',
      confirmPassword: '',
      role: 'buyer',
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Full name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phoneNo: Yup.string().required('Phone number is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm password'),
      role: Yup.string().required('Please select a role'),
    }),

    onSubmit: async (values) => {
      if (loading) return;

      setLoading(true);
      try {
        await apiClient.post(`/${values.role}/auth/register`, {
          fullName: values.fullName,
          email: values.email,
          phoneNo: values.phoneNo,
          password: values.password,
        });

        showToast('Registration successful!', 'success');
        navigate('/login');
      } catch (error) {
        // console.log(error.response || error);
        showToast(error?.response?.data || 'Registration failed', 'error');
      } finally {
        setLoading(false);
      }
    }

  })


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Link to="/" className="flex items-center">
              <FiShoppingBag className="h-12 w-12 text-green-600" />
              <div className="ml-3">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">CampusTrade</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Independent marketplace for the student community
                </p>
              </div>
            </Link>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              sign in to existing account
            </Link>
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                I want to join as...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[{ value: 'buyer', label: 'Buyer/Customer', icon: <FiUser /> }, { value: 'vendor', label: 'Vendor/Business', icon: <FiBriefcase /> }].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => formik.setFieldValue('role', type.value)}
                    className={`py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center ${formik.values.role === type.value
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-2 border-green-500'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                  >
                    <span className="mr-2">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="block w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
                  placeholder="John Doe"
                />
              </div>
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="mt-1 relative">
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
                  className="block w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
                  placeholder="name@gmail.com"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phoneNo"
                  name="phoneNo"
                  type="tel"
                  value={formik.values.phoneNo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="block w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
                  placeholder="+234 800 000 0000"
                />
              </div>
              {formik.touched.phoneNo && formik.errors.phoneNo && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.phoneNo}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
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
                  className="block w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs text-red-500">{formik.errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="block w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
                  placeholder="••••••••"
                />
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-center">
              <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 rounded" />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                I agree to the <a href="#" className="text-green-600 hover:text-green-500">Terms of Service</a> and{' '}
                <a href="#" className="text-green-600 hover:text-green-500">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-md text-white bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {formik.values.role === 'vendor' && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note for sellers:</strong> Your account will need approval from CampusTrade administration before you can start selling. This usually takes 24-48 hours.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;