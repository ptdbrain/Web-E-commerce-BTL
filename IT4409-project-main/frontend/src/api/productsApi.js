import axios from "axios";
import { buildApiUrl } from "../config/api";
import { featuredProductIds, menuProducts } from "../data/menuData";
import { getSlugFromCategoryName } from "../data/categories";

const CACHE_TTL = 5 * 60 * 1000;
let productsCache = null;
let productsCacheTime = 0;

const normalizeProduct = (product) => {
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

export const getProducts = async (forceRefresh = false) => {
  const now = Date.now();
  if (!forceRefresh && productsCache && now - productsCacheTime < CACHE_TTL) {
    return productsCache;
  }

  try {
    const response = await axios.get(buildApiUrl("/products"));
    const products = (response.data || []).map(normalizeProduct);
    productsCache = products;
    productsCacheTime = now;
    return products;
  } catch (error) {
    console.warn("Using menu fallback data:", error?.message || error);
    productsCache = fallbackProducts;
    productsCacheTime = now;
    return fallbackProducts;
  }
};

export const getProductById = async (productId) => {
  const products = await getProducts();
  return products.find((product) => String(product.id) === String(productId));
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
    .filter((product) => product.isBestSeller || product.isNew)
    .slice(0, limit);
};

export const clearProductsCache = () => {
  productsCache = null;
  productsCacheTime = 0;
};
