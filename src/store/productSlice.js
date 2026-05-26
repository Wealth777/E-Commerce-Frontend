import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  filteredProducts: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filter: {
    search: '',
    category: '',
    categoryName: '',
    priceRange: [0, 100000000],
  },
};

const getCategoryId = (category) => {
  if (!category) return '';
  if (typeof category === 'string') return category;
  return category._id || category.id || '';
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      const products = Array.isArray(action.payload) ? action.payload : [];
      state.products = products;
      state.filteredProducts = products;
    },

    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    setFilter: (state, action) => {
      state.filter = {
        ...state.filter,
        ...action.payload,
      };
    },

    filterProducts: (state) => {
      const search = state.filter.search.toLowerCase().trim();
      const selectedCategory = state.filter.category;

      state.filteredProducts = state.products.filter((product) => {
        const productName = product?.name || '';
        const productCategoryId = getCategoryId(product?.category);
        const productSubCategoryId = getCategoryId(product?.subCategory);

        const matchesSearch =
          !search || productName.toLowerCase().includes(search);

        const matchesCategory =
          !selectedCategory ||
          productCategoryId === selectedCategory ||
          productSubCategoryId === selectedCategory;

        const price = Number(product?.price || 0);

        const matchesPrice =
          price >= state.filter.priceRange[0] &&
          price <= state.filter.priceRange[1];

        return matchesSearch && matchesCategory && matchesPrice;
      });
    },

    resetFilter: (state) => {
      state.filter = {
        search: '',
        category: '',
        categoryName: '',
        priceRange: [0, 100000000],
      };
      state.filteredProducts = state.products;
    },
  },
});

export const {
  setProducts,
  setSelectedProduct,
  setLoading,
  setError,
  setFilter,
  filterProducts,
  resetFilter,
} = productSlice.actions;

export default productSlice.reducer;