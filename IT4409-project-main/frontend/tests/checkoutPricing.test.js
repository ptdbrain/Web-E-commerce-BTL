import test from "node:test";
import assert from "node:assert/strict";

import { calculateCheckoutTotals } from "../src/utils/checkoutPricing.js";

test("calculateCheckoutTotals uses item and shipping discounts from voucher breakdown", () => {
  const totals = calculateCheckoutTotals({
    items: [{ configuredUnitPrice: 79000, quantity: 2 }],
    fulfillmentType: "delivery",
    voucherResult: {
      itemDiscount: 15000,
      shippingDiscount: 30000,
      discountAmount: 45000,
      finalTotal: 143000,
    },
  });

  assert.equal(totals.subtotal, 158000);
  assert.equal(totals.deliveryFee, 30000);
  assert.equal(totals.discountAmount, 45000);
  assert.equal(totals.itemDiscount, 15000);
  assert.equal(totals.shippingDiscount, 30000);
  assert.equal(totals.total, 143000);
});
