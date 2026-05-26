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

const getSafeStock = (item) => {
  return Number(
    item.stock ??
    item.product?.stock ??
    0
  );
};

const clampQuantity = (quantity, stock) => {
  const safeQuantity = Number(quantity || 1);
  const safeStock = Number(stock || 0);

  if (safeStock <= 0) return 0;

  return Math.min(
    Math.max(1, safeQuantity),
    safeStock
  );
};

const normalizeCartItem = (item) => {
  const stock = getSafeStock(item);

  return {
    id: item.id || item._id || item.productId || item.product?._id,
    _id: item._id || item.product?._id || item.id,
    name: item.name || item.product?.name,
    price: item.price || item.product?.price,
    image: item.image || item.product?.image,
    stock,
    quantity: clampQuantity(item.quantity || 1, stock),
    vendorId: item.vendorId || item.vendor?._id || item.product?.vendor?._id,
    vendorName:
      item.vendorName ||
      item.vendor?.storeName ||
      item.vendor?.businessName ||
      item.vendor?.fullName ||
      item.product?.vendor?.storeName ||
      item.product?.vendor?.businessName ||
      item.product?.vendor?.fullName ||
      'Unknown Vendor',
    vendorBankName: item.vendorBankName || item.vendor?.bankName || item.product?.vendor?.bankName,
    vendorAccountName: item.vendorAccountName || item.vendor?.accountName || item.product?.vendor?.accountName,
    vendorAccountNumber: item.vendorAccountNumber || item.vendor?.accountNumber || item.product?.vendor?.accountNumber,
  };
};

const normalizeCartItems = (response) =>
  getCartItems(response)
    .map(normalizeCartItem)
    .filter((item) => item.id && item.quantity > 0);

const refreshCart = async (dispatch) => {
  const res = await apiClient.get('/buyer/cart');
  const items = normalizeCartItems(res);
  dispatch(setCart(items));
  return items;
};

export const addToCart = (product) => async (dispatch, getState) => {
  const { auth, cart } = getState();
  const productId = product._id || product.id;
  const stock = getSafeStock(product);
  const quantity = clampQuantity(product.quantity || 1, stock);

  if (!productId) {
    toast.error('Invalid product');
    return;
  }

  if (stock <= 0 || quantity <= 0) {
    toast.error('Product is out of stock');
    return;
  }

  const existingItem = cart.items.find((item) => item.id === productId);
  const existingQuantity = existingItem?.quantity || 0;

  const safeTotalQuantity = clampQuantity(
    existingQuantity + quantity,
    stock
  );

  const payload = {
    ...product,
    id: productId,
    stock,
    quantity: safeTotalQuantity,
  };

  if (!auth.isAuthenticated) {
    const updatedItems = existingItem
      ? cart.items.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: safeTotalQuantity,
              }
            : item
        )
      : [...cart.items, payload];

    dispatch(addLocal(payload));
    saveLocalCart(updatedItems);

    if (safeTotalQuantity >= stock) {
      toast.info(`Only ${stock} item${stock > 1 ? 's' : ''} available in stock`);
    }

    return;
  }

  try {
    await apiClient.post('/buyer/cart/add', {
      productId,
      quantity,
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
  const item = cart.items.find((cartItem) => cartItem.id === id);

  if (!item) return;

  const stock = getSafeStock(item);
  const safeQuantity = clampQuantity(quantity, stock);

  if (quantity <= 0) {
    dispatch(removeFromCart(id));
    return;
  }

  if (stock <= 0 || safeQuantity <= 0) {
    toast.error('Product is out of stock');
    dispatch(removeFromCart(id));
    return;
  }

  if (quantity > stock) {
    toast.info(`Only ${stock} item${stock > 1 ? 's' : ''} available in stock`);
  }

  if (!auth.isAuthenticated) {
    const updated = cart.items.map((cartItem) =>
      cartItem.id === id
        ? {
            ...cartItem,
            quantity: safeQuantity,
          }
        : cartItem
    );

    dispatch(updateLocal({ id, quantity: safeQuantity }));
    saveLocalCart(updated);
    return;
  }

  try {
    await apiClient.put('/buyer/cart/update', {
      productId: id,
      quantity: safeQuantity,
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
      const stock = getSafeStock(item);
      const quantity = clampQuantity(item.quantity || 1, stock);

      if (quantity <= 0) continue;

      await apiClient.post('/buyer/cart/add', {
        productId: item.id || item._id,
        quantity,
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