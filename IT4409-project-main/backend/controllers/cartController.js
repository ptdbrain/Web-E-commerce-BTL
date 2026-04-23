import mongoose from "mongoose";

import Cart from "../models/Cart.js";
import { normalizeOrderItem } from "../utils/menuDomain.js";
import {
  buildCartKey,
  normalizeCartKey,
  removeCartItem,
  updateCartItemQuantity,
  upsertCartItem,
} from "../utils/cartDomain.js";

const getUserId = (req) => req.user?.id;

const emptyCartResponse = (userId) => ({
  userId,
  items: [],
});

const buildCartItemSnapshot = (payload = {}) => {
  const normalized = normalizeOrderItem(payload);

  if (!normalized.productId || !mongoose.isValidObjectId(normalized.productId)) {
    throw new Error("Invalid productId in cart item");
  }

  if (!normalized.productName) {
    throw new Error("productName is required in cart item");
  }

  return {
    cartKey: normalizeCartKey(payload.cartKey) || buildCartKey(normalized),
    productId: normalized.productId,
    productName: normalized.productName,
    productImage: normalized.productImage,
    quantity: normalized.quantity,
    selectedSize: normalized.selectedSize,
    selectedAddons: normalized.selectedAddons,
    itemNote: normalized.itemNote,
    basePrice: normalized.basePrice,
    unitPrice: normalized.unitPrice,
    lineTotal: normalized.lineTotal,
  };
};

export const getMyCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const cart = await Cart.findOne({ userId }).lean();
    return res.json({ cart: cart || emptyCartResponse(userId) });
  } catch (err) {
    console.error("getMyCart error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const addCartItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const cartItem = buildCartItemSnapshot(req.body || {});
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      const created = await Cart.create({
        userId,
        items: [cartItem],
      });
      return res.status(201).json({ cart: created });
    }

    cart.items = upsertCartItem(cart.items, cartItem);
    await cart.save();

    return res.status(201).json({ cart });
  } catch (err) {
    const message = err?.message || "Server error";
    if (message.includes("Invalid") || message.includes("required")) {
      return res.status(400).json({ message });
    }
    console.error("addCartItem error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartKey = normalizeCartKey(req.params.cartKey);
    const exists = cart.items.some(
      (item) => normalizeCartKey(item.cartKey) === cartKey
    );
    if (!exists) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cart.items = updateCartItemQuantity(
      cart.items,
      cartKey,
      req.body?.quantity
    );
    await cart.save();

    return res.json({ cart });
  } catch (err) {
    console.error("updateCartItem error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const removeCartItemByKey = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartKey = normalizeCartKey(req.params.cartKey);
    const exists = cart.items.some(
      (item) => normalizeCartKey(item.cartKey) === cartKey
    );
    if (!exists) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cart.items = removeCartItem(cart.items, cartKey);
    await cart.save();

    return res.json({ cart });
  } catch (err) {
    console.error("removeCartItemByKey error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default {
  getMyCart,
  addCartItem,
  updateCartItem,
  removeCartItemByKey,
};
