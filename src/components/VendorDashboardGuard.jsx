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

    if (!user?.emailVerified) {
        return (
            <Navigate to="/resend-verification-email" replace />
        );
    }

    if (!user.onboardingCompleted) {
        return (
            <Navigate
                to="/vendor/onboarding"
                replace
            />
        );
    }

    if (user.verificationStatus === "pending") {
        return (
            <Navigate
                to="/vendor/verification-pending"
                replace
            />
        );
    }

    if (user.verificationStatus === "rejected") {
        return (
            <Navigate
                to="/vendor/verification-rejected"
                replace
            />
        );
    }

    if (user.verificationStatus === "approved") {
        return children;
    }
    
    return (
        <Navigate
            to="/vendor/onboarding"
            replace
        />
    );
};

export default VendorDashboardGuard;