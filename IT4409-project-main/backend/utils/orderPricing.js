const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
};

const normalizeLabel = (value = "") => String(value || "").trim().toLowerCase();

const normalizeQuantity = (value) => Math.max(1, toNumber(value, 1));

const getProductId = (product = {}) => normalizeId(product._id || product.id);

const getProductImage = (product = {}) =>
  Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : product.image || "";

export const calculateEffectiveProductPrice = (product = {}) => {
  const discountPrice = Number(product.discountPrice);
  if (Number.isFinite(discountPrice) && discountPrice >= 0) {
    return discountPrice;
  }

  return toNumber(product.price, 0);
};

const getProductLookup = (products = []) =>
  new Map((Array.isArray(products) ? products : []).map((item) => [getProductId(item), item]));

const requireProduct = (lookup, productId) => {
  const product = lookup.get(String(productId || ""));
  if (!product) {
    throw new Error(`Product ${productId || ""} was not found`);
  }

  if (product.isActive === false || product.isAvailable === false) {
    throw new Error(`Product ${product.name || productId} is not available`);
  }

  return product;
};

const resolveSize = (product, selectedSize) => {
  const label = normalizeLabel(selectedSize?.label || selectedSize?.name);
  if (!label) return null;

  const size = (Array.isArray(product.sizes) ? product.sizes : []).find(
    (item) => normalizeLabel(item.label || item.name) === label
  );

  if (!size) {
    throw new Error(`Size ${selectedSize.label || selectedSize.name} is not available`);
  }

  return {
    label: String(size.label || size.name || "").trim(),
    priceModifier: toNumber(size.priceModifier ?? size.price, 0),
  };
};

const resolveAddons = (product, selectedAddons = []) =>
  (Array.isArray(selectedAddons) ? selectedAddons : []).map((selectedAddon) => {
    const label = normalizeLabel(selectedAddon?.label || selectedAddon?.name);
    if (!label) {
      throw new Error("Addon label is required");
    }

    const addon = (Array.isArray(product.addons) ? product.addons : []).find(
      (item) => normalizeLabel(item.label || item.name) === label
    );

    if (!addon || addon.isAvailable === false) {
      throw new Error(`Addon ${selectedAddon.label || selectedAddon.name} is not available`);
    }

    const quantity = normalizeQuantity(selectedAddon.quantity);
    const maxQuantity = Math.max(1, toNumber(addon.maxQuantity, 1));
    if (quantity > maxQuantity) {
      throw new Error(`Addon ${addon.label || addon.name} exceeds max quantity`);
    }

    return {
      label: String(addon.label || addon.name || "").trim(),
      price: toNumber(addon.price ?? addon.priceModifier, 0),
      quantity,
    };
  });

export const priceOrderItemsFromProducts = (items = [], products = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order items are required");
  }

  const productLookup = getProductLookup(products);

  return items.map((item) => {
    const productId = normalizeId(item.productId || item.id || item._id);
    const product = requireProduct(productLookup, productId);
    const quantity = normalizeQuantity(item.quantity);

    if (toNumber(product.stock, 0) < quantity) {
      throw new Error(`Product ${product.name || productId} has not enough stock`);
    }

    const selectedSize = resolveSize(product, item.selectedSize);
    const selectedAddons = resolveAddons(product, item.selectedAddons);
    const basePrice = calculateEffectiveProductPrice(product);
    const addonsTotal = selectedAddons.reduce(
      (sum, addon) => sum + addon.price * addon.quantity,
      0
    );
    const unitPrice = basePrice + (selectedSize?.priceModifier || 0) + addonsTotal;

    return {
      productId,
      cartKey: String(item.cartKey || "").trim(),
      productName: product.name || item.productName || item.name || "",
      productImage: getProductImage(product),
      quantity,
      selectedSize,
      selectedAddons,
      itemNote: String(item.itemNote || item.note || "").trim(),
      categoryId: normalizeId(product.category),
      basePrice,
      price: basePrice,
      unitPrice,
      lineTotal: unitPrice * quantity,
      shippingPrice: 0,
    };
  });
};

export const buildVoucherPricingItems = (pricedItems = []) =>
  (Array.isArray(pricedItems) ? pricedItems : []).map((item) => ({
    productId: item.productId,
    categoryId: item.categoryId,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    lineTotal: item.lineTotal,
  }));

export default {
  calculateEffectiveProductPrice,
  priceOrderItemsFromProducts,
  buildVoucherPricingItems,
};
