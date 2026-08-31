import React, { useEffect, useState } from "react";
import AccountSection from "../../components/settings/AccountSection";
import AccountModals from "../../components/settings/modals/AccountModals";
import { useTheme } from "../../context/ThemeContext";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationSection from "../../components/settings/NotificationSection";
import DangerZoneSection from "../../components/settings/DangerZoneSection";
import DangerZoneModal from "../../components/settings/modals/DangerZoneModal";
import SecurityModals from "../../components/settings/modals/SecurityModals";
import SecuritySection from "../../components/settings/SecuritySection";
import apiClient from "../../api/apiClient";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../context/ToastContext";
import { setUser, logout } from "../../store/authSlice";
import { getMessage } from "../../utils/apiResponse";

export default function Settings() {
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { showToast } = useToast();

    const [activeModal, setActiveModal] = useState(null);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

    const [loginHistory, setLoginHistory] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [activeSessions, setActiveSessions] = useState([]);
    const [activeDevices, setActiveDevices] = useState([]);

    const [loginHistoryLoading, setLoginHistoryLoading] = useState(false);
    const [loadingActiveDevice, setLoadingActiveDevice] = useState(false);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const [loadingActivities, setLoadingActivities] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);

    const [notificationPreference, setNotificationPreference] = useState(
        user?.preferences?.notificationPreference || ""
    );

    const [promotionalMessages, setPromotionalMessages] = useState(
        user?.preferences?.promotionalMessages ?? false
    );

    const [notificationLoading, setNotificationLoading] = useState(false);
    const [promotionalLoading, setPromotionalLoading] = useState(false);

    const [loading, setLoading] = useState({
        suspend: false,
        reactivate: false,
        delete: false,
    });

    const isSuspended = user?.accountStatus === "suspended";

    const closeModal = () => setActiveModal(null);

    const handlePasswordSubmit = async (values) => {
        try {
            const payload = {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            };

            const { data } = await apiClient.put(
                "/auth/settings/change-password",
                payload
            );

            showToast(getMessage(data), "success");
        } catch (error) {
            showToast(
                getMessage(error, "Failed to change password."),
                "error"
            );

            throw error;
        }
    };

    const handlePhoneSubmit = async (values) => {
        console.log("Phone submit", values);
    };

    const handleEmailSubmit = async (values) => {
        try {
            const { data } = await apiClient.put(
                "/auth/settings/change-email",
                {
                    newEmail: values.newEmail,
                }
            );

            showToast(data.message, "success");

            dispatch(
                setUser({
                    ...user,
                    pendingEmail: values.newEmail,
                })
            );
        } catch (error) {
            showToast(
                getMessage(error, "Failed to change email."),
                "error"
            );
            throw error;
        }
    };

    const handleToggleTwoFactor = async () => {
        setTwoFactorEnabled((prev) => !prev);
        closeModal();
    };

    const handleLogoutAllDevices = async () => {
        setLoadingLogout(true);
        try {
            const res = await apiClient.post(
                "auth/settings/login-all-devices"
            );

            showToast(res.data.message, "success");

            dispatch(logout())
            navigate("/buyer/login", {
                replace: true,
            });
        } catch (error) {
            showToast(getMessage(error, ""), "error");
            throw error;
        } finally {
            setLoadingLogout(false);
            closeModal();
        }
    };

    const openLogoutModal = async () => {
        setLoadingSessions(true);
        try {
            const { data } = await apiClient.get(
                "/auth/settings/active-sessions"
            );

            setActiveSessions(data.data?.sessions || []);
            setActiveModal("logoutAll");
        } catch (error) {
            showToast(
                getMessage(error, "Unable to load devices"),
                "error"
            );
        } finally {
            setLoadingSessions(false);
        }
    };

    const fetchLoginHistory = async () => {
        if (loginHistoryLoading) return;
        setLoginHistoryLoading(true);
        try {
            const { data } = await apiClient.get(
                "/auth/settings/login-history"
            );

            setLoginHistory(
                data.data?.loginHistory || []
            );
        } catch (error) {
            showToast(
                getMessage(error, "Failed to load login history."),
                "error"
            );
        } finally {
            setLoginHistoryLoading(false);
        }
    };

    const fetchActiveDevices = async () => {
        setLoadingActiveDevice(true);
        try {
            const { data } = await apiClient.get(
                "/auth/settings/active-sessions"
            );

            setActiveDevices(
                data.data?.sessions || []
            );
            setActiveModal("devices");
        } catch (error) {
            showToast(
                getMessage(error, "Unable to load devices"),
                "error"
            );
        } finally {
            setLoadingActiveDevice(false);
        }
    };

    const fetchRecentActivities = async () => {
        if (loadingActivities) return;
        setLoadingActivities(true);
        try {
            const { data } = await apiClient.get(
                "/buyer/activity"
            );

            const activities = data.data || [];
            setRecentActivities(
                activities.slice(0, 10)
            );
        } catch (error) {
            showToast(
                getMessage(error, "Failed to load recent activities."),
                "error"
            );
        } finally {
            setLoadingActivities(false);
        }
    };

    const handleSuspendStore = async (reason) => {
        if (loading.suspend) return;
        setLoading((prev) => ({
            ...prev,
            suspend: true,
        }));
        try {
            const { data } = await apiClient.post(
                "/auth/settings/profile/suspend/me",
                {
                    reason,
                }
            );

            showToast(data.message, "success");
            dispatch(
                setUser({
                    ...user,
                    accountStatus: "suspended",
                    isActive: false,
                    suspendDate: new Date().toISOString(),
                })
            );
            closeModal();
        } catch (error) {
            showToast(
                getMessage(error, "Failed to suspend account."),
                "error"
            );
        } finally {
            setLoading((prev) => ({
                ...prev,
                suspend: false,
            }));
        }
    };

    const handleReactivateStore = async () => {
        if (loading.reactivate) return;
        setLoading((prev) => ({
            ...prev,
            reactivate: true,
        }));
        try {
            const { data } = await apiClient.post(
                "/auth/settings/profile/reactivate/me"
            );

            showToast(data.message, "success");
            dispatch(
                setUser({
                    ...user,
                    accountStatus: "active",
                    isActive: true,
                    suspendDate: null,
                    reactivatedAt: new Date().toISOString(),
                })
            );
            closeModal();
        } catch (error) {
            showToast(
                getMessage(error, "Failed to reactivate account."),
                "error"
            );
        } finally {
            setLoading((prev) => ({
                ...prev,
                reactivate: false,
            }));
        }
    };

    const handleReportSecurityIssue = () => {
        console.log("Report Security Issue");
        closeModal();
    };

    const handleDeleteAccount = async (reason) => {
        if (loading.delete) return;
        setLoading((prev) => ({
            ...prev,
            delete: true,
        }));
        try {
            const { data } = await apiClient.post(
                "/auth/settings/profile/delete/me",
                {
                    reason,
                }
            );

            showToast(data.message, "success");

            dispatch(logout());

            closeModal();

            navigate("/login", {
                replace: true,
            });
        } catch (error) {
            showToast(
                getMessage(error, "Failed to delete account."),
                "error"
            );
        } finally {
            setLoading((prev) => ({
                ...prev,
                delete: false,
            }));
        }
    };

    useEffect(() => {
        setNotificationPreference(
            user?.preferences?.notificationPreference || ""
        );

        setPromotionalMessages(
            user?.preferences?.promotionalMessages ?? false
        );
    }, [
        user?.preferences?.notificationPreference,
        user?.preferences?.promotionalMessages,
    ]);

    const handleChangeNotificationPreference = async (value) => {
        if (
            notificationLoading ||
            value === notificationPreference
        ) {
            return;
        }

        const previousValue = notificationPreference;

        setNotificationPreference(value);
        setNotificationLoading(true);

        try {
            const { data } = await apiClient.put(
                "/auth/settings/notification-preference",
                {
                    notificationPreference: value,
                }
            );

            const updatedValue =
                data.data?.notificationPreference ?? value;

            setNotificationPreference(updatedValue);

            dispatch(
                setUser({
                    ...user,
                    preferences: {
                        ...user?.preferences,
                        notificationPreference: updatedValue,
                    },
                })
            );

            showToast(
                getMessage(
                    data,
                    "Notification preference updated successfully."
                ),
                "success"
            );
        } catch (error) {
            setNotificationPreference(previousValue);

            showToast(
                getMessage(
                    error,
                    "Failed to update notification preference."
                ),
                "error"
            );
        } finally {
            setNotificationLoading(false);
        }
    };

    const handlePromotionalMessagesChange = async (value) => {
        if (promotionalLoading) return;

        const previousValue = promotionalMessages;

        setPromotionalMessages(value);
        setPromotionalLoading(true);

        try {
            const { data } = await apiClient.put(
                "/auth/settings/promotional-messages",
                {
                    promotionalMessages: value,
                }
            );

            const updatedValue =
                data.data?.promotionalMessages ?? value;

            setPromotionalMessages(updatedValue);

            dispatch(
                setUser({
                    ...user,
                    preferences: {
                        ...user?.preferences,
                        promotionalMessages: updatedValue,
                    },
                })
            );

            showToast(
                getMessage(
                    data,
                    "Promotional messages updated successfully."
                ),
                "success"
            );
        } catch (error) {
            setPromotionalMessages(previousValue);

            showToast(
                getMessage(
                    error,
                    "Failed to update promotional messages."
                ),
                "error"
            );
        } finally {
            setPromotionalLoading(false);
        }
    };

    const bg = isDark
        ? "bg-gray-900"
        : "bg-gray-50";

    const text = isDark
        ? "text-white"
        : "text-gray-900";

    return (
        <div
            className={`min-h-screen ${bg} p-4 sm:p-6 lg:p-8 transition-all duration-300 antialiased font-sans selection:bg-green-500 selection:text-white`}
        >
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-700/30">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className={`group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-500 transition-colors mb-2 rounded-full px-3 py-1.5 ${isDark
                                ? "bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 ring-1 ring-white/10"
                                : "bg-white/70 hover:bg-white text-zinc-600 ring-1 ring-zinc-900/5"
                                }`}
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />

                            Back
                        </button>

                        <h1
                            className={`text-3xl font-extrabold tracking-tight ${text} flex items-center gap-2`}
                        >
                            Settings
                        </h1>
                    </div>
                </div>

                <AccountSection
                    twoFactorEnabled={twoFactorEnabled}
                    onChangePassword={() =>
                        setActiveModal("password")
                    }
                    onChangePhone={() =>
                        setActiveModal("phone")
                    }
                    onChangeEmail={() =>
                        setActiveModal("email")
                    }
                    onTwoFactor={() =>
                        setActiveModal("twoFactor")
                    }
                    onLogoutAllDevices={openLogoutModal}
                />

                <AccountModals
                    activeModal={activeModal}
                    onClose={closeModal}
                    twoFactorEnabled={twoFactorEnabled}
                    onPasswordSubmit={handlePasswordSubmit}
                    onPhoneSubmit={handlePhoneSubmit}
                    onEmailSubmit={handleEmailSubmit}
                    onToggleTwoFactor={handleToggleTwoFactor}
                    onLogoutAllDevices={handleLogoutAllDevices}
                    activeSessions={activeSessions}
                    loadingSessions={loadingSessions}
                    loadingLogout={loadingLogout}
                    currentSessionId={user?.sessionId}
                />

                <NotificationSection
                    notificationPreference={notificationPreference}
                    promotionalMessages={promotionalMessages}
                    onNotificationPreferenceChange={
                        handleChangeNotificationPreference
                    }
                    onPromotionalMessagesChange={
                        handlePromotionalMessagesChange
                    }
                    notificationLoading={notificationLoading}
                    promotionalLoading={promotionalLoading}
                />

                <SecuritySection
                    onActiveDevices={() => {
                        fetchActiveDevices();
                    }}
                    onLoginHistory={() => {
                        setActiveModal("loginHistory");
                        fetchLoginHistory();
                    }}
                    onRecentActivities={() => {
                        setActiveModal("activities");
                        fetchRecentActivities();
                    }}
                />

                <SecurityModals
                    activeModal={activeModal}
                    onClose={closeModal}
                    activeDevices={activeDevices}
                    loginHistory={loginHistory}
                    recentActivities={recentActivities}
                    loginHistoryLoading={loginHistoryLoading}
                    loadingActiveDevice={loadingActiveDevice}
                    loadingActivities={loadingActivities}
                />

                <DangerZoneSection
                    isSuspended={isSuspended}
                    onReportSecurityIssue={() =>
                        setActiveModal("report")
                    }
                    onSuspendStore={() =>
                        setActiveModal(
                            isSuspended
                                ? "reactivate"
                                : "suspend"
                        )
                    }
                    onDeleteAccount={() =>
                        setActiveModal("delete")
                    }
                />

                <DangerZoneModal
                    activeModal={activeModal}
                    onClose={closeModal}
                    onSuspendStore={handleSuspendStore}
                    onReactivateStore={handleReactivateStore}
                    onReportSecurityIssue={
                        handleReportSecurityIssue
                    }
                    onDeleteAccount={handleDeleteAccount}
                    loading={loading}
                />
            </div>
        </div>
    );
}