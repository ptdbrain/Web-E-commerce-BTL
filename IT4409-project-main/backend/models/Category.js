import mongoose from "mongoose";

const slugifyCategory = (value = "") =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    icon: { type: String, trim: true },
    image: { type: String, trim: true },
    subcategories: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

CategorySchema.pre("save", function preSave(next) {
  if ((this.isModified("name") || this.isModified("slug")) && !this.slug) {
    this.slug = slugifyCategory(this.name);
  }
  next();
});

const Category = mongoose.model("Category", CategorySchema);

export const DEFAULT_CATEGORIES = [
  {
    name: "Burger",
    slug: "burger",
    icon: "https://img.icons8.com/color/96/hamburger.png",
  },
  {
    name: "Ga ran",
    slug: "fried-chicken",
    icon: "https://img.icons8.com/color/96/fried-chicken.png",
  },
  {
    name: "Com va to",
    slug: "rice-bowls",
    icon: "https://img.icons8.com/color/96/rice-bowl.png",
  },
  {
    name: "Mi y va wrap",
    slug: "pasta-wraps",
    icon: "https://img.icons8.com/color/96/spaghetti.png",
  },
  {
    name: "Mon an nhanh",
    slug: "sides-snacks",
    icon: "https://img.icons8.com/color/96/french-fries.png",
  },
  {
    name: "Soup va salad",
    slug: "soups-salads",
    icon: "https://img.icons8.com/color/96/soup-plate.png",
  },
  {
    name: "Trang mieng",
    slug: "desserts",
    icon: "https://img.icons8.com/color/96/ice-cream-bowl.png",
  },
  {
    name: "Do uong",
    slug: "drinks",
    icon: "https://img.icons8.com/color/96/soda-cup.png",
  },
  {
    name: "Combo tiet kiem",
    slug: "combo",
    icon: "https://img.icons8.com/color/96/meal.png",
  },
  {
    name: "An toi nhom",
    slug: "group-meals",
    icon: "https://img.icons8.com/color/96/dinner.png",
  },
  {
    name: "Deal bua trua",
    slug: "lunch-deals",
    icon: "https://img.icons8.com/color/96/lunchbox.png",
  },
];

export default Category;
