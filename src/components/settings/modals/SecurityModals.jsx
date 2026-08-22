import React, { memo } from "react";
import {
    MonitorSmartphone,
    History,
    Activity,
    Laptop,
    Smartphone,
    Globe,
    Clock,
} from "lucide-react";

import Modal from "../common/Modal";

const SecurityModals = ({
    activeModal,
    onClose,
    activeDevices = [],
    loginHistory = [],
    recentActivities = [],
    loginHistoryLoading = false,
    loadingActiveDevice = false,
    loadingActivities = false,
}) => {
    const formatAction = (action = "") =>
        action
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, c => c.toUpperCase());
    return (
        <>
            {/* Active Devices */}

            <Modal
                isOpen={activeModal === "devices"}
                onClose={onClose}
                title="Active Devices"
                description="Devices currently signed in to your account."
                maxWidth="lg"
            >
                <div className="space-y-4">
                    {loadingActiveDevice ? (
                        <div className="py-8 text-center">
                            Loading devices...
                        </div>
                    ) : activeDevices.length ? (
                        activeDevices.map((session) => (
                            <div
                                key={session.sessionId}
                                className="flex items-center justify-between rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
                                        {session.type === "mobile" ? (
                                            <Smartphone className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        ) : (
                                            <Laptop className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        )}
                                    </div>

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
                                </div>

                                {session.current && (
                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        Current Device
                                    </span>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <MonitorSmartphone className="mx-auto h-10 w-10 text-gray-400" />

                            <p className="mt-4 text-gray-500 dark:text-gray-400">
                                No active devices found.
                            </p>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Login History */}

            <Modal
                isOpen={activeModal === "loginHistory"}
                onClose={onClose}
                title="Login History"
                description="Review recent sign in activity."
                maxWidth="lg"
            >
                <div className="space-y-4">
                    {loginHistoryLoading ? (
                        <div className="py-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                Loading login history...
                            </p>
                        </div>
                    ) : loginHistory.length ? (
                        loginHistory.map((login) => (
                            <div
                                key={login.id}
                                className="flex items-start gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                            >
                                <Clock className="mt-1 h-5 w-5 text-green-600 dark:text-green-400" />

                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {[login.browser, login.os, login.device]
                                            .filter(Boolean)
                                            .join(" • ") || "Unknown device"}
                                    </p>

                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(login.loginAt).toLocaleString()}
                                    </p>

                                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Globe className="h-4 w-4" />
                                        {login.location}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <History className="mx-auto h-10 w-10 text-gray-400" />
                            <p className="mt-4 text-gray-500 dark:text-gray-400">
                                No login history available.
                            </p>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Recent Activities */}

            <Modal
                isOpen={activeModal === "activities"}
                onClose={onClose}
                title="Recent Activities"
                description="Important actions performed on your account."
                maxWidth="lg"
            >
                <div className="space-y-4">
                    {loadingActivities ? (
                        <div className="py-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                Loading activities...
                            </p>
                        </div>
                    ) : recentActivities.length ? (
                        recentActivities.map((activity) => (
                            <div
                                key={activity._id}
                                className="rounded-xl border border-gray-200 dark:border-gray-700 p-4"
                            >
                                <div className="flex items-start gap-3">

                                    <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2">
                                        <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>

                                    <div className="flex-1">

                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {formatAction(activity.action)}
                                        </h4>

                                        {activity.entity && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                Entity: {activity.entity}
                                            </p>
                                        )}

                                        {/* {activity.metadata?.device && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Device: {activity.metadata.device}
                                            </p>
                                        )}

                                        {activity.metadata?.ipAddress && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                IP: {activity.metadata.ipAddress}
                                            </p>
                                        )}

                                        {activity.metadata?.location && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Location: {activity.metadata.location}
                                            </p>
                                        )} */}

                                        {activity.metadata?.email && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Email: {activity.metadata.email}
                                            </p>
                                        )}

                                        {activity.metadata?.device && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Device: {
                                                    typeof activity.metadata.device === "string"
                                                        ? activity.metadata.device
                                                        : [
                                                            activity.metadata.device.browser,
                                                            activity.metadata.device.os,
                                                            activity.metadata.device.device,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(" • ")
                                                }
                                            </p>
                                        )}

                                        {activity.metadata?.ipAddress && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                IP: {activity.metadata.ipAddress}
                                            </p>
                                        )}

                                        {activity.metadata?.location && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Location: {
                                                    typeof activity.metadata.location === "string"
                                                        ? activity.metadata.location
                                                        : [
                                                            activity.metadata.location.city,
                                                            activity.metadata.location.region,
                                                            activity.metadata.location.country,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(", ")
                                                }
                                            </p>
                                        )}

                                        <p className="mt-2 text-xs text-gray-400">
                                            {activity.createdAt
                                                ? new Date(activity.createdAt).toLocaleString()
                                                : "Unknown date"}
                                        </p>

                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <Activity className="mx-auto h-10 w-10 text-gray-400" />
                            <p className="mt-4 text-gray-500 dark:text-gray-400">
                                No recent activities found.
                            </p>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default memo(SecurityModals);