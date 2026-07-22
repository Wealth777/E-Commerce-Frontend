import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const VendorDashboardGuard = ({ children }) => {
    const { user, loading } = useSelector((state) => state.auth);

    if (loading) return null;

    if (user?.isLocked || user?.accountStatus === "Locked") {
        return (
            <Navigate to="/security/account-locked" replace />
        );
    }

    // if (user?.isSuspend || user?.accountStatus === "Suspended") {
    //     return (
    //         <Navigate to="/account-suspended" replace />
    //     );
    // }

    if (!user?.emailVerified) {
        return (
            <Navigate to="/resend-verification-email" replace />
        );
    }

    if (!user?.onboardingCompleted) {
        return (
            <Navigate to="/vendor/onboarding" replace />
        );
    }

    return children;
};

export default VendorDashboardGuard;