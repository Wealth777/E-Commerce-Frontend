import React, { memo } from "react";
import { cn } from "../../../lib/utils";

const Toggle = ({
    checked,
    onChange,
    disabled = false,
    size = "md",
    label,
}) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label || "Toggle setting"}
            disabled={disabled}
            onClick={(e) => {
                e.stopPropagation();

                if (!disabled) {
                    onChange(!checked);
                }
            }}
            className={cn(
                "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-[#111625]",
                size === "sm" ? "h-5 w-9" : "h-6 w-11",
                checked
                    ? "bg-green-600 dark:bg-green-500"
                    : "bg-slate-200 dark:bg-gray-700"
            )}
        >      <span className="sr-only">
                {label || "Toggle setting"}
            </span>

            <span
                className={cn(
                    "pointer-events-none inline-block rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out",
                    size === "sm" ? "h-4 w-4" : "h-5 w-5",
                    checked
                        ? size === "sm"
                            ? "translate-x-4"
                            : "translate-x-5"
                        : "translate-x-0"
                )}
            />
        </button>
    );
};

export default memo(Toggle);