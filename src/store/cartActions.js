import apiClient from "../api/apiClient";
import {
  setCart,
  addLocal,
  removeLocal,
  updateLocal,
} from "./cartSlice";
import { toast } from "react-toastify";

const saveLocalCart = (items) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

export const addToCart = (product) => async (dispatch, getState) => {
  const { auth, cart } = getState();

  const payload = {
    ...product,
    id: product._id,
    quantity: product.quantity || 1,
  };

  if (!auth.user) {
    dispatch(addLocal(payload));
    saveLocalCart([...cart.items, payload]);
    return;
  }

  try {
    await apiClient.post("/buyer/cart/add", {
      productId: payload.id,
      quantity: payload.quantity,
    });

    const res = await apiClient.get("/buyer/cart");

    const backendItems = res.data.data.items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      image: i.image,
      quantity: i.quantity,

      vendorId: i.vendorId,
      vendorName: i.vendorName,
      vendorBankName: i.vendorBankName,
      vendorAccountName: i.vendorAccountName,
      vendorAccountNumber: i.vendorAccountNumber,
    }));

    dispatch(setCart(backendItems));

    toast.success('Cart added successfully')
  } catch (err) {
    console.log(err.message)
    toast.error("Failed to add to cart");
    return
  }
};

export const removeFromCart = (id) => async (dispatch, getState) => {
  const { auth, cart } = getState();

  if (!auth.user) {
    const updated = cart.items.filter((item) => item.id !== id);
    dispatch(removeLocal(id));
    saveLocalCart(updated);
    return;
  }

  try {
    await apiClient.delete(`/buyer/cart/${id}`);

    const res = await apiClient.get("/buyer/cart");

    const backendItems = res.data.data.items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      image: i.image,
      quantity: i.quantity,
      
      vendorId: i.vendorId,
      vendorName: i.vendorName,
      vendorBankName: i.vendorBankName,
      vendorAccountName: i.vendorAccountName,
      vendorAccountNumber: i.vendorAccountNumber,
    }));

    dispatch(setCart(backendItems));
    toast.success("Cart remove successfully");
  } catch (err) {
    toast.error("Failed to remove cart");
    return
  }
};

export const updateQuantity = ({ id, quantity },) => async (dispatch, getState) => {
  const { auth, cart } = getState();

  if (!auth.user) {
    const updated = cart.items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );

    dispatch(updateLocal({ id, quantity }));
    saveLocalCart(updated);
    return;
  }

  try {
    await apiClient.put("/buyer/cart/update", {
      productId: id,
      quantity,
    });

    const res = await apiClient.get("/buyer/cart");

    const backendItems = res.data.data.items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      image: i.image,
      quantity: i.quantity,
      
      vendorId: i.vendorId,
      vendorName: i.vendorName,
      vendorBankName: i.vendorBankName,
      vendorAccountName: i.vendorAccountName,
      vendorAccountNumber: i.vendorAccountNumber,
    }));

    dispatch(setCart(backendItems));
    toast.success("Cart updated successfully");
  } catch (err) {
    toast.error("Failed to update cart");
    return
  }
};

export const mergeCart = () => async (dispatch, getState) => {
  const { auth, cart } = getState();

  if (!auth.user) return;

  try {
    for (const item of cart.items) {
      await apiClient.post("/buyer/cart/add", {
        productId: item.id,
        quantity: item.quantity,
      });
    }

    localStorage.removeItem("cart");

    const res = await apiClient.get("/buyer/cart");

    const backendItems = res.data.data.items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      image: i.image,
      quantity: i.quantity,
      
      vendorId: i.vendorId,
      vendorName: i.vendorName,
      vendorBankName: i.vendorBankName,
      vendorAccountName: i.vendorAccountName,
      vendorAccountNumber: i.vendorAccountNumber,
    }));

    dispatch(setCart(backendItems));
  } catch (err) {
    toast.error('Failed merging cart')
    return
  }
};

export const fetchCart = () => async (dispatch, getState) => {
  const { auth } = getState();

  if (!auth.user) return;

  try {
    const res = await apiClient.get("/buyer/cart");

    const backendItems = res.data.data.items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      image: i.image,
      quantity: i.quantity,
      
      vendorId: i.vendorId,
      vendorName: i.vendorName,
      vendorBankName: i.vendorBankName,
      vendorAccountName: i.vendorAccountName,
      vendorAccountNumber: i.vendorAccountNumber,
    }));

    dispatch(setCart(backendItems));
  } catch (err) {
    toast.error('Failed fetching cart')
    return
  }
};