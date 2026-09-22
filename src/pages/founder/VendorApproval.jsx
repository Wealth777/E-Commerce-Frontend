import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import apiClient from "../../api/apiClient";

import {
    AlertTriangle,
    ArrowLeft,
    Building2,
    Check,
    CheckCircle2,
    CircleCheck,
    Clock3,
    FileCheck2,
    FileText,
    FolderOpen,
    FolderSearch,
    LoaderCircle,
    Paperclip,
    Search,
    ShieldCheck,
    Store,
    X,
    XCircle,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";


const STATUS_STYLE = {
    pending: {
        light: "bg-amber-50 text-amber-700 ring-amber-200",
        dark: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
    },

    approved: {
        light: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        dark: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
    },

    rejected: {
        light: "bg-rose-50 text-rose-700 ring-rose-200",
        dark: "bg-rose-500/10 text-rose-400 ring-rose-500/20",
    },
};


const AVATAR_BG = [
    "bg-indigo-600",
    "bg-teal-600",
    "bg-rose-600",
    "bg-amber-600",
    "bg-sky-600",
    "bg-violet-600",
];


const initials = (value = "") =>
    value
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();


const hashColor = (value = "") =>
    AVATAR_BG[
    [...value].reduce(
        (total, char) => total + char.charCodeAt(0),
        0
    ) % AVATAR_BG.length
    ];


const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "—";
    }

    return parsed.toLocaleDateString();
};


const formatDateTime = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "—";
    }

    return parsed.toLocaleString();
};


function Badge({ status, isDark }) {
    const normalizedStatus = status || "pending";

    const style =
        STATUS_STYLE[normalizedStatus] ||
        STATUS_STYLE.pending;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${isDark ? style.dark : style.light
                }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${normalizedStatus === "pending"
                    ? "bg-amber-500"
                    : normalizedStatus === "approved"
                        ? "bg-emerald-500"
                        : "bg-rose-500"
                    }`}
            />

            {normalizedStatus}
        </span>
    );
}


function Field({
    label,
    value,
    mono = false,
    isDark,
}) {
    return (
        <div>
            <dt
                className={`text-[11px] font-semibold uppercase tracking-wider ${isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                    }`}
            >
                {label}
            </dt>

            <dd
                className={`mt-0.5 break-words text-sm ${isDark
                    ? "text-slate-200"
                    : "text-slate-800"
                    } ${mono ? "font-mono" : ""}`}
            >
                {value !== undefined &&
                    value !== null &&
                    value !== ""
                    ? value
                    : "—"}
            </dd>
        </div>
    );
}


function Section({
    title,
    icon: Icon,
    children,
    isDark,
}) {
    return (
        <section
            className={`rounded-xl border p-5 ${isDark
                ? "border-slate-700 bg-slate-800"
                : "border-slate-200 bg-white"
                }`}
        >
            <h4
                className={`mb-4 flex items-center gap-2 text-sm font-bold ${isDark
                    ? "text-slate-100"
                    : "text-slate-900"
                    }`}
            >
                <Icon
                    className={`h-4 w-4 ${isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                        }`}
                />

                {title}
            </h4>

            {children}
        </section>
    );
}


function Modal({
    open,
    onClose,
    children,
    max = "max-w-3xl",
    isDark,
}) {
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6">
            <div
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
                onClick={onClose}
            />

            <div
                className={`relative my-auto w-full ${max} overflow-hidden rounded-2xl shadow-2xl ring-1 ${isDark
                    ? "bg-slate-900 ring-white/10"
                    : "bg-white ring-black/5"
                    }`}
            >
                {children}
            </div>
        </div>
    );
}


function ImagePreview({
    src,
    label,
    isDark,
}) {
    if (!src) {
        return (
            <div
                className={`flex min-h-32 items-center justify-center rounded-xl border border-dashed ${isDark
                    ? "border-slate-700 bg-slate-800 text-slate-500"
                    : "border-slate-300 bg-slate-50 text-slate-400"
                    }`}
            >
                <div className="text-center">
                    <FileText className="mx-auto h-7 w-7" />

                    <p className="mt-2 text-xs font-medium">
                        {label} not provided
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`overflow-hidden rounded-xl border ${isDark
                ? "border-slate-700 bg-slate-800"
                : "border-slate-200 bg-white"
                }`}
        >
            <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-500" />

                    <span
                        className={`text-sm font-semibold ${isDark
                            ? "text-slate-200"
                            : "text-slate-800"
                            }`}
                    >
                        {label}
                    </span>
                </div>

                <a
                    href={src}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-indigo-500 hover:text-indigo-600"
                >
                    Open
                </a>
            </div>

            <div className="p-3">
                <img
                    src={src}
                    alt={label}
                    className="max-h-80 w-full rounded-lg object-contain"
                    onError={(event) => {
                        event.currentTarget.style.display =
                            "none";
                    }}
                />
            </div>
        </div>
    );
}


function DetailsModal({
    vendor,
    onClose,
    onDecide,
    isDark,
}) {
    const [tab, setTab] = useState("overview");

    useEffect(() => {
        setTab("overview");
    }, [vendor?._id]);

    if (!vendor) return null;

    const tabs = [
        ["overview", "Overview"],
        ["student", "Student"],
        ["business", "Business"],
        ["compliance", "Compliance"],
        ["financial", "Financial"],
        ["docs", "Documents"],
    ];

    const mutedText = isDark
        ? "text-slate-400"
        : "text-slate-500";

    const strongText = isDark
        ? "text-slate-100"
        : "text-slate-900";

    const vendorName =
        vendor.fullName || "Vendor";

    const storeName =
        vendor.business?.storeName ||
        "Vendor Store";

    const documents = [
        {
            key: "schoolIdCard",
            label: "School ID Card",
            url: vendor.verificationDocuments?.schoolIdCard,
        },
        {
            key: "nationalId",
            label: "National ID",
            url: vendor.verificationDocuments?.nationalId,
        },
    ];

    return (
        <Modal
            open={Boolean(vendor)}
            onClose={onClose}
            max="max-w-5xl"
            isDark={isDark}
        >
            <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 px-6 py-6 text-white">
                <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-indigo-500/20 blur-2xl" />

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex items-start gap-4">
                    <div
                        className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl text-lg font-bold ring-2 ring-white/20 ${hashColor(
                            storeName
                        )}`}
                    >
                        {initials(storeName)}
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="truncate text-xl font-bold">
                                {storeName}
                            </h2>

                            <Badge
                                status={
                                    vendor.verificationStatus ||
                                    "pending"
                                }
                                isDark={isDark}
                            />
                        </div>

                        <p className="mt-1 text-sm text-slate-300">
                            {vendorName}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                            Submitted{" "}
                            {formatDate(
                                vendor.onboardingSentAt
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <div
                className={`flex gap-1 overflow-x-auto border-b px-4 ${isDark
                    ? "border-slate-700 bg-slate-800"
                    : "border-slate-200 bg-slate-50"
                    }`}
            >
                {tabs.map(([key, label]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setTab(key)}
                        className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${tab === key
                            ? isDark
                                ? "border-indigo-500 text-indigo-400"
                                : "border-indigo-600 text-indigo-700"
                            : isDark
                                ? "border-transparent text-slate-400 hover:text-slate-200"
                                : "border-transparent text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div
                className={`max-h-[58vh] space-y-4 overflow-y-auto p-5 ${isDark
                    ? "bg-slate-900"
                    : "bg-slate-50"
                    }`}
            >
                {tab === "overview" && (
                    <>
                        <Section
                            title="Vendor Information"
                            icon={Building2}
                            isDark={isDark}
                        >
                            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                                <Field
                                    label="Full Name"
                                    value={vendor.fullName}
                                    isDark={isDark}
                                />

                                <Field
                                    label="Serial Number"
                                    value={vendor.serialNumber}
                                    mono
                                    isDark={isDark}
                                />

                                <Field
                                    label="Email"
                                    value={vendor.email}
                                    isDark={isDark}
                                />

                                <Field
                                    label="Phone"
                                    value={vendor.phoneNo}
                                    isDark={isDark}
                                />

                                <Field
                                    label="Email Verified"
                                    value={
                                        vendor.emailVerified
                                            ? "Yes"
                                            : "No"
                                    }
                                    isDark={isDark}
                                />

                                <Field
                                    label="Account Status"
                                    value={vendor.accountStatus}
                                    isDark={isDark}
                                />

                                <Field
                                    label="Onboarding Completed"
                                    value={
                                        vendor.onboardingCompleted
                                            ? "Yes"
                                            : "No"
                                    }
                                    isDark={isDark}
                                />

                                <Field
                                    label="Onboarding Sent"
                                    value={formatDateTime(
                                        vendor.onboardingSentAt
                                    )}
                                    isDark={isDark}
                                />
                            </dl>
                        </Section>

                        <Section
                            title="Account State"
                            icon={ShieldCheck}
                            isDark={isDark}
                        >
                            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                                <Field
                                    label="Active"
                                    value={
                                        vendor.isActive
                                            ? "Yes"
                                            : "No"
                                    }
                                    isDark={isDark}
                                />

                                <Field
                                    label="Suspended"
                                    value={
                                        vendor.isSuspend
                                            ? "Yes"
                                            : "No"
                                    }
                                    isDark={isDark}
                                />

                                <Field
                                    label="Locked"
                                    value={
                                        vendor.isLocked
                                            ? "Yes"
                                            : "No"
                                    }
                                    isDark={isDark}
                                />

                                <Field
                                    label="Verification"
                                    value={
                                        vendor.verificationStatus
                                    }
                                    isDark={isDark}
                                />
                            </dl>
                        </Section>
                    </>
                )}

                {tab === "student" && (
                    <>
                        <Section
                            title="Student Information"
                            icon={Building2}
                            isDark={isDark}
                        >
                            <div className="mb-5 flex flex-col gap-4 sm:flex-row">
                                <div className="shrink-0">
                                    {vendor.student?.profilePhoto ? (
                                        <img
                                            src={
                                                vendor.student
                                                    .profilePhoto
                                            }
                                            alt={vendor.fullName}
                                            className="h-24 w-24 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                                        />
                                    ) : (
                                        <div
                                            className={`grid h-24 w-24 place-items-center rounded-xl text-xl font-bold text-white ${hashColor(
                                                vendor.fullName
                                            )}`}
                                        >
                                            {initials(
                                                vendor.fullName
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3">
                                    <Field
                                        label="Gender"
                                        value={
                                            vendor.student?.gender
                                        }
                                        isDark={isDark}
                                    />

                                    <Field
                                        label="Institution"
                                        value={
                                            vendor.student
                                                ?.institution
                                                ?.name
                                        }
                                        isDark={isDark}
                                    />

                                    <Field
                                        label="State"
                                        value={
                                            vendor.student?.state
                                                ?.name
                                        }
                                        isDark={isDark}
                                    />

                                    <Field
                                        label="Matric Number"
                                        value={
                                            vendor.student
                                                ?.matricNumber
                                        }
                                        isDark={isDark}
                                    />

                                    <Field
                                        label="Faculty"
                                        value={
                                            vendor.student?.faculty
                                        }
                                        isDark={isDark}
                                    />

                                    <Field
                                        label="Department"
                                        value={
                                            vendor.student
                                                ?.department
                                        }
                                        isDark={isDark}
                                    />

                                    <Field
                                        label="Level"
                                        value={
                                            vendor.student?.level
                                        }
                                        isDark={isDark}
                                    />

                                    <Field
                                        label="Residence"
                                        value={
                                            vendor.student
                                                ?.residence
                                        }
                                        isDark={isDark}
                                    />
                                </div>
                            </div>

                            <div
                                className={`rounded-lg p-4 ${isDark
                                    ? "bg-slate-900"
                                    : "bg-slate-50"
                                    }`}
                            >
                                <p
                                    className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}
                                >
                                    Address
                                </p>

                                <p
                                    className={`mt-2 text-sm ${strongText}`}
                                >
                                    {vendor.student?.address ||
                                        "No address provided"}
                                </p>
                            </div>
                        </Section>
                    </>
                )}

                {tab === "business" && (
                    <>
                        <Section
                            title="Business Information"
                            icon={Store}
                            isDark={isDark}
                        >
                            {vendor.business?.logo && (
                                <div className="mb-5">
                                    <img
                                        src={
                                            vendor.business.logo
                                        }
                                        alt={
                                            vendor.business
                                                ?.storeName ||
                                            "Business logo"
                                        }
                                        className="h-24 w-24 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                                    />
                                </div>
                            )}

                            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                                <Field
                                    label="Store Name"
                                    value={
                                        vendor.business
                                            ?.storeName
                                    }
                                    isDark={isDark}
                                />

                                <Field
                                    label="Business Type"
                                    value={
                                        vendor.business?.type
                                    }
                                    isDark={isDark}
                                />

                                <Field
                                    label="Facebook"
                                    value={
                                        vendor.business
                                            ?.socials?.facebook
                                    }
                                    isDark={isDark}
                                />

                                <Field
                                    label="Instagram"
                                    value={
                                        vendor.business
                                            ?.socials?.instagram
                                    }
                                    isDark={isDark}
                                />

                                <Field
                                    label="WhatsApp"
                                    value={
                                        vendor.business
                                            ?.socials?.whatsapp
                                    }
                                    isDark={isDark}
                                />

                                <Field
                                    label="TikTok"
                                    value={
                                        vendor.business
                                            ?.socials?.tiktok
                                    }
                                    isDark={isDark}
                                />
                            </dl>

                            <div
                                className={`mt-5 rounded-lg p-4 ${isDark
                                    ? "bg-slate-900"
                                    : "bg-slate-50"
                                    }`}
                            >
                                <p
                                    className={`text-xs font-semibold uppercase tracking-wider ${mutedText}`}
                                >
                                    Business Description
                                </p>

                                <p
                                    className={`mt-2 whitespace-pre-wrap text-sm leading-6 ${strongText}`}
                                >
                                    {vendor.business
                                        ?.description ||
                                        "No business description provided."}
                                </p>
                            </div>

                            {vendor.business?.banner && (
                                <div className="mt-5">
                                    <p
                                        className={`mb-2 text-xs font-semibold uppercase tracking-wider ${mutedText}`}
                                    >
                                        Store Banner
                                    </p>

                                    <img
                                        src={
                                            vendor.business.banner
                                        }
                                        alt="Store banner"
                                        className="max-h-72 w-full rounded-xl object-cover"
                                    />
                                </div>
                            )}
                        </Section>
                    </>
                )}

                {tab === "compliance" && (
                    <>
                        <Section
                            title="Verification Status"
                            icon={ShieldCheck}
                            isDark={isDark}
                        >
                            <div
                                className={`flex items-center justify-between rounded-lg p-4 ${isDark
                                    ? "bg-slate-900"
                                    : "bg-slate-50"
                                    }`}
                            >
                                <div>
                                    <p
                                        className={`text-sm font-semibold ${strongText}`}
                                    >
                                        Vendor Verification
                                    </p>

                                    <p
                                        className={`mt-1 text-xs ${mutedText}`}
                                    >
                                        Current onboarding
                                        verification status
                                    </p>
                                </div>

                                <Badge
                                    status={
                                        vendor.verificationStatus ||
                                        "pending"
                                    }
                                    isDark={isDark}
                                />
                            </div>
                        </Section>

                        <Section
                            title="Vendor Terms"
                            icon={CircleCheck}
                            isDark={isDark}
                        >
                            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                                <Field
                                    label="Vendor Terms"
                                    value={
                                        vendor.terms
                                            ?.acceptedVendorTerms
                                            ? "Accepted"
                                            : "Not Accepted"
                                    }
                                    isDark={isDark}
                                />

                                <Field
                                    label="Marketplace Policy"
                                    value={
                                        vendor.terms
                                            ?.acceptedMarketplacePolicy
                                            ? "Accepted"
                                            : "Not Accepted"
                                    }
                                    isDark={isDark}
                                />

                                <Field
                                    label="Fraud Policy"
                                    value={
                                        vendor.terms
                                            ?.acceptedFraudPolicy
                                            ? "Accepted"
                                            : "Not Accepted"
                                    }
                                    isDark={isDark}
                                />

                                <Field
                                    label="Accepted At"
                                    value={formatDateTime(
                                        vendor.terms
                                            ?.acceptedAt
                                    )}
                                    isDark={isDark}
                                />
                            </dl>
                        </Section>

                        <Section
                            title="Verification Decision History"
                            icon={Clock3}
                            isDark={isDark}
                        >
                            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                                <Field
                                    label="Status"
                                    value={
                                        vendor.verificationStatus
                                    }
                                    isDark={isDark}
                                />

                                <Field
                                    label="Approved At"
                                    value={formatDateTime(
                                        vendor.verificationApprovedAt
                                    )}
                                    isDark={isDark}
                                />

                                <Field
                                    label="Rejected At"
                                    value={formatDateTime(
                                        vendor.verificationRejectedAt
                                    )}
                                    isDark={isDark}
                                />

                                <Field
                                    label="Rejection Reason"
                                    value={
                                        vendor.verificationRejectionReason
                                    }
                                    isDark={isDark}
                                />
                            </dl>
                        </Section>
                    </>
                )}

                {tab === "financial" && (
                    <Section
                        title="Bank Details"
                        icon={FileCheck2}
                        isDark={isDark}
                    >
                        {vendor.bankDetails ? (
                            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                                <Field
                                    label="Bank Name"
                                    value={
                                        vendor.bankDetails
                                            ?.bankName
                                    }
                                    isDark={isDark}
                                />

                                <Field
                                    label="Account Name"
                                    value={
                                        vendor.bankDetails
                                            ?.accountName
                                    }
                                    isDark={isDark}
                                />

                                <Field
                                    label="Account Number"
                                    value={
                                        vendor.bankDetails
                                            ?.accountNumber
                                    }
                                    mono
                                    isDark={isDark}
                                />
                            </dl>
                        ) : (
                            <div
                                className={`rounded-lg border border-dashed p-8 text-center ${isDark
                                    ? "border-slate-700"
                                    : "border-slate-300"
                                    }`}
                            >
                                <FileCheck2
                                    className={`mx-auto h-8 w-8 ${isDark
                                        ? "text-slate-600"
                                        : "text-slate-400"
                                        }`}
                                />

                                <p
                                    className={`mt-2 text-sm font-semibold ${isDark
                                        ? "text-slate-300"
                                        : "text-slate-700"
                                        }`}
                                >
                                    No bank details found
                                </p>
                            </div>
                        )}
                    </Section>
                )}

                {tab === "docs" && (
                    <Section
                        title="Verification Documents"
                        icon={Paperclip}
                        isDark={isDark}
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            {documents.map((document) => (
                                <ImagePreview
                                    key={document.key}
                                    src={document.url}
                                    label={document.label}
                                    isDark={isDark}
                                />
                            ))}
                        </div>
                    </Section>
                )}
            </div>

            <div
                className={`flex flex-col-reverse items-center gap-3 rounded-b-2xl border-t px-6 py-4 sm:flex-row sm:justify-between ${isDark
                    ? "border-slate-700 bg-slate-800"
                    : "border-slate-200 bg-white"
                    }`}
            >
                <p
                    className={`text-xs ${isDark
                        ? "text-slate-500"
                        : "text-slate-400"
                        }`}
                >
                    Review the submitted information before
                    making a vendor verification decision.
                </p>

                {vendor.verificationStatus === "pending" ? (
                    <div className="flex w-full gap-3 sm:w-auto">
                        <button
                            type="button"
                            onClick={() =>
                                onDecide(
                                    vendor,
                                    "reject"
                                )
                            }
                            className="flex-1 rounded-lg border border-rose-200 bg-transparent px-5 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10 sm:flex-none"
                        >
                            Reject
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                onDecide(
                                    vendor,
                                    "approve"
                                )
                            }
                            className="flex-1 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:flex-none"
                        >
                            Approve Vendor
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={onClose}
                        className={`rounded-lg px-5 py-2.5 text-sm font-semibold ${isDark
                            ? "bg-white text-slate-900 hover:bg-slate-200"
                            : "bg-slate-900 text-white hover:bg-slate-800"
                            }`}
                    >
                        Close
                    </button>
                )}
            </div>
        </Modal>
    );
}

function ConfirmModal({
    request,
    onCancel,
    onConfirm,
    isDark,
}) {
    const [reason, setReason] = useState("");
    const [ack, setAck] = useState(false);
    const [touched, setTouched] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        setReason("");
        setAck(false);
        setTouched(false);
        setBusy(false);
    }, [
        request?.vendor?._id,
        request?.action,
    ]);

    if (!request) return null;

    const { vendor, action } = request;

    const isReject = action === "reject";

    const vendorName =
        vendor.business?.storeName ||
        vendor.fullName ||
        "Vendor";

    const trimmedReason = reason.trim();

    const reasonInvalid =
        isReject && trimmedReason.length < 10;

    const blocked =
        reasonInvalid || !ack || busy;

    const submit = async () => {
        setTouched(true);

        if (blocked) {
            return;
        }

        setBusy(true);

        try {
            await onConfirm(
                vendor,
                action,
                isReject ? trimmedReason : ""
            );
        } finally {
            setBusy(false);
        }
    };

    return (
        <Modal
            open={Boolean(request)}
            onClose={busy ? () => { } : onCancel}
            max="max-w-lg"
            isDark={isDark}
        >
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <div
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${
                            isReject
                                ? isDark
                                    ? "bg-rose-500/10 text-rose-400"
                                    : "bg-rose-100 text-rose-600"
                                : isDark
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-emerald-100 text-emerald-600"
                        }`}
                    >
                        {isReject ? (
                            <AlertTriangle className="h-5 w-5" />
                        ) : (
                            <Check className="h-5 w-5" />
                        )}
                    </div>

                    <div>
                        <h3
                            className={`text-lg font-bold ${
                                isDark
                                    ? "text-slate-100"
                                    : "text-slate-900"
                            }`}
                        >
                            {isReject
                                ? "Reject vendor application?"
                                : "Approve vendor onboarding?"}
                        </h3>

                        <p
                            className={`mt-1 text-sm ${
                                isDark
                                    ? "text-slate-400"
                                    : "text-slate-500"
                            }`}
                        >
                            You are about{" "}
                            <span
                                className={`font-semibold ${
                                    isReject
                                        ? "text-rose-500"
                                        : "text-emerald-500"
                                }`}
                            >
                                {isReject
                                    ? "reject"
                                    : "approve"}
                            </span>{" "}
                            <span
                                className={`font-semibold ${
                                    isDark
                                        ? "text-slate-200"
                                        : "text-slate-800"
                                }`}
                            >
                                {vendorName}
                            </span>
                            .
                        </p>
                    </div>
                </div>

                <div
                    className={`mt-5 rounded-xl p-4 ring-1 ${
                        isDark
                            ? "bg-slate-800 ring-slate-700"
                            : "bg-slate-50 ring-slate-200"
                    }`}
                >
                    <dl className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <dt
                                className={`text-xs ${
                                    isDark
                                        ? "text-slate-500"
                                        : "text-slate-400"
                                }`}
                            >
                                Vendor ID
                            </dt>

                            <dd
                                className={`font-medium ${
                                    isDark
                                        ? "text-slate-200"
                                        : "text-slate-800"
                                }`}
                            >
                                {vendor.serialNumber ||
                                    vendor._id}
                            </dd>
                        </div>

                        <div>
                            <dt
                                className={`text-xs ${
                                    isDark
                                        ? "text-slate-500"
                                        : "text-slate-400"
                                }`}
                            >
                                Email
                            </dt>

                            <dd
                                className={`truncate font-medium ${
                                    isDark
                                        ? "text-slate-200"
                                        : "text-slate-800"
                                }`}
                            >
                                {vendor.email}
                            </dd>
                        </div>

                        <div>
                            <dt
                                className={`text-xs ${
                                    isDark
                                        ? "text-slate-500"
                                        : "text-slate-400"
                                }`}
                            >
                                Institution
                            </dt>

                            <dd
                                className={`font-medium ${
                                    isDark
                                        ? "text-slate-200"
                                        : "text-slate-800"
                                }`}
                            >
                                {vendor.student?.institution?.name ||
                                    "—"}
                            </dd>
                        </div>

                        <div>
                            <dt
                                className={`text-xs ${
                                    isDark
                                        ? "text-slate-500"
                                        : "text-slate-400"
                                }`}
                            >
                                Status
                            </dt>

                            <dd
                                className={`font-medium capitalize ${
                                    isDark
                                        ? "text-slate-200"
                                        : "text-slate-800"
                                }`}
                            >
                                {vendor.verificationStatus ||
                                    "pending"}
                            </dd>
                        </div>
                    </dl>
                </div>

                {isReject && (
                    <div className="mt-5">
                        <label
                            className={`mb-1.5 block text-sm font-semibold ${
                                isDark
                                    ? "text-slate-300"
                                    : "text-slate-700"
                            }`}
                        >
                            Reason for rejection{" "}
                            <span className="text-rose-500">
                                *
                            </span>
                        </label>

                        <textarea
                            rows="4"
                            value={reason}
                            maxLength={400}
                            onChange={(event) =>
                                setReason(
                                    event.target.value
                                )
                            }
                            placeholder="Explain why this vendor application is being rejected..."
                            className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                                isDark
                                    ? "border-slate-700 bg-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
                                    : "border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-100"
                            }`}
                        />

                        <div className="mt-1 flex justify-between text-xs">
                            <span className="text-rose-500">
                                {touched &&
                                    reasonInvalid &&
                                    "Please provide at least 10 characters."}
                            </span>

                            <span
                                className={
                                    isDark
                                        ? "text-slate-600"
                                        : "text-slate-400"
                                }
                            >
                                {reason.length}/400
                            </span>
                        </div>
                    </div>
                )}

                <label
                    className={`mt-5 flex cursor-pointer items-start gap-2.5 rounded-lg border p-3 transition ${
                        isDark
                            ? "border-slate-700 hover:bg-slate-800"
                            : "border-slate-200 hover:bg-slate-50"
                    }`}
                >
                    <input
                        type="checkbox"
                        checked={ack}
                        onChange={(event) =>
                            setAck(
                                event.target.checked
                            )
                        }
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />

                    <span
                        className={`text-sm ${
                            isDark
                                ? "text-slate-400"
                                : "text-slate-600"
                        }`}
                    >
                        I confirm that I have reviewed the
                        onboarding details and authorise
                        this decision as{" "}
                        <span
                            className={`font-semibold ${
                                isDark
                                    ? "text-slate-200"
                                    : "text-slate-800"
                            }`}
                        >
                            Founder
                        </span>
                        .
                    </span>
                </label>

                {touched && !ack && (
                    <p className="mt-1 text-xs text-rose-500">
                        Confirmation is required to
                        continue.
                    </p>
                )}
            </div>

            <div
                className={`flex flex-col-reverse gap-3 border-t px-6 py-4 sm:flex-row sm:justify-end ${
                    isDark
                        ? "border-slate-700 bg-slate-800"
                        : "border-slate-200 bg-slate-50"
                }`}
            >
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={busy}
                    className={`rounded-lg border px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
                        isDark
                            ? "border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-700"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={submit}
                    disabled={blocked}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed ${
                        isReject
                            ? "bg-rose-600 hover:bg-rose-700"
                            : "bg-emerald-600 hover:bg-emerald-700"
                    } ${
                        blocked
                            ? "cursor-not-allowed opacity-60"
                            : ""
                    }`}
                >
                    {busy && (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    )}

                    {busy
                        ? "Submitting..."
                        : isReject
                            ? "Confirm Rejection"
                            : "Confirm Approval"}
                </button>
            </div>
        </Modal>
    );
}


const VendorApproval = () => {
    const { isDark } = useTheme();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] =
        useState(false);

    const [filter, setFilter] = useState("pending");
    const [query, setQuery] = useState("");
    const [detail, setDetail] = useState(null);
    const [confirmReq, setConfirmReq] =
        useState(null);


    const getPendingVendorApprovals =
        useCallback(async () => {
            try {
                setLoading(true);

                const response = await apiClient.get(
                    "/founder/vendors/approvals"
                );

                const data =
                    response?.data?.data ??
                    response?.data;

                setVendors(
                    Array.isArray(data)
                        ? data
                        : []
                );
            } catch (error) {
                console.error(
                    "Failed to get pending vendor approvals:",
                    error
                );

                showToast(
                    error?.response?.data?.message ||
                    "Failed to load vendor approval requests.",
                    "error"
                );

                setVendors([]);
            } finally {
                setLoading(false);
            }
        }, [showToast]);


    useEffect(() => {
        getPendingVendorApprovals();
    }, [getPendingVendorApprovals]);


    const getVendorDetails = async (vendor) => {
        try {
            setDetailLoading(true);

            const response = await apiClient.get(
                `/founder/vendors/${vendor._id}/onboarding`
            );

            const data =
                response?.data?.data ??
                response?.data;

            if (!data) {
                throw new Error(
                    "Vendor details were not returned."
                );
            }

            setDetail(data);
        } catch (error) {
            console.error(
                "Failed to get vendor onboarding details:",
                error
            );

            showToast(
                error?.response?.data?.message ||
                "Failed to load vendor onboarding details.",
                "error"
            );
        } finally {
            setDetailLoading(false);
        }
    };


    const approveVendor = async (vendor) => {
        try {
            const response = await apiClient.patch(
                `/founder/vendors/${vendor._id}/approve`
            );

            showToast(
                response?.data?.message ||
                `${vendor.fullName} has been approved.`,
                "success"
            );

            setConfirmReq(null);
            setDetail(null);

            await getPendingVendorApprovals();
        } catch (error) {
            console.error(
                "Failed to approve vendor:",
                error
            );

            showToast(
                error?.response?.data?.message ||
                "Failed to approve vendor.",
                "error"
            );

            throw error;
        }
    };


    const rejectVendor = async (
        vendor,
        reason
    ) => {
        try {
            const response = await apiClient.patch(
                `/founder/vendors/${vendor._id}/reject`,
                {
                    rejectionReason: reason,
                }
            );

            showToast(
                response?.data?.message ||
                `${vendor.fullName} has been rejected.`,
                "warning"
            );

            setConfirmReq(null);
            setDetail(null);

            await getPendingVendorApprovals();
        } catch (error) {
            console.error(
                "Failed to reject vendor:",
                error
            );

            showToast(
                error?.response?.data?.message ||
                "Failed to reject vendor.",
                "error"
            );

            throw error;
        }
    };


    const counts = useMemo(
        () => ({
            all: vendors.length,

            pending: vendors.filter(
                (vendor) =>
                    vendor.verificationStatus ===
                    "pending"
            ).length,

            approved: vendors.filter(
                (vendor) =>
                    vendor.verificationStatus ===
                    "approved"
            ).length,

            rejected: vendors.filter(
                (vendor) =>
                    vendor.verificationStatus ===
                    "rejected"
            ).length,
        }),
        [vendors]
    );


    const list = useMemo(() => {
        const search =
            query.toLowerCase().trim();

        return vendors.filter((vendor) => {
            const status =
                vendor.verificationStatus ||
                "pending";

            const matchesFilter =
                filter === "all" ||
                status === filter;

            const searchable = [
                vendor.fullName,
                vendor.email,
                vendor.phoneNo,
                vendor.serialNumber,
                vendor._id,
                vendor.business?.storeName,
                vendor.business?.type,
                vendor.student?.matricNumber,
                vendor.student?.department,
                vendor.student?.faculty,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return (
                matchesFilter &&
                searchable.includes(search)
            );
        });
    }, [vendors, filter, query]);


    const openConfirm = useCallback(
        (vendor, action) => {
            setConfirmReq({
                vendor,
                action,
            });
        },
        []
    );


    const handleConfirm = async (
        vendor,
        action,
        reason
    ) => {
        if (action === "approve") {
            await approveVendor(vendor);
            return;
        }

        if (action === "reject") {
            await rejectVendor(
                vendor,
                reason
            );
        }
    };


    return (
        <div
            className={`min-h-screen transition-colors duration-200 ${isDark
                ? "bg-slate-950"
                : "bg-slate-100"
                }`}
        >
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

                <div className="mb-1 text-xs font-medium text-slate-400">
                    <button
                        onClick={() =>
                            navigate(-1)
                        }
                        className={`group mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors ${isDark
                            ? "bg-zinc-900/70 text-zinc-300 ring-1 ring-white/10 hover:bg-zinc-800 hover:text-green-500"
                            : "bg-white/70 text-zinc-600 ring-1 ring-zinc-900/5 hover:bg-white hover:text-green-500"
                            }`}
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />

                        Back
                    </button>
                </div>

                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1
                            className={`text-2xl font-bold tracking-tight sm:text-3xl ${isDark
                                ? "text-white"
                                : "text-slate-900"
                                }`}
                        >
                            Vendor Onboarding Approvals
                        </h1>

                        <p
                            className={`mt-1 text-sm ${isDark
                                ? "text-slate-400"
                                : "text-slate-500"
                                }`}
                        >
                            Review submitted vendor
                            onboarding requests and
                            record your approval or
                            rejection decision.
                        </p>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search
                            className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark
                                ? "text-slate-500"
                                : "text-slate-400"
                                }`}
                        />

                        <input
                            value={query}
                            onChange={(event) =>
                                setQuery(
                                    event.target.value
                                )
                            }
                            placeholder="Search vendor..."
                            className={`w-full rounded-lg border py-2.5 pl-9 pr-3 text-sm outline-none transition ${isDark
                                ? "border-slate-700 bg-slate-900 text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                : "border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                }`}
                        />
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[
                        [
                            "Awaiting review",
                            counts.pending,
                            "text-amber-500",
                            LoaderCircle,
                        ],
                        [
                            "Approved",
                            counts.approved,
                            "text-emerald-500",
                            CheckCircle2,
                        ],
                        [
                            "Rejected",
                            counts.rejected,
                            "text-rose-500",
                            XCircle,
                        ],
                        [
                            "Total applications",
                            counts.all,
                            "text-indigo-500",
                            FileCheck2,
                        ],
                    ].map(
                        ([
                            label,
                            value,
                            color,
                            Icon,
                        ]) => (
                            <div
                                key={label}
                                className={`rounded-xl border p-4 shadow-sm transition-colors ${isDark
                                    ? "border-slate-800 bg-slate-900"
                                    : "border-slate-200 bg-white"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <p
                                        className={`text-xs font-semibold uppercase tracking-wider ${isDark
                                            ? "text-slate-500"
                                            : "text-slate-400"
                                            }`}
                                    >
                                        {label}
                                    </p>

                                    <Icon
                                        className={`h-5 w-5 ${color}`}
                                    />
                                </div>

                                <p
                                    className={`mt-2 text-3xl font-bold ${color}`}
                                >
                                    {value}
                                </p>
                            </div>
                        )
                    )}
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                    {[
                        "all",
                        "pending",
                        "approved",
                        "rejected",
                    ].map((key) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() =>
                                setFilter(key)
                            }
                            className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${filter === key
                                ? isDark
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "bg-slate-900 text-white shadow-sm"
                                : isDark
                                    ? "bg-slate-900 text-slate-300 ring-1 ring-slate-800 hover:bg-slate-800"
                                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            {key}

                            <span className="ml-1 opacity-60">
                                {counts[key]}
                            </span>
                        </button>
                    ))}
                </div>

                <div
                    className={`overflow-hidden rounded-xl border shadow-sm ${isDark
                        ? "border-slate-800 bg-slate-900"
                        : "border-slate-200 bg-white"
                        }`}
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead
                                className={
                                    isDark
                                        ? "bg-slate-800/60"
                                        : "bg-slate-50"
                                }
                            >
                                <tr
                                    className={`text-left text-[11px] font-bold uppercase tracking-wider ${isDark
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                        }`}
                                >
                                    <th className="px-5 py-3">
                                        Vendor
                                    </th>

                                    <th className="px-5 py-3">
                                        Business
                                    </th>

                                    <th className="hidden px-5 py-3 md:table-cell">
                                        Submitted
                                    </th>

                                    <th className="px-5 py-3">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody
                                className={`divide-y ${isDark
                                    ? "divide-slate-800"
                                    : "divide-slate-100"
                                    }`}
                            >
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-5 py-16 text-center"
                                        >
                                            <LoaderCircle
                                                className={`mx-auto h-7 w-7 animate-spin ${isDark
                                                    ? "text-slate-500"
                                                    : "text-slate-400"
                                                    }`}
                                            />

                                            <p
                                                className={`mt-3 text-sm ${isDark
                                                    ? "text-slate-400"
                                                    : "text-slate-500"
                                                    }`}
                                            >
                                                Loading vendor
                                                applications...
                                            </p>
                                        </td>
                                    </tr>
                                ) : list.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-5 py-16 text-center"
                                        >
                                            <FolderSearch
                                                className={`mx-auto h-10 w-10 ${isDark
                                                    ? "text-slate-700"
                                                    : "text-slate-300"
                                                    }`}
                                            />

                                            <p
                                                className={`mt-3 text-sm font-semibold ${isDark
                                                    ? "text-slate-300"
                                                    : "text-slate-700"
                                                    }`}
                                            >
                                                No vendor
                                                applications
                                                found
                                            </p>

                                            <p
                                                className={`text-xs ${isDark
                                                    ? "text-slate-600"
                                                    : "text-slate-400"
                                                    }`}
                                            >
                                                Try a different
                                                filter or search
                                                term.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    list.map(
                                        (vendor) => {
                                            const vendorName =
                                                vendor.fullName ||
                                                "Unknown Vendor";

                                            const businessName =
                                                vendor
                                                    .business
                                                    ?.storeName ||
                                                "No store name";

                                            const status =
                                                vendor.verificationStatus ||
                                                "pending";

                                            return (
                                                <tr
                                                    key={
                                                        vendor._id
                                                    }
                                                    className={`group transition ${isDark
                                                        ? "hover:bg-slate-800/60"
                                                        : "hover:bg-slate-50"
                                                        }`}
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-xs font-bold text-white ${hashColor(
                                                                    vendorName
                                                                )}`}
                                                            >
                                                                {initials(
                                                                    vendorName
                                                                )}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        getVendorDetails(
                                                                            vendor
                                                                        )
                                                                    }
                                                                    className={`block truncate text-sm font-semibold hover:underline ${isDark
                                                                        ? "text-slate-100 hover:text-indigo-400"
                                                                        : "text-slate-900 hover:text-indigo-600"
                                                                        }`}
                                                                >
                                                                    {
                                                                        vendorName
                                                                    }
                                                                </button>

                                                                <p
                                                                    className={`truncate text-xs ${isDark
                                                                        ? "text-slate-600"
                                                                        : "text-slate-400"
                                                                        }`}
                                                                >
                                                                    {
                                                                        vendor.serialNumber
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <p
                                                            className={`text-sm font-medium ${isDark
                                                                ? "text-slate-300"
                                                                : "text-slate-700"
                                                                }`}
                                                        >
                                                            {
                                                                businessName
                                                            }
                                                        </p>

                                                        <p
                                                            className={`text-xs capitalize ${isDark
                                                                ? "text-slate-600"
                                                                : "text-slate-400"
                                                                }`}
                                                        >
                                                            {vendor
                                                                .business
                                                                ?.type ||
                                                                "No type"}
                                                        </p>
                                                    </td>

                                                    <td
                                                        className={`hidden px-5 py-4 text-sm md:table-cell ${isDark
                                                            ? "text-slate-400"
                                                            : "text-slate-600"
                                                            }`}
                                                    >
                                                        {formatDate(
                                                            vendor.onboardingSentAt
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <Badge
                                                            status={
                                                                status
                                                            }
                                                            isDark={
                                                                isDark
                                                            }
                                                        />
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    getVendorDetails(
                                                                        vendor
                                                                    )
                                                                }
                                                                disabled={
                                                                    detailLoading
                                                                }
                                                                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${isDark
                                                                    ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
                                                                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                                                                    }`}
                                                            >
                                                                {detailLoading
                                                                    ? "Loading..."
                                                                    : "View details"}
                                                            </button>

                                                            {status ===
                                                                "pending" && (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                openConfirm(
                                                                                    vendor,
                                                                                    "reject"
                                                                                )
                                                                            }
                                                                            className="rounded-lg border border-rose-500/30 bg-transparent px-3 py-1.5 text-xs font-semibold text-rose-500 transition hover:bg-rose-500/10"
                                                                        >
                                                                            Reject
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                openConfirm(
                                                                                    vendor,
                                                                                    "approve"
                                                                                )
                                                                            }
                                                                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                                                                        >
                                                                            Approve
                                                                        </button>
                                                                    </>
                                                                )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <DetailsModal
                vendor={detail}
                onClose={() =>
                    setDetail(null)
                }
                onDecide={openConfirm}
                isDark={isDark}
            />

            <ConfirmModal
                request={confirmReq}
                onCancel={() =>
                    setConfirmReq(null)
                }
                onConfirm={handleConfirm}
                isDark={isDark}
            />
        </div>
    );
};


export default VendorApproval;