import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes, FaCamera, FaUser, FaEnvelope, FaPhone, FaGlobe, FaBell, FaImage, FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { useTheme } from '../../context/ThemeContext';
import { PhoneCall, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Loading from '../../components/layout/Loding';

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
    address: '',
    email: '',
    phone: '',
    preferredLanguage: '',
    notificationPreferences: 'email',
  });

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get('/buyer/profile/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = res.data?.data || {};

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
        address: data.location?.address || '',

        // contact
        email: data.contact?.email || '',
        phone: data.contact?.phoneNo || '',

        // preferences
        preferredLanguage: data.preferences?.preferredLanguage || '',
        notificationPreference:
          data.preferences?.notificationPreferences || 'email',
      });

    } catch (err) {
      console.log(err);
      toast.error('Failed to load profile');
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

    if (name === 'country') {
      setFormData(prev => ({ ...prev, state: '', preferredLanguage: COUNTRY_LANGUAGES[value]?.[0] || '' }));
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
      formDataObj.append('address', formData.address);
      formDataObj.append('email', formData.email);
      formDataObj.append('phoneNo', formData.phone);
      formDataObj.append('preferredLanguage', formData.preferredLanguage);
      formDataObj.append('notificationPreferences', formData.notificationPreferences);

      // Append images
      if (formData.profilePhotoFile) formDataObj.append('profilePhoto', formData.profilePhotoFile);
      // if (formData.bannerImageFile) formDataObj.append('bannerImage', formData.bannerImageFile);

      const res = await apiClient.put('/buyer/profile/me', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfile(res.data?.data);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.log(err);
      toast.error('Update failed. Please try again.');
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
    setEditing(false);
    window.location.href = '/buyer/profile';
  };

  // Theme classes
  const bg = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const text = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const border = isDark ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDark ? 'bg-gray-700' : 'bg-gray-50';
  const hoverBg = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  if (loading) {
    return (
      <div className={`min-h-screen ${bg} flex items-center justify-center`}>
        <Loading text='Loading dashboard...' />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg} p-4 md:p-8`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8`}>
          <div>
            <h1 className={`text-3xl font-bold ${text}`}>Buyer Profile</h1>
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

            <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-gradient-to-r from-green-600 via-green-500 to-yellow-500' : 'bg-gradient-to-r from-green-600 via-green-500 to-yellow-500'}`}>
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
              </div>
              <FaImage className="text-4xl text-white opacity-50" />
            </div>
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
                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!editing}
                    className={`w-full px-4 py-3 rounded-lg border ${border} ${inputBg} ${text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:cursor-not-allowed`}
                    placeholder="Enter address"
                  />
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
              </div>
            </div>

            {/* Social Media & Preferences Section */}
            <div className={`${cardBg} rounded-xl border ${border} p-6 shadow-sm`}>
              <h3 className={`text-lg font-semibold ${text} mb-4 flex items-center gap-2`}>
                <FaGlobe className="text-indigo-500" /> Social Media & Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        onClick={() => editing && setFormData(prev => ({ ...prev, notificationPreferences: option }))}
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
            {/* Need Help */}
            <div className="bg-gradient-to-br from-green-600 to-yellow-500 rounded-2xl p-6 text-white">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Need Help?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Our customer support team is ready to assist you 24/7.
              </p>
              <Link to={'/contactus'} className="flex-1 group/btn inline-flex items-center justify-center gap-3 w-full py-2.5 bg-white text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors">
                <PhoneCall className="text-sm group-hover/btn:scale-110 transition-transform" /> Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;