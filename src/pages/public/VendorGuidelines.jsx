import React from 'react';

export default function VendorGuidelines() {
  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold mb-8 text-green-900 dark:text-green-400">Vendor Guidelines</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Last updated: January 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Welcome to GMC</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These guidelines help vendors succeed on GMC. Follow these rules to build trust with buyers and maintain a good account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Product Listing Rules</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">When you list a product:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Use a clear product name</li>
              <li>Write an accurate description with all details</li>
              <li>Upload real images only (no fake or stock photos)</li>
              <li>Choose the correct product category</li>
              <li>Enter the correct stock quantity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Pricing Rules</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">Set fair prices for your products:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Use fair market prices</li>
              <li>Do not use misleading prices (no hidden charges)</li>
              <li>Do not change prices after a buyer places an order</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Delivery Standards</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">Meet buyer expectations:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Deliver items within 0 to 72 hours</li>
              <li>Confirm the delivery time before accepting the order</li>
              <li>Keep the buyer informed of progress</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Payment Process</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">Handle payments correctly:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Verify that the buyer has sent the payment</li>
              <li>Confirm payment before delivering the item</li>
              <li>Keep the buyer's payment receipt for records</li>
              <li>Never ask for payment outside GMC or without confirmation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Account Violations</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">Your account may be banned if you:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Commit fraud or use deceptive practices</li>
              <li>Repeatedly violate these guidelines</li>
              <li>Abuse the return process</li>
              <li>Send items to unverified buyers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Building Trust</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">To succeed on GMC:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Be honest in all descriptions and pricing</li>
              <li>Respond quickly to buyer questions</li>
              <li>Deliver quality items on time</li>
              <li>Handle returns with respect</li>
              <li>Keep your account information updated</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Questions?</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">Contact us for support:</p>
            <p className="text-gray-800 font-semibold">olujidewealth3@gmail.com</p>
            <p className="text-gray-700 dark:text-gray-300 mt-3">Support hours: 7am to 8pm. Response time: within 24 hours.</p>
          </section>

          <section className="mb-8 border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              By selling on GMC, you agree to follow these guidelines. GMC reserves the right to update these rules at any time.
            </p>
          </section>
        </div>
      </div>
  );
}
