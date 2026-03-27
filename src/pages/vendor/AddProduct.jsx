import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { FaForward, FaStore } from 'react-icons/fa';

const AddProduct = () => {
  const [preview, setPreview] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
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
      image: Yup.mixed(),
      iimageUrl: Yup.string().url().test(
        "image-required",
        "Upload image or provide URL",
        function () {
          const { image, imageUrl } = this.parent;
          return image || imageUrl;
        }
      ),
    }),

    onSubmit: async (values, { resetForm }) => {
      setLoading(true);

      try {
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('price', values.price);
        formData.append('originalPrice', values.originalPrice);
        formData.append('category', values.category);
        formData.append('stock', values.stock);

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
  })


  const handleImage = e => {
    const file = e.target.files[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    formik.setFieldValue('image', file);
    formik.setFieldValue('imageUrl', '');
  }

  const loadingStyle = loading
    ? 'opacity-50 cursor-not-allowed'
    : 'hover:bg-green-600';



  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const inputBg = isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900';

  const styles = {
    input: `w-full px-4 py-2 rounded-md border ${isDark ? 'border-gray-600' : 'border-gray-300'} ${inputBg} focus:outline-none focus:ring-2 focus:ring-red-500`,
    label: `block text-sm font-medium ${textColor} mb-2`,
    error: `text-red-500 text-sm mt-1`
  };
  return (
    <div className={`min-h-screen ${bgColor} py-12`}>
      <div className="max-w-2xl mx-auto px-4">
        <div className='flex justify-between items-center mb-8'>
          <h1 className={`text-3xl font-bold ${textColor}`}>Add New Product</h1>

          <Link
            to="/vendor/products"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <FaStore /> View all product
          </Link>
        </div>

        <form onSubmit={formik.handleSubmit}>

          <div className={`${cardBg} shadow-lg rounded-lg p-8`}>

            <div className="space-y-6">

              <div className="flex flex-col items-center gap-3">
                <label className="cursor-pointer">
                  <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-gray-400 flex items-center justify-center">
                    <img
                      src={preview || '/placeholder.png'}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="file"
                    name='image'
                    id='image'
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                </label>

                <p className="text-sm text-gray-500">Click image to upload</p>

                {formik.touched.image && formik.errors.image && (
                  <p className="text-xs text-red-500">{formik.errors.image}</p>
                )}
              </div>

              <div>
                <label className={styles.label}>Or paste image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formik.values.imageUrl}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setPreview(e.target.value); // preview from URL
                    formik.setFieldValue('image', ''); // clear file
                  }}
                  className={styles.input}
                />
              </div>


              <label htmlFor="name" className={`block text-sm font-medium ${textColor} mb-2`}>
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={styles.input}
                placeholder="Enter product name"
              />
              <br />
              <small className="text-red-500 text-sm mt-1">
                {formik.touched.name && formik.errors.name ? formik.errors.name : ''}
              </small>
            </div>

            <div>
              <label htmlFor="description" className={`block text-sm font-medium ${textColor} mb-2`}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows="4"
                className={styles.input}
                placeholder="Describe your product"
              /><br />
              <small className="text-red-500 text-sm mt-1">
                {formik.touched.description && formik.errors.description ? formik.errors.description : ''}
              </small>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className={`block text-sm font-medium ${textColor} mb-2`}>
                  Price (₦)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={styles.input}
                  placeholder="10000"
                />
                <br />

                <small className="text-red-500 text-sm mt-1">
                  {formik.touched.price && formik.errors.price ? formik.errors.price : ''}
                </small>
              </div>

              <div>
                <label htmlFor="originalPrice" className={`block text-sm font-medium ${textColor} mb-2`}>
                  Original Price (₦)
                </label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={formik.values.originalPrice}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={styles.input}
                  placeholder="12000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className={`block text-sm font-medium ${textColor} mb-2`}>
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2 rounded-md border ${isDark ? 'border-gray-600' : 'border-gray-300'} ${inputBg} focus:outline-none focus:ring-2 focus:ring-red-500`}
                >
                  <option value="">Select category</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="food">Food & Beverages</option>
                  <option value="books">Books</option>
                </select><br />
                <small className="text-red-500 text-sm mt-1">
                  {formik.touched.category && formik.errors.category ? formik.errors.category : ''}
                </small>
              </div>

              <div>
                <label htmlFor="stock" className={`block text-sm font-medium ${textColor} mb-2`}>
                  Stock Quantity
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formik.values.stock}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={styles.input}
                  placeholder="50"
                /><br />

                <small className="text-red-500 text-sm mt-1">
                  {formik.touched.stock && formik.errors.stock ? formik.errors.stock : ''}
                </small>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 bg-green-800 text-white py-2 px-4 rounded-lg transition font-semibold disabled:opacity-50 ${loadingStyle}`}
              >
                {loading ? 'Adding...' : 'Add Product'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/vendor/products')}
                className="flex-1 bg-red-800 text-white dark:text-white py-2 px-4 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition font-semibold"
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