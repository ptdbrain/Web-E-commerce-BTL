import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeFulfillmentPayload,
  normalizeMenuProductPayload,
  normalizeOrderItem,
} from "../utils/menuDomain.js";

test("normalizeMenuProductPayload parses food options and flags", () => {
  const payload = normalizeMenuProductPayload({
    name: "Burger Ga Sot Cay",
    price: "79000",
    discountPrice: "69000",
    stock: "25",
    preparationTime: "18",
    itemType: "combo",
    sizes: JSON.stringify([
      { label: "M", priceModifier: 0, isDefault: true },
      { label: "L", priceModifier: 12000 },
    ]),
    addons: JSON.stringify([
      { label: "Them pho mai", price: 9000 },
      { label: "Them ga", price: 29000 },
    ]),
    comboItems: JSON.stringify(["2 mieng ga", "1 khoai tay", "1 pepsi"]),
    badges: JSON.stringify(["best_seller", "spicy"]),
    highlights: JSON.stringify(["Gion ngoai mem trong", "Sot cay dac biet"]),
    isAvailable: "true",
    isBestSeller: "true",
  });

  assert.equal(payload.price, 79000);
  assert.equal(payload.discountPrice, 69000);
  assert.equal(payload.stock, 25);
  assert.equal(payload.preparationTime, 18);
  assert.equal(payload.itemType, "combo");
  assert.equal(payload.isAvailable, true);
  assert.equal(payload.isBestSeller, true);
  assert.equal(payload.sizes[1].priceModifier, 12000);
  assert.equal(payload.addons[0].label, "Them pho mai");
  assert.deepEqual(payload.comboItems, ["2 mieng ga", "1 khoai tay", "1 pepsi"]);
  assert.deepEqual(payload.badges, ["best_seller", "spicy"]);
  assert.equal(payload.slug, "burger-ga-sot-cay");
});

test("normalizeMenuProductPayload keeps only food-centric product fields", () => {
  const payload = normalizeMenuProductPayload({
    name: "Burger bo pho mai",
    price: "89000",
    stock: "12",
    soldCount: "34",
    spiceLevel: "mild",
    sizes: JSON.stringify([{ label: "Regular", priceModifier: 0, isDefault: true }]),
    specifications: JSON.stringify({
      serving: "1 nguoi",
      calories: "620 kcal",
      ingredients: ["bo", "pho mai"],
    }),
  });

  assert.equal(payload.name, "Burger bo pho mai");
  assert.equal(payload.price, 89000);
  assert.equal(payload.soldCount, 34);
  assert.equal(payload.spiceLevel, "mild");
  assert.deepEqual(payload.specifications.ingredients, ["bo", "pho mai"]);
});

test("normalizeMenuProductPayload preserves nested boolean flags and numeric specs", () => {
  const payload = normalizeMenuProductPayload({
    name: "Milkshake caramel",
    price: "42000",
    stock: "8",
    sizes: JSON.stringify([
      { label: "Large", priceModifier: 12000, isDefault: "false" },
    ]),
    addons: JSON.stringify([
      { label: "Them kem tuoi", price: 10000, isAvailable: "false" },
    ]),
    specifications: JSON.stringify({
      calories: 340,
      protein: 9,
      caffeine: 0,
    }),
  });

  assert.equal(payload.sizes[0].isDefault, false);
  assert.equal(payload.addons[0].isAvailable, false);
  assert.equal(payload.specifications.calories, 340);
  assert.equal(payload.specifications.protein, 9);
  assert.equal(payload.specifications.caffeine, 0);
});

test("normalizeOrderItem calculates line total with size and add-ons", () => {
  const item = normalizeOrderItem({
    productId: "64f100000000000000000001",
    productName: "Burger Ga Gion",
    productImage: "https://example.com/burger.jpg",
    quantity: 2,
    price: 79000,
    selectedSize: { label: "L", priceModifier: 12000 },
    selectedAddons: [
      { label: "Them pho mai", price: 9000 },
      { label: "Them ga", price: 29000 },
    ],
    itemNote: "Khong hanh tay",
  });

  assert.equal(item.quantity, 2);
  assert.equal(item.unitPrice, 129000);
  assert.equal(item.lineTotal, 258000);
  assert.equal(item.selectedSize.label, "L");
  assert.equal(item.selectedAddons.length, 2);
});

test("normalizeOrderItem keeps cart snapshot basePrice when unitPrice is already stored", () => {
  const item = normalizeOrderItem({
    productId: "64f100000000000000000002",
    productName: "Burger Ga Gion Mat Ong",
    quantity: 2,
    basePrice: 69000,
    unitPrice: 100000,
    selectedSize: { label: "Double Patty", priceModifier: 22000 },
    selectedAddons: [{ label: "Them pho mai", price: 9000, quantity: 1 }],
  });

  assert.equal(item.price, 69000);
  assert.equal(item.unitPrice, 100000);
  assert.equal(item.lineTotal, 200000);
});

test("normalizeOrderItem uses plan snapshot shape for pricing math", () => {
  const item = normalizeOrderItem({
    productId: "64f100000000000000000002",
    productName: "FireBite Combo",
    productImage: "https://example.com/combo.jpg",
    quantity: 2,
    basePrice: 79000,
    selectedSize: { label: "Large", priceModifier: 12000 },
    selectedAddons: [
      { label: "Extra Cheese", price: 9000, quantity: 2 },
      { label: "Bacon", price: 15000, quantity: 1 },
    ],
    itemNote: "No onions",
  });

  assert.equal(item.basePrice, 79000);
  assert.equal(item.unitPrice, 124000);
  assert.equal(item.lineTotal, 248000);
  assert.deepEqual(item.selectedAddons, [
    { label: "Extra Cheese", price: 9000, quantity: 2 },
    { label: "Bacon", price: 15000, quantity: 1 },
  ]);
});

test("normalizeFulfillmentPayload validates dine in and pickup payloads", () => {
  assert.throws(
    () =>
      normalizeFulfillmentPayload({
        fulfillmentType: "dine_in",
        tableBooking: {},
      }),
    /guestCount/i
  );

  const pickup = normalizeFulfillmentPayload({
    fulfillmentType: "pickup",
    pickupTime: "2026-04-11T19:00",
  });
  assert.equal(pickup.fulfillmentType, "pickup");
  assert.equal(pickup.deliveryFee, 0);
  assert.equal(pickup.pickupTime, "2026-04-11T19:00");

  const dineIn = normalizeFulfillmentPayload({
    fulfillmentType: "dine_in",
    tableBooking: {
      guestCount: 4,
      bookingTime: "2026-04-11T20:00",
      contactNote: "Sinh nhat",
    },
  });
  assert.equal(dineIn.fulfillmentType, "dine_in");
  assert.equal(dineIn.tableBooking.guestCount, 4);
});
