import axios from "axios";

const API_BASE_URL = "https://it4409-deploy-backend.onrender.com/api";

export const getCategories = async () => {
  const res = await axios.get(`${API_BASE_URL}/categories`);
  return res.data || [];
};
