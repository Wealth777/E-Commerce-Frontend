import React from 'react';
import SectionCard from '../../components/cards/SectionCard';
import { 
  Map, 
  Home, 
  Package, 
  Grid3X3, 
  Info, 
  Phone, 
  Shield, 
  FileText, 
  Cookie,
  Users,
  LogIn,
  UserPlus,
  LayoutDashboard,
  User,
  ShoppingCart,
  Heart,
  Settings,
  Plus,
  Edit3,
  BarChart3,
  FileBarChart,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Sitemap = () => {

  const sections = [
    {
      title: 'Public Pages',
      icon: Home,
      links: [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Products', path: '/products', icon: Package },
        { label: 'Categories', path: '/products', icon: Grid3X3 },
        { label: 'About Us', path: '/aboutus', icon: Info },
        { label: 'Contact', path: '/contactus', icon: Phone },
        { label: 'Privacy Policy', path: '/privacypolicy', icon: Shield },
        { label: 'Terms of Service', path: '/termsofservice', icon: FileText },
        { label: 'Cookie Policy', path: '/cookiepolicy', icon: Cookie },
        { label: 'Sitemap', path: '/sitemap', icon: Map },
      ]
    },
    {
      title: 'Authentication',
      icon: LogIn,
      links: [
        { label: 'Login', path: '/login', icon: LogIn },
        { label: 'Register', path: '/register', icon: UserPlus },
        { label: 'Vendor Login', path: '/register', icon: LogIn },
        { label: 'Vendor Register', path: '/vendor/register', icon: UserPlus },
        { label: 'Forgot Password', path: '/forgot-password', icon: Shield },
      ]
    },
    {
      title: 'Buyer Dashboard',
      icon: ShoppingCart,
      links: [
        { label: 'Dashboard', path: '/buyer/dashboard', icon: LayoutDashboard },
        { label: 'Profile', path: '/buyer/profile', icon: User },
        { label: 'My Orders', path: '/buyer/orders', icon: Package },
        { label: 'Order Details', path: '/buyer/orders/:id', icon: FileText },
        { label: 'Wishlist', path: '/buyer/wishlist', icon: Heart },
        { label: 'Shopping Cart', path: '/cart', icon: ShoppingCart },
        { label: 'Settings', path: '/buyer/profile', icon: Settings },
      ]
    },
    {
      title: 'Vendor Dashboard',
      icon: Package,
      links: [
        { label: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
        { label: 'Profile', path: '/vendor/profile', icon: User },
        { label: 'My Products', path: '/vendor/products', icon: Package },
        { label: 'Add Product', path: '/vendor/products/add', icon: Plus },
            { label: 'Edit Product', path: '/vendor/products/:id/edit', icon: Edit3 },
        { label: 'Orders', path: '/vendor/orders', icon: ShoppingCart },
        { label: 'Order Details', path: '/vendor/orders/:id', icon: FileText },
        { label: 'Settings', path: '/vendor/profile', icon: Settings },
      ]
    },
    // {
    //   title: 'Founder Dashboard',
    //   icon: Users,
    //   links: [
    //     { label: 'Dashboard', path: '/founder/dashboard', icon: LayoutDashboard },
    //     { label: 'User Management', path: '/founder/users', icon: Users },
    //     { label: 'Analytics', path: '/founder/analytics', icon: BarChart3 },
    //     { label: 'Reports', path: '/founder/reports', icon: FileBarChart },
    //     { label: 'Settings', path: '/founder/settings', icon: Settings },
    //   ]
    // },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {sections.map((section) => (
            <SectionCard
              key={section.title}
              title={section.title}
              icon={section.icon}
            >
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={`${link.path}-${index}`}>
                    <Link
                      to={link.path}
                      className="group flex items-center gap-3 p-2 -mx-2 rounded-lg transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {link.icon && (
                        <link.icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors duration-200" />
                      )}
                      <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                        {link.label}
                      </span>
                      <span className="ml-auto text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {link.path}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </SectionCard>
          ))}
        </div>

        {/* Quick Navigation */}
        <div className="mt-12 text-center bg-gradient-to-br from-green-700 to-green-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <h3 className="text-2xl font-bold text-yellow-300 mb-3">Can't find what you're looking for?</h3>
          <p className="text-white mb-6 max-w-lg mx-auto">
            Browse our most popular sections or contact our support team for assistance
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/products"
              className="px-6 py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-yellow-400 hover:text-green-900 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Browse Products
            </Link>
            <Link
              to="/contactus"
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold border-2 hover:bg-white border-green-400 hover:text-green-700 transition-all duration-200"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;