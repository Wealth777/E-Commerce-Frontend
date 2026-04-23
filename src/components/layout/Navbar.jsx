import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    FiShoppingCart,
    FiUser,
    FiSearch,
    FiMenu,
    FiX,
    FiSun,
    FiMoon,
    FiBell,
    FiHeart,
    FiPackage,
    FiShoppingBag
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { logout } from '../../store/authSlice';
import apiClient from '../../api/apiClient';



const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, user, role } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.cart);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isDarkMode, toggleTheme } = useTheme();

    const handleLogout = async () => {
        try {
            await apiClient.post('/auth/logout');
            localStorage.setItem('cart', JSON.stringify(items));
            dispatch(logout());
            setIsMenuOpen(false);
            navigate('/');
        } catch (err) {
            dispatch(logout());
            setIsMenuOpen(false);
            navigate('/');
        }
    };

    const cartItems = useSelector(state => state.cart.items);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    //   const handleLogout = () => {
    //     const res = apiClient.post('')
    //     dispatch(logout());
    //     showToast('Successfully logged out', 'success');
    //     navigate('/');
    //   };

    const getRoleBasedLinks = () => {
        switch (role) {
            case 'founder':
                return [
                    { name: 'Founder Dashboard', path: '/founder' },
                    { name: 'Manage Vendors', path: '/founder/vendors' },
                    { name: 'Analytics', path: '/founder/analytics' },
                    { name: 'Settings', path: '/founder/settings' }
                ];
            case 'vendor':
                return [
                    { name: 'Vendor Dashboard', path: '/vendor/dashboard' },
                    { name: 'Products', path: '/vendor/products' },
                    { name: 'Orders', path: '/vendor/orders' },
                    { name: 'Analytics', path: '/vendor/analytics' },
                    { name: 'Payment', path: '/vendor/payment' },
                    { name: 'My Profile', path: '/vendor/profile' },
                ];
            case 'buyer':
                return [
                    { name: 'Dashboard', path: '/buyer/dashboard' },
                    { name: 'My Orders', path: '/buyer/orders' },
                    { name: 'My Wishlist', path: '/buyer/wishlist' },
                    { name: 'My Profile', path: '/buyer/profile' }
                ];
            default:
                return [];
        }
    };

    return (
        <nav className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <FiShoppingBag className="h-8 w-8 text-green-600" />
                            <div className="flex flex-col">
                                <span className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                                    CampusTrade
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Independent platform for the student community
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Search bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-8 mt-3">
                        <form onSubmit={handleSearch} className="w-full">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products, categories, sellers..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </form>
                    </div>

                    {/* Right side icons */}
                    <div className="flex items-center space-x-4">
                        {/* Theme toggle */}
                        {/* <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <FiSun className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <FiMoon className="h-5 w-5 text-gray-700" />
                            )}
                        </button> */}

                        <button
                            onClick={toggleTheme}
                            className={`rounded-lg border p-2 transition-all hover:shadow-md ${isDarkMode
                                ? 'border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {isDarkMode ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>



                        {/* Cart icon */}
                        <Link
                            to="/cart"
                            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="Shopping cart"
                        >
                            <FiShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>


                        {/* Notifications */}
                        {user && (
                            <button
                                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                aria-label="Notifications"
                            >
                                <FiBell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            </button>
                        )}



                        {/* Auth Links (Desktop) */}
                        {!isAuthenticated ? (
                            <div className="hidden md:flex items-center space-x-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Register
                                </Link>
                            </div>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <FiUser className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                    <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {/* {user.name || 'Account'} */}
                                        {user?.identity?.fullName || 'Account'}
                                    </span>
                                </button>

                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user ? user.identity?.fullName : 'Loading...' || 'Guest'}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400"> {user && user.contact?.email}</p>
                                            <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                                {role === 'founder' ? 'Founder' : role === 'vendor' ? 'Vendor' : 'Buyer'}
                                            </span>
                                        </div>

                                        {getRoleBasedLinks().map((link) => (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                onClick={() => setIsProfileMenuOpen(false)}
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                {link.name}
                                            </Link>
                                        ))}


                                        <button
                                            onClick={() => {
                                                setIsProfileMenuOpen(false);
                                                handleLogout();
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}


                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <FiX className="h-6 w-6" />
                            ) : (
                                <FiMenu className="h-6 w-6" />
                            )}
                        </button>
                    </div>



                    {/* Mobile menu */}
                    {isMenuOpen && (
                        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
                            {/* Mobile search */}
                            <form onSubmit={handleSearch} className="mb-4 px-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                    <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                            </form>

                            {/* Mobile links */}
                            <div className="space-y-2 px-4">
                                <Link
                                    to="/products"
                                    className="block py-2 text-gray-700 dark:text-gray-300 hover:text-green-600"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    All Products
                                </Link>

                                {!user ? (
                                    <>
                                        <Link
                                            to="/login"
                                            className="block py-2 text-gray-700 dark:text-gray-300 hover:text-green-600"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="block py-2 text-green-600 hover:text-green-700 font-medium"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Register
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        {getRoleBasedLinks().map((link) => (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-green-600"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left py-2 text-red-600 dark:text-red-400"
                                        >
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;