import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setProducts } from '../../store/productSlice';

import Hero from '../../components/layout/Hero';
import ProductCard from '../../components/cards/ProductCard';
import CategoryCard from '../../components/cards/CategoryCard';

import { useTheme } from '../../context/ThemeContext';
import apiClient from '../../api/apiClient';
import { getList, getMessage } from '../../utils/apiResponse';
import { useToast } from '../../context/ToastContext';

function getProductId(product) {
  return product?._id || product?.id;
}

function getCategoryId(product) {
  if (product?.category?._id) return product.category._id;
  if (product?.category?.id) return product.category.id;
  if (product?.categoryId?._id) return product.categoryId._id;
  if (product?.categoryId?.id) return product.categoryId.id;
  return product?.categoryId || product?.category || 'uncategorized';
}

function getCategoryName(product) {
  if (product?.category?.name) return product.category.name;
  if (product?.categoryName) return product.categoryName;
  if (typeof product?.category === 'string') return product.category;
  return 'Uncategorized';
}

function normalizeProduct(product) {
  return {
    ...product,
    id: getProductId(product),
    name: product?.name || product?.title || 'Untitled product',
    image:
      product?.image ||
      product?.thumbnail ||
      product?.images?.[0]?.url ||
      product?.images?.[0] ||
      '',
    price: Number(product?.price || 0),
    originalPrice: Number(product?.originalPrice || product?.compareAtPrice || 0),
    vendor:
      product?.vendor?.businessName ||
      product?.vendor?.storeName ||
      product?.vendor?.name ||
      product?.vendorName ||
      'Campus vendor',
    categoryId: getCategoryId(product),
    categoryName: getCategoryName(product),
    rating: Number(product?.rating || product?.averageRating || 0),
    reviews: Number(product?.reviews || product?.reviewCount || 0),
    sold: Number(product?.sold || product?.soldCount || product?.totalSold || 0),
    createdAt: product?.createdAt || product?.updatedAt || new Date().toISOString(),
    badge: product?.badge || product?.tag || '',
  };
}

function CategorySection({ category, products, onViewAll }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const scrollAmount = scrollRef.current.clientWidth * 0.85;

    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="group/section relative">
      <div className="mb-6 flex items-end justify-between gap-4 px-1 sm:px-0">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-[700] leading-[1.15] tracking-[-0.022em] text-slate-900 sm:text-[26px]">
              {category.name}
            </h2>

            <span className="hidden rounded-full bg-slate-900/[0.045] px-2.5 py-1 text-[11px] font-[600] tracking-wide text-slate-600 ring-1 ring-slate-900/[0.08] sm:inline-flex">
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <p className="mt-1.5 text-[13px] font-[450] leading-relaxed text-slate-500">
            Curated by campus vendors • Fresh arrivals weekly
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden items-center gap-1.5 sm:flex">
            <button
              onClick={() => scroll('left')}
              className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:scale-95"
              aria-label="Scroll left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              onClick={() => scroll('right')}
              className="flex h-[36px] w-[36px] items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:scale-95"
              aria-label="Scroll right"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <button
            onClick={onViewAll}
            className="group inline-flex items-center gap-1.5 rounded-full border border-slate-900/[0.12] bg-white px-3.5 py-2 text-[13px] font-[600] text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-slate-900/[0.18] hover:bg-slate-50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] active:scale-[0.98]"
          >
            View all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#FFFF00] to-transparent sm:w-6" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#008000] to-transparent sm:w-6" />

        <div
          ref={scrollRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-3 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 sm:px-0 [&::-webkit-scrollbar]:hidden"
          style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
        >
          {products.map((product, idx) => (
            <div key={product.id} className="w-[270px] flex-shrink-0 snap-start sm:w-[300px]">
              <ProductCard product={product} index={idx} />
            </div>
          ))}

          <div className="flex w-[270px] flex-shrink-0 snap-start items-center justify-center sm:w-[300px]">
            <button
              onClick={onViewAll}
              className="group/all flex h-full min-h-[420px] w-full flex-col items-center justify-center gap-4 rounded-[28px] border-2 border-dashed border-slate-300 bg-slate-50/70 p-8 text-center transition-all hover:border-slate-400 hover:bg-slate-100/80"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-slate-900/[0.06]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>

              <div>
                <p className="text-[15px] font-[650] tracking-[-0.01em] text-slate-900">
                  See all {products.length}
                </p>
                <p className="mt-1 text-[13px] font-[450] text-slate-600">
                  in {category.name}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useTheme();

  const dispatch = useDispatch();
  const toast = useToast();

  const [products, setLocalProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMarketplaceData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.get('/vendor/product/all');
        const productList = getList(response, ['products']).map(normalizeProduct);

        if (!isMounted) return;

        dispatch(setProducts(productList));
        setLocalProducts(productList);

        const categoryMap = new Map();

        productList.forEach((product) => {
          if (!product.categoryId) return;

          const currentCategory = categoryMap.get(product.categoryId);

          categoryMap.set(product.categoryId, {
            id: product.categoryId,
            _id: product.categoryId,
            name: product.categoryName,
            image: product.image,
            productCount: currentCategory ? currentCategory.productCount + 1 : 1,
          });
        });

        setCategories(
          Array.from(categoryMap.values())
            .filter((category) => category.productCount > 0)
            .sort((a, b) => b.productCount - a.productCount)
        );
      } catch (err) {
        const message = getMessage(err) || 'Failed to load marketplace data. Please refresh.';

        if (!isMounted) return;

        setError(message);

        if (toast?.showError) toast.showError(message);
        if (toast?.error) toast.error(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMarketplaceData();

    return () => {
      isMounted = false;
    };
  }, [dispatch, toast]);

  const featuredProducts = useMemo(
    () =>
      products
        .filter((product) => product.badge === 'Featured' || product.badge === 'Trending' || product.featured)
        .slice(0, 6),
    [products]
  );

  const trendingProducts = useMemo(
    () => [...products].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 8),
    [products]
  );

  const newProducts = useMemo(
    () =>
      [...products]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8),
    [products]
  );

  const productsByCategory = useMemo(() => {
    const map = new Map();

    categories.forEach((category) => {
      const categoryProducts = products.filter((product) => product.categoryId === category.id);

      if (categoryProducts.length > 0) {
        map.set(category.id, categoryProducts);
      }
    });

    return map;
  }, [categories, products]);

  const categoriesWithCount = categories.map((category) => {
    const productCount = products.filter((product) => {
      const categoryId =
        typeof product.category === 'object'
          ? product.category?._id
          : product.category;

      return category._id === categoryId;
    }).length;

    return {
      ...category,
      count: productCount,
    };
  });

  const handleViewAll = (categoryName) => {
    const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
    window.location.href = `/products?category=${slug}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] font-[Plus_Jakarta_Sans]">
        <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="mb-12 h-[420px] rounded-[32px] bg-slate-200 sm:h-[480px]" />
            <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 rounded-[24px] bg-slate-200" />
              ))}
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="mb-20">
                <div className="mb-8 h-8 w-64 rounded-full bg-slate-200" />
                <div className="flex gap-5 overflow-hidden">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-[420px] w-[300px] flex-shrink-0 rounded-[28px] bg-slate-200" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] font-[Plus_Jakarta_Sans]">
        <div className="mx-auto max-w-md px-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-red-600">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <h2 className="text-[22px] font-[700] tracking-[-0.02em] text-slate-900">
            Something went wrong
          </h2>

          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-[14px] font-[600] text-white transition hover:bg-slate-800"
          >
            Refresh page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-[Plus_Jakarta_Sans] tracking-[-0.011em] text-slate-900 antialiased selection:bg-violet-200/60 selection:text-violet-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .font-\\[Plus_Jakarta_Sans\\] { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
        .font-\\[Outfit\\] { font-family: 'Outfit', system-ui, -apple-system, sans-serif; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <Hero />

        <section className="mb-14 mt-14 sm:mb-16 sm:mt-16">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-[13px] font-[700] uppercase tracking-[0.14em] text-slate-500">
              Browse categories
            </h2>

            <span className="text-[12px] font-[500] text-slate-400">
              {categories.length} active • updates daily
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-8">
            {/* {categories.slice(0, 8).map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleViewAll(category.name)}
                className="text-left"
              >
                <CategoryCard category={category} />
              </button>
            ))} */}
            {categoriesWithCount.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleViewAll(category.name)}
                className="text-left"
              >
                <CategoryCard category={category} />
              </button>
              // <CategoryCard
              //   key={category._id}
              //   category={category}
              // />
            ))}
          </div>
        </section>

        <section className="mb-16 sm:mb-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-[Outfit] text-[26px] font-[700] leading-[1.1] tracking-[-0.025em] text-slate-900 sm:text-[32px]">
                Featured Products
              </h2>
              <p className="mt-2.5 max-w-xl text-[14px] font-[450] leading-relaxed text-slate-600">
                Hand-picked by our campus curators. Most-loved items with verified reviews from students.
              </p>
            </div>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="animate-fadeInUp opacity-0"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <ProductCard product={product} index={idx} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/50 py-16 text-center">
              <p className="text-slate-600">No featured products available right now</p>
            </div>
          )}
        </section>

        {trendingProducts.length > 0 && (
          <section className="mb-16 sm:mb-20">
            <div className="mb-7 flex items-baseline justify-between">
              <div>
                <h2 className="font-[Outfit] text-[24px] font-[700] tracking-[-0.022em] text-slate-900 sm:text-[28px]">
                  Trending Products
                </h2>
                <p className="mt-1.5 text-[13px] font-[500] text-slate-500">
                  Sorted by recent sales • Updated hourly
                </p>
              </div>
            </div>

            <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
              {trendingProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="relative w-[270px] flex-shrink-0 snap-start sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]"
                >
                  <div className="absolute -left-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[11px] font-[700] text-white shadow-lg ring-2 ring-white">
                    {idx + 1}
                  </div>

                  <ProductCard product={product} index={idx} />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="space-y-16 sm:space-y-20">
          {categories.map((category) => {
            const categoryProducts = productsByCategory.get(category.id) || [];

            if (categoryProducts.length === 0) return null;

            return (
              <CategorySection
                key={category.id}
                category={category}
                products={categoryProducts}
                onViewAll={() => handleViewAll(category.name)}
              />
            );
          })}
        </div>

        {newProducts.length > 0 && (
          <section className="mt-16 border-t border-slate-200 pt-16 sm:mt-20 sm:pt-20">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-[Outfit] text-[24px] font-[700] tracking-[-0.022em] text-slate-900 sm:text-[28px]">
                  Recently Added Products
                </h2>
                <p className="mt-1.5 text-[13px] font-[500] text-slate-500">
                  Newest listings from verified campus vendors
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-[650] uppercase tracking-[0.08em] text-emerald-700 ring-1 ring-emerald-200">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Live
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {newProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="animate-fadeInUp opacity-0"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <ProductCard product={product} index={idx} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-20 rounded-[28px] border border-slate-900/[0.06] bg-white p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] sm:p-10">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                title: 'Campus verified',
                desc: 'Every vendor verified before selling',
              },
              {
                title: 'Secure pickup',
                desc: 'Designated campus exchange points',
              },
              {
                title: 'Buyer protection',
                desc: 'Safer shopping for student buyers',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3.5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-[14px] font-[700] tracking-[-0.01em] text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-[1.5] text-slate-600">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 overflow-hidden rounded-[32px] bg-slate-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
          <div className="grid items-center gap-8 p-8 sm:grid-cols-[1.1fr_0.9fr] sm:p-12">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-[650] uppercase tracking-[0.12em] text-white/80 ring-1 ring-white/15">
                For vendors
              </div>

              <h2 className="font-[Outfit] text-[28px] font-[700] leading-[1.1] tracking-[-0.025em] text-white sm:text-[34px]">
                Start selling in 5 minutes
              </h2>

              <p className="mt-3 max-w-md text-[15px] font-[450] leading-[1.6] text-white/75">
                Zero listing fees • Campus pickup only • Get paid instantly. Join student entrepreneurs.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-[22px] py-[13px] text-[14px] font-[650] tracking-[-0.01em] text-slate-900 transition hover:bg-slate-100 active:scale-[0.98]"
                >
                  Become a vendor
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-[22px] py-[13px] text-[14px] font-[550] text-white/90 transition hover:border-white/35 hover:bg-white/5"
                >
                  View guidelines
                </a>
              </div>
            </div>

            <div className="relative aspect-[4/3] sm:aspect-auto sm:h-[240px]">
              <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-violet-500/20 via-fuchsia-500/20 to-indigo-500/20 blur-2xl" />

              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop&q=60"
                alt=""
                className="relative h-full w-full rounded-[24px] object-cover shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}