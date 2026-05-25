import mongoose from "mongoose";

import Category from "../models/Category.js";
import Product from "../models/Product.js";
import User from "../models/user.js";
import Voucher from "../models/Voucher.js";
import {
  buildVoucherPricingItems,
  priceOrderItemsFromProducts,
} from "../utils/orderPricing.js";
import {
  normalizeVoucherPayload,
  validateVoucherPayload,
} from "../utils/voucherPayload.js";
import { calculateVoucherPricing } from "../utils/voucherPricing.js";

const buildSearchRegex = (value) =>
  value && typeof value === "string" && value.trim()
    ? new RegExp(value.trim(), "i")
    : null;

const enrichPricingItems = async (items = []) => {
  const normalizedItems = Array.isArray(items) ? items : [];
  const productIds = normalizedItems
    .map((item) => item.productId || item.id)
    .filter((productId) => mongoose.isValidObjectId(productId));

  const products = await Product.find({ _id: { $in: productIds } }).lean();
  return buildVoucherPricingItems(
    priceOrderItemsFromProducts(normalizedItems, products)
  );
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
    const validation = validateVoucherPayload(normalized);
    if (validation) {
      return res.status(400).json(validation);
    }

    const existing = await Voucher.findOne({ code: normalized.code }).lean();
    if (existing) {
      return res.status(409).json({ message: "Ma voucher da ton tai." });
    }

    const voucher = await Voucher.create(normalized);
    return res.status(201).json({ voucher });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Ma voucher da ton tai." });
    }
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
    const validation = validateVoucherPayload(normalized, { partial: true });
    if (validation) {
      return res.status(400).json(validation);
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
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Ma voucher da ton tai." });
    }
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
    const filter = { isActive: { $ne: false } };

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
    const filter = { isActive: { $ne: false } };

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
