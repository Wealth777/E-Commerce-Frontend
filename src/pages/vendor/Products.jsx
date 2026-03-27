import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSave } from 'react-icons/fa';
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/vendor/product/vendor', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProducts(response.data?.data || []);
    } catch (error) {
      console.log('error' + error)
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

      // only append image if user selected new one
      // if (editingProduct.image instanceof File) {
      //   formData.append('image', editingProduct.image);
      // }

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
    if (!window.confirm('Are you sure?')) return;

    try {
      await apiClient.delete(`/vendor/product/${id}`);

      setProducts(products.filter(p => p._id !== id));

      toast.success('Product deleted');
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete product');
    }
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgColor} py-12`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${textColor}`}>My Products</h1>
          <Link
            to="/vendor/products/add"
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
          >
            <FaPlus /> Add Product
          </Link>
        </div>

        {loading ? (
          <p className={textColor}>Loading products...</p>
        ) : products.length === 0 ? (
          <div className={`${cardBg} shadow rounded-lg p-8 text-center`}>
            <p className={textColor}>No products yet</p>
            <Link to="/vendor/products/add" className="text-red-600 hover:underline mt-4 inline-block">
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={`w-full ${cardBg}`}>
              <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textColor}`}>Product</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textColor}`}>Price</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textColor}`}>Stock</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textColor}`}>Category</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textColor}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className={`px-6 py-4 ${textColor}`}>{product.name}</td>
                    <td className={`px-6 py-4 ${textColor}`}>₦{product.price?.toLocaleString()}</td>
                    <td className={`px-6 py-4 ${textColor}`}>{product.stock}</td>
                    <td className={`px-6 py-4 ${secondaryText}`}>{product.category}</td>
                    <td className={`px-6 py-4 flex gap-2`}>
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:underline flex items-center gap-1"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Product Modal */}
        {modalOpen && editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`w-full max-w-md ${cardBg} rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95`}>
              <div className={`flex justify-between items-center p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className={`text-2xl font-bold ${textColor}`}>Edit Product</h2>
                <button
                  onClick={handleCloseModal}
                  className={`p-2 rounded-full hover:bg-gray-100 ${isDark ? 'hover:bg-gray-700' : ''} transition-colors`}
                >
                  <FaTimes className={textColor} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>Product Image</label>
                  <input
                    type="text"
                    value={editingProduct.image || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    placeholder="Enter Image Url"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>Product Name</label>
                  <input
                    type="text"
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>Price (₦)</label>
                  <input
                    type="number"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    placeholder="Enter stock quantity"
                    min="0"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${textColor}`}>Category</label>
                  <input
                    type="text"
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    placeholder="Enter category"
                  />
                </div>
              </div>

              <div className={`flex gap-3 p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  onClick={handleCloseModal}
                  className={`flex-1 px-4 py-3 rounded-lg border transition-all ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
        )}
      </div>
    </div>
  );
};

export default Products;