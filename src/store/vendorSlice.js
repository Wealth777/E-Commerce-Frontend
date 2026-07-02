import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';
import { getList, getMessage, getPayload } from '../utils/apiResponse';

// Async thunks
export const fetchVendorDetails = createAsyncThunk(
  'vendor/fetchDetails',
  async (vendorId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/vendor/vendor/details/${vendorId}`);
      return getPayload(response, {});
    } catch (error) {
      return rejectWithValue(getMessage(error, 'Failed to fetch vendor details'));
    }
  }
);

export const fetchVendorProducts = createAsyncThunk(
  'vendor/fetchProducts',
  async ({ vendorId, category }, { rejectWithValue }) => {
    try {
      const endpoint = category
        ? `/vendor/vendor/products/${vendorId}/category/${category}`
        : `/vendor/vendor/products/${vendorId}`;
      const response = await apiClient.get(endpoint);
      return getList(response, ['products']);
    } catch (error) {
      return rejectWithValue(getMessage(error, 'Failed to fetch products'));
    }
  }
);

const initialState = {
  vendorInfo: null,
  products: [],
  loading: false,
  productsLoading: false,
  error: null,
  selectedCategory: '',
  selectedStatus: '',
  sortBy: 'newest',
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.selectedCategory = '';
      state.selectedStatus = '';
      state.sortBy = 'newest';
    },
    clearVendor: (state) => {
      state.vendorInfo = null;
      state.products = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch vendor details
    builder
      .addCase(fetchVendorDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorInfo = action.payload.vendorInfo;
        state.products = action.payload.products || [];
      })
      .addCase(fetchVendorDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch vendor products
    builder
      .addCase(fetchVendorProducts.pending, (state) => {
        state.productsLoading = true;
      })
      .addCase(fetchVendorProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchVendorProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedCategory, setSelectedStatus, setSortBy, resetFilters, clearVendor } =
  vendorSlice.actions;

export default vendorSlice.reducer;