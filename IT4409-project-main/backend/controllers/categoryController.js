import mongoose from "mongoose";

import Category, { DEFAULT_CATEGORIES } from "../models/Category.js";
import Product from "../models/Product.js";
import {
  normalizeCategoryPayload,
  sortCategoriesForMenu,
} from "../utils/categoryDomain.js";

const publicSelect = "name slug icon image subcategories isActive";

const handleDuplicateCategory = (err, res) => {
  if (err?.code === 11000) {
    return res.status(409).json({ message: "Danh mục hoặc slug đã tồn tại." });
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
    return res.status(500).json({ message: "Lỗi server khi lấy danh mục." });
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
      return res.status(400).json({ message: "Tên danh mục không được để trống." });
    }

    console.error("createCategory error", err);
    return res.status(500).json({ message: "Lỗi server khi tạo danh mục." });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "ID danh mục không hợp lệ." });
    }

    const payload = normalizeCategoryPayload(req.body, { partial: true });
    const category = await Category.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).lean();

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục." });
    }

    return res.json({ category });
  } catch (err) {
    if (handleDuplicateCategory(err, res)) return;
    console.error("updateCategory error", err);
    return res.status(500).json({ message: "Lỗi server khi cập nhật danh mục." });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "ID danh mục không hợp lệ." });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).lean();

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục." });
    }

    await Product.updateMany(
      { category: category._id },
      { isActive: false, isAvailable: false }
    );

    return res.json({ category, message: "Đã ẩn danh mục." });
  } catch (err) {
    console.error("deleteCategory error", err);
    return res.status(500).json({ message: "Lỗi server khi ẩn danh mục." });
  }
};

export default {
  getCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
