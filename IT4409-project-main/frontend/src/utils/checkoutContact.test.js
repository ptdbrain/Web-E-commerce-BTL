import test from "node:test";
import assert from "node:assert/strict";

import {
  getCheckoutContactFromUser,
  isCheckoutContactComplete,
} from "./checkoutContact.js";

test("getCheckoutContactFromUser maps the primary account details", () => {
  assert.deepEqual(
    getCheckoutContactFromUser({
      fullname: "Nguyễn Minh Anh",
      phoneNumber: "0900000002",
      addresses: ["12 Nguyễn Trãi, Hà Nội", "Địa chỉ phụ"],
    }),
    {
      name: "Nguyễn Minh Anh",
      phone: "0900000002",
      address: "12 Nguyễn Trãi, Hà Nội",
    }
  );
});

test("isCheckoutContactComplete requires address only for delivery", () => {
  const contact = { name: "Minh Anh", phone: "0900000002", address: "" };

  assert.equal(isCheckoutContactComplete(contact, "delivery"), false);
  assert.equal(isCheckoutContactComplete(contact, "pickup"), true);
  assert.equal(isCheckoutContactComplete(contact, "dine_in"), true);
});
