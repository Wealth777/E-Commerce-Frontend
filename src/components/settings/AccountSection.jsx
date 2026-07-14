import React, { memo } from "react";
import {
    Lock,
    Phone,
    Mail,
    ShieldCheck,
    LogOut,
    ChevronRight,
} from "lucide-react";

import Card from "./common/Cards";
import Badge from "./common/Badge";
import Toggle from "./common/Toggles";

const settings = [
    {
        id: "password",
        title: "Change Password",
        description: "Update your account password to keep your account secure.",
        icon: Lock,
    },
    {
        id: "phone",
        title: "Change Phone Number",
        description: "Update the phone number linked to your vendor account.",
        icon: Phone,
    },
    {
        id: "email",
        title: "Change Email",
        description: "Change the email address used to sign in.",
        icon: Mail,
    },
    {
        id: "2fa",
        title: "Two-factor Authentication",
        description: "Protect your account with an extra layer of security.",
        icon: ShieldCheck,
        hasToggle: true,
    },
    {
        id: "logout",
        title: "Logout From All Devices",
        description: "Sign out your account from every active session.",
        icon: LogOut,
    },
];

const AccountSection = ({
    twoFactorEnabled = false,
    onChangePassword,
    onChangePhone,
    onChangeEmail,
    onTwoFactor,
    onLogoutAllDevices,
}) => {
    const handlers = {
        password: onChangePassword,
        phone: onChangePhone,
        email: onChangeEmail,
        "2fa": onTwoFactor,
        logout: onLogoutAllDevices,
    };

    return (
        <Card
            title="Account"
            description="Manage your account credentials and authentication settings."
        >
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {settings.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={handlers[item.id]}
                            className="group flex w-full items-center justify-between px-5 py-4 text-left transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600 transition-colors group-hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
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

                            <div className="flex items-center gap-3">
                                {item.hasToggle && (
                                    <>
                                        <Badge
                                            color={twoFactorEnabled ? "success" : "danger"}
                                        >
                                            {twoFactorEnabled
                                                ? "Enabled"
                                                : "Disabled"}
                                        </Badge>

                                        <Toggle
                                            checked={twoFactorEnabled}
                                            onChange={() => { }}
                                            disabled
                                        />
                                    </>
                                )}

                                <ChevronRight
                                    size={18}
                                    className="text-gray-400 transition-transform group-hover:translate-x-1"
                                />
                            </div>
                        </button>
                    );
                })}
            </div>
        </Card>
    );
};

export default memo(AccountSection);