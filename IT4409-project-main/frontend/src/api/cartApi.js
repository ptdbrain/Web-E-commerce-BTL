import axios from "axios";

import { buildApiUrl } from "../config/api.js";

const withAuth = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchCart = async (token) => {
  const response = await axios.get(buildApiUrl("/cart"), withAuth(token));
  return response.data?.cart || { items: [] };
};

export const addCartItem = async (token, payload) => {
  const response = await axios.post(
    buildApiUrl("/cart/items"),
    payload,
    withAuth(token)
  );
  return response.data?.cart || { items: [] };
};

export const updateCartItemQuantity = async (token, cartKey, quantity) => {
  const response = await axios.put(
    buildApiUrl(`/cart/items/${encodeURIComponent(cartKey)}`),
    { quantity },
    withAuth(token)
  );
  return response.data?.cart || { items: [] };
};

export const removeCartItem = async (token, cartKey) => {
  const response = await axios.delete(
    buildApiUrl(`/cart/items/${encodeURIComponent(cartKey)}`),
    withAuth(token)
  );
  return response.data?.cart || { items: [] };
};
