import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaShoppingCart, FaHeart, FaStar, FaArrowLeft, FaShieldAlt,
  FaTruck, FaUndo, FaShare, FaCheck, FaStore, FaMinus, FaPlus, FaChevronRight,
} from 'react-icons/fa';
import Loading from '../../components/layout/Loding';
import apiClient from '../../api/apiClient';
import { getList, getMessage, getPayload } from '../../utils/apiResponse';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart } from '../../store/cartActions';
import { buyerFeedbackAPI } from '../../services/feedback.service';
import { RatingForm, RatingSummary, ReviewCard, ReviewForm, ReportForm, EmptyState } from '../../components/feedback';

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
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [productReviews, setProductReviews] = useState([]);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const bgColor = isDark ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/vendor/product/${id}`);
        const payload = getPayload(response, {});
        const productData = payload.product || payload;

        setProduct({
          ...productData,
          _id: productData._id || productData.id,
          id: productData.id || productData._id,
          vendor: payload.vendor || productData.vendor,
        });

        const allProductsResponse = await apiClient.get('/vendor/product/all');
        const allProducts = getList(allProductsResponse, ['products']);

        const currentSubCategoryId =
          typeof productData.subCategory === 'object'
            ? productData.subCategory?._id
            : productData.subCategory;

        const currentCategoryId =
          typeof productData.category === 'object'
            ? productData.category?._id
            : productData.category;

        const relatedProducts = allProducts
          .filter((item) => {
            const itemId = item._id || item.id;

            const itemSubCategoryId =
              typeof item.subCategory === 'object'
                ? item.subCategory?._id
                : item.subCategory;

            const itemCategoryId =
              typeof item.category === 'object'
                ? item.category?._id
                : item.category;

            if (itemId === productData._id || itemId === productData.id) {
              return false;
            }

            if (currentSubCategoryId) {
              return itemSubCategoryId === currentSubCategoryId;
            }

            return itemCategoryId === currentCategoryId;
          })
          .slice(0, 4);

        setSimilarProducts(relatedProducts);
      } catch (error) {
        showToast(getMessage(error, 'Failed to load product'), 'error');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate, showToast]);

  const loadProductFeedback = async () => {
    if (role !== 'buyer') {
      setRatingSummary(null);
      setProductReviews([]);
      return;
    }
    try {
      const [summaryRes, reviewsRes] = await Promise.all([
        buyerFeedbackAPI.getProductRatingSummary(id),
        buyerFeedbackAPI.getProductReviews(id, { limit: 6, sortBy: 'createdAt', sortOrder: 'desc' }),
      ]);
      setRatingSummary(getPayload(summaryRes, {}));
      setProductReviews(getList(reviewsRes, ['reviews', 'data', 'items']));
    } catch (error) {
      // Public product details should still load if feedback endpoints fail.
    }
  };

  useEffect(() => {
    loadProductFeedback();
  }, [id, role]);

  const handleAddToCart = () => {
    if (!role || role !== 'buyer') {
      showToast('You must be a buyer to add items to cart', 'warning');
      navigate('/login');
      return;
    }
    dispatch(
      addToCart(
        {
          ...product,
          quantity: Math.min(
            quantity,
            product.stock
          ),
        },
        toast
      )
    );
  };

  const handleCreateRating = async (data) => {
    if (role !== 'buyer') {
      showToast('Only buyers can rate products', 'warning');
      navigate('/login');
      return;
    }
    setFeedbackLoading(true);
    try {
      await buyerFeedbackAPI.createRating(id, data);
      showToast('Rating submitted', 'success');
      setShowRatingForm(false);
      loadProductFeedback();
    } catch (error) {
      showToast(getMessage(error, 'Failed to submit rating'), 'error');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleCreateReview = async (data) => {
    if (role !== 'buyer') {
      showToast('Only buyers can review products', 'warning');
      navigate('/login');
      return;
    }
    setFeedbackLoading(true);
    try {
      await buyerFeedbackAPI.createReview(id, data);
      showToast('Review submitted', 'success');
      setShowReviewForm(false);
      loadProductFeedback();
    } catch (error) {
      showToast(getMessage(error, 'Failed to submit review'), 'error');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleCreateReport = async (data) => {
    if (role !== 'buyer') {
      showToast('Only buyers can report products from this page', 'warning');
      navigate('/login');
      return;
    }
    setFeedbackLoading(true);
    try {
      await buyerFeedbackAPI.createReport(data);
      showToast('Report submitted', 'success');
      setShowReportForm(false);
    } catch (error) {
      showToast(getMessage(error, 'Failed to submit report'), 'error');
    } finally {
      setFeedbackLoading(false);
    }
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
          productId: product._id || product.id,
        });
        setIsWishlisted(true);
        showToast('Added to wishlist', 'success');
      } else {
        await apiClient.delete(`/buyer/wishlist/${product._id || product.id}`);
        setIsWishlisted(false);
        showToast('Removed from wishlist', 'success');
      }
    } catch (error) {
      showToast(getMessage(error, 'Wishlist action failed'), 'error');
    } finally {
      setWishlistLoading(false);
    }
  };

  const categoryName =
    typeof product?.category === 'object'
      ? product?.category?.name
      : product?.category || 'General';

  const subCategoryName =
    typeof product?.subCategory === 'object'
      ? product?.subCategory?.name
      : product?.subCategory || '';

  const rating =
    Number(ratingSummary?.averageRating || ratingSummary?.average || product?.averageRating || product?.rating || 0);

  const reviewCount =
    Number(ratingSummary?.totalRatings || ratingSummary?.total || product?.totalRatings || product?.reviews || 0);

  if (loading) return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
      <Loading text='Loading Product...' />
    </div>
  );

  if (!product) return null;

  const productImages = (
    Array.isArray(product.images)
      ? product.images
      : [product.image]
  ).filter(Boolean);

  if (productImages.length === 0) {
    productImages.push(
      'https://via.placeholder.com/500x500'
    );
  }

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
          <span className="hover:text-red-600 cursor-pointer">
            {categoryName}
            {subCategoryName
              ? ` / ${subCategoryName}`
              : ''}
          </span>
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
                  src={productImages[0]}
                  alt={product.name}
                  className="max-h-full w-auto object-contain transition-all duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* Thumbnails */}
            {/* <div className="grid grid-cols-4 gap-3">
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
            </div> */}

            <div className={`rounded-3xl border p-4 shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Similar Products
                </h3>

                <span className="text-xs text-gray-500">
                  Same {subCategoryName ? 'subcategory' : 'category'}
                </span>
              </div>

              {similarProducts.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No similar products available yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {similarProducts.map((item) => (
                    <button
                      key={item._id || item.id}
                      type="button"
                      onClick={() => navigate(`/product/${item._id || item.id}`)}
                      className={`text-left rounded-2xl overflow-hidden border transition hover:shadow-md ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'
                        }`}
                    >
                      <img
                        src={item.image || 'https://via.placeholder.com/300x200'}
                        alt={item.name}
                        className="w-full h-28 object-cover"
                      />

                      <div className="p-3">
                        <p className={`text-sm font-semibold line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {item.name}
                        </p>

                        <p className="text-sm font-bold text-green-600 mt-1">
                          ₦{Number(item.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
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
                  <FaStar
                    key={i}
                    className={
                      i < Math.round(rating)
                        ? 'text-yellow-400'
                        : 'text-gray-200'
                    }
                  />
                ))}

                <span className="text-gray-500 text-sm">
                  {rating} Rating ({reviewCount})
                </span>
              </div>
              <span className="text-gray-500 text-sm">| 4.0 Rating</span>
            </div>

            <div className={`rounded-2xl p-6 border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-green-50/50 border-green-300'}`}>
              <div className="flex items-baseline gap-4 flex-wrap">
                <span className="text-4xl font-black text-green-600">
                  ₦{Number(product.price || 0).toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-gray-400 line-through">
                    ₦{Number(product.price || 0).toLocaleString()}
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
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-4 hover:text-green-600"><FaPlus /></button>
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


            <div className={`rounded-2xl p-6 border shadow-sm space-y-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold">Ratings, Reviews and Reports</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Share product feedback or report an issue.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setShowRatingForm((value) => !value)} className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white">Rate</button>
                  <button onClick={() => setShowReviewForm((value) => !value)} className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-bold text-white">Review</button>
                  <button onClick={() => setShowReportForm((value) => !value)} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white">Report</button>
                </div>
              </div>
              {showRatingForm && <RatingForm onSubmit={handleCreateRating} onCancel={() => setShowRatingForm(false)} loading={feedbackLoading} />}
              {showReviewForm && <ReviewForm onSubmit={handleCreateReview} onCancel={() => setShowReviewForm(false)} loading={feedbackLoading} />}
              {showReportForm && (
                <ReportForm
                  initialData={{ targetType: 'product', targetId: product._id || product.id }}
                  onSubmit={handleCreateReport}
                  onCancel={() => setShowReportForm(false)}
                  loading={feedbackLoading}
                />
              )}
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

        <div className="mt-10 space-y-6">
          <RatingSummary summary={ratingSummary || { averageRating: rating, totalRatings: reviewCount }} />
          <div className={`rounded-2xl p-6 border shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Latest Reviews</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recent buyer reviews for this product.</p>
              </div>
            </div>
            {productReviews.length === 0 ? (
              <EmptyState title="No reviews yet" description="Be the first buyer to review this product." />
            ) : (
              <div className="space-y-4">
                {productReviews.map((review) => (
                  <ReviewCard
                    key={review._id || review.id}
                    review={review}
                    allowReport={role === 'buyer'}
                    onReport={(item) => {
                      setShowReportForm(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] text-gray-500 uppercase">Total</p>
            <p className="text-lg font-black text-red-600">₦{Number(product.price * quantity || 0).toLocaleString()}</p>

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