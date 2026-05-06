import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ShoppingBag, Trash2 } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../context/ToastContext';
import { addToCart } from '../../store/cartActions';
import Loading from '../../components/layout/Loding';
import { Link } from 'react-router-dom';

const Wishlist = ({ product }) => {
  const { isDark } = useTheme();
  const { showToast } = useToast();

  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  const bgColor = isDark ? 'bg-gray-950' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-900' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-100';

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/buyer/wishlist');
      const items = res.data?.data?.items || [];

      const formatted = items.map((item) => {
        const product = item.product || {};
        const stock = product.countInStock ?? product.stock ?? 0;
        return {
          id: product._id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          stock: stock,
          inStock: stock > 0,
          rating: product.rating || 4,
          reviews: product.numReviews || 0,
          addedDate: item.addedAt,
        };
      });
      setWishlist(formatted);
    } catch (err) {
      showToast("Failed to fetch wishlist", 'error');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    try {
      const res = await apiClient.delete(`/buyer/wishlist/${id}`);
      if (res.data?.success) {
        setWishlist((prev) => prev.filter((item) => item.id !== id));
        showToast('Removed from wishlist', 'success');
      } else {
        showToast('Failed to remove item', 'error');
      }
    } catch (err) {
      showToast("Error removing item", 'error');
    }
  };

  const { role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    if (role !== 'buyer') {
      showToast('You must be a buyer to add items to cart', 'warning');
      return;
    }
    dispatch(addToCart({
      _id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    }));
  };

  const sortedWishlist = [...wishlist].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'name': return a.name.localeCompare(b.name);
      default: return new Date(b.addedDate) - new Date(a.addedDate);
    }
  });

  const totalValue = wishlist.reduce((sum, item) => sum + (item.price || 0), 0);
  const totalItems = wishlist.length;

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-300 pb-10`}>
      {/* Header Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative overflow-hidden rounded-2xl">
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-green-700 via-green-600 to-yellow-600' : 'bg-gradient-to-r from-green-600 via-green-500 to-yellow-500'}`} />
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative px-6 py-10 sm:py-14">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight break-words">My Wishlist</h1>
            <p className="text-white/90 text-base sm:text-lg max-w-xl mt-2">
              Save your favorite items and come back to them anytime
            </p>
          </div>
        </div>
      </div>

      {/* Stats & Controls Bar */}
      <div className="sticky top-0 z-30 backdrop-blur-xl mt-6">
        <div className={`${isDark ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-200'} border-b border-t transition-colors duration-300`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-start">
                <span className={`text-sm font-semibold ${textColor}`}>
                  <span className="text-rose-500">{totalItems}</span> {totalItems === 1 ? 'item' : 'items'}
                </span>
                <span className={`text-sm ${textSecondary}`}>
                  Total: <span className={`font-semibold ${textColor}`}>₦{totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`text-sm rounded-lg px-3 py-2 border cursor-pointer outline-none transition-colors flex-1 sm:flex-none
                    ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="name">Name A → Z</option>
                </select>

                <div className={`flex rounded-lg border p-0.5 ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? (isDark ? 'bg-gray-700 text-white shadow' : 'bg-white text-gray-900 shadow-sm') : `${textSecondary} hover:${textColor}`}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? (isDark ? 'bg-gray-700 text-white shadow' : 'bg-white text-gray-900 shadow-sm') : `${textSecondary} hover:${textColor}`}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loading text='Loading wishlist...' />
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className={`p-6 rounded-full mb-4 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
              <ShoppingBag className={`w-12 h-12 ${textSecondary}`} />
            </div>
            <h2 className={`text-2xl font-bold ${textColor}`}>Your wishlist is empty</h2>
            <p className={`mt-2 ${textSecondary}`}>Looks like you haven't added any items yet.</p>
            <Link
              to={'/products'}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-600 text-white px-8 py-3 font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-green-500/20"
            >
              Start shopping
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {sortedWishlist.map((item) => (
              <div key={item.id} className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden flex flex-col group`}>
                <div className="relative aspect-square overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="text-white font-bold px-3 py-1 border border-white/30 rounded-full text-xs uppercase tracking-wider">Out of Stock</span>
                    </div>
                  )}
                  {item.inStock && item.stock < 10 && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                      Only {item.stock} left
                    </div>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 text-rose-500 rounded-full shadow-lg hover:bg-rose-500 hover:text-white transition-all transform hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className={`font-semibold ${textColor} line-clamp-1 mb-1`}>{item.name}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className={`text-lg font-bold ${textColor}`}>₦{item.price.toLocaleString()}</span>
                    {item.originalPrice && <span className={`text-xs line-through ${textSecondary}`}>₦{item.originalPrice.toLocaleString()}</span>}
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                    className="mt-auto w-full py-2.5 bg-green-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-700 transition-colors text-sm font-bold rounded-xl shadow-md"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedWishlist.map((item) => (
              <div key={item.id} className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden hover:shadow-md transition-shadow`}>
                <div className="flex flex-col xs:flex-row items-stretch xs:items-center p-3 sm:p-4 gap-4">
                  <div className="relative w-full xs:w-32 sm:w-40 aspect-video xs:aspect-square flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className={`font-bold ${textColor} text-base sm:text-lg`}>{item.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold ${textColor}`}>₦{item.price.toLocaleString()}</span>
                        {item.originalPrice && <span className={`text-sm line-through ${textSecondary}`}>₦{item.originalPrice.toLocaleString()}</span>}
                      </div>
                      <p className={`text-xs ${textSecondary}`}>Added: {new Date(item.addedDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-green-600 text-white hover:bg-green-700 transition-colors disabled:bg-gray-400 font-bold rounded-xl text-sm"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2.5 rounded-xl border border-rose-100 text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;