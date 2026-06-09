import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeCategoryPayload,
  sortCategoriesForMenu,
} from "../utils/categoryDomain.js";

test("normalizeCategoryPayload creates a slug and active default", () => {
  const payload = normalizeCategoryPayload({
    name: "Combo Gia Dinh",
    icon: "https://example.com/combo.png",
  });

  assert.equal(payload.name, "Combo Gia Dinh");
  assert.equal(payload.slug, "combo-gia-dinh");
  assert.equal(payload.icon, "https://example.com/combo.png");
  assert.equal(payload.isActive, true);
});

test("normalizeCategoryPayload preserves only provided fields on partial updates", () => {
  assert.deepEqual(normalizeCategoryPayload({ isActive: false }, { partial: true }), {
    isActive: false,
  });
});

test("normalizeCategoryPayload rejects blank names when creating", () => {
  assert.throws(
    () => normalizeCategoryPayload({ name: "   " }),
    /Category name is required/
  );
});

test("sortCategoriesForMenu keeps default food order before custom categories", () => {
  const sorted = sortCategoriesForMenu([
    { name: "Seasonal", slug: "seasonal" },
    { name: "Burgers", slug: "burger" },
    { name: "Drinks", slug: "drinks" },
  ]);

  assert.deepEqual(
    sorted.map((category) => category.slug),
    ["burger", "drinks", "seasonal"]
  );
});
