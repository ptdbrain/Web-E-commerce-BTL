const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const calculateConfiguredUnitPrice = (item = {}) => {
  const basePrice = toNumber(item.newPrice ?? item.price ?? item.unitPrice, 0);
  const sizeExtra = toNumber(item.selectedSize?.priceModifier, 0);
  const addonsTotal = (Array.isArray(item.selectedAddons) ? item.selectedAddons : []).reduce(
    (sum, addon) =>
      sum + toNumber(addon.price, 0) * Math.max(1, toNumber(addon.quantity, 1)),
    0
  );

  return basePrice + sizeExtra + addonsTotal;
};

const normalizeAddonSignature = (addons = []) =>
  addons
    .map((addon) => ({
      label: String(addon.label || addon.name || "").trim().toLowerCase(),
      quantity: Math.max(1, toNumber(addon.quantity, 1)),
      price: toNumber(addon.price, 0),
    }))
    .filter((addon) => addon.label)
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((addon) => `${addon.label}:${addon.quantity}:${addon.price}`)
    .join("|");

export const buildCartItemKey = (item = {}) => {
  const baseId = String(item.id || item.productId || "");
  const size = String(item.selectedSize?.label || "").trim().toLowerCase();
  const addons = normalizeAddonSignature(item.selectedAddons || []);
  const note = String(item.itemNote || item.note || "").trim().toLowerCase();

  return [baseId, size, addons, note].join("::");
};
