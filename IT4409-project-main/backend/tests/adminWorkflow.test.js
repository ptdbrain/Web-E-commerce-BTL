import test from "node:test";
import assert from "node:assert/strict";

import {
  canCancelOrder,
  canCompleteOrder,
  canRequestRefund,
  getAdminOrderAdvance,
  getAdminOrderActionLabel,
  isPaymentExpired,
} from "../utils/orderWorkflow.js";
import {
  buildProductVisibilityFilter,
} from "../utils/productQuery.js";

test("getAdminOrderAdvance advances delivery orders through kitchen then delivery", () => {
  assert.equal(getAdminOrderAdvance("pending", "delivery"), "preparing");
  assert.equal(getAdminOrderAdvance("preparing", "delivery"), "shipping");
  assert.equal(getAdminOrderAdvance("shipping", "delivery"), "confirmed");
});

test("getAdminOrderAdvance advances pickup and dine-in orders through ready", () => {
  assert.equal(getAdminOrderAdvance("pending", "pickup"), "preparing");
  assert.equal(getAdminOrderAdvance("preparing", "pickup"), "ready");
  assert.equal(getAdminOrderAdvance("ready", "pickup"), "confirmed");
  assert.equal(getAdminOrderAdvance("preparing", "dine_in"), "ready");
});

test("getAdminOrderAdvance blocks terminal and unpaid orders", () => {
  assert.equal(getAdminOrderAdvance("waiting_for_payment", "delivery"), null);
  assert.equal(getAdminOrderAdvance("confirmed", "delivery"), null);
  assert.equal(getAdminOrderAdvance("cancelled", "delivery"), null);
  assert.equal(getAdminOrderAdvance("refunded", "delivery"), null);
});

test("getAdminOrderActionLabel describes the next admin action", () => {
  assert.equal(getAdminOrderActionLabel("pending", "delivery"), "Nhan don");
  assert.equal(getAdminOrderActionLabel("preparing", "pickup"), "San sang giao mon");
  assert.equal(getAdminOrderActionLabel("shipping", "delivery"), "Hoan tat don");
});

test("buildProductVisibilityFilter hides inactive and unavailable items publicly", () => {
  assert.deepEqual(buildProductVisibilityFilter(), {
    isActive: { $ne: false },
    isAvailable: { $ne: false },
  });
  assert.deepEqual(buildProductVisibilityFilter({ isAvailable: false }), {
    isActive: { $ne: false },
    isAvailable: false,
  });
  assert.deepEqual(buildProductVisibilityFilter({ includeInactive: true }), {});
});

test("customer cancellation is blocked after kitchen starts or order is terminal", () => {
  assert.equal(canCancelOrder("waiting_for_payment"), true);
  assert.equal(canCancelOrder("pending"), true);
  assert.equal(canCancelOrder("preparing"), false);
  assert.equal(canCancelOrder("shipping"), false);
  assert.equal(canCancelOrder("ready"), false);
  assert.equal(canCancelOrder("confirmed"), false);
  assert.equal(canCancelOrder("cancelled"), false);
  assert.equal(canCancelOrder("refunded"), false);
});

test("customer completion supports delivery, pickup, and dine-in ready states", () => {
  assert.equal(canCompleteOrder("shipping", "delivery"), true);
  assert.equal(canCompleteOrder("ready", "pickup"), true);
  assert.equal(canCompleteOrder("ready", "dine_in"), true);
  assert.equal(canCompleteOrder("preparing", "pickup"), false);
  assert.equal(canCompleteOrder("confirmed", "delivery"), false);
});

test("refund requests only apply to in-progress handoff states", () => {
  assert.equal(canRequestRefund("shipping", "delivery"), true);
  assert.equal(canRequestRefund("ready", "pickup"), true);
  assert.equal(canRequestRefund("ready", "dine_in"), true);
  assert.equal(canRequestRefund("pending", "delivery"), false);
  assert.equal(canRequestRefund("confirmed", "delivery"), false);
});

test("payment expiry detects stale waiting orders", () => {
  const now = new Date("2026-05-27T10:30:00.000Z");
  assert.equal(
    isPaymentExpired(
      {
        orderStatus: "waiting_for_payment",
        paymentStatus: "waiting",
        createdAt: new Date("2026-05-27T10:14:59.000Z"),
      },
      now
    ),
    true
  );
  assert.equal(
    isPaymentExpired(
      {
        orderStatus: "waiting_for_payment",
        paymentStatus: "waiting",
        createdAt: new Date("2026-05-27T10:15:00.000Z"),
      },
      now
    ),
    false
  );
  assert.equal(
    isPaymentExpired(
      {
        orderStatus: "pending",
        paymentStatus: "unpaid",
        createdAt: new Date("2026-05-27T09:00:00.000Z"),
      },
      now
    ),
    false
  );
});
