import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from './store/index';
import { ThemeProvider } from './context/ThemeContext';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from './store/authSlice';
// import { fetchCart } from './store/cartActions';
import { mergeCart } from './store/cartActions';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Products from './pages/public/Products';
import ProductDetail from './pages/public/ProductDetail';
import AboutUs from './pages/public/AboutUs';
import Contact from './pages/public/Contact';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsOfService from './pages/public/TermsOfService';
import CookiePolicy from './pages/public/CookiePolicy';
import VendorGuidelines from './pages/public/VendorGuidelines';
import Sitemap from './pages/public/Sitemap';

// Buyer Pages
import BuyerDashboard from './pages/buyer/Dashboard';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import BuyerOrders from './pages/buyer/Orders';
import BuyerOrderDetails from './pages/buyer/OrdersDetails';
import BuyerProfile from './pages/buyer/Profile';
import BuyerWishlist from './pages/buyer/Wishlist';

// Vendor Pages
import VendorDashboard from './pages/vendor/Dashboard';
import VendorProducts from './pages/vendor/Products';
import AddProduct from './pages/vendor/AddProduct';
import VendorOrders from './pages/vendor/Orders';
import VendorOrderDetails from './pages/vendor/OrdersDetails';
import VendorAnalytics from './pages/vendor/Analytics';
import VendorProfile from './pages/vendor/Profile';
import VendorPayment from './pages/vendor/Payment';

// Founder Pages
import FounderDashboard from './pages/founder/Dashboard';
import FounderUsers from './pages/founder/Users';
import FounderAnalytics from './pages/founder/Analytics';

import CartSync from './CartSync';

function App() {

  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     dispatch(fetchCart());
  //   }
  // }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(mergeCart());
    }
  }, [isAuthenticated]);


  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/contactus" element={<Contact />} />
                <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                <Route path="/termsofservice" element={<TermsOfService />} />
                <Route path="/cookiepolicy" element={<CookiePolicy />} />
                <Route path="/vendor-guidelines" element={<VendorGuidelines />} />
                <Route path="/sitemap" element={<Sitemap />} />

                {/* Buyer Routes */}
                <Route
                  path="/buyer/dashboard"
                  element={
                    <ProtectedRoute requiredRole="buyer">
                      <BuyerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/buyer/profile"
                  element={
                    <ProtectedRoute requiredRole="buyer">
                      <BuyerProfile />
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
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/buyer/orders"
                  element={
                    <ProtectedRoute requiredRole="buyer">
                      <BuyerOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/buyer/orders/:orderId"
                  element={
                    <ProtectedRoute requiredRole="buyer">
                      <BuyerOrderDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/buyer/wishlist"
                  element={
                    <ProtectedRoute requiredRole="buyer">
                      <BuyerWishlist />
                    </ProtectedRoute>
                  }
                />

                {/* Vendor Routes */}
                <Route
                  path="/vendor/dashboard"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <VendorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/products"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <VendorProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/products/add"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <AddProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/orders"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <VendorOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/orders/:orderId"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <VendorOrderDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/analytics"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <VendorAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/profile"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <VendorProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor/payment"
                  element={
                    <ProtectedRoute requiredRole="vendor">
                      <VendorPayment />
                    </ProtectedRoute>
                  }
                />

                {/* Founder Routes */}
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
                  path="/founder/analytics"
                  element={
                    <ProtectedRoute requiredRole="founder">
                      <FounderAnalytics />
                    </ProtectedRoute>
                  }
                />

                {/* Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Router>
        <CartSync />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
