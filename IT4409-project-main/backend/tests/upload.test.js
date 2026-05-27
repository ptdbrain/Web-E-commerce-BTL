import test from "node:test";
import assert from "node:assert/strict";

import upload, {
  PRODUCT_IMAGE_ALLOWED_MIME_TYPES,
  PRODUCT_IMAGE_MAX_FILE_SIZE,
} from "../middleware/upload.js";

test("product image uploads are constrained by size and type", () => {
  assert.equal(PRODUCT_IMAGE_MAX_FILE_SIZE, 5 * 1024 * 1024);
  assert.deepEqual(PRODUCT_IMAGE_ALLOWED_MIME_TYPES, [
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);
  assert.equal(upload.limits.fileSize, PRODUCT_IMAGE_MAX_FILE_SIZE);
});

