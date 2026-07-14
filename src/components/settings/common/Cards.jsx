import React from "react";
import { cn } from "../../../lib/utils";

const Card = ({
    children,
    className,
    title,
    description,
    headerAction,
    variant = "default",
}) => {
    return (
        <div
            className={cn(
                "rounded-2xl border bg-white transition-all duration-200 shadow-sm dark:bg-[#111625]",
                variant === "danger"
                    ? "border-rose-200 bg-rose-50/70 shadow-rose-500/10 dark:border-rose-900/40 dark:bg-rose-950/20"
                    : "border-slate-200 dark:border-slate-800",
                className
            )}
        >
            {(title || description || headerAction) && (
                <div
                    className={cn(
                        "flex flex-col justify-between gap-4 border-b px-6 py-5 sm:flex-row sm:items-center",
                        variant === "danger"
                            ? "border-rose-200/80 dark:border-rose-900/40"
                            : "border-slate-100 dark:border-slate-800"
                    )}
                >
                    <div>
                        {title && (
                            <h3
                                className={cn(
                                    "text-base font-semibold tracking-tight",
                                    variant === "danger"
                                        ? "text-rose-900 dark:text-rose-200"
                                        : "text-slate-900 dark:text-white"
                                )}
                            >
                                {title}
                            </h3>
                        )}

                        {description && (
                            <p
                                className={cn(
                                    "mt-0.5 text-sm",
                                    variant === "danger"
                                        ? "text-rose-700/80 dark:text-rose-400/80"
                                        : "text-slate-500 dark:text-slate-400"
                                )}
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    {headerAction && <div className="shrink-0">{headerAction}</div>}
                </div>
            )}

            <div className="p-1">{children}</div>
        </div>
    );
};

export default Card;