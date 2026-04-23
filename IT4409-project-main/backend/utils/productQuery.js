const toBoolean = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }

  return undefined;
};

const escapeRegExp = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const buildProductFilter = (query = {}) => {
  const search = String(query.search || "").trim();
  const categorySlug = String(query.category || "").trim() || undefined;
  const itemType = String(query.itemType || "").trim() || undefined;
  const spiceLevel = String(query.spiceLevel || "").trim() || undefined;
  const isAvailable = toBoolean(query.available);
  const isFeatured = toBoolean(query.featured);
  const searchRegex = search ? new RegExp(escapeRegExp(search), "i") : undefined;

  return {
    search,
    searchRegex,
    categorySlug,
    itemType,
    spiceLevel,
    isAvailable,
    isFeatured,
  };
};
