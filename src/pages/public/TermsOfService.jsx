// import React from 'react';

// export default function TermsOfService() {
//   return (
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
//         <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
//           <h1 className="text-4xl font-bold mb-8 text-green-900 dark:text-green-400">Terms of Service</h1>
//           <p className="text-gray-600 dark:text-gray-300 mb-6">Last updated: January 2026</p>

//           <section className="mb-8">
//             <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-400">About GMC</h2>
//             <p className="text-gray-700 dark:text-gray-300 mb-4">
//               GMC is an independent e-commerce platform. By using GMC, you agree to follow these terms. These rules apply to all users - Buyers, Vendors, and Founders.
//             </p>
//           </section>

//           <section className="mb-8">
//             <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-400">Account Rules</h2>
//             <p className="text-gray-700 dark:text-gray-300 mb-3">When you create an account:</p>
//             <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
//               <li>Verify your email address</li>
//               <li>Use a strong password (at least 8 characters with letters and numbers)</li>
//               <li>Logout after using shared devices or public computers</li>
//               <li>You are responsible for all activities on your account</li>
//             </ul>
//           </section>

//           <section className="mb-8">
//             <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-400">Buyer Responsibilities</h2>
//             <p className="text-gray-700 dark:text-gray-300 mb-3">If you buy items on GMC:</p>
//             <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
//               <li>Register as a Buyer with accurate information</li>
//               <li>Check item details before ordering</li>
//               <li>Pay the exact amount shown in your order</li>
//               <li>Use the verified Vendor account details for payment</li>
//               <li>Add a clear transfer description during payment</li>
//               <li>Send your payment receipt to the Vendor's verified WhatsApp number</li>
//               <li>Do not engage in fraud or deceptive practices</li>
//             </ul>
//           </section>

//           <section className="mb-8">
//             <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-400">Vendor Responsibilities</h2>
//             <p className="text-gray-700 dark:text-gray-300 mb-3">If you sell items on GMC:</p>
//             <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
//               <li>Register as a Vendor with accurate business details</li>
//               <li>Add complete and accurate product descriptions</li>
//               <li>Set correct pricing for each item</li>
//               <li>Provide valid payment and business information</li>
//               <li>Confirm buyer payment before sending any items</li>
//               <li>Deliver items only to verified Buyers</li>
//               <li>Do not engage in fraud or deceptive practices</li>
//             </ul>
//           </section>

//           <section className="mb-8">
//             <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-400">Return and Refund Policy</h2>
            
//             <h3 className="text-xl font-semibold mb-3 text-green-800 mt-6">Return Window</h3>
//             <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
//               <li>You have 7 to 14 days from delivery to request a return</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 text-green-800 mt-6">Item Condition for Return</h3>
//             <p className="text-gray-700 dark:text-gray-300 mb-2">Items must be:</p>
//             <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
//               <li>Unused and unworn</li>
//               <li>In original packaging</li>
//               <li>With tags intact</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 text-green-800 mt-6">Proof Required</h3>
//             <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
//               <li>Valid Order ID</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 text-green-800 mt-6">What Cannot Be Returned</h3>
//             <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
//               <li>Perishable items (food, plants)</li>
//               <li>Digital goods (software, e-books)</li>
//               <li>Custom or personalized items</li>
//               <li>Clearance items</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 text-green-800 mt-6">Return Approval</h3>
//             <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
//               <li>Your return request will be reviewed manually or based on rules</li>
//               <li>Approval happens before you ship the item back</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 text-green-800 mt-6">Refund Processing</h3>
//             <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
//               <li>Refund happens after the item is inspected</li>
//               <li>Refund goes back to your original payment method</li>
//               <li>Processing takes 3 to 10 business days</li>
//               <li>You receive the item price refund</li>
//               <li>Shipping is refunded only if it was the Vendor's fault</li>
//               <li>Partial refunds are allowed</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 text-green-800 mt-6">Return Shipping Costs</h3>
//             <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
//               <li>If Vendor fault: Vendor pays for return shipping</li>
//               <li>If Buyer remorse: Buyer pays for return shipping</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 text-green-800 mt-6">Valid Return Reasons</h3>
//             <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
//               <li>Wrong item was sent</li>
//               <li>Item arrived damaged</li>
//               <li>Item is defective</li>
//               <li>Size or fit issue</li>
//               <li>Change of mind with a clear reason</li>
//             </ul>

//             <h3 className="text-xl font-semibold mb-3 text-green-800 mt-6">System Limits</h3>
//             <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
//               <li>You can have one active return per order</li>
//               <li>Return expires after 48 to 72 hours if the item is not shipped back</li>
//             </ul>
//           </section>

//           <section className="mb-8">
//             <h2 className="text-2xl font-semibold mb-4 text-green-800 dark:text-green-400">Account Enforcement</h2>
//             <p className="text-gray-700 dark:text-gray-300 mb-3">Your account may be suspended or banned if you:</p>
//             <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
//               <li>Commit fraud or deception</li>
//               <li>Repeatedly violate these terms</li>
//             </ul>
//           </section>

//           <section className="mb-8 border-t border-gray-200 dark:border-gray-700 pt-8">
//             <p className="text-gray-600 dark:text-gray-400 text-sm">
//               These terms apply to all users of GMC. We may update these terms at any time. Your continued use of GMC means you accept the updated terms.
//             </p>
//           </section>
//         </div>
//       </div>
//   );
// }

import React from 'react';
import SectionCard from '../../components/cards/SectionCard';
import { 
  FileText, 
  Users, 
  ShoppingBag, 
  Store,
  Package,
  RefreshCw,
  Ban,
  Scale,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  ShieldCheck,
  Mail
} from 'lucide-react';

const TermsOfService = () => {

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        {/* Introduction */}
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 mb-8">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Welcome to CampusTrade. These Terms of Service govern your use of our website and services. 
            By accessing or using our platform, you agree to be bound by these terms. If you disagree 
            with any part of the terms, you may not access our services.
          </p>
        </div>

        <div className="space-y-6">
          {/* About GMC */}
          <SectionCard title="About CampusTrade" icon={Store}>
            <p>
              CampusTrade is an independent e-commerce platform connecting buyers with vendors. 
              We provide the technology infrastructure that enables transactions between users. 
              These terms apply to all users including Buyers, Vendors, and Administrators.
            </p>
          </SectionCard>

          {/* Account Rules */}
          <SectionCard title="Account Registration & Security" icon={Users}>
            <p className="mb-4">When you create an account with us, you must provide accurate and complete information:</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: CheckCircle, text: "Verify your email address" },
                { icon: CheckCircle, text: "Use a strong password (min 8 characters)" },
                { icon: CheckCircle, text: "Include letters and numbers in password" },
                { icon: CheckCircle, text: "Keep login credentials secure" },
                { icon: CheckCircle, text: "Logout from shared devices" },
                { icon: AlertCircle, text: "Report unauthorized access immediately" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <item.icon className="w-5 h-5 text-emerald-500" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <p className="text-amber-700 dark:text-amber-400 text-sm">
                <strong>Important:</strong> You are responsible for all activities that occur under your account. 
                Notify us immediately of any unauthorized use.
              </p>
            </div>
          </SectionCard>

          {/* Buyer Responsibilities */}
          <SectionCard title="Buyer Responsibilities" icon={ShoppingBag}>
            <p className="mb-4">As a buyer on our platform, you agree to:</p>
            <ul className="space-y-3">
              {[
                "Register with accurate personal information",
                "Review item details, pricing, and vendor ratings before ordering",
                "Pay the exact amount shown in your order summary",
                "Use only verified vendor account details for payment",
                "Include clear transfer descriptions with your payment",
                "Send payment receipts to the vendor's verified contact",
                "Communicate respectfully with vendors",
                "Not engage in fraudulent or deceptive practices"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{index + 1}</span>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Vendor Responsibilities */}
          <SectionCard title="Vendor Responsibilities" icon={Package}>
            <p className="mb-4">As a vendor on our platform, you agree to:</p>
            <ul className="space-y-3">
              {[
                "Register with accurate business information",
                "Provide complete and truthful product descriptions",
                "Set accurate and competitive pricing",
                "Maintain valid payment and contact information",
                "Confirm buyer payments before shipping items",
                "Ship only to verified buyer addresses",
                "Respond to buyer inquiries within 24 hours",
                "Maintain high standards of product quality",
                "Not engage in fraudulent or deceptive practices"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{index + 1}</span>
                  </div>
                  <span className="text-slate-700 dark:text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Return & Refund Policy */}
          <SectionCard title="Return & Refund Policy" icon={RefreshCw}>
            <div className="space-y-6">
              {/* Return Window */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  Return Window
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  You have <strong>7 to 14 days</strong> from the delivery date to request a return.
                </p>
              </div>

              {/* Item Condition */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-500" />
                  Item Condition Requirements
                </h4>
                <div className="grid sm:grid-cols-3 gap-3 mt-3">
                  {["Unused and unworn", "Original packaging", "Tags intact"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Returnable Items */}
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <h4 className="font-semibold text-red-900 dark:text-red-300 mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Non-Returnable Items
                </h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    "Perishable items (food, plants)",
                    "Digital goods (software, e-books)",
                    "Custom or personalized items",
                    "Clearance/sale items marked as final"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400">
                      <XCircle className="w-3 h-3" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Refund Processing */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                <h4 className="font-semibold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Refund Processing
                </h4>
                <ul className="space-y-2 text-sm text-emerald-700 dark:text-emerald-400">
                  <li>• Refund issued after item inspection</li>
                  <li>• Returned to original payment method</li>
                  <li>• Processing time: 3-10 business days</li>
                  <li>• Item price always refunded</li>
                  <li>• Shipping refunded only if vendor's fault</li>
                </ul>
              </div>

              {/* Shipping Costs */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-500" />
                  Return Shipping Costs
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Vendor Fault</span>
                    <p className="text-xs text-slate-500 mt-1">Vendor pays return shipping</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Buyer Remorse</span>
                    <p className="text-xs text-slate-500 mt-1">Buyer pays return shipping</p>
                  </div>
                </div>
              </div>

              {/* Valid Reasons */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Valid Return Reasons</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Wrong item sent",
                    "Item damaged",
                    "Defective product",
                    "Size/fit issue",
                    "Not as described",
                    "Change of mind (with reason)"
                  ].map((reason) => (
                    <span key={reason} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm text-slate-700 dark:text-slate-300">
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Account Enforcement */}
          <SectionCard title="Account Enforcement" icon={Ban}>
            <p className="mb-4">
              We reserve the right to suspend or terminate your account if you violate these terms:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { level: "Warning", desc: "Minor first-time violations" },
                { level: "Temporary Suspension", desc: "Repeated minor violations" },
                { level: "Permanent Ban", desc: "Serious violations or fraud" },
                { level: "Legal Action", desc: "Criminal activity" },
              ].map((item) => (
                <div key={item.level} className="p-4 border border-red-200 dark:border-red-800 rounded-xl bg-red-50/50 dark:bg-red-900/10">
                  <h4 className="font-semibold text-red-800 dark:text-red-300">{item.level}</h4>
                  <p className="text-sm text-red-600 dark:text-red-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Dispute Resolution */}
          <SectionCard title="Dispute Resolution" icon={Scale}>
            <p>
              Any disputes arising from these terms will be resolved through good faith negotiations. 
              If a resolution cannot be reached, disputes will be subject to the exclusive jurisdiction 
              of the courts in our operating region.
            </p>
          </SectionCard>
        </div>

        {/* Contact & Agreement */}
        <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-2xl p-8 text-center">
          <Scale className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">Agreement</h3>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            By using CampusTrade, you acknowledge that you have read, understood, and agree to be bound 
            by these Terms of Service. We reserve the right to modify these terms at any time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:olujidewealth3@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all duration-200"
            >
              <Mail className="w-5 h-5" />
              Contact Legal Team
            </a>
          </div>
          <p className="text-slate-500 text-sm mt-4">
            Questions about these terms? We're here to help.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
