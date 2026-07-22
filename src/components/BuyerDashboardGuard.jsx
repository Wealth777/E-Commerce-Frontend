import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const BuyerDashboardGuard = ({ children }) => {
    const { user, loading } = useSelector((state) => state.auth);

    if (loading) return null;

    if (!user?.emailVerified) {
        return <Navigate to="/resend-verification-email" replace />;
    }
    
    if (!user?.onboardingCompleted) {
        return <Navigate to="/buyer/onboarding" replace />;
    }

    return children;
};

export default BuyerDashboardGuard;