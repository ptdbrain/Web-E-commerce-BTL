import axios from "axios";
import { buildApiUrl } from "../config/api.js";
import { categories as fallbackCategories } from "../data/categories.js";

export const normalizeCategory = (category = {}) => ({
  id: category._id || category.id || category.slug || "",
  slug: category.slug || category.id || "",
  name: category.name || "",
  image: category.icon || category.image || "",
});

export const getCategories = async () => {
  try {
    const res = await axios.get(buildApiUrl("/categories"));
    return Array.isArray(res.data)
      ? res.data.map(normalizeCategory)
      : fallbackCategories;
  } catch (error) {
    console.warn("Using category fallback data:", error?.message || error);
    return fallbackCategories;
  }
};
