import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeVoucherPayload,
  validateVoucherPayload,
} from "../utils/voucherPayload.js";

test("normalizeVoucherPayload keeps partial status updates narrow", () => {
  assert.deepEqual(normalizeVoucherPayload({ isActive: false }, { partial: true }), {
    isActive: false,
  });
});

test("normalizeVoucherPayload normalizes create payloads for amount vouchers", () => {
  const payload = normalizeVoucherPayload({
    code: " lunch25 ",
    description: "  Lunch discount ",
    discountType: "amount",
    discountValue: "25000",
    appliesToAllProducts: "true",
    appliesToAllUsers: "true",
    startDate: "2026-05-01",
    endDate: "2026-05-31",
  });

  assert.equal(payload.code, "LUNCH25");
  assert.equal(payload.description, "Lunch discount");
  assert.equal(payload.discountValue, 25000);
  assert.equal(payload.appliesToAllProducts, true);
  assert.equal(payload.appliesToAllUsers, true);
  assert.ok(payload.startDate instanceof Date);
  assert.ok(payload.endDate instanceof Date);
});

test("validateVoucherPayload rejects invalid percent and date range", () => {
  assert.equal(
    validateVoucherPayload({
      code: "BAD",
      discountType: "percent",
      discountValue: 150,
    }).message,
    "Phần trăm giảm giá phải lớn hơn 0 và không vượt quá 100."
  );

  assert.equal(
    validateVoucherPayload({
      code: "BAD_DATE",
      discountType: "amount",
      discountValue: 20000,
      startDate: new Date("2026-06-01"),
      endDate: new Date("2026-05-01"),
    }).message,
    "Ngày bắt đầu không được sau ngày kết thúc."
  );
});
