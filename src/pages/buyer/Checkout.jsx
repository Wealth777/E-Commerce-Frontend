import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { useTheme } from '../../context/ThemeContext';
import apiClient from '../../api/apiClient';
import { getMessage, getPayload } from '../../utils/apiResponse';
import { clearCart } from '../../store/cartSlice';
import { useToast } from '../../context/ToastContext';

import {
  Truck,
  CreditCard,
  MessageSquare,
  ShoppingBag,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Wallet,
  HandCoins,
  MapPin,
  User,
  Edit2,
  Save,
  X,
  GraduationCap,
  Home,
  Upload,
  AlertCircle,
  Package,
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const { showToast } = useToast();

  const cartItems = useSelector(
    (state) => state.cart?.items || []
  );

  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    state: '',
    residence: '',
    address: '',
  });

  const [paymentProofs, setPaymentProofs] = useState({});


  const bgColor = isDark
    ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950'
    : 'bg-gradient-to-br from-slate-50 via-white to-zinc-100';

  const cardBg = isDark
    ? 'bg-gray-800/80 border-gray-700/50 backdrop-blur-sm'
    : 'bg-white/80 border-gray-200 backdrop-blur-sm';

  const textColor = isDark
    ? 'text-white'
    : 'text-gray-900';

  const secondaryText = isDark
    ? 'text-gray-400'
    : 'text-gray-600';

  const inputBg = isDark
    ? 'bg-gray-700/50 text-white border-gray-600'
    : 'bg-gray-50 text-gray-900 border-gray-300';


  const safeNumber = (value, fallback = 0) => {
    const number = Number(value);


    if (!Number.isFinite(number)) {
      return fallback;
    }

    return number;


  };

  const safeString = (value, fallback = '') => {
    if (
      value === null ||
      value === undefined
    ) {
      return fallback;
    }


    if (
      typeof value === 'object'
    ) {
      return fallback;
    }

    return String(value);


  };

  const getObjectName = (value, fallback = '') => {
    if (
      value === null ||
      value === undefined
    ) {
      return fallback;
    }


    if (
      typeof value === 'string' ||
      typeof value === 'number'
    ) {
      return String(value);
    }

    if (
      typeof value === 'object'
    ) {
      return (
        safeString(value.name) ||
        safeString(value.stateName) ||
        safeString(value.institutionName) ||
        safeString(value.schoolName) ||
        safeString(value.label) ||
        safeString(value.title) ||
        safeString(value.value) ||
        safeString(value.fullName) ||
        safeString(value.displayName) ||
        fallback
      );
    }

    return fallback;


  };

  const formatMoney = (value) => {
    return safeNumber(value).toLocaleString();
  };



  useEffect(() => {
    let mounted = true;


    const fetchUserProfile = async () => {
      setProfileLoading(true);
      setProfileError(false);

      try {
        const res = await apiClient.get(
          '/buyer/profile/me'
        );

        const payload = getPayload(res, {});

        const data =
          payload &&
            typeof payload === 'object'
            ? payload
            : {};

        if (!mounted) {
          return;
        }

        console.log(
          'Checkout buyer profile:',
          data
        );

        setUserProfile(data);

        const location =
          data.location &&
            typeof data.location === 'object'
            ? data.location
            : {};


        const student =
          data.student &&
            typeof data.student === 'object'
            ? data.student
            : {};


        const stateValue = getObjectName(
          location.state ||
          data.state ||
          student.state ||
          ''
        );

        const residenceValue = getObjectName(
          location.residence ||
          data.residence ||
          student.residence ||
          ''
        );

        const addressValue = getObjectName(
          location.address ||
          data.address ||
          student.address ||
          ''
        );

        setEditForm({
          state: stateValue,
          residence: residenceValue,
          address: addressValue,
        });
      } catch (error) {
        console.error(
          'Checkout profile fetch error:',
          error
        );

        if (!mounted) {
          return;
        }

        setProfileError(true);
        setUserProfile(null);

        setEditForm({
          state: '',
          residence: '',
          address: '',
        });

        showToast(
          getMessage(
            error,
            'Unable to load your delivery details. You can enter them manually.'
          ),
          'error'
        );
      } finally {
        if (mounted) {
          setProfileLoading(false);
        }
      }
    };

    fetchUserProfile();

    return () => {
      mounted = false;
    };


  }, [showToast]);

  const normalizedCartItems = useMemo(() => {
    if (!Array.isArray(cartItems)) {
      return [];
    }


    return cartItems
      .filter(
        (item) =>
          item &&
          typeof item === 'object'
      )
      .map((item) => {
        const price = safeNumber(
          item.price,
          0
        );

        const quantity = Math.max(
          1,
          Math.floor(
            safeNumber(
              item.quantity,
              1
            )
          )
        );

        return {
          ...item,

          id:
            item.id ||
            item.productId ||
            item._id ||
            '',

          quantity,

          price,

          name:
            item.name ||
            'Product',

          image:
            item.image ||
            item.images?.[0] ||
            '',

          vendorId:
            item.vendorId ||
            item.vendor?._id ||
            item.vendor?.id ||
            '',

          vendorName:
            item.vendorName ||
            item.vendor?.business?.storeName ||
            item.vendor?.fullName ||
            'Vendor',

          vendorBankName:
            item.vendorBankName ||
            item.vendor?.bankDetails?.bankName ||
            '',

          vendorAccountName:
            item.vendorAccountName ||
            item.vendor?.bankDetails?.accountName ||
            '',

          vendorAccountNumber:
            item.vendorAccountNumber ||
            item.vendor?.bankDetails?.accountNumber ||
            '',
        };
      });


  }, [cartItems]);

  const groupedCart = useMemo(() => {
    return normalizedCartItems.reduce(
      (acc, item) => {
        const vendorId =
          item.vendorId ||
          'unknown';


        if (!acc[vendorId]) {
          acc[vendorId] = {
            vendorId,

            vendorName:
              item.vendorName ||
              'Unknown Vendor',

            vendorBankName:
              item.vendorBankName ||
              '',

            vendorAccountName:
              item.vendorAccountName ||
              '',

            vendorAccountNumber:
              item.vendorAccountNumber ||
              '',

            items: [],
          };
        }

        acc[vendorId].items.push(item);

        return acc;
      },
      {}
    );


  }, [normalizedCartItems]);

  const vendorGroups = useMemo(
    () =>
      Object.values(
        groupedCart
      ),
    [groupedCart]
  );


  const subtotal = useMemo(() => {
    return normalizedCartItems.reduce(
      (sum, item) => {
        return (
          sum +
          safeNumber(item.price) *
          safeNumber(item.quantity)
        );
      },
      0
    );
  }, [normalizedCartItems]);

  const vendorCount =
    vendorGroups.length;

  if (
    !Array.isArray(cartItems) ||
    normalizedCartItems.length === 0
  ) {
    return (
      <div
        className={`min-h-screen ${bgColor} flex items-center justify-center px-4`}
      >
        <div
          className={`${cardBg} border rounded-2xl shadow-xl p-8 max-w-md w-full text-center`}
        > <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center"> <ShoppingBag className="w-8 h-8 text-green-600" /> </div>


          <h2
            className={`text-2xl font-bold ${textColor} mb-2`}
          >
            Your cart is empty
          </h2>

          <p
            className={`${secondaryText} mb-6`}
          >
            Add products to your cart before proceeding to checkout.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate('/buyer/cart')
            }
            className="w-full px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );

  }

  const validationSchema =
    Yup.object({
      delivery: Yup.string()
        .oneOf(
          ['standard', 'express'],
          'Invalid delivery method'
        )
        .required(
          'Select delivery option'
        ),


      paymentMethod: Yup.string()
        .oneOf(
          ['pay_now', 'pod'],
          'Invalid payment method'
        )
        .required(
          'Select payment method'
        ),

      note: Yup.string().max(
        500,
        'Special instructions cannot exceed 500 characters'
      ),
    });

  const handleFileUpload = (
    vendorId,
    file
  ) => {
    if (!vendorId || !file) {
      return;
    }


    setPaymentProofs((prev) => ({
      ...prev,
      [vendorId]: file,
    }));


  };

  const removePaymentProof = (
    vendorId
  ) => {
    setPaymentProofs((prev) => {
      const next = {
        ...prev,
      };


      delete next[vendorId];

      return next;
    });


  };

  const getStudent = () => {
    if (
      userProfile?.student &&
      typeof userProfile.student === 'object'
    ) {
      return userProfile.student;
    }

    return {};
  };

  const getLocation = () => {
    if (
      userProfile?.location &&
      typeof userProfile.location === 'object'
    ) {
      return userProfile.location;
    }

    return {};
  };

  const student = getStudent();
  const location = getLocation();


  const institution =
    typeof location.institution === 'object'
      ? (
        location.institution.name ||
        ''
      )
      : safeString(
        location.institution ||
        student.institution ||
        userProfile?.institution ||
        ''
      );


  const profileState =
    typeof location.state === 'object'
      ? (
        location.state.name ||
        location.state.stateName ||
        ''
      )
      : safeString(
        location.state ||
        userProfile?.state ||
        student.state ||
        ''
      );

  const profileResidence =
    safeString(
      student.residence ||
      location.residence ||
      userProfile?.residence ||
      ''
    );

  const profileAddress =
    safeString(
      student.address ||
      location.address ||
      userProfile?.address ||
      ''
    );

  const handleSubmit = async (
    values,
    { setSubmitting }
  ) => {
    if (
      normalizedCartItems.length === 0
    ) {
      showToast(
        'Your cart is empty.',
        'error'
      );


      setSubmitting(false);
      return;
    }

    const invalidItem =
      normalizedCartItems.find(
        (item) => !item.id
      );

    if (invalidItem) {
      showToast(
        'One or more products in your cart are invalid. Please refresh your cart.',
        'error'
      );

      setSubmitting(false);
      return;
    }

    const deliveryFee =
      values.delivery === 'express'
        ? 1000
        : 0;

    const orderTotal =
      subtotal + deliveryFee;

    const finalState =
      getObjectName(
        editForm.state ||
        location.state ||
        userProfile?.state ||
        student.state ||
        ''
      ).trim();

    const finalResidence =
      getObjectName(
        editForm.residence ||
        location.residence ||
        userProfile?.residence ||
        student.residence ||
        ''
      ).trim();

    const finalAddress =
      getObjectName(
        editForm.address ||
        location.address ||
        userProfile?.address ||
        student.address ||
        ''
      ).trim();

    if (!finalState) {
      showToast(
        'Please provide your delivery state.',
        'error'
      );

      setSubmitting(false);
      return;
    }

    const backendAddress =
      finalAddress ||
      finalResidence;

    if (!backendAddress) {
      showToast(
        'Please provide your delivery address.',
        'error'
      );

      setSubmitting(false);
      return;
    }


    const formData =
      new FormData();

    const backendItems =
      normalizedCartItems.map(
        (item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          vendorId: item.vendorId,
          vendorName:
            item.vendorName,
        })
      );

    formData.append(
      'items',
      JSON.stringify(
        backendItems
      )
    );

    formData.append(
      'orderTotal',
      String(orderTotal)
    );

    formData.append(
      'deliveryFee',
      String(deliveryFee)
    );

    formData.append(
      'delivery',
      values.delivery
    );

    formData.append(
      'paymentMethod',
      values.paymentMethod
    );

    formData.append(
      'note',
      values.note || ''
    );

    formData.append(
      'state',
      finalState
    );

    formData.append(
      'address',
      backendAddress
    );


    if (
      values.paymentMethod ===
      'pay_now'
    ) {
      Object.entries(
        paymentProofs
      ).forEach(
        ([vendorId, file]) => {
          if (
            vendorId &&
            file instanceof File
          ) {
            formData.append(
              `proof_${vendorId}`,
              file
            );
          }
        }
      );
    }

    try {
      const response =
        await apiClient.post(
          '/buyer/checkout',
          formData,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        );

      // console.log(
      //   'Checkout response:',
      //   response?.data
      // );

      dispatch(
        clearCart()
      );

      localStorage.removeItem(
        'cart'
      );

      showToast(
        'Order placed successfully!',
        'success'
      );

      navigate(
        '/buyer/orders'
      );
    } catch (error) {
      console.error(
        'Checkout error:',
        error
      );

      showToast(
        getMessage(
          error,
          'Failed to place order'
        ),
        'error'
      );
    } finally {
      setSubmitting(false);
    }


  };

  return (
    <div
      className={`min-h-screen ${bgColor} pb-20`}
    > <div className="max-w-7xl mx-auto px-4 pt-8">


        {/* Header */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className={`flex items-center gap-2 mb-3 ${secondaryText} hover:text-green-500 rounded-full px-3 transition-colors group`}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />

            Back to Cart
          </button>

          <h1
            className={`text-3xl font-bold ${textColor}`}
          >
            Checkout
          </h1>

          <p
            className={`${secondaryText} mt-2`}
          >
            {vendorCount} vendor
            {vendorCount === 1
              ? ''
              : 's'} in cart
            {' • '}
            Secure Transaction
          </p>

        </div>

        <Formik
          initialValues={{
            delivery:
              'standard',
            paymentMethod:
              'pay_now',
            note: '',
          }}
          validationSchema={
            validationSchema
          }
          onSubmit={
            handleSubmit
          }
        >
          {({
            isSubmitting,
            values,
            setFieldValue,
          }) => {

            const deliveryFee =
              values.delivery ===
                'express'
                ? 1000
                : 0;

            const orderTotal =
              subtotal +
              deliveryFee;

            return (
              <Form className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                <div className="lg:col-span-8 space-y-6">

                  {/* PAYMENT METHOD */}

                  <div
                    className={`${cardBg} border p-6 rounded-2xl shadow-lg`}
                  >
                    <div className="flex items-center justify-between mb-6">

                      <h3
                        className={`text-xl font-bold ${textColor} flex items-center gap-3`}
                      >
                        <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                          <Wallet className="w-5 h-5 text-white" />
                        </div>

                        Payment Method
                      </h3>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue(
                            'paymentMethod',
                            'pay_now'
                          )
                        }
                        className={`p-5 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${values.paymentMethod ===
                          'pay_now'
                          ? 'border-red-500 bg-red-50/10'
                          : isDark
                            ? 'border-gray-700'
                            : 'border-gray-200'
                          }`}
                      >
                        <CreditCard
                          className={
                            values.paymentMethod ===
                              'pay_now'
                              ? 'text-red-500'
                              : 'text-gray-400'
                          }
                        />

                        <span
                          className={`font-semibold ${textColor}`}
                        >
                          Pay Now
                        </span>

                        <span
                          className={`text-xs ${secondaryText}`}
                        >
                          Transfer and upload payment proof
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue(
                            'paymentMethod',
                            'pod'
                          )
                        }
                        className={`p-5 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${values.paymentMethod ===
                          'pod'
                          ? 'border-emerald-500 bg-emerald-50/10'
                          : isDark
                            ? 'border-gray-700'
                            : 'border-gray-200'
                          }`}
                      >
                        <HandCoins
                          className={
                            values.paymentMethod ===
                              'pod'
                              ? 'text-emerald-500'
                              : 'text-gray-400'
                          }
                        />

                        <span
                          className={`font-semibold ${textColor}`}
                        >
                          Pay on Delivery
                        </span>

                        <span
                          className={`text-xs ${secondaryText}`}
                        >
                          Pay when your order arrives
                        </span>
                      </button>

                    </div>
                  </div>

                  {/* DELIVERY METHOD */}

                  <div
                    className={`${cardBg} border p-6 rounded-2xl shadow-lg`}
                  >
                    <h3
                      className={`text-xl font-bold ${textColor} flex items-center gap-3 mb-6`}
                    >
                      <Truck className="w-5 h-5 text-blue-500" />

                      Delivery Method
                    </h3>

                    <div className="space-y-4">

                      {[
                        'standard',
                        'express',
                      ].map(
                        (type) => {

                          const selected =
                            values.delivery ===
                            type;

                          return (
                            <label
                              key={type}
                              className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all ${selected
                                ? 'border-blue-500 bg-blue-50/10'
                                : isDark
                                  ? 'border-gray-700'
                                  : 'border-gray-200'
                                }`}
                            >
                              <div className="flex items-center gap-4">

                                <Field
                                  type="radio"
                                  name="delivery"
                                  value={type}
                                  className="w-5 h-5"
                                />

                                <div>
                                  <p
                                    className={`font-semibold ${textColor}`}
                                  >
                                    {type ===
                                      'standard'
                                      ? 'Standard'
                                      : 'Express'}{' '}
                                    Delivery
                                  </p>

                                  <p
                                    className={`text-sm ${secondaryText}`}
                                  >
                                    {type ===
                                      'standard'
                                      ? '3-5 Days'
                                      : '24-48 Hours'}
                                  </p>
                                </div>
                              </div>

                              <span
                                className={`font-bold ${type ===
                                  'standard'
                                  ? 'text-green-500'
                                  : textColor
                                  }`}
                              >
                                {type ===
                                  'standard'
                                  ? 'FREE'
                                  : '₦1,000'}
                              </span>

                            </label>
                          );
                        }
                      )}

                    </div>

                    <ErrorMessage
                      name="delivery"
                      component="p"
                      className="text-sm text-red-500 mt-3"
                    />

                  </div>

                  {/* BUYER DETAILS */}

                  <div
                    className={`${cardBg} border p-6 rounded-2xl shadow-lg`}
                  >

                    <div className="flex items-center justify-between mb-6">

                      <h3
                        className={`text-xl font-bold ${textColor} flex items-center gap-3`}
                      >
                        <User className="w-5 h-5 text-emerald-500" />

                        Buyer Details
                      </h3>

                      <button
                        type="button"
                        onClick={() =>
                          setIsEditing(
                            (prev) =>
                              !prev
                          )
                        }
                        className="flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        {isEditing ? (
                          <>
                            <X className="w-4 h-4" />

                            Cancel
                          </>
                        ) : (
                          <>
                            <Edit2 className="w-4 h-4" />

                            Edit Details
                          </>
                        )}
                      </button>

                    </div>

                    {profileLoading ? (
                      <div className="flex flex-col items-center justify-center py-10">

                        <Loader2 className="w-7 h-7 animate-spin text-emerald-500 mb-3" />

                        <p
                          className={`text-sm ${secondaryText}`}
                        >
                          Loading delivery details...
                        </p>

                      </div>
                    ) : (
                      <>

                        {profileError && (
                          <div className="mb-5 p-4 rounded-xl border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700">

                            <div className="flex gap-3">

                              <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />

                              <div>

                                <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                                  Delivery details could not be loaded
                                </p>

                                <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                                  Enter your delivery information below before placing your order.
                                </p>

                              </div>

                            </div>

                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                          {/* Institution */}

                          <div
                            className={`p-4 rounded-xl ${inputBg}`}
                          >

                            <div className="flex items-center gap-2 mb-1">

                              <GraduationCap className="w-4 h-4 text-blue-500" />

                              <p className="text-xs uppercase text-gray-500 font-bold">
                                Institution
                              </p>

                            </div>

                            <p
                              className={`font-semibold ${textColor}`}
                            >
                              {institution ||
                                '---'}
                            </p>

                          </div>

                          {/* State */}

                          <div
                            className={`p-4 rounded-xl ${inputBg}`}
                          >

                            {isEditing ? (
                              <>
                                <label className="text-xs uppercase text-gray-500 font-bold">
                                  State
                                </label>

                                <input
                                  type="text"
                                  value={
                                    editForm.state
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    setEditForm(
                                      (
                                        prev
                                      ) => ({
                                        ...prev,
                                        state:
                                          e
                                            .target
                                            .value,
                                      })
                                    )
                                  }
                                  placeholder="Enter state"
                                  className={`w-full p-3 rounded-lg border mt-1 outline-none focus:ring-2 focus:ring-blue-500 ${inputBg}`}
                                />
                              </>
                            ) : (
                              <>
                                <p className="text-xs uppercase text-gray-500 font-bold mb-1">
                                  State
                                </p>

                                <p
                                  className={`font-semibold ${textColor}`}
                                >
                                  {editForm.state || profileState || '---'}
                                </p>
                              </>
                            )}

                          </div>

                          {/* Residence */}

                          <div
                            className={`p-4 rounded-xl ${inputBg}`}
                          >

                            {isEditing ? (
                              <>
                                <label className="text-xs uppercase text-gray-500 font-bold">
                                  Residence
                                </label>

                                <input
                                  type="text"
                                  value={
                                    editForm.residence
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    setEditForm(
                                      (
                                        prev
                                      ) => ({
                                        ...prev,
                                        residence:
                                          e
                                            .target
                                            .value,
                                      })
                                    )
                                  }
                                  placeholder="Enter residence"
                                  className={`w-full p-3 rounded-lg border mt-1 outline-none focus:ring-2 focus:ring-blue-500 ${inputBg}`}
                                />
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-2 mb-1">

                                  <Home className="w-4 h-4 text-purple-500" />

                                  <p className="text-xs uppercase text-gray-500 font-bold">
                                    Residence
                                  </p>

                                </div>

                                <p
                                  className={`font-semibold ${textColor}`}
                                >
                                  {editForm.residence || profileResidence ||
                                    '---'}
                                </p>
                              </>
                            )}

                          </div>

                          {/* Address */}

                          <div
                            className={`p-4 rounded-xl ${inputBg}`}
                          >

                            {isEditing ? (
                              <>
                                <label className="text-xs uppercase text-gray-500 font-bold">
                                  Delivery Address
                                </label>

                                <input
                                  type="text"
                                  value={
                                    editForm.address
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    setEditForm(
                                      (
                                        prev
                                      ) => ({
                                        ...prev,
                                        address:
                                          e
                                            .target
                                            .value,
                                      })
                                    )
                                  }
                                  placeholder="Enter delivery address"
                                  className={`w-full p-3 rounded-lg border mt-1 outline-none focus:ring-2 focus:ring-blue-500 ${inputBg}`}
                                />
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-2 mb-1">

                                  <MapPin className="w-4 h-4 text-red-500" />

                                  <p className="text-xs uppercase text-gray-500 font-bold">
                                    Delivery Address
                                  </p>

                                </div>

                                <p
                                  className={`font-semibold ${textColor}`}
                                >
                                  {editForm.address || profileAddress ||
                                    '---'}
                                </p>
                              </>
                            )}

                          </div>

                          {/* Save */}

                          {isEditing && (
                            <button
                              type="button"
                              onClick={() => {

                                const state =
                                  editForm.state.trim();

                                const residence =
                                  editForm.residence.trim();

                                const address =
                                  editForm.address.trim();

                                if (!state) {
                                  showToast(
                                    'Please enter your state.',
                                    'error'
                                  );

                                  return;
                                }

                                if (
                                  !address &&
                                  !residence
                                ) {
                                  showToast(
                                    'Please enter your delivery address or residence.',
                                    'error'
                                  );

                                  return;
                                }

                                setIsEditing(
                                  false
                                );

                                showToast(
                                  'Delivery details updated for this order.',
                                  'success'
                                );
                              }}
                              className="md:col-span-2 bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                            >
                              <Save className="w-4 h-4" />

                              Save Details
                            </button>
                          )}

                        </div>

                      </>
                    )}

                  </div>

                  {/* VENDOR PAYMENT PROOFS */}

                  {values.paymentMethod ===
                    'pay_now' &&
                    vendorGroups.map(
                      (vendor) => {

                        const vendorSubtotal =
                          vendor.items.reduce(
                            (
                              sum,
                              item
                            ) =>
                              sum +
                              safeNumber(
                                item.price
                              ) *
                              safeNumber(
                                item.quantity
                              ),
                            0
                          );

                        const selectedFile =
                          paymentProofs[
                          vendor.vendorId
                          ];

                        return (
                          <div
                            key={
                              vendor.vendorId
                            }
                            className={`${cardBg} border p-6 rounded-2xl shadow-lg border-emerald-200/50`}
                          >

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">

                              <h3
                                className={`font-bold text-lg ${textColor}`}
                              >
                                Payment to:{' '}
                                <span className="text-red-500">
                                  {
                                    vendor.vendorName
                                  }
                                </span>
                              </h3>

                              <span className="text-emerald-600 font-bold">
                                ₦
                                {formatMoney(
                                  vendorSubtotal
                                )}
                              </span>

                            </div>

                            <div
                              className={`text-sm space-y-1 mb-4 ${secondaryText}`}
                            >

                              <p>
                                Bank:{' '}
                                <span
                                  className={
                                    textColor
                                  }
                                >
                                  {vendor.vendorBankName ||
                                    '---'}
                                </span>
                              </p>

                              <p>
                                A/C Name:{' '}
                                <span
                                  className={
                                    textColor
                                  }
                                >
                                  {vendor.vendorAccountName ||
                                    '---'}
                                </span>
                              </p>

                              <p>
                                A/C Number:{' '}
                                <span
                                  className={
                                    textColor
                                  }
                                >
                                  {vendor.vendorAccountNumber ||
                                    '---'}
                                </span>
                              </p>

                            </div>

                            <label
                              className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${isDark
                                ? 'border-gray-600 hover:bg-gray-700/50'
                                : 'border-gray-300 hover:bg-gray-50'
                                }`}
                            >

                              <div className="p-2 bg-gray-100 rounded-full shrink-0">
                                <Upload className="w-5 h-5 text-gray-600" />
                              </div>

                              <div className="flex-1 min-w-0">

                                <p
                                  className={`text-sm font-semibold ${textColor}`}
                                >
                                  {selectedFile
                                    ? 'Payment receipt selected'
                                    : 'Upload Receipt'}
                                </p>

                                <p className="text-xs text-gray-500 truncate">
                                  {selectedFile
                                    ? selectedFile.name
                                    : 'Click to select an image or PDF'}
                                </p>

                              </div>

                              {!selectedFile && (
                                <input
                                  type="file"
                                  accept="image/*,.pdf"
                                  className="hidden"
                                  onChange={(
                                    e
                                  ) =>
                                    handleFileUpload(
                                      vendor.vendorId,
                                      e
                                        .target
                                        .files?.[0]
                                    )
                                  }
                                />
                              )}

                              {selectedFile && (
                                <button
                                  type="button"
                                  onClick={(
                                    e
                                  ) => {
                                    e.preventDefault();

                                    removePaymentProof(
                                      vendor.vendorId
                                    );
                                  }}
                                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 shrink-0"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              )}

                            </label>

                          </div>
                        );
                      }
                    )}

                  {/* PAY ON DELIVERY */}

                  {values.paymentMethod ===
                    'pod' && (
                      <div
                        className={`${cardBg} border p-6 rounded-2xl shadow-lg`}
                      >

                        <div className="flex gap-4">

                          <div className="p-3 bg-emerald-100 rounded-xl h-fit">
                            <HandCoins className="w-6 h-6 text-emerald-600" />
                          </div>

                          <div>

                            <h3
                              className={`font-bold ${textColor}`}
                            >
                              Pay on Delivery
                            </h3>

                            <p
                              className={`text-sm mt-1 ${secondaryText}`}
                            >
                              You will pay for your order when the delivery arrives.
                            </p>

                          </div>

                        </div>

                      </div>
                    )}

                  {/* SPECIAL INSTRUCTIONS */}

                  <div
                    className={`${cardBg} border p-6 rounded-2xl shadow-lg`}
                  >

                    <h3
                      className={`text-xl font-bold ${textColor} flex items-center gap-3 mb-4`}
                    >
                      <MessageSquare className="w-5 h-5 text-purple-500" />

                      Special Instructions
                    </h3>

                    <Field
                      as="textarea"
                      name="note"
                      rows={3}
                      className={`w-full p-4 rounded-xl border outline-none focus:ring-2 focus:ring-purple-500 ${inputBg}`}
                      placeholder="Add any notes for the vendor or delivery..."
                    />

                    <ErrorMessage
                      name="note"
                      component="p"
                      className="text-sm text-red-500 mt-2"
                    />

                  </div>

                </div>

                {/* =================================================
                RIGHT COLUMN
            ================================================== */}

                <div className="lg:col-span-4">

                  <div className="sticky top-8 space-y-4">

                    {/* ORDER SUMMARY */}

                    <div
                      className={`${cardBg} border rounded-2xl shadow-xl overflow-hidden`}
                    >

                      <div className="p-6 border-b border-gray-100 dark:border-gray-700">

                        <h3
                          className={`text-xl font-bold ${textColor} flex items-center gap-3`}
                        >
                          <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                            <ShoppingBag className="w-5 h-5 text-white" />
                          </div>

                          Order Summary
                        </h3>

                      </div>

                      <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">

                        <p
                          className={`text-sm ${secondaryText} mb-4`}
                        >
                          You are paying{' '}
                          {vendorCount}{' '}
                          vendor
                          {vendorCount ===
                            1
                            ? ''
                            : 's'}
                        </p>

                        {vendorGroups.map(
                          (
                            vendorGroup
                          ) => {

                            const vendorSubtotal =
                              vendorGroup.items.reduce(
                                (
                                  sum,
                                  item
                                ) =>
                                  sum +
                                  safeNumber(
                                    item.price
                                  ) *
                                  safeNumber(
                                    item.quantity
                                  ),
                                0
                              );

                            return (
                              <div
                                key={
                                  vendorGroup.vendorId
                                }
                                className="mb-6"
                              >

                                <div className="flex items-center justify-between gap-2 mb-2">

                                  <h4 className="font-bold text-red-500">
                                    {
                                      vendorGroup.vendorName
                                    }
                                  </h4>

                                  <span
                                    className={`text-sm font-semibold ${secondaryText}`}
                                  >
                                    ₦
                                    {formatMoney(
                                      vendorSubtotal
                                    )}
                                  </span>

                                </div>

                                {vendorGroup.items.map(
                                  (
                                    item,
                                    index
                                  ) => {

                                    const itemKey =
                                      item.id ||
                                      `${vendorGroup.vendorId}-${index}`;

                                    return (
                                      <div
                                        key={
                                          itemKey
                                        }
                                        className="flex gap-4 p-3 rounded-lg"
                                      >

                                        <div className="h-16 w-16 overflow-hidden rounded-xl border shrink-0 bg-gray-100">

                                          {item.image ? (
                                            <img
                                              src={
                                                item.image
                                              }
                                              alt={
                                                item.name
                                              }
                                              className="h-full w-full object-cover"
                                              onError={(
                                                e
                                              ) => {
                                                e.currentTarget.style.display =
                                                  'none';
                                              }}
                                            />
                                          ) : (
                                            <div className="h-full w-full flex items-center justify-center">
                                              <Package className="w-6 h-6 text-gray-400" />
                                            </div>
                                          )}

                                        </div>

                                        <div className="flex-1 min-w-0">

                                          <p
                                            className={`text-sm font-semibold ${textColor} truncate`}
                                          >
                                            {
                                              item.name
                                            }
                                          </p>

                                          <p
                                            className={`text-xs ${secondaryText}`}
                                          >
                                            Qty:{' '}
                                            {
                                              item.quantity
                                            }
                                          </p>

                                          <p
                                            className={`text-sm font-semibold ${textColor}`}
                                          >
                                            ₦
                                            {formatMoney(
                                              safeNumber(
                                                item.price
                                              ) *
                                              safeNumber(
                                                item.quantity
                                              )
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>

                      {/* TOTALS */}
                      <div
                        className={`p-6 space-y-3 ${isDark
                          ? 'bg-gradient-to-b from-gray-800/50 to-gray-700/30'
                          : 'bg-gradient-to-b from-gray-50 to-gray-100/50'
                          }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={secondaryText}>Subtotal</span>
                          <span className={`font-semibold ${textColor}`}>₦ {formatMoney(subtotal)}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className={secondaryText}>Delivery Fee</span>

                          <span
                            className={`font-semibold ${deliveryFee ===
                              0
                              ? 'text-green-500'
                              : textColor
                              }`}
                          >
                            {deliveryFee ===
                              0
                              ? 'FREE'
                              : `₦${formatMoney(
                                deliveryFee
                              )}`}
                          </span>
                        </div>

                        <div
                          className={`pt-4 border-t ${isDark
                            ? 'border-gray-600'
                            : 'border-gray-200'
                            }`}
                        >
                          <div className="flex justify-between items-center gap-4">
                            <span className={`text-lg font-bold ${textColor}`}>Total Amount</span>

                            <span className="text-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text font-bold tracking-tight text-transparent whitespace-nowrap">
                              ₦
                              {formatMoney(
                                orderTotal
                              )}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {values.paymentMethod ===
                              'pay_now'
                              ? 'Including delivery fee'
                              : 'Pay when your order arrives'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* SUBMIT BUTTON */}

                    <button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        normalizedCartItems.length ===
                        0
                      }
                      className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          {values.paymentMethod ===
                            'pay_now'
                            ? 'Complete Payment'
                            : 'Place Order'}
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    {/* SECURITY BADGE */}
                    <div
                      className={`p-4 rounded-xl border ${isDark
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                        }`}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <div className="text-center">
                          <p className={`text-sm font-medium ${textColor}`}>Secure Checkout</p>

                          <p className="text-xs text-gray-500">
                            Your information is protected
                          </p>
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

export default Checkout;