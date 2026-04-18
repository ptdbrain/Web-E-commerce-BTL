export const categories = [
  {
    id: "burger",
    slug: "burger",
    name: "Burger",
    image: "https://img.icons8.com/color/96/hamburger.png",
  },
  {
    id: "fried-chicken",
    slug: "fried-chicken",
    name: "Ga ran",
    image: "https://img.icons8.com/color/96/fried-chicken.png",
  },
  {
    id: "combo",
    slug: "combo",
    name: "Combo tiet kiem",
    image: "https://img.icons8.com/color/96/meal.png",
  },
  {
    id: "sides",
    slug: "sides",
    name: "Mon phu",
    image: "https://img.icons8.com/color/96/french-fries.png",
  },
  {
    id: "drinks",
    slug: "drinks",
    name: "Do uong",
    image: "https://img.icons8.com/color/96/soda-cup.png",
  },
  {
    id: "desserts",
    slug: "desserts",
    name: "Trang mieng",
    image: "https://img.icons8.com/color/96/ice-cream-bowl.png",
  },
  {
    id: "group-meals",
    slug: "group-meals",
    name: "An toi nhom",
    image: "https://img.icons8.com/color/96/dinner.png",
  },
  {
    id: "lunch-deals",
    slug: "lunch-deals",
    name: "Deal bua trua",
    image: "https://img.icons8.com/color/96/lunchbox.png",
  },
];

export const slugToCategoryName = Object.fromEntries(
  categories.map((category) => [category.slug, category.name])
);

export const categoryNameToSlug = Object.fromEntries(
  categories.map((category) => [category.name, category.slug])
);

export const getSlugFromCategoryName = (categoryName) => {
  if (!categoryName) return "";
  if (categoryNameToSlug[categoryName]) return categoryNameToSlug[categoryName];

  return categoryName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

export const getCategoryBySlug = (slug) =>
  categories.find((category) => category.slug === slug) || null;

export const getCategoryDisplayName = (slug) =>
  getCategoryBySlug(slug)?.name || slugToCategoryName[slug] || slug;
