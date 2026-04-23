import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import {
  FaStore,
  FaCloudUploadAlt,
  FaTag,
  FaMoneyBillWave,
  FaBox,
  FaList,
  FaArrowLeft,
  FaSpinner
} from 'react-icons/fa';

const AddProduct = () => {
  const [preview, setPreview] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      stock: '',
      image: '',
      imageUrl: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Product name is required'),
      description: Yup.string().required('Description is required'),
      price: Yup.number().required('Price is required').positive('Price must be positive'),
      originalPrice: Yup.number(),
      category: Yup.string().required('Category is required'),
      stock: Yup.number().required('Stock quantity is required').positive('Stock must be positive'),
      image: Yup.mixed().test(
        "image-required",
        "Upload image or provide URL",
        function (value) {
          const { imageUrl } = this.parent;
          return value || imageUrl;
        }
      ),
      imageUrl: Yup.string().url('Invalid URL').nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      try {
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('price', Number(values.price));
        formData.append('originalPrice', Number(values.originalPrice || 0));
        formData.append('category', values.category);
        formData.append('stock', Number(values.stock));

        if (values.image) {
          formData.append('image', values.image);
        } else if (values.imageUrl) {
          formData.append('imageUrl', values.imageUrl);
        }

        await apiClient.post('/vendor/product/add', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        toast.success('Product added successfully');
        resetForm();
        setPreview(null);

      } catch (error) {
        console.log(error.response?.data || error);
        toast.error(error.response?.data?.message || 'Failed to add product');
      } finally {
        setLoading(false);
      }
    }
  });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    formik.setFieldValue('image', file);
    formik.setFieldValue('imageUrl', '');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setPreview(URL.createObjectURL(file));
      formik.setFieldValue('image', file);
      formik.setFieldValue('imageUrl', '');
    }
  };

  const calculateDiscount = () => {
    const price = parseFloat(formik.values.price);
    const originalPrice = parseFloat(formik.values.originalPrice);
    if (originalPrice && price && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();

  const categories = [
    { value: 'electronics', label: 'Electronics', icon: '💻' },
    { value: 'fashion', label: 'Fashion', icon: '👕' },
    { value: 'food', label: 'Food & Beverages', icon: '🍔' },
    { value: 'books', label: 'Books', icon: '📚' },
    { value: 'home', label: 'Home & Garden', icon: '🏠' },
    { value: 'sports', label: 'Sports & Outdoors', icon: '⚽' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/vendor/products')}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Add New Product
                </h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Create a new product listing for your store
                </p>
              </div>
            </div>
            <Link
              to="/vendor/products"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FaStore />
              View Products
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image Upload */}
          <div className="lg:col-span-1">
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6 sticky top-24`}>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                <FaCloudUploadAlt className="text-blue-500" />
                Product Image
              </h2>

              {/* Drag & Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-xl overflow-hidden transition-all duration-200
                  ${dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : isDark
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                  }
                  ${preview ? 'h-80' : 'h-64'}
                `}
              >
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  onChange={handleImage}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <div className={`w-16 h-16 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center mb-4`}>
                      <FaCloudUploadAlt className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Drop your image here, or click to browse
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
                      Supports: JPG, PNG, WEBP up to 5MB
                    </p>
                  </div>
                )}

                {preview && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                    <p className="text-white opacity-0 hover:opacity-100 font-medium flex items-center gap-2">
                      <FaCloudUploadAlt />
                      Click or drop to change
                    </p>
                  </div>
                )}
              </div>

              {formik.touched.image && formik.errors.image && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <span className="text-xs">●</span> {formik.errors.image}
                </p>
              )}

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                    Or paste URL
                  </span>
                </div>
              </div>

              {/* URL Input */}
              <div className="relative">
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formik.values.imageUrl}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setPreview(e.target.value);
                    formik.setFieldValue('image', '');
                  }}
                  className={`
                    w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-colors
                    ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20
                  `}
                />
                <FaCloudUploadAlt className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>

              {/* Tips */}
              <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-blue-50'} text-sm`}>
                <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-blue-900'} mb-1`}>
                  💡 Pro Tips
                </p>
                <ul className={`${isDark ? 'text-gray-400' : 'text-blue-700'} space-y-1 text-xs`}>
                  <li>• Use high-quality images (800x800px)</li>
                  <li>• Show the product from multiple angles</li>
                  <li>• Keep background clean and simple</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6`}>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 flex items-center gap-2`}>
                <FaTag className="text-purple-500" />
                Basic Information
              </h2>

              <div className="space-y-5">
                {/* Product Name */}
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g., Wireless Bluetooth Headphones"
                    className={`
                      w-full px-4 py-3 rounded-lg border transition-all duration-200
                      ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'
                      }
                      ${formik.touched.name && formik.errors.name
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }
                      focus:outline-none
                    `}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span className="text-xs">●</span> {formik.errors.name}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={4}
                    placeholder="Describe your product features, benefits, and specifications..."
                    className={`
                      w-full px-4 py-3 rounded-lg border transition-all duration-200 resize-none
                      ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'
                      }
                      ${formik.touched.description && formik.errors.description
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }
                      focus:outline-none
                    `}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span className="text-xs">●</span> {formik.errors.description}
                    </p>
                  )}
                  <p className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formik.values.description.length} characters
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6`}>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 flex items-center gap-2`}>
                <FaMoneyBillWave className="text-green-500" />
                Pricing
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Current Price */}
                <div>
                  <label htmlFor="price" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Current Price (₦) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>₦</span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="0.00"
                      className={`
                        w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200
                        ${isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'
                        }
                        ${formik.touched.price && formik.errors.price
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        }
                        focus:outline-none
                      `}
                    />
                  </div>
                  {formik.touched.price && formik.errors.price && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span className="text-xs">●</span> {formik.errors.price}
                    </p>
                  )}
                </div>

                {/* Original Price */}
                <div>
                  <label htmlFor="originalPrice" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Original Price (₦)
                    <span className={`ml-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>(Optional)</span>
                  </label>
                  <div className="relative">
                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>₦</span>
                    <input
                      type="number"
                      id="originalPrice"
                      name="originalPrice"
                      value={formik.values.originalPrice}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="0.00"
                      className={`
                        w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200
                        ${isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'
                        }
                        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none
                      `}
                    />
                  </div>
                  {discount > 0 && (
                    <p className="mt-2 text-sm text-green-500 font-medium">
                      🏷️ {discount}% discount will be shown
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Category & Inventory */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm p-6`}>
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 flex items-center gap-2`}>
                <FaList className="text-orange-500" />
                Category & Inventory
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Category */}
                <div>
                  <label htmlFor="category" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`
                        w-full px-4 py-3 rounded-lg border transition-all duration-200 appearance-none
                        ${isDark
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white'
                        }
                        ${formik.touched.category && formik.errors.category
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        }
                        focus:outline-none
                      `}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                    <FaList className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  {formik.touched.category && formik.errors.category && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span className="text-xs">●</span> {formik.errors.category}
                    </p>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label htmlFor="stock" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaBox className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formik.values.stock}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="0"
                      className={`
                        w-full pl-11 pr-4 py-3 rounded-lg border transition-all duration-200
                        ${isDark
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'
                        }
                        ${formik.touched.stock && formik.errors.stock
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        }
                        focus:outline-none
                      `}
                    />
                  </div>
                  {formik.touched.stock && formik.errors.stock && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <span className="text-xs">●</span> {formik.errors.stock}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white
                  transition-all duration-200 transform ${!loading && 'hover:scale-[1.02] active:scale-[0.98]'}
                  ${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-500/25'
                  }
                `}
              >
                {loading ? (
                  <>
                    <FaSpinner className="w-5 h-5 animate-spin" />
                    Adding Product...
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt className="w-5 h-5" />
                    Add Product
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/vendor/products')}
                disabled={loading}
                className={`
                  flex-1 sm:flex-initial px-6 py-4 rounded-xl font-semibold
                  transition-all duration-200
                  ${isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;