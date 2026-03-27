import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, setFilter, filterProducts } from '../../store/productSlice';
import ProductCard from '../../components/cards/ProductCard';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';

const Products = () => {
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const { products, filteredProducts, filter } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    dispatch(filterProducts());
  }, [filter, products, dispatch]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/vendor/product/all');
      dispatch(setProducts(response.data.data || []));
    } catch (error) {
      console.log(error)
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const inputBg = isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900';

  return (
    <div className={`min-h-screen ${bgColor} py-12`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className={`text-4xl font-bold ${textColor} mb-8`}>Products</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className={`md:col-span-1 ${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
            <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Filters</h3>

            {/* Search */}
            <div className="mb-6">
              <label className={`block text-sm font-medium ${textColor} mb-2`}>Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={filter.search}
                onChange={(e) => dispatch(setFilter({ search: e.target.value }))}
                className={`w-full px-3 py-2 rounded-md border ${isDark ? 'border-gray-600' : 'border-gray-300'} ${inputBg}`}
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className={`block text-sm font-medium ${textColor} mb-2`}>Category</label>
              <select
                value={filter.category}
                onChange={(e) => dispatch(setFilter({ category: e.target.value }))}
                className={`w-full px-3 py-2 rounded-md border ${isDark ? 'border-gray-600' : 'border-gray-300'} ${inputBg}`}
              >
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="food">Food & Beverages</option>
                <option value="books">Books</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className={`block text-sm font-medium ${textColor} mb-2`}>Price Range</label>
              <input
                type="range"
                min="0"
                max="100000000"
                value={filter.priceRange[1]}
                onChange={(e) =>
                  dispatch(setFilter({ priceRange: [10000000, parseInt(e.target.value)] }))
                }
                className="w-full"
              />
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                Up to ₦{filter.priceRange[1].toLocaleString()}
              </p>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className={textColor}>Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className={textColor}>No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;