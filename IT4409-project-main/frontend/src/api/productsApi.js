import axios from "axios";
import { buildApiUrl } from "../config/api.js";
import { featuredProductIds, menuProducts } from "../data/menuData.js";
import { getSlugFromCategoryName } from "../data/categories.js";

const CACHE_TTL = 5 * 60 * 1000;
let productsCache = null;
let productsCacheTime = 0;

const hasQueryFilters = (query = {}) =>
  Object.values(query || {}).some(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0)
  );

const buildProductsQueryString = (query = {}) => {
  const params = new URLSearchParams();

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });

  return params.toString();
};

export const normalizeProduct = (product = {}) => {
  const id = product._id || product.id;
  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || "";
  const categorySlug =
    product.category?.slug || getSlugFromCategoryName(categoryName);

  return {
    id,
    _id: id,
    name: product.name,
    slug: product.slug || "",
    description: product.description || "",
    category: { name: categoryName, slug: categorySlug },
    itemType: product.itemType || "single",
    price: product.price ?? 0,
    discountPrice: product.discountPrice ?? product.price ?? 0,
    newPrice: product.discountPrice ?? product.price ?? 0,
    originalPrice: product.price ?? 0,
    stock: product.stock ?? 0,
    soldCount: product.soldCount ?? 0,
    image: product.images?.[0] || product.image || null,
    images: product.images || (product.image ? [product.image] : []),
    thumbnail: product.images?.[0] || product.image || null,
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    addons: Array.isArray(product.addons) ? product.addons : [],
    comboItems: Array.isArray(product.comboItems) ? product.comboItems : [],
    badges: Array.isArray(product.badges) ? product.badges : [],
    highlights: Array.isArray(product.highlights) ? product.highlights : [],
    specs: product.specifications || {},
    specifications: product.specifications || {},
    preparationTime: product.preparationTime ?? 15,
    spiceLevel: product.spiceLevel || "none",
    rating: product.rating ?? product.ratings?.average ?? 0,
    reviewCount: product.numReviews ?? product.reviewCount ?? 0,
    numReviews: product.numReviews ?? product.reviewCount ?? 0,
    isNew: product.isNew ?? false,
    isBestSeller: product.isBestSeller ?? false,
    isAvailable: product.isAvailable ?? product.isActive ?? true,
  };
};

const fallbackProducts = menuProducts.map(normalizeProduct);

const filterProductsFallback = (products = [], query = {}) => {
  let result = [...products];

  if (query.category) {
    result = result.filter(
      (product) => product.category?.slug === String(query.category)
    );
  }

  if (query.search) {
    const needle = String(query.search).trim().toLowerCase();
    result = result.filter((product) =>
      [
        product.name,
        product.description,
        product.category?.name,
        ...(product.highlights || []),
        ...(product.badges || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }

  if (query.itemType) {
    result = result.filter((product) => product.itemType === query.itemType);
  }

  if (query.spiceLevel) {
    result = result.filter(
      (product) => product.spiceLevel === query.spiceLevel
    );
  }

  if (query.available === true || query.available === "true") {
    result = result.filter((product) => product.isAvailable && product.stock > 0);
  }

  if (query.featured === true || query.featured === "true") {
    result = result.filter((product) => product.isBestSeller || product.isNew);
  }

  return result;
};

const resolveGetProductsArgs = (queryOrForceRefresh = {}, forceRefresh = false) =>
  typeof queryOrForceRefresh === "boolean"
    ? { query: {}, forceRefresh: queryOrForceRefresh }
    : { query: queryOrForceRefresh || {}, forceRefresh };

export const getProducts = async (queryOrForceRefresh = {}, forceRefresh = false) => {
  const { query, forceRefresh: shouldForceRefresh } = resolveGetProductsArgs(
    queryOrForceRefresh,
    forceRefresh
  );
  const useCache = !hasQueryFilters(query);
  const now = Date.now();

  if (
    useCache &&
    !shouldForceRefresh &&
    productsCache &&
    now - productsCacheTime < CACHE_TTL
  ) {
    return productsCache;
  }

  try {
    const queryString = buildProductsQueryString(query);
    const response = await axios.get(
      buildApiUrl(queryString ? `/products?${queryString}` : "/products")
    );
    const products = (response.data || []).map(normalizeProduct);
    if (useCache) {
      productsCache = products;
      productsCacheTime = now;
    }
    return products;
  } catch (error) {
    console.warn("Using menu fallback data:", error?.message || error);
    const fallback = filterProductsFallback(fallbackProducts, query);
    if (useCache) {
      productsCache = fallback;
      productsCacheTime = now;
    }
    return fallback;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(buildApiUrl(`/products/${productId}`));
    return normalizeProduct(response.data || {});
  } catch (error) {
    const products = await getProducts();
    return (
      products.find((product) => String(product.id) === String(productId)) || null
    );
  }
};

export const getFeaturedProducts = async () => {
  const products = await getProducts();
  const featured = products.filter((product) =>
    featuredProductIds.includes(String(product.id))
  );
  return featured.length > 0
    ? featured
    : products.filter((product) => product.isBestSeller).slice(0, 3);
};

export const getBestSellerProducts = async (limit = 15) => {
  const products = await getProducts();
  return products
    .filter((product) => product.isBestSeller || product.isNew || product.soldCount > 0)
    .sort((left, right) => right.soldCount - left.soldCount)
    .slice(0, limit);
};

export const clearProductsCache = () => {
  productsCache = null;
  productsCacheTime = 0;
};
