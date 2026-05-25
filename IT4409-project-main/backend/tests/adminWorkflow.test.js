import test from "node:test";
import assert from "node:assert/strict";

import {
  getAdminOrderAdvance,
  getAdminOrderActionLabel,
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
  assert.equal(getAdminOrderActionLabel("pending", "delivery"), "Chuyen bep");
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
