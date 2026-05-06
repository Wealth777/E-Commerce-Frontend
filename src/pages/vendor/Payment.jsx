import { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Building2,
    Landmark,
    User,
    CreditCard,
    Phone,
    CheckCircle2,
    Edit3,
    Save,
    Wallet,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import apiClient from '../../api/apiClient';
import { FaSpinner } from 'react-icons/fa6'
import { useToast } from '../../context/ToastContext';

const validationSchema = Yup.object({
    bankName: Yup.string().required('Bank name is required'),
    accountName: Yup.string().required('Account name is required'),
    accountNumber: Yup.string()
        .length(10, 'Account number must be 10 digits')
        .required('Account number is required'),
});

const Payouts = () => {
    const { isDark } = useTheme();
    const { showToast } = useToast();

    const [savedDetails, setSavedDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(true);
    const [loading, setLoading] = useState(false);

    const initialValues = {
        storeName: '',
        bankName: '',
        accountName: '',
        accountNumber: '',
        phoneNo: ''
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await apiClient.get('/vendor/profile/me', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = res.data?.data || {};

            const prefill = {
                storeName: data.store?.storeName || '',
                bankName: data.payout?.bankName || '',
                accountName: data.payout?.accountName || '',
                accountNumber: data.payout?.accountNumber || '',
                phoneNo: data.contact?.phoneNo || '',
            };

            setSavedDetails(prefill);

        } catch (err) {
            showToast('Failed to load profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = (error, touched) => `
    w-full px-4 py-3 pl-11 rounded-xl border-2 transition-all duration-200 outline-none
    ${isDark
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'
        }
    ${error && touched
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
        }
                      focus:outline-none
                      `;

    const bg = isDark ? 'bg-gray-900' : 'bg-gray-50';
    const textSecondary = isDark ? 'text-white' : 'text-black';
    const labelClasses = `${textSecondary} block text-sm font-semibold text-gray-700 mb-2`;
    const errorClasses = "flex items-center gap-1 text-xs text-red-500 mt-2 font-medium";
    const iconClasses = "absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none";

    return (
        <div className={`min-h-screen ${bg} py-10 px-4`}>
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className={`text-3xl ${textSecondary} font-bold mb-2`}>
                        Vendor Payment Setup
                    </h1>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Configure your payout preferences to receive payments directly to your bank account
                    </p>
                </div>

                {/* Main Content Container */}
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100`}>
                    {/* Status Bar */}
                    <div className={`${isDark ? 'bg-gradient-to-r from-green-600 via-green-500 to-yellow-500' : 'bg-gradient-to-r from-green-600 via-green-500 to-yellow-500'} px-8 py-4`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${savedDetails ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
                                <span className="text-white font-medium">
                                    {savedDetails ? 'Payment Details Configured' : 'Setup Required'}
                                </span>
                            </div>
                            {savedDetails && (
                                <div className="flex items-center gap-2 text-white/90 text-sm">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Verified</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form and Review Container - Side by Side */}
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Side - Form */}
                        <div className="flex-1 p-8 lg:border-r border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                                    <Edit3 className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold text-gray-900 ${textSecondary}`}>
                                        {isEditing ? 'Edit Payment Details' : 'Payment Details'}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {isEditing ? 'Update your banking information' : 'Your saved payment information'}
                                    </p>
                                </div>
                            </div>

                            <Formik
                                initialValues={savedDetails || initialValues}
                                enableReinitialize
                                validationSchema={validationSchema}
                                onSubmit={async (values, { resetForm }) => {
                                    try {
                                        setLoading(true);

                                        const res = await apiClient.post('/vendor/payout', values, {
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        });

                                        setSavedDetails(values);
                                        setIsEditing(false);

                                        toast.success('Payment details saved');

                                        resetForm();

                                    } catch (error) {
                                        console.log(error.response?.data || error);
                                        toast.error(error.response?.data?.message || 'Failed to save payout details');
                                    } finally {
                                        setLoading(false);
                                    }


                                }}
                            >
                                {({ errors, touched }) => (
                                    <Form className="space-y-5">
                                        {/* Store Name */}
                                        <div>
                                            <label className={labelClasses}>Store Name</label>
                                            <div className="relative">
                                                <Building2 className={iconClasses} />
                                                <Field
                                                    name="storeName"
                                                    disabled
                                                    placeholder="Enter your Store name"
                                                    className={inputClasses()}
                                                />
                                            </div>
                                        </div>

                                        {/* Bank Name */}
                                        <div>
                                            <label className={labelClasses}>Bank Name</label>
                                            <div className="relative">
                                                <Landmark className={iconClasses} />
                                                <Field
                                                    name="bankName"
                                                    disabled={!isEditing}
                                                    placeholder="Select your bank"
                                                    className={inputClasses(errors.bankName, touched.bankName)}
                                                />
                                            </div>
                                            {touched.bankName && errors.bankName && (
                                                <p className={errorClasses}>
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.bankName}
                                                </p>
                                            )}
                                        </div>

                                        {/* Account Name */}
                                        <div>
                                            <label className={labelClasses}>Account Name</label>
                                            <div className="relative">
                                                <User className={iconClasses} />
                                                <Field
                                                    name="accountName"
                                                    disabled={!isEditing}
                                                    placeholder="Enter account holder name"
                                                    className={inputClasses(errors.accountName, touched.accountName)}
                                                />
                                            </div>
                                            {touched.accountName && errors.accountName && (
                                                <p className={errorClasses}>
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.accountName}
                                                </p>
                                            )}
                                        </div>

                                        {/* Account Number */}
                                        <div>
                                            <label className={labelClasses}>Account Number</label>
                                            <div className="relative">
                                                <CreditCard className={iconClasses} />
                                                <Field
                                                    name="accountNumber"
                                                    disabled={!isEditing}
                                                    placeholder="Enter 10-digit account number"
                                                    maxLength={10}
                                                    className={inputClasses(errors.accountNumber, touched.accountNumber)}
                                                />
                                            </div>
                                            {touched.accountNumber && errors.accountNumber && (
                                                <p className={errorClasses}>
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errors.accountNumber}
                                                </p>
                                            )}
                                        </div>

                                        {/* WhatsApp Number */}
                                        <div>
                                            <label className={labelClasses}>Phone Number</label>
                                            <div className="relative">
                                                <Phone className={iconClasses} />
                                                <Field
                                                    name="phoneNo"
                                                    disabled
                                                    placeholder="Enter phone number"
                                                    className={inputClasses()}
                                                />
                                            </div>
                                        </div>

                                        {/* Save Button */}
                                        {isEditing && (
                                            <button
                                                type="submit"
                                                className={`
                                                    w-full flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white
                                                    transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                                                    ${loading
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-500/25'
                                                    }
                                                `}
                                            >
                                                {/* <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                Save Payment Details */}
                                                {loading ? (
                                                    <>
                                                        <FaSpinner className="w-5 h-5 animate-spin" />
                                                        Saving Payment Details...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                        Save Payment Details
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </Form>
                                )}
                            </Formik>
                        </div>

                        {/* Right Side - Review & Saved Details */}
                        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} flex-1 p-8`}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold text-gray-900 ${textSecondary}`}>
                                        Review Payment Details
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Preview your saved information
                                    </p>
                                </div>
                            </div>

                            {!savedDetails ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                        <Wallet className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className={`text-lg font-semibold text-gray-700 mb-2 ${textSecondary}`}>
                                        No Payment Details Saved
                                    </h3>
                                    <p className="text-gray-500 text-sm max-w-xs">
                                        Fill in the form on the left and save your payment details to see them here
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Saved Details Card */}
                                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <span className="text-sm font-medium text-green-600 uppercase tracking-wide">
                                                Active Payment Method
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                                    <Building2 className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Business Name</p>
                                                    <p className="text-gray-900 font-semibold">{savedDetails.storeName}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                                                    <Landmark className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Bank</p>
                                                    <p className="text-gray-900 font-semibold">{savedDetails.bankName}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                    <User className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Account Name</p>
                                                    <p className="text-gray-900 font-semibold">{savedDetails.accountName}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                                    <CreditCard className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Account Number</p>
                                                    <p className="text-gray-900 font-semibold font-mono">{savedDetails.accountNumber}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                                                    <Phone className="w-5 h-5 text-pink-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Phone Number</p>
                                                    <p className="text-gray-900 font-semibold">{savedDetails.phoneNo}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Edit Button */}
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full py-3.5 px-6 bg-white border-2 border-indigo-200 hover:border-indigo-300 text-indigo-600 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-indigo-100"
                                        >
                                            <Edit3 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                            Edit Payment Details
                                        </button>
                                    )}

                                    {/* Security Notice */}
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                                        <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-blue-700">
                                            Your payment information is securely encrypted and protected. We never store your full account details on our servers.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400">
                        Need help? Contact our support team for assistance with payment setup
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payouts;
