import React, { memo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "../common/Modal";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const passwordValidationSchema = Yup.object().shape({
    oldPassword: Yup.string()
        .required("Current password is required"),
    newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("New password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Please confirm your new password"),
});

const phoneValidationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
        .matches(/^[0-9+\s-]{10,15}$/, "Invalid phone number format")
        .required("Phone number is required"),
});

const emailValidationSchema = Yup.object().shape({
    newEmail: Yup.string()
        .email("Invalid email address")
        .required("Email address is required"),
});

const AccountModals = ({
    activeModal,
    onClose,
    twoFactorEnabled,
    onPasswordSubmit,
    onPhoneSubmit,
    onEmailSubmit,
    onToggleTwoFactor,
    onLogoutAllDevices,
    activeSessions = [],
    loadingSessions = false,
    loadingLogout = false,
    currentSessionId,
}) => {

    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)

    const inputStyle = "w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
    const errorStyle = "text-sm text-red-500 mt-1 block";
    const labelStyle = "block text-sm font-medium mb-1";
    const buttonStyle = "w-full py-2 text-white bg-green-600 hover:bg-green-700 font-medium rounded-md transition mt-4 disabled:opacity-50";

    return (
        <>
            {/* Change Password */}
            <Modal
                isOpen={activeModal === "password"}
                onClose={onClose}
                title="Change Password"
                description="Update your password to keep your account secure."
            >
                <Formik
                    initialValues={{
                        oldPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                    }}
                    validationSchema={passwordValidationSchema}
                    onSubmit={async (values, helpers) => {
                        try {
                            await onPasswordSubmit(values);

                            helpers.resetForm();
                            onClose();
                        } catch (error) {
                            // toast already shown
                        } finally {
                            helpers.setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <label className={labelStyle}>Current Password</label>
                                <div className="relative flex items-center">
                                    <Field
                                        type={showPassword ? 'text' : 'password'}
                                        name="oldPassword"
                                        className={`${inputStyle} w-full pr-10`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 flex items-center justify-center text-gray-500 hover:text-gray-700"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                <ErrorMessage name="oldPassword" component="span" className={errorStyle} />
                            </div>
                            <div>
                                <label className={labelStyle}>New Password</label>
                                <div className="relative flex items-center">
                                    <Field type={showNewPassword ? 'text' : "password"} name="newPassword" className={`${inputStyle} w-full pr-10`} />
                                    <button type="button" className="absolute right-3 flex items-center justify-center text-gray-500 hover:text-gray-700" onClick={() => setShowNewPassword(!showNewPassword)}>
                                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                <ErrorMessage name="newPassword" component="span" className={errorStyle} />
                            </div>
                            <div>
                                <label className={labelStyle}>Confirm New Password</label>
                                <div className="relative flex items-center">
                                    <Field type={showNewPassword ? 'text' : "password"} name="confirmPassword" className={`${inputStyle} w-full pr-10`} />
                                    <button type="button" className="absolute right-3 flex items-center justify-center text-gray-500 hover:text-gray-700" onClick={() => setShowNewPassword(!showNewPassword)}>
                                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                <ErrorMessage name="confirmPassword" component="span" className={errorStyle} />
                            </div>
                            <button type="submit" disabled={isSubmitting} className={buttonStyle}>
                                {isSubmitting ? "Updating..." : "Update Password"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </Modal>

            {/* Change Phone */}
            <Modal
                isOpen={activeModal === "phone"}
                onClose={onClose}
                title="Change Phone Number"
                description="Update the phone number associated with your account."
            >
                <Formik
                    initialValues={{ phoneNumber: "" }}
                    validationSchema={phoneValidationSchema}
                    onSubmit={async (values, { resetForm, setSubmitting }) => {
                        await onPhoneSubmit(values);
                        resetForm();
                        onClose();
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <label className={labelStyle}>New Phone Number</label>
                                <Field type="text" name="phoneNumber" placeholder="+1234567890" className={inputStyle} />
                                <ErrorMessage name="phoneNumber" component="span" className={errorStyle} />
                            </div>
                            <button type="submit" disabled={isSubmitting} className={buttonStyle}>
                                {isSubmitting ? "Saving..." : "Update Phone Number"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </Modal>

            {/* Change Email */}
            <Modal
                isOpen={activeModal === "email"}
                onClose={onClose}
                title="Change Email Address"
                description="A verification link will be sent to your new email address before the change is applied."
            >
                <Formik
                    initialValues={{ newEmail: "" }}
                    validationSchema={emailValidationSchema}
                    onSubmit={async (values, helpers) => {
                        try {
                            await onEmailSubmit(values);

                            helpers.resetForm();
                            onClose();
                        } catch (error) {
                            // Toast already displayed
                        } finally {
                            helpers.setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <label className={labelStyle}>New Email Address</label>
                                <Field type="email" name="newEmail" placeholder="you@example.com" className={inputStyle} />
                                <ErrorMessage name="newEmail" component="span" className={errorStyle} />
                            </div>
                            <button type="submit" disabled={isSubmitting} className={buttonStyle}>
                                {isSubmitting ? "Saving..." : "Update Email"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </Modal>

            {/* Two Factor */}
            <Modal
                isOpen={activeModal === "twoFactor"}
                onClose={onClose}
                title="Two-factor Authentication"
                description="Enable an additional layer of security for your account."
            >
                <div className="text-center py-4">
                    <p className="mb-4">
                        Two-factor authentication is currently <strong>{twoFactorEnabled ? "Enabled" : "Disabled"}</strong>.
                    </p>
                    <button
                        onClick={onToggleTwoFactor}
                        className={`w-full py-2 px-4 rounded-md font-medium text-white transition ${twoFactorEnabled ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                    </button>
                </div>
            </Modal>

            {/* Logout */}
            <Modal
                isOpen={activeModal === "logoutAll"}
                onClose={onClose}
                variant="danger"
                title="Logout From All Devices"
                description="This will immediately sign your account out from every device except your current session."
            >
                <div className="space-y-4">
                    {loadingSessions ? (
                        <div className="py-8 text-center">
                            Loading devices...
                        </div>
                    ) : activeSessions.length ? (
                        <>
                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                {activeSessions.map((session) => (
                                    <div
                                        key={session.sessionId}
                                        className="rounded-lg border p-4"
                                    >
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="font-semibold">
                                                    {session.deviceInfo?.browser} • {session.deviceInfo?.os}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {session.location?.city},{" "}
                                                    {session.location?.country}
                                                </p>

                                                <p className="text-xs text-gray-400">
                                                    {new Date(session.loginAt).toLocaleString()}
                                                </p>
                                            </div>

                                            {session.sessionId === currentSessionId && (
                                                <span className="text-xs font-semibold text-green-600">
                                                    Current Device
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                disabled={loadingSessions || loadingLogout}
                                onClick={async () => {
                                    await onLogoutAllDevices();
                                }}
                                className="w-full rounded-md bg-red-600 py-2 text-white hover:bg-red-700"
                            >
                                Logout All Other Devices
                            </button>

                            <button
                                onClick={onClose}
                                className="w-full rounded-md border py-2"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <div className="py-8 text-center">
                            No active devices found.
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default memo(AccountModals);