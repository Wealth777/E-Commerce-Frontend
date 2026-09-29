import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    FiShoppingCart,
    FiUser,
    FiSearch,
    FiMenu,
    FiX,
    FiMoon,
    FiSun
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { logout } from '../../store/authSlice';
import NotificationBell from '../notifications/NotificationBell';
import { getMessage } from '../../utils/apiResponse';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/apiClient';
import Logo from '/Campus_trade_logo_green_2.png';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, user, role } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.cart);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({
        products: [],
        vendors: [],
    });

    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchRef = useRef(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isDarkMode, toggleTheme } = useTheme();
    const { showToast } = useToast();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch live search results with a debounce effect
    useEffect(() => {
        const trimmedQuery = searchQuery.trim();
        if (!trimmedQuery) {
            setSearchResults({ products: [], vendors: [] });
            setShowSearchResults(false);
            return;
        }

        const fetchResults = async () => {
            setIsSearching(true);
            try {
                const res = await apiClient.get(`/common/search?query=${encodeURIComponent(trimmedQuery)}`);
                setSearchResults({
                    products: res.data?.data?.products || [],
                    vendors: res.data?.data?.vendors || [],
                });
                setShowSearchResults(true);
            } catch (error) {
                showToast("Failed to fetch live search results", error);
            } finally {
                setIsSearching(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleLogout = async () => {
        try {
            const res = await apiClient.post(`/auth/logout`);
            showToast(getMessage(res, "Logout successful"), 'success');
        } catch (error) {
            showToast(getMessage(error, 'Logout Failed'), 'error');
        } finally {
            localStorage.setItem("cart", JSON.stringify(items));
            dispatch(logout());
            setIsMenuOpen(false);
            setIsProfileMenuOpen(false);

            if (role === "vendor") {
                navigate("/vendor/login", { replace: true });
            } else if (role === "founder") {
                navigate("/founder/login", { replace: true });
            } else {
                navigate("/login", { replace: true });
            }
        }
    };

    const cartItems = useSelector(state => state.cart.items);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/common/search/products?search=${encodeURIComponent(searchQuery)}`);
            setShowSearchResults(false);
            setSearchQuery('');
            setIsMenuOpen(false);
        }
    };

    const handleResultClick = (path) => {
        navigate(path);
        setShowSearchResults(false);
        setSearchQuery('');
    };

    const getRoleBasedLinks = () => {
        switch (role) {
            case 'founder':
                return [
                    { name: 'Founder Dashboard', path: '/founder/dashboard' },
                    { name: 'Manage Buyers', path: '/founder/buyers' },
                    { name: 'Manage Vendors', path: '/founder/vendors' },
                    { name: 'Vendors Approval', path: '/founder/vendors-approval' },
                    { name: 'Manage Orders', path: '/founder/orders' },
                    { name: 'Manage Products', path: '/founder/products' },
                    { name: 'Manage Users Activities', path: '/founder/activities' },
                    { name: 'Analytics', path: '/founder/analytics' },
                ];
            case 'vendor':
                return [
                    { name: 'Vendor Dashboard', path: '/vendor/dashboard' },
                    { name: 'Products', path: '/vendor/products' },
                    { name: 'Orders', path: '/vendor/orders' },
                    { name: 'Notifications', path: '/vendor/notifications' },
                    { name: 'Messages', path: '/vendor/messages' },
                    { name: 'Request Refund', path: '/vendor/refund-requests' },
                    { name: 'Request Return', path: '/vendor/return-requests' },
                    { name: 'Analytics', path: '/vendor/analytics' },
                    { name: 'Payment', path: '/vendor/payment' },
                    { name: 'My Profile', path: '/vendor/profile' },
                    { name: 'Settings', path: '/vendor/settings' },
                ];
            case 'buyer':
                return [
                    { name: 'Dashboard', path: '/buyer/dashboard' },
                    { name: 'Buy Product', path: '/products' },
                    { name: 'My Orders', path: '/buyer/orders' },
                    { name: 'Notifications', path: '/buyer/notifications' },
                    { name: 'Messages', path: '/buyer/messages' },
                    { name: 'My Wishlist', path: '/buyer/wishlist' },
                    { name: 'My Profile', path: '/buyer/profile' },
                    { name: 'Settings', path: '/buyer/settings' },
                ];
            default:
                return [];
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo and brand */}
                    <div className="flex items-center flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-2">
                            <img src={Logo} alt="CampusTrade" className="h-10 w-10 md:h-9 md:w-12" />
                            <div className="flex flex-col">
                                <span className="text-lg md:text-xl font-heading font-bold text-gray-900 dark:text-white leading-tight">
                                    CampusTrade
                                </span>
                                <span className="hidden sm:block text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                                    Independent student community platform
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Search bar - Desktop with Dropdown */}
                    <div className="hidden md:flex flex-1 max-w-md lg:max-w-xl mx-4 lg:mx-8 relative" ref={searchRef}>
                        <form onSubmit={handleSearchSubmit} className="w-full">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => {
                                        if (searchQuery.trim()) setShowSearchResults(true);
                                    }}
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 transition-all"
                                />
                                <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                        </form>

                        {/* Search Dropdown Results */}
                        {showSearchResults && (
                            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                                {isSearching ? (
                                    <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        Searching...
                                    </div>
                                ) : searchResults.products.length === 0 && searchResults.vendors.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No results found for "{searchQuery}"
                                    </div>
                                ) : (
                                    <div className="p-2 space-y-4">
                                        {/* PRODUCTS SECTION */}
                                        {searchResults.products.length > 0 && (
                                            <div>
                                                <div className="px-3 py-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                                    Products
                                                </div>
                                                <div className="mt-1 space-y-1">
                                                    {searchResults.products.map((product) => (
                                                        <div
                                                            key={product._id || product.id}
                                                            onClick={() => handleResultClick(`/product/${product._id || product.id}`)}
                                                            className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                                                        >
                                                            <img
                                                                src={product.image || product.images?.[0] || 'https://via.placeholder.com/40'}
                                                                alt={product.name}
                                                                className="h-10 w-10 object-cover rounded-md flex-shrink-0"
                                                            />
                                                            <div className="flex flex-col truncate">
                                                                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                    {product.name}
                                                                </span>
                                                                <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                                                                    ₦{product.price?.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* VENDORS SECTION */}
                                        {searchResults.vendors.length > 0 && (
                                            <div>
                                                <div className="px-3 py-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider border-t border-gray-100 dark:border-gray-700 pt-3">
                                                    Vendors
                                                </div>
                                                <div className="mt-1 space-y-1">
                                                    {searchResults.vendors.map((vendor) => (
                                                        <div
                                                            key={vendor._id || vendor.id}
                                                            onClick={() => handleResultClick(`/vendor/${vendor._id || vendor.id}`)}
                                                            className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                                                        >
                                                            <img
                                                                src={vendor.business?.logo || vendor.student?.profilePhoto || 'https://via.placeholder.com/40'}
                                                                alt={vendor.storeName}
                                                                className="h-10 w-10 object-cover rounded-full flex-shrink-0"
                                                            />
                                                            <div className="flex flex-col truncate">
                                                                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                    {vendor.storeName || vendor.fullName}
                                                                </span>
                                                                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                    {vendor.category || vendor.bio || 'Verified Vendor'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-1 sm:space-x-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                        </button>

                        <NotificationBell />

                        <Link
                            to="/cart"
                            className="relative p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <FiShoppingCart size={20} />
                            {cartItems.length > 0 && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>

                        {/* Desktop Auth/Profile */}
                        <div className="hidden md:flex items-center">
                            {!isAuthenticated ? (
                                <div className="flex items-center space-x-2">
                                    <Link to="/login" className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600">
                                        Login
                                    </Link>
                                    <Link to="/register" className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700">
                                        Register
                                    </Link>
                                </div>
                            ) : (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <div className="bg-green-100 dark:bg-green-900 p-1 rounded-full">
                                            <FiUser className="h-5 w-5 text-green-700 dark:text-green-300" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                                            {user?.fullName?.split(' ')[0] || 'Account'}
                                        </span>
                                    </button>

                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 z-50 border border-gray-200 dark:border-gray-700">
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.fullName}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                                            </div>
                                            {getRoleBasedLinks().map((link) => (
                                                <Link
                                                    key={link.path}
                                                    to={link.path}
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 hover:text-green-600"
                                                >
                                                    {link.name}
                                                </Link>
                                            ))}
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu - Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 space-y-4">
                        <form onSubmit={handleSearchSubmit}>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                                <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </form>

                        <div className="flex flex-col space-y-1">
                            <Link to="/products" className="py-3 px-2 text-gray-700 dark:text-gray-300 font-medium border-b border-gray-50 dark:border-gray-700" onClick={() => setIsMenuOpen(false)}>
                                Browse Products
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    {getRoleBasedLinks().map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className="py-3 px-2 text-gray-700 dark:text-gray-300 hover:text-green-600"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left py-3 px-2 text-red-600 font-medium"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <Link to="/login" className="py-2 text-center text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                                        Login
                                    </Link>
                                    <Link to="/register" className="py-2 text-center bg-green-600 text-white rounded-lg" onClick={() => setIsMenuOpen(false)}>
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;