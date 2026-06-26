import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import apiClient from '../../api/apiClient';
import { setUser } from '../../store/authSlice';
import { useToast } from '../../context/ToastContext';
import { useDispatch, useSelector } from "react-redux";

const validationSchema = Yup.object().shape({
  school: Yup.string().required('School selection is required'),
  state: Yup.string().required('State selection is required'),
  phoneNo: Yup.string()
    .matches(/^(?:\+234|234|0)(7|8|9)\d{9}$/, 'Please enter a valid Nigerian phone number')
    .required('Phone number is required'),
});

const CompleteProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [schools, setSchools] = useState([]);
  const [states, setStates] = useState([]);

  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, isAuthenticated } = useSelector(
    state => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (user?.onboardingCompleted) {
      navigate("/buyer/dashboard", { replace: true, });
    }
  }, [user, isAuthenticated, navigate]);

  // Fetch schools on component mount
  useEffect(() => {

    let mounted = true;

    const fetchSchools = async () => {
      setLoadingSchools(true);
      try {
        const response = await apiClient.get('/schools/');

        if (mounted) {
          setSchools(response.data.data || []);
        }
      } catch (error) {
        setSchools([]);
        const errorMsg = error.response?.data?.message || 'Failed to load schools. Please refresh the page.';
        showToast(errorMsg, 'error');
      } finally {
        setLoadingSchools(false);
      }
    };

    fetchSchools();

    return () => {
      mounted = false;
    };

  }, [showToast]);

  // Fetch states when school selection changes
  const handleSchoolChange = async (schoolId, setFieldValue) => {
    setFieldValue('school', schoolId);
    setFieldValue('state', ''); // Reset state selection
    setStates([]);

    if (!schoolId) return;

    setLoadingStates(true);
    try {
      const response = await apiClient.get(
        `/schools/${schoolId}/states`
      );

      setStates(response.data.data || []);
    } catch (error) {
      setStates([]);
      const errorMsg = error.response?.data?.message || 'Failed to load states for the selected school.';
      showToast(errorMsg, 'error');
    } finally {
      setLoadingStates(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    if (loading) return;
    setLoading(true)
    try {
      const response = await apiClient.put('/buyer/profile/complete', {
        school: values.school,
        state: values.state,
        phoneNo: values.phoneNo.replace(/\s+/g, ""),
      });

      if (response?.data?.success) {
        dispatch(setUser(response.data.data));
        showToast(
          response.data.message,
          "success"
        );
        navigate('/buyer/dashboard', {
          replace: true,
        });
      } else {
        showToast('Failed to complete profile. Unexpected response structure.', 'error');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'An error occurred while updating your profile. Please try again.';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
      setSubmitting(false)
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 transform transition-all">

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-full mb-4 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.263 15.918a9 9 0 1 0 15.474 0M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2.75c-4.97 0-9 2.686-9 6v.25h18v-.25c0-3.314-4.03-6-9-6z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Just a few more details to unlock secure trading on CampusTrade.
          </p>
        </div>

        {/* Formik Integration */}
        <Formik
          initialValues={{ school: '', state: '', phoneNo: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isValid, dirty, isSubmitting }) => (
            <Form className="space-y-6" noValidate>

              {/* School Select Field */}
              <div>
                <label htmlFor="school" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Select Your School
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    id="school"
                    name="school"
                    aria-label="School"
                    disabled={loadingSchools || isSubmitting || loading}
                    onChange={(e) => handleSchoolChange(e.target.value, setFieldValue)}
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm transition duration-150 ease-in-out focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-400 text-sm appearance-none"
                  >
                    <option value="">{loadingSchools ? "Loading schools..." : "Select a school"}</option>
                    {schools.map((school) => (
                      <option key={school._id} value={school._id}>
                        {school.name}
                      </option>
                    ))}
                  </Field>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    {loadingSchools ? (
                      <svg className="animate-spin h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <ErrorMessage name="school" component="p" className="mt-1.5 text-xs font-medium text-rose-500" />
              </div>

              {/* State Select Field */}
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Select Campus State Location
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    id="state"
                    name="state"
                    aria-label="State"
                    disabled={!values.school || loadingStates || isSubmitting || loading}
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm transition duration-150 ease-in-out focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-400 text-sm appearance-none"
                  >
                    <option value="">
                      {!values.school ? 'Select a school first' : 'Select a state'}
                    </option>
                    {states.map((state) => (
                      <option key={state._id} value={state._id}>
                        {state.name}
                      </option>
                    ))}
                  </Field>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    {loadingStates ? (
                      <svg className="animate-spin h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <ErrorMessage name="state" component="p" className="mt-1.5 text-xs font-medium text-rose-500" />
              </div>

              {/* Phone Number Field */}
              <div>
                <label htmlFor="phoneNo" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Field
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    disabled={loading || isSubmitting}
                    maxLength={15}
                    id="phoneNo"
                    name="phoneNo"
                    aria-label="Phone Number"
                    placeholder="e.g. 08012345678"
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm transition duration-150 ease-in-out focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-400 text-sm placeholder:text-slate-400"
                  />
                </div>
                <ErrorMessage name="phoneNo" component="p" className="mt-1.5 text-xs font-medium text-rose-500" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || loading || !isValid || !dirty}
                className="w-full flex justify-center items-center rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition duration-150 ease-in-out hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving details...
                  </>
                ) : (
                  'Complete Profile'
                )}
              </button>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CompleteProfile;