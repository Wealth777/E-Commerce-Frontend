import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { 
  Mail, 
  Clock, 
  MapPin, 
  Phone, 
  Copy, 
  Check, 
  Send, 
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Headphones,
  ShieldCheck
} from 'lucide-react';
const Contact = () => {
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('olujidewealth3@gmail.com');
    setCopied(true);
    toast.success('Email copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      subject: Yup.string().min(3, 'Subject must be at least 3 characters').required('Subject is required'),
      message: Yup.string().min(10, 'Message must be at least 10 characters').required('Message is required'),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        // Simulate API call - replace with your actual apiClient
        await new Promise(resolve => setTimeout(resolve, 1500));
        // await apiClient.post('/contact', values);
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        resetForm();
      } catch (error) {
        toast.error('Failed to send message. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
  });
  const faqs = [
    {
      question: 'How quickly will I get a response?',
      answer: 'We aim to respond to all inquiries within 24 hours during our support hours (7am to 8pm, daily).'
    },
    {
      question: 'What information should I include?',
      answer: 'Please include your order ID if applicable, a clear description of your issue, and any relevant screenshots.'
    },
    {
      question: 'Can I reach you via WhatsApp?',
      answer: 'Currently, we only provide support via email and this contact form. This ensures we can properly track and resolve your issues.'
    },
    {
      question: 'What are your support hours?',
      answer: 'Our support team is available Monday to Sunday, from 7am to 8pm WAT.'
    }
  ];
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      value: 'olujidewealth3@gmail.com',
      description: 'Send us an email anytime',
      action: handleCopyEmail,
      actionLabel: copied ? 'Copied!' : 'Copy Email'
    },
    {
      icon: Clock,
      title: 'Support Hours',
      value: '7am - 8pm Daily',
      description: 'We\'re here to help',
      action: null
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Across Nigeria',
      description: 'Serving student communities',
      action: null
    }
  ];
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-green-500 to-yellow-500 py-20 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Headphones className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">24/7 Support Available</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Get in Touch with <span className="text-yellow-300">CampusTrade</span>
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>
      {/* Contact Methods Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <method.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{method.title}</h3>
                  <p className="text-gray-800 dark:text-gray-200 font-medium mb-1">{method.value}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{method.description}</p>
                  {method.action && (
                    <button
                      onClick={method.action}
                      className="mt-3 inline-flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium hover:text-green-700 dark:hover:text-green-300 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {method.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Send us a Message</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Fill out the form below</p>
              </div>
            </div>
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      formik.touched.name && formik.errors.name 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-green-500'
                    }`}
                    placeholder="John Doe"
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-sm text-red-500 mt-1">{formik.errors.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      formik.touched.email && formik.errors.email 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-green-500'
                    }`}
                    placeholder="john@example.com"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    formik.touched.subject && formik.errors.subject 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-green-500'
                  }`}
                  placeholder="How can we help you?"
                />
                {formik.touched.subject && formik.errors.subject && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.subject}</p>
                )}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 resize-none ${
                    formik.touched.message && formik.errors.message 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-green-500'
                  }`}
                  placeholder="Tell us more about your inquiry..."
                />
                {formik.touched.message && formik.errors.message && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {formik.isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
          {/* FAQ Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Quick answers to common questions</p>
              </div>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 dark:text-white pr-4">{faq.question}</span>
                    {activeFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      activeFaq === index ? 'max-h-48' : 'max-h-0'
                    }`}
                  >
                    <p className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Trust Badges */}
            <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Your Information is Secure</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                We take your privacy seriously. All messages are encrypted and your information will never be shared with third parties.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-500" />
                  SSL Encrypted
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-500" />
                  Secure Storage
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom CTA */}
      <div className="bg-gray-100 dark:bg-gray-800 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our support team is always ready to help. Reach out and we'll get back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="mailto:olujidewealth3@gmail.com"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Mail className="w-5 h-5" />
              Send us an Email
            </a>
            <span className="text-gray-500 dark:text-gray-400">
              or call <a href="tel:+234" className="text-green-600 dark:text-green-400 font-medium hover:underline">+234 XXX XXX XXXX</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;