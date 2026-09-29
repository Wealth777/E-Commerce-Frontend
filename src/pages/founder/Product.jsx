import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/apiClient';

import {
  Package,
  Eye,
  EyeOff,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart3,
  DollarSign,
  ShoppingBag,
  Star,
  X,
  Store,
  Layers,
  AlertCircle,
  SlidersHorizontal,
  ArrowLeft
} from 'lucide-react';
import Loading from '../../components/layout/Loding';

export default function ManageProducts() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Main Data States
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // Filters & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Modal / Drawer States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productStats, setProductStats] = useState(null);
  const [loadingProductStats, setLoadingProductStats] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // Visibility Toggle Action Modal State
  const [visibilityModalProduct, setVisibilityModalProduct] = useState(null);
  const [targetVisibility, setTargetVisibility] = useState(true);
  const [visibilityReason, setVisibilityReason] = useState('');
  const [isSubmittingVisibility, setIsSubmittingVisibility] = useState(false);

  // Fetch Paginated Products
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);

    try {
      const params = {
        page,
        limit,
        search: searchQuery.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      };

      if (visibilityFilter === 'visible') {
        params.visibility = true;
      }

      if (visibilityFilter === 'hidden') {
        params.visibility = false;
      }

      const response = await apiClient.get('/founder/products', {
        params,
      });

      const body = response?.data;

      const result =
        body?.data?.products
          ? body.data
          : body?.products
            ? body
            : null;

      if (!result) {
        setProducts([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        });

        showToast('Invalid products response from server', 'error');
        return;
      }

      const productList = Array.isArray(result.products)
        ? result.products
        : [];

      setProducts(productList);

      if (result.pagination) {
        setPagination(result.pagination);
      }

      setStats({
        products: {
          total:
            result.pagination?.totalProducts ??
            productList.length,

          visible: productList.filter(
            (product) => product.visibility === true
          ).length,

          hidden: productList.filter(
            (product) => product.visibility === false
          ).length,
        },

        inventory: {
          inStock: productList.filter(
            (product) => product.status === 'in-stock'
          ).length,

          lowStock: productList.filter(
            (product) => product.status === 'low-in-stock'
          ).length,

          outOfStock: productList.filter(
            (product) => product.status === 'out-of-stock'
          ).length,

          totalStockValue: productList.reduce(
            (total, product) =>
              total +
              Number(product.price || 0) *
              Number(product.stock || 0),
            0
          ),

          totalUnits: productList.reduce(
            (total, product) =>
              total + Number(product.stock || 0),
            0
          ),
        },

        sales: {
          totalUnitsSold: productList.reduce(
            (total, product) =>
              total + Number(product.sold || 0),
            0
          ),
        },
      });
    } catch (error) {
      showToast(
        error?.response?.data?.message ||
        'Failed to fetch products list',
        'error'
      );
    } finally {
      setLoadingProducts(false);
    }
  }, [
    page,
    limit,
    searchQuery,
    statusFilter,
    visibilityFilter,
    showToast,
  ]);

  // Fetch Single Product Stats
  const fetchSingleProductStats = async (productId) => {
    setLoadingProductStats(true);
    try {
      const response = await apiClient.get(`/founder/products/${productId}/stats`);
      setProductStats(response.data || response);
    } catch (error) {
      showToast('Failed to load product details stats', 'error');
    } finally {
      setLoadingProductStats(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setProductStats(null);
    setIsDetailDrawerOpen(true);
    fetchSingleProductStats(product._id);
  };

  const handleOpenVisibilityModal = (product) => {
    setVisibilityModalProduct(product);
    setTargetVisibility(!product.visibility);
    setVisibilityReason('');
  };

  const handleConfirmVisibilityToggle = async () => {
    if (!visibilityModalProduct) return;
    setIsSubmittingVisibility(true);

    try {
      await apiClient.patch(
        `/founder/products/${visibilityModalProduct._id}/visibility`,
        {
          visibility: targetVisibility,
          reason: visibilityReason || undefined,
        }
      );

      showToast(
        `Product visibility updated to ${targetVisibility ? 'Visible' : 'Hidden'}`,
        'success'
      );

      fetchProducts();

      if (selectedProduct && selectedProduct._id === visibilityModalProduct._id) {
        setSelectedProduct((prev) => ({
          ...prev,
          visibility: targetVisibility,
          visibilityReason: visibilityReason,
          visibilityActionAt: new Date().toISOString(),
        }));
      }

      setVisibilityModalProduct(null);
    } catch (err) {
      showToast(
        err.response?.data?.message || 'Failed to update product visibility',
        'error'
      );
    } finally {
      setIsSubmittingVisibility(false);
    }
  };

  // Helper formatting currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors ${isDark ? 'text-gray-100' : 'text-slate-900'
        }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className={`group inline-flex items-center gap-2 text-xs font-medium transition-colors mb-2 rounded-full px-3 py-1.5 ${isDark
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                : 'bg-white hover:bg-slate-100 text-slate-600 ring-1 ring-slate-200'
                }`}
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            <h1 className="text-2xl font-bold tracking-tight">Product Management</h1>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Monitor inventory, product analytics, and regulate visibility across CampusTrade.
            </p>
          </div>

          <button
            onClick={() => {
              fetchProducts();
            }}
            className={`self-start md:self-auto flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${isDark
              ? 'border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-200'
              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm'
              }`}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loadingProducts || loadingStats ? 'animate-spin text-emerald-500' : ''
                }`}
            />
            Refresh Data
          </button>
        </div>

        {/* Global Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total & Visible */}
          <div
            className={`p-4 rounded-xl border ${isDark ? 'border-gray-800 bg-gray-900/60' : 'border-slate-200 bg-white shadow-sm'
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-gray-400">Total Products</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stats?.products?.total ?? 0}</span>
              <span className="text-xs text-emerald-500 font-semibold">
                ({stats?.products?.visible ?? 0} Visible)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {stats?.products?.hidden ?? 0} hidden from catalog
            </p>
          </div>

          {/* Stock Status */}
          <div
            className={`p-4 rounded-xl border ${isDark ? 'border-gray-800 bg-gray-900/60' : 'border-slate-200 bg-white shadow-sm'
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-gray-400">Inventory Status</span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stats?.inventory?.inStock ?? 0}</span>
              <span className="text-xs text-slate-400">In Stock</span>
            </div>
            <div className="flex gap-2 text-[11px] mt-1 font-medium">
              <span className="text-amber-500">{stats?.inventory?.lowStock ?? 0} Low Stock</span>
              <span>•</span>
              <span className="text-rose-500">{stats?.inventory?.outOfStock ?? 0} Out of Stock</span>
            </div>
          </div>

          {/* Total Stock Value */}
          <div
            className={`p-4 rounded-xl border ${isDark ? 'border-gray-800 bg-gray-900/60' : 'border-slate-200 bg-white shadow-sm'
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-gray-400">Total Valuation</span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold">
                {formatCurrency(stats?.inventory?.totalStockValue)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Across {stats?.inventory?.totalUnits ?? 0} total units in stock
            </p>
          </div>

          {/* Units Sold */}
          <div
            className={`p-4 rounded-xl border ${isDark ? 'border-gray-800 bg-gray-900/60' : 'border-slate-200 bg-white shadow-sm'
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-gray-400">Total Units Sold</span>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stats?.sales?.totalUnitsSold ?? 0}</span>
              <span className="text-xs text-purple-500 font-semibold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5 inline" /> Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Aggregated sales across all vendors
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div
          className={`p-4 rounded-xl border ${isDark ? 'border-gray-800 bg-gray-900/60' : 'border-slate-200 bg-white shadow-sm'
            } space-y-3 md:space-y-0 md:flex md:items-center md:justify-between gap-4`}
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className={`w-full pl-9 pr-4 py-2 text-xs rounded-lg border outline-none transition-all ${isDark
                ? 'border-gray-700 bg-gray-800 focus:border-emerald-500 text-white placeholder-gray-500'
                : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 text-slate-800'
                }`}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Stock Status Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className={`py-1.5 px-2.5 rounded-lg border text-xs outline-none cursor-pointer ${isDark
                  ? 'border-gray-700 bg-gray-800 text-gray-200'
                  : 'border-slate-200 bg-white text-slate-700'
                  }`}
              >
                <option value="all">All Inventory</option>
                <option value="in-stock">In Stock</option>
                <option value="low-in-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>

            {/* Visibility Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={visibilityFilter}
                onChange={(e) => {
                  setVisibilityFilter(e.target.value);
                  setPage(1);
                }}
                className={`py-1.5 px-2.5 rounded-lg border text-xs outline-none cursor-pointer ${isDark
                  ? 'border-gray-700 bg-gray-800 text-gray-200'
                  : 'border-slate-200 bg-white text-slate-700'
                  }`}
              >
                <option value="all">All Visibility</option>
                <option value="visible">Visible Only</option>
                <option value="hidden">Hidden Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div
          className={`rounded-xl border overflow-hidden ${isDark ? 'border-gray-800 bg-gray-900/60' : 'border-slate-200 bg-white shadow-sm'
            }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`border-b ${isDark
                    ? 'border-gray-800 bg-gray-900/40 text-gray-400'
                    : 'border-slate-100 bg-slate-50/50 text-slate-400'
                    } text-[11px] font-bold uppercase tracking-wider`}
                >
                  <th className="py-3.5 px-6">Product Info</th>
                  <th className="py-3.5 px-6">Vendor</th>
                  <th className="py-3.5 px-6">Price & Sales</th>
                  <th className="py-3.5 px-6">Stock Status</th>
                  <th className="py-3.5 px-6">Visibility</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-800 text-xs">
                {loadingProducts ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      <Loading text='Loading products...' />
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      <Package className="w-8 h-8 opacity-40 mx-auto mb-2" />
                      No products found matching your filters.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className={`hover:${isDark ? 'bg-gray-800/40' : 'bg-slate-50/80'} transition-colors`}
                    >
                      {/* Product & Category */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image || 'https://via.placeholder.com/60'}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-gray-700 bg-slate-100 dark:bg-gray-800 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className={`font-bold text-xs line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {product.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400">
                              <Layers className="w-3 h-3" />
                              <span>{product.category?.name || 'Uncategorized'}</span>
                              {product.subCategory && (
                                <span>/ {product.subCategory?.name}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-amber-500 font-medium">
                              <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                              <span>
                                {product.ratingSummary?.averageRating?.toFixed(1) || '0.0'} ({product.ratingSummary?.totalRatings || 0})
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Vendor */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Store className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <div>
                            <p className={`font-medium line-clamp-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                              {product.vendor?.business?.storeName || product.vendor?.fullName || 'Vendor N/A'}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {product.vendor?.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Price & Sales */}
                      <td className="py-4 px-6">
                        <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                          {formatCurrency(product.price)}
                        </p>
                        {product.originalPrice > product.price && (
                          <p className="text-[10px] text-slate-400 line-through">
                            {formatCurrency(product.originalPrice)}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {product.sold} sold
                        </p>
                      </td>

                      {/* Stock Status */}
                      <td className="py-4 px-6">
                        {product.status === 'in-stock' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md text-[11px] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {product.stock} in stock
                          </span>
                        ) : product.status === 'low-in-stock' ? (
                          <span className="inline-flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md text-[11px] font-medium">
                            <AlertTriangle className="w-3.5 h-3.5" /> {product.stock} low stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-md text-[11px] font-medium">
                            <XCircle className="w-3.5 h-3.5" /> Out of stock
                          </span>
                        )}
                      </td>

                      {/* Visibility */}
                      <td className="py-4 px-6">
                        {product.visibility ? (
                          <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold text-[11px]">
                            <Eye className="w-3.5 h-3.5" /> Visible
                          </span>
                        ) : (
                          <div>
                            <span className="inline-flex items-center gap-1 text-rose-500 font-semibold text-[11px]">
                              <EyeOff className="w-3.5 h-3.5" /> Hidden
                            </span>
                            {product.visibilityActionModel && (
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                By {product.visibilityActionModel}
                              </p>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Stats & Details */}
                          <button
                            onClick={() => handleOpenDetail(product)}
                            title="View Product Details & Stats"
                            className={`p-1.5 rounded-lg border transition-colors ${isDark
                              ? 'border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300'
                              : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-700'
                              }`}
                          >
                            <BarChart3 className="w-4 h-4 text-emerald-500" />
                          </button>

                          {/* Toggle Visibility Button */}
                          <button
                            onClick={() => handleOpenVisibilityModal(product)}
                            title={product.visibility ? 'Hide Product' : 'Make Visible'}
                            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${product.visibility
                              ? 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500'
                              : 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500'
                              }`}
                          >
                            {product.visibility ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5" /> Hide
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5" /> Show
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div
            className={`p-4 border-t ${isDark ? 'border-gray-800 bg-gray-900/40' : 'border-slate-100 bg-slate-50/50'
              } flex items-center justify-between`}
          >
            <p className="text-xs text-slate-400">
              Showing Page{' '}
              <span className="font-semibold text-slate-700 dark:text-gray-200">
                {pagination.currentPage}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-slate-700 dark:text-gray-200">
                {pagination.totalPages || 1}
              </span>{' '}
              ({pagination.totalProducts} Total Products)
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={!pagination.hasPreviousPage || loadingProducts}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className={`p-1.5 rounded-lg border transition-all ${!pagination.hasPreviousPage || loadingProducts
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-slate-100 dark:hover:bg-gray-800'
                  } ${isDark ? 'border-gray-700 text-gray-200' : 'border-slate-200 text-slate-700'}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={!pagination.hasNextPage || loadingProducts}
                onClick={() => setPage((p) => p + 1)}
                className={`p-1.5 rounded-lg border transition-all ${!pagination.hasNextPage || loadingProducts
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:bg-slate-100 dark:hover:bg-gray-800'
                  } ${isDark ? 'border-gray-700 text-gray-200' : 'border-slate-200 text-slate-700'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------------------- */}
        {/* Product Details & Stats Slide Drawer */}
        {/* --------------------------------------------------------------------- */}
        {isDetailDrawerOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div
              className={`w-full max-w-xl h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-slate-900'
                }`}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-500" />
                    <h2 className="font-bold text-lg">Product Details & Performance</h2>
                  </div>
                  <button
                    onClick={() => setIsDetailDrawerOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Product Info Summary Card */}
                <div className="flex gap-4 items-start">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-gray-700 flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-base">{selectedProduct.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedProduct.description}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-bold text-emerald-500">
                        {formatCurrency(selectedProduct.price)}
                      </span>
                      {selectedProduct.originalPrice > selectedProduct.price && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatCurrency(selectedProduct.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Individual Product Analytics Stats */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Analytics & Metrics
                  </h4>
                  {loadingProductStats ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-500" />
                      Fetching product performance statistics...
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`p-3 rounded-lg border ${isDark ? 'border-gray-800 bg-gray-800/50' : 'border-slate-200 bg-slate-50'
                          }`}
                      >
                        <p className="text-[11px] text-slate-400">Total Stock Value</p>
                        <p className="text-lg font-bold mt-0.5">
                          {formatCurrency(
                            productStats?.totalStockValue ??
                            productStats?.inventory?.totalStockValue ??
                            (selectedProduct.stock || 0) * selectedProduct.price
                          )}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-lg border ${isDark ? 'border-gray-800 bg-gray-800/50' : 'border-slate-200 bg-slate-50'
                          }`}
                      >
                        <p className="text-[11px] text-slate-400">Total Revenue Generated</p>
                        <p className="text-lg font-bold mt-0.5">
                          {formatCurrency(
                            productStats?.totalRevenueGenerated ??
                            productStats?.sales?.totalRevenue ??
                            (selectedProduct.sold || 0) * selectedProduct.price
                          )}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-lg border ${isDark ? 'border-gray-800 bg-gray-800/50' : 'border-slate-200 bg-slate-50'
                          }`}
                      >
                        <p className="text-[11px] text-slate-400">Units Sold</p>
                        <p className="text-lg font-bold mt-0.5">
                          {productStats?.totalUnitsSold ??
                            productStats?.sales?.totalUnitsSold ??
                            selectedProduct.sold ?? 0}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-lg border ${isDark ? 'border-gray-800 bg-gray-800/50' : 'border-slate-200 bg-slate-50'
                          }`}
                      >
                        <p className="text-[11px] text-slate-400">Current Stock Level</p>
                        <p className="text-lg font-bold mt-0.5">
                          {productStats?.currentStock ?? productStats?.inventory?.currentStock ?? selectedProduct.stock ?? 0}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Metadata */}
                <div className="space-y-3 pt-2 border-t dark:border-gray-800 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vendor:</span>
                    <span className="font-semibold">
                      {selectedProduct.vendor?.business?.storeName ||
                        selectedProduct.vendor?.fullName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vendor Email:</span>
                    <span className="font-semibold">{selectedProduct.vendor?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Visibility:</span>
                    <span
                      className={
                        selectedProduct.visibility
                          ? 'text-emerald-500 font-semibold'
                          : 'text-rose-500 font-semibold'
                      }
                    >
                      {selectedProduct.visibility ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  {selectedProduct.visibilityReason && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500">
                      <p className="font-semibold text-[11px]">Visibility Reason:</p>
                      <p className="text-xs mt-0.5">{selectedProduct.visibilityReason}</p>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Created At:</span>
                    <span>{new Date(selectedProduct.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div className="pt-4 border-t dark:border-gray-800 mt-6">
                <button
                  onClick={() => {
                    handleOpenVisibilityModal(selectedProduct);
                  }}
                  className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  {selectedProduct.visibility ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  Change Product Visibility
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------------------- */}
        {/* Visibility Toggle Modal */}
        {/* --------------------------------------------------------------------- */}
        {visibilityModalProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div
              className={`w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 ${isDark
                ? 'bg-gray-900 border border-gray-800 text-gray-100'
                : 'bg-white text-slate-900'
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl ${targetVisibility
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-amber-500/10 text-amber-500'
                    }`}
                >
                  {targetVisibility ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {targetVisibility ? 'Unhide Product' : 'Hide Product'}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {visibilityModalProduct.name}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-gray-400">
                {targetVisibility
                  ? 'This will restore the product to the public marketplace catalog so students can purchase it.'
                  : 'This will temporarily hide the product from the public catalog. You can optionally provide a reason for the vendor.'}
              </p>

              {/* Reason Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-gray-300">
                  Reason / Internal Note <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Violation of campus guidelines, prohibited item, requested by vendor..."
                  value={visibilityReason}
                  onChange={(e) => setVisibilityReason(e.target.value)}
                  className={`w-full p-2.5 text-xs rounded-lg border outline-none transition-all ${isDark
                    ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-emerald-500'
                    : 'border-slate-200 bg-slate-50 text-slate-800 focus:bg-white focus:border-emerald-500'
                    }`}
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  disabled={isSubmittingVisibility}
                  onClick={() => setVisibilityModalProduct(null)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold border ${isDark
                    ? 'border-gray-700 hover:bg-gray-800 text-gray-300'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmittingVisibility}
                  onClick={handleConfirmVisibilityToggle}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 ${targetVisibility
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'bg-amber-500 hover:bg-amber-600'
                    }`}
                >
                  {isSubmittingVisibility && (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  )}
                  Confirm {targetVisibility ? 'Unhide' : 'Hide'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}