import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';

import {
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBell,
  FaImage,
  FaGraduationCap,
  FaChevronDown,
  FaCopy,
  FaCheck,
} from 'react-icons/fa';

import {
  ArrowLeft,
  PhoneCall,
} from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';

import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import apiClient from '../../api/apiClient';
import {
  getMessage,
  getPayload,
} from '../../utils/apiResponse';
import Loading from '../../components/layout/Loding';

import Toggle from '../../components/settings/common/Toggles';


const Profile = () => {
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [schools, setSchools] = useState([]);
  const [states, setStates] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);

  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const [copied, setCopied] = useState(false);

  const pristineDataRef = useRef(null);


  const [formData, setFormData] = useState({
    serialNumber: '',

    fullName: '',
    profilePhoto: '',
    profilePhotoFile: null,

    email: '',
    phoneNo: '',

    institution: '',
    institutionId: '',

    state: '',
    stateId: '',

    gender: '',
    matricNumber: '',
    faculty: '',
    department: '',
    level: '',
    residence: '',
    address: '',

    notificationPreference: '',
    promotionalMessages: false,
  });


  const mapProfileToForm = (data) => ({
    serialNumber:
      data.identity?.serialNumber || '',

    fullName:
      data.identity?.fullName || '',

    profilePhoto:
      data.student?.profilePhoto || '',

    profilePhotoFile: null,

    email:
      data.contact?.email || '',

    phoneNo:
      data.contact?.phoneNo || '',

    institution:
      data.location?.institution?.name || '',

    institutionId:
      data.location?.institution?.id ||
      data.location?.institution?._id ||
      '',

    state:
      data.location?.state?.name || '',

    stateId:
      data.location?.state?.id ||
      data.location?.state?._id ||
      '',

    gender:
      data.student?.gender || '',

    matricNumber:
      data.student?.matricNumber || '',

    faculty:
      data.student?.faculty || '',

    department:
      data.student?.department || '',

    level:
      data.student?.level || '',

    residence:
      data.student?.residence || '',

    address:
      data.student?.address || '',

    notificationPreference:
      data.preferences?.notificationPreference || '',

    promotionalMessages:
      Boolean(
        data.preferences?.promotionalMessages ?? false
      ),
  });


  useEffect(() => {
    fetchProfile();
  }, []);


  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await apiClient.get('/schools/');

        setSchools(
          res.data?.data || []
        );

      } catch (err) {
        showToast(
          err?.response?.data?.message ||
          'Failed to load schools',
          'error'
        );
      }
    };

    fetchSchools();
  }, [showToast]);

  useEffect(() => {
    const fetchStates = async () => {
      if (!formData.institutionId) {
        setStates([]);
        return;
      }

      try {
        setLoadingStates(true);

        const res = await apiClient.get(
          `/schools/${formData.institutionId}/states`
        );

        setStates(
          res.data?.data || []
        );

      } catch (err) {
        showToast(
          err?.response?.data?.message ||
          'Failed to load states',
          'error'
        );
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, [
    formData.institutionId,
    showToast,
  ]);


  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await apiClient.get(
        '/buyer/profile/me'
      );

      const data = getPayload(res, {});

      setProfile(data);

      const mapped =
        mapProfileToForm(data);

      setFormData(mapped);

      pristineDataRef.current = {
        ...mapped,
        profilePhotoFile: null,
      };

    } catch (err) {
      showToast(
        getMessage(
          err,
          'Failed to load profile'
        ),
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleInstitutionChange = (e) => {
    const selectedId =
      e.target.value;

    const selectedSchool =
      schools.find(
        (school) =>
          String(
            school._id || school.id
          ) === String(selectedId)
      );

    setFormData((prev) => ({
      ...prev,

      institutionId:
        selectedId,

      institution:
        selectedSchool?.name || '',

      stateId: '',
      state: '',
    }));

    setStates([]);
    setShowStateDropdown(false);
  };


  const handleStateChange = (e) => {
    const selectedId =
      e.target.value;

    const selectedState =
      states.find(
        (state) =>
          String(
            state._id || state.id
          ) === String(selectedId)
      );

    setFormData((prev) => ({
      ...prev,

      stateId:
        selectedId,

      state:
        selectedState?.name || '',
    }));
  };


  const handleImageUpload = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const preview =
      URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,

      profilePhotoFile: file,
      profilePhoto: preview,
    }));
  };


  const handleRemoveImage = () => {
    if (
      formData.profilePhoto?.startsWith(
        'blob:'
      )
    ) {
      URL.revokeObjectURL(
        formData.profilePhoto
      );
    }

    setFormData((prev) => ({
      ...prev,

      profilePhotoFile: null,

      profilePhoto:
        pristineDataRef.current
          ?.profilePhoto || '',
    }));
  };


  const copyToClipboard = async (value) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(
        value
      );

      setCopied(true);

      showToast(
        'Serial copied to clipboard',
        'success'
      );

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch {
      showToast(
        'Failed to copy serial',
        'error'
      );
    }
  };

  const handleSave = async () => {
    if (!formData.fullName.trim()) {
      showToast(
        'Full name is required',
        'error'
      );

      return;
    }

    if (!formData.institutionId) {
      showToast(
        'Please select your institution',
        'error'
      );
      return;
    }

    if (!formData.stateId) {
      showToast(
        'Please select your state or campus',
        'error'
      );

      return;
    }

    setSaving(true);

    try {
      const data =
        new FormData();

      data.append(
        'fullName',
        formData.fullName
      );

      data.append(
        'institution',
        formData.institutionId
      );

      data.append(
        'state',
        formData.stateId
      );

      data.append(
        'gender',
        formData.gender
      );

      data.append(
        'matricNumber',
        formData.matricNumber
      );

      data.append(
        'faculty',
        formData.faculty
      );

      data.append(
        'department',
        formData.department
      );

      data.append(
        'level',
        formData.level
      );

      data.append(
        'residence',
        formData.residence
      );

      data.append(
        'address',
        formData.address
      );

      if (formData.profilePhotoFile) {
        data.append(
          'profilePhoto',
          formData.profilePhotoFile
        );
      }

      const res =
        await apiClient.put(
          '/buyer/profile/me',
          data,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        );

      const updatedProfile =
        getPayload(res, {});

      setProfile(
        updatedProfile
      );

      const updatedForm =
        mapProfileToForm(
          updatedProfile
        );

      setFormData(
        updatedForm
      );

      pristineDataRef.current = {
        ...updatedForm,
        profilePhotoFile: null,
      };

      setEditing(false);

      showToast(
        'Profile updated successfully!',
        'success'
      );

    } catch (err) {
      showToast(
        getMessage(
          err,
          'Update failed. Please try again.'
        ),
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (
      formData.profilePhoto?.startsWith(
        'blob:'
      )
    ) {
      URL.revokeObjectURL(
        formData.profilePhoto
      );
    }

    if (pristineDataRef.current) {
      setFormData({
        ...pristineDataRef.current,
        profilePhotoFile: null,
      });
    }

    setShowSchoolDropdown(false);
    setShowStateDropdown(false);

    setEditing(false);
  };

  const isFormPristine = useMemo(() => {
    if (!pristineDataRef.current) {
      return true;
    }

    const {
      profilePhotoFile,
      notificationPreference,
      promotionalMessages,
      ...current
    } = formData;

    const {
      profilePhotoFile: _originalFile,
      notificationPreference:
      _originalNotification,
      promotionalMessages:
      _originalPromotional,
      ...original
    } = pristineDataRef.current;

    return (
      JSON.stringify(current) ===
      JSON.stringify(original)
    );

  }, [formData]);


  const bg =
    isDark
      ? 'bg-gray-900'
      : 'bg-gray-50';

  const cardBg =
    isDark
      ? 'bg-gray-800'
      : 'bg-white';

  const text =
    isDark
      ? 'text-white'
      : 'text-gray-900';

  const textSecondary =
    isDark
      ? 'text-gray-400'
      : 'text-gray-500';

  const border =
    isDark
      ? 'border-gray-700'
      : 'border-gray-200';

  const inputBg =
    isDark
      ? 'bg-gray-700'
      : 'bg-gray-50';


  const getStatusBadge = (status) => {
    const style =
      'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ';

    switch (
    status?.toLowerCase()
    ) {
      case 'active':
        return (
          style +
          'bg-green-500/10 text-green-500 border-green-500/20 animate-pulse'
        );

      case 'pending':
        return (
          style +
          'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
        );

      case 'suspended':
        return (
          style +
          'bg-orange-500/10 text-orange-500 border-orange-500/20'
        );

      case 'banned':
        return (
          style +
          'bg-red-500/10 text-red-500 border-red-500/20'
        );

      case 'deleted':
        return (
          style +
          'bg-gray-500/10 text-gray-500 border-gray-500/20'
        );

      default:
        return (
          style +
          'bg-gray-500/10 text-gray-500 border-gray-500/20'
        );
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen ${bg} flex items-center justify-center`}
      >
        <Loading text="Loading Profile Panel..." />
      </div>
    );
  }


  return (
    <div
      className={`min-h-screen ${bg} p-4 sm:p-6 lg:p-8 transition-all duration-300 antialiased font-sans selection:bg-green-500 selection:text-white`}
    >

      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">


        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-700/30">

          <div>

            <button
              onClick={() =>
                navigate(-1)
              }
              className={`group inline-flex items-center gap-2 text-sm transition-colors mb-2 rounded-full px-3 py-1.5 ${isDark
                  ? 'bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 ring-1 ring-white/10'
                  : 'bg-white/70 hover:bg-white text-zinc-600 ring-1 ring-zinc-900/5'
                }`}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>

            <h1
              className={`text-3xl font-extrabold tracking-tight ${text} flex items-center gap-2`}
            >
              Buyer Showcase
              <span className="font-light text-green-500">
                Profile
              </span>
            </h1>
          </div>


          {!editing ? (
            <button
              onClick={() =>
                setEditing(true)
              }
              className="inline-flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <FaEdit />
              Edit Profile
            </button>

          ) : (
            <div className="flex gap-3 animate-fade-in">
              <button
                onClick={handleSave}
                disabled={
                  isFormPristine ||
                  saving
                }
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md disabled:opacity-40 disabled:scale-100 transform hover:-translate-y-0.5"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaSave />
                )}
                Save Changes
              </button>

              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all shadow-md transform hover:-translate-y-0.5"
              >
                <FaTimes />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* SYSTEM SECURITY LEDGER */}
        <div className="relative group overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-transparent to-yellow-500/10 opacity-60 pointer-events-none" />
          <div
            className={`${cardBg} border ${border} p-6 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}
          >
            <div className="space-y-1">
              <h2
                className={`text-lg font-black tracking-tight ${text}`}
              >System Security Ledger</h2>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Account Standing
                </span>
                <div
                  className={getStatusBadge(
                    profile?.verification?.accountStatus ||
                    profile?.accountStatus ||
                    'active'
                  )}
                >
                  {profile?.verification?.accountStatus ||
                    profile?.accountStatus ||
                    'Active'}
                </div>
              </div>

              <div className="h-10 w-px bg-gray-700/40 hidden sm:block" />
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Buyer Serial Code
                </span>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl ${inputBg} border ${border}`}
                >
                  <code
                    className={`text-xs font-mono font-bold tracking-widest ${text}`}
                  >{formData.serialNumber || 'BUY-EMPTY'}</code>

                  <button
                    onClick={() =>
                      copyToClipboard(
                        formData.serialNumber
                      )
                    }
                    className="text-gray-400 hover:text-green-500 transition-colors p-0.5"
                    title="Copy to Clipboard"
                  >
                    {copied ? (
                      <FaCheck
                        size={12}
                        className="text-green-500"
                      />
                    ) : (
                      <FaCopy
                        size={12}
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* PROFILE BANNER */}

        <div className="relative">

          <div
            className={`h-40 rounded-2xl overflow-hidden ${cardBg} border ${border} shadow-inner relative group`}
          >

            <div className="w-full h-full bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 transform group-hover:scale-[1.01] transition-transform duration-700 relative overflow-hidden">

              <div className="absolute inset-0 opacity-10">

                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >

                  <path
                    d="M0 100 C 20 0 50 0 100 100 Z"
                    fill="white"
                  />

                </svg>

              </div>


              <div className="w-full h-full flex items-center justify-center">

                <FaImage className="text-5xl text-white opacity-25 animate-pulse" />

              </div>

            </div>

          </div>


          {/* PROFILE IDENTITY */}

          <div className="absolute -bottom-16 left-6 right-6 md:left-10 md:right-10 flex flex-col sm:flex-row items-center sm:items-end gap-4 z-20">

            <div className="relative group">

              <div
                className={`w-28 h-28 rounded-2xl border-4 ${cardBg} overflow-hidden shadow-2xl transition-all duration-300 group-hover:scale-105 ${border}`}
              >

                {formData.profilePhoto ? (

                  <img
                    src={
                      formData.profilePhoto
                    }
                    alt="Buyer profile"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-400">

                    <FaUser className="text-3xl" />

                  </div>

                )}

              </div>


              {editing && (

                <label className="absolute bottom-1 right-1 bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl cursor-pointer shadow-xl transition-all transform hover:scale-110">

                  <FaCamera size={13} />

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={
                      handleImageUpload
                    }
                  />

                </label>

              )}

            </div>


            <div className="text-center sm:text-left sm:pb-2 flex-1 w-full">

              <h3
                className={`text-xl font-black ${text} drop-shadow-sm truncate`}
              >
                {formData.fullName ||
                  'Unassigned Record'}
              </h3>

              <p className="text-sm text-green-500 font-semibold mt-1">
                Buyer Account
              </p>


              {editing &&
                formData.profilePhoto && (

                  <button
                    onClick={
                      handleRemoveImage
                    }
                    className="text-xs text-red-500 hover:underline font-bold mt-1 block"
                  >
                    [ Remove Photo ]
                  </button>

                )}

            </div>

          </div>

        </div>


        {/* MAIN GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-12">

          <div className="lg:col-span-2 space-y-6">


            {/* IDENTITY MATRIX */}

            <div
              className={`${cardBg} rounded-2xl border ${border} p-6 shadow-md space-y-4`}
            >

              <h4
                className={`text-sm font-bold uppercase tracking-wider ${text} flex items-center gap-2`}
              >

                <FaUser className="text-green-500" />

                Identity Matrix Parameters

              </h4>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="space-y-1.5">

                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Full Identity Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={
                      formData.fullName
                    }
                    onChange={
                      handleChange
                    }
                    disabled
                    className={`w-full px-4 py-3 rounded-xl border ${border} ${inputBg} ${text} opacity-60 cursor-not-allowed`}
                  />

                </div>


                <div className="space-y-1.5">

                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Buyer Serial Code
                  </label>

                  <input
                    type="text"
                    value={
                      formData.serialNumber
                    }
                    disabled
                    className={`w-full px-4 py-3 rounded-xl border ${border} ${inputBg} ${text} opacity-60 cursor-not-allowed`}
                  />

                </div>

              </div>

            </div>


            {/* CONTACT INFORMATION */}

            <div
              className={`${cardBg} rounded-2xl border ${border} p-6 shadow-md space-y-6`}
            >

              <div className="border-b border-gray-700/20 pb-3">

                <h3
                  className={`text-base font-black tracking-tight ${text} flex items-center gap-2`}
                >

                  <FaPhone className="text-green-500" />

                  Contact Information

                </h3>

              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="space-y-1.5">

                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Email Address
                  </label>

                  <div className="relative">

                    <FaEnvelope
                      className={`absolute left-4 top-1/2 -translate-y-1/2 ${textSecondary}`}
                    />

                    <input
                      type="email"
                      value={
                        formData.email
                      }
                      disabled
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border ${border} ${inputBg} ${text} opacity-60 cursor-not-allowed`}
                    />

                  </div>

                </div>


                <div className="space-y-1.5">

                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Phone Number
                  </label>

                  <div className="relative">

                    <FaPhone
                      className={`absolute left-4 top-1/2 -translate-y-1/2 ${textSecondary}`}
                    />

                    <input
                      type="tel"
                      value={
                        formData.phoneNo
                      }
                      disabled
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border ${border} ${inputBg} ${text} opacity-60 cursor-not-allowed`}
                    />

                  </div>

                </div>

              </div>

            </div>


            {/* ACADEMIC INFORMATION */}

            <div
              className={`${cardBg} rounded-2xl border ${border} p-6 shadow-md space-y-6`}
            >

              <div className="flex justify-between items-center border-b border-gray-700/20 pb-3">

                <div>

                  <h3
                    className={`text-base font-black tracking-tight ${text} flex items-center gap-2`}
                  >

                    <FaGraduationCap className="text-green-500" />

                    Academic Information

                  </h3>

                  <p className="text-[10px] text-yellow-500 font-medium mt-1">
                    Update your student information.
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


                {/* INSTITUTION */}

                <div className="space-y-1.5">

                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Institution
                  </label>

                  <div className="relative">

                    <select
                      name="institutionId"
                      value={
                        formData.institutionId
                      }
                      onChange={
                        handleInstitutionChange
                      }
                      disabled={!editing}
                      className={`w-full appearance-none px-4 py-3 pr-10 rounded-xl border ${border} ${inputBg} ${text} transition-all outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-60 disabled:cursor-not-allowed`}
                    >

                      <option value="">
                        Select Institution
                      </option>

                      {schools.map(
                        (school) => (

                          <option
                            key={
                              school._id ||
                              school.id
                            }
                            value={
                              school._id ||
                              school.id
                            }
                          >
                            {
                              school.name
                            }
                          </option>

                        )
                      )}

                    </select>


                    <FaChevronDown
                      className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs ${textSecondary}`}
                    />

                  </div>

                </div>


                {/* STATE */}

                <div className="space-y-1.5">

                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    State / Campus
                  </label>

                  <div className="relative">

                    <select
                      name="stateId"
                      value={
                        formData.stateId
                      }
                      onChange={
                        handleStateChange
                      }
                      disabled={
                        !editing ||
                        !formData.institutionId ||
                        loadingStates
                      }
                      className={`w-full appearance-none px-4 py-3 pr-10 rounded-xl border ${border} ${inputBg} ${text} transition-all outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-60 disabled:cursor-not-allowed`}
                    >

                      <option value="">
                        {loadingStates
                          ? 'Loading states...'
                          : !formData.institutionId
                            ? 'Select institution first'
                            : 'Select State / Campus'}
                      </option>

                      {states.map(
                        (state) => (

                          <option
                            key={
                              state._id ||
                              state.id
                            }
                            value={
                              state._id ||
                              state.id
                            }
                          >
                            {
                              state.name
                            }
                          </option>

                        )
                      )}

                    </select>


                    <FaChevronDown
                      className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs ${textSecondary}`}
                    />

                  </div>

                </div>


                {/* FACULTY */}

                <div className="space-y-1.5">

                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Faculty Directorate
                  </label>

                  <input
                    type="text"
                    name="faculty"
                    value={
                      formData.faculty
                    }
                    onChange={
                      handleChange
                    }
                    disabled={!editing}
                    placeholder="Enter faculty"
                    className={`w-full px-4 py-3 rounded-xl border ${border} ${inputBg} ${text} transition-all outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-60 disabled:cursor-not-allowed`}
                  />

                </div>


                {/* DEPARTMENT */}

                <div className="space-y-1.5">

                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Department Division
                  </label>

                  <input
                    type="text"
                    name="department"
                    value={
                      formData.department
                    }
                    onChange={
                      handleChange
                    }
                    disabled={!editing}
                    placeholder="Enter department"
                    className={`w-full px-4 py-3 rounded-xl border ${border} ${inputBg} ${text} transition-all outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-60 disabled:cursor-not-allowed`}
                  />

                </div>


                {/* LEVEL */}

                <div className="space-y-1.5">

                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Level Standing
                  </label>

                  <input
                    type="text"
                    name="level"
                    value={
                      formData.level
                    }
                    onChange={
                      handleChange
                    }
                    disabled={!editing}
                    placeholder="Enter level"
                    className={`w-full px-4 py-3 rounded-xl border ${border} ${inputBg} ${text} transition-all outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-60 disabled:cursor-not-allowed`}
                  />

                </div>


                {/* MATRIC NUMBER */}

                <div className="space-y-1.5">

                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Matriculation Number
                  </label>

                  <input
                    type="text"
                    name="matricNumber"
                    value={
                      formData.matricNumber
                    }
                    onChange={
                      handleChange
                    }
                    disabled={!editing}
                    placeholder="Enter matriculation number"
                    className={`w-full px-4 py-3 rounded-xl border ${border} ${inputBg} ${text} transition-all outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-60 disabled:cursor-not-allowed`}
                  />

                </div>


                {/* GENDER */}

                <div className="space-y-1.5">

                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={
                      formData.gender
                    }
                    onChange={
                      handleChange
                    }
                    disabled={!editing}
                    className={`w-full px-4 py-3 rounded-xl border ${border} ${inputBg} ${text} transition-all outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-60 disabled:cursor-not-allowed`}
                  >

                    <option value="">
                      Select Gender
                    </option>

                    <option value="male">
                      Male
                    </option>

                    <option value="female">
                      Female
                    </option>

                    <option value="other">
                      Other
                    </option>

                    <option value="prefer-not-to-say">
                      Prefer not to say
                    </option>

                  </select>

                </div>


                {/* RESIDENCE */}

                <div className="space-y-1.5">

                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Residential Status
                  </label>

                  <select
                    name="residence"
                    value={
                      formData.residence || ''
                    }
                    onChange={
                      handleChange
                    }
                    disabled={!editing}
                    className={`w-full px-4 py-3 rounded-xl border ${border} ${inputBg} ${text} transition-all outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-60 disabled:cursor-not-allowed`}
                  >

                    <option value="">
                      Select Residence
                    </option>

                    <option value="hostel">
                      Hostel
                    </option>

                    <option value="off-campus">
                      Off Campus
                    </option>

                  </select>

                </div>


                {/* ADDRESS */}

                <div className="space-y-1.5 sm:col-span-2">

                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Registered Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={
                      formData.address
                    }
                    onChange={
                      handleChange
                    }
                    disabled={!editing}
                    placeholder="Enter registered address"
                    className={`w-full px-4 py-3 rounded-xl border ${border} ${inputBg} ${text} transition-all outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-60 disabled:cursor-not-allowed`}
                  />

                </div>

              </div>

            </div>


            {/* BUYER PREFERENCES */}

            <div
              className={`${cardBg} rounded-2xl border ${border} p-6 shadow-md space-y-6`}
            >

              <div className="border-b border-gray-700/20 pb-3">

                <h3
                  className={`text-base font-black tracking-tight ${text} flex items-center gap-2`}
                >

                  <FaBell className="text-green-500" />

                  Buyer Preferences

                </h3>

                <p className="text-[10px] text-yellow-500 font-medium mt-1">
                  Your saved preferences are displayed below.
                </p>
              </div>


              {/* NOTIFICATION PREFERENCE */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Notification Preference
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      value: 'email',
                      label: 'Email',
                      icon: FaEnvelope,
                    },
                    {
                      value: 'whatsapp',
                      label: 'WhatsApp',
                      icon: FaBell,
                    },
                    {
                      value: 'both',
                      label: 'Email & WhatsApp',
                      icon: FaBell,
                    },
                  ].map((option) => {

                    const Icon =
                      option.icon;

                    const selected =
                      formData.notificationPreference?.toLowerCase() ===
                      option.value;

                    return (
                      <div
                        key={
                          option.value
                        }
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${selected
                            ? 'border-green-500 bg-green-500/10 text-green-500'
                            : `${border} ${inputBg} ${text} opacity-60`
                          }`}
                      >
                        <Icon className="shrink-0" />
                        <span className="text-sm font-semibold">
                          {
                            option.label
                          }
                        </span>
                        {selected && (
                          <FaCheck className="ml-auto text-green-500" />
                        )}
                      </div>

                    );
                  })}

                </div>

                <p className="text-[11px] text-gray-400">
                  Notification preferences are managed from Settings.
                </p>

              </div>


              {/* PROMOTIONAL MESSAGES */}

              <div
                className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${border} ${inputBg}/40`}
              >

                <div>

                  <h4
                    className={`text-sm font-bold ${text}`}
                  >
                    Promotional Messages
                  </h4>

                  <p className="text-xs text-gray-400 mt-1">
                    Receive promotional updates,
                    offers and marketplace
                    announcements.
                  </p>

                  <p className="text-[10px] text-gray-500 mt-2">
                    This preference is managed from Settings.
                  </p>

                </div>


                <div className="flex items-center gap-3">

                  <span
                    className={`text-xs font-bold ${formData.promotionalMessages
                        ? 'text-green-500'
                        : 'text-gray-500'
                      }`}
                  >
                    {formData.promotionalMessages
                      ? 'Enabled'
                      : 'Disabled'}
                  </span>


                  <Toggle
                    checked={
                      Boolean(
                        formData.promotionalMessages
                      )
                    }
                    disabled={true}
                    onChange={() => { }}
                  />

                </div>

              </div>

            </div>

          </div>


          {/* RIGHT COLUMN */}

          <div className="space-y-6">


            {/* ACADEMIC DOSSIER */}

            <div
              className={`${cardBg} rounded-2xl border ${border} p-6 shadow-lg relative overflow-hidden group`}
            >

              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-500/10 to-transparent rounded-bl-full opacity-60 pointer-events-none" />


              <div className="border-b border-gray-700/20 pb-3 mb-4">

                <h3
                  className={`text-base font-black tracking-tight ${text} flex items-center gap-2`}
                >

                  <FaGraduationCap className="text-green-500" />

                  Academic Dossier

                </h3>

                <p className="text-[10px] text-yellow-500 font-medium mt-0.5">
                  Student profile information
                </p>

              </div>


              <div className="space-y-3">

                {[
                  {
                    label: 'Institution',
                    val: formData.institution,
                  },
                  {
                    label: 'State / Campus',
                    val: formData.state,
                  },
                  {
                    label: 'Faculty Directorate',
                    val: formData.faculty,
                  },
                  {
                    label: 'Department Division',
                    val: formData.department,
                  },
                  {
                    label: 'Level Standing',
                    val: formData.level,
                  },
                  {
                    label: 'Matriculation Number',
                    val: formData.matricNumber,
                  },
                  {
                    label: 'Gender',
                    val: formData.gender,
                  },
                  {
                    label: 'Residential Status',
                    val: formData.residence,
                  },
                  {
                    label: 'Registered Address',
                    val: formData.address,
                  },
                ].map(
                  (
                    fieldObj,
                    index
                  ) => (

                    <div
                      key={index}
                      className={`p-2.5 rounded-xl border ${border} ${isDark
                          ? 'bg-gray-900/50'
                          : 'bg-gray-50'
                        } transition-all hover:bg-green-500/5`}
                    >

                      <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">

                        {
                          fieldObj.label
                        }

                      </span>

                      <span
                        className={`text-xs font-semibold ${text} block truncate`}
                      >

                        {
                          fieldObj.val ||
                          'Not provided'
                        }

                      </span>

                    </div>

                  )
                )}

              </div>

            </div>


            {/* SUPPORT */}

            <div className="bg-gradient-to-br from-green-700 to-green-500 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">

              <div className="relative z-10 space-y-4">

                <div className="space-y-1">

                  <h3 className="text-lg font-black tracking-tight">
                    Need assistance?
                  </h3>

                  <p className="text-xs text-green-100 opacity-90 leading-relaxed">
                    Our dedicated buyer support team is available to help you.
                  </p>

                </div>


                <Link
                  to="/contactus"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white text-green-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-yellow-400 hover:text-green-950 transition-all shadow-md"
                >

                  <PhoneCall className="w-3.5 h-3.5" />

                  Contact Support

                </Link>

              </div>


              <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-2xl" />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


export default Profile;
