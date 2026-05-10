export const categories = [
  {
    id: "laptop-nhap-khau",
    slug: "laptop-nhap-khau",
    name: "Laptop nhập khẩu",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/logo/laptop-nhap-khau-khong-nen.png",
  },
  {
    id: "laptop-chinh-hang",
    slug: "laptop-chinh-hang",
    name: "Laptop chính hãng",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/logo/laptop-chinh-hang-khong-nen.png",
  },
  {
    id: "man-hinh-di-dong",
    slug: "man-hinh-di-dong",
    name: "Màn hình di động",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2025/10/3/man-hinh-di-dong-aoc-16t10-74-2-5f95555fab274fe8abc3b5230feeadd4-master-dfz.png",
  },
  {
    id: "may-choi-game",
    slug: "may-choi-game",
    name: "Máy chơi game/Game Console",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2023/3/25/danh-muc-icon-may-choi-game-game-console-thinkpro.vn.png",
  },
  {
    id: "vr-ar",
    slug: "vr-ar",
    name: "Kính Thực Tế Ảo VR/AR",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2024/3/27/danh-muc-icon-kinh-thuc-te-ao-vrar-thinkpro.vn.png",
  },
  {
    id: "ban-phim",
    slug: "ban-phim",
    name: "Bàn phím",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2024/1/24/danh-muc-icon-ban-phim-thinkpro.vn.png",
  },
  {
    id: "chuot",
    slug: "chuot",
    name: "Chuột",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d2j0501oehjiz9.cloudfront.net/media/core/categories/2024/12/12/chuot.png",
  },
  {
    id: "balo-tui",
    slug: "balo-tui",
    name: "Balo, Túi",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2024/1/24/danh-muc-icon-balo-tui-thinkpro.vn.png",
  },
  {
    id: "ghe-cong-thai-hoc",
    slug: "ghe-cong-thai-hoc",
    name: "Ghế công thái học",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2024/1/23/danh-muc-icon-ghe-cong-thai-hoc-thinkpro.vn.png",
  },
  {
    id: "ban-nang-ha",
    slug: "ban-nang-ha",
    name: "Bàn nâng hạ",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2023/3/18/danh-muc-icon-ban-nang-ha-thinkpro.vn.png",
  },
  {
    id: "hoc-tu",
    slug: "hoc-tu",
    name: "Hộc tủ",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2022/12/14/danh-muc-icon-hoc-tu-thinkpro.vn.png",
  },
  {
    id: "arm-man-hinh",
    slug: "arm-man-hinh",
    name: "Arm màn hình",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2022/3/15/danh-muc-icon-arm-man-hinh-thinkpro.vn.png",
  },
  {
    id: "phu-kien-setup",
    slug: "phu-kien-setup",
    name: "Phụ kiện Setup",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2023/3/30/danh-muc-icon-phu-kien-setup-thinkpro.vn.png",
  },
  {
    id: "ram",
    slug: "ram",
    name: "Ram",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2025/1/20/32d4sam3200-512x512-png.png",
  },
  {
    id: "o-cung",
    slug: "o-cung",
    name: "Ổ cứng",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2025/1/20/samsung-990-512x512png.png",
  },
  {
    id: "merchandise",
    slug: "merchandise",
    name: "Merchandise",
    image:
      "https://imagor.owtg.one/unsafe/fit-in/240x240/https://d28jzcg6y4v9j1.cloudfront.net/media/core/categories/2025/8/21/vyuj.png",
  },
];

// Mapping từ slug URL sang tên category trong DB
export const slugToCategoryName = {
  "laptop-nhap-khau": "Laptop nhập khẩu",
  "laptop-chinh-hang": "Laptop chính hãng",
  laptop: "Laptop", // Fallback cho laptop chung
  "man-hinh-di-dong": "Màn hình di động",
  "may-choi-game": "Máy chơi game/Game Console",
  "game-console": "Máy chơi game/Game Console",
  "vr-ar": "Kính Thực Tế Ảo VR/AR",
  "ban-phim": "Bàn phím",
  keyboard: "Bàn phím",
  chuot: "Chuột",
  mouse: "Chuột",
  "balo-tui": "Balo, Túi",
  "ghe-cong-thai-hoc": "Ghế công thái học",
  "ban-nang-ha": "Bàn nâng hạ",
  "hoc-tu": "Hộc tủ",
  "arm-man-hinh": "Arm màn hình",
  "phu-kien-setup": "Phụ kiện Setup",
  ram: "Ram",
  "o-cung": "Ổ cứng",
  merchandise: "Merchandise",
};

// Mapping ngược từ tên category sang slug
export const categoryNameToSlug = {
  "Laptop nhập khẩu": "laptop-nhap-khau",
  "Laptop chính hãng": "laptop-chinh-hang",
  Laptop: "laptop",
  "Màn hình di động": "man-hinh-di-dong",
  "Máy chơi game/Game Console": "may-choi-game",
  "Kính Thực Tế Ảo VR/AR": "vr-ar",
  "Bàn phím": "ban-phim",
  Chuột: "chuot",
  "Balo, Túi": "balo-tui",
  "Ghế công thái học": "ghe-cong-thai-hoc",
  "Bàn nâng hạ": "ban-nang-ha",
  "Hộc tủ": "hoc-tu",
  "Arm màn hình": "arm-man-hinh",
  "Phụ kiện Setup": "phu-kien-setup",
  Ram: "ram",
  "Ổ cứng": "o-cung",
  Merchandise: "merchandise",
};

// Lấy slug từ tên category (cho breadcrumb)
export const getSlugFromCategoryName = (categoryName) => {
  if (!categoryName) return "";
  // Tìm trong mapping trước
  if (categoryNameToSlug[categoryName]) {
    return categoryNameToSlug[categoryName];
  }
  // Fallback: convert tên thành slug
  return categoryName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

// Lấy category info từ slug
export const getCategoryBySlug = (slug) => {
  return categories.find((c) => c.slug === slug) || null;
};

// Lấy tên hiển thị từ slug
export const getCategoryDisplayName = (slug) => {
  // Xử lý đặc biệt cho "laptop" - hiển thị là "Laptop"
  if (slug === "laptop") {
    return "Laptop";
  }
  const cat = getCategoryBySlug(slug);
  return cat?.name || slugToCategoryName[slug] || slug;
};
