import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import notificationReducer from './notificationSlice';
import vendorReducer from './vendorSlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    notifications: notificationReducer,
    vendor: vendorReducer,
    chat: chatReducer,
  },
});

export default store; 