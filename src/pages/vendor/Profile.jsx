import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    FaEdit, FaSave, FaTimes, FaCamera, FaUser, FaStore,
    FaFacebook, FaInstagram, FaWhatsapp, FaTiktok, FaCopy, FaCheck, FaImage, FaGraduationCap
} from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/layout/Loding';
import { Link } from 'react-router-dom';
import { ArrowLeft, PhoneCall, Sparkles, CheckCircle, ShieldAlert } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { getMessage } from '../../utils/apiResponse';

const Profile = () => {
    const { isDark } = useTheme();
    const { showToast } = useToast();

    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Dynamic Form Data matching requirements
    const [formData, setFormData] = useState({
        accountStatus: 'Active',
        serialNumber: '',
        profilePhoto: '',
        profilePhotoFile: null,
        fullName: '',
        gender: 'Not Specified',
        institution: '',
        stateCampus: '',
        faculty: '',
        department: '',
        level: '',
        matricNumber: '',
        residence: '',
        address: '',
        storeLogo: '',
        storeBanner: '',
        storeLogoFile: null,
        storeName: '',
        businessType: '',
        businessDescription: '',
        facebook: '',
        instagram: '',
        whatsapp: '',
        tiktok: ''
    });

    const mapVendorToForm = (data) => ({
        accountStatus: data.verification?.accountStatus || "pending",
        verificationStatus: data.verification?.verificationStatus || "",
        isVerified: data.verification?.isVerified || false,

        serialNumber: data.identity?.serialNumber || "",

        profilePhoto: data.student?.profilePhoto || "",
        profilePhotoFile: null,

        fullName: data.identity?.fullName || "",
        gender: data.student?.gender || "",

        institution: data.student?.institution?.name || "",
        stateCampus: data.student?.state?.name || "",

        faculty: data.student?.faculty || "",
        department: data.student?.department || "",
        level: data.student?.level || "",
        matricNumber: data.student?.matricNumber || "",
        residence: data.student?.residence || "",
        address: data.student?.address || "",

        storeLogo: data.business?.logo || "",
        storeLogoFile: null,

        storeBanner: data.business?.banner || "",
        storeBannerFile: null,

        storeName: data.business?.storeName || "",
        businessType: data.business?.type || "",
        businessDescription: data.business?.description || "",

        facebook: data.business?.socials?.facebook || "",
        instagram: data.business?.socials?.instagram || "",
        whatsapp: data.business?.socials?.whatsapp || "",
        tiktok: data.business?.socials?.tiktok || "",
    });

    // To properly rollback states on cancel
    const pristineDataRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await apiClient.get('/vendor/profile/me');

            const updatedProfile = res.data.data;

            setProfile(updatedProfile);

            const mapped = mapVendorToForm(updatedProfile);

            setFormData(mapped);
            pristineDataRef.current = mapped;

            setEditing(false);
        } catch (err) {
            showToast(getMessage(err, 'Failed to load profile'), 'error');
        } finally {
            setLoading(false);
        }
    };

    // FIXED: Form input change updates local states immediately 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);

            setFormData(prev => ({
                ...prev,
                [`${field}File`]: file,
                [field]: preview
            }));
        }
    };

    useEffect(() => {
        return () => {
            if (formData.profilePhoto?.startsWith("blob:")) {
                URL.revokeObjectURL(formData.profilePhoto);
            }

            if (formData.storeLogo?.startsWith("blob:")) {
                URL.revokeObjectURL(formData.storeLogo);
            }

            if (formData.storeBanner?.startsWith("blob:")) {
                URL.revokeObjectURL(formData.storeBanner);
            }
        };
    }, [formData.profilePhoto, formData.storeLogo, formData.storeBanner]);

    const handleRemoveImage = (field) => {
        setFormData(prev => ({
            ...prev,
            [`${field}File`]: null,
            [field]: pristineDataRef.current[field]
        }));
    };

    const copyToClipboard = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        showToast('Serial copied to clipboard', 'success');
    };

    const handleSave = async () => {
        if (!formData.storeName.trim() || !formData.fullName.trim()) {
            return showToast('Required fields are missing', 'error');
        }

        setSaving(true);
        try {
            const formDataObj = new FormData();

            formDataObj.append("fullName", formData.fullName);

            formDataObj.append(
                "business",
                JSON.stringify({
                    storeName: formData.storeName,
                    type: formData.businessType,
                    description: formData.businessDescription,
                    socials: {
                        facebook: formData.facebook,
                        instagram: formData.instagram,
                        whatsapp: formData.whatsapp,
                        tiktok: formData.tiktok
                    }
                })
            );

            if (formData.profilePhotoFile) {
                formDataObj.append(
                    "student.profilePhoto",
                    formData.profilePhotoFile
                );
            }

            if (formData.storeLogoFile) {
                formDataObj.append(
                    "business.logo",
                    formData.storeLogoFile
                );
            }

            if (formData.storeBannerFile) {
                formDataObj.append(
                    "business.banner",
                    formData.storeBannerFile
                );
            }
            await apiClient.put('/vendor/profile/me', formDataObj, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            await fetchProfile();

            setEditing(false);
            pristineDataRef.current = formData;
            showToast('Profile updated successfully!', 'success');
        } catch (err) {
            showToast(getMessage(err, 'Update failed.'), 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (pristineDataRef.current) {
            setFormData({
                ...pristineDataRef.current,
                profilePhotoFile: null,
                storeLogoFile: null,
                storeBannerFile: null,
            });
        }
        setEditing(false);
    };


    const isFormPristine = useMemo(() => {
        if (!pristineDataRef.current) return true;

        const {
            profilePhotoFile,
            storeLogoFile,
            storeBannerFile,
            ...current
        } = formData;

        const {
            profilePhotoFile: _1,
            storeLogoFile: _2,
            storeBannerFile: _3,
            ...original
        } = pristineDataRef.current;

        return JSON.stringify(current) === JSON.stringify(original);
    }, [formData]);

    // Exact Core App Color Systems Retained From Profile.jsx
    const bg = isDark ? 'bg-gray-900' : 'bg-gray-50';
    const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
    const text = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
    const border = isDark ? 'border-gray-700' : 'border-gray-200';
    const inputBg = isDark ? 'bg-gray-700' : 'bg-gray-50';

    const getStatusBadge = (status) => {
        const normalStyle = "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ";
        switch (status?.toLowerCase()) {
            case 'active':
                return normalStyle + "bg-green-500/10 text-green-500 border-green-500/20 animate-pulse";
            case 'pending':
                return normalStyle + "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case 'suspended':
                return normalStyle + "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "banned":
                return normalStyle + "bg-red-500/10 text-red-500 border-red-500/20";
            case "deleted":
                return normalStyle + "bg-gray-500/10 text-gray-500 border-gray-500/20";
            default:
                return normalStyle + "bg-red-500/10 text-red-500 border-red-500/20";
        }
    };

    const getVerificationBadge = (verified) => {
        const style =
            "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ";

        return verified
            ? style + "bg-green-500/10 text-green-500 border-green-500/20"
            : style + "bg-red-500/10 text-red-500 border-red-500/20";
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${bg} flex items-center justify-center`}>
                <Loading text='Loading Profile Panel...' />
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${bg} p-4 sm:p-6 lg:p-8 transition-all duration-300 antialiased font-sans selection:bg-green-500 selection:text-white`}>
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">

                {/* Upper Premium Header Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-700/30">
                    <div>
                        <Link to="/vendor/dashboard" className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-500 transition-colors mb-2">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                        </Link>
                        <h1 className={`text-3xl font-extrabold tracking-tight ${text} flex items-center gap-2`}>
                            Vendor Showcase <span className="font-light text-green-500">Profile</span>
                        </h1>
                    </div>

                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            className="inline-flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <FaEdit /> Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-3 animate-fade-in">
                            <button
                                onClick={handleSave}
                                disabled={isFormPristine || saving}
                                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md disabled:opacity-40 disabled:scale-100 transform hover:-translate-y-0.5"
                            >
                                {saving ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <FaSave />
                                )}
                                Save Changes
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all shadow-md transform hover:-translate-y-0.5"
                            >
                                <FaTimes /> Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* SECTION 1. ACCOUNT OVERVIEW */}
                <div className="relative group overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-transparent to-yellow-500/10 opacity-60 pointer-events-none" />
                    <div className={`${cardBg} border ${border} p-6 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}>
                        <div className="space-y-1">
                            <h2 className={`text-lg font-black tracking-tight ${text}`}>System Security Ledger</h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                            <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account Standing</span>
                                <div className={getStatusBadge(formData.accountStatus)}>
                                    {formData.accountStatus}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Verified</span>
                                <div className={getVerificationBadge(formData.isVerified)}>
                                    {formData.isVerified ? "Verified" : "Not Verified"}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Verification Status</span>
                                <div className={getStatusBadge(formData.accountStatus)}>
                                    {formData.verificationStatus}
                                </div>
                            </div>
                            <div className="h-10 w-px bg-gray-700/40 hidden sm:block"></div>
                            <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vendor Serial Code</span>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${inputBg} border ${border} transition-all focus-within:border-green-500`}>
                                    <code className={`text-xs font-mono font-bold tracking-widest ${text}`}>{formData.serialNumber || 'VND-EMPTY'}</code>
                                    <button
                                        onClick={() => copyToClipboard(formData.serialNumber)}
                                        className="text-gray-400 hover:text-green-500 transition-colors p-0.5"
                                        title="Copy to Clipboard"
                                    >
                                        {copied ? <FaCheck size={12} className="text-green-500 animate-scale" /> : <FaCopy size={12} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* THE GRADIENT IDENTITY BANNER */}
                <div className="relative">
                    <div className={`h-40 rounded-2xl overflow-hidden ${cardBg} border ${border} shadow-inner relative group`}>
                        <div
                            className={`w-full h-full bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 transform group-hover:scale-[1.01] transition-transform duration-700 relative overflow-hidden`}
                        >
                            {formData.storeBanner ? (
                                <>
                                    <img
                                        src={formData.storeBanner}
                                        alt={formData.storeName}
                                        className="w-full h-full object-contain p-6"
                                    />

                                    <div className="absolute inset-0 bg-black/10"></div>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FaImage className="text-5xl text-white opacity-25 animate-pulse" />
                                </div>
                            )}
                            {editing && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                                    <label className="flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl cursor-pointer shadow-xl transition-all duration-200 hover:scale-105">
                                        <FaImage size={18} />
                                        <span className="font-semibold">Change Banner</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleImageUpload(e, "storeBanner")}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SECTION 2. PERSONAL INFORMATION ACCENT CARD */}
                    <div className="absolute -bottom-16 left-6 right-6 md:left-10 md:right-10 flex flex-col sm:flex-row items-center sm:items-end gap-4 z-20">
                        <div className="relative group">
                            <div className={`w-28 h-28 rounded-2xl border-4 ${cardBg} overflow-hidden shadow-2xl transition-all duration-300 group-hover:scale-105 ${border}`}>
                                {formData.profilePhoto ? (
                                    <img src={formData.profilePhoto} alt="Identity Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-400">
                                        <FaUser className="text-3xl" />
                                    </div>
                                )}
                            </div>
                            {editing && (
                                <label className="absolute bottom-1 right-1 bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl cursor-pointer shadow-xl transition-all transform hover:scale-110">
                                    <FaCamera size={13} />
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'profilePhoto')} />
                                </label>
                            )}
                        </div>
                        <div className="text-center sm:text-left sm:pb-2 flex-1 w-full">
                            <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'} drop-shadow-sm truncate`}>
                                {formData.fullName || 'Unassigned Record'}
                            </h3>
                            <p className="text-sm text-green-500 font-semibold mt-1">
                                {formData.storeName || "Store Name Not Set"}
                            </p>
                            {editing && formData.profilePhoto && (
                                <button onClick={() => handleRemoveImage('profilePhoto')} className="text-xs text-red-500 hover:underline font-bold mt-1 block">
                                    [ Remove Photo ]
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* PROFILE CORE DYNAMIC MATRICES GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-12">

                    {/* LEFT COLUMN: PRIMARY INPUT MODULES */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* PERSONAL IDENTITY CONTINUATION FIELDS */}
                        <div className={`${cardBg} rounded-2xl border ${border} p-6 shadow-md space-y-4`}>
                            <h4 className={`text-sm font-bold uppercase tracking-wider ${text} flex items-center gap-2`}>
                                <FaUser className="text-green-500" /> Identity Matrix Parameters
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Full Identity Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        className={`w-full px-4 py-3 rounded-xl border ${border} ${inputBg} ${text} transition-all duration-200 outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-60 disabled:cursor-not-allowed`}
                                        placeholder="Full Legal Name"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Gender Orientation (Read Only)</label>
                                    <div className={`w-full px-4 py-3 rounded-xl border ${border} bg-gray-900/10 text-gray-400 font-semibold text-sm cursor-not-allowed`}>
                                        {formData.gender}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 4. BUSINESS INFORMATION COMPONENT */}
                        <div className={`${cardBg} rounded-2xl border ${border} p-6 shadow-md space-y-6`}>
                            <div className="flex justify-between items-center border-b border-gray-700/20 pb-3">
                                <div className="space-y-0.5">
                                    <h3 className={`text-base font-black tracking-tight ${text} flex items-center gap-2`}>
                                        <FaStore className="text-green-500" /> Operational Storefront Configuration
                                    </h3>
                                </div>
                            </div>

                            {/* Store Emblem Controller block */}
                            <div className={`flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border ${border} ${inputBg}/30 transition-all`}>
                                <div className={`w-16 h-16 rounded-xl overflow-hidden shadow-inner ${border} ${inputBg} flex-shrink-0 relative group border-2`}>
                                    {formData.storeLogo ? (
                                        <img src={formData.storeLogo} alt="Logo Matrix" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                            <FaStore size={22} />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1 text-center sm:text-left">
                                    <h5 className={`text-sm font-bold ${text}`}>Commercial Storefront Logo</h5>
                                    {editing ? (
                                        <div className="flex gap-3 pt-1">
                                            <label className="text-xs font-bold text-green-500 cursor-pointer hover:text-green-600 transition-colors">
                                                Update Emblem
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'storeLogo')} />
                                            </label>
                                            {formData.storeLogo && (
                                                <button onClick={() => handleRemoveImage('storeLogo')} className="text-xs font-bold text-red-500 hover:underline">
                                                    Discard
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">Unlock editing controls above to update vector parameters.</p>
                                    )}
                                </div>
                            </div>

                            {/* Operational String Inputs Matrix row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Registered Store Name</label>
                                    <input
                                        type="text"
                                        name="storeName"
                                        value={formData.storeName}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        className={`w-full px-4 py-3 rounded-xl border ${border} ${inputBg} ${text} transition-all outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-60`}
                                        placeholder="e.g. Alaba Tech Hub"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Business Activity Type</label>
                                    <select
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleChange}
                                        disabled={!editing}
                                        className={`w-full px-4 py-3 rounded-xl border ${border} ${inputBg} ${text}`}
                                    >
                                        <option value="">Select Business Type</option>
                                        <option value="freelancer">Freelancer</option>
                                        <option value="reseller">Reseller</option>
                                        <option value="service-provider">Service Provider</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Corporate Description Abstract</label>
                                <textarea
                                    name="businessDescription"
                                    value={formData.businessDescription}
                                    onChange={handleChange}
                                    disabled={!editing}
                                    rows={4}
                                    className={`w-full px-4 py-3 rounded-xl border ${border} ${inputBg} ${text} transition-all outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-60 resize-none leading-relaxed`}
                                    placeholder="State your specialized market offerings, delivery timelines, and logistics scope..."
                                />
                            </div>

                            {/* Social Vector Streams Box */}
                            <div className="space-y-3 pt-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Social Connectivity Gateways</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { icon: <FaFacebook className="text-blue-500" />, name: 'facebook', placeholder: 'Facebook URL Link' },
                                        { icon: <FaInstagram className="text-pink-500" />, name: 'instagram', placeholder: 'Instagram URL Profile' },
                                        { icon: <FaWhatsapp className="text-green-500" />, name: 'whatsapp', placeholder: 'WhatsApp API Terminal' },
                                        { icon: <FaTiktok className={isDark ? "text-white" : "text-black"} />, name: 'tiktok', placeholder: 'TikTok Feed Vector' },
                                    ].map((channel, cIdx) => (
                                        <div key={cIdx} className="relative flex items-center group">
                                            <div className="absolute left-4 pointer-events-none transition-transform group-focus-within:scale-110">{channel.icon}</div>
                                            <input
                                                type="text"
                                                name={channel.name}
                                                value={formData[channel.name]}
                                                onChange={handleChange}
                                                disabled={!editing}
                                                className={`w-full pl-11 pr-4 py-3 rounded-xl border ${border} ${inputBg} ${text} text-xs font-mono transition-all outline-none focus:border-green-500 disabled:opacity-60`}
                                                placeholder={channel.placeholder}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: READ-ONLY SYSTEM PARAMS */}
                    <div className="space-y-6">

                        {/* SECTION 3. STUDENT PROFILE INFORMATION */}
                        <div className={`${cardBg} rounded-2xl border ${border} p-6 shadow-lg relative overflow-hidden group`}>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-500/10 to-transparent rounded-bl-full opacity-60 pointer-events-none" />
                            <div className="border-b border-gray-700/20 pb-3 mb-4">
                                <h3 className={`text-base font-black tracking-tight ${text} flex items-center gap-2`}>
                                    <FaGraduationCap className="text-green-500" /> Academic Dossier
                                </h3>
                                <p className="text-[10px] text-yellow-500 font-medium mt-0.5">Read-only institutional security alignment.</p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { label: 'Institution', val: formData.institution },
                                    { label: 'State / Campus', val: formData.stateCampus },
                                    { label: 'Faculty Directorate', val: formData.faculty },
                                    { label: 'Department Division', val: formData.department },
                                    { label: 'Level Standing', val: formData.level },
                                    { label: 'Matriculation Number', val: formData.matricNumber },
                                    { label: 'Residential Status', val: formData.residence },
                                    { label: 'Registered Address', val: formData.address },
                                ].map((fieldObj, fIdx) => (
                                    <div key={fIdx} className={`p-2.5 rounded-xl border ${border} ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'} transition-all hover:bg-green-500/5`}>
                                        <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{fieldObj.label}</span>
                                        <span className={`text-xs font-semibold ${text} block truncate`}>{fieldObj.val || '—'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CORE SUPPORT ACCENT CARD */}
                        <div className="bg-gradient-to-br from-green-700 to-green-500 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
                            <div className="relative z-10 space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-black tracking-tight">Need verification aid?</h3>
                                    <p className="text-xs text-green-100 opacity-90 leading-relaxed">Our unified desk infrastructure validates merchant status records 24/7.</p>
                                </div>
                                <Link to='/contactus' className="flex items-center justify-center gap-2 w-full py-3 bg-white text-green-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-yellow-400 hover:text-green-950 transition-all shadow-md">
                                    <PhoneCall className="w-3.5 h-3.5 animate-bounce" /> Call Support Lines
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