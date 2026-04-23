import test from "node:test";
import assert from "node:assert/strict";

import {
  buildAdminProductPayload,
  describeVoucherScope,
} from "../src/components/admin/utils.js";

test("buildAdminProductPayload serializes FireBite menu form values", () => {
  const payload = buildAdminProductPayload({
    name: "Combo trua ga gion",
    slug: "combo-trua-ga-gion",
    category: "lunch-deals",
    itemType: "combo",
    description: "Combo ga gion va nuoc ngot cho bua trua nhanh",
    price: "109000",
    discountPrice: "99000",
    stock: "20",
    soldCount: "140",
    preparationTime: "12",
    spiceLevel: "mild",
    sizes: [{ label: "Regular", priceModifier: "0", isDefault: true }],
    addons: [
      {
        label: "Them pepsi",
        price: "15000",
        maxQuantity: "2",
        isAvailable: true,
      },
    ],
    comboItemsText: "1 burger\n1 pepsi",
    badgesText: "lunch, best_seller",
    highlightsText: "Phuc vu gio trua",
    isAvailable: true,
    isActive: true,
    isBestSeller: true,
    isNew: false,
    imageFiles: [],
  });

  assert.equal(payload.get("name"), "Combo trua ga gion");
  assert.equal(payload.get("category"), "lunch-deals");
  assert.equal(payload.get("soldCount"), "140");
  assert.equal(payload.get("preparationTime"), "12");
});

test("describeVoucherScope summarizes category and product targeting", () => {
  assert.equal(
    describeVoucherScope({
      appliesToAllProducts: false,
      products: [{ _id: "1" }, { _id: "2" }],
      categories: [{ _id: "10" }],
    }),
    "2 mon | 1 danh muc"
  );
});
