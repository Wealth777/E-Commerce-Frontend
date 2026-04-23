import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ShoppingBag, Trash, Trash2 } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart } from '../../store/cartActions';
import Loading from '../../components/layout/Loding';
import { Link, Navigate } from 'react-router-dom';

const Wishlist = ({ product }) => {
  const { isDark } = useTheme();

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const removeItem = async (id) => {
    try {
      const res = await apiClient.delete(`/buyer/wishlist/${id}`);

      // setWishlist((prev) => prev.filter((item) => item.id !== id));
      // toast.error('Removed from wishlist');

      if (res.data?.success) {
        setWishlist((prev) => prev.filter((item) => item.id !== id));
        toast.error('Removed from wishlist');
      } else {
        toast.error('Failed to remove item');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const { role } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    if (role !== 'buyer') {
      toast.error('You must be a buyer to add items to cart');
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
    <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
      {/* Header Banner */}
      <div className="relative overflow-hidden max-w-6xl mx-auto mt-6">
        <div className={`absolute inset-0 rounded-2xl ${isDark ? 'bg-gradient-to-r from-green-600 via-green-500 to-yellow-500' : 'bg-gradient-to-r from-green-600 via-green-500 to-yellow-500'}`} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className={`text-3xl sm:text-4xl font-bold text-yellow-400 tracking-tight`}>My Wishlist</h1>
              </div>
              <p className={`text-white text-lg max-w-xl`}>
                Save your favorite items and come back to them anytime
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats & Controls Bar */}
      <div className="sticky top-0 z-30 backdrop-blur-xl max-w-6xl mx-auto">
        <div className={`${isDark ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-200'} border-b transition-colors duration-300`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-5">
                <span className={`text-sm font-semibold ${textColor}`}>
                  <span className="text-rose-500">{totalItems}</span> {totalItems === 1 ? 'item' : 'items'}
                </span>
                <span className={`text-sm ${textSecondary}`}>
                  Total value: <span className="font-semibold ${textColor}">₦{totalValue.toFixed(2)}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`text-sm rounded-lg px-3 py-2 border cursor-pointer outline-none transition-colors
                    ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="name">Name A → Z</option>
                </select>
                {/* View Toggle */}
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
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loading text='Loading wishlist...' />
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <h2 className={`text-2xl font-bold ${textColor}`}>Your wishlist is empty</h2>
            <Link
              to={'/products'}
              className="mt-5 inline-flex items-center gap-2 justify-center rounded-xl bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-5 h-5" />
              Start shopping
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sortedWishlist.map((item) => (
              <div
                key={item.id}
                className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}
              >
                <div className="relative aspect-square">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {!item.inStock ? (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-sm">Out of Stock</span>
                    </div>
                  ) : (
                    item.stock < 10 && (
                      <div className="absolute bottom-3 left-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        Only {item.stock} left
                      </div>
                    )
                  )}

                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 flex-shrink-0 p-1.5 dark:text-black rounded-lg hover:bg-red-300 dark:hover:bg-rose-300 transition-colors text-xs font-medium"
                    title="Remove"
                  >
                    <Trash2 className='ttext-xs font-medium' />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className={`font-semibold ${textColor}`}>{item.name}</h3>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold">₦{item.price}</span>
                    {item.originalPrice && (
                      <span className="line-through text-sm">₦{item.originalPrice}</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                    className="mt-3 w-full py-2 bg-green-600 text-white hover:bg-green-700 transition-colors text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors rounded-lg"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedWishlist.map((item) => (
              <div
                key={item.id}
                className={`group ${cardBg} rounded-2xl border ${borderColor} overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
              >
                <div className="flex items-stretch">
                  {/* Image */}
                  <div className="relative w-28 sm:w-36 flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {item.discount && (
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-md">
                        -{item.discount}%
                      </span>
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-semibold ${textColor} text-sm sm:text-base line-clamp-1`}>{item.name}</h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-red-300 dark:hover:bg-rose-900/60 transition-colors text-xs font-medium"
                          title="Remove"
                        >
                          <Trash2 className='ttext-xs font-medium' />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {/* <StarRating rating={item.rating} /> */}
                        {/* <span className={`text-xs ${textSecondary}`}>({item.reviews.toLocaleString()})</span> */}
                      </div>
                    </div>
                    <div className="flex items-end justify-between mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>₦{item.price.toFixed(2)}</span>
                        {item.originalPrice && (
                          <span className={`text-sm line-through ${textSecondary}`}>₦{item.originalPrice.toFixed(2)}</span>
                        )}
                        {!item.inStock ? (
                          <span className="text-xs font-medium text-black bg-rose-50 px-2 py-0.5 rounded-full">
                            Out of Stock
                          </span>
                        ) : item.stock < 10 ? (
                          <span className="text-xs font-medium text-black bg-yellow-50 px-2 py-0.5 rounded-full">
                            Only {item.stock} left
                          </span>
                        ) : null}
                      </div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                        className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Add to Cart
                      </button>
                    </div>
                    <p className={`text-xs mt-1.5 ${textSecondary}`}>
                      Added {item.addedDate ? new Date(item.addedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                    </p>
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