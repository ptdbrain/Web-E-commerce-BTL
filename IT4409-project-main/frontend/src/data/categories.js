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
    id: "rice-bowls",
    slug: "rice-bowls",
    name: "Com va to",
    image: "https://img.icons8.com/color/96/rice-bowl.png",
  },
  {
    id: "pasta-wraps",
    slug: "pasta-wraps",
    name: "Mi y va wrap",
    image: "https://img.icons8.com/color/96/spaghetti.png",
  },
  {
    id: "sides-snacks",
    slug: "sides-snacks",
    name: "Mon an nhanh",
    image: "https://img.icons8.com/color/96/french-fries.png",
  },
  {
    id: "soups-salads",
    slug: "soups-salads",
    name: "Soup va salad",
    image: "https://img.icons8.com/color/96/soup-plate.png",
  },
  {
    id: "desserts",
    slug: "desserts",
    name: "Trang mieng",
    image: "https://img.icons8.com/color/96/ice-cream-bowl.png",
  },
  {
    id: "drinks",
    slug: "drinks",
    name: "Do uong",
    image: "https://img.icons8.com/color/96/soda-cup.png",
  },
  {
    id: "combo",
    slug: "combo",
    name: "Combo tiet kiem",
    image: "https://img.icons8.com/color/96/meal.png",
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
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

export const getCategoryBySlug = (slug) =>
  categories.find((category) => category.slug === slug) || null;

export const getCategoryDisplayName = (slug) =>
  getCategoryBySlug(slug)?.name || slugToCategoryName[slug] || slug;
