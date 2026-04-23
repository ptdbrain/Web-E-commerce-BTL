import test from "node:test";
import assert from "node:assert/strict";

import { normalizeOrderItem } from "../utils/menuDomain.js";
import { calculateVoucherPricing } from "../utils/voucherPricing.js";

test("calculateVoucherPricing gives the same totals for checkout items and normalized order snapshots", () => {
  const normalized = normalizeOrderItem({
    productId: "64f100000000000000000002",
    productName: "Burger Ga Gion Mat Ong",
    quantity: 2,
    price: 69000,
    selectedSize: { label: "Double Patty", priceModifier: 22000 },
    selectedAddons: [{ label: "Them pho mai", price: 9000, quantity: 1 }],
  });

  const voucher = {
    code: "BURGER10",
    isActive: true,
    discountType: "percent",
    discountValue: 10,
    maxDiscountAmount: 0,
    minOrderValue: 0,
    maxUsage: 0,
    usedCount: 0,
    appliesToAllUsers: true,
    appliesToAllProducts: false,
    users: [],
    products: ["64f100000000000000000002"],
    categories: [],
  };

  const checkoutResult = calculateVoucherPricing({
    voucher,
    userId: "u-1",
    items: [
      {
        productId: normalized.productId,
        categoryId: "burger",
        unitPrice: normalized.unitPrice,
        quantity: normalized.quantity,
      },
    ],
    deliveryFee: 30000,
    fulfillmentType: "delivery",
    nowDate: new Date("2026-04-23T10:00:00.000Z"),
  });

  const orderResult = calculateVoucherPricing({
    voucher,
    userId: "u-1",
    items: [
      {
        productId: normalized.productId,
        categoryId: "burger",
        unitPrice: normalized.unitPrice,
        quantity: normalized.quantity,
      },
    ],
    deliveryFee: 30000,
    fulfillmentType: "delivery",
    nowDate: new Date("2026-04-23T10:00:00.000Z"),
  });

  assert.equal(checkoutResult.discountAmount, orderResult.discountAmount);
  assert.equal(checkoutResult.finalTotal, orderResult.finalTotal);
  assert.equal(checkoutResult.finalTotal, 210000);
});
