import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, logout } from './store/authSlice';
import useNotificationSocket from './hooks/useNotificationSocket';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import VendorDashboardGuard from './components/VendorDashboardGuard';
import BuyerDashboardGuard from './components/BuyerDashboardGuard';
import PublicLayout from './components/layout/PublicLayout';
import AuthLayout from './components/layout/AuthLayout';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Products from './pages/public/Products';
import ProductDetail from './pages/public/ProductDetail';
import VendorDetails from './pages/public/VendorDetails';
import AboutUs from './pages/public/AboutUs';
import Contact from './pages/public/Contact';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfService from './pages/public/TermsOfService';
import CookiePolicy from './pages/public/CookiePolicy';
import VendorGuidelines from './pages/public/VendorGuidelines';
import Sitemap from './pages/public/Sitemap';
import VerifyEmail from './pages/public/VerifyEmail';
import VerifyChangeEmail from './pages/public/VerifyChangedEmail';
import ForgetPassword from './pages/public/ForgetPassword';
import ResetPassword from './pages/public/ResetPassword';
import ResendVerificationLink from './pages/public/ResendVerificationLink';
import UnauthorizedEmailChange from './pages/public/UnauthorizedEmailChange';

// Buyer Pages
import CompleteProfile from './pages/buyer/BuyerOnboarding';
import BuyerDashboard from './pages/buyer/Dashboard';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import BuyerOrders from './pages/buyer/Orders';
import BuyerOrderDetails from './pages/buyer/OrdersDetails';
import BuyerProfile from './pages/buyer/Profile';
import BuyerWishlist from './pages/buyer/Wishlist';
import BuyerRatingsReviews from './pages/buyer/RatingsReviews';
import BuyerReports from './pages/buyer/Reports';

// Vendor Pages
import VendorRegister from './pages/vendor/vendorRegsiter';
import VendorLogin from './pages/vendor/VendorLogin';
import VendorOnboarding from './pages/vendor/VendorOnboarding';
import VendorDashboard from './pages/vendor/Dashboard';
import VendorProducts from './pages/vendor/Products';
import AddProduct from './pages/vendor/AddProduct';
import VendorOrders from './pages/vendor/Orders';
import VendorOrderDetails from './pages/vendor/OrdersDetails';
import VendorAnalytics from './pages/vendor/Analytics';
import VendorProfile from './pages/vendor/Profile';
import VendorPayment from './pages/vendor/Payment';
import VendorRefundRequests from './pages/vendor/RefundRequests';
import VendorReturnRequests from './pages/vendor/ReturnRequests';
import VendorRatingsReviews from './pages/vendor/RatingsReviews';
import VendorReports from './pages/vendor/Reports';
import Notifications from './pages/notifications/Notifications';
import Messages from './pages/chat/Messages';
import VendorSettings from './pages/vendor/Settings';

// Founder Pages
import FounderLogin from './pages/founder/Login';
import FounderDashboard from './pages/founder/Dashboard';
import FounderUsers from './pages/founder/Users';
import FounderAnalytics from './pages/founder/Analytics';
import FounderVendors from './pages/founder/Vendors';
import FounderBuyers from './pages/founder/Buyers';

import CartSync from './CartSync';

function App() {

  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  useNotificationSocket();

  useEffect(() => {
    dispatch(fetchUser());

    const handleAuthLogout = () => {
      dispatch(logout());
    };

    window.addEventListener('auth:logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [dispatch]);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/verify-change-email" element={<VerifyChangeEmail />} />
            <Route path="/resend-verification-email" element={<ResendVerificationLink />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/vendor/register" element={<VendorRegister />} />
            <Route path="/vendor/login" element={<VendorLogin />} />
            <Route path="/founder/login" element={<FounderLogin />} />
            <Route path="/security/unauthorized-email-change" element={<UnauthorizedEmailChange />} />
          </Route>

          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/vendor/:vendorId" element={<VendorDetails />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/contactus" element={<Contact />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/termsofservice" element={<TermsOfService />} />
            <Route path="/cookiepolicy" element={<CookiePolicy />} />
            <Route path="/vendor-guidelines" element={<VendorGuidelines />} />
            <Route path="/sitemap" element={<Sitemap />} />

            {/* Buyer's Route */}
            <Route
              path="/buyer/onboarding"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <CompleteProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/dashboard"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <BuyerDashboardGuard>
                    <BuyerDashboard />
                  </BuyerDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/profile"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <BuyerDashboardGuard>
                    <BuyerProfile />
                  </BuyerDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <BuyerDashboardGuard>
                    <Checkout />
                  </BuyerDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/orders"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <BuyerDashboardGuard>
                    <BuyerOrders />
                  </BuyerDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/orders/:orderId"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <BuyerDashboardGuard>
                    <BuyerOrderDetails />
                  </BuyerDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/notifications"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <BuyerDashboardGuard>
                    <Notifications />
                  </BuyerDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/wishlist"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <BuyerDashboardGuard>
                    <BuyerWishlist />
                  </BuyerDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/messages"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <BuyerDashboardGuard>
                    <Messages />
                  </BuyerDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/ratings-reviews"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <BuyerDashboardGuard>
                    <BuyerRatingsReviews />
                  </BuyerDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/reports"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <BuyerDashboardGuard>
                    <BuyerReports />
                  </BuyerDashboardGuard>
                </ProtectedRoute>
              }
            />

            {/* Vendor's Route */}
            <Route path="/vendor/onboarding" element={<VendorOnboarding />} />
            <Route
              path="/vendor/dashboard"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorDashboardGuard>
                    <VendorDashboard />
                  </VendorDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/products"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorDashboardGuard>
                    <VendorProducts />
                  </VendorDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/products/add"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorDashboardGuard>
                    <AddProduct />
                  </VendorDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/orders"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorDashboardGuard>
                    <VendorOrders />
                  </VendorDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/orders/:orderId"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorDashboardGuard>
                    <VendorOrderDetails />
                  </VendorDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/analytics"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorDashboardGuard>
                    <VendorAnalytics />
                  </VendorDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/profile"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorDashboardGuard>
                    <VendorProfile />
                  </VendorDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/payment"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorDashboardGuard>
                    <VendorPayment />
                  </VendorDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/refund-requests"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorDashboardGuard>
                    <VendorRefundRequests />
                  </VendorDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/notifications"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorDashboardGuard>
                    <Notifications />
                  </VendorDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/return-requests"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorDashboardGuard>
                    <VendorReturnRequests />
                  </VendorDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/messages"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorDashboardGuard>
                    <Messages />
                  </VendorDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/ratings-reviews"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorDashboardGuard>
                    <VendorRatingsReviews />
                  </VendorDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/reports"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorDashboardGuard>
                    <VendorReports />
                  </VendorDashboardGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/settings"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <VendorDashboardGuard>
                    <VendorSettings />
                  </VendorDashboardGuard>
                </ProtectedRoute>
              }
            />

            {/* Founder's Route */}
            <Route
              path="/founder/dashboard"
              element={
                <ProtectedRoute requiredRole="founder">
                  <FounderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/founder/users"
              element={
                <ProtectedRoute requiredRole="founder">
                  <FounderUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/founder/vendors"
              element={
                <ProtectedRoute requiredRole="founder">
                  <FounderVendors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/founder/buyers"
              element={
                <ProtectedRoute requiredRole="founder">
                  <FounderBuyers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/founder/analytics"
              element={
                <ProtectedRoute requiredRole="founder">
                  <FounderAnalytics />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
      <CartSync />
    </ThemeProvider>
  );
}

export default App;