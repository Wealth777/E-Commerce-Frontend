// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { useTheme } from '../../context/ThemeContext';
// import { toast } from 'react-toastify';
// import apiClient from '../../api/apiClient';
// import { useDispatch } from 'react-redux';
// import { clearCart } from '../../store/cartSlice';

// import {
//   Truck, CreditCard, Upload, MessageSquare, ShoppingBag,
//   ChevronRight, Package, ArrowLeft, Check,
//   Copy, CheckCircle2, AlertCircle, Loader2, Wallet, HandCoins,
//   MapPin, User, Edit2, Save, X
// } from 'lucide-react';

// const Checkout = () => {
//   const navigate = useNavigate();
//   const { isDark } = useTheme();
//   const cartItems = useSelector((state) => state.cart.items || []);
//   const dispatch = useDispatch();

//   const [editForm, setEditForm] = useState({ state: '', address: '' });
//   const [userProfile, setUserProfile] = useState(null);
//   const [profileLoading, setProfileLoading] = useState(true);

//   const [paymentProofs, setPaymentProofs] = useState({});

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const res = await apiClient.get('/buyer/profile/me', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });

//         const data = res.data?.data || {};
//         setUserProfile(data);
//         setEditForm({
//           state: res.data?.location?.state || '',
//           address: res.data?.location?.address || ''
//         });
//       } catch (error) {
//         toast.error('Failed to load user profile');
//         console.error('Error fetching user profile:', error);
//       } finally {
//         setProfileLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, []);


//   const initialValues = {
//     delivery: 'standard',
//     paymentMethod: 'pay_now',
//     // paymentProof: '',
//     note: '',
//   };

//   const validationSchema = Yup.object({
//     delivery: Yup.string().required('Select delivery option'),
//     paymentMethod: Yup.string().required('Select payment method'),
//     // paymentProof: Yup.string().when('paymentMethod', {
//     //   is: 'pay_now',
//     //   then: () => Yup.string().required('Upload payment receipt'),
//     //   otherwise: () => Yup.string().notRequired(),
//     // }),
//     note: Yup.string(),
//   });

//   const handleFileUpload = (vendorId, file) => {
//     setPaymentProofs((prev) => ({
//       ...prev,
//       [vendorId]: file,
//     }));
//   };



//   const groupByVendor = (items = []) => {
//     return items.reduce((acc, item) => {
//       const vendorId = item.vendorId || "unknown";

//       if (!acc[vendorId]) {
//         acc[vendorId] = {
//           vendorId,
//           vendorName: item.vendorName || "Unknown Vendor",

//           // fallback (only if backend sends it)
//           vendorBankName: item.vendorBankName || null,
//           vendorAccountName: item.vendorAccountName || null,
//           vendorAccountNumber: item.vendorAccountNumber || null,

//           items: [],
//         };
//       }

//       acc[vendorId].items.push(item);
//       return acc;
//     }, {});
//   };

//   const groupedCart = Object.values(groupByVendor(cartItems));

//   const vendorCount = groupedCart.length;

//   // Calculate subtotal from real cart data
//   const subtotal = cartItems.reduce((sum, item) => {
//     return sum + item.price * item.quantity;
//   }, 0);


//   const TAX_PER_VENDOR = 10;

//   const handleSubmit = async (values, { setSubmitting }) => {
//     const deliveryFee = values.delivery === 'express' ? 1000 : 0;
//     const totalTax = TAX_PER_VENDOR * vendorCount;
//     const orderTotal = subtotal + deliveryFee + totalTax;

//     try {
//       await apiClient.post('/buyer/checkout', {
//         items: cartItems,
//         subtotal,
//         deliveryFee,
//         totalTax,
//         orderTotal,
//         ...values,
//       });

//       dispatch(clearCart());

//       // ✅ CLEAR LOCAL STORAGE (guest fallback safety)
//       localStorage.removeItem('cart');

//       toast.success('Order placed successfully!');

//       // navigate('/buyer/orders');
//     } catch (error) {
//       toast.error('Failed to place order');
//     } finally {
//       setSubmitting(false);
//     }
//   };


//   // Theme classes with dark mode support
//   const bgColor = isDark
//     ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950'
//     : 'bg-gradient-to-br from-slate-50 via-white to-zinc-100';
//   const cardBg = isDark
//     ? 'bg-gray-800/80 border-gray-700/50 backdrop-blur-sm'
//     : 'bg-white/80 border-gray-200 backdrop-blur-sm';
//   const textColor = isDark ? 'text-white' : 'text-gray-900';
//   const secondaryText = isDark ? 'text-gray-400' : 'text-gray-600';
//   const inputBg = isDark ? 'bg-gray-700/50 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300';
//   const inputFocus = isDark ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-blue-500 focus:border-blue-500';

//   return (
//     <div className={`min-h-screen ${bgColor} pb-20`}>
//       <div className="max-w-7xl mx-auto px-4 pt-8">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => window.history.back()}
//             className={`flex items-center gap-2 mb-2 ${secondaryText} hover:text-red-500 transition-colors group`}
//           >
//             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//             Back to Cart
//           </button>
//           <h1 className={`text-3xl font-bold ${textColor}`}>Checkout</h1>
//           <p className={`${secondaryText} mt-2`}>Complete your purchase with confidence</p>
//           <p>{vendorCount} vendor(s) in cart</p>
//         </div>

//         <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
//           {({ isSubmitting, values, setFieldValue }) => {
//             // Calculate delivery fee based on selected delivery method
//             const deliveryFee = values.delivery === 'express' ? 1000 : 0;
//             const totalTax = TAX_PER_VENDOR * vendorCount;
//             const orderTotal = subtotal + deliveryFee + totalTax;

//             return (
//               <Form className="grid grid-cols-1 lg:grid-cols-12 gap-8">

//                 {/* LEFT: Main Content */}
//                 <div className="lg:col-span-8 space-y-6">

//                   {/* Payment Method Selection */}
//                   <div className={`${cardBg} border p-6 rounded-2xl shadow-lg`}>
//                     <div className="flex items-center justify-between mb-6">
//                       <h3 className={`text-xl font-bold ${textColor} flex items-center gap-3`}>
//                         <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
//                           <Wallet className="w-5 h-5 text-white" />
//                         </div>
//                         Payment Method
//                       </h3>
//                       <div className="flex items-center gap-2">
//                         <span className={`text-sm ${secondaryText}`}>Step 1 of 3</span>
//                         <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <button
//                         type="button"
//                         onClick={() => setFieldValue('paymentMethod', 'pay_now')}
//                         className={`p-5 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${values.paymentMethod === 'pay_now'
//                           ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100/50 shadow-lg'
//                           : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
//                           }`}
//                       >
//                         <div className={`p-3 rounded-full ${values.paymentMethod === 'pay_now' ? 'bg-red-500' : 'bg-gray-200'}`}>
//                           <CreditCard className={`w-6 h-6 ${values.paymentMethod === 'pay_now' ? 'text-white' : 'text-gray-400'}`} />
//                         </div>
//                         <span className={`font-semibold ${textColor}`}>Pay Now</span>
//                         <span className="text-xs text-gray-500 text-center">Secure online payment with instant confirmation</span>
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() => setFieldValue('paymentMethod', 'pod')}
//                         className={`p-5 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${values.paymentMethod === 'pod'
//                           ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-lg'
//                           : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
//                           }`}
//                       >
//                         <div className={`p-3 rounded-full ${values.paymentMethod === 'pod' ? 'bg-emerald-500' : 'bg-gray-200'}`}>
//                           <HandCoins className={`w-6 h-6 ${values.paymentMethod === 'pod' ? 'text-white' : 'text-gray-400'}`} />
//                         </div>
//                         <span className={`font-semibold ${textColor}`}>Pay on Delivery</span>
//                         <span className="text-xs text-gray-500 text-center">Pay when your order arrives at your doorstep</span>
//                       </button>
//                     </div>
//                   </div>

//                   {/* Delivery Method */}
//                   <div className={`${cardBg} border p-6 rounded-2xl shadow-lg`}>
//                     <div className="flex items-center justify-between mb-6">
//                       <h3 className={`text-xl font-bold ${textColor} flex items-center gap-3`}>
//                         <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
//                           <Truck className="w-5 h-5 text-white" />
//                         </div>
//                         Delivery Method
//                       </h3>
//                       <div className="flex items-center gap-2">
//                         <span className={`text-sm ${secondaryText}`}>Step 2 of 3</span>
//                         <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//                       <label className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all ${values.delivery === 'standard'
//                         ? 'border-blue-500 bg-gradient-to-r from-blue-100 to-blue-100/30 shadow-md'
//                         : 'border-gray-200 hover:border-gray-300'
//                         }`}>
//                         <div className="flex items-center gap-4">
//                           <Field type="radio" name="delivery" value="standard" className="text-blue-500 focus:ring-blue-500 w-5 h-5" />
//                           <div>
//                             <p className={`font-semibold ${textColor}`}>Standard Delivery</p>
//                             <p className="text-sm text-gray-500">3-5 Business Days</p>
//                           </div>
//                         </div>
//                         <span className="font-bold text-green-500 text-lg">FREE</span>
//                       </label>

//                       <label className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all ${values.delivery === 'express'
//                         ? 'border-blue-500 bg-gradient-to-r from-blue-100 to-blue-100/30 shadow-md'
//                         : 'border-gray-200 hover:border-gray-300'
//                         }`}>
//                         <div className="flex items-center gap-4">
//                           <Field type="radio" name="delivery" value="express" className="text-blue-500 focus:ring-blue-500 w-5 h-5" />
//                           <div>
//                             <p className={`font-semibold ${textColor}`}>Express Delivery</p>
//                             <p className="text-sm text-gray-500">24-48 Hours • Priority Handling</p>
//                           </div>
//                         </div>
//                         <span className={`font-bold text-lg ${textColor}`}>₦1,000</span>
//                       </label>
//                     </div>
//                   </div>

//                   {/* Buyer Details with Edit Option */}
//                   <div className={`${cardBg} border p-6 rounded-2xl shadow-lg`}>
//                     <div className="flex items-center justify-between mb-6">
//                       <h3 className={`text-xl font-bold ${textColor} flex items-center gap-3`}>
//                         <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg">
//                           <User className="w-5 h-5 text-white" />
//                         </div>
//                         Buyer Details
//                       </h3>
//                     </div>


//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className={`p-4 rounded-xl ${isDark
//                         ? 'bg-gradient-to-br from-gray-700 to-gray-600/50'
//                         : 'bg-gradient-to-br from-gray-50 to-gray-100/50'
//                         }`}>
//                         <div className="flex items-center gap-2 mb-2">
//                           <User className={`w-4 h-4 ${secondaryText}`} />
//                           <p className="text-xs uppercase text-gray-500 font-bold">Username</p>
//                         </div>
//                         <p className={`text-sm font-semibold ${textColor}`}>
//                           {profileLoading ? 'Loading...' : userProfile?.identity?.username || 'Not provided'}
//                         </p>
//                       </div>

//                       <div className={`p-4 rounded-xl ${isDark
//                         ? 'bg-gradient-to-br from-gray-700 to-gray-600/50'
//                         : 'bg-gradient-to-br from-gray-50 to-gray-100/50'
//                         }`}>
//                         <div className="flex items-center gap-2 mb-2">
//                           <div className="w-4 h-4 text-gray-500">📱</div>
//                           <p className="text-xs uppercase text-gray-500 font-bold">Phone</p>
//                         </div>
//                         <p className={`text-sm font-semibold ${textColor}`}>
//                           {profileLoading ? 'Loading...' : userProfile?.contact?.phoneNo || 'Not provided'}
//                         </p>
//                       </div>

//                       <div className={`p-4 rounded-xl md:col-span-2 ${isDark
//                         ? 'bg-gradient-to-br from-gray-700 to-gray-600/50'
//                         : 'bg-gradient-to-br from-gray-50 to-gray-100/50'
//                         }`}>
//                         <div className="flex items-center gap-2 mb-2">
//                           <MapPin className={`w-4 h-4 ${secondaryText}`} />
//                           <p className="text-xs uppercase text-gray-500 font-bold">Shipping Address</p>
//                         </div>
//                         <p className={`text-sm font-semibold ${textColor}`}>
//                           {profileLoading
//                             ? 'Loading...'
//                             : `${userProfile?.location?.address || 'No address provided'}, ${userProfile?.location?.state || 'No state provided'}`
//                           }
//                         </p>
//                       </div>
//                     </div>
//                     {/* )} */}
//                   </div>

//                   {groupedCart.map(vendor => {

//                     const vendorSubtotal = vendor.items.reduce(
//                       (s, i) => s + i.price * i.quantity,
//                       0
//                     );

//                     const vendorTax = TAX_PER_VENDOR;
//                     const vendorTotal = vendorSubtotal + vendorTax;

//                     return (
//                       <div key={vendor.vendorId} className={`${cardBg} border p-6 rounded-2xl shadow-lg ${isDark
//                         ? 'bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-700/50'
//                         : 'bg-gradient-to-br from-emerald-50 to-emerald-100/30 border-emerald-200'
//                         }`}>

//                         <h3 className={`text-xl font-bold ${textColor} flex items-center gap-3 mb-6`}>
//                           <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg">
//                             <CheckCircle2 className="w-5 h-5 text-white" />
//                           </div>
//                           Vendor Payment Details
//                         </h3>

//                         <h2 className="font-bold text-red-500">
//                           {vendor.vendorName}
//                         </h2>

//                         <p className="text-sm">
//                           Bank: {vendor.vendorBankName}
//                         </p>
//                         <p className="text-sm">
//                           Account: {vendor.vendorAccountName}
//                         </p>
//                         <p className="text-sm">
//                           Number: {vendor.vendorAccountNumber}
//                         </p>

//                         <div className="mt-3">
//                           {values.paymentMethod === 'pay_now' && (
//                             <label className="block border p-3 rounded cursor-pointer">

//                               <p className="text-sm">
//                                 Upload payment proof for {vendor.vendorName}
//                               </p>

//                               <input
//                                 type="file"
//                                 className="hidden"
//                                 onChange={(e) =>
//                                   handleFileUpload(vendor.vendorId, e.target.files?.[0])
//                                 }
//                               />
//                             </label>
//                           )}

//                           {paymentProofs[vendor.vendorId] && (
//                             <p className="text-green-600 text-sm">
//                               {paymentProofs[vendor.vendorId].name}
//                             </p>
//                           )}
//                         </div>

//                         <div className="mt-3 text-sm font-bold">
//                           <p>Tax: ₦{vendorTax.toLocaleString()}</p>
//                         </div>

//                         <div className="mt-3 text-sm font-bold">
//                           Subtotal: ₦{vendorTotal.toLocaleString()}
//                         </div>

//                       </div>
//                     );
//                   })}


//                   {/* Special Instructions */}
//                   <div className={`${cardBg} border p-6 rounded-2xl shadow-lg`}>
//                     <div className="flex items-center justify-between mb-6">
//                       <h3 className={`text-xl font-bold ${textColor} flex items-center gap-3`}>
//                         <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
//                           <MessageSquare className="w-5 h-5 text-white" />
//                         </div>
//                         Special Instructions
//                       </h3>
//                       <div className="flex items-center gap-2">
//                         <span className={`text-sm ${secondaryText}`}>Optional</span>
//                         <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//                       </div>
//                     </div>

//                     <Field
//                       as="textarea"
//                       name="note"
//                       rows={4}
//                       className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
//                       placeholder="Add any special delivery instructions, notes for the delivery person, or specific requirements..."
//                     />
//                     <p className="text-xs text-gray-500 mt-2">Maximum 500 characters</p>
//                   </div>
//                 </div>

//                 {/* RIGHT: Order Summary */}
//                 <div className="lg:col-span-4">
//                   <div className="sticky top-8 space-y-4">
//                     <div className={`${cardBg} border rounded-2xl shadow-xl overflow-hidden`}>
//                       <div className="p-6 border-b border-gray-100">
//                         <h3 className={`text-xl font-bold ${textColor} flex items-center gap-3`}>
//                           <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
//                             <ShoppingBag className="w-5 h-5 text-white" />
//                           </div>
//                           Order Summary
//                         </h3>
//                       </div>

//                       <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
//                         <p className="text-sm text-gray-500 mb-4">
//                           You are paying {vendorCount} vendor(s)
//                         </p>

//                         {groupedCart?.length > 0 &&
//                           groupedCart.map((vendorGroup) => {
//                             const vendorSubtotal = vendorGroup.items.reduce(
//                               (sum, item) => sum + item.price * item.quantity,
//                               0
//                             );

//                             return (
//                               <div key={vendorGroup.vendorId} className="mb-6">
//                                 {/* ✅ Vendor Name */}
//                                 <h4 className="font-bold text-red-500 mb-2">
//                                   {vendorGroup.vendorName}
//                                 </h4>

//                                 {/* ✅ Vendor Items */}
//                                 {vendorGroup.items.map((item) => (
//                                   <div key={item.id} className="flex gap-4 p-3 rounded-lg">
//                                     <div className="h-16 w-16 overflow-hidden rounded-xl border">
//                                       <img
//                                         src={item.image || 'https://via.placeholder.com/150'}
//                                         alt={item.name}
//                                         className="h-full w-full object-cover"
//                                       />
//                                     </div>

//                                     <div className="flex-1">
//                                       <p className="text-sm font-semibold">{item.name}</p>
//                                       <p className="text-xs">Qty: {item.quantity}</p>
//                                       <p className="text-sm font-semibold">
//                                         ₦{(item.price * item.quantity).toLocaleString()}
//                                       </p>
//                                     </div>
//                                   </div>
//                                 ))}

//                                 {/* ✅ Vendor subtotal */}
//                                 <div className="flex justify-between mt-2 text-sm font-semibold">
//                                   <span>Subtotal</span>
//                                   <span>₦{vendorSubtotal.toLocaleString()}</span>
//                                 </div>
//                               </div>
//                             );
//                           })}

//                       </div>

//                       <div className={`p-6 space-y-3 ${isDark
//                         ? 'bg-gradient-to-b from-gray-800/50 to-gray-700/30'
//                         : 'bg-gradient-to-b from-gray-50 to-gray-100/50'
//                         }`}>
//                         <div className="flex justify-between items-center">
//                           <span className={`${secondaryText}`}>Subtotal</span>
//                           <span className={`font-semibold ${textColor}`}>₦{subtotal.toLocaleString()}</span>
//                         </div>

//                         <div className="flex justify-between items-center">
//                           <span className={`${secondaryText}`}>Delivery Fee</span>
//                           <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-500' : textColor}`}>
//                             {deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}
//                           </span>
//                         </div>

//                         <div className="flex justify-between items-center">
//                           <span className={`${secondaryText}`}>Tax</span>
//                           <span className={`font-semibold ${textColor}`}>₦{totalTax.toLocaleString()}</span>
//                         </div>

//                         <div className={`pt-4 border-t ${isDark ? 'border-gray-600' : 'border-gray-200'
//                           }`}>                        <div className="flex justify-between items-center">
//                             <span className={`text-lg font-bold ${textColor}`}>Total Amount</span>
//                             <span className="text-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-[22px] font-bold tracking-tight text-transparent">
//                               ₦{orderTotal.toLocaleString()}
//                             </span>
//                           </div>
//                           <p className="text-xs text-gray-500 mt-2">
//                             {values.paymentMethod === 'pay_now'
//                               ? 'Including all taxes and fees'
//                               : 'Pay when your order arrives'}
//                           </p>

//                         </div>
//                       </div>
//                     </div>

//                     {/* Action Button */}
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <Loader2 className="w-5 h-5 animate-spin" />
//                           Processing...
//                         </>
//                       ) : (
//                         <>
//                           {values.paymentMethod === 'pay_now' ? 'Complete Payment' : 'Place Order'}
//                           <ChevronRight className="w-5 h-5" />
//                         </>
//                       )}
//                     </button>

//                     {/* Security Badge */}
//                     <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
//                       <div className="flex items-center justify-center gap-3">
//                         <CheckCircle2 className="w-5 h-5 text-green-500" />
//                         <div className="text-center">
//                           <p className="text-sm font-medium text-gray-700">Secure Checkout</p>
//                           <p className="text-xs text-gray-500">Your information is protected</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Form>
//             );
//           }}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default Checkout;

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { clearCart } from '../../store/cartSlice';

import {
  Truck, CreditCard, MessageSquare, ShoppingBag,
  ChevronRight, ArrowLeft, CheckCircle2, Loader2, Wallet, HandCoins,
  MapPin, User, Edit2, Save, X
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const cartItems = useSelector((state) => state.cart.items || []);

  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ state: '', address: '' });
  const [paymentProofs, setPaymentProofs] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await apiClient.get('/buyer/profile/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = res.data?.data || {};
        setUserProfile(data);
        // Set initial edit form values from profile
        setEditForm({
          state: data.location?.state || '',
          address: data.location?.address || ''
        });
      } catch (error) {
        toast.error('Failed to load user profile');
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const validationSchema = Yup.object({
    delivery: Yup.string().required('Select delivery option'),
    paymentMethod: Yup.string().required('Select payment method'),
    note: Yup.string().max(500, 'Too long'),
  });

  const handleFileUpload = (vendorId, file) => {
    setPaymentProofs((prev) => ({
      ...prev,
      [vendorId]: file,
    }));
  };

  const groupByVendor = (items = []) => {
    return items.reduce((acc, item) => {
      const vendorId = item.vendorId || "unknown";
      if (!acc[vendorId]) {
        acc[vendorId] = {
          vendorId,
          vendorName: item.vendorName || "Unknown Vendor",
          vendorBankName: item.vendorBankName || null,
          vendorAccountName: item.vendorAccountName || null,
          vendorAccountNumber: item.vendorAccountNumber || null,
          items: [],
        };
      }
      acc[vendorId].items.push(item);
      return acc;
    }, {});
  };

  const groupedCart = Object.values(groupByVendor(cartItems));
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const TAX_PER_VENDOR = 10;
  const vendorCount = groupedCart.length;

  const handleSubmit = async (values, { setSubmitting }) => {
    const deliveryFee = values.delivery === 'express' ? 1000 : 0;
    const totalTax = TAX_PER_VENDOR * vendorCount;
    const orderTotal = subtotal + deliveryFee + totalTax;

    // Construct final payload
    // Use editForm values if they exist, otherwise fallback to userProfile
    const finalState = editForm.state || userProfile?.location?.state;
    const finalAddress = editForm.address || userProfile?.location?.address;

    // Use FormData for file uploads (proof of payment)
    const formData = new FormData();
    formData.append('items', JSON.stringify(cartItems));
    formData.append('subtotal', subtotal);
    formData.append('deliveryFee', deliveryFee);
    formData.append('totalTax', totalTax);
    formData.append('orderTotal', orderTotal);
    formData.append('delivery', values.delivery);
    formData.append('paymentMethod', values.paymentMethod);
    formData.append('note', values.note);
    formData.append('state', finalState);
    formData.append('address', finalAddress);

    // Append payment proofs if "Pay Now" was chosen
    if (values.paymentMethod === 'pay_now') {
      Object.keys(paymentProofs).forEach((vendorId) => {
        formData.append(`proof_${vendorId}`, paymentProofs[vendorId]);
      });
    }

    try {
      await apiClient.post('/buyer/checkout', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      dispatch(clearCart());
      localStorage.removeItem('cart');
      toast.success('Order placed successfully!');
      navigate('/buyer/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  // Theme classes
  const bgColor = isDark ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950' : 'bg-gradient-to-br from-slate-50 via-white to-zinc-100';
  const cardBg = isDark ? 'bg-gray-800/80 border-gray-700/50 backdrop-blur-sm' : 'bg-white/80 border-gray-200 backdrop-blur-sm';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-600';
  const inputBg = isDark ? 'bg-gray-700/50 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300';

  return (
    <div className={`min-h-screen ${bgColor} pb-20`}>
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className={`flex items-center gap-2 mb-2 ${secondaryText} hover:text-red-500 transition-colors group`}>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </button>
          <h1 className={`text-3xl font-bold ${textColor}`}>Checkout</h1>
          <p className={`${secondaryText} mt-2`}>{vendorCount} vendor(s) in cart • Secure Transaction</p>
        </div>

        <Formik
          initialValues={{ delivery: 'standard', paymentMethod: 'pay_now', note: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => {
            const deliveryFee = values.delivery === 'express' ? 1000 : 0;
            const totalTax = TAX_PER_VENDOR * vendorCount;
            const orderTotal = subtotal + deliveryFee + totalTax;

            return (
              <Form className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">

                  {/* Payment Method */}
                  <div className={`${cardBg} border p-6 rounded-2xl shadow-lg`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`text-xl font-bold ${textColor} flex items-center gap-3`}>
                        <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                          <Wallet className="w-5 h-5 text-white" />
                        </div>
                        Payment Method
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button type="button" onClick={() => setFieldValue('paymentMethod', 'pay_now')}
                        className={`p-5 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${values.paymentMethod === 'pay_now' ? 'border-red-500 bg-red-50/10' : 'border-gray-200'}`}>
                        <CreditCard className={values.paymentMethod === 'pay_now' ? 'text-red-500' : 'text-gray-400'} />
                        <span className={`font-semibold ${textColor}`}>Pay Now</span>
                      </button>
                      <button type="button" onClick={() => setFieldValue('paymentMethod', 'pod')}
                        className={`p-5 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${values.paymentMethod === 'pod' ? 'border-emerald-500 bg-emerald-50/10' : 'border-gray-200'}`}>
                        <HandCoins className={values.paymentMethod === 'pod' ? 'text-emerald-500' : 'text-gray-400'} />
                        <span className={`font-semibold ${textColor}`}>Pay on Delivery</span>
                      </button>
                    </div>
                  </div>

                  {/* Delivery Method */}
                  <div className={`${cardBg} border p-6 rounded-2xl shadow-lg`}>
                    <h3 className={`text-xl font-bold ${textColor} flex items-center gap-3 mb-6`}>
                      <Truck className="w-5 h-5 text-blue-500" /> Delivery Method
                    </h3>
                    <div className="space-y-4">
                      {['standard', 'express'].map((type) => (
                        <label key={type} className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer ${values.delivery === type ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200'}`}>
                          <div className="flex items-center gap-4">
                            <Field type="radio" name="delivery" value={type} className="w-5 h-5" />
                            <div>
                              <p className={`font-semibold ${textColor}`}>{type === 'standard' ? 'Standard' : 'Express'} Delivery</p>
                              <p className="text-sm text-gray-500">{type === 'standard' ? '3-5 Days' : '24-48 Hours'}</p>
                            </div>
                          </div>
                          <span className="font-bold">{type === 'standard' ? 'FREE' : '₦1,000'}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Buyer Details with Edit Functionality */}
                  <div className={`${cardBg} border p-6 rounded-2xl shadow-lg`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`text-xl font-bold ${textColor} flex items-center gap-3`}>
                        <User className="w-5 h-5 text-emerald-500" /> Buyer Details
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        {isEditing ? <><X className="w-4 h-4" /> Cancel</> : <><Edit2 className="w-4 h-4" /> Edit Profile</>}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-xl ${inputBg}`}>
                        <p className="text-xs uppercase text-gray-500 font-bold mb-1">Username</p>
                        <p className="font-semibold">{userProfile?.identity?.username || '---'}</p>
                      </div>
                      <div className={`p-4 rounded-xl ${inputBg}`}>
                        <p className="text-xs uppercase text-gray-500 font-bold mb-1">Phone</p>
                        <p className="font-semibold">{userProfile?.contact?.phoneNo || '---'}</p>
                      </div>

                      {isEditing ? (
                        <>
                          <div className="md:col-span-1">
                            <label className="text-xs uppercase text-gray-500 font-bold">State</label>
                            <input
                              className={`w-full p-3 rounded-lg border mt-1 ${inputBg}`}
                              value={editForm.state}
                              onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                            />
                          </div>
                          <div className="md:col-span-1">
                            <label className="text-xs uppercase text-gray-500 font-bold">Address</label>
                            <input
                              className={`w-full p-3 rounded-lg border mt-1 ${inputBg}`}
                              value={editForm.address}
                              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => { setIsEditing(false); toast.info("Address updated for this order"); }}
                            className="md:col-span-2 bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center gap-2"
                          >
                            <Save className="w-4 h-4" /> Save Local Changes
                          </button>
                        </>
                      ) : (
                        <div className={`p-4 rounded-xl md:col-span-2 ${inputBg}`}>
                          <p className="text-xs uppercase text-gray-500 font-bold mb-1">Shipping Address</p>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-1 text-red-500" />
                            <p className="font-semibold">
                              {editForm.address || 'No address'}, {editForm.state || 'No state'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vendor Payment Proofs */}
                  {groupedCart.map(vendor => (
                    <div key={vendor.vendorId} className={`${cardBg} border p-6 rounded-2xl shadow-lg border-emerald-200/50`}>
                      <h3 className="font-bold text-lg mb-4 flex justify-between">
                        <span>Payment to: <span className="text-red-500">{vendor.vendorName}</span></span>
                        <span className="text-emerald-600">₦{(vendor.items.reduce((s, i) => s + i.price * i.quantity, 0) + TAX_PER_VENDOR).toLocaleString()}</span>
                      </h3>

                      <div className="text-sm space-y-1 mb-4 opacity-80">
                        <p>Bank: {vendor.vendorBankName}</p>
                        <p>A/C Name: {vendor.vendorAccountName}</p>
                        <p>A/C Number: {vendor.vendorAccountNumber}</p>
                      </div>

                      {values.paymentMethod === 'pay_now' && (
                        <div className="mt-4">
                          <label className="flex items-center gap-3 p-4 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                            <div className="p-2 bg-gray-100 rounded-full"><Upload className="w-5 h-5 text-gray-600" /></div>
                            <div>
                              <p className="text-sm font-semibold">Upload Receipt</p>
                              <p className="text-xs text-gray-500">
                                {paymentProofs[vendor.vendorId] ? paymentProofs[vendor.vendorId].name : 'Click to select file'}
                              </p>
                            </div>
                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(vendor.vendorId, e.target.files?.[0])} />
                          </label>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Special Instructions */}
                  <div className={`${cardBg} border p-6 rounded-2xl shadow-lg`}>
                    <h3 className={`text-xl font-bold ${textColor} flex items-center gap-3 mb-4`}>
                      <MessageSquare className="w-5 h-5 text-purple-500" /> Special Instructions
                    </h3>
                    <Field as="textarea" name="note" rows={3} className={`w-full p-4 rounded-xl border outline-none ${inputBg}`} placeholder="Add any notes..." />
                  </div>
                </div>

                {/* RIGHT: Order Summary */}
                <div className="lg:col-span-4">
                  <div className="sticky top-8 space-y-4">
                    <div className={`${cardBg} border rounded-2xl shadow-xl overflow-hidden`}>
                      <div className="p-6 border-b border-gray-100">
                        <h3 className={`text-xl font-bold ${textColor} flex items-center gap-3`}>
                          <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                            <ShoppingBag className="w-5 h-5 text-white" />
                          </div>
                          Order Summary
                        </h3>
                      </div>

                      <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
                        <p className="text-sm text-gray-500 mb-4">
                          You are paying {vendorCount} vendor(s)
                        </p>

                        {groupedCart?.length > 0 &&
                          groupedCart.map((vendorGroup) => {
                            const vendorSubtotal = vendorGroup.items.reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0
                            );

                            return (
                              <div key={vendorGroup.vendorId} className="mb-6">
                                {/* ✅ Vendor Name */}
                                <h4 className="font-bold text-red-500 mb-2">
                                  {vendorGroup.vendorName}
                                </h4>

                                {/* ✅ Vendor Items */}
                                {vendorGroup.items.map((item) => (
                                  <div key={item.id} className="flex gap-4 p-3 rounded-lg">
                                    <div className="h-16 w-16 overflow-hidden rounded-xl border">
                                      <img
                                        src={item.image || 'https://via.placeholder.com/150'}
                                        alt={item.name}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>

                                    <div className="flex-1">
                                      <p className="text-sm font-semibold">{item.name}</p>
                                      <p className="text-xs">Qty: {item.quantity}</p>
                                      <p className="text-sm font-semibold">
                                        ₦{(item.price * item.quantity).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                ))}

                                {/* ✅ Vendor subtotal */}
                                <div className="flex justify-between mt-2 text-sm font-semibold">
                                  <span>Subtotal</span>
                                  <span>₦{vendorSubtotal.toLocaleString()}</span>
                                </div>
                              </div>
                            );
                          })}

                      </div>

                      <div className={`p-6 space-y-3 ${isDark
                        ? 'bg-gradient-to-b from-gray-800/50 to-gray-700/30'
                        : 'bg-gradient-to-b from-gray-50 to-gray-100/50'
                        }`}>
                        <div className="flex justify-between items-center">
                          <span className={`${secondaryText}`}>Subtotal</span>
                          <span className={`font-semibold ${textColor}`}>₦{subtotal.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className={`${secondaryText}`}>Delivery Fee</span>
                          <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-500' : textColor}`}>
                            {deliveryFee === 0 ? 'FREE' : `₦${deliveryFee.toLocaleString()}`}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className={`${secondaryText}`}>Tax</span>
                          <span className={`font-semibold ${textColor}`}>₦{totalTax.toLocaleString()}</span>
                        </div>

                        <div className={`pt-4 border-t ${isDark ? 'border-gray-600' : 'border-gray-200'
                          }`}>                        <div className="flex justify-between items-center">
                            <span className={`text-lg font-bold ${textColor}`}>Total Amount</span>
                            <span className="text-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-[22px] font-bold tracking-tight text-transparent">
                              ₦{orderTotal.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {values.paymentMethod === 'pay_now'
                              ? 'Including all taxes and fees'
                              : 'Pay when your order arrives'}
                          </p>

                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {values.paymentMethod === 'pay_now' ? 'Complete Payment' : 'Place Order'}
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    {/* Security Badge */}
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-700">Secure Checkout</p>
                          <p className="text-xs text-gray-500">Your information is protected</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

const Upload = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
);

export default Checkout;