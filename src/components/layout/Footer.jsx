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
    { name: 'Become a Vendor', path: '/vendor/register' },
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
        
        {/* Top Section: Brand, Quick Links, and Resources */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand and description - Takes 2 cols on Large screens */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center mb-4">
              <FiShoppingBag className="h-8 w-8 text-green-500 mr-3 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">CampusTrade</h2>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Independent Marketplace</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              CampusTrade is an independently owned marketplace serving campus users.
              Connecting students, staff, and local businesses in a secure and reliable marketplace.
            </p>

            {/* Social links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="h-10 w-10 rounded-full bg-gray-800 hover:bg-green-600 flex items-center justify-center text-white transition-all transform hover:-translate-y-1"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="sm:col-span-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Seller Resources */}
          <div className="sm:col-span-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Vendor Resources</h3>
            <ul className="space-y-3">
              {sellerResources.map((resource, index) => (
                <li key={index}>
                  <Link
                    to={resource.path}
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Middle Section: Contact Info (Optimized for Mobile Wrapping) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-t border-gray-800">
          {contactInfo.map((contact, index) => (
            <div key={index} className="flex items-start md:items-center gap-4 group">
              <div className="h-10 w-10 rounded-xl bg-gray-800 flex-shrink-0 flex items-center justify-center text-green-400 group-hover:bg-green-600 group-hover:text-white transition-all">
                {contact.icon}
              </div>

              <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
                <span className="text-gray-300 text-sm truncate break-all sm:break-normal">
                  {contact.text}
                </span>

                {contact.copy && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(contact.text, index)}
                      className="p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
                      title="Copy"
                    >
                      <FiCopy className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    {copiedIndex === index && (
                      <span className="text-[10px] font-bold text-green-500 uppercase animate-pulse">
                        Copied
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8 mt-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-gray-500 text-sm text-center lg:text-left">
              © {currentYear} <span className="text-gray-300 font-medium">CampusTrade</span>. All rights reserved.
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium">
              <Link to={'/privacypolicy'} className="text-gray-500 hover:text-green-400 transition-colors uppercase tracking-tight">Privacy Policy</Link>
              <Link to={'/termsofservice'} className="text-gray-500 hover:text-green-400 transition-colors uppercase tracking-tight">Terms of Service</Link>
              <Link to={'/cookiepolicy'} className="text-gray-500 hover:text-green-400 transition-colors uppercase tracking-tight">Cookie Policy</Link>
              <Link to={'/sitemap'} className="text-gray-500 hover:text-green-400 transition-colors uppercase tracking-tight">Sitemap</Link>
            </div>
          </div>

          <div className="text-center mt-10 max-w-3xl mx-auto">
            <p className="text-[10px] leading-loose text-gray-600 uppercase tracking-widest">
              CampusTrade is an independent, founder-owned marketplace.
              All transactions are subject to our platform policies and security regulations.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;