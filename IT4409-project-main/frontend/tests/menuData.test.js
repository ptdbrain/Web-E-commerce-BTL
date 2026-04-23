import test from "node:test";
import assert from "node:assert/strict";

import { categories } from "../src/data/categories.js";
import { menuProducts } from "../src/data/menuData.js";

test("menu data covers the FireBite category set with realistic menu variety", () => {
  const categorySlugs = new Set(categories.map((category) => category.slug));
  const productCategorySlugs = new Set(
    menuProducts.map((product) => product.category?.slug)
  );

  assert.equal(categories.length, 11);
  assert.ok(menuProducts.length >= 28);
  assert.deepEqual(
    [...productCategorySlugs].sort(),
    [...categorySlugs].sort()
  );

  assert.ok(menuProducts.some((product) => product.itemType === "combo"));
  assert.ok(menuProducts.some((product) => product.itemType === "drink"));
  assert.ok(menuProducts.some((product) => product.itemType === "dessert"));
  assert.ok(menuProducts.some((product) => product.itemType === "side"));
});

test("menu data keeps ids, slugs, and essential food fields unique and complete", () => {
  const ids = new Set();
  const slugs = new Set();

  for (const product of menuProducts) {
    assert.ok(product.id);
    assert.ok(product.slug);
    assert.ok(product.name);
    assert.ok(product.description);
    assert.ok(product.price > 0);
    assert.ok(product.discountPrice > 0);
    assert.ok(Array.isArray(product.images) && product.images.length > 0);
    assert.ok(typeof product.soldCount === "number");
    assert.ok(typeof product.rating === "number");
    assert.ok(typeof product.numReviews === "number");
    assert.ok(typeof product.isAvailable === "boolean");
    assert.ok(categories.some((category) => category.slug === product.category?.slug));

    assert.equal(ids.has(product.id), false);
    assert.equal(slugs.has(product.slug), false);

    ids.add(product.id);
    slugs.add(product.slug);
  }
});
