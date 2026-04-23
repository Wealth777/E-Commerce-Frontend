import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSave, FaBox, FaLayerGroup, FaDollarSign, FaTh, FaTable, FaImage, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';

const Products = () => {
  const { isDark } = useTheme();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null)

  const isLayout = localStorage.getItem('Product Layout');
  const [layout, setLayout] = useState(isLayout || 'card');

  const handleLayout = (newLayout) => {
    setLayout(newLayout);
    localStorage.setItem('Product Layout', newLayout);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/vendor/product/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProducts(response.data?.data || []);
    } catch (error) {
      console.log(error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const retryFetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/vendor/product/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setProducts(response.data?.data || []);
    } catch (err) {
      console.log(err);
      setError('Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };


  const handleEdit = (product) => {
    setEditingProduct({ ...product });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', editingProduct.name);
      formData.append('description', editingProduct.description);
      formData.append('price', editingProduct.price);
      formData.append('category', editingProduct.category);
      formData.append('stock', editingProduct.stock);
      formData.append('image', editingProduct.image);

      const response = await apiClient.put(
        `/vendor/product/${editingProduct._id}`,
        formData
      );

      setProducts(products.map(p =>
        p._id === editingProduct._id ? response.data.product : p
      ));

      toast.success('Product updated successfully');
      setModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.log(error);
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await apiClient.delete(`/vendor/product/${id}`);
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete product');
    }
  };

  // Calculate stats
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))].length;

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: <FaExclamationTriangle />, text: 'Out of Stock' };
    if (stock < 10) return { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: <FaExclamationTriangle />, text: 'Low Stock' };
    return { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: <FaCheckCircle />, text: 'In Stock' };
  };

  const bgColor = isDark ? 'bg-gray-950' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-900' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';
  const hoverBg = isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  // if (loading) {
  //   return (
  //     <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
  //       <div className="flex flex-col items-center gap-4">
  //         <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
  //         <p className={`${secondaryText} font-medium`}>Loading your products...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className={`min-h-screen ${bgColor} pb-12`}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">My Products</h1>
              <p className="text-red-100 mt-1">Manage and monitor your product inventory</p>
            </div>
            <Link
              to="/vendor/products/add"
              className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaPlus className="text-sm" /> Add New Product
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={`${cardBg} rounded-2xl p-5 shadow-lg border ${borderColor} transition-transform hover:scale-[1.02]`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <FaBox className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${textColor}`}>{totalProducts}</p>
                <p className={`text-sm ${secondaryText}`}>Total Products</p>
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-2xl p-5 shadow-lg border ${borderColor} transition-transform hover:scale-[1.02]`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <FaLayerGroup className="text-green-600 dark:text-green-400 text-xl" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${textColor}`}>{totalStock}</p>
                <p className={`text-sm ${secondaryText}`}>Total Stock</p>
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-2xl p-5 shadow-lg border ${borderColor} transition-transform hover:scale-[1.02]`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <FaDollarSign className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${textColor}`}>₦{totalValue.toLocaleString()}</p>
                <p className={`text-sm ${secondaryText}`}>Inventory Value</p>
              </div>
            </div>
          </div>

          <div className={`${cardBg} rounded-2xl p-5 shadow-lg border ${borderColor} transition-transform hover:scale-[1.02]`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <FaTh className="text-orange-600 dark:text-orange-400 text-xl" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${textColor}`}>{categories}</p>
                <p className={`text-sm ${secondaryText}`}>Categories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Toggle & Filter Bar */}
        <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-4 mb-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${secondaryText}`}>View:</span>
              <div className={`flex rounded-xl p-1 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <button
                  onClick={() => handleLayout('card')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${layout === 'card'
                    ? 'bg-red-500 text-white shadow-md'
                    : `${secondaryText} hover:${textColor}`
                    }`}
                >
                  <FaTh /> Cards
                </button>
                <button
                  onClick={() => handleLayout('table')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${layout === 'table'
                    ? 'bg-red-500 text-white shadow-md'
                    : `${secondaryText} hover:${textColor}`
                    }`}
                >
                  <FaTable /> Table
                </button>
              </div>
            </div>
            <p className={`text-sm ${secondaryText}`}>
              Showing <span className={`font-semibold ${textColor}`}>{products.length}</span> products
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className={`text-lg font-medium ${textColor}`}>Loading products...</p>
          </div>
        ) : error ? (
          <div className={`${cardBg} p-8 text-center rounded-lg shadow`}>
            <p className={textColor}>{error}</p>

            <button
              onClick={retryFetchProducts}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-12 text-center`}>
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBox className="text-4xl text-red-500" />
            </div>
            <h3 className={`text-xl font-semibold ${textColor} mb-2`}>No Products Yet</h3>
            <p className={`${secondaryText} mb-6 max-w-md mx-auto`}>
              Start building your inventory by adding your first product. It only takes a minute!
            </p>
            <Link
              to="/vendor/products/add"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FaPlus /> Add Your First Product
            </Link>
          </div>
        ) : layout === 'table' ? (
          /* Table View */
          <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} border-b ${borderColor}`}>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${secondaryText} uppercase tracking-wider`}>Product</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${secondaryText} uppercase tracking-wider`}>Price</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${secondaryText} uppercase tracking-wider`}>Stock</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${secondaryText} uppercase tracking-wider`}>Category</th>
                    <th className={`px-6 py-4 text-right text-xs font-semibold ${secondaryText} uppercase tracking-wider`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${borderColor}`}>

                  {products.map((product, index) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <tr
                        key={product._id}
                        className={`${hoverBg} transition-colors duration-150 ${index % 2 === 0 ? '' : isDark ? 'bg-gray-800/20' : 'bg-gray-50/50'
                          }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FaImage className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className={`font-semibold ${textColor}`}>{product.name}</p>
                              <p className={`text-sm ${secondaryText}`}>ID: {product._id?.slice(-8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-semibold ${textColor}`}>₦{product.price?.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${stockStatus.color}`}>
                              {stockStatus.icon}
                              {stockStatus.text}
                            </span>
                            <span className={`text-sm pl-2 ${secondaryText}`}>({product.stock})</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                            {product.category || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="group/btn inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-all duration-200 font-medium"
                              title="Edit"
                            >
                              <FaEdit className="group-hover/btn:scale-110 transition-transform" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="group/btn inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-all duration-200 font-medium"
                              title="Delete"
                            >
                              <FaTrash className="group-hover/btn:scale-110 transition-transform" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Card View */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <div
                  key={product._id}
                  className={`group ${cardBg} rounded-2xl shadow-lg border ${borderColor} overflow-hidden hover:shadow-2xl hover:shadow-red-500/10 transform hover:-translate-y-2 transition-all duration-300`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || 'https://via.placeholder.com/400'}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target.value;
                        target.src = 'https://via.placeholder.com/400';
                      }}
                    />
                    {/* Stock Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${stockStatus.color} shadow-lg backdrop-blur-sm`}>
                        {stockStatus.icon}
                        {stockStatus.text}
                      </span>
                    </div>
                    {/* Price Tag */}
                    <div className="absolute bottom-3 right-3">
                      <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                        ₦{product.price?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <h3 className={`text-lg font-bold ${textColor} mb-2 line-clamp-2 min-h-[3.5rem]`}>
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-medium ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                        {product.category}
                      </span>
                      <span className={`text-sm font-semibold ${secondaryText}`}>
                        Stock: {product.stock}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 group/btn inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/25"
                      >
                        <FaEdit className="group-hover/btn:scale-110 transition-transform" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="group/btn px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-red-500/25"
                      >
                        <FaTrash className="group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {modalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className={`w-full max-w-lg ${cardBg} rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 animate-[modalIn_0.2s_ease-out]`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Image Preview */}
            <div className="relative h-48 bg-gradient-to-br from-red-500 via-red-600 to-orange-500">
              {editingProduct.image ? (
                <img
                  src={editingProduct.image}
                  alt={editingProduct.name}
                  className="w-full h-full object-cover opacity-90"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaImage className="text-6xl text-white/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors flex items-center justify-center"
              >
                <FaTimes />
              </button>
              <div className="absolute bottom-4 left-6">
                <h2 className="text-2xl font-bold text-white">Edit Product</h2>
                <p className="text-white/80 text-sm">Update your product details</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[50vh] overflow-y-auto">
              {/* Image URL */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${textColor}`}>
                  <span className="flex items-center gap-2">
                    <FaImage className="text-red-500" /> Image URL
                  </span>
                </label>
                <input
                  type="text"
                  value={editingProduct.image || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-0 focus:border-red-500 transition-all ${isDark
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Product Name */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${textColor}`}>
                  <span className="flex items-center gap-2">
                    <FaBox className="text-red-500" /> Product Name
                  </span>
                </label>
                <input
                  type="text"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-0 focus:border-red-500 transition-all ${isDark
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                  placeholder="Enter product name"
                />
              </div>

              {/* Price & Stock Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textColor}`}>
                    <span className="flex items-center gap-2">
                      <FaDollarSign className="text-green-500" /> Price (₦)
                    </span>
                  </label>
                  <input
                    type="number"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-0 focus:border-red-500 transition-all ${isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                      }`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${textColor}`}>
                    <span className="flex items-center gap-2">
                      <FaLayerGroup className="text-blue-500" /> Stock
                    </span>
                  </label>
                  <input
                    type="number"
                    value={editingProduct.stock || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-0 focus:border-red-500 transition-all ${isDark
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                      }`}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${textColor}`}>
                  <span className="flex items-center gap-2">
                    <FaTh className="text-purple-500" /> Category
                  </span>
                </label>
                <input
                  type="text"
                  value={editingProduct.category || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-0 focus:border-red-500 transition-all ${isDark
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                  placeholder="Enter category"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-6 border-t ${borderColor} ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3.5 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-green-500/25"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;