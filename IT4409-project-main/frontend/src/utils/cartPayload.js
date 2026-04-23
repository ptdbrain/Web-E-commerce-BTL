import { buildCartItemKey, calculateConfiguredUnitPrice } from "./cartItem.js";

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeQuantity = (value) => Math.max(1, toNumber(value, 1));

const normalizeAddons = (addons = []) =>
  (Array.isArray(addons) ? addons : []).map((addon) => ({
    label: String(addon.label || addon.name || "").trim(),
    price: toNumber(addon.price, 0),
    quantity: normalizeQuantity(addon.quantity),
  }));

export const getItemBasePrice = (item = {}) =>
  toNumber(
    item.basePrice ?? item.newPrice ?? item.price ?? item.originalPrice ?? item.unitPrice,
    0
  );

export const buildCartApiItemPayload = (item = {}) => ({
  cartKey: item.cartKey || buildCartItemKey(item),
  productId: item.id || item.productId,
  productName: item.name || item.productName || "",
  productImage: item.imageUrl || item.image || item.thumbnail || "",
  quantity: normalizeQuantity(item.quantity),
  price: getItemBasePrice(item),
  selectedSize: item.selectedSize || null,
  selectedAddons: normalizeAddons(item.selectedAddons || []),
  itemNote: String(item.itemNote || item.note || "").trim(),
});

export const buildOrderItemPayload = (item = {}) => ({
  productId: item.id || item.productId,
  productName: item.name || item.productName || "",
  productImage: item.imageUrl || item.image || item.thumbnail || "",
  quantity: normalizeQuantity(item.quantity),
  price: getItemBasePrice(item),
  selectedSize: item.selectedSize || null,
  selectedAddons: normalizeAddons(item.selectedAddons || []),
  itemNote: String(item.itemNote || item.note || "").trim(),
});

export const buildVoucherItemPayload = (item = {}) => {
  const quantity = normalizeQuantity(item.quantity);
  const unitPrice =
    toNumber(item.configuredUnitPrice, NaN) ||
    calculateConfiguredUnitPrice({
      ...item,
      newPrice: getItemBasePrice(item),
    });

  return {
    productId: item.id || item.productId,
    quantity,
    unitPrice,
    lineTotal: unitPrice * quantity,
  };
};

export const mapServerCartItem = (item = {}) => {
  const productId = String(item.productId || item.id || "");
  const basePrice = getItemBasePrice(item);
  const selectedAddons = normalizeAddons(item.selectedAddons || []);
  const selectedSize = item.selectedSize || null;
  const configuredUnitPrice =
    toNumber(item.unitPrice, NaN) ||
    calculateConfiguredUnitPrice({
      newPrice: basePrice,
      selectedSize,
      selectedAddons,
    });

  return {
    id: productId,
    _id: productId,
    name: item.productName || item.name || "",
    imageUrl: item.productImage || item.imageUrl || item.image || "",
    image: item.productImage || item.imageUrl || item.image || "",
    quantity: normalizeQuantity(item.quantity),
    newPrice: basePrice,
    basePrice,
    configuredUnitPrice,
    selectedSize,
    selectedAddons,
    itemNote: String(item.itemNote || item.note || "").trim(),
    cartKey: item.cartKey || buildCartItemKey({ ...item, id: productId }),
  };
};
