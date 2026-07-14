import React, { memo } from "react";
import {
    MonitorSmartphone,
    History,
    Activity,
    ChevronRight,
} from "lucide-react";

import Card from "./common/Cards";

const securityItems = [
    {
        id: "devices",
        title: "Active Devices",
        description:
            "View and manage all devices currently signed in to your account.",
        icon: MonitorSmartphone,
    },
    {
        id: "loginHistory",
        title: "Login History",
        description:
            "Review recent sign-in attempts and account access history.",
        icon: History,
    },
    {
        id: "activities",
        title: "Recent Activities",
        description:
            "See important account activities performed on your vendor account.",
        icon: Activity,
    },
];

const SecuritySection = ({
    onActiveDevices,
    onLoginHistory,
    onRecentActivities,
}) => {
    const handlers = {
        devices: onActiveDevices,
        loginHistory: onLoginHistory,
        activities: onRecentActivities,
    };

    return (
        <Card
            title="Security"
            description="Review your account activity and monitor devices that have access to your account."
        >
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {securityItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            aria-label={item.title}
                            onClick={handlers[item.id]}
                            className="group flex w-full items-center justify-between px-5 py-4 text-left transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 transition-colors duration-200 group-hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
                                    <Icon size={20} />
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {item.title}
                                    </h4>

                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            <ChevronRight
                                size={18}
                                className="text-gray-400 transition-all duration-200 group-hover:translate-x-1"
                            />
                        </button>
                    );
                })}
            </div>
        </Card>
    );
};

export default memo(SecuritySection);