import apiClient from '../api/apiClient';
import {
  setCart,
  addLocal,
  removeLocal,
  updateLocal,
} from './cartSlice';
import { toast } from 'react-toastify';
import { getCartItems, getMessage } from '../utils/apiResponse';

const CART_KEY = 'cart';

const saveLocalCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

const getProductId = (item) =>
  item?.id ||
  item?._id ||
  item?.productId ||
  item?.product?._id ||
  item?.product?.id ||
  '';

const getStock = (item) => {
  const stock =
    item?.stock ??
    item?.countInStock ??
    item?.product?.stock ??
    item?.product?.countInStock ??
    0;

  return Math.max(0, Number(stock || 0));
};

const clampQuantity = (quantity, stock) => {
  const parsedQuantity = Number(quantity || 1);
  const parsedStock = Number(stock || 0);

  if (parsedStock <= 0) return 0;

  return Math.min(
    Math.max(1, parsedQuantity),
    parsedStock
  );
};

const getVendor = (item) =>
  item?.vendor ||
  item?.product?.vendor ||
  null;

const normalizeCartItem = (item) => {
  const product = item?.product || item;
  const id = getProductId(item);
  const stock = getStock(item);
  const vendor = getVendor(item);

  return {
    id,
    _id: product?._id || id,

    name: product?.name || item?.name || 'Unnamed product',

    price: Number(product?.price || item?.price || 0),

    image:
      product?.image ||
      item?.image ||
      product?.images?.[0] ||
      'https://via.placeholder.com/300',

    stock,

    quantity: clampQuantity(item?.quantity || 1, stock),

    vendorId:
      item?.vendorId ||
      vendor?._id ||
      vendor?.id ||
      '',

    vendorName:
      item?.vendorName ||
      vendor?.storeName ||
      vendor?.businessName ||
      vendor?.fullName ||
      'Unknown Vendor',

    vendorBankName:
      item?.vendorBankName ||
      vendor?.bankName ||
      '',

    vendorAccountName:
      item?.vendorAccountName ||
      vendor?.accountName ||
      '',

    vendorAccountNumber:
      item?.vendorAccountNumber ||
      vendor?.accountNumber ||
      '',
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

const mergeOrAddLocalItem = (items, payload) => {
  const existingItem = items.find((item) => item.id === payload.id);

  if (!existingItem) {
    return [...items, payload];
  }

  const stock = getStock(existingItem);
  const nextQuantity = clampQuantity(
    existingItem.quantity + payload.quantity,
    stock
  );

  return items.map((item) =>
    item.id === payload.id
      ? {
          ...item,
          quantity: nextQuantity,
        }
      : item
  );
};

export const addToCart = (product) => async (dispatch, getState) => {
  const { auth, cart } = getState();

  const productId = getProductId(product);
  const stock = getStock(product);
  const quantity = clampQuantity(product?.quantity || 1, stock);

  if (!productId) {
    toast.error('Invalid product');
    return;
  }

  if (stock <= 0 || quantity <= 0) {
    toast.error('Product is out of stock');
    return;
  }

  const payload = normalizeCartItem({
    ...product,
    id: productId,
    quantity,
    stock,
  });

  if (!auth.isAuthenticated) {
    const updatedItems = mergeOrAddLocalItem(cart.items, payload);

    dispatch(addLocal(payload));
    saveLocalCart(updatedItems);

    toast.success('Cart added successfully');
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

  if (!id) return;

  if (!auth.isAuthenticated) {
    const updatedItems = cart.items.filter((item) => item.id !== id);

    dispatch(removeLocal(id));
    saveLocalCart(updatedItems);
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

  if (!id) return;

  const cartItem = cart.items.find((item) => item.id === id);

  if (!cartItem) {
    toast.error('Cart item not found');
    return;
  }

  if (Number(quantity) <= 0) {
    dispatch(removeFromCart(id));
    return;
  }

  const stock = getStock(cartItem);
  const safeQuantity = clampQuantity(quantity, stock);

  if (stock <= 0 || safeQuantity <= 0) {
    toast.error('Product is out of stock');
    dispatch(removeFromCart(id));
    return;
  }

  if (Number(quantity) > stock) {
    toast.info(`Only ${stock} item${stock > 1 ? 's' : ''} available in stock`);
  }

  if (!auth.isAuthenticated) {
    const updatedItems = cart.items.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: safeQuantity,
          }
        : item
    );

    dispatch(updateLocal({ id, quantity: safeQuantity }));
    saveLocalCart(updatedItems);
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
    const validItems = cart.items
      .map(normalizeCartItem)
      .filter((item) => item.id && item.quantity > 0 && item.stock > 0);

    for (const item of validItems) {
      await apiClient.post('/buyer/cart/add', {
        productId: item.id,
        quantity: item.quantity,
      });
    }

    localStorage.removeItem(CART_KEY);
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