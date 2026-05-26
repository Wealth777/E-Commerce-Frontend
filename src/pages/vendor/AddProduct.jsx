import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../../context/ThemeContext';
import apiClient from '../../api/apiClient';
import {
  FaStore,
  FaCloudUploadAlt,
  FaTag,
  FaMoneyBillWave,
  FaBox,
  FaList,
  FaArrowLeft,
  FaSpinner,
  FaInfoCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';

const AddProduct = () => {
  const [preview, setPreview] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [dragActive, setDragActive] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [categoriesLoading, setCategoriesLoading] = React.useState(false);

  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { showToast } = useToast();

  React.useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);

      try {
        const response = await apiClient.get('/vendor/categories');

        setCategories(
          response.data?.data ||
          response.data?.categories ||
          []
        );
      } catch (error) {
        showToast(
          error?.response?.data?.message || 'Failed to load categories',
          'error'
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [showToast]);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      category: '',
      subCategory: '',
      stock: '',
      image: '',
      imageUrl: '',
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .required('Product name is required'),

      description: Yup.string()
        .trim()
        .required('Description is required'),

      price: Yup.number()
        .typeError('Price must be a valid number')
        .required('Price is required')
        .positive('Price must be positive'),

      originalPrice: Yup.number()
        .typeError('Original price must be a valid number')
        .nullable(),

      category: Yup.string()
        .required('Category is required'),

      subCategory: Yup.string().nullable(),

      stock: Yup.number()
        .typeError('Stock must be a valid number')
        .required('Stock quantity is required')
        .integer('Stock must be a whole number')
        .min(0, 'Stock cannot be negative'),

      image: Yup.mixed().test(
        'image-required',
        'Upload image or provide URL',
        function (value) {
          const { imageUrl } = this.parent;
          return Boolean(value || imageUrl);
        }
      ),

      imageUrl: Yup.string()
        .url('Invalid URL')
        .nullable(),
    }),

    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      try {
        const formData = new FormData();

        formData.append('name', values.name.trim());
        formData.append('description', values.description.trim());
        formData.append('price', Number(values.price));
        formData.append('originalPrice', Number(values.originalPrice || values.price));
        formData.append('category', values.category);
        formData.append('stock', Number(values.stock));

        if (values.subCategory) {
          formData.append('subCategory', values.subCategory);
        }

        if (values.image) {
          formData.append('image', values.image);
        } else if (values.imageUrl) {
          formData.append('imageUrl', values.imageUrl.trim());
        }

        await apiClient.post('/vendor/product/add', formData);

        showToast('Product added successfully', 'success');
        resetForm();
        setPreview(null);
      } catch (error) {
        showToast(
          error?.response?.data?.message || 'Failed to add product',
          'error'
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const parentCategories = React.useMemo(() => {
    return categories.filter((cat) => {
      if (cat.subCategories) return true;
      return cat.level === 1 || !cat.parentCategory;
    });
  }, [categories]);

  const selectedCategory = React.useMemo(() => {
    return categories.find((cat) => cat._id === formik.values.category);
  }, [categories, formik.values.category]);

  const filteredSubCategories = React.useMemo(() => {
    if (!formik.values.category) return [];

    if (selectedCategory?.subCategories?.length) {
      return selectedCategory.subCategories;
    }

    return categories.filter((cat) => {
      const parentId =
        typeof cat.parentCategory === 'object'
          ? cat.parentCategory?._id
          : cat.parentCategory;

      return cat.level === 2 && parentId === formik.values.category;
    });
  }, [categories, selectedCategory, formik.values.category]);

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    formik.setFieldValue('image', file);
    formik.setFieldValue('imageUrl', '');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    }

    if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    formik.setFieldValue('image', file);
    formik.setFieldValue('imageUrl', '');
  };

  const discount = React.useMemo(() => {
    const price = Number(formik.values.price);
    const originalPrice = Number(formik.values.originalPrice);

    if (originalPrice && price && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }

    return 0;
  }, [formik.values.price, formik.values.originalPrice]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10 shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                type="button"
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
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg overflow-hidden sticky top-24`}>
                <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <FaCloudUploadAlt className="text-blue-500" />
                    Product Image
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
                      relative border-2 border-dashed rounded-lg overflow-hidden transition-all duration-200 aspect-square
                      ${dragActive
                        ? 'border-blue-500 bg-blue-50'
                        : isDark
                          ? 'border-gray-600 hover:border-gray-500'
                          : 'border-gray-300 hover:border-gray-400'
                      }
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
                      <>
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                          <p className="text-white opacity-0 hover:opacity-100 font-medium text-sm flex items-center gap-2">
                            <FaCloudUploadAlt />
                            Change Image
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                        <div className={`w-14 h-14 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center mb-3`}>
                          <FaCloudUploadAlt className={`w-7 h-7 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Drop image here
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                          or click to browse
                        </p>
                      </div>
                    )}
                  </div>

                  {formik.touched.image && formik.errors.image && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <span>●</span> {formik.errors.image}
                    </p>
                  )}

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className={`px-2 ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                        OR
                      </span>
                    </div>
                  </div>

                  <input
                    type="text"
                    name="imageUrl"
                    placeholder="Paste image URL"
                    value={formik.values.imageUrl}
                    onChange={(e) => {
                      formik.handleChange(e);
                      setPreview(e.target.value);
                      formik.setFieldValue('image', '');
                    }}
                    onBlur={formik.handleBlur}
                    className={`
                      w-full px-3 py-2.5 rounded-lg border text-sm transition-colors
                      ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white'
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500/20
                    `}
                  />

                  {formik.touched.imageUrl && formik.errors.imageUrl && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <span>●</span> {formik.errors.imageUrl}
                    </p>
                  )}

                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-blue-50'} text-xs space-y-1`}>
                    <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-blue-900'} flex items-center gap-1 mb-2`}>
                      <FaInfoCircle className="text-blue-500" />
                      Image Tips
                    </p>
                    <div className={`${isDark ? 'text-gray-400' : 'text-blue-700'} space-y-1`}>
                      <p>• 800x800px recommended</p>
                      <p>• JPG, PNG, WEBP up to 5MB</p>
                      <p>• Clean background works best</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg`}>
                <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <FaTag className="text-purple-500" />
                    Product Details
                  </h2>
                </div>

                <div className="p-6 space-y-5">
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
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <span>●</span> {formik.errors.name}
                      </p>
                    )}
                  </div>

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
                      rows={5}
                      placeholder="Describe your product features, benefits, and specifications..."
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 resize-none ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                    <div className="flex items-center justify-between mt-1.5">
                      {formik.touched.description && formik.errors.description ? (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <span>●</span> {formik.errors.description}
                        </p>
                      ) : (
                        <span />
                      )}
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formik.values.description.length} characters
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg`}>
                <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                    <FaMoneyBillWave className="text-green-500" />
                    Pricing
                  </h2>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="price" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Current Price (₦) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="0.00"
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                    {formik.touched.price && formik.errors.price && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <span>●</span> {formik.errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="originalPrice" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Original Price (₦)
                      <span className={`ml-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>(Optional)</span>
                    </label>
                    <input
                      type="number"
                      id="originalPrice"
                      name="originalPrice"
                      value={formik.values.originalPrice}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="0.00"
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                    {discount > 0 && (
                      <p className="mt-2 text-sm text-green-500 font-medium">
                        🏷️ {discount}% discount will be shown
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg`}>
            <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                <FaList className="text-orange-500" />
                Category & Inventory
              </h2>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label htmlFor="category" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={(e) => {
                    formik.setFieldValue('category', e.target.value);
                    formik.setFieldValue('subCategory', '');
                  }}
                  onBlur={formik.handleBlur}
                  disabled={categoriesLoading}
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50`}
                >
                  <option value="">
                    {categoriesLoading ? 'Loading categories...' : 'Select category'}
                  </option>

                  {parentCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <span>●</span> {formik.errors.category}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="subCategory" className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Subcategory
                </label>
                <select
                  id="subCategory"
                  name="subCategory"
                  value={formik.values.subCategory}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!formik.values.category || filteredSubCategories.length === 0}
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-900 focus:bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50`}
                >
                  <option value="">
                    {!formik.values.category
                      ? 'Select category first'
                      : filteredSubCategories.length === 0
                        ? 'No subcategories'
                        : 'Select subcategory'}
                  </option>

                  {filteredSubCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

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
                    className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all duration-200 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>
                {formik.touched.stock && formik.errors.stock && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <span>●</span> {formik.errors.stock}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white transition-all duration-200 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-500/25'}`}
            >
              {loading ? (
                <>
                  <FaSpinner className="w-5 h-5 animate-spin" />
                  Adding Product...
                </>
              ) : (
                <>
                  <FaCheckCircle className="w-5 h-5" />
                  Add Product
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/vendor/products')}
              disabled={loading}
              className={`flex-1 sm:flex-initial px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} disabled:opacity-50`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;