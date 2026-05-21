import apiClient from '../api/apiClient';
import {
  setCart,
  addLocal,
  removeLocal,
  updateLocal,
} from './cartSlice';
import { toast } from 'react-toastify';
import { getCartItems, getMessage } from '../utils/apiResponse';

const saveLocalCart = (items) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

const normalizeCartItem = (item) => ({
  id: item.id || item._id || item.productId || item.product?._id,
  _id: item._id || item.product?._id || item.id,
  name: item.name || item.product?.name,
  price: item.price || item.product?.price,
  image: item.image || item.product?.image,
  quantity: item.quantity || 1,
  vendorId: item.vendorId || item.vendor?._id || item.product?.vendor?._id,
  vendorName: item.vendorName || item.vendor?.businessName || item.vendor?.fullName || item.product?.vendor?.businessName,
  vendorBankName: item.vendorBankName || item.vendor?.bankName || item.product?.vendor?.bankName,
  vendorAccountName: item.vendorAccountName || item.vendor?.accountName || item.product?.vendor?.accountName,
  vendorAccountNumber: item.vendorAccountNumber || item.vendor?.accountNumber || item.product?.vendor?.accountNumber,
});

const normalizeCartItems = (response) => getCartItems(response).map(normalizeCartItem).filter((item) => item.id);

const refreshCart = async (dispatch) => {
  const res = await apiClient.get('/buyer/cart');
  const items = normalizeCartItems(res);
  dispatch(setCart(items));
  return items;
};

export const addToCart = (product) => async (dispatch, getState) => {
  const { auth, cart } = getState();
  const productId = product._id || product.id;

  const payload = {
    ...product,
    id: productId,
    quantity: product.quantity || 1,
  };

  if (!auth.isAuthenticated) {
    dispatch(addLocal(payload));
    saveLocalCart([...cart.items, payload]);
    return;
  }

  try {
    await apiClient.post('/buyer/cart/add', {
      productId,
      quantity: payload.quantity,
    });

    await refreshCart(dispatch);
    toast.success('Cart added successfully');
  } catch (error) {
    toast.error(getMessage(error, 'Failed to add to cart'));
  }
};

export const removeFromCart = (id) => async (dispatch, getState) => {
  const { auth, cart } = getState();

  if (!auth.isAuthenticated) {
    const updated = cart.items.filter((item) => item.id !== id);
    dispatch(removeLocal(id));
    saveLocalCart(updated);
    return;
  }

  try {
    await apiClient.delete(`/buyer/cart/${id}`);
    await refreshCart(dispatch);
    toast.success('Cart removed successfully');
  } catch (error) {
    toast.error(getMessage(error, 'Failed to remove cart'));
  }
};

export const updateQuantity = ({ id, quantity }) => async (dispatch, getState) => {
  const { auth, cart } = getState();

  if (!auth.isAuthenticated) {
    const updated = cart.items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );

    dispatch(updateLocal({ id, quantity }));
    saveLocalCart(updated);
    return;
  }

  try {
    await apiClient.put('/buyer/cart/update', {
      productId: id,
      quantity,
    });

    await refreshCart(dispatch);
    toast.success('Cart updated successfully');
  } catch (error) {
    toast.error(getMessage(error, 'Failed to update cart'));
  }
};

export const mergeCart = () => async (dispatch, getState) => {
  const { auth, cart } = getState();

  if (!auth.isAuthenticated) return;

  try {
    for (const item of cart.items) {
      await apiClient.post('/buyer/cart/add', {
        productId: item.id || item._id,
        quantity: item.quantity || 1,
      });
    }

    localStorage.removeItem('cart');
    await refreshCart(dispatch);
  } catch (error) {
    toast.error(getMessage(error, 'Failed merging cart'));
  }
};

export const fetchCart = () => async (dispatch, getState) => {
  const { auth } = getState();

  if (!auth.isAuthenticated) return;

  try {
    await refreshCart(dispatch);
  } catch (error) {
    toast.error(getMessage(error, 'Failed fetching cart'));
  }
};
