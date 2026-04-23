import React from 'react';
import SectionCard from '../../components/cards/SectionCard';
import { 
  Shield, 
  Database, 
  Target, 
  Share2, 
  UserCheck, 
  Lock, 
  Mail,
  Eye,
  Trash2,
  FileKey
} from 'lucide-react';

const PrivacyPolicy = () => {
  const lastUpdated = "January 2026";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        {/* Last Updated Badge */}
        <div className="flex items-center gap-2 mb-8 text-sm text-slate-500 dark:text-slate-400">
          <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-full">
            Last Updated: {lastUpdated}
          </span>
        </div>

        {/* Introduction */}
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 mb-8">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            At CampusTrade, we take your privacy seriously. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you visit our website or use our services. 
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
            please do not access the site.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          <SectionCard title="Information We Collect" icon={Database}>
            <p className="mb-4">
              We collect information that you voluntarily provide to us when you register on the platform, 
              express interest in obtaining information about us or our products, or otherwise contact us.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Mail, label: "Email Address", desc: "For account communication" },
                { icon: UserCheck, label: "Phone Number", desc: "For order updates" },
                { icon: ShoppingIcon, label: "Order Details", desc: "Purchase history" },
                { icon: Eye, label: "Usage Data", desc: "How you use our platform" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <item.icon className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{item.label}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Why We Collect Your Data" icon={Target}>
            <p className="mb-4">Your data helps us provide and improve our services in the following ways:</p>
            <ul className="space-y-3">
              {[
                "Provide, operate, and maintain our website and services",
                "Improve, personalize, and expand our platform",
                "Understand and analyze how you use our website",
                "Develop new products, services, features, and functionality",
                "Communicate with you about orders, updates, and support",
                "Send you emails and notifications about your account",
                "Find and prevent fraud and unauthorized access"
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

          <SectionCard title="Third-Party Services" icon={Share2}>
            <p className="mb-4">
              We may share your information with third-party vendors, service providers, contractors, 
              or agents who perform services for us or on our behalf. These services include:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Payment processing",
                "Data analysis",
                "Email delivery",
                "Hosting services",
                "Customer service",
                "Marketing assistance"
              ].map((service) => (
                <div key={service} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-700 dark:text-slate-300">{service}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Your Privacy Rights" icon={UserCheck}>
            <p className="mb-4">You have certain rights regarding your personal information:</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Access", desc: "View your personal data" },
                { title: "Rectification", desc: "Correct inaccurate information" },
                { title: "Erasure", desc: "Request data deletion" },
                { title: "Portability", desc: "Export your data" },
                { title: "Restriction", desc: "Limit data processing" },
                { title: "Objection", desc: "Opt-out of certain uses" },
              ].map((right) => (
                <div key={right.title} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors duration-200">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{right.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{right.desc}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Data Protection & Security" icon={Lock}>
            <p className="mb-4">
              We have implemented appropriate technical and organizational security measures designed 
              to protect the security of any personal information we process. However, despite our 
              safeguards and efforts to secure your information, no electronic transmission over the 
              Internet or information storage technology can be guaranteed to be 100% secure.
            </p>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FileKey className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-emerald-900 dark:text-emerald-300">Security Measures</h4>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                    SSL encryption, regular security audits, access controls, and secure data centers
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Data Retention" icon={Trash2}>
            <p>
              We will only keep your personal information for as long as it is necessary for the purposes 
              set out in this privacy policy, unless a longer retention period is required or permitted by law. 
              When we have no ongoing legitimate business need to process your personal information, we will 
              either delete or anonymize it.
            </p>
          </SectionCard>
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-2xl p-8 text-center">
          <Mail className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">Questions About Privacy?</h3>
          <p className="text-slate-400 mb-6 max-w-lg mx-auto">
            If you have any questions or concerns about our Privacy Policy, please don't hesitate to contact us.
          </p>
          <a
            href="mailto:olujidewealth3@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
          >
            <Mail className="w-5 h-5" />
            olujidewealth3@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

// Helper icon component
const ShoppingIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export default PrivacyPolicy;