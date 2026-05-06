import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaShoppingCart, FaHeart, FaStar, FaArrowLeft, FaShieldAlt,
  FaTruck, FaUndo, FaShare, FaCheck, FaStore, FaMinus, FaPlus, FaChevronRight,
} from 'react-icons/fa';

// New Imports
import Loading from '../../components/layout/Loding';
import apiClient from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart } from '../../store/cartActions';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isDark } = useTheme();
  const { role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // State Management
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const bgColor = isDark ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/vendor/product/${id}`);
        if (response.data.success) {
          const productData = response.data.data.product;
          setProduct({
            ...productData,
            _id: productData.id, // Add _id for Redux compatibility
            vendor: response.data.data.vendor,
          });
        }
      } catch (error) {
        showToast('Failed to load product', 'error');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate, showToast]);

  const handleAddToCart = () => {
    if (!role || role !== 'buyer') {
      showToast('You must be a buyer to add items to cart', 'warning');
      navigate('/login');
      return;
    }
    dispatch(addToCart({
      ...product,
      quantity,
    }));
  };

  const handleToggleWishlist = async () => {
    if (!role) {
      showToast('Please login to add to wishlist', 'warning');
      navigate('/login');
      return;
    }

    if (role !== 'buyer') {
      showToast('Only buyers can add items to wishlist', 'warning');
      return;
    }

    setWishlistLoading(true);
    try {
      if (!isWishlisted) {
        await apiClient.post('/buyer/wishlist', {
          productId: product.id,
        });
        setIsWishlisted(true);
        showToast('Added to wishlist', 'success');
      } else {
        await apiClient.delete(`/buyer/wishlist/${product.id}`);
        setIsWishlisted(false);
        showToast('Removed from wishlist', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Wishlist action failed', 'error');
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
      <Loading text='Loading Product...' />
    </div>
  );

  if (!product) return null;

  const productImages = Array.isArray(product.images) ? product.images : [product.image];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgColor}`}>
      {/* Top Navigation Bar */}
      <div className={`sticky top-0 z-50 border-b border-gray-200/50 shadow-sm backdrop-blur-xl ${isDark ? 'bg-gray-900/80' : 'bg-white/80'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
            className={`group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition ${isDark ? "bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 ring-1 ring-white/10" : "bg-white/70 hover:bg-white text-zinc-600 ring-1 ring-zinc-900/5"}`}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
            Back
          </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <span className="hover:text-red-600 cursor-pointer">Home</span>
          <FaChevronRight className="text-[10px]" />
          <span className="hover:text-red-600 cursor-pointer">Products</span>
          <FaChevronRight className="text-[10px]" />
          <span className="hover:text-red-600 cursor-pointer">{product.category}</span>
          <FaChevronRight className="text-[10px]" />
          <span className={`font-medium truncate max-w-[150px] sm:max-w-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {product.name}
          </span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className={`relative group rounded-3xl overflow-hidden shadow-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.discount > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    -{product.discount}% OFF
                  </span>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    Limited Stock
                  </span>
                )}
              </div>

              <button
                onClick={handleToggleWishlist}
                disabled={wishlistLoading}
                className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 disabled:opacity-50"
              >
                <FaHeart className={`text-xl ${isWishlisted ? 'text-red-500' : 'text-gray-400'}`} />
              </button>

              <div className="aspect-square p-4 sm:p-8 flex items-center justify-center">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="max-h-full w-auto object-contain transition-all duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedImage === index ? 'border-green-500 ring-2 ring-green-100' : 'border-transparent bg-white'
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-full px-4 py-2">
                <FaStore className="text-yellow-500" />
                <span className="text-green-700 text-sm font-semibold">
                  {product.vendor?.storeName || product.vendor?.fullName || 'Store'}
                </span>
              </div>
            </div>

            <h1 className={`text-2xl sm:text-4xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {product.name}
            </h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-200'} />
                ))}
              </div>
              <span className="text-gray-500 text-sm">| 4.0 Rating</span>
            </div>

            <div className={`rounded-2xl p-6 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-green-50/50 border-green-300'}`}>
              <div className="flex items-baseline gap-4 flex-wrap">
                <span className="text-4xl font-black text-green-600">
                  ₦{product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-gray-400 line-through">
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold mb-3">Description</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{product.description}</p>
            </div>

            {/* Quantity & Actions */}
            <div className={`rounded-2xl p-6 border shadow-sm space-y-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Quantity</span>
                <div className={`flex items-center ${isDark ? 'bg-gray-500 border-gray-100' : 'bg-white border-gray-100'} rounded-xl`}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 hover:text-green-600"><FaMinus /></button>
                  <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-4 hover:text-green-600"><FaPlus /></button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-green-600 text-white hover:bg-green-700 transition-colors py-4 rounded-xl font-bold flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>
            </div>

            {/* Features/Trust Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {[
                { icon: <FaTruck />, label: 'Free Delivery' },
                { icon: <FaShieldAlt />, label: 'Warranty' },
                { icon: <FaUndo />, label: 'Easy Returns' }
              ].map((badge, i) => (
                <div key={i} className={`p-4 rounded-2xl border text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                  <div className="text-yellow-500 mb-2 flex justify-center">{badge.icon}</div>
                  <p className="text-[10px] sm:text-xs font-bold">{badge.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] text-gray-500 uppercase">Total</p>
            <p className="text-lg font-black text-red-600">₦{(product.price * quantity).toLocaleString()}</p>
          </div>
          <button onClick={handleAddToCart} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold">
            Add to Cart
          </button>
        </div>
      </div>
      <div className="lg:hidden h-24" />
    </div>
  );
};

export default ProductDetail;