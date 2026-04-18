import axios from "axios";
import { buildApiUrl } from "../config/api";

export const getReviews = (productId) =>
  axios.get(buildApiUrl(`/reviews/product/${productId}`));

export const createReview = (productId, data) =>
  axios.post(buildApiUrl(`/reviews/product/${productId}`), data);
