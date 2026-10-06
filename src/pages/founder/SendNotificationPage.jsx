import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/apiClient';
import { getMessage } from '../../utils/apiResponse';
import { useNavigate } from 'react-router-dom';

import {
    ArrowLeft,
    Send,
    Bell,
    Plus,
    Trash2,
    ShoppingBag,
    LoaderCircle,
    Users,
    UserRound,
    Store,
} from 'lucide-react';

const SendNotificationPage = () => {
    const { isDark } = useTheme();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [recipientGroup, setRecipientGroup] =
        useState('all');

    const [recipients, setRecipients] = useState([
        {
            identifier: '',
            role: 'buyer',
        },
    ]);

    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const [notificationType, setNotificationType] =
        useState('FOUNDER_ANNOUNCEMENT');

    const [targetPage, setTargetPage] =
        useState('notifications');

    const [loading, setLoading] = useState(false);

    const containerBg = isDark
        ? 'bg-gray-900 text-white'
        : 'bg-gray-50 text-gray-900';

    const cardBg = isDark
        ? 'bg-gray-800/80 border-gray-700'
        : 'bg-white border-gray-200';

    const inputBg = isDark
        ? 'bg-gray-800/80 border-gray-500 text-white placeholder-zinc-500 focus:border-green-500'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-green-600';

    const labelColor = isDark
        ? 'text-gray-300'
        : 'text-gray-700';

    const addRecipient = () => {
        setRecipients((prev) => [
            ...prev,
            {
                identifier: '',
                role: 'buyer',
            },
        ]);
    };

    const removeRecipient = (index) => {
        setRecipients((prev) => {
            if (prev.length === 1) {
                return prev;
            }

            return prev.filter((_, i) => i !== index);
        });
    };

    const updateRecipient = (
        index,
        field,
        value
    ) => {
        setRecipients((prev) =>
            prev.map((recipient, i) =>
                i === index
                    ? {
                        ...recipient,
                        [field]: value,
                    }
                    : recipient
            )
        );
    };

    const handleRecipientGroupChange = (
        value
    ) => {
        setRecipientGroup(value);

        if (value !== 'specific') {
            setRecipients([
                {
                    identifier: '',
                    role: 'buyer',
                },
            ]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            showToast(
                'Please provide a notification title.',
                'error'
            );
            return;
        }

        if (!message.trim()) {
            showToast(
                'Please provide a notification message.',
                'error'
            );
            return;
        }

        let uniqueRecipients = [];

        if (recipientGroup === 'specific') {
            const cleanedRecipients =
                recipients.map((recipient) => ({
                    identifier:
                        recipient.identifier.trim(),
                    role:
                        recipient.role.toLowerCase(),
                }));

            const invalidRecipient =
                cleanedRecipients.some(
                    (recipient) =>
                        !recipient.identifier ||
                        !['buyer', 'vendor'].includes(
                            recipient.role
                        )
                );

            if (invalidRecipient) {
                showToast(
                    'Every recipient must have an identifier and a valid role.',
                    'error'
                );
                return;
            }

            uniqueRecipients = [
                ...new Map(
                    cleanedRecipients.map(
                        (recipient) => [
                            `${recipient.role}:${recipient.identifier.toLowerCase()}`,
                            recipient,
                        ]
                    )
                ).values(),
            ];
        }

        try {
            setLoading(true);

            const payload = {
                recipientGroup,

                recipients: uniqueRecipients,

                type: notificationType,

                title: title.trim(),

                message: message.trim(),

                metadata: {
                    targetPage:
                        targetPage.trim() ||
                        'notifications',
                },
            };

            const response = await apiClient.post('/founder/notifications/send', payload);

            const result = response?.data?.data;

            const sentCount = result?.sentCount ?? 0;

            const failedCount = result?.failedCount ?? 0;

            const totalRecipients = result?.totalRecipients ?? 0;


            if (failedCount > 0) {
                showToast(
                    `Notification processed. ${sentCount} sent, ${failedCount} failed.`,
                    'error'
                );
            } else {
                showToast(
                    `Notification sent to ${totalRecipients} recipient${totalRecipients === 1
                        ? ''
                        : 's'
                    }.`,
                    'success'
                );
            }

            setRecipientGroup('all');

            setRecipients([
                {
                    identifier: '',
                    role: 'buyer',
                },
            ]);

            setTitle('');

            setMessage('');

            setNotificationType(
                'FOUNDER_ANNOUNCEMENT'
            );

            setTargetPage('notifications');

        } catch (error) {
            showToast(
                getMessage(
                    error,
                    'Failed to send notification.'
                ),
                'error'
            );
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div
            className={`min-h-screen p-6 md:p-10 ${containerBg}`}
        >
            <div className="max-w-3xl mx-auto">

                {/* Back Button */}

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className={`group inline-flex items-center gap-2 text-sm transition-colors mb-6 rounded-full px-3 py-1.5 ${isDark
                        ? 'bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 ring-1 ring-white/10'
                        : 'bg-white/70 hover:bg-white text-zinc-600 ring-1 ring-zinc-900/5 shadow-sm'
                        }`}
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />

                    Back
                </button>

                {/* Header */}

                <div className="mb-8">
                    <div className="flex items-center gap-3">

                        <div className="p-3 bg-green-500/10 text-green-500 rounded-2xl">
                            <Bell className="w-6 h-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Send Notifications
                            </h1>

                            <p
                                className={`text-sm mt-0.5 ${isDark
                                    ? 'text-zinc-400'
                                    : 'text-gray-500'
                                    }`}
                            >
                                Send announcements, updates, or
                                alerts to CampusTrade users.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Form */}

                <div
                    className={`border rounded-2xl p-6 md:p-8 shadow-sm ${cardBg}`}
                >
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* Send To */}

                        <div>

                            <div className="mb-2.5">

                                <label
                                    className={`block text-xs font-semibold uppercase tracking-wider ${labelColor}`}
                                >
                                    Send To
                                </label>

                                <p
                                    className={`text-xs mt-1 ${isDark
                                        ? 'text-zinc-500'
                                        : 'text-gray-500'
                                        }`}
                                >
                                    Choose who should receive this
                                    notification.
                                </p>

                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                {/* All Users */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRecipientGroupChange(
                                            'all'
                                        )
                                    }
                                    className={`text-left p-4 rounded-xl border transition-all ${recipientGroup === 'all'
                                        ? isDark
                                            ? 'border-green-500 bg-green-500/10'
                                            : 'border-green-500 bg-green-50'
                                        : isDark
                                            ? 'border-zinc-700 bg-zinc-900/40 hover:border-zinc-600'
                                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">

                                        <div
                                            className={`p-2 rounded-lg ${recipientGroup === 'all'
                                                ? 'bg-green-500/10 text-green-500'
                                                : isDark
                                                    ? 'bg-zinc-800 text-zinc-400'
                                                    : 'bg-gray-100 text-gray-500'
                                                }`}
                                        >
                                            <Users className="w-5 h-5" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">
                                                All Users
                                            </p>

                                            <p
                                                className={`text-xs mt-1 ${isDark
                                                    ? 'text-zinc-500'
                                                    : 'text-gray-500'
                                                    }`}
                                            >
                                                Buyers and vendors
                                            </p>
                                        </div>

                                    </div>
                                </button>

                                {/* All Buyers */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRecipientGroupChange(
                                            'buyers'
                                        )
                                    }
                                    className={`text-left p-4 rounded-xl border transition-all ${recipientGroup === 'buyers'
                                        ? isDark
                                            ? 'border-green-500 bg-green-500/10'
                                            : 'border-green-500 bg-green-50'
                                        : isDark
                                            ? 'border-zinc-700 bg-zinc-900/40 hover:border-zinc-600'
                                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">

                                        <div
                                            className={`p-2 rounded-lg ${recipientGroup === 'buyers'
                                                ? 'bg-green-500/10 text-green-500'
                                                : isDark
                                                    ? 'bg-zinc-800 text-zinc-400'
                                                    : 'bg-gray-100 text-gray-500'
                                                }`}
                                        >
                                            <UserRound className="w-5 h-5" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">
                                                All Buyers
                                            </p>

                                            <p
                                                className={`text-xs mt-1 ${isDark
                                                    ? 'text-zinc-500'
                                                    : 'text-gray-500'
                                                    }`}
                                            >
                                                Buyers only
                                            </p>
                                        </div>

                                    </div>
                                </button>

                                {/* All Vendors */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRecipientGroupChange(
                                            'vendors'
                                        )
                                    }
                                    className={`text-left p-4 rounded-xl border transition-all ${recipientGroup === 'vendors'
                                        ? isDark
                                            ? 'border-green-500 bg-green-500/10'
                                            : 'border-green-500 bg-green-50'
                                        : isDark
                                            ? 'border-zinc-700 bg-zinc-900/40 hover:border-zinc-600'
                                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">

                                        <div
                                            className={`p-2 rounded-lg ${recipientGroup === 'vendors'
                                                ? 'bg-green-500/10 text-green-500'
                                                : isDark
                                                    ? 'bg-zinc-800 text-zinc-400'
                                                    : 'bg-gray-100 text-gray-500'
                                                }`}
                                        >
                                            <Store className="w-5 h-5" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">
                                                All Vendors
                                            </p>

                                            <p
                                                className={`text-xs mt-1 ${isDark
                                                    ? 'text-zinc-500'
                                                    : 'text-gray-500'
                                                    }`}
                                            >
                                                Vendors only
                                            </p>
                                        </div>

                                    </div>
                                </button>

                                {/* Specific Users */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRecipientGroupChange(
                                            'specific'
                                        )
                                    }
                                    className={`text-left p-4 rounded-xl border transition-all ${recipientGroup === 'specific'
                                        ? isDark
                                            ? 'border-green-500 bg-green-500/10'
                                            : 'border-green-500 bg-green-50'
                                        : isDark
                                            ? 'border-zinc-700 bg-zinc-900/40 hover:border-zinc-600'
                                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">

                                        <div
                                            className={`p-2 rounded-lg ${recipientGroup === 'specific'
                                                ? 'bg-green-500/10 text-green-500'
                                                : isDark
                                                    ? 'bg-zinc-800 text-zinc-400'
                                                    : 'bg-gray-100 text-gray-500'
                                                }`}
                                        >
                                            <ShoppingBag className="w-5 h-5" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">
                                                Specific Users
                                            </p>

                                            <p
                                                className={`text-xs mt-1 ${isDark
                                                    ? 'text-zinc-500'
                                                    : 'text-gray-500'
                                                    }`}
                                            >
                                                Choose individual users
                                            </p>
                                        </div>

                                    </div>
                                </button>

                            </div>

                        </div>

                        {/* Specific Recipients */}

                        {recipientGroup === 'specific' && (
                            <div>

                                <div className="flex items-center justify-between mb-2.5">

                                    <div>
                                        <label
                                            className={`block text-xs font-semibold uppercase tracking-wider ${labelColor}`}
                                        >
                                            Specific Recipients
                                        </label>

                                        <p
                                            className={`text-xs mt-1 ${isDark
                                                ? 'text-zinc-500'
                                                : 'text-gray-500'
                                                }`}
                                        >
                                            Enter the user's MongoDB
                                            ID, email, or serial number.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addRecipient}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />

                                        Add Recipient
                                    </button>

                                </div>

                                <div className="space-y-3">

                                    {recipients.map(
                                        (recipient, index) => (
                                            <div
                                                key={`${index}-${recipient.role}`}
                                                className={`flex flex-col sm:flex-row gap-3 p-3 rounded-xl border ${isDark
                                                    ? 'border-zinc-700 bg-zinc-900/40'
                                                    : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            >

                                                {/* Role */}

                                                <div className="sm:w-40">

                                                    <label
                                                        className={`block text-xs mb-1.5 ${isDark
                                                            ? 'text-zinc-400'
                                                            : 'text-gray-500'
                                                            }`}
                                                    >
                                                        User Type
                                                    </label>

                                                    <select
                                                        value={
                                                            recipient.role
                                                        }
                                                        onChange={(e) =>
                                                            updateRecipient(
                                                                index,
                                                                'role',
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all ${inputBg}`}
                                                    >
                                                        <option value="buyer">
                                                            Buyer
                                                        </option>

                                                        <option value="vendor">
                                                            Vendor
                                                        </option>
                                                    </select>

                                                </div>

                                                {/* Identifier */}

                                                <div className="flex-1">

                                                    <label
                                                        className={`block text-xs mb-1.5 ${isDark
                                                            ? 'text-zinc-400'
                                                            : 'text-gray-500'
                                                            }`}
                                                    >
                                                        Recipient Identifier
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            recipient.identifier
                                                        }
                                                        onChange={(e) =>
                                                            updateRecipient(
                                                                index,
                                                                'identifier',
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="MongoDB ID, email, or serial number"
                                                        className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all ${inputBg}`}
                                                    />

                                                </div>

                                                {/* Remove */}

                                                <div className="flex items-end">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeRecipient(
                                                                index
                                                            )
                                                        }
                                                        disabled={
                                                            recipients.length ===
                                                            1
                                                        }
                                                        className={`p-2.5 rounded-lg transition-colors ${recipients.length ===
                                                            1
                                                            ? 'opacity-30 cursor-not-allowed'
                                                            : isDark
                                                                ? 'text-red-400 hover:bg-red-500/10'
                                                                : 'text-red-500 hover:bg-red-50'
                                                            }`}
                                                        title="Remove recipient"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>

                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>

                                <div
                                    className={`mt-3 flex items-start gap-2 text-xs ${isDark
                                        ? 'text-zinc-500'
                                        : 'text-gray-500'
                                        }`}
                                >
                                    <ShoppingBag className="w-4 h-4 mt-0.5 shrink-0" />

                                    <p>
                                        The identifier can be a MongoDB
                                        ID, email, or serial number. The
                                        selected user type determines
                                        which collection is searched.
                                    </p>
                                </div>

                            </div>
                        )}

                        {/* Notification Type + Target Page */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Notification Type */}

                            <div>

                                <label
                                    className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${labelColor}`}
                                >
                                    Notification Type
                                </label>

                                <select
                                    value={notificationType}
                                    onChange={(e) =>
                                        setNotificationType(
                                            e.target.value
                                        )
                                    }
                                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${inputBg}`}
                                >
                                    <option value="FOUNDER_ANNOUNCEMENT">
                                        Announcement
                                    </option>

                                    <option value="SYSTEM_UPDATE">
                                        System Update
                                    </option>

                                    <option value="SECURITY_ALERT">
                                        Security Alert
                                    </option>

                                    <option value="PROMOTION">
                                        Promotion / Offer
                                    </option>
                                </select>

                            </div>

                            {/* Target Page */}

                            <div>

                                <label
                                    className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${labelColor}`}
                                >
                                    Target App Page
                                </label>

                                <input
                                    type="text"
                                    value={targetPage}
                                    onChange={(e) =>
                                        setTargetPage(
                                            e.target.value
                                        )
                                    }
                                    placeholder="notifications"
                                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${inputBg}`}
                                />

                            </div>

                        </div>

                        {/* Title */}

                        <div>

                            <label
                                className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${labelColor}`}
                            >
                                Notification Title
                            </label>

                            <input
                                type="text"
                                required
                                maxLength={120}
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                placeholder="e.g. CampusTrade Update"
                                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${inputBg}`}
                            />

                            <p
                                className={`text-xs mt-1.5 text-right ${isDark
                                    ? 'text-zinc-500'
                                    : 'text-gray-400'
                                    }`}
                            >
                                {title.length}/120
                            </p>

                        </div>

                        {/* Message */}

                        <div>

                            <label
                                className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${labelColor}`}
                            >
                                Message
                            </label>

                            <textarea
                                required
                                rows={5}
                                maxLength={1000}
                                value={message}
                                onChange={(e) =>
                                    setMessage(
                                        e.target.value
                                    )
                                }
                                placeholder="Write your notification message here..."
                                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-none ${inputBg}`}
                            />

                            <p
                                className={`text-xs mt-1.5 text-right ${isDark
                                    ? 'text-zinc-500'
                                    : 'text-gray-400'
                                    }`}
                            >
                                {message.length}/1000
                            </p>

                        </div>

                        {/* Information */}

                        <div
                            className={`rounded-xl p-4 border ${isDark
                                ? 'border-zinc-700 bg-zinc-900/50'
                                : 'border-gray-200 bg-gray-50'
                                }`}
                        >
                            <div className="flex gap-3">

                                <Bell
                                    className={`w-5 h-5 shrink-0 ${isDark
                                        ? 'text-green-400'
                                        : 'text-green-600'
                                        }`}
                                />

                                <div>

                                    <p
                                        className={`text-sm font-medium ${isDark
                                            ? 'text-zinc-200'
                                            : 'text-gray-800'
                                            }`}
                                    >
                                        Notification delivery
                                    </p>

                                    <p
                                        className={`text-xs mt-1 leading-relaxed ${isDark
                                            ? 'text-zinc-500'
                                            : 'text-gray-500'
                                            }`}
                                    >
                                        The notification will appear
                                        in the recipient's in-app
                                        notifications. Email delivery
                                        follows the recipient's
                                        notification preference.
                                    </p>

                                </div>

                            </div>
                        </div>

                        {/* Submit */}

                        <div className="pt-2 flex items-center justify-end">

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-medium text-sm rounded-xl transition-all shadow-sm shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >

                                {loading ? (
                                    <>
                                        <LoaderCircle className="w-4 h-4 animate-spin" />

                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />

                                        Send Notification
                                    </>
                                )}

                            </button>

                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default SendNotificationPage;
