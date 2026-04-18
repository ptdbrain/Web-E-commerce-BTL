import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCartItemKey,
  calculateConfiguredUnitPrice,
} from "../src/utils/cartItem.js";

test("calculateConfiguredUnitPrice adds size and add-ons", () => {
  const price = calculateConfiguredUnitPrice({
    newPrice: 79000,
    selectedSize: { label: "L", priceModifier: 12000 },
    selectedAddons: [
      { label: "Them pho mai", price: 9000 },
      { label: "Them ga", price: 29000 },
    ],
  });

  assert.equal(price, 129000);
});

test("buildCartItemKey stays stable when add-on order changes", () => {
  const a = buildCartItemKey({
    id: "64f100000000000000000001",
    selectedSize: { label: "L" },
    selectedAddons: [
      { label: "Them pho mai", price: 9000 },
      { label: "Them ga", price: 29000 },
    ],
    itemNote: "it cay",
  });
  const b = buildCartItemKey({
    id: "64f100000000000000000001",
    selectedSize: { label: "L" },
    selectedAddons: [
      { label: "Them ga", price: 29000 },
      { label: "Them pho mai", price: 9000 },
    ],
    itemNote: "it cay",
  });

  assert.equal(a, b);
});
