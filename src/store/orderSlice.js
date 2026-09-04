import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
};

const getOrderId = (order) => {
  return order?._id || order?.id || null;
};

const orderSlice = createSlice({
  name: 'orders',

  initialState,

  reducers: {
    setOrders: (state, action) => {
      state.orders = Array.isArray(action.payload) ? action.payload : [];
      state.error = null;
    },

    addOrder: (state, action) => {
      const newOrder = action.payload;

      if (!newOrder) return;

      const newOrderId = getOrderId(newOrder);

      if (!newOrderId) {
        state.orders.push(newOrder);
        return;
      }

      const existingIndex = state.orders.findIndex(
        (order) => getOrderId(order) === newOrderId
      );

      if (existingIndex === -1) {
        state.orders.unshift(newOrder);
      } else {
        state.orders[existingIndex] = {
          ...state.orders[existingIndex],
          ...newOrder,
        };
      }
    },

    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload || null;
    },

    updateOrder: (state, action) => {
      const updatedOrder = action.payload;

      if (!updatedOrder) return;

      const updatedOrderId = getOrderId(updatedOrder);

      if (!updatedOrderId) return;

      const orderIndex = state.orders.findIndex(
        (order) => getOrderId(order) === updatedOrderId
      );

      if (orderIndex !== -1) {
        state.orders[orderIndex] = {
          ...state.orders[orderIndex],
          ...updatedOrder,
        };
      } else {
        state.orders.unshift(updatedOrder);
      }

      if (
        state.selectedOrder &&
        getOrderId(state.selectedOrder) === updatedOrderId
      ) {
        state.selectedOrder = {
          ...state.selectedOrder,
          ...updatedOrder,
        };
      }
    },

    removeOrder: (state, action) => {
      const orderId = action.payload;

      if (!orderId) return;

      state.orders = state.orders.filter(
        (order) => getOrderId(order) !== orderId
      );

      if (
        state.selectedOrder &&
        getOrderId(state.selectedOrder) === orderId
      ) {
        state.selectedOrder = null;
      }
    },

    setLoading: (state, action) => {
      state.loading = Boolean(action.payload);
    },

    setError: (state, action) => {
      state.error = action.payload || null;
    },

    clearOrders: (state) => {
      state.orders = [];
      state.selectedOrder = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setOrders,
  addOrder,
  setSelectedOrder,
  updateOrder,
  removeOrder,
  setLoading,
  setError,
  clearOrders,
} = orderSlice.actions;

export default orderSlice.reducer;