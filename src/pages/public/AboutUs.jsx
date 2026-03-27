import React from 'react';

export default function AboutUs() {
  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold mb-8 text-green-900 dark:text-green-400">About GMC</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Who We Are</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              GMC is an independent e-commerce platform. We are not connected to any company or school. We are built and run independently to serve our community.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">What We Do</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              GMC connects Buyers and Vendors in Ilesa town. We make buying and selling easy, safe, and simple. Our platform is built for people who want to trade with trust and confidence.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We are here to support young people and local buyers who want to buy and sell quality items. We believe in community commerce - where trust matters and honest deals happen.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Our Values</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">We believe in:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Trust:</strong> Honest dealings between Buyers and Vendors</li>
              <li><strong>Simplicity:</strong> Easy to use, no complicated processes</li>
              <li><strong>Community:</strong> Supporting local buyers and sellers</li>
              <li><strong>Transparency:</strong> Clear rules and fair treatment for all</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">How It Works</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">GMC is different from other platforms:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Buyers and Vendors connect directly</li>
              <li>No payment gateway. Payments are made directly between buyer and seller</li>
              <li>All payments are verified to prevent fraud</li>
              <li>We support buyers and sellers with clear rules</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Why Choose GMC?</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Built for your community in Ilesa</li>
              <li>Independent and not owned by big companies</li>
              <li>Fair rules for both buyers and vendors</li>
              <li>Quick support when you need help</li>
              <li>Simple and easy to use</li>
              <li>Your data is safe with us</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">Have questions about GMC? We are here to help:</p>
            <p className="text-gray-800 font-semibold">olujidewealth3@gmail.com</p>
            <p className="text-gray-700 dark:text-gray-300 mt-3">Support hours: 7am to 8pm. Response time: within 24 hours.</p>
          </section>

          <section className="mb-8 border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Our Commitment</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We are committed to keeping GMC safe, fair, and useful for everyone. We listen to your feedback and keep improving our platform to serve you better.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Thank you for being part of the GMC community.
            </p>
          </section>
        </div>
      </div>
  );
}