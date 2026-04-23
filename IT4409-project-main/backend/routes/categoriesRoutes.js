import express from "express";
import Category, { DEFAULT_CATEGORIES } from "../models/Category.js";

const router = express.Router();

const categoryOrder = new Map(
  DEFAULT_CATEGORIES.map((category, index) => [category.slug, index])
);

router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: { $ne: false } })
      .select("name slug icon image isActive")
      .lean();
    const response = categories.length > 0 ? categories : [...DEFAULT_CATEGORIES];

    response.sort((left, right) => {
      const leftIndex = categoryOrder.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
      const rightIndex = categoryOrder.get(right.slug) ?? Number.MAX_SAFE_INTEGER;
      return (
        leftIndex - rightIndex ||
        String(left.name).localeCompare(String(right.name))
      );
    });

    res.json(response);
  } catch (err) {
    console.error("GET /categories error", err?.message || err);
    res.status(500).json({ message: "Error fetching categories" });
  }
});

export default router;
