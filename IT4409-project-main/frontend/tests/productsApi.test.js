import test from "node:test";
import assert from "node:assert/strict";

import { normalizeProduct } from "../src/api/productsApi.js";

test("normalizeProduct maps backend food fields into storefront shape", () => {
  const normalized = normalizeProduct({
    _id: "64f100000000000000000011",
    name: "Com ga sot tieu den",
    category: { name: "Com va to", slug: "rice-bowls" },
    price: 89000,
    discountPrice: 79000,
    soldCount: 184,
    images: ["https://example.com/com-ga.jpg"],
    specifications: { serving: "1 nguoi", calories: "710 kcal" },
  });

  assert.equal(normalized.category.slug, "rice-bowls");
  assert.equal(normalized.newPrice, 79000);
  assert.equal(normalized.soldCount, 184);
  assert.equal(normalized.image, "https://example.com/com-ga.jpg");
  assert.equal(normalized.specifications.serving, "1 nguoi");
});
