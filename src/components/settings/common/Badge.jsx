import React, { memo } from "react";
import { cn } from "../../../lib/utils";

const colorVariants = {
    success: {
        soft: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
        solid: "bg-emerald-600 text-white border-emerald-600",
        outline: "bg-transparent text-emerald-600 border-emerald-500 dark:text-emerald-300",
        dot: "bg-emerald-500",
    },

    warning: {
        soft: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
        solid: "bg-amber-500 text-white border-amber-500",
        outline: "bg-transparent text-amber-600 border-amber-500 dark:text-amber-300",
        dot: "bg-amber-500",
    },

    danger: {
        soft: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
        solid: "bg-rose-600 text-white border-rose-600",
        outline: "bg-transparent text-rose-600 border-rose-500 dark:text-rose-300",
        dot: "bg-rose-500",
    },

    info: {
        soft: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800",
        solid: "bg-sky-600 text-white border-sky-600",
        outline: "bg-transparent text-sky-600 border-sky-500 dark:text-sky-400",
        dot: "bg-sky-500",
    },

    neutral: {
        soft: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
        solid: "bg-slate-700 text-white border-slate-700",
        outline: "bg-transparent text-slate-700 border-slate-400 dark:text-slate-300",
        dot: "bg-slate-500",
    },

    purple: {
        soft: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-800",
        solid: "bg-violet-600 text-white border-violet-600",
        outline: "bg-transparent text-violet-600 border-violet-500 dark:text-violet-300",
        dot: "bg-violet-500",
    },
};

const sizes = {
    xs: "text-[10px] px-1.5 py-0.5",
    sm: "text-[11px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
};

const Badge = memo(
    ({
        children,
        color = "neutral",
        variant = "soft",
        size = "sm",
        rounded = "full",
        dot = false,
        icon,
        iconPosition = "left",
        className,
        ...props
    }) => {
        const Icon = icon;

        return (
            <span
                className={cn(
                    "inline-flex items-center gap-1.5 border font-medium whitespace-nowrap transition-colors",
                    rounded === "full" ? "rounded-full" : "rounded-md",
                    sizes[size],
                    colorVariants[color][variant],
                    className
                )}
                {...props}
            >
                {dot && (
                    <span
                        className={cn(
                            "h-1.5 w-1.5 rounded-full shrink-0 animate-pulse",
                            colorVariants[color].dot
                        )}
                    />
                )}

                {Icon && iconPosition === "left" && (
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                )}

                <span>{children}</span>

                {Icon && iconPosition === "right" && (
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                )}
            </span>
        );
    }
);

Badge.displayName = "Badge";

export default Badge;