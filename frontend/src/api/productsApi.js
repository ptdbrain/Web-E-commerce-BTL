import axios from "axios";

const API_BASE_URL = "https://it4409-deploy-backend.onrender.com/api";

// Helper: kiểm tra xem string có phải là ObjectId không
const isObjectId = (str) => {
  if (typeof str !== "string") return false;
  return /^[a-f\d]{24}$/i.test(str);
};

// Fetch all brands - dùng để map brandId -> brandName
export const getBrands = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/brands`);
    return res.data || [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

// Cache brands để không phải fetch nhiều lần
let brandMapCache = null;

const getBrandMap = async () => {
  if (brandMapCache) return brandMapCache;

  const brands = await getBrands();
  brandMapCache = {};
  brands.forEach((b) => {
    brandMapCache[b._id] = b.name;
  });
  return brandMapCache;
};

// Cache products với TTL 5 phút
let productsCache = null;
let productsCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getProducts = async (forceRefresh = false) => {
  // Check cache first
  const now = Date.now();
  if (!forceRefresh && productsCache && now - productsCacheTime < CACHE_TTL) {
    return productsCache;
  }

  // Fetch products và brands song song
  const [productsRes, brandMap] = await Promise.all([
    axios.get(`${API_BASE_URL}/products`),
    getBrandMap(),
  ]);

  const data = productsRes.data || [];

  return data.map((p) => {
    const originalPrice = p.price ?? 0;
    const discountPrice = p.discountPrice ?? originalPrice;
    const discount =
      originalPrice > 0
        ? Math.round((1 - discountPrice / originalPrice) * 100)
        : 0;

    // Chuẩn hóa brand về dạng tên chuỗi
    let brandName = "";
    if (typeof p.brand === "string") {
      if (isObjectId(p.brand)) {
        // Nếu là ObjectId string, lookup từ brandMap
        brandName = brandMap[p.brand] || "";
      } else {
        // Nếu là tên brand, giữ nguyên
        brandName = p.brand;
      }
    } else if (p.brand?.name) {
      // Nếu đã được populate
      brandName = p.brand.name;
    } else if (p.brand?._id) {
      // Nếu populate nhưng chỉ có _id
      brandName = brandMap[p.brand._id] || "";
    }

    return {
      id: p._id,
      name: p.name,
      brand: brandName,
      category:
        typeof p.category === "string" ? p.category : p.category?.name || "",
      subcategory: "",
      price: discountPrice,
      originalPrice: originalPrice,
      discount,
      rating: p.ratings?.average ?? 0,
      reviewCount: p.ratings?.count ?? 0,
      stock: p.stock ?? 0,
      image: (p.images && p.images[0]) || null,
      thumbnail: (p.images && p.images[0]) || null,
      specs: p.specifications || p.features || {},
      isNew: p.isNew ?? false,
      isBestSeller: p.isBestSeller ?? false,
    };
  });

  // Update cache
  productsCache = products;
  productsCacheTime = now;

  return products;
};

// Clear cache when needed (e.g., after product update)
export const clearProductsCache = () => {
  productsCache = null;
  productsCacheTime = 0;
  brandMapCache = null;
};

export const getProductById = async (productId) => {
  const products = await getProducts();
  return products.find((p) => String(p.id) === String(productId));
};
