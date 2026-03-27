import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';

const Checkout = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { items, total } = useSelector((state) => state.cart);
  const [vendorDetails, setVendorDetails] = useState(null);

  const initialValues = {
    delivery: 'standard',
    paymentProof: '',
    note: '',
  };

  const validationSchema = Yup.object({
    delivery: Yup.string().required('Select delivery option'),
    paymentProof: Yup.string().required('Upload payment receipt'),
    note: Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await apiClient.post('/buyer/checkout', {
        items,
        total,
        ...values,
      });
      toast.success('Order placed successfully!');
      navigate('/buyer/orders');
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-600';
  const inputBg = isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900';

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
        <div className="text-center">
          <p className={`text-lg ${textColor} mb-4`}>No items in cart</p>
          <button
            onClick={() => navigate('/cart')}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} py-12`}>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className={`text-3xl font-bold ${textColor} mb-8`}>Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  {/* Delivery Options */}
                  <div className={`${cardBg} shadow rounded-lg p-6`}>
                    <h3 className={`text-xl font-semibold ${textColor} mb-4`}>Delivery Options</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <Field type="radio" name="delivery" value="standard" className="mr-3" />
                        <span className={textColor}>Standard (0-72 hours) - Free</span>
                      </label>
                      <label className="flex items-center">
                        <Field type="radio" name="delivery" value="express" className="mr-3" />
                        <span className={textColor}>Express (0-24 hours) - ₦5,000</span>
                      </label>
                    </div>
                    <ErrorMessage name="delivery" component="div" className="text-red-500 text-sm mt-2" />
                  </div>

                  {/* Vendor Details */}
                  <div className={`${cardBg} shadow rounded-lg p-6`}>
                    <h3 className={`text-xl font-semibold ${textColor} mb-4`}>Vendor Payment Details</h3>
                    <p className={secondaryText}>Please send payment to the vendor via WhatsApp or bank transfer</p>
                    <div className={`mt-4 p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded`}>
                      <p className={`${secondaryText} text-sm`}>Bank Account: 1234567890</p>
                      <p className={`${secondaryText} text-sm`}>WhatsApp: +234 801 000 0000</p>
                    </div>
                  </div>

                  {/* Payment Proof */}
                  <div className={`${cardBg} shadow rounded-lg p-6`}>
                    <h3 className={`text-xl font-semibold ${textColor} mb-4`}>Upload Payment Receipt</h3>
                    <div>
                      <label htmlFor="paymentProof" className={`block text-sm font-medium ${textColor} mb-2`}>
                        Receipt Image
                      </label>
                      <Field
                        type="file"
                        id="paymentProof"
                        name="paymentProof"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}
                      />
                      <ErrorMessage name="paymentProof" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className={`${cardBg} shadow rounded-lg p-6`}>
                    <label htmlFor="note" className={`block text-sm font-medium ${textColor} mb-2`}>
                      Special Instructions (Optional)
                    </label>
                    <Field
                      as="textarea"
                      id="note"
                      name="note"
                      rows="3"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      placeholder="Add delivery instructions..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          {/* Order Summary */}
          <div className={`${cardBg} shadow rounded-lg p-6 h-fit`}>
            <h3 className={`text-xl font-semibold ${textColor} mb-6`}>Order Summary</h3>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className={secondaryText}>{item.name} x{item.quantity}</span>
                  <span className={textColor}>₦{(item.price * item.quantity)?.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} pt-4 space-y-2`}>
              <div className="flex justify-between">
                <span className={secondaryText}>Subtotal</span>
                <span className={textColor}>₦{total?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className={`font-semibold ${textColor}`}>Total</span>
                <span className="text-xl font-bold text-red-600">₦{total?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;