const DEFAULT_DELIVERY_FEE = 30000;

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return Boolean(value);
};

const parseJson = (value, fallback) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return value;
};

const slugify = (value = "") =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeSizes = (sizes) =>
  (Array.isArray(sizes) ? sizes : []).map((size, index) => ({
    label: String(size?.label || size?.name || `Option ${index + 1}`).trim(),
    priceModifier: toNumber(size?.priceModifier ?? size?.price ?? 0, 0),
    isDefault: toBoolean(size?.isDefault, false),
  }));

const normalizeAddons = (addons) =>
  (Array.isArray(addons) ? addons : []).map((addon, index) => ({
    label: String(addon?.label || addon?.name || `Addon ${index + 1}`).trim(),
    price: toNumber(addon?.price ?? addon?.priceModifier ?? 0, 0),
    maxQuantity: Math.max(1, toNumber(addon?.maxQuantity ?? 1, 1)),
    isAvailable: toBoolean(addon?.isAvailable, true),
  }));

const normalizeComboItems = (comboItems) =>
  (Array.isArray(comboItems) ? comboItems : [])
    .map((item) => {
      if (typeof item === "string") return item.trim();
      return String(item?.label || item?.name || "").trim();
    })
    .filter(Boolean);

const normalizeStringList = (items) =>
  (Array.isArray(items) ? items : [])
    .map((item) => String(item).trim())
    .filter(Boolean);

const normalizeFoodSpecifications = (specifications) => {
  if (
    !specifications ||
    typeof specifications !== "object" ||
    Array.isArray(specifications)
  ) {
    return {};
  }

  const normalized = {};
  const allowedKeys = [
    "serving",
    "portion",
    "calories",
    "ingredients",
    "allergens",
    "items",
    "sugar",
    "protein",
    "caffeine",
    "spiceLevel",
  ];

  for (const key of allowedKeys) {
    const value = specifications[key];

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) normalized[key] = trimmed;
      continue;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      normalized[key] = value;
      continue;
    }

    if (Array.isArray(value)) {
      const items = value.map((item) => String(item).trim()).filter(Boolean);
      if (items.length) normalized[key] = items;
    }
  }

  return normalized;
};

export const normalizeMenuProductPayload = (payload = {}) => {
  const sizes = normalizeSizes(parseJson(payload.sizes, []));
  const addons = normalizeAddons(parseJson(payload.addons, []));
  const comboItems = normalizeComboItems(parseJson(payload.comboItems, []));
  const badges = normalizeStringList(parseJson(payload.badges, []));
  const highlights = normalizeStringList(parseJson(payload.highlights, []));
  const specifications = normalizeFoodSpecifications(
    parseJson(payload.specifications, {})
  );

  return {
    name: String(payload.name || "").trim(),
    slug: payload.slug ? slugify(payload.slug) : slugify(payload.name || ""),
    description: String(payload.description || "").trim(),
    price: toNumber(payload.price, 0),
    discountPrice:
      payload.discountPrice === undefined || payload.discountPrice === ""
        ? undefined
        : toNumber(payload.discountPrice, 0),
    stock: Math.max(0, toNumber(payload.stock, 0)),
    soldCount: Math.max(0, toNumber(payload.soldCount, 0)),
    itemType: String(payload.itemType || "single").trim() || "single",
    preparationTime: Math.max(0, toNumber(payload.preparationTime, 15)),
    spiceLevel: String(payload.spiceLevel || "").trim(),
    sizes,
    addons,
    comboItems,
    badges,
    highlights,
    specifications,
    isAvailable: toBoolean(payload.isAvailable, true),
    isActive: toBoolean(payload.isActive, true),
    isBestSeller: toBoolean(payload.isBestSeller, false),
    isNew: toBoolean(payload.isNew, false),
  };
};

export const normalizeOrderItem = (item = {}) => {
  const quantity = Math.max(1, toNumber(item.quantity, 1));
  const basePrice = toNumber(
    item.basePrice ?? item.price ?? item.newPrice ?? item.unitPrice,
    0
  );
  const size = item.selectedSize
    ? {
        label: String(
          item.selectedSize.label || item.selectedSize.name || ""
        ).trim(),
        priceModifier: toNumber(item.selectedSize.priceModifier, 0),
      }
    : null;
  const addons = (Array.isArray(item.selectedAddons)
    ? item.selectedAddons
    : []
  ).map((addon) => ({
    label: String(addon.label || addon.name || "").trim(),
    price: toNumber(addon.price, 0),
    quantity: Math.max(1, toNumber(addon.quantity, 1)),
  }));

  const addonsTotal = addons.reduce(
    (sum, addon) => sum + addon.price * addon.quantity,
    0
  );
  const unitPrice = basePrice + (size?.priceModifier || 0) + addonsTotal;

  return {
    productId: item.productId || item.id,
    productName: item.productName || item.name || "",
    productImage: item.productImage || item.imageUrl || item.image || "",
    quantity,
    selectedSize: size,
    selectedAddons: addons,
    itemNote: String(item.itemNote || item.note || "").trim(),
    basePrice,
    price: basePrice,
    unitPrice,
    lineTotal: unitPrice * quantity,
    shippingPrice: 0,
  };
};

export const normalizeFulfillmentPayload = (payload = {}) => {
  const fulfillmentType = String(payload.fulfillmentType || "delivery").trim();

  if (fulfillmentType === "delivery") {
    const shippingAddress = String(payload.shippingAddress || "").trim();
    if (!shippingAddress) {
      throw new Error("shippingAddress is required for delivery orders");
    }

    return {
      fulfillmentType,
      shippingAddress,
      pickupTime: undefined,
      tableBooking: undefined,
      deliveryFee: Math.max(
        0,
        toNumber(payload.deliveryFee, DEFAULT_DELIVERY_FEE)
      ),
    };
  }

  if (fulfillmentType === "pickup") {
    const pickupTime = String(payload.pickupTime || "").trim();
    if (!pickupTime) {
      throw new Error("pickupTime is required for pickup orders");
    }

    return {
      fulfillmentType,
      shippingAddress: "",
      pickupTime,
      tableBooking: undefined,
      deliveryFee: 0,
    };
  }

  if (fulfillmentType === "dine_in") {
    const tableBooking = payload.tableBooking || {};
    const guestCount = Math.max(0, toNumber(tableBooking.guestCount, 0));
    const bookingTime = String(tableBooking.bookingTime || "").trim();

    if (!guestCount) {
      throw new Error("guestCount is required for dine in orders");
    }
    if (!bookingTime) {
      throw new Error("bookingTime is required for dine in orders");
    }

    return {
      fulfillmentType,
      shippingAddress: "",
      pickupTime: undefined,
      tableBooking: {
        guestCount,
        bookingTime,
        contactNote: String(tableBooking.contactNote || "").trim(),
      },
      deliveryFee: 0,
    };
  }

  throw new Error("Unsupported fulfillmentType");
};

export { DEFAULT_DELIVERY_FEE, slugify };
