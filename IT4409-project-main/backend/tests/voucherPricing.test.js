import test from "node:test";
import assert from "node:assert/strict";

import { calculateVoucherPricing } from "../utils/voucherPricing.js";

const activeVoucher = (overrides = {}) => ({
  code: "FIREBITE15",
  isActive: true,
  usedCount: 0,
  maxUsage: 0,
  appliesToAllUsers: true,
  appliesToAllProducts: true,
  users: [],
  products: [],
  categories: [],
  minOrderValue: 0,
  maxDiscountAmount: 0,
  ...overrides,
});

test("calculateVoucherPricing applies percent vouchers with max cap", () => {
  const result = calculateVoucherPricing({
    voucher: activeVoucher({
      discountType: "percent",
      discountValue: 15,
      maxDiscountAmount: 40000,
      minOrderValue: 149000,
    }),
    userId: "u-1",
    items: [{ productId: "p-1", categoryId: "burger", unitPrice: 79000, quantity: 2 }],
    deliveryFee: 30000,
    fulfillmentType: "delivery",
    nowDate: new Date("2026-04-23T10:00:00.000Z"),
  });

  assert.equal(result.itemDiscount, 23700);
  assert.equal(result.shippingDiscount, 0);
  assert.equal(result.discountAmount, 23700);
  assert.equal(result.finalTotal, 164300);
});

test("calculateVoucherPricing scopes fixed discount to eligible categories only", () => {
  const result = calculateVoucherPricing({
    voucher: activeVoucher({
      code: "SWEET30K",
      discountType: "amount",
      discountValue: 30000,
      appliesToAllProducts: false,
      categories: ["desserts"],
    }),
    userId: "u-2",
    items: [
      { productId: "dessert-1", categoryId: "desserts", unitPrice: 40000, quantity: 2 },
      { productId: "burger-1", categoryId: "burger", unitPrice: 70000, quantity: 1 },
    ],
    deliveryFee: 0,
    fulfillmentType: "pickup",
    nowDate: new Date("2026-04-23T10:00:00.000Z"),
  });

  assert.equal(result.eligibleSubtotal, 80000);
  assert.equal(result.itemDiscount, 30000);
  assert.equal(result.shippingDiscount, 0);
  assert.equal(result.finalTotal, 120000);
});

test("calculateVoucherPricing applies free shipping only to delivery orders", () => {
  const result = calculateVoucherPricing({
    voucher: activeVoucher({
      code: "FREESHIP99",
      discountType: "free_shipping",
      discountValue: 0,
      minOrderValue: 99000,
    }),
    userId: "u-3",
    items: [{ productId: "combo-1", categoryId: "combo", unitPrice: 120000, quantity: 1 }],
    deliveryFee: 30000,
    fulfillmentType: "delivery",
    nowDate: new Date("2026-04-23T10:00:00.000Z"),
  });

  assert.equal(result.itemDiscount, 0);
  assert.equal(result.shippingDiscount, 30000);
  assert.equal(result.discountAmount, 30000);
  assert.equal(result.finalTotal, 120000);
});

test("calculateVoucherPricing rejects free shipping for pickup", () => {
  const result = calculateVoucherPricing({
    voucher: activeVoucher({
      code: "FREESHIP99",
      discountType: "free_shipping",
      discountValue: 0,
    }),
    userId: "u-4",
    items: [{ productId: "combo-1", categoryId: "combo", unitPrice: 120000, quantity: 1 }],
    deliveryFee: 0,
    fulfillmentType: "pickup",
    nowDate: new Date("2026-04-23T10:00:00.000Z"),
  });

  assert.match(result.errorMessage, /giao hang|delivery/i);
});
