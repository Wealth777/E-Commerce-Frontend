import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, setFilter, filterProducts } from '../../store/productSlice';
import ProductCard from '../../components/cards/ProductCard';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { getList, getMessage, getPayload } from '../../utils/apiResponse';
import { FaSearch, FaSlidersH, FaLayerGroup } from 'react-icons/fa';
import Loading from '../../components/layout/Loading';
import { useToast } from '../../context/ToastContext';

const Products = () => {
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const { products, filteredProducts, filter } = useSelector((state) => state.products);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    dispatch(filterProducts());
  }, [filter, products, dispatch]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/vendor/product/all');
      dispatch(setProducts(getList(response, ['products'])));
    } catch (error) {
      showToast(getMessage(error, 'Failed to load products'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);

      const response = await apiClient.get('/vendor/categories');

      setCategories(response.data?.data || response.data?.categories || []);
    } catch (error) {
      showToast(getMessage(error, 'Failed to load categories'), 'error');
    } finally {
      setCategoriesLoading(false);
    }
  };
  const bgColor = isDark ? 'bg-gray-950' : 'bg-gray-50';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const cardBg = isDark ? 'bg-gray-900/50' : 'bg-white';
  const inputBg = isDark ? 'bg-gray-800' : 'bg-gray-100';

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
      {/* 1. Dynamic Hero Section */}
      <div className={`relative max-w-7xl mx-auto py-16 mb-8 overflow-hidden ${isDark ? 'bg-gradient-to-r from-green-600 via-green-500 to-yellow-500' : 'bg-gradient-to-r from-green-600 via-green-500 to-yellow-500'}`}>
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">
            {filter.categoryName || 'Our Catalog'}
          </h1>
          <p className="text-red-100 text-lg max-w-2xl font-medium">
            Discover premium products curated just for you. Quality meets convenience.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. Category Quick-Bar (Horizontal Scroll on Mobile) */}
        {/* <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => dispatch(setFilter({ category: cat.id }))}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all transform active:scale-95 ${filter.category === cat.id
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : `${isDark ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-600'} hover:bg-red-50 hover:text-red-600 shadow-sm border border-transparent`
                }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div> */}

        <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar mb-8">
          <button
            onClick={() => dispatch(setFilter({ category: '', categoryName: '' }))}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all transform active:scale-95 ${!filter.category
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : `${isDark ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-600'} hover:bg-red-50 hover:text-red-600 shadow-sm border border-transparent`
              }`}
          >
            <FaLayerGroup /> All Products
          </button>

          {categoriesLoading ? (
            <button className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap ${isDark ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-600'}`}>
              Loading categories...
            </button>
          ) : (
            categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() =>
                  dispatch(setFilter({
                    category: cat._id,
                    categoryName: cat.name,
                  }))
                }
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all transform active:scale-95 ${filter.category === cat._id
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : `${isDark ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-600'} hover:bg-red-50 hover:text-red-600 shadow-sm border border-transparent`
                  }`}
              >
                <FaLayerGroup /> {cat.name}
              </button>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* 3. Sticky Filter Rail */}
          <div className="lg:col-span-3">
            <div className={`sticky top-8 space-y-6 ${cardBg} p-8 rounded-[2.5rem] border ${isDark ? 'border-gray-800' : 'border-gray-200'} shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-black ${textColor} flex items-center gap-2`}>
                  <FaSlidersH className="text-green-600" /> Filters
                </h3>
                {(filter.search || filter.category) && (
                  <button
                    onClick={() => dispatch(setFilter({ search: '', category: '', categoryName: '', priceRange: [0, 100000000] }))}
                    className="text-xs font-bold text-red-500 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Enhanced Search */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Quick Search</label>
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    value={filter.search}
                    onChange={(e) => dispatch(setFilter({ search: e.target.value }))}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-red-500/50 font-medium ${inputBg} ${textColor}`}
                  />
                </div>
              </div>

              {/* Price Slider Section */}
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Budget Limit</label>
                  <span className="text-green-600 font-black text-sm">₦{filter.priceRange[1].toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000000"
                  step="5000"
                  value={filter.priceRange[1]}
                  onChange={(e) => dispatch(setFilter({ priceRange: [0, parseInt(e.target.value)] }))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                  <span>₦0</span>
                  <span>₦100M</span>
                </div>
              </div>

              <div className="pt-6 border-t border-inherit">
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/20">
                  <p className="text-xs text-red-600 dark:text-red-400 font-bold leading-relaxed">
                    Tip: Narrow down your search by using both category and price filters.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Products Result Grid */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loading text='Finding Best Products...' />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-gray-100/50 dark:bg-gray-900/20 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <FaSearch size={30} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-black mb-2">No Match Found</h2>
                <p className="text-gray-500 max-w-xs mx-auto mb-8">We couldn't find anything matching your current filters. Try adjusting them!</p>
                <button
                  onClick={() => dispatch(setFilter({ search: '', category: '', categoryName: '', priceRange: [0, 100000000] }))}
                  className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-8 px-2">
                  <p className="font-bold text-gray-500">
                    Showing <span className="text-red-600">{filteredProducts.length}</span> Results
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <div key={product._id} className="transform hover:-translate-y-2 transition-transform duration-300">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;