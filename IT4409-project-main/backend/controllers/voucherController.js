import mongoose from "mongoose";

import Category from "../models/Category.js";
import Product from "../models/Product.js";
import User from "../models/user.js";
import Voucher, { EVoucherDiscountType } from "../models/Voucher.js";
import { calculateVoucherPricing } from "../utils/voucherPricing.js";

const normalizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value === "true" || value === "1";
  }
  return false;
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseIdList = (value) =>
  (Array.isArray(value) ? value : [])
    .map((item) => String(item).trim())
    .filter(Boolean);

const buildSearchRegex = (value) =>
  value && typeof value === "string" && value.trim()
    ? new RegExp(value.trim(), "i")
    : null;

const enrichPricingItems = async (items = []) => {
  const normalizedItems = (Array.isArray(items) ? items : []).map((item) => ({
    productId: String(item.productId || item.id || ""),
    categoryId: String(item.categoryId || item.categorySlug || ""),
    unitPrice: toNumber(item.unitPrice ?? item.newPrice ?? item.price, 0),
    quantity: Math.max(1, toNumber(item.quantity, 1)),
    lineTotal: toNumber(item.lineTotal, NaN),
  }));

  const productIds = normalizedItems
    .map((item) => item.productId)
    .filter((productId) => mongoose.isValidObjectId(productId));

  let productCategoryMap = new Map();
  if (productIds.length > 0) {
    const products = await Product.find({ _id: { $in: productIds } })
      .select("category")
      .lean();
    productCategoryMap = new Map(
      products.map((product) => [String(product._id), String(product.category || "")])
    );
  }

  return normalizedItems.map((item) => ({
    ...item,
    categoryId: item.categoryId || productCategoryMap.get(item.productId) || "",
    lineTotal:
      Number.isFinite(item.lineTotal) && item.lineTotal > 0
        ? item.lineTotal
        : item.unitPrice * item.quantity,
  }));
};

const normalizeVoucherPayload = (payload = {}, { partial = false } = {}) => {
  const productIds = parseIdList(payload.productIds);
  const categoryIds = parseIdList(payload.categoryIds);
  const userIds = parseIdList(payload.userIds);

  const appliesToAllProducts =
    payload.appliesToAllProducts === undefined
      ? productIds.length === 0 && categoryIds.length === 0
      : normalizeBoolean(payload.appliesToAllProducts);

  const appliesToAllUsers =
    payload.appliesToAllUsers === undefined
      ? userIds.length === 0
      : normalizeBoolean(payload.appliesToAllUsers);

  const normalized = {
    description:
      typeof payload.description === "string" ? payload.description.trim() : "",
    discountType: payload.discountType,
    discountValue: toNumber(payload.discountValue, 0),
    maxDiscountAmount: toNumber(payload.maxDiscountAmount, 0),
    minOrderValue: toNumber(payload.minOrderValue, 0),
    maxUsage: toNumber(payload.maxUsage, 0),
    isActive:
      payload.isActive === undefined ? true : normalizeBoolean(payload.isActive),
    appliesToAllUsers,
    appliesToAllProducts,
    users: userIds,
    products: productIds,
    categories: categoryIds,
    startDate: payload.startDate ? new Date(payload.startDate) : undefined,
    endDate: payload.endDate ? new Date(payload.endDate) : undefined,
  };

  if (!partial) {
    normalized.code = String(payload.code || "").trim().toUpperCase();
  }

  return normalized;
};

export const calculateVoucherForItems = async ({
  userId,
  code,
  items,
  orderTotal,
  deliveryFee = 0,
  fulfillmentType = "delivery",
}) => {
  if (!userId) {
    return { errorMessage: "Ban can dang nhap." };
  }

  if (!code || !Array.isArray(items)) {
    return { errorMessage: "Thieu ma voucher hoac danh sach san pham." };
  }

  const voucher = await Voucher.findOne({
    code: String(code).trim().toUpperCase(),
  }).lean();

  if (!voucher) {
    return { errorMessage: "Voucher khong ton tai hoac da bi vo hieu." };
  }

  const pricingItems = await enrichPricingItems(items);

  return calculateVoucherPricing({
    voucher,
    userId,
    items: pricingItems,
    orderTotal,
    deliveryFee,
    fulfillmentType,
    nowDate: new Date(),
  });
};

export const createVoucher = async (req, res) => {
  try {
    const normalized = normalizeVoucherPayload(req.body);

    if (!normalized.code || !normalized.discountType) {
      return res.status(400).json({ message: "Thieu ma voucher hoac loai giam gia." });
    }

    if (!Object.values(EVoucherDiscountType).includes(normalized.discountType)) {
      return res.status(400).json({ message: "Loai giam gia khong hop le." });
    }

    const existing = await Voucher.findOne({ code: normalized.code }).lean();
    if (existing) {
      return res.status(409).json({ message: "Ma voucher da ton tai." });
    }

    const voucher = await Voucher.create(normalized);
    return res.status(201).json({ voucher });
  } catch (err) {
    console.error("createVoucher error", err);
    return res.status(500).json({ message: "Loi server khi tao voucher." });
  }
};

export const getVouchers = async (req, res) => {
  try {
    const regex = buildSearchRegex(req.query.q);
    const filter = {};

    if (regex) {
      filter.$or = [{ code: regex }, { description: regex }];
    }

    const vouchers = await Voucher.find(filter)
      .populate("products", "name")
      .populate("categories", "name slug")
      .populate("users", "fullname username email")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return res.json({ vouchers });
  } catch (err) {
    console.error("getVouchers error", err);
    return res.status(500).json({ message: "Loi server khi lay danh sach voucher." });
  }
};

export const getAvailableVouchersForUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Ban can dang nhap." });
    }

    const vouchers = await Voucher.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    const available = vouchers.filter((voucher) => {
      const result = calculateVoucherPricing({
        voucher,
        userId,
        items: [],
        orderTotal: voucher.minOrderValue || 0,
        deliveryFee: 0,
        fulfillmentType: "delivery",
        nowDate: new Date(),
      });

      return !result.errorMessage || /mon nao/i.test(result.errorMessage);
    });

    return res.json({
      vouchers: available.map((voucher) => ({
        id: voucher._id,
        code: voucher.code,
        description: voucher.description,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        maxDiscountAmount: voucher.maxDiscountAmount,
        minOrderValue: voucher.minOrderValue,
        maxUsage: voucher.maxUsage,
        usedCount: voucher.usedCount,
        startDate: voucher.startDate,
        endDate: voucher.endDate,
        appliesToAllProducts: voucher.appliesToAllProducts,
        products: voucher.products || [],
        categories: voucher.categories || [],
      })),
    });
  } catch (err) {
    console.error("getAvailableVouchersForUser error", err);
    return res
      .status(500)
      .json({ message: "Loi server khi lay danh sach voucher kha dung." });
  }
};

export const getVoucherById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "ID voucher khong hop le." });
    }

    const voucher = await Voucher.findById(id)
      .populate("products", "name")
      .populate("categories", "name slug")
      .populate("users", "fullname username email")
      .lean();

    if (!voucher) {
      return res.status(404).json({ message: "Khong tim thay voucher." });
    }

    return res.json({ voucher });
  } catch (err) {
    console.error("getVoucherById error", err);
    return res.status(500).json({ message: "Loi server khi lay voucher." });
  }
};

export const updateVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "ID voucher khong hop le." });
    }

    const normalized = normalizeVoucherPayload(req.body, { partial: true });

    if (
      normalized.discountType &&
      !Object.values(EVoucherDiscountType).includes(normalized.discountType)
    ) {
      return res.status(400).json({ message: "Loai giam gia khong hop le." });
    }

    const voucher = await Voucher.findByIdAndUpdate(id, normalized, {
      new: true,
      runValidators: true,
    }).lean();

    if (!voucher) {
      return res.status(404).json({ message: "Khong tim thay voucher." });
    }

    return res.json({ voucher });
  } catch (err) {
    console.error("updateVoucher error", err);
    return res.status(500).json({ message: "Loi server khi cap nhat voucher." });
  }
};

export const deleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "ID voucher khong hop le." });
    }

    const voucher = await Voucher.findByIdAndDelete(id).lean();
    if (!voucher) {
      return res.status(404).json({ message: "Khong tim thay voucher." });
    }

    return res.json({ message: "Da xoa voucher." });
  } catch (err) {
    console.error("deleteVoucher error", err);
    return res.status(500).json({ message: "Loi server khi xoa voucher." });
  }
};

export const searchUsersForVoucher = async (req, res) => {
  try {
    const regex = buildSearchRegex(req.query.q);
    const filter = {};

    if (regex) {
      filter.$or = [{ username: regex }, { fullname: regex }, { email: regex }];
    }

    const users = await User.find(filter)
      .select("fullname username email role")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.json({ users });
  } catch (err) {
    console.error("searchUsersForVoucher error", err);
    return res.status(500).json({ message: "Loi server khi tim kiem nguoi dung." });
  }
};

export const searchProductsForVoucher = async (req, res) => {
  try {
    const regex = buildSearchRegex(req.query.q);
    const filter = {};

    if (regex) {
      filter.name = regex;
    }

    const products = await Product.find(filter)
      .select("name price discountPrice category")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.json({ products });
  } catch (err) {
    console.error("searchProductsForVoucher error", err);
    return res.status(500).json({ message: "Loi server khi tim kiem san pham." });
  }
};

export const searchCategoriesForVoucher = async (req, res) => {
  try {
    const regex = buildSearchRegex(req.query.q);
    const filter = { isActive: { $ne: false } };

    if (regex) {
      filter.$or = [{ name: regex }, { slug: regex }];
    }

    const categories = await Category.find(filter)
      .select("name slug icon image")
      .sort({ name: 1 })
      .limit(100)
      .lean();

    return res.json({ categories });
  } catch (err) {
    console.error("searchCategoriesForVoucher error", err);
    return res.status(500).json({ message: "Loi server khi tim kiem danh muc." });
  }
};

export const applyVoucher = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Ban can dang nhap." });
    }

    const { code, items, orderTotal, deliveryFee, fulfillmentType } = req.body || {};
    const result = await calculateVoucherForItems({
      userId,
      code,
      items,
      orderTotal,
      deliveryFee,
      fulfillmentType,
    });

    if (result.errorMessage) {
      return res
        .status(400)
        .json({ message: result.errorMessage, itemResults: result.itemResults });
    }

    const { voucher } = result;
    return res.json({
      voucher: {
        id: voucher._id,
        code: voucher.code,
        description: voucher.description,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        maxDiscountAmount: voucher.maxDiscountAmount,
        minOrderValue: voucher.minOrderValue,
        maxUsage: voucher.maxUsage,
        usedCount: voucher.usedCount,
        appliesToAllProducts: voucher.appliesToAllProducts,
        products: voucher.products || [],
        categories: voucher.categories || [],
      },
      eligibleSubtotal: result.eligibleSubtotal,
      itemDiscount: result.itemDiscount,
      shippingDiscount: result.shippingDiscount,
      discountAmount: result.discountAmount,
      finalTotal: result.finalTotal,
      itemResults: result.itemResults,
    });
  } catch (err) {
    console.error("applyVoucher error", err);
    return res.status(500).json({ message: "Loi server khi ap dung voucher." });
  }
};

export default {
  calculateVoucherForItems,
  createVoucher,
  getVouchers,
  getAvailableVouchersForUser,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  searchUsersForVoucher,
  searchProductsForVoucher,
  searchCategoriesForVoucher,
  applyVoucher,
};
