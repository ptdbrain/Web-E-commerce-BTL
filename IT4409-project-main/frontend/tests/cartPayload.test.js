import test from "node:test";
import assert from "node:assert/strict";

import { buildCartApiItemPayload } from "../src/utils/cartPayload.js";

test("buildCartApiItemPayload sends the food cart shape expected by backend", () => {
  const payload = buildCartApiItemPayload({
    id: "64f100000000000000000002",
    name: "Burger ga gion mat ong",
    imageUrl: "https://example.com/burger.jpg",
    quantity: 2,
    newPrice: 69000,
    selectedSize: { label: "Double Patty", priceModifier: 22000 },
    selectedAddons: [{ label: "Them pho mai", price: 9000, quantity: 1 }],
    itemNote: "It sot",
    cartKey: "burger::double patty::them pho mai:1:9000::it sot",
  });

  assert.equal(payload.productId, "64f100000000000000000002");
  assert.equal(payload.productName, "Burger ga gion mat ong");
  assert.equal(payload.productImage, "https://example.com/burger.jpg");
  assert.equal(payload.selectedSize.label, "Double Patty");
  assert.equal(payload.selectedAddons[0].label, "Them pho mai");
  assert.equal(payload.itemNote, "It sot");
});
