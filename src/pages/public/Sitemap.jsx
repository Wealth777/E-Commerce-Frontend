import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Sitemap = () => {
  const { isDark } = useTheme();
  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgColor} py-12 px-4`}>
      <div className={`max-w-4xl mx-auto ${cardBg} shadow-lg rounded-lg p-8`}>
        <h1 className={`text-3xl font-bold ${textColor} mb-6`}>Sitemap</h1>

        <section className="mb-6">
          <h2 className={`text-2xl font-semibold ${textColor} mb-4`}>Public Pages</h2>
          <ul className={`list-disc list-inside ${secondaryText} space-y-2`}>
            <li>Home</li>
            <li>Products</li>
            <li>Categories</li>
            <li>About Us</li>
            <li>Contact</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookie Policy</li>
            <li>Vendor Guidelines</li>
            <li>Login</li>
            <li>Register</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className={`text-2xl font-semibold ${textColor} mb-4`}>Buyer Dashboard Routes</h2>
          <ul className={`list-disc list-inside ${secondaryText} space-y-2`}>
            <li>Dashboard</li>
            <li>Profile</li>
            <li>Orders (/buyer/orders)</li>
            <li>Order Details (/buyer/orders/:id)</li>
            <li>Wishlist</li>
            <li>Cart</li>
            <li>Settings</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className={`text-2xl font-semibold ${textColor} mb-4`}>Vendor Dashboard Routes</h2>
          <ul className={`list-disc list-inside ${secondaryText} space-y-2`}>
            <li>Dashboard</li>
            <li>Profile</li>
            <li>Products (/vendor/products)</li>
            <li>Add Product (/vendor/products/add)</li>
            <li>Edit Product (/vendor/products/:id/edit)</li>
            <li>Orders (/vendor/orders)</li>
            <li>Order Details (/vendor/orders/:id)</li>
            <li>Settings</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-2xl font-semibold ${textColor} mb-4`}>Founder Dashboard Routes</h2>
          <ul className={`list-disc list-inside ${secondaryText} space-y-2`}>
            <li>Dashboard</li>
            <li>Users (/founder/users)</li>
            <li>Analytics</li>
            <li>Reports</li>
            <li>Settings</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Sitemap;