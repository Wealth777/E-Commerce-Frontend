import React, { useEffect, memo } from "react";
import { X } from "lucide-react";
import { cn } from "../../../lib/utils";

const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
};

const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    maxWidth = "md",
    variant = "default",
}) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
            <div
                className="fixed inset-0 animate-fade-in bg-black/50 backdrop-blur-xs"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className={cn(
                    "relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-[#111625]",
                    maxWidthClasses[maxWidth]
                )}
            >
                <div
                    className={cn(
                        "flex items-start justify-between border-b p-6",
                        variant === "danger"
                            ? "border-rose-100 bg-rose-50/70 dark:border-rose-900/40 dark:bg-rose-950/20"
                            : "border-slate-100 dark:border-slate-800"
                    )}
                >
                    <div className="space-y-1">
                        <h3
                            id="modal-title"
                            className={cn(
                                "text-lg font-semibold tracking-tight",
                                variant === "danger"
                                    ? "text-rose-600 dark:text-rose-400"
                                    : "text-slate-900 dark:text-white"
                            )}
                        >
                            {title}
                        </h3>

                        {description && (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 "
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 overflow-y-auto p-6 text-zinc-700 dark:text-zinc-300">
                    {children}
                </div>

                {footer && (
                    <div className="flex items-center justify-end gap-3 border-t border-zinc-100 bg-zinc-50/80 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/80">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(Modal);