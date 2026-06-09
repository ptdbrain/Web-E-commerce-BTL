import axios from "axios";
import { buildApiUrl } from "../config/api.js";
import { categories as fallbackCategories } from "../data/categories.js";

export const normalizeCategory = (category = {}) => ({
  id: category._id || category.id || category.slug || "",
  slug: category.slug || category.id || "",
  name: category.name || "",
  image: category.icon || category.image || "",
});

const USE_DATABASE_ONLY =
  import.meta.env?.VITE_USE_DATABASE_ONLY === "true" || import.meta.env?.PROD;

export const getCategories = async () => {
  try {
    const res = await axios.get(buildApiUrl("/categories"));
    const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
    
    if (data.length > 0) {
      console.log(`Fetched ${data.length} categories from database.`);
      return data.map(normalizeCategory);
    }
    
    // If empty data from backend, handle fallback below
    if (USE_DATABASE_ONLY) return [];
    
    return fallbackCategories;
  } catch (error) {
    if (USE_DATABASE_ONLY) {
      console.error("Categories fetch failed and USE_DATABASE_ONLY is true:", error?.message);
      throw error;
    }
    
    console.warn("Using category fallback data (Backend/DB unavailable):", error?.message || error);
    return fallbackCategories;
  }
};
