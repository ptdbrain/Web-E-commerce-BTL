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
    name: "Gà rán",
    image: "https://img.icons8.com/color/96/fried-chicken.png",
  },
  {
    id: "rice-bowls",
    slug: "rice-bowls",
    name: "Cơm và tô",
    image: "https://img.icons8.com/color/96/rice-bowl.png",
  },
  {
    id: "pasta-wraps",
    slug: "pasta-wraps",
    name: "Mì ý và wrap",
    image: "https://img.icons8.com/color/96/spaghetti.png",
  },
  {
    id: "sides-snacks",
    slug: "sides-snacks",
    name: "Món ăn nhanh",
    image: "https://img.icons8.com/color/96/french-fries.png",
  },
  {
    id: "soups-salads",
    slug: "soups-salads",
    name: "Súp và salad",
    image: "https://img.icons8.com/color/96/soup-plate.png",
  },
  {
    id: "desserts",
    slug: "desserts",
    name: "Tráng miệng",
    image: "https://img.icons8.com/color/96/ice-cream-bowl.png",
  },
  {
    id: "drinks",
    slug: "drinks",
    name: "Đồ uống",
    image: "https://img.icons8.com/color/96/soda-cup.png",
  },
  {
    id: "combo",
    slug: "combo",
    name: "Combo tiết kiệm",
    image: "https://img.icons8.com/color/96/meal.png",
  },
  {
    id: "group-meals",
    slug: "group-meals",
    name: "Ăn tối nhóm",
    image: "https://img.icons8.com/color/96/dinner.png",
  },
  {
    id: "lunch-deals",
    slug: "lunch-deals",
    name: "Deal bữa trưa",
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
