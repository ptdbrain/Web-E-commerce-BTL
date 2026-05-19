// Cấu hình bộ lọc cho từng loại danh mục sản phẩm

// ========== BỘ LỌC CƠ BẢN (Dùng cho hầu hết các danh mục) ==========
// Chỉ có: Thương hiệu, Giá, Màu sắc
const basicFilters = {
  brands: true,
  priceRange: true,
  colors: [
    "Đen",
    "Trắng",
    "Xám",
    "Bạc",
    "Xanh dương",
    "Xanh lá",
    "Đỏ",
    "Vàng",
    "Hồng",
  ],
};

// ========== BỘ LỌC CHO LAPTOP ==========
// Chỉ có: Thương hiệu, Giá, RAM, SSD
const laptopFilters = {
  brands: true,
  priceRange: true,
  rams: ["8GB", "16GB", "32GB", "64GB"],
  ssds: ["256GB", "512GB", "1TB", "2TB"],
};

// ========== MAPPING SLUG -> FILTER TYPE ==========
export const slugToFilterType = {
  laptop: "laptop",
  "laptop-nhap-khau": "laptop",
  "laptop-chinh-hang": "laptop",
  monitor: "basic",
  "man-hinh-di-dong": "basic",
  keyboard: "basic",
  "ban-phim": "basic",
  mouse: "basic",
  chuot: "basic",
  "game-console": "basic",
  "may-choi-game": "basic",
  "vr-ar": "basic",
  "balo-tui": "basic",
  "ghe-cong-thai-hoc": "basic",
  "ban-nang-ha": "basic",
  "hoc-tu": "basic",
  "arm-man-hinh": "basic",
  "phu-kien-setup": "basic",
  ram: "basic",
  "o-cung": "basic",
  merchandise: "basic",
};

// ========== MAPPING FILTER TYPE -> FILTER CONFIG ==========
export const filterConfigByType = {
  laptop: laptopFilters,
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
export { laptopFilters, basicFilters };
