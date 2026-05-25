import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateEffectiveProductPrice,
  priceOrderItemsFromProducts,
} from "../utils/orderPricing.js";

const product = (overrides = {}) => ({
  _id: "64f100000000000000000001",
  name: "Burger Ga Gion",
  price: 79000,
  discountPrice: 69000,
  stock: 10,
  isActive: true,
  isAvailable: true,
  images: ["https://example.com/burger.jpg"],
  category: "64f200000000000000000001",
  sizes: [
    { label: "Regular", priceModifier: 0, isDefault: true },
    { label: "Large", priceModifier: 12000 },
  ],
  addons: [
    { label: "Pho mai", price: 9000, maxQuantity: 2, isAvailable: true },
    { label: "Sot cay", price: 7000, maxQuantity: 1, isAvailable: false },
  ],
  ...overrides,
});

test("calculateEffectiveProductPrice prefers discountPrice when available", () => {
  assert.equal(calculateEffectiveProductPrice(product()), 69000);
  assert.equal(
    calculateEffectiveProductPrice(product({ discountPrice: undefined })),
    79000
  );
});

test("priceOrderItemsFromProducts ignores client supplied prices", () => {
  const [item] = priceOrderItemsFromProducts(
    [
      {
        productId: "64f100000000000000000001",
        productName: "Fake name",
        price: 1,
        unitPrice: 1,
        lineTotal: 2,
        quantity: 2,
        selectedSize: { label: "Large", priceModifier: 999999 },
        selectedAddons: [{ label: "Pho mai", price: 1, quantity: 2 }],
      },
    ],
    [product()]
  );

  assert.equal(item.productName, "Burger Ga Gion");
  assert.equal(item.basePrice, 69000);
  assert.equal(item.price, 69000);
  assert.equal(item.selectedSize.priceModifier, 12000);
  assert.deepEqual(item.selectedAddons, [
    { label: "Pho mai", price: 9000, quantity: 2 },
  ]);
  assert.equal(item.unitPrice, 99000);
  assert.equal(item.lineTotal, 198000);
  assert.equal(item.categoryId, "64f200000000000000000001");
});

test("priceOrderItemsFromProducts rejects unavailable stock and options", () => {
  assert.throws(
    () =>
      priceOrderItemsFromProducts(
        [{ productId: "64f100000000000000000001", quantity: 11 }],
        [product()]
      ),
    /not enough stock/i
  );

  assert.throws(
    () =>
      priceOrderItemsFromProducts(
        [
          {
            productId: "64f100000000000000000001",
            quantity: 1,
            selectedAddons: [{ label: "Sot cay", quantity: 1 }],
          },
        ],
        [product()]
      ),
    /not available/i
  );
});
