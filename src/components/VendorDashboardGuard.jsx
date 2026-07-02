import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const VendorDashboardGuard = ({ children }) => {
    const { user, loading } = useSelector((state) => state.auth);

    if (loading) return null;

    if (user?.onboardingCompleted !== true) {
        return <Navigate to="/vendor/onboarding" replace />;
    }

    return children;
};

export default VendorDashboardGuard;