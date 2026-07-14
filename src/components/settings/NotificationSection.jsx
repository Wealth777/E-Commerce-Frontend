import React, { memo } from "react";
import {
    Mail,
    MessageCircle,
    Bell,
    Megaphone,
} from "lucide-react";

import Card from "../settings/common/Cards";
import Toggle from "../settings/common/Toggles";

const notificationOptions = [
    {
        value: "email",
        title: "Email Notifications",
        description: "Receive account updates and order notifications by email.",
        icon: Mail,
    },
    {
        value: "whatsapp",
        title: "WhatsApp Notifications",
        description: "Receive account updates and order notifications through WhatsApp.",
        icon: MessageCircle,
    },
    {
        value: "both",
        title: "Email & WhatsApp",
        description: "Receive notifications through both email and WhatsApp.",
        icon: Bell,
    },
];

const NotificationSection = ({
    notificationPreference = "email",
    promotionalMessages = false,
    onNotificationPreferenceChange,
    onPromotionalMessagesChange,
}) => {
    return (
        <Card
            title="Notifications"
            description="Choose how you would like to receive updates from CampusTrade."
        >
            <div className="divide-y divide-gray-200 dark:divide-gray-800">

                {notificationOptions.map((option) => {
                    const Icon = option.icon;

                    return (
                        <label
                            key={option.value}
                            className="flex cursor-pointer items-start justify-between px-5 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                            <div className="flex gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                    <Icon size={20} />
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {option.title}
                                    </h4>

                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {option.description}
                                    </p>
                                </div>
                            </div>

                            <input
                                type="radio"
                                name="notificationPreference"
                                value={option.value}
                                checked={
                                    notificationPreference === option.value
                                }
                                onChange={() =>
                                    onNotificationPreferenceChange(option.value)
                                }
                                className="mt-1 h-5 w-5 accent-green-600 cursor-pointer"
                            />
                        </label>
                    );
                })}

                <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                            <Megaphone size={20} />
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                Promotional Messages
                            </h4>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Receive product announcements, offers, and marketing updates.
                            </p>
                        </div>
                    </div>

                    <Toggle
                        checked={promotionalMessages}
                        onChange={onPromotionalMessagesChange}
                    />
                </div>

            </div>
        </Card>
    );
};

export default memo(NotificationSection);