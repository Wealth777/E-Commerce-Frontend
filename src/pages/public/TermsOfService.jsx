import React from 'react';

export default function TermsOfService() {
  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold mb-8 text-green-900 dark:text-green-400">Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Last updated: January 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-400">About GMC</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              GMC is an independent e-commerce platform. By using GMC, you agree to follow these terms. These rules apply to all users - Buyers, Vendors, and Founders.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-400">Account Rules</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">When you create an account:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Verify your email address</li>
              <li>Use a strong password (at least 8 characters with letters and numbers)</li>
              <li>Logout after using shared devices or public computers</li>
              <li>You are responsible for all activities on your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-400">Buyer Responsibilities</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">If you buy items on GMC:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Register as a Buyer with accurate information</li>
              <li>Check item details before ordering</li>
              <li>Pay the exact amount shown in your order</li>
              <li>Use the verified Vendor account details for payment</li>
              <li>Add a clear transfer description during payment</li>
              <li>Send your payment receipt to the Vendor's verified WhatsApp number</li>
              <li>Do not engage in fraud or deceptive practices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-400">Vendor Responsibilities</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">If you sell items on GMC:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Register as a Vendor with accurate business details</li>
              <li>Add complete and accurate product descriptions</li>
              <li>Set correct pricing for each item</li>
              <li>Provide valid payment and business information</li>
              <li>Confirm buyer payment before sending any items</li>
              <li>Deliver items only to verified Buyers</li>
              <li>Do not engage in fraud or deceptive practices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-400">Return and Refund Policy</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-green-800 mt-6">Return Window</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>You have 7 to 14 days from delivery to request a return</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-green-800 mt-6">Item Condition for Return</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">Items must be:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Unused and unworn</li>
              <li>In original packaging</li>
              <li>With tags intact</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-green-800 mt-6">Proof Required</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Valid Order ID</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-green-800 mt-6">What Cannot Be Returned</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Perishable items (food, plants)</li>
              <li>Digital goods (software, e-books)</li>
              <li>Custom or personalized items</li>
              <li>Clearance items</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-green-800 mt-6">Return Approval</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Your return request will be reviewed manually or based on rules</li>
              <li>Approval happens before you ship the item back</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-green-800 mt-6">Refund Processing</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Refund happens after the item is inspected</li>
              <li>Refund goes back to your original payment method</li>
              <li>Processing takes 3 to 10 business days</li>
              <li>You receive the item price refund</li>
              <li>Shipping is refunded only if it was the Vendor's fault</li>
              <li>Partial refunds are allowed</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-green-800 mt-6">Return Shipping Costs</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>If Vendor fault: Vendor pays for return shipping</li>
              <li>If Buyer remorse: Buyer pays for return shipping</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-green-800 mt-6">Valid Return Reasons</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Wrong item was sent</li>
              <li>Item arrived damaged</li>
              <li>Item is defective</li>
              <li>Size or fit issue</li>
              <li>Change of mind with a clear reason</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-green-800 mt-6">System Limits</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>You can have one active return per order</li>
              <li>Return expires after 48 to 72 hours if the item is not shipped back</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-400">Account Enforcement</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">Your account may be suspended or banned if you:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Commit fraud or deception</li>
              <li>Repeatedly violate these terms</li>
            </ul>
          </section>

          <section className="mb-8 border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              These terms apply to all users of GMC. We may update these terms at any time. Your continued use of GMC means you accept the updated terms.
            </p>
          </section>
        </div>
      </div>
  );
}
