import axios from "axios";
import { buildApiUrl } from "../config/api";

export const getReviews = (productId, params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""))
  ).toString();
  return axios.get(buildApiUrl(`/reviews/product/${productId}${qs ? `?${qs}` : ""}`));
};

export const createReview = (productId, data) =>
  axios.post(buildApiUrl(`/reviews/product/${productId}`), data);
