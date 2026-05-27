import test from "node:test";
import assert from "node:assert/strict";

import {
  hashRefreshToken,
  verifyRefreshTokenHash,
} from "../utils/authTokens.js";

test("refresh tokens are stored as deterministic hashes", () => {
  const token = "refresh-token-value";
  const hash = hashRefreshToken(token);

  assert.notEqual(hash, token);
  assert.equal(hashRefreshToken(token), hash);
  assert.equal(verifyRefreshTokenHash(token, hash), true);
  assert.equal(verifyRefreshTokenHash("other-token", hash), false);
});

