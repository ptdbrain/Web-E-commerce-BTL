import { DEFAULT_CATEGORIES } from "../models/Category.js";

const categoryOrder = new Map(
  DEFAULT_CATEGORIES.map((category, index) => [category.slug, index])
);

export const slugifyCategory = (value = "") =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeBoolean = (value, fallback = true) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") return true;
    if (normalized === "false" || normalized === "0") return false;
  }
  return fallback;
};

const normalizeStringList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[\r\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export const normalizeCategoryPayload = (payload = {}, { partial = false } = {}) => {
  const normalized = {};
  const hasName = Object.prototype.hasOwnProperty.call(payload, "name");
  const hasSlug = Object.prototype.hasOwnProperty.call(payload, "slug");

  if (hasName) {
    const name = String(payload.name || "").trim();
    if (!name && !partial) {
      throw new Error("Category name is required");
    }
    if (name) normalized.name = name;
  } else if (!partial) {
    throw new Error("Category name is required");
  }

  if (hasSlug) {
    const slug = slugifyCategory(payload.slug);
    if (slug) normalized.slug = slug;
  } else if (!partial && normalized.name) {
    normalized.slug = slugifyCategory(normalized.name);
  }

  for (const field of ["icon", "image"]) {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      normalized[field] = String(payload[field] || "").trim();
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, "subcategories")) {
    normalized.subcategories = normalizeStringList(payload.subcategories);
  }

  if (Object.prototype.hasOwnProperty.call(payload, "isActive")) {
    normalized.isActive = normalizeBoolean(payload.isActive, true);
  } else if (!partial) {
    normalized.isActive = true;
  }

  return normalized;
};

export const sortCategoriesForMenu = (categories = []) =>
  [...categories].sort((left, right) => {
    const leftIndex = categoryOrder.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = categoryOrder.get(right.slug) ?? Number.MAX_SAFE_INTEGER;

    return (
      leftIndex - rightIndex ||
      String(left.name || "").localeCompare(String(right.name || ""))
    );
  });
