import React from 'react';

export default function CookiePolicy() {
  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold mb-8 text-green-900 dark:text-green-400">Cookie Policy</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Last updated: January 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">What Are Cookies?</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Cookies are small files that your browser stores on your device. They help websites remember your preferences and improve your experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Cookies We Use</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">GMC uses only preference cookies. These cookies:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Remember your login information</li>
              <li>Store your theme preference (dark mode or light mode)</li>
              <li>Keep your language preference</li>
              <li>Remember items in your cart</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              We do not use analytics cookies or advertising cookies. We do not track your activity on other websites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Cookie Control</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">You can manage cookies from your settings page:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Go to your account settings</li>
              <li>Find the privacy or cookie section</li>
              <li>Enable or disable cookies as you prefer</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              You can also control cookies through your browser settings. Most browsers allow you to refuse cookies or alert you when cookies are sent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">No Tracking</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              GMC does not use cookies to track you across the internet. Your browsing activity on other websites is not our concern.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Questions About Cookies</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">If you have questions about our cookie policy, contact us at:</p>
            <p className="text-gray-800 font-semibold">olujidewealth3@gmail.com</p>
            <p className="text-gray-700 dark:text-gray-300 mt-3">Support hours: 7am to 8pm. Response time: within 24 hours.</p>
          </section>

          <section className="mb-8 border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              By using GMC, you agree to our use of preference cookies as described in this policy.
            </p>
          </section>
        </div>
      </div>
  );
}
