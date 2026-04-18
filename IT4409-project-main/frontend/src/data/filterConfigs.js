// Cấu hình bộ lọc cho từng loại danh mục món ăn

// ========== BỘ LỌC CƠ BẢN (Dùng cho hầu hết các danh mục) ==========
// Có: Khoảng giá, Mức độ cay, Loại món
const basicFilters = {
  priceRange: true,
  spiceLevels: ["none", "mild", "medium", "hot"],
  itemTypes: ["single", "combo", "drink", "side", "dessert"],
};

// ========== BỘ LỌC CHO COMBO ==========
// Có: Khoảng giá, Số người ăn
const comboFilters = {
  priceRange: true,
  portions: ["1 nguoi", "2 nguoi", "3-4 nguoi", "5+ nguoi"],
  itemTypes: ["combo"],
};

// ========== BỘ LỌC CHO ĐỒ UỐNG ==========
const drinkFilters = {
  priceRange: true,
  itemTypes: ["drink"],
  sizes: ["M", "L"],
};

// ========== MAPPING SLUG -> FILTER TYPE ==========
export const slugToFilterType = {
  burger: "basic",
  "fried-chicken": "basic",
  "ga-ran": "basic",
  combo: "combo",
  "group-meals": "combo",
  "an-toi-nhom": "combo",
  sides: "basic",
  "mon-phu": "basic",
  drinks: "drink",
  "do-uong": "drink",
  "trang-mieng": "basic",
  "deal-bua-trua": "combo",
};

// ========== MAPPING FILTER TYPE -> FILTER CONFIG ==========
export const filterConfigByType = {
  combo: comboFilters,
  drink: drinkFilters,
  basic: basicFilters,
  default: basicFilters,
};

// Lấy filterType từ slug
export const getFilterTypeBySlug = (slug) => {
  return slugToFilterType[slug] || "default";
};

// Lấy cấu hình filter theo filterType
export const getFilterConfig = (filterType) => {
  return filterConfigByType[filterType] || filterConfigByType.default;
};

// Export các filter
export { comboFilters, drinkFilters, basicFilters };
