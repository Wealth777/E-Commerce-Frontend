import React from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../store/authSlice';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { FiMail, FiLock, FiShoppingBag } from 'react-icons/fi'
import { FaGoogle, FaFacebook } from 'react-icons/fa'

const Login = () => {
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    setLoading(true)
    try {
      const response = await apiClient.post(`/${values.role}/auth/login`, {
        email: values.email,
        password: values.password,
      });

      console.log(localStorage.getItem('token'));

      dispatch(loginSuccess({
        user: response.data.data,
        token: response.data.token,
        role: values.role,
      }));

      toast.success('Login successful!');
      navigate(`/${values.role}/dashboard`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }
  })

  const handleSocialLogin = (provider) => {
    toast.success(`${provider} login coming soon`, 'info')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Link to="/" className="flex items-center">
              <FiShoppingBag className="h-12 w-12 text-green-600" />
              <div className="ml-3">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  GMC
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
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                I am a...
              </label>

              <div className="grid grid-cols-3 gap-3">
                {['buyer', 'vendor', 'founder'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => formik.setFieldValue('role', type)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium ${
                      formik.values.role === type
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-2 border-green-500'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {type === 'buyer' ? 'Buyer' : type === 'vendor' ? 'Vendor' : 'Founder'}
                  </button>
                ))}
              </div>

              {formik.touched.role && formik.errors.role && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.role}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
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
                />
              </div>

              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
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
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="block w-full pl-10 pr-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
                />
              </div>

              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-md text-white bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center py-2 px-4 border rounded-md"
            >
              <FaGoogle className="h-5 w-5 text-red-500" />
              <span className="ml-2">Google</span>
            </button>

            <button
              onClick={() => handleSocialLogin('Facebook')}
              className="flex items-center justify-center py-2 px-4 border rounded-md"
            >
              <FaFacebook className="h-5 w-5 text-blue-600" />
              <span className="ml-2">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;