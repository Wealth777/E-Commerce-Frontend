import React, { memo, useState } from "react";
import {
    AlertTriangle,
    ShieldAlert,
    PauseCircle,
    Trash2,
} from "lucide-react";

import Modal from "../common/Modal";

const DangerZoneModal = ({
    activeModal,
    onClose,
    onSuspendStore,
    onReactivateStore,
    onReportSecurityIssue,
    onDeleteAccount,
}) => {
    const [suspendReason, setSuspendReason] = useState("");
    const [deleteReason, setDeleteReason] = useState("");

    return (
        <>
            {/* Suspend Store */}
            <Modal
                isOpen={activeModal === "suspend"}
                onClose={onClose}
                variant="danger"
                title="Suspend Store"
                description="Temporarily hide your store from customers."
            >
                <div className="space-y-5">
                    <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                        <PauseCircle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />

                        <div>
                            <h4 className="font-semibold text-amber-700 dark:text-amber-300">
                                What happens if you suspend your store?
                            </h4>

                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-700 dark:text-amber-400">
                                <li>Your store becomes invisible to customers.</li>
                                <li>Your products will no longer appear in searches.</li>
                                <li>No new orders can be placed.</li>
                                <li>You can reactivate your store at any time.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="reason"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Reason for suspending your store
                        </label>

                        <textarea
                            id="reason"
                            rows={4}
                            value={suspendReason}
                            onChange={(e) => setSuspendReason(e.target.value)}
                            placeholder="Tell us why you want to suspend your store..."
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setSuspendReason("");
                                onClose();
                            }}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={!suspendReason.trim()}
                            onClick={() => {
                                onSuspendStore(suspendReason.trim());
                                setSuspendReason("");
                            }}
                            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Suspend Store
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Reactivate Store */}
            <Modal
                isOpen={activeModal === "reactivate"}
                onClose={onClose}
                title="Reactivate Store"
                description="Make your store visible to customers again."
            >
                <div className="space-y-5">
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-950/20">
                        <p className="text-sm text-green-700 dark:text-green-300">
                            Your store and products will become visible again, and customers
                            will be able to place new orders.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-lg border px-4 py-2"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onReactivateStore}
                            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                            Reactivate Store
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Report Security Issue */}

            <Modal
                isOpen={activeModal === "report"}
                onClose={onClose}
                variant="danger"
                title="Report Security Issue"
                description="Let us know if you notice suspicious activity."
            >
                <div className="space-y-5">
                    <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                        <ShieldAlert className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400" />

                        <div>
                            <p className="text-sm text-red-700 dark:text-red-400">
                                Report issues such as unauthorized account access,
                                suspicious login attempts, fake vendors,
                                fraudulent transactions, or any other security concern.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={onReportSecurityIssue}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Account */}

            <Modal
                isOpen={activeModal === "delete"}
                onClose={onClose}
                variant="danger"
                title="Delete Account"
                description="This action is permanent."
            >
                <div className="space-y-5">
                    <div className="flex gap-3 rounded-xl border border-red-300 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
                        <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400" />

                        <div>
                            <h4 className="font-semibold text-red-700 dark:text-red-300">
                                This action cannot be undone
                            </h4>

                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700 dark:text-red-400">
                                <li>Your vendor account will be permanently deleted.</li>
                                <li>Your store will be removed.</li>
                                <li>All products will be deleted.</li>
                                <li>You will lose access to your vendor dashboard.</li>
                                <li>This data cannot be recovered.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label
                            htmlFor="deleteReason"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Reason for deleting your account
                        </label>

                        <textarea
                            id="deleteReason"
                            rows={4}
                            value={deleteReason}
                            onChange={(e) => setDeleteReason(e.target.value)}
                            placeholder="Tell us why you're leaving..."
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            disabled={!deleteReason.trim()}
                            onClick={() => {
                                onDeleteAccount(deleteReason.trim());
                                setDeleteReason("");
                            }}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Trash2 size={16} />
                            Delete Account
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default memo(DangerZoneModal);