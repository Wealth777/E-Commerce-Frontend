import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { FiCopy } from 'react-icons/fi'

const Contact = () => {
    const [submitted, setSubmitted] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('olujidewealth3@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formik = useFormik({
   initialValues: {
    name: '',
    email: '',
    subject: '',
    message: '',
  },
  validationSchema: Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    subject: Yup.string().required('Subject is required'),
    message: Yup.string().required('Message is required'),
  }),

  onSubmit: async (values,{ resetForm }) => {
    try {
      await apiClient.post('/contact', values);
      toast.success('Message sent successfully!');
      resetForm();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  },
  })



  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold mb-8 text-green-900 dark:text-green-400">Contact Us</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Get in Touch</h2>
            <p className="text-gray-300 mb-6">
              Have a question or need help? We're here to assist you. Contact us through email or use the form below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Email Support</h2>
            <p className="text-gray-300 mb-2">Reach us directly at:</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold text-blue-600">olujidewealth3@gmail.com</p>
              <button
                onClick={handleCopyEmail}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Copy email"
              >
                <FiCopy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              {copied && <span className="text-sm text-green-600 dark:text-green-400">Copied!</span>}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">Support Hours</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Monday to Sunday: 7am to 8pm</li>
              <li>Response time: Within 24 hours</li>
            </ul>
          </section>

          <section className="mb-8 border-t pt-8">
            <h2 className="text-2xl font-semibold mb-6 text-green-700 dark:text-green-300">Contact Form</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                Thank you for your message! We will respond within 24 hours.
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-400 font-semibold mb-2">
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                  placeholder="Enter your name"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-400 font-semibold mb-2">
                  Your Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                  placeholder="your@email.com"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-gray-740 font-semibold mb-2">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                  placeholder="What is this about?"
                />
                {formik.touched.subject && formik.errors.subject && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.subject}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-400 font-semibold mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                  placeholder="Tell us how we can help..."
                />
                {formik.touched.message && formik.errors.message && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-400 text-white font-semibold py-3 rounded-lg"
              >
                Send Message
              </button>
            </form>
          </section>

          <section className="mb-8 border-t pt-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-700 dark:text-green-300">What to Expect</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>We read every message</li>
              <li>We respond within 24 hours</li>
              <li>Be as detailed as possible</li>
              <li>Include order ID if related</li>
            </ul>
          </section>

          <section className="border-t pt-8">
            <p className="text-gray-400 text-sm">
              GMC is committed to helping you. Your feedback helps us improve.
            </p>
          </section>
        </div>
      </div>
  )
};

export default Contact;