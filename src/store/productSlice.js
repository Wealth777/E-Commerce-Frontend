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
    priceRange: [0, 100000000],
  },
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
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
      state.filter = { ...state.filter, ...action.payload };
    },
    filterProducts: (state) => {
      state.filteredProducts = state.products.filter((product) => {
        const matchesSearch = product.name
          .toLowerCase()
          .includes(state.filter.search.toLowerCase());
        const matchesCategory =
          state.filter.category === '' || product.category === state.filter.category;
        const matchesPrice =
          product.price >= state.filter.priceRange[0] &&
          product.price <= state.filter.priceRange[1];
        return matchesSearch && matchesCategory && matchesPrice;
      });
    },
    resetFilter: (state) => {
      state.filter = {
        search: '',
        category: '',
        priceRange: [0, 100000],
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