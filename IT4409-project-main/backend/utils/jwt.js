import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const requireSecret = (value, name) => {
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
};

export const generateToken = (userId, role = "customer") =>
  jwt.sign({ id: userId, role }, requireSecret(JWT_SECRET, "JWT_SECRET"), {
    expiresIn: "1h",
    algorithm: "HS256",
  });

export const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, requireSecret(JWT_REFRESH_SECRET, "JWT_REFRESH_SECRET"), {
    expiresIn: "7d",
    algorithm: "HS256",
  });

export const verifyToken = (token) =>
  jwt.verify(token, requireSecret(JWT_SECRET, "JWT_SECRET"), {
    algorithms: ["HS256"],
  });

export const verifyRefreshToken = (token) =>
  jwt.verify(token, requireSecret(JWT_REFRESH_SECRET, "JWT_REFRESH_SECRET"), {
    algorithms: ["HS256"],
  });
