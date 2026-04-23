import React, { useState } from 'react';
import { 
  Store, 
  DollarSign, 
  Truck, 
  CreditCard, 
  ShieldAlert, 
  Heart, 
  HelpCircle, 
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Package,
  MessageCircle
} from 'lucide-react';
const cn = (...classes) => classes.filter(Boolean).join(' ');
const SectionCard = ({ icon: Icon, title, children, variant = 'default' }) => {
  const variants = {
    default: 'border-emerald-100 dark:border-emerald-800/30',
    warning: 'border-amber-100 dark:border-amber-800/30',
    success: 'border-emerald-100 dark:border-emerald-800/30',
    info: 'border-blue-100 dark:border-blue-800/30'
  };
  const iconColors = {
    default: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
  };
  return (
    <div className={cn(
      'group rounded-2xl border bg-white dark:bg-gray-800/50 p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
      variants[variant]
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110',
          iconColors[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {title}
          </h3>
          {children}
        </div>
      </div>
    </div>
  );
};
const BulletList = ({ items }) => (
  <ul className="space-y-2.5">
    {items.map((item, index) => (
      <li key={index} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
        <span className="text-sm leading-relaxed">{item}</span>
      </li>
    ))}
  </ul>
);
const AccordionItem = ({ title, children, isOpen, onToggle }) => (
  <div className="border-b border-gray-100 dark:border-gray-700 last:border-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-4 text-left group"
    >
      <span className="font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
        {title}
      </span>
      <span className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
        isOpen 
          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400 rotate-180" 
          : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
      )}>
        <ChevronDown className="w-4 h-4" />
      </span>
    </button>
    <div className={cn(
      "overflow-hidden transition-all duration-300",
      isOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
    )}>
      {children}
    </div>
  </div>
);
export default function VendorGuidelines() {
  const [openSection, setOpenSection] = useState('welcome');
  const [activeTab, setActiveTab] = useState('guidelines');
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };
  const guidelinesData = [
    {
      id: 'welcome',
      icon: Store,
      title: 'Welcome to CampusTrade',
      content: 'These guidelines help vendors succeed on CampusTrade. Follow these rules to build trust with buyers and maintain a good account standing. We\'re committed to creating a marketplace where quality vendors thrive.',
      variant: 'default'
    },
    {
      id: 'listing',
      icon: Package,
      title: 'Product Listing Rules',
      items: [
        'Use clear, descriptive product names that accurately represent your items',
        'Write comprehensive descriptions with all relevant details and specifications',
        'Upload only real product images - no fake, stock, or misleading photos',
        'Select the correct product category to ensure proper visibility',
        'Maintain accurate stock quantities to prevent overselling'
      ],
      variant: 'default'
    },
    {
      id: 'pricing',
      icon: DollarSign,
      title: 'Pricing Rules',
      items: [
        'Set fair market prices that reflect the true value of your products',
        'Be transparent - no hidden charges or misleading pricing tactics',
        'Honor the price at time of order - never change prices after purchase',
        'Offer competitive rates while maintaining quality standards'
      ],
      variant: 'default'
    },
    {
      id: 'delivery',
      icon: Truck,
      title: 'Delivery Standards',
      items: [
        'Deliver items within 0 to 120 hours (0-5 days) of order confirmation',
        'Confirm delivery timeframe with buyer before accepting orders',
        'Provide regular updates on delivery progress and tracking',
        'Ensure proper packaging to prevent damage during transit',
        'Handle shipping delays proactively with clear communication'
      ],
      variant: 'default'
    },
    {
      id: 'payment',
      icon: CreditCard,
      title: 'Payment Process',
      items: [
        'Always verify payment receipt before processing orders',
        'Confirm payment through official CampusTrade channels only',
        'Keep all payment records and receipts for future reference',
        'Never request or accept payments outside the CampusTrade platform',
        'Report any suspicious payment activities immediately'
      ],
      variant: 'info'
    },
    {
      id: 'violations',
      icon: ShieldAlert,
      title: 'Account Violations',
      items: [
        'Committing fraud or using deceptive business practices',
        'Repeated violations of marketplace guidelines',
        'Abusing the return and refund process',
        'Sending items to unverified or suspicious buyers',
        'Engaging in price gouging or artificial inflation'
      ],
      variant: 'warning'
    },
    {
      id: 'trust',
      icon: Heart,
      title: 'Building Trust',
      items: [
        'Be completely honest in all product descriptions and pricing',
        'Respond to buyer inquiries within 24 hours maximum',
        'Consistently deliver quality items on or before time',
        'Handle returns and refunds with professionalism and respect',
        'Keep your account and business information up to date',
        'Maintain high ratings by exceeding customer expectations'
      ],
      variant: 'success'
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green to-emerald-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
  
  {/* Background */}
  <div className="absolute inset-0 z-0 bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 dark:from-emerald-800 dark:to-teal-800">
    <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-20"></div>
  </div>

  {/* Content */}
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
    <div className="text-center">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-yellow-300 mb-6 tracking-tight">
        Vendor Guidelines
      </h1>
      <p className="text-lg sm:text-xl text-white max-w-2xl mx-auto">
        Your comprehensive guide to building a successful business on CampusTrade. Follow these best practices to grow your brand and delight your customers.
      </p>
    </div>
  </div>

  {/* Wave */}
  {/* <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
    <svg viewBox="0 0 1440 120" className="w-full h-auto">
      <path
        d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
        className="text-slate-50 dark:text-gray-900"
        fill="currentColor"
      />
    </svg>
  </div> */}

</div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation - Desktop */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-8">
              <nav className="space-y-1">
                {guidelinesData.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveTab(section.id);
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200',
                      activeTab === section.id
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    )}
                  >
                    <section.icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{section.title}</span>
                  </button>
                ))}
              </nav>
              {/* Quick Contact Card */}
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Need Help?</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Our vendor support team is here to assist you.
                </p>
                <a 
                  href="mailto:olujidewealth3@gmail.com"
                  className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                >
                  olujidewealth3@gmail.com
                </a>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>7am - 8pm | 24h response</span>
                </div>
              </div>
            </div>
          </div>
          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Active Vendors', value: '10,000+', icon: Store },
                { label: 'Success Rate', value: '98.5%', icon: CheckCircle2 },
                { label: 'Support Response', value: '< 24hrs', icon: Clock },
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Guidelines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guidelinesData.map((section) => (
                <div 
                  key={section.id} 
                  id={section.id}
                  className={cn(
                    'scroll-mt-24',
                    section.id === 'welcome' || section.id === 'trust' ? 'md:col-span-2' : ''
                  )}
                >
                  <SectionCard 
                    icon={section.icon} 
                    title={section.title}
                    variant={section.variant}
                  >
                    {section.items ? (
                      <BulletList items={section.items} />
                    ) : (
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {section.content}
                      </p>
                    )}
                  </SectionCard>
                </div>
              ))}
            </div>
            {/* Mobile Accordion */}
            <div className="lg:hidden space-y-4">
              {guidelinesData.map((section) => (
                <div key={section.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        section.variant === 'warning' ? 'bg-amber-100 text-amber-600' :
                        section.variant === 'info' ? 'bg-blue-100 text-blue-600' :
                        'bg-emerald-100 text-emerald-600'
                      )}>
                        <section.icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{section.title}</span>
                    </div>
                    {openSection === section.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {openSection === section.id && (
                    <div className="px-4 pb-4">
                      {section.items ? (
                        <BulletList items={section.items} />
                      ) : (
                        <p className="text-gray-600 dark:text-gray-300">{section.content}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Agreement Footer */}
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-gray-800/30 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Agreement Notice
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    By selling on CampusTrade, you agree to follow these guidelines. CampusTrade reserves the right to update these rules at any time. 
                    We recommend checking this page regularly to stay informed of any changes. Failure to comply with these guidelines 
                    may result in account suspension or termination.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
