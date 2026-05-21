import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setProducts } from '../../store/productSlice';
import Hero from '../../components/layout/Hero';
import ProductCard from '../../components/cards/ProductCard';
import CategoryCard from '../../components/cards/CategoryCard';
import { useTheme } from '../../context/ThemeContext';
import apiClient from '../../api/apiClient';
import { getList, getMessage, getPayload } from '../../utils/apiResponse';
import { useToast } from '../../context/ToastContext';

const Home = () => {
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Electronics', count: 45, image: 'https://via.placeholder.com/300x150' },
    { id: 2, name: 'Fashion', count: 120, image: 'https://via.placeholder.com/300x150' },
    { id: 3, name: 'Food & Beverages', count: 80, image: 'https://via.placeholder.com/300x150' },
    { id: 4, name: 'Books', count: 65, image: 'https://via.placeholder.com/300x150' },
  ]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await apiClient.get('/vendor/product/all');
      const products = getList(response, ['products']);
      setFeaturedProducts(products.slice(0, 6));
      dispatch(setProducts(products));
    } catch (error) {
      showToast(getMessage(error, 'Failed to load featured products'), 'error');
    }
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  return (
    <div className={`min-h-screen ${bgColor}`}>
      {/* Hero Section */}
      <Hero />

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl font-bold ${textColor} mb-8`}>Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-3xl font-bold ${textColor}`}>Featured Products</h2>
            <a href="/products" className="text-red-600 hover:text-red-700 font-semibold">
              View All →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className={textColor}>No products available yet</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`bg-gradient-to-r from-green-600 to-green-800 dark:from-green-800 dark:to-green-900 text-white py-16 px-4 text-center`}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Become a Vendor</h2>
          <p className="text-red-100 mb-6">Start selling your products on CampusTrade today</p>
          <a
            href="/vendor-guidelines"
            className="px-8 py-3 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition font-semibold inline-block"
          >
            Learn More
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;