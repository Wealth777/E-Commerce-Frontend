import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
    User, GraduationCap, Building, ShieldCheck, MapPin, Briefcase,
    Camera, FileText, ArrowRight, ArrowLeft, Loader2, CheckCircle2,
    Upload, Info, AlertTriangle, Image,
    UserCheck, RefreshCw
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/apiClient';
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

export default function RecoverAccount() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [schools, setSchools] = useState([]);
    const [states, setStates] = useState([]);
    const [loadingStates, setLoadingStates] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);


    const navigate = useNavigate();
    const { showToast } = useToast();

    // Validation Schema synced completely with your requested structures
    const validationSchema = Yup.object({
        fullName: Yup.string().required("Full name is required"),

        email: Yup.string()
            .email("Enter a valid email")
            .required("Previous email is required"),

        storeName: Yup.string()
            .required("Store name is required"),

        student: Yup.object({
            institution: Yup.string().required(),
            matricNumber: Yup.string().required(),
            faculty: Yup.string().required(),
            department: Yup.string().required(),
            level: Yup.string().required()
        }),

        verificationDocuments: Yup.object({
            selfie: Yup.mixed().required("Selfie is required"),
            schoolIdCard: Yup.mixed().required(),
            nationalId: Yup.mixed().required()
        }),

        declaration: Yup.boolean().oneOf(
            [true],
            "You must confirm ownership"
        )
    });

    const formik = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            storeName: "",

            student: {
                institution: "",
                matricNumber: "",
                faculty: "",
                department: "",
                level: ""
            },

            verificationDocuments: {
                selfie: "",
                schoolIdCard: "",
                nationalId: ""
            },

            declaration: false
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const formData = new FormData();

                formData.append("fullName", values.fullName);
                formData.append("email", values.email);
                formData.append("storeName", values.storeName);

                formData.append(
                    "student",
                    JSON.stringify(values.student)
                );

                formData.append(
                    "declaration",
                    values.declaration
                );

                formData.append(
                    "selfie",
                    values.verificationDocuments.selfie
                );

                formData.append(
                    "schoolIdCard",
                    values.verificationDocuments.schoolIdCard
                );

                formData.append(
                    "nationalId",
                    values.verificationDocuments.nationalId
                );

                await apiClient.post(
                    "/security/recover-account",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );

                showToast('Onboarding application submitted successfully!', 'success');
            } catch (error) {
                showToast(error?.response?.data?.message || 'Failed to submit onboarding details.', 'error');
            } finally {
                setLoading(false);
            }
        }
    });

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const res = await apiClient.get("/schools/");
                setSchools(res.data?.data || []);
            } catch (err) {
                showToast(
                    err?.response?.data?.message || "Failed to load schools",
                    "error"
                );
            }
        };
        fetchSchools();
    }, [showToast]);

    useEffect(() => {
        const fetchStates = async () => {
            if (!formik.values.student.institution) {
                setStates([]);
                formik.setFieldValue('student.state', '');
                return;
            }

            try {
                setLoadingStates(true);
                const res = await apiClient.get(
                    `/schools/${formik.values.student.institution}/states`
                );
                setStates(res.data?.data || []);
                formik.setFieldValue('student.state', '');
            } catch (err) {
                showToast(
                    err?.response?.data?.message || 'Failed to load states',
                    'error'
                );
            } finally {
                setLoadingStates(false);
            }
        };
        fetchStates();
    }, [formik.values.student.institution, showToast]);

    const startCamera = async () => {
        setCameraActive(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 480, facingMode: "user" } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            showToast("Could not access webcam. Please check permissions.", "error");
            setCameraActive(false);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.width = 400;
            canvas.height = 400;
            context.drawImage(video, 0, 0, 400, 400);

            canvas.toBlob((blob) => {
                const file = new File(
                    [blob],
                    "profile-photo.jpg",
                    {
                        type: "image/jpeg",
                    }
                );

                formik.setFieldValue(
                    "student.profilePhoto",
                    file
                );
            }, "image/jpeg", 0.9);

            const stream = video.srcObject;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            setCameraActive(false);
        }
    };

    const retakePhoto = () => {
        formik.setFieldValue("student.profilePhoto", null);
        startCamera();
    };

    const handleFileUpload = (e, field) => {
        const file = e.target.files[0];

        if (file) {
            formik.setFieldValue(field, file);
        }
    };

    const handleSchoolChange = (e) => {
        formik.setFieldValue("student.institution", e.target.value);
    };

    const validateStep = async (currentStep) => {
        const errors = await formik.validateForm();
        if (currentStep === 1) {
            const step1Fields = ['profilePhoto', 'gender', 'institution', 'state', 'matricNumber', 'faculty', 'department', 'level', 'residence', 'address'];
            const hasErrors = step1Fields.some(f => errors.student?.[f]);
            step1Fields.forEach(f => formik.setFieldTouched(`student.${f}`, true));
            if (!hasErrors) setStep(2);
        } else if (currentStep === 2) {
            const step2Fields = ['storeName', 'type', 'description'];
            const hasErrors = step2Fields.some(f => errors.business?.[f]);
            step2Fields.forEach(f => formik.setFieldTouched(`business.${f}`, true));
            if (!hasErrors) setStep(3);
        } else if (currentStep === 3) {
            const step3Fields = ['schoolIdCard', 'nationalId'];
            const hasErrors = step3Fields.some(f => errors.verificationDocuments?.[f]);
            step3Fields.forEach(f => formik.setFieldTouched(`verificationDocuments.${f}`, true));
            if (!hasErrors) setStep(4);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center px-4 py-12 transition-colors duration-200">
            <div className="w-full max-w-3xl bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 shadow-2xl rounded-3xl p-6 sm:p-10 relative">

                {/* Visual Onboarding Progress Indicator Header */}
                <div className="mb-8 pb-6 border-b border-slate-100 dark:border-slate-800/60">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Recover your account</h2>
                        <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full">Step {step} of 4</span>
                    </div>
                    {/* Status Step Dots */}
                    <div className="grid grid-cols-4 gap-2 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${step >= 1 ? 'bg-emerald-500' : ''}`} />
                        <div className={`h-full rounded-full transition-all duration-300 ${step >= 2 ? 'bg-emerald-500' : ''}`} />
                        <div className={`h-full rounded-full transition-all duration-300 ${step >= 3 ? 'bg-emerald-500' : ''}`} />
                        <div className={`h-full rounded-full transition-all duration-300 ${step >= 4 ? 'bg-emerald-500' : ''}`} />
                    </div>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-6">

                    {/* PAGE 1: STUDENT DATA */}
                    {step === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-start bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-4 rounded-xl mb-4">
                                <Info className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                    <strong>Why we need this information:</strong>
                                    Account recovery requires identity verification. We compare the information you provide with the records already associated with your account to confirm ownership, prevent fraud, and keep the CampusTrade marketplace secure.
                                </p>
                            </div>

                            <h3 className="text-lg font-semibold flex items-center gap-2"><User className="w-5 h-5 text-emerald-500" />Tell Us About You</h3>

                            {/* Profile Image Row Component */}
                            <div className="flex flex-col gap-6 bg-slate-50 dark:bg-[#161D30] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="w-full lg:w-auto">
                                        <div className="flex flex-col bg-slate-100/50 dark:bg-[#161D30]/40 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-4 h-full">
                                            <label className="text-[10px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5 mb-2">
                                                <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Face Verification Identity Check
                                            </label>

                                            <div className="flex flex-col items-center justify-center py-2">
                                                {/* Capture State Switching Display Logic */}
                                                {!formik.values.student.profilePhoto && !cameraActive && (
                                                    <button
                                                        type="button"
                                                        onClick={startCamera}
                                                        className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-full w-32 h-32 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                                                    >
                                                        <Camera className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                                        <span className="text-[11px] font-medium text-slate-500 mt-1">Open Camera</span>
                                                    </button>
                                                )}

                                                {cameraActive && (
                                                    <div className="flex flex-col items-center">
                                                        <div className="overflow-hidden rounded-full w-36 h-36 border-4 border-emerald-500/30 shadow-inner bg-black">
                                                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={capturePhoto}
                                                            className="mt-3 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center space-x-1"
                                                        >
                                                            <Camera className="w-3.5 h-3.5" />
                                                            <span>Snapshot</span>
                                                        </button>
                                                    </div>
                                                )}

                                                {formik.values.student.profilePhoto && (
                                                    <div className="flex flex-col items-center">
                                                        <div className="rounded-full overflow-hidden w-36 h-36 border-4 border-emerald-500 shadow-md">
                                                            {formik.values.student.profilePhoto instanceof File && (
                                                                <img
                                                                    src={URL.createObjectURL(formik.values.student.profilePhoto)}
                                                                    alt="Profile"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={retakePhoto}
                                                            className="mt-3 px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium flex items-center space-x-1"
                                                        >
                                                            <RefreshCw className="w-3.5 h-3.5" />
                                                            <span>Retake Photo</span>
                                                        </button>
                                                    </div>
                                                )}
                                                <canvas ref={canvasRef} className="hidden" />
                                            </div>
                                            {formik.touched.student?.profilePhoto && formik.errors.student?.profilePhoto && (
                                                <p className="text-center text-xs text-red-500 mt-1">{formik.errors.student?.profilePhoto}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        {/* Full Name */}
                                        <div className="flex">
                                            <label className="text-xs font-semibold mb-1.5">Full Name</label>
                                            <input type="text"  {...formik.getFieldProps("fullName")} placeholder="John Alani" className="w-full bg-slate-50 dark:bg-[#161D30] border rounded-xl px-4 py-2.5 text-sm border-slate-200 dark:border-slate-800 outline-none" />
                                            {formik.touched.fullName && formik.errors.fullName && <p className="text-xs text-red-500 mt-1">{formik.errors.fullName}</p>}
                                        </div>

                                        {/* Email */}
                                        <div className="flex">
                                            <label className="text-xs font-semibold mb-1.5">Original Email</label>
                                            <input type="email"  {...formik.getFieldProps("email")} placeholder="johnalani@gmail.com" className="w-full bg-slate-50 dark:bg-[#161D30] border rounded-xl px-4 py-2.5 text-sm border-slate-200 dark:border-slate-800 outline-none" />
                                            {formik.touched.email && formik.errors.email && <p className="text-xs text-red-500 mt-1">{formik.errors.email}</p>}
                                        </div>

                                        {/* Dropdowns row */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <label className="text-xs font-semibold mb-1.5">Gender</label>
                                                <select
                                                    {...formik.getFieldProps("student.gender")}
                                                    className="w-full bg-slate-50 dark:bg-[#161D30] border rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 border-slate-200 dark:border-slate-800 outline-none"
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                </select>
                                                {formik.touched.student?.gender && formik.errors.student?.gender && <p className="text-xs text-red-500 mt-1">{formik.errors.student.gender}</p>}
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-xs font-semibold mb-1.5">Institution</label>
                                                <select
                                                    value={formik.values.student.institution}
                                                    onChange={handleSchoolChange}
                                                    className="w-full bg-slate-50 dark:bg-[#161D30] border rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 border-slate-200 dark:border-slate-800 outline-none"
                                                >
                                                    <option value="">Select Institution</option>
                                                    {schools.map(school => (
                                                        <option key={school._id || school.id} value={school._id || school.id}>{school.name}</option>
                                                    ))}
                                                </select>
                                                {formik.touched.student?.institution && formik.errors.student?.institution && <p className="text-xs text-red-500 mt-1">{formik.errors.student.institution}</p>}
                                            </div>

                                            <div className="flex flex-col">
                                                <label className="text-xs font-semibold mb-1.5">State (for school)</label>
                                                <select
                                                    {...formik.getFieldProps('student.state')}
                                                    disabled={loadingStates || !formik.values.student.institution}
                                                    className="w-full bg-slate-50 dark:bg-[#161D30] border rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 border-slate-200 dark:border-slate-800 outline-none disabled:opacity-50"
                                                >
                                                    <option value="">{loadingStates ? "Loading states..." : "Select State"}</option>
                                                    {states.map((st, i) => (
                                                        <option key={i} value={st._id}>{st.name || st}</option>
                                                    ))}
                                                </select>
                                                {formik.touched.student?.state && formik.errors.student?.state && <p className="text-xs text-red-500 mt-1">{formik.errors.student.state}</p>}
                                            </div>
                                        </div>

                                        {/* Academic Framework Info Row */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <label className="text-xs font-semibold mb-1.5">Matric Number</label>
                                                <input type="text" {...formik.getFieldProps('student.matricNumber')} placeholder="e.g. RUN/21/10452" className="w-full bg-slate-50 dark:bg-[#161D30] border rounded-xl px-4 py-2.5 text-sm border-slate-200 dark:border-slate-800 outline-none" />
                                                {formik.touched.student?.matricNumber && formik.errors.student?.matricNumber && <p className="text-xs text-red-500 mt-1">{formik.errors.student.matricNumber}</p>}
                                            </div>

                                            <div className="flex flex-col">
                                                <label className="text- xs font-semibold mb-1.5">Level</label>
                                                <select {...formik.getFieldProps('student.level')} className="w-full bg-slate-50 dark:bg-[#161D30] border rounded-xl px-3 py-2.5 text-sm border-slate-200 dark:border-slate-800 outline-none">
                                                    <option value="">Select Level</option>
                                                    <option value="100">100 Lvl</option>
                                                    <option value="200">200 Lvl</option>
                                                    <option value="300">300 Lvl</option>
                                                    <option value="400">400 Lvl</option>
                                                    <option value="500">500 Lvl</option>
                                                </select>
                                                {formik.touched.student?.level && formik.errors.student?.level && <p className="text-xs text-red-500 mt-1">{formik.errors.student.level}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <label className="text-xs font-semibold mb-1.5">Faculty</label>
                                                <input type="text" {...formik.getFieldProps('student.faculty')} placeholder="e.g. Science" className="w-full bg-slate-50 dark:bg-[#161D30] border rounded-xl px-4 py-2.5 text-sm border-slate-200 dark:border-slate-800 outline-none" />
                                                {formik.touched.student?.faculty && formik.errors.student?.faculty && <p className="text-xs text-red-500 mt-1">{formik.errors.student.faculty}</p>}
                                            </div>

                                            <div className="flex flex-col">
                                                <label className="text-xs font-semibold mb-1.5">Department</label>
                                                <input type="text" {...formik.getFieldProps('student.department')} placeholder="e.g. Computer Science" className="w-full bg-slate-50 dark:bg-[#161D30] border rounded-xl px-4 py-2.5 text-sm border-slate-200 dark:border-slate-800 outline-none" />
                                                {formik.touched.student?.department && formik.errors.student?.department && <p className="text-xs text-red-500 mt-1">{formik.errors.student.department}</p>}
                                            </div>
                                        </div>

                                        {/* Residence Framework Section */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="flex flex-col">
                                                <label className="text-xs font-semibold mb-1.5">Residence</label>
                                                <select {...formik.getFieldProps('student.residence')} className="w-full bg-slate-50 dark:bg-[#161D30] border rounded-xl px-3 py-2.5 text-sm border-slate-200 dark:border-slate-800 outline-none">
                                                    <option value="">Select Option</option>
                                                    <option value="hostel">Hostel</option>
                                                    <option value="off-campus">Off-campus</option>
                                                </select>
                                                {formik.touched.student?.residence && formik.errors.student?.residence && <p className="text-xs text-red-500 mt-1">{formik.errors.student.residence}</p>}
                                            </div>

                                            <div className="flex flex-col sm:col-span-2">
                                                <label className="text-xs font-semibold mb-1.5">Address / Room Details</label>
                                                <input type="text" {...formik.getFieldProps('student.address')} placeholder="e.g. Block C Room 4, or Silver Estate gate" className="w-full bg-slate-50 dark:bg-[#161D30] border rounded-xl px-4 py-2.5 text-sm border-slate-200 dark:border-slate-800 outline-none" />
                                                {formik.touched.student?.address && formik.errors.student?.address && <p className="text-xs text-red-500 mt-1">{formik.errors.student.address}</p>}
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <button type="button" onClick={() => validateStep(1)} className="px-5 py-2.5 bg-slate-900 dark:bg-emerald-600 hover:opacity-90 text-white text-sm font-medium rounded-xl flex items-center space-x-2 shadow-lg">
                                                <span>Business Profile</span> <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PAGE 2: BUSINESS INFORMATION */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-start bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-4 rounded-xl mb-4">
                                <Info className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                    <strong>Why we need this information:</strong> This details your outward brand to our student consumer base. Structuring your storefront profile accurately makes sure shoppers filter and locate your items or specialist craft reliably.
                                </p>
                            </div>

                            <h3 className="text-lg font-semibold flex items-center gap-2"><Briefcase className="w-5 h-5 text-emerald-500" /> Business Information</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold mb-1.5">Store / Brand Name</label>
                                    <input type="text" {...formik.getFieldProps('business.storeName')} placeholder="e.g. Campus Kicks Hub" className="w-full bg-slate-50 dark:bg-[#161D30] border rounded-xl px-4 py-2.5 text-sm border-slate-200 dark:border-slate-800 outline-none" />
                                    {formik.touched.business?.storeName && formik.errors.business?.storeName && <p className="text-xs text-red-500 mt-1">{formik.errors.business.storeName}</p>}
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-xs font-semibold mb-1.5">Business Type</label>
                                    <select {...formik.getFieldProps('business.type')} className="w-full bg-slate-50 dark:bg-[#161D30] border rounded-xl px-3 py-2.5 text-sm border-slate-200 dark:border-slate-800 outline-none">
                                        <option value="">Select Business Setup</option>
                                        <option value="freelancer">Freelancer</option>
                                        <option value="reseller">Reseller</option>
                                        <option value="service-provider">Service Provider</option>
                                    </select>
                                    {formik.touched.business?.type && formik.errors.business?.type && <p className="text-xs text-red-500 mt-1">{formik.errors.business.type}</p>}
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-xs font-semibold mb-1.5">Business Description</label>
                                <textarea rows="3" {...formik.getFieldProps('business.description')} placeholder="Detail your general dispatch timelines, items sold or general services provided..." className="w-full bg-slate-50 dark:bg-[#161D30] border rounded-xl px-4 py-2.5 text-sm border-slate-200 dark:border-slate-800 outline-none resize-none" />
                                {formik.touched.business?.description && formik.errors.business?.description && <p className="text-xs text-red-500 mt-1">{formik.errors.business.description}</p>}
                            </div>

                            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60">
                                <button type="button" onClick={() => setStep(1)} className="px-4 py-2 text-slate-400 hover:text-slate-200 text-sm font-medium flex items-center space-x-1"><ArrowLeft className="w-4 h-4" /><span>Back</span></button>
                                <button type="button" onClick={() => validateStep(2)} className="px-5 py-2.5 bg-slate-900 dark:bg-emerald-600 hover:opacity-90 text-white text-sm font-medium rounded-xl flex items-center space-x-2"><span>Identity Verification</span> <ArrowRight className="w-4 h-4" /></button>
                            </div>
                        </div>
                    )}

                    {/* PAGE 3: IDENTITY VERIFICATION DOCUMENT REPOSITORY */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex items-start bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 p-4 rounded-xl mb-4">
                                <Info className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                    <strong>Why we need this information:</strong> This step verifies that the operator of this storefront matches the legal and institutional records provided. It is a mandatory fraud prevention guardrail designed to protect buyers from catfishing, impersonation, or financial disputes.
                                </p>
                            </div>

                            <h3 className="text-lg font-semibold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500" /> Identity Verification</h3>

                            {/* Dual Layout for ID file inputs */}
                            <div className="space-y-4">
                                {/* School ID Upload Container */}
                                <div className="border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-5 bg-slate-50 dark:bg-[#161D30]/60 text-center">
                                    <label className="block text-sm font-semibold mb-1">School ID Card File Upload</label>
                                    <p className="text-xs text-slate-400 mb-3">Provide a snapshot copy of the front of your Institution ID card.</p>
                                    <input type="file" accept="image/*" id="schoolIdCard" onChange={(e) => handleFileUpload(e, 'verificationDocuments.schoolIdCard')} className="hidden" />
                                    <label htmlFor="schoolIdCard" className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold transition-all">
                                        <Upload className="w-4 h-4 text-emerald-500" /> <span>{formik.values.verificationDocuments.schoolIdCard ? "Change ID Photo" : "Upload ID Image"}</span>
                                    </label>
                                    {formik.values.verificationDocuments.schoolIdCard && (
                                        <div className="mt-3 text-[11px] text-emerald-500 font-medium flex items-center justify-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Document cached successfully.</div>
                                    )}
                                    {formik.touched.verificationDocuments?.schoolIdCard && formik.errors.verificationDocuments?.schoolIdCard && <p className="text-xs text-red-500 mt-1">{formik.errors.verificationDocuments.schoolIdCard}</p>}
                                </div>

                                {/* National ID Document Upload */}
                                <div className="border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-5 bg-slate-50 dark:bg-[#161D30]/60 text-center">
                                    <label className="block text-sm font-semibold mb-1">National ID / Verification Slip or Selfie holding School ID</label>
                                    <p className="text-xs text-slate-400 mb-3">Upload an official state-issued ID card or a clear selfie containing your physical card.</p>
                                    <input type="file" accept="image/*" id="nationalId" onChange={(e) => handleFileUpload(e, 'verificationDocuments.nationalId')} className="hidden" />
                                    <label htmlFor="nationalId" className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold transition-all">
                                        <Upload className="w-4 h-4 text-emerald-500" /> <span>{formik.values.verificationDocuments.nationalId ? "Change Identification Document" : "Upload Verification Doc"}</span>
                                    </label>
                                    {formik.values.verificationDocuments.nationalId && (
                                        <div className="mt-3 text-[11px] text-emerald-500 font-medium flex items-center justify-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Document cached successfully.</div>
                                    )}
                                    {formik.touched.verificationDocuments?.nationalId && formik.errors.verificationDocuments?.nationalId && <p className="text-xs text-red-500 mt-1">{formik.errors.verificationDocuments.nationalId}</p>}
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60">
                                <button type="button" onClick={() => setStep(2)} className="px-4 py-2 text-slate-400 hover:text-slate-200 text-sm font-medium flex items-center space-x-1"><ArrowLeft className="w-4 h-4" /><span>Back</span></button>
                                <button type="button" onClick={() => validateStep(3)} className="px-5 py-2.5 bg-slate-900 dark:bg-emerald-600 hover:opacity-90 text-white text-sm font-medium rounded-xl flex items-center space-x-2"><span>Review Terms</span> <ArrowRight className="w-4 h-4" /></button>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60">
                        <button type="button" onClick={() => setStep(3)} className="px-4 py-2 text-slate-400 hover:text-slate-200 text-sm font-medium flex items-center space-x-1"><ArrowLeft className="w-4 h-4" /><span>Back</span></button>

                        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/70 text-white text-sm font-medium rounded-xl transition-all flex items-center space-x-2 shadow-md">
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Processing Profile...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Send Recover Request</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}