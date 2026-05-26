import test from "node:test";
import assert from "node:assert/strict";
import { normalizeProductImageUrls } from "../utils/productImages.js";

test("normalizeProductImageUrls accepts json image url payloads", () => {
  assert.deepEqual(
    normalizeProductImageUrls(
      JSON.stringify([
        "https://cdn.example.com/burger.jpg",
        " /images/fallback.png ",
        "javascript:alert(1)",
        "https://cdn.example.com/burger.jpg",
      ])
    ),
    ["https://cdn.example.com/burger.jpg", "/images/fallback.png"]
  );
});

test("normalizeProductImageUrls accepts newline input and limits gallery size", () => {
  const input = Array.from(
    { length: 8 },
    (_, index) => `https://cdn.example.com/item-${index + 1}.jpg`
  ).join("\n");

  assert.equal(normalizeProductImageUrls(input).length, 6);
});
