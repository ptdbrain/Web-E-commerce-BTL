// Các hàm tiện ích xử lý và validate query params cho bộ lọc sản phẩm
const toBoolean = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (v === "true") return true;
    if (v === "false") return false;
  }
  return undefined;
};

// Chuyển string thành số nguyên dương, trả fallback nếu không hợp lệ
const toPositiveInt = (value, fallback) => {
  const n = parseInt(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

// Chuyển string thành số thực không âm, trả undefined nếu không hợp lệ
const toNonNegativeFloat = (value) => {
  const n = parseFloat(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

// Escape ký tự đặc biệt trong regex để tránh lỗi injection
const escapeRegExp = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const VALID_SORTS = ["newest", "price_asc", "price_desc", "rating", "bestseller"];

export const buildProductFilter = (query = {}) => {
  const search      = String(query.search || "").trim();
  const categorySlug = String(query.category || "").trim() || undefined;
  const itemTypes   = String(query.itemType   || "").split(",").map((s) => s.trim()).filter(Boolean);
  const spiceLevels = String(query.spiceLevel || "").split(",").map((s) => s.trim()).filter(Boolean);
  const isAvailable = toBoolean(query.available);
  const isFeatured  = toBoolean(query.featured);
  const minPrice    = toNonNegativeFloat(query.minPrice);
  const maxPrice    = toNonNegativeFloat(query.maxPrice);
  const sortBy      = VALID_SORTS.includes(query.sort) ? query.sort : "newest";
  const page        = toPositiveInt(query.page, 1);
  const limit       = Math.min(100, toPositiveInt(query.limit, 20));

  return {
    search,
    searchRegex: search ? new RegExp(escapeRegExp(search), "i") : undefined,
    categorySlug,
    itemTypes,
    spiceLevels,
    isAvailable,
    isFeatured,
    minPrice,
    maxPrice,
    sortBy,
    page,
    limit,
  };
};
