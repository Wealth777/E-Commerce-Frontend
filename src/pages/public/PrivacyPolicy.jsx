import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const PrivacyPolicy = () => {
  const { isDark } = useTheme();
  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgColor} py-12 px-4`}>
      <div className={`max-w-4xl mx-auto ${cardBg} shadow-lg rounded-lg p-8`}>
        <h1 className={`text-3xl font-bold ${textColor} mb-6`}>Privacy Policy</h1>

        <section className="mb-6">
          <h2 className={`text-2xl font-semibold ${textColor} mb-4`}>Information We Collect</h2>
          <p className={`${secondaryText} mb-4`}>We collect the following information to provide our services:</p>
          <ul className={`list-disc list-inside ${secondaryText} space-y-2`}>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Order details</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className={`text-2xl font-semibold ${textColor} mb-4`}>Why We Collect Your Data</h2>
          <p className={`${secondaryText} mb-4`}>Your data helps us:</p>
          <ul className={`list-disc list-inside ${secondaryText} space-y-2`}>
            <li>Provide account access</li>
            <li>Process orders</li>
            <li>Offer customer support</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className={`text-2xl font-semibold ${textColor} mb-4`}>Third-Party Services</h2>
          <p className={`${secondaryText} mb-4`}>We use these services to support our platform:</p>
          <ul className={`list-disc list-inside ${secondaryText} space-y-2`}>
            <li>Email service provider</li>
            <li>Authentication service</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className={`text-2xl font-semibold ${textColor} mb-4`}>Your Rights</h2>
          <p className={`${secondaryText} mb-4`}>You have the right to:</p>
          <ul className={`list-disc list-inside ${secondaryText} space-y-2`}>
            <li>View your order history</li>
            <li>Request a refund</li>
            <li>Delete your account</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className={`text-2xl font-semibold ${textColor} mb-4`}>Data Protection</h2>
          <p className={`${secondaryText} mb-4`}>We protect your data with:</p>
          <ul className={`list-disc list-inside ${secondaryText} space-y-2`}>
            <li>Reasonable security practices</li>
            <li>No sale of user data</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-2xl font-semibold ${textColor} mb-4`}>Contact for Privacy Issues</h2>
          <p className={secondaryText}>For privacy concerns, email us at: <a href="mailto:olujidewealth3@gmail.com" className="text-blue-600 hover:underline">olujidewealth3@gmail.com</a></p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;