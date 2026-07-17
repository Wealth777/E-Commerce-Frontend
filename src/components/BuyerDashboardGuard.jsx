import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const BuyerDashboardGuard = ({ children }) => {
    const { user, loading } = useSelector((state) => state.auth);

    if (loading) return null;

    if (!user?.emailVerified) {
        return <Navigate to="/verify-email" replace />;
    }

    return children;
};

export default BuyerDashboardGuard;