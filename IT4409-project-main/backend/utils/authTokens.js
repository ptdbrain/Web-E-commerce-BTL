import crypto from "node:crypto";

export const hashRefreshToken = (token) =>
  crypto.createHash("sha256").update(String(token || "")).digest("hex");

export const verifyRefreshTokenHash = (token, expectedHash) => {
  if (!token || !expectedHash) return false;
  const actualHash = hashRefreshToken(token);
  const actual = Buffer.from(actualHash);
  const expected = Buffer.from(String(expectedHash));

  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
};

