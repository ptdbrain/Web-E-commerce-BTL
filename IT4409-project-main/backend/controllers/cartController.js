import mongoose from "mongoose";

import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { priceOrderItemsFromProducts } from "../utils/orderPricing.js";
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

const buildCartItemSnapshotFromPricedItem = (pricedItem = {}) => ({
  cartKey: buildCartKey(pricedItem),
  productId: pricedItem.productId,
  productName: pricedItem.productName,
  productImage: pricedItem.productImage,
  quantity: pricedItem.quantity,
  selectedSize: pricedItem.selectedSize,
  selectedAddons: pricedItem.selectedAddons,
  itemNote: pricedItem.itemNote,
  basePrice: pricedItem.basePrice,
  unitPrice: pricedItem.unitPrice,
  lineTotal: pricedItem.lineTotal,
});

const buildCartItemSnapshot = async (payload = {}) => {
  const productId = payload.productId || payload.id;
  if (!productId || !mongoose.isValidObjectId(productId)) {
    throw new Error("Invalid productId in cart item");
  }

  const product = await Product.findById(productId).lean();
  const [pricedItem] = priceOrderItemsFromProducts([payload], product ? [product] : []);
  return buildCartItemSnapshotFromPricedItem(pricedItem);
};

const refreshCartItemQuantity = async (cartItem, quantity) => {
  const product = await Product.findById(cartItem.productId).lean();
  const sourceItem =
    typeof cartItem.toObject === "function" ? cartItem.toObject() : cartItem;
  const [pricedItem] = priceOrderItemsFromProducts(
    [{ ...sourceItem, quantity }],
    product ? [product] : []
  );
  return {
    ...buildCartItemSnapshotFromPricedItem(pricedItem),
    cartKey: normalizeCartKey(cartItem.cartKey) || buildCartKey(pricedItem),
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

    const cartItem = await buildCartItemSnapshot(req.body || {});
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

    const nextQuantity = Number(req.body?.quantity);
    if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) {
      cart.items = updateCartItemQuantity(cart.items, cartKey, nextQuantity);
      await cart.save();
      return res.json({ cart });
    }

    const existingItem = cart.items.find(
      (item) => normalizeCartKey(item.cartKey) === cartKey
    );
    const refreshedItem = await refreshCartItemQuantity(existingItem, nextQuantity);
    cart.items = cart.items.map((item) =>
      normalizeCartKey(item.cartKey) === cartKey ? refreshedItem : item
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
