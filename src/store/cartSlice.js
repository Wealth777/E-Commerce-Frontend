import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },

    addLocal: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        });
      }
    },

    removeLocal: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    updateLocal: (state, action) => {
      const item = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (item) {
        item.quantity = action.payload.quantity;

        if (item.quantity <= 0) {
          state.items = state.items.filter(
            (i) => i.id !== action.payload.id
          );
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  setCart,
  addLocal,
  removeLocal,
  updateLocal,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;