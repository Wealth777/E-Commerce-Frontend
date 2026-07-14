import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    FiShoppingCart,
    FiUser,
    FiSearch,
    FiMenu,
    FiX,
    FiShoppingBag,
    FiMoon,
    FiSun
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { logout } from '../../store/authSlice';
import NotificationBell from '../notifications/NotificationBell';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, user, role } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.cart);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isDarkMode, toggleTheme } = useTheme();

    const handleLogout = () => {
        localStorage.setItem('cart', JSON.stringify(items));
        dispatch(logout());
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
        navigate('/');
    };

    const cartItems = useSelector(state => state.cart.items);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setIsMenuOpen(false); // Close mobile menu on search
        }
    };

    const getRoleBasedLinks = () => {
        switch (role) {
            case 'founder':
                return [
                    { name: 'Founder Dashboard', path: '/founder/dashboard' },
                    { name: 'Manage Vendors', path: '/founder/vendors' },
                    { name: 'Analytics', path: '/founder/analytics' },
                    { name: 'Manage Buyers', path: '/founder/buyers' }
                ];
            case 'vendor':
                return [
                    { name: 'Vendor Dashboard', path: '/vendor/dashboard' },
                    { name: 'Products', path: '/vendor/products' },
                    { name: 'Orders', path: '/vendor/orders' },
                    { name: 'Notifications', path: '/vendor/notifications' },
                    { name: 'Messages', path: '/vendor/messages' },
                    { name: 'Ratings & Reviews', path: '/vendor/ratings-reviews' },
                    { name: 'Reports', path: '/vendor/reports' },
                    { name: 'Request Refund', path: '/vendor/refund-requests' },
                    { name: 'Request Return', path: '/vendor/return-requests' },
                    { name: 'Analytics', path: '/vendor/analytics' },
                    { name: 'Payment', path: '/vendor/payment' },
                    { name: 'My Profile', path: '/vendor/profile' },
                ];
            case 'buyer':
                return [
                    { name: 'Dashboard', path: '/buyer/dashboard' },
                    { name: 'Buy Product', path: '/products' },
                    { name: 'My Orders', path: '/buyer/orders' },
                    { name: 'Notifications', path: '/buyer/notifications' },
                    { name: 'Messages', path: '/buyer/messages' },
                    { name: 'Ratings & Reviews', path: '/buyer/ratings-reviews' },
                    { name: 'Reports', path: '/buyer/reports' },
                    { name: 'My Wishlist', path: '/buyer/wishlist' },
                    { name: 'My Profile', path: '/buyer/profile' }
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
                            <FiShoppingBag className="h-7 w-7 md:h-8 md:w-8 text-green-600" />
                            <div className="flex flex-col">
                                <span className="text-lg md:text-xl font-heading font-bold text-gray-900 dark:text-white leading-tight">
                                    CampusTrade
                                </span>
                                {/* Hidden subtext on mobile to save space */}
                                <span className="hidden sm:block text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                                    Independent student community platform
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Search bar - Desktop (Centering improved) */}
                    <div className="hidden md:flex flex-1 max-w-md lg:max-w-xl mx-4 lg:mx-8">
                        <form onSubmit={handleSearch} className="w-full">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 transition-all"
                                />
                                <FiSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                        </form>
                    </div>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-1 sm:space-x-3">
                        {/* Theme toggle - Always visible */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                        </button>

                        <NotificationBell />

                        {/* Cart icon - Always visible */}
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
                                            {user?.identity?.fullName?.split(' ')[0] || 'Account'}
                                        </span>
                                    </button>

                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 z-50 border border-gray-200 dark:border-gray-700">
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.identity?.fullName}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.contact?.email}</p>
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
                        {/* Mobile search bar */}
                        <form onSubmit={handleSearch}>
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