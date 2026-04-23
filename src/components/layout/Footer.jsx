import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiCopy
} from 'react-icons/fi';

const Footer = () => {
  const [copiedIndex, setCopiedIndex] = React.useState(null);

  const handleCopy = (value, index) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/products' },
    { name: 'About Us', path: '/aboutus' },
    { name: 'Contact', path: '/contactus' },
    { name: 'Help Center', path: '/contactus' }
  ];

  const sellerResources = [
    { name: 'Become a Vendor', path: '/register' },
    { name: 'Vendor Dashboard', path: '/login' },
    { name: 'Vendor Guidelines', path: '/vendor-guidelines' },
  ];

  const socialLinks = [
    { icon: <FiFacebook />, name: 'Facebook', url: '#' },
    { icon: <FiTwitter />, name: 'Twitter', url: '#' },
    { icon: <FiInstagram />, name: 'Instagram', url: '#' },
    { icon: <FiYoutube />, name: 'YouTube', url: '#' }
  ];

  const contactInfo = [
    { icon: <FiMapPin />, text: 'GreatManConcapt Store', copy: false },
    { icon: <FiPhone />, text: '+234 813 640 1890', copy: true },
    { icon: <FiMail />, text: 'olujidwealth3@gmail.com', copy: true }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand and description */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <FiShoppingBag className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-white">CampusTrade</h2>
                <p className="text-sm text-gray-400">Independent marketplace for the student community</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              CampusTrade is an independently owned marketplace serving campus users.
              Connecting students, staff, and local businesses in a secure and reliable marketplace.
            </p>

            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="h-10 w-10 rounded-full bg-gray-800 hover:bg-green-600 flex items-center justify-center text-white transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Seller Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Vendor Resources</h3>
            <ul className="space-y-2">
              {sellerResources.map((resource, index) => (
                <li key={index}>
                  <Link
                    to={resource.path}
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactInfo.map((contact, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-green-900/30 flex items-center justify-center text-green-400">
                {contact.icon}
              </div>

              <span className="text-gray-400">{contact.text}</span>

              {contact.copy && (
                <>
                  <button
                    onClick={() => handleCopy(contact.text, index)}
                    className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Copy"
                  >
                    <FiCopy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>

                  {copiedIndex === index && (
                    <span className="text-sm text-green-600 dark:text-green-400">
                      Copied
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} CampusTrade. All rights reserved.
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <Link to={'/privacypolicy'} className="text-gray-400 hover:text-green-400 transition-colors">Privacy Policy</Link>

              <Link to={'/termsofservice'} className="text-gray-400 hover:text-green-400 transition-colors">Terms of Service</Link>

              <Link to={'/cookiepolicy'} className="text-gray-400 hover:text-green-400 transition-colors">Cookie Policy</Link>

              <Link to={'/sitemap'} className="text-gray-400 hover:text-green-400 transition-colors">Sitemap</Link>
            </div>
          </div>

          <div className="text-center mt-6 text-xs text-gray-500">
            <p>
              CampusTrade is an independent, founder-owned marketplace serving the student community.
              All transactions are subject to CampusTrade policies and regulations.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;