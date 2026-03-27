import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  const initialValues = {
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await apiClient.put('/buyer/profile', values);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-600';
  const inputBg = isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900';

  return (
    <div className={`min-h-screen ${bgColor} py-12`}>
      <div className="max-w-2xl mx-auto px-4">
        <h1 className={`text-3xl font-bold ${textColor} mb-8`}>My Profile</h1>

        <div className={`${cardBg} shadow-lg rounded-lg p-8`}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="fullName" className={`block text-sm font-medium ${textColor} mb-2`}>
                    Full Name
                  </label>
                  <Field
                    type="text"
                    id="fullName"
                    name="fullName"
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 rounded-md border ${isDark ? 'border-gray-600' : 'border-gray-300'} ${inputBg} disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500`}
                  />
                  <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${textColor} mb-2`}>
                    Email Address
                  </label>
                  <Field
                    type="text"
                    id="email"
                    name="email"
                    disabled={true}
                    className={`w-full px-4 py-2 rounded-md border ${isDark ? 'border-gray-600' : 'border-gray-300'} ${inputBg} disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500`}
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label htmlFor="phone" className={`block text-sm font-medium ${textColor} mb-2`}>
                    Phone Number
                  </label>
                  <Field
                    type="tel"
                    id="phone"
                    name="phone"
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 rounded-md border ${isDark ? 'border-gray-600' : 'border-gray-300'} ${inputBg} disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500`}
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="flex gap-4">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition font-semibold"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Profile;