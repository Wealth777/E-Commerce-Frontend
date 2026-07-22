import React, { useState } from "react";
import AccountSection from "../../components/settings/AccountSection";
import AccountModals from "../../components/settings/modals/AccountModals";
import { useTheme } from "../../context/ThemeContext";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import NotificationSection from "../../components/settings/NotificationSection";
import DangerZoneSection from "../../components/settings/DangerZoneSection";
import DangerZoneModal from "../../components/settings/modals/DangerZoneModal";
import SecurityModals from "../../components/settings/modals/SecurityModals";
import SecuritySection from "../../components/settings/SecuritySection";
import apiClient from '../../api/apiClient';
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from '../../context/ToastContext';
import { setUser, logout } from "../../store/authSlice";

export default function Settings() {
    const { isDark } = useTheme();
    const [activeModal, setActiveModal] = useState(null);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [notificationPreference, setNotificationPreference] = useState("email");
    const [promotionalMessages, setPromotionalMessages] = useState(false);
    const [activeDevices, setActiveDevices] = useState([]);
    const [loginHistory, setLoginHistory] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { showToast } = useToast()
    const isSuspended = user?.accountStatus === "suspended";
    const navigate = useNavigate()

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

            showToast(data.message, "success");
        } catch (error) {
            showToast(
                error.response?.data?.message ||
                "Failed to change password.",
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
                error.response?.data?.message ||
                "Failed to change email.",
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
        console.log("Logout all devices");
        closeModal();
    };

    const handleSuspendStore = async (reason) => {
        try {
            const { data } = await apiClient.post(
                "/vendor/profile/suspend/me",
                {
                    reason,
                }
            );

            showToast(data.message, 'success');

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
                error.response?.data?.message ||
                "Failed to suspend account.",
                'error'
            );
        }
    };

    const handleReactivateStore = async () => {
        try {
            const { data } = await apiClient.post(
                "/vendor/profile/reactivate/me"
            );

            showToast(data.message, 'success');

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
                error.response?.data?.message ||
                "Failed to reactivate account.",
                'error'
            );
        }
    };

    const handleReportSecurityIssue = () => {
        console.log("Report Security Issue");

        // TODO:
        // Navigate to report page
        // or open support form

        closeModal();
    };

    const handleDeleteAccount = async (reason) => {
        try {
            const { data } = await apiClient.post(
                "/vendor/profile/delete/me",
                {
                    reason,
                }
            );

            showToast(data.message, "success");

            dispatch(logout());

            closeModal();

            navigate("/login", { replace: true });
        } catch (error) {
            showToast(
                error.response?.data?.message ||
                "Failed to delete account.",
                "error"
            );
        }
    };

    const bg = isDark ? 'bg-gray-900' : 'bg-gray-50';
    const text = isDark ? 'text-white' : 'text-gray-900';

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
                            Settings
                        </h1>
                    </div>

                </div>

                {/* Account Section */}
                <AccountSection
                    twoFactorEnabled={twoFactorEnabled}
                    onChangePassword={() => setActiveModal("password")}
                    onChangePhone={() => setActiveModal("phone")}
                    onChangeEmail={() => setActiveModal("email")}
                    onTwoFactor={() => setActiveModal("twoFactor")}
                    onLogoutAllDevices={() => setActiveModal("logoutAll")}
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
                />

                {/* Notifications Section */}
                <NotificationSection
                    notificationPreference={notificationPreference}
                    promotionalMessages={promotionalMessages}
                    onNotificationPreferenceChange={setNotificationPreference}
                    onPromotionalMessagesChange={setPromotionalMessages}
                />

                {/* Security Section */}

                <SecuritySection
                    onActiveDevices={() => setActiveModal("devices")}
                    onLoginHistory={() => setActiveModal("loginHistory")}
                    onRecentActivities={() => setActiveModal("activities")}
                />

                <SecurityModals
                    activeModal={activeModal}
                    onClose={closeModal}
                    activeDevices={activeDevices}
                    loginHistory={loginHistory}
                    recentActivities={recentActivities}
                />

                {/* Danger Zone */}

                <DangerZoneSection
                    isSuspended={isSuspended}
                    onReportSecurityIssue={() => setActiveModal("report")}
                    onSuspendStore={() =>
                        setActiveModal(isSuspended ? "reactivate" : "suspend")
                    }
                    onDeleteAccount={() => setActiveModal("delete")}
                />

                <DangerZoneModal
                    activeModal={activeModal}
                    onClose={closeModal}
                    onSuspendStore={handleSuspendStore}
                    onReactivateStore={handleReactivateStore}
                    onReportSecurityIssue={handleReportSecurityIssue}
                    onDeleteAccount={handleDeleteAccount}
                />

                {/* Security Modals */}

                {/* <SecurityModals
                activeModal={activeModal}
                onClose={closeModal}
            /> */}
            </div>
        </div>
    );
}