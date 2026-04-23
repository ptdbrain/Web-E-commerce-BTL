import test from "node:test";
import assert from "node:assert/strict";
import { buildProductFilter } from "../utils/productQuery.js";

test("buildProductFilter maps food query params only", () => {
  const filter = buildProductFilter({
    search: "burger",
    category: "burger",
    itemType: "single",
    spiceLevel: "medium",
    available: "true",
    featured: "true",
  });

  assert.equal(filter.categorySlug, "burger");
  assert.equal(filter.itemType, "single");
  assert.equal(filter.spiceLevel, "medium");
  assert.equal(filter.isAvailable, true);
  assert.equal(filter.isFeatured, true);
  assert.ok(filter.searchRegex instanceof RegExp);
  assert.equal(filter.searchRegex.source, "burger");
  assert.ok(filter.searchRegex.flags.includes("i"));
});
