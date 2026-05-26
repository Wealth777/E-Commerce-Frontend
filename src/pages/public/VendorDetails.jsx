import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaSlidersH, FaSort, FaCheckCircle
} from 'react-icons/fa';
import apiClient from '../../api/apiClient';
import { getList, getMessage, getPayload } from '../../utils/apiResponse';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import Loading from '../../components/layout/Loding';
import ProductCard from '../../components/cards/ProductCard';

const VendorDetails = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isDark } = useTheme();

  // State Management
  const [vendorInfo, setVendorInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);

  // Filter & Sort State
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Styling Constants
  const bgColor = isDark ? 'bg-gray-900 text-white' : 'bg-[#F8FAFC]';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-100';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';

  const getCategoryId = (product) => {
  if (!product?.category) return '';

  if (typeof product.category === 'object') {
    return product.category._id || product.category.id || '';
  }

  return product.category;
};

const getCategoryName = (product) => {
  if (!product?.category) return 'General';

  if (typeof product.category === 'object') {
    return product.category.name || 'General';
  }

  return product.categoryName || 'General';
};

const normalizeProduct = (product) => ({
  ...product,
  _id: product._id || product.id,
  id: product.id || product._id,
  categoryId: getCategoryId(product),
  categoryName: getCategoryName(product),
});

  const fetchVendorDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/vendor/vendor/details/${vendorId}`);
      const payload = getPayload(response, {});
      const vendor = payload.vendorInfo || payload.vendor || payload;
      const vendorProducts = (payload.products || []).map((product) => ({
        ...product,
        _id: product._id || product.id,
        id: product.id || product._id,

        categoryId: getCategoryId(product),
        categoryName: getCategoryName(product),
      }));

      setVendorInfo(vendor);
      setProducts(vendorProducts);
      const uniqueCategoriesMap = new Map();

      vendorProducts.forEach((product) => {
        const category = product.category;

        if (!category) return;

        if (typeof category === 'object') {
          uniqueCategoriesMap.set(category._id, {
            id: category._id,
            name: category.name,
            slug: category.slug,
          });
        } else {
          uniqueCategoriesMap.set(category, {
            id: category,
            name: category,
            slug: category,
          });
        }
      });

      setCategories([...uniqueCategoriesMap.values()]);
    } catch (error) {
      showToast(getMessage(error, 'Failed to load vendor details'), 'error');
    } finally {
      setLoading(false);
    }
  }, [vendorId, showToast]);

  const fetchVendorProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      let endpoint = `/vendor/vendor/details/${vendorId}`;
      if (selectedCategory) {
        endpoint = `/vendor/vendor/products/${vendorId}/category/${encodeURIComponent(selectedCategory)}`;
      }
      const response = await apiClient.get(endpoint);
      const payload = getPayload(response, {});
      const vendorProducts = (payload.products || (Array.isArray(payload) ? payload : [])).map((product) => ({
        ...product,
        _id: product._id || product.id,
        id: product.id || product._id,
      }));

      setProducts(vendorProducts);
    } catch (error) {
      showToast(getMessage(error, 'Failed to load products'), 'error');
    } finally {
      setProductsLoading(false);
    }
  }, [vendorId, selectedCategory, showToast]);

  const applyFilters = useCallback(() => {
    let filtered = [...products];
    if (selectedStatus) filtered = filtered.filter(p => p.status === selectedStatus);

    switch (sortBy) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'newest': filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case 'stock': filtered.sort((a, b) => b.stock - a.stock); break;
      default: break;
    }
    setFilteredProducts(filtered);
  }, [products, selectedStatus, sortBy]);

  useEffect(() => { fetchVendorDetails(); }, [fetchVendorDetails]);
  useEffect(() => { if (vendorInfo) fetchVendorProducts(); }, [selectedCategory, fetchVendorProducts, vendorInfo]);
  useEffect(() => { applyFilters(); }, [applyFilters]);

  const renderSocialLinks = (links) => {
    if (!links) return null;
    const icons = { facebook: FaFacebook, twitter: FaTwitter, instagram: FaInstagram, linkedin: FaLinkedin };
    return (
      <div className="flex gap-2 mt-4">
        {Object.entries(links).map(([platform, url]) => {
          const Icon = icons[platform.toLowerCase()];
          return Icon && url ? (
            <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-600 hover:text-white transition-all duration-300">
              <Icon className="h-4 w-4" />
            </a>
          ) : null;
        })}
      </div>
    );
  };

  if (loading) return <Loading />;

  return (
    <div className={`min-h-screen ${bgColor} pb-20`}>
      {/* Premium Header/Banner Area */}
      <div className="relative">
        <div className="h-48 md:h-72 max-w-7xl mx-auto relative bg-gray-200 dark:bg-gray-800">
          {vendorInfo.bannerImage ? (
            <img src={vendorInfo.bannerImage} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-green-600 to-green-800 opacity-20" />
          )}
          {/* Back Button Overlay */}
          <div className="absolute top-6 left-4 md:left-8 z-10">
            <button
              className={`group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition ${isDark ? "bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 ring-1 ring-white/10" : "bg-white/70 hover:bg-white text-zinc-600 ring-1 ring-zinc-900/5"}`}
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
              Back
            </button>
          </div>
        </div>

        {/* Floating Vendor Card */}
        <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-20">
          <div className={`${cardBg} rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border ${borderColor} p-6 md:p-8`}>
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
              <div className="relative -mt-16 md:-mt-20">
                <img src={vendorInfo.profilePhoto || '/default-avatar.png'} alt={vendorInfo.storeName}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover border-8 border-white dark:border-gray-800 shadow-lg" />
                {vendorInfo.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full border-4 border-white dark:border-gray-800">
                    <FaCheckCircle className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold tracking-tight">{vendorInfo.storeName}</h1>
                  <div className="flex items-center justify-center gap-1 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
                    <FaStar className="h-3 w-3 fill-current" />
                    <span className="text-xs font-bold">{vendorInfo.rating || '5.0'}</span>
                    <span className="text-xs text-gray-400">({vendorInfo.reviews || 0})</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <FaMapMarkerAlt className="text-green-600" />
                    {vendorInfo.state}, {vendorInfo.country}
                  </div>
                  <div className="text-gray-300 hidden md:block">|</div>
                  <div className="text-gray-500">Proprietor: <span className="text-gray-900 dark:text-gray-200">{vendorInfo.fullName}</span></div>
                </div>
              </div>

              <div className="hidden lg:flex flex-col items-end gap-3">
                {renderSocialLinks(vendorInfo.socialLinks)}
              </div>
            </div>

            {/* Quick Contact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
              <a href={`mailto:${vendorInfo.email}`} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 transition-colors group">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm group-hover:text-green-600"><FaEnvelope /></div>
                <div className="text-left"><p className="text-xs text-gray-400 font-bold uppercase">Email Us</p><p className="text-sm hover:underline text-blue-400">{vendorInfo.email}</p></div>
                {/* <div className="text-left"><p className="text-xs text-gray-400 font-bold uppercase">Email Us</p><p className="text-sm truncate max-w-[150px]">{vendorInfo.email}</p></div> */}
              </a>
              <a href={`tel:${vendorInfo.phoneNo}`} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 transition-colors group">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm group-hover:text-green-600"><FaPhone /></div>
                <div className="text-left"><p className="text-xs text-gray-400 font-bold uppercase">Call Now</p><p className="text-sm">{vendorInfo.phoneNo}</p></div>
              </a>
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">About Store</p>
                <p className="text-sm line-clamp-2">{vendorInfo.storeDescription || 'No description provided.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filters Sidebar - Modern Desktop Design */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Products ({filteredProducts.length})</h2>
                  <p className={`text-sm ${textSecondary} mt-1`}>
                    Browse all products from {vendorInfo.storeName}
                  </p>
                </div>
                <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200"><FaSlidersH /></button>
              </div>

              <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6`}>
                <div className={`${cardBg} p-6 rounded-3xl border ${borderColor} shadow-sm`}>
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-black uppercase text-gray-400 mb-3 block tracking-widest">Category</label>
                      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                        className={`w-full p-3 rounded-xl border ${borderColor} focus:ring-2 focus:ring-green-500 outline-none transition-all ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                          <option
                            key={cat.id}
                            value={cat.id}
                          >
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase text-gray-400 mb-3 block tracking-widest">Sort By</label>
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                        className={`w-full p-3 rounded-xl border ${borderColor} focus:ring-2 focus:ring-green-500 outline-none transition-all ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <option value="newest">Latest Arrivals</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="stock">In Stock First</option>
                      </select>
                    </div>
                  </div>

                  {(selectedCategory || selectedStatus || sortBy !== 'newest') && (
                    <button onClick={() => { setSelectedCategory(''); setSelectedStatus(''); setSortBy('newest'); }}
                      className="w-full mt-6 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1">
            {productsLoading ? (
              <div className="h-64 flex items-center justify-center"><Loading /></div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300"><FaSlidersH size={30} /></div>
                <p className="text-gray-500 font-medium">No products found matching your criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product._id || product.id} className="transition-transform duration-300 hover:-translate-y-2">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;