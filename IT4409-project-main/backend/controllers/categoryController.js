import mongoose from "mongoose";

import Category, { DEFAULT_CATEGORIES } from "../models/Category.js";
import {
  normalizeCategoryPayload,
  sortCategoriesForMenu,
} from "../utils/categoryDomain.js";

const publicSelect = "name slug icon image subcategories isActive";

const handleDuplicateCategory = (err, res) => {
  if (err?.code === 11000) {
    return res.status(409).json({ message: "Danh muc hoac slug da ton tai." });
  }
  return null;
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: { $ne: false } })
      .select(publicSelect)
      .lean();
    const response = categories.length > 0 ? categories : [...DEFAULT_CATEGORIES];

    return res.json(sortCategoriesForMenu(response));
  } catch (err) {
    console.error("GET /categories error", err?.message || err);
    return res.status(500).json({ message: "Error fetching categories" });
  }
};

export const getAdminCategories = async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive !== "false";
    const filter = includeInactive ? {} : { isActive: { $ne: false } };

    const categories = await Category.find(filter)
      .select(publicSelect)
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ categories: sortCategoriesForMenu(categories) });
  } catch (err) {
    console.error("getAdminCategories error", err);
    return res.status(500).json({ message: "Loi server khi lay danh muc." });
  }
};

export const createCategory = async (req, res) => {
  try {
    const payload = normalizeCategoryPayload(req.body);
    const category = await Category.create({
      ...payload,
      createdBy: req.user?.id,
    });

    return res.status(201).json({ category });
  } catch (err) {
    if (handleDuplicateCategory(err, res)) return;
    if (err?.message === "Category name is required") {
      return res.status(400).json({ message: "Ten danh muc khong duoc de trong." });
    }

    console.error("createCategory error", err);
    return res.status(500).json({ message: "Loi server khi tao danh muc." });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "ID danh muc khong hop le." });
    }

    const payload = normalizeCategoryPayload(req.body, { partial: true });
    const category = await Category.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).lean();

    if (!category) {
      return res.status(404).json({ message: "Khong tim thay danh muc." });
    }

    return res.json({ category });
  } catch (err) {
    if (handleDuplicateCategory(err, res)) return;
    console.error("updateCategory error", err);
    return res.status(500).json({ message: "Loi server khi cap nhat danh muc." });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "ID danh muc khong hop le." });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).lean();

    if (!category) {
      return res.status(404).json({ message: "Khong tim thay danh muc." });
    }

    return res.json({ category, message: "Da an danh muc." });
  } catch (err) {
    console.error("deleteCategory error", err);
    return res.status(500).json({ message: "Loi server khi an danh muc." });
  }
};

export default {
  getCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
