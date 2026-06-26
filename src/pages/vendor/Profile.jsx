import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes, FaCamera, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaStore, FaLock, FaGlobe, FaBell, FaFacebook, FaInstagram, FaTwitter, FaImage, FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { getList, getMessage, getPayload } from '../../utils/apiResponse';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/layout/Loading';
import { Link } from 'react-router-dom';
import { ArrowLeft, PhoneCall } from 'lucide-react';

// West African countries
const WEST_AFRICAN_COUNTRIES = [
    'Nigeria', 'Ghana', 'Ivory Coast', 'Senegal', 'Togo',
    'Benin', 'Burkina Faso', 'Mali', 'Niger', 'Sierra Leone',
    'Liberia', 'Guinea', 'Guinea-Bissau', 'Gambia', 'Cape Verde'
];

// Nigerian states
const NIGERIAN_STATES = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
    'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
    'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
];

// Language preferences by country
const COUNTRY_LANGUAGES = {
    'Nigeria': ['English'],
    'Ghana': ['English'],
    'Ivory Coast': ['French'],
    'Senegal': ['French'],
    'Togo': ['French'],
    'Benin': ['French'],
    'Burkina Faso': ['French'],
    'Mali': ['French'],
    'Niger': ['French'],
    'Sierra Leone': ['English'],
    'Liberia': ['English'],
    'Guinea': ['French'],
    'Guinea-Bissau': ['Portuguese'],
    'Gambia': ['English'],
    'Cape Verde': ['Portuguese']
};

const Profile = () => {
    const { isDark } = useTheme();
    const { showToast } = useToast();

    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        serialNumber: '',
        username: '',
        fullName: '',
        profilePhoto: '',
        country: '',
        state: '',
        email: '',
        phone: '',
        businessAddress: '',
        customerSupportContact: '',
        storeName: '',
        storeDescription: '',
        bannerImage: '',
        facebook: '',
        instagram: '',
        twitter: '',
        preferredLanguage: '',
        notificationPreference: 'email',
        showPasswordModal: false,
        currentPassword: '',
        newPassword: ''
    });

    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [showStateDropdown, setShowStateDropdown] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await apiClient.get('/vendor/profile/me');

            const data = getPayload(res, {});

            setProfile(data);

            setFormData({
                // identity
                username: data.identity?.username || '',
                fullName: data.identity?.fullName || '',
                profilePhoto: data.identity?.profilePhoto || '',
                serialNumber: data.identity?.serialNumber || '',

                // location
                country: data.location?.country || '',
                state: data.location?.state || '',

                // contact
                email: data.contact?.email || '',
                phone: data.contact?.phoneNo || '',
                businessAddress: data.contact?.businessAddress || '',
                customerSupportContact: data.contact?.supportContact || '',

                // store
                storeName: data.store?.storeName || '',
                storeDescription: data.store?.storeDescription || '',
                bannerImage: data.store?.bannerImage || '',

                // social
                facebook: data.socialLinks?.facebook || '',
                instagram: data.socialLinks?.instagram || '',
                twitter: data.socialLinks?.twitter || '',

                // preferences
                preferredLanguage: data.preferences?.preferredLanguage || '',
                notificationPreference:
                    data.preferences?.notificationPreferences || 'email',

                // security
                showPasswordModal: false,
                currentPassword: '',
                newPassword: ''
            });

        } catch (err) {
            showToast(getMessage(err, 'Failed to load profile'), 'error');
        } finally {
            setLoading(false);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Reset state when country changes
        if (name === 'country') {
            setFormData(prev => ({ ...prev, state: '', preferredLanguage: '' }));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const formDataObj = new FormData();
            formDataObj.append('username', formData.username);
            formDataObj.append('fullName', formData.fullName);
            formDataObj.append('country', formData.country);
            formDataObj.append('state', formData.state);
            formDataObj.append('email', formData.email);
            formDataObj.append('phone', formData.phone);
            formDataObj.append('businessAddress', formData.businessAddress);
            formDataObj.append('customerSupportContact', formData.customerSupportContact);
            formDataObj.append('storeName', formData.storeName);
            formDataObj.append('storeDescription', formData.storeDescription);
            formDataObj.append('preferredLanguage', formData.preferredLanguage);
            formDataObj.append('notificationPreference', formData.notificationPreference);

            // Append images
            if (formData.profilePhotoFile) formDataObj.append('profilePhoto', formData.profilePhotoFile);
            if (formData.bannerImageFile) formDataObj.append('bannerImage', formData.bannerImageFile);

            // Append social media as JSON string
            formDataObj.append('socialMedia', JSON.stringify({
                facebook: formData.facebook,
                instagram: formData.instagram,
                twitter: formData.twitter
            }));

            const res = await apiClient.put('/vendor/profile/me', formDataObj, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setProfile(getPayload(res, {}));
            setEditing(false);
            showToast('Profile updated successfully!', 'success');
        } catch (err) {
            showToast(getMessage(err, 'Update failed. Please try again.'), 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                [field + 'File']: file,
                [field]: URL.createObjectURL(file)
            }));
        }
    };


    const handleClose = () => {
        setEditing(false)
        window.location.href = '/vendor/profile'
    }

    // Theme classes
    const bg = isDark ? 'bg-gray-900' : 'bg-gray-50';
    const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
    const text = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
    const border = isDark ? 'border-gray-700' : 'border-gray-200';
    const inputBg = isDark ? 'bg-gray-700' : 'bg-gray-50';
    const hoverBg = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
    const secondaryText = isDark ? 'text-gray-400' : 'text-gray-500';

    if (loading) {
        return (
            <div className={`min-h-screen ${bg} flex items-center justify-center`}>
                <Loading text='Loading Profile...' />
            </div>
        );
    }
    return (
        <div className={`min-h-screen ${bg} p-4 md:p-8`}>
            <div className="max-w-5xl mx-auto">
                <Link to="/vendor/dashboard" className={`flex items-center gap-2 text-sm mb-4 ${secondaryText} hover:${text}`}>
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                {/* Header */}
                <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8`}>
                    <div>
                        <h1 className={`text-3xl font-bold ${text}`}>Vendor Profile</h1>
                        <p className={`${textSecondary} mt-1`}>Manage your store and account settings</p>
                    </div>
                    <div className="flex gap-3">
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="inline-flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <FaEdit /> Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md disabled:opacity-50"
                                >
                                    {saving ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <FaSave />
                                    )}
                                    Save Changes
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all shadow-md"
                                >
                                    <FaTimes /> Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Photo & Banner Section */}
                <div className="relative mb-8">
                    {/* Banner Image */}
                    <div className={`h-48 rounded-xl overflow-hidden ${cardBg} border ${border} relative`}>
                        {formData.bannerImage ? (
                            <img src={formData.bannerImage} alt="Banner" className="w-full h-full object-cover" />
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-gradient-to-r from-green-600 via-green-500 to-yellow-500' : 'bg-gradient-to-r from-green-600 via-green-500 to-yellow-500'}`}>
                                <FaImage className="text-4xl text-white opacity-50" />
                            </div>
                        )}
                        {editing && (
                            <label className="absolute bottom-4 right-4 cursor-pointer bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
                                <FaCamera /> Change Banner
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'bannerImage')} />
                            </label>
                        )}
                    </div>

                    {/* Profile Photo */}
                    <div className="absolute -bottom-16 left-8">
                        <div className="relative">
                            <div className={`w-32 h-32 rounded-full border-4 ${cardBg} overflow-hidden shadow-lg`}>
                                {formData.profilePhoto ? (
                                    <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}>
                                        <FaUser className={`text-4xl ${textSecondary}`} />
                                    </div>
                                )}
                            </div>
                            {editing && (
                                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-md">
                                    <FaCamera size={14} />
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'profilePhoto')} />
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-20">
                    {/* Left Column - Core Identity & Contact */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Core Identity Section */}
                        <div className={`${cardBg} rounded-xl border ${border} p-6 shadow-sm`}>
                            <h3 className={`text-lg font-semibold ${text} mb-4 flex items-center gap-2`}>
                                <FaUser className="text-blue-500" /> Core Identity
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        className={`w-full px-4 py-3 rounded-lg border ${border} ${inputBg} ${text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:cursor-not-allowed`}
                                        placeholder="Enter username"
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Serial Number</label>
                                    <input
                                        type="text"
                                        name="serialNumber"
                                        value={formData.serialNumber}
                                        disabled={!editing}
                                        className={`w-full px-4 py-3 rounded-lg border ${border} ${inputBg} ${text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-not-allowed`}
                                        placeholder="Serial Number"
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        disabled
                                        className={`w-full px-4 py-3 rounded-lg border ${border} ${inputBg} ${text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:cursor-not-allowed`}
                                        placeholder="Enter full name"
                                    />
                                </div>
                                <div className="relative">
                                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Country</label>
                                    <button
                                        type="button"
                                        onClick={() => editing && setShowCountryDropdown(!showCountryDropdown)}
                                        disabled={!editing}
                                        className={`w-full px-4 py-3 rounded-lg border ${border} ${inputBg} ${text} text-left flex justify-between items-center transition disabled:cursor-not-allowed`}
                                    >
                                        <span>{formData.country || 'Select country'}</span>
                                        <FaChevronDown className={`text-xs ${textSecondary}`} />
                                    </button>
                                    {showCountryDropdown && (
                                        <div className={`absolute z-10 w-full mt-1 ${cardBg} border ${border} rounded-lg shadow-lg max-h-60 overflow-auto`}>
                                            {WEST_AFRICAN_COUNTRIES.map(country => (
                                                <button
                                                    key={country}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, country, state: '', preferredLanguage: COUNTRY_LANGUAGES[country]?.[0] || '' }));
                                                        setShowCountryDropdown(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 ${hoverBg} ${text}`}
                                                >
                                                    {country}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="relative">
                                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>State</label>
                                    {formData.country === 'Nigeria' ? (
                                        <button
                                            type="button"
                                            onClick={() => editing && setShowStateDropdown(!showStateDropdown)}
                                            disabled={!editing}
                                            className={`w-full px-4 py-3 rounded-lg border ${border} ${inputBg} ${text} text-left flex justify-between items-center transition disabled:cursor-not-allowed`}
                                        >
                                            <span>{formData.state || 'Select state'}</span>
                                            <FaChevronDown className={`text-xs ${textSecondary}`} />
                                        </button>
                                    ) : (
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            className={`w-full px-4 py-3 rounded-lg border ${border} ${inputBg} ${text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:cursor-not-allowed`}
                                            placeholder="Enter state"
                                        />
                                    )}
                                    {showStateDropdown && formData.country === 'Nigeria' && (
                                        <div className={`absolute z-10 w-full mt-1 ${cardBg} border ${border} rounded-lg shadow-lg max-h-60 overflow-auto`}>
                                            {NIGERIAN_STATES.map(state => (
                                                <button
                                                    key={state}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({ ...prev, state }));
                                                        setShowStateDropdown(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 ${hoverBg} ${text}`}
                                                >
                                                    {state}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Details Section */}
                        <div className={`${cardBg} rounded-xl border ${border} p-6 shadow-sm`}>
                            <h3 className={`text-lg font-semibold ${text} mb-4 flex items-center gap-2`}>
                                <FaPhone className="text-green-500" /> Contact Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Email Address</label>
                                    <div className="relative">
                                        <FaEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 ${textSecondary}`} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled
                                            className={`w-full pl-12 pr-4 py-3 rounded-lg border ${border} ${inputBg} ${text} cursor-not-allowed`}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Phone Number</label>
                                    <div className="relative">
                                        <FaPhone className={`absolute left-4 top-1/2 -translate-y-1/2 ${textSecondary}`} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            className={`w-full pl-12 pr-4 py-3 rounded-lg border ${border} ${inputBg} ${text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:cursor-not-allowed`}
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Business Address</label>
                                    <div className="relative">
                                        <FaMapMarkerAlt className={`absolute left-4 top-4 ${textSecondary}`} />
                                        <textarea
                                            name="businessAddress"
                                            value={formData.businessAddress}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            rows={3}
                                            className={`w-full pl-12 pr-4 py-3 rounded-lg border ${border} ${inputBg} ${text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:cursor-not-allowed resize-none`}
                                            placeholder="Enter business address"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Customer Support Contact</label>
                                    <div className="relative">
                                        <FaPhone className={`absolute left-4 top-1/2 -translate-y-1/2 ${textSecondary}`} />
                                        <input
                                            type="tel"
                                            name="customerSupportContact"
                                            value={formData.customerSupportContact}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            className={`w-full pl-12 pr-4 py-3 rounded-lg border ${border} ${inputBg} ${text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:cursor-not-allowed`}
                                            placeholder="Enter customer support phone"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Store Profile Section */}
                        <div className={`${cardBg} rounded-xl border ${border} p-6 shadow-sm`}>
                            <h3 className={`text-lg font-semibold ${text} mb-4 flex items-center gap-2`}>
                                <FaStore className="text-purple-500" /> Store Profile
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Store Name</label>
                                    <input
                                        type="text"
                                        name="storeName"
                                        value={formData.storeName}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        className={`w-full px-4 py-3 rounded-lg border ${border} ${inputBg} ${text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:cursor-not-allowed`}
                                        placeholder="Enter store name"
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Store Description</label>
                                    <textarea
                                        name="storeDescription"
                                        value={formData.storeDescription}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        rows={4}
                                        className={`w-full px-4 py-3 rounded-lg border ${border} ${inputBg} ${text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:cursor-not-allowed resize-none`}
                                        placeholder="Describe your store..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Social Media & Preferences Section */}
                        <div className={`${cardBg} rounded-xl border ${border} p-6 shadow-sm`}>
                            <h3 className={`text-lg font-semibold ${text} mb-4 flex items-center gap-2`}>
                                <FaGlobe className="text-indigo-500" /> Social Media & Preferences
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Facebook</label>
                                    <div className="relative">
                                        <FaFacebook className={`absolute left-4 top-1/2 -translate-y-1/2 text-blue-600`} />
                                        <input
                                            type="url"
                                            name="facebook"
                                            value={formData.facebook}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            className={`w-full pl-12 pr-4 py-3 rounded-lg border ${border} ${inputBg} ${text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:cursor-not-allowed`}
                                            placeholder="Facebook URL"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Instagram</label>
                                    <div className="relative">
                                        <FaInstagram className={`absolute left-4 top-1/2 -translate-y-1/2 text-pink-600`} />
                                        <input
                                            type="url"
                                            name="instagram"
                                            value={formData.instagram}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            className={`w-full pl-12 pr-4 py-3 rounded-lg border ${border} ${inputBg} ${text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:cursor-not-allowed`}
                                            placeholder="Instagram URL"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>X (Twitter)</label>
                                    <div className="relative">
                                        <FaTwitter className={`absolute left-4 top-1/2 -translate-y-1/2 text-black dark:text-white`} />
                                        <input
                                            type="url"
                                            name="twitter"
                                            value={formData.twitter}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            className={`w-full pl-12 pr-4 py-3 rounded-lg border ${border} ${inputBg} ${text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:cursor-not-allowed`}
                                            placeholder="X/Twitter URL"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Preferred Language</label>
                                    <select
                                        name="preferredLanguage"
                                        value={formData.preferredLanguage}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        className={`w-full px-4 py-3 rounded-lg border ${border} ${inputBg} ${text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:cursor-not-allowed`}
                                    >
                                        <option value="">Select language</option>
                                        {COUNTRY_LANGUAGES[formData.country]?.map(lang => (
                                            <option key={lang} value={lang}>{lang}</option>
                                        ))}
                                        {formData.country && !COUNTRY_LANGUAGES[formData.country] && (
                                            <option value="English">English</option>
                                        )}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Notification Preferences</label>
                                    <div className="flex flex-wrap gap-3">
                                        {['email', 'whatsapp', 'both'].map(option => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => editing && setFormData(prev => ({ ...prev, notificationPreference: option }))}
                                                disabled={!editing}
                                                className={`px-4 py-2 rounded-lg border ${border} transition ${formData.notificationPreference === option
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : `${cardBg} ${text} ${!editing ? 'cursor-not-allowed' : 'hover:bg-blue-50 dark:hover:bg-gray-700'}`
                                                    }`}
                                            >
                                                {option === 'email' && <FaEnvelope className="inline mr-2" />}
                                                {option === 'whatsapp' && <FaBell className="inline mr-2" />}
                                                {option === 'both' && <FaBell className="inline mr-2" />}
                                                {option.charAt(0).toUpperCase() + option.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Security */}
                    <div className="space-y-6">
                        {/* Help Section */}
                        <div className="bg-gradient-to-br from-green-700 to-green-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold mb-2">Need assistance?</h3>
                                <p className="text-sm text-green-50 mb-6">Our dedicated vendor support team is available 24/7 to help you.</p>
                                <Link to='/contactus' className="flex items-center justify-center gap-2 w-full py-3 bg-white text-green-700 font-bold rounded-xl hover:bg-yellow-400 hover:text-green-900 transition-all">
                                    <PhoneCall className="w-4 h-4" /> Contact Support
                                </Link>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;