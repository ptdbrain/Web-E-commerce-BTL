import test from "node:test";
import assert from "node:assert/strict";

import {
  getCartSessionTransition,
  isCurrentCartSession,
  shouldHydrateStoredCart,
} from "./cartSession.js";

test("authenticated sessions do not hydrate the shared guest cart", () => {
  assert.equal(shouldHydrateStoredCart("valid-token"), false);
  assert.equal(shouldHydrateStoredCart(""), true);
});

test("switching accounts clears the previous account cart", () => {
  assert.equal(getCartSessionTransition("user-a", "user-b"), "clear");
});

test("guest cart is merged only on the first login", () => {
  assert.equal(getCartSessionTransition("", "user-a"), "merge-guest");
  assert.equal(getCartSessionTransition("user-a", "user-a"), "keep");
  assert.equal(getCartSessionTransition("user-a", ""), "clear");
});

test("stale cart responses cannot overwrite a newer login session", () => {
  assert.equal(isCurrentCartSession("token-a", "token-b"), false);
  assert.equal(isCurrentCartSession("token-b", "token-b"), true);
});
