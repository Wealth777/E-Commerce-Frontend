import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSave, FaBox, FaLayerGroup, FaDollarSign, FaTh, FaTable, FaImage, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import apiClient from '../../api/apiClient';
import { getList, getMessage, getPayload } from '../../utils/apiResponse';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/layout/Loding';
import { ArrowLeft } from 'lucide-react';

const Products = () => {
  const { isDark } = useTheme();
  const { showToast } = useToast();

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
    setError(null);
    try {
      const response = await apiClient.get('/vendor/product/me');
      setProducts(getList(response, ['products']));
    } catch (error) {
      showToast(getMessage(error, 'Failed to load products'), 'error');
      setError(true)
    } finally {
      setLoading(false);
    }
  };

  const retryFetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/vendor/product/me');
      setProducts(getList(response, ['products']));
    } catch (err) {
      setError('Failed to load products');
      showToast(getMessage(error, 'Failed to load products'), 'error');
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
        p._id === editingProduct._id ? (getPayload(response, {}).product || getPayload(response, {})) : p
      ));

      showToast('Product updated successfully', 'success');
      setModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      showToast(getMessage(error, 'Failed to update product'), 'error');
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
      showToast('Product deleted successfully', 'success');
    } catch (error) {
      showToast(getMessage(error, 'Failed to delete product'), 'error');
    }
  };

  // Stats Logic
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))].length;

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: <FaExclamationTriangle />, text: 'Out of Stock' };
    if (stock < 10) return { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: <FaExclamationTriangle />, text: 'Low Stock' };
    return { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: <FaCheckCircle />, text: 'In Stock' };
  };

  // Theme Variables
  const bgColor = isDark ? 'bg-gray-950' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-900' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';
  const hoverBg = isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  return (
    <div className={`min-h-screen ${bgColor} pb-12 transition-colors duration-300`}>
      {/* Header Section - Improved Responsive Padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link to="/vendor/dashboard" className={`flex items-center gap-2 text-sm mb-4 ${secondaryText} hover:${textColor}`}>
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 p-6 sm:p-8 mb-8 shadow-xl`}>
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">My Products</h1>
              <p className="text-white/90 mt-1 text-sm sm:text-base">Manage and monitor your product inventory</p>
            </div>
            <Link
              to="/vendor/products/add"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-5 py-3 rounded-xl font-bold hover:bg-green-50 transition-all shadow-md active:scale-95 text-sm sm:text-base"
            >
              <FaPlus /> Add New Product
            </Link>
          </div>
        </div>

        {/* Stats Cards - Added 1-column fallback for very small screens */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', val: totalProducts, icon: <FaBox />, color: 'blue' },
            { label: 'Total Stock', val: totalStock, icon: <FaLayerGroup />, color: 'green' },
            { label: 'Inventory Value', val: `₦${totalValue.toLocaleString()}`, icon: <FaDollarSign />, color: 'purple' },
            { label: 'Categories', val: categories, icon: <FaTh />, color: 'orange' }
          ].map((stat, i) => (
            <div key={i} className={`${cardBg} rounded-2xl p-4 sm:p-5 shadow-lg border ${borderColor} transition-all hover:shadow-xl`}>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-${stat.color}-600 dark:text-${stat.color}-400 text-lg sm:text-xl`}>{stat.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className={`text-lg sm:text-2xl font-bold ${textColor} truncate`}>{stat.val}</p>
                  <p className={`text-xs sm:text-sm ${secondaryText} truncate`}>{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Layout Toggle & Filter Bar */}
        <div className={`${cardBg} rounded-2xl shadow-md border ${borderColor} p-4 mb-6`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${secondaryText}`}>View:</span>
              <div className={`flex rounded-xl p-1 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <button
                  onClick={() => handleLayout('card')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${layout === 'card' ? 'bg-red-500 text-white shadow-sm' : `${secondaryText} hover:${textColor}`}`}
                >
                  <FaTh /> <span className="hidden xs:inline">Cards</span>
                </button>
                <button
                  onClick={() => handleLayout('table')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${layout === 'table' ? 'bg-red-500 text-white shadow-sm' : `${secondaryText} hover:${textColor}`}`}
                >
                  <FaTable /> <span className="hidden xs:inline">Table</span>
                </button>
              </div>
            </div>
            <p className={`text-sm ${secondaryText}`}>
              Showing <span className={`font-semibold ${textColor}`}>{products.length}</span> products
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loading text='Loading Products...' />
          </div>
        ) : error ? (
          <div className={`${cardBg} p-10 text-center rounded-2xl shadow border ${borderColor}`}>
            <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
            <p className={textColor}>{error}</p>
            <button onClick={retryFetchProducts} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors">Retry</button>
          </div>
        ) : products.length === 0 ? (
          <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-8 sm:p-16 text-center`}>
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBox className="text-3xl text-gray-400" />
            </div>
            <h3 className={`text-xl font-bold ${textColor} mb-2`}>No Products Yet</h3>
            <p className={`${secondaryText} mb-8 max-w-sm mx-auto`}>Start building your inventory to see them listed here.</p>
            <Link to="/vendor/products/add" className="inline-flex items-center gap-2 bg-red-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-red-600 transition-all">
              <FaPlus /> Add First Product
            </Link>
          </div>
        ) : layout === 'table' ? (
          /* Responsive Table View */
          <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} overflow-hidden`}>
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className={`${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} border-b ${borderColor}`}>
                    <th className={`px-6 py-4 text-left text-xs font-bold ${secondaryText} uppercase tracking-wider`}>Product</th>
                    <th className={`px-6 py-4 text-left text-xs font-bold ${secondaryText} uppercase tracking-wider`}>Price</th>
                    <th className={`px-6 py-4 text-left text-xs font-bold ${secondaryText} uppercase tracking-wider`}>Stock</th>
                    <th className={`px-6 py-4 text-left text-xs font-bold ${secondaryText} uppercase tracking-wider`}>Category</th>
                    <th className={`px-6 py-4 text-right text-xs font-bold ${secondaryText} uppercase tracking-wider`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${borderColor}`}>
                  {products.map((product, index) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <tr key={product._id} className={`${hoverBg} transition-colors`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              {product.image ? <img src={product.image} alt="" className="w-full h-full object-cover" /> : <FaImage className="m-auto mt-3 text-gray-300" />}
                            </div>
                            <div className="truncate max-w-[150px]">
                              <p className={`font-semibold ${textColor} truncate`}>{product.name}</p>
                              <p className="text-[10px] text-gray-500 uppercase tracking-tight">ID: ...{product._id?.slice(-5)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-bold ${textColor}`}>₦{product.price?.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm ${secondaryText}`}>{product.category || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEdit(product)} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"><FaEdit /></button>
                            <button onClick={() => handleDelete(product._id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Responsive Card View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <div key={product._id} className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
                  <div className="relative h-48 sm:h-52 overflow-hidden">
                    <img src={product.image || 'https://via.placeholder.com/400'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="mb-4">
                      <h3 className={`font-bold ${textColor} text-lg line-clamp-1 mb-1`}>{product.name}</h3>
                      <p className="text-red-500 font-bold text-xl">₦{product.price?.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-5">
                      <span className={`${isDark ? 'bg-gray-800' : 'bg-gray-100'} px-2 py-1 rounded-md ${secondaryText}`}>{product.category || 'General'}</span>
                      <span className={secondaryText}>Stock: <span className="font-bold text-red-500">{product.stock}</span></span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(product)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"><FaEdit /> Edit</button>
                      <button onClick={() => handleDelete(product._id)} className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><FaTrash /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Production-Level Responsive Modal */}
      {modalOpen && editingProduct && (
        <div className="fixed inset-0 z-[100] overflow-y-auto px-4 py-6 sm:flex sm:items-center sm:justify-center">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={handleCloseModal}></div>
          <div className={`${cardBg} relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200`}>
            <div className="relative h-40 sm:h-48 bg-gray-200">
              {editingProduct.image ? (
                <img src={editingProduct.image} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900"><FaImage className="text-4xl text-white/20" /></div>
              )}
              <button onClick={handleCloseModal} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"><FaTimes /></button>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="text-xl font-bold text-white">Edit Details</h2>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${secondaryText}`}>Product Name</label>
                  <input
                    type="text"
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:border-red-500 outline-none transition-all`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${secondaryText}`}>Price (₦)</label>
                    <input
                      type="number"
                      value={editingProduct.price || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:border-red-500 outline-none transition-all`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${secondaryText}`}>Stock Count</label>
                    <input
                      type="number"
                      value={editingProduct.stock || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:border-red-500 outline-none transition-all`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${secondaryText}`}>Category</label>
                  <input
                    type="text"
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:border-red-500 outline-none transition-all`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${secondaryText}`}>Image URL</label>
                  <input
                    type="text"
                    value={editingProduct.image || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:border-red-500 outline-none transition-all`}
                  />
                </div>
              </div>
            </div>

            <div className={`p-6 border-t ${borderColor} flex gap-3`}>
              <button onClick={handleCloseModal} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-[2] py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><FaSave /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;