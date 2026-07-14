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
}) => {
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
                    {activeDevices.length ? (
                        activeDevices.map((device) => (
                            <div
                                key={device.id}
                                className="flex items-center justify-between rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-green-50 p-2 dark:bg-green-900/20">
                                        {device.type === "mobile" ? (
                                            <Smartphone className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        ) : (
                                            <Laptop className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        )}
                                    </div>

                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {device.name}
                                        </p>

                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {device.location}
                                        </p>
                                    </div>
                                </div>

                                {device.current && (
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
                    {loginHistory.length ? (
                        loginHistory.map((login) => (
                            <div
                                key={login.id}
                                className="flex items-start gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                            >
                                <Clock className="mt-1 h-5 w-5 text-green-600 dark:text-green-400" />

                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {login.device}
                                    </p>

                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {login.time}
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
                    {recentActivities.length ? (
                        recentActivities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-start gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                            >
                                <Activity className="mt-1 h-5 w-5 text-green-600 dark:text-green-400" />

                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {activity.title}
                                    </p>

                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {activity.description}
                                    </p>

                                    <p className="mt-2 text-xs text-gray-400">
                                        {activity.time}
                                    </p>
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