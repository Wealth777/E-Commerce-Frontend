import React, { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import apiClient from '../../api/apiClient';
import { getList, getMessage, getPayload } from '../../utils/apiResponse';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import Loading from '../../components/layout/Loding';

const VendorDetailsModal = ({ vendorId, isOpen, onClose }) => {
  const { showToast } = useToast();
  const { isDark } = useTheme();
  const [vendorInfo, setVendorInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Colors
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';

  const fetchVendorDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/vendor/vendor/details/${vendorId}`);
      
      const payload = getPayload(response, {});
      setVendorInfo(payload.vendorInfo || payload.vendor || payload);
      setProducts((payload.products || []).slice(0, 6));
    } catch (error) {
      showToast(getMessage(error, 'Failed to load vendor details'), 'error');
    } finally {
      setLoading(false);
    }
  }, [vendorId, showToast]);

  useEffect(() => {
    if (isOpen && vendorId) {
      fetchVendorDetails();
    }
  }, [isOpen, vendorId, fetchVendorDetails]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md ${cardBg} shadow-xl flex flex-col overflow-hidden transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold">Vendor Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loading />
            </div>
          ) : vendorInfo ? (
            <div className="p-4 space-y-6">
              {/* Profile Section */}
              <div className="text-center">
                {vendorInfo.profilePhoto && (
                  <img
                    src={vendorInfo.profilePhoto}
                    alt={vendorInfo.storeName}
                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-green-600"
                  />
                )}
                <h3 className="font-bold text-lg">{vendorInfo.storeName}</h3>
                <p className={`text-sm ${textSecondary}`}>{vendorInfo.fullName}</p>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mt-2">
                  <FaStar className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-semibold">
                    {vendorInfo.rating || 'N/A'} ({vendorInfo.reviews || 0})
                  </span>
                </div>
              </div>

              {/* Description */}
              {vendorInfo.storeDescription && (
                <p className={`text-sm ${textSecondary}`}>
                  {vendorInfo.storeDescription}
                </p>
              )}

              {/* Location & Contact */}
              <div className="space-y-2 text-sm">
                {(vendorInfo.location || vendorInfo.country) && (
                  <div className="flex items-start gap-2">
                    <FaMapMarkerAlt className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>{vendorInfo.location || vendorInfo.country}</span>
                  </div>
                )}
                {vendorInfo.email && (
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <a href={`mailto:${vendorInfo.email}`} className="text-blue-500 hover:underline truncate">
                      {vendorInfo.email}
                    </a>
                  </div>
                )}
                {vendorInfo.phoneNo && (
                  <div className="flex items-center gap-2">
                    <FaPhone className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <a href={`tel:${vendorInfo.phoneNo}`} className="text-blue-500 hover:underline">
                      {vendorInfo.phoneNo}
                    </a>
                  </div>
                )}
              </div>

              {/* View All Products Button */}
              <a
                href={`/vendor/${vendorId}`}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold text-center block"
              >
                View All Products
              </a>

              {/* Featured Products */}
              {products.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-sm">Featured Products</h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {products.map((product) => (
                      <div
                        key={product._id || product.id}
                        className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex gap-2">
                          <img
                            src={product.image || 'https://via.placeholder.com/60'}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1 text-sm">
                            <p className="font-semibold line-clamp-1">{product.name}</p>
                            <p className="text-green-600 font-bold">₦{product.price.toLocaleString()}</p>
                            <p className={`text-xs ${textSecondary}`}>{product.stock} in stock</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className={textSecondary}>Failed to load vendor details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsModal;
