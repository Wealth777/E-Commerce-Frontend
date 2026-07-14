import React, { memo } from "react";
import {
    AlertTriangle,
    PauseCircle,
    Trash2,
    ChevronRight,
} from "lucide-react";

import Card from "./common/Cards";


const DangerZoneSection = ({
    isSuspended,
    onReportSecurityIssue,
    onSuspendStore,
    onDeleteAccount,
}) => {
    const handlers = {
        report: onReportSecurityIssue,
        suspend: onSuspendStore,
        delete: onDeleteAccount,
    };

    const dangerZoneItems = [
        {
            id: "report",
            title: "Report Security Issue",
            description:
                "Report suspicious activity, unauthorized access, or other security concerns.",
            icon: AlertTriangle,
        },
        {
            id: "suspend",
            title: isSuspended ? "Reactivate Store" : "Suspend Store",
            description: isSuspended
                ? "Make your store visible to buyers again."
                : "Temporarily hide your store from buyers until you decide to reactivate it.",
            icon: PauseCircle,
        },
        {
            id: "delete",
            title: "Delete Account",
            description:
                "Permanently delete your vendor account and all associated data. This action cannot be undone.",
            icon: Trash2,
            destructive: true,
        },
    ];

    return (
        <Card
            variant="danger"
            title="Danger Zone"
            description="These actions affect your account and store. Some actions are permanent and cannot be undone."
        >
            <div className="divide-y divide-rose-100 dark:divide-rose-900/40">
                {dangerZoneItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            aria-label={item.title}
                            onClick={handlers[item.id]}
                            className="group flex w-full items-center justify-between px-5 py-4 text-left transition-all duration-200 hover:bg-rose-50/60 dark:hover:bg-rose-950/20"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition-colors duration-200 group-hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400">
                                    <Icon size={20} />
                                </div>

                                <div>
                                    <h4
                                        className={
                                            item.destructive
                                                ? "font-semibold text-rose-600 dark:text-rose-400"
                                                : "font-semibold text-gray-900 dark:text-white"
                                        }
                                    >
                                        {item.title}
                                    </h4>

                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            <ChevronRight
                                size={18}
                                className="text-rose-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-rose-600 dark:group-hover:text-rose-300"
                            />
                        </button>
                    );
                })}
            </div>
        </Card>
    );
};

export default memo(DangerZoneSection);