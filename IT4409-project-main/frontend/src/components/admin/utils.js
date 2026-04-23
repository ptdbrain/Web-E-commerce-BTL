const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const statusMeta = {
  waiting_for_payment: {
    label: "Cho thanh toan",
    className: "border border-orange-200 bg-orange-50 text-orange-700",
  },
  pending: {
    label: "Cho xu ly",
    className: "border border-amber-200 bg-amber-50 text-amber-700",
  },
  paid: {
    label: "Da thanh toan",
    className: "border border-sky-200 bg-sky-50 text-sky-700",
  },
  shipping: {
    label: "Dang phuc vu",
    className: "border border-violet-200 bg-violet-50 text-violet-700",
  },
  confirmed: {
    label: "Hoan tat",
    className: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  cancelled: {
    label: "Da huy",
    className: "border border-rose-200 bg-rose-50 text-rose-700",
  },
  refunded: {
    label: "Da hoan tien",
    className: "border border-slate-200 bg-slate-100 text-slate-700",
  },
};

const fulfillmentMeta = {
  delivery: {
    label: "Giao hang",
    className: "border border-orange-200 bg-orange-50 text-orange-700",
  },
  pickup: {
    label: "Tu den lay",
    className: "border border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  dine_in: {
    label: "Dat ban",
    className: "border border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  },
};

const paymentMeta = {
  cash: "Tien mat",
  zalopay: "ZaloPay",
  card: "The ngan hang",
  vnpay: "VNPay",
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const splitTextLines = (value) =>
  String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

export const splitTags = (value) =>
  String(value || "")
    .split(/[\r\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

export const sanitizeSizes = (sizes = []) => {
  const nextSizes = (Array.isArray(sizes) ? sizes : [])
    .map((size) => ({
      label: String(size?.label || "").trim(),
      priceModifier: toNumber(size?.priceModifier, 0),
      isDefault: Boolean(size?.isDefault),
    }))
    .filter((size) => size.label);

  if (nextSizes.length > 0 && !nextSizes.some((size) => size.isDefault)) {
    nextSizes[0].isDefault = true;
  }

  return nextSizes;
};

export const sanitizeAddons = (addons = []) =>
  (Array.isArray(addons) ? addons : [])
    .map((addon) => ({
      label: String(addon?.label || "").trim(),
      price: toNumber(addon?.price, 0),
      maxQuantity: Math.max(1, toNumber(addon?.maxQuantity, 1)),
      isAvailable: addon?.isAvailable !== false,
    }))
    .filter((addon) => addon.label);

export const createAdminSize = () => ({
  label: "",
  priceModifier: "0",
  isDefault: false,
});

export const createAdminAddon = () => ({
  label: "",
  price: "0",
  maxQuantity: "1",
  isAvailable: true,
});

export const createEmptyAdminProductForm = () => ({
  name: "",
  slug: "",
  category: "combo",
  itemType: "single",
  description: "",
  price: "",
  discountPrice: "",
  stock: "0",
  soldCount: "0",
  preparationTime: "15",
  spiceLevel: "",
  sizes: [createAdminSize()],
  addons: [createAdminAddon()],
  comboItemsText: "",
  badgesText: "",
  highlightsText: "",
  isAvailable: true,
  isActive: true,
  isBestSeller: false,
  isNew: false,
  existingImages: [],
  imageFiles: [],
});

export const normalizeAdminProductForm = (product = {}) => ({
  name: product.name || "",
  slug: product.slug || "",
  category:
    product.category?.slug || product.category?.name || product.category || "combo",
  itemType: product.itemType || "single",
  description: product.description || "",
  price: String(product.price ?? ""),
  discountPrice:
    product.discountPrice === undefined || product.discountPrice === null
      ? ""
      : String(product.discountPrice),
  stock: String(product.stock ?? 0),
  soldCount: String(product.soldCount ?? 0),
  preparationTime: String(product.preparationTime ?? 15),
  spiceLevel: product.spiceLevel || "",
  sizes:
    Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes.map((size) => ({
          label: size.label || "",
          priceModifier: String(size.priceModifier ?? 0),
          isDefault: Boolean(size.isDefault),
        }))
      : [createAdminSize()],
  addons:
    Array.isArray(product.addons) && product.addons.length > 0
      ? product.addons.map((addon) => ({
          label: addon.label || "",
          price: String(addon.price ?? 0),
          maxQuantity: String(addon.maxQuantity ?? 1),
          isAvailable: addon.isAvailable !== false,
        }))
      : [createAdminAddon()],
  comboItemsText: Array.isArray(product.comboItems)
    ? product.comboItems.join("\n")
    : "",
  badgesText: Array.isArray(product.badges) ? product.badges.join(", ") : "",
  highlightsText: Array.isArray(product.highlights)
    ? product.highlights.join("\n")
    : "",
  isAvailable: product.isAvailable !== false,
  isActive: product.isActive !== false,
  isBestSeller: Boolean(product.isBestSeller),
  isNew: Boolean(product.isNew),
  existingImages: Array.isArray(product.images) ? product.images : [],
  imageFiles: [],
});

export const buildAdminProductPayload = (formState = {}) => {
  const payload = new FormData();

  payload.append("name", String(formState.name || "").trim());
  payload.append("slug", String(formState.slug || "").trim());
  payload.append("category", String(formState.category || "").trim());
  payload.append("itemType", String(formState.itemType || "single").trim());
  payload.append("description", String(formState.description || "").trim());
  payload.append("price", String(toNumber(formState.price, 0)));
  payload.append(
    "discountPrice",
    formState.discountPrice === ""
      ? ""
      : String(toNumber(formState.discountPrice, 0))
  );
  payload.append("stock", String(Math.max(0, toNumber(formState.stock, 0))));
  payload.append(
    "soldCount",
    String(Math.max(0, toNumber(formState.soldCount, 0)))
  );
  payload.append(
    "preparationTime",
    String(Math.max(0, toNumber(formState.preparationTime, 15)))
  );
  payload.append("spiceLevel", String(formState.spiceLevel || ""));
  payload.append("sizes", JSON.stringify(sanitizeSizes(formState.sizes)));
  payload.append("addons", JSON.stringify(sanitizeAddons(formState.addons)));
  payload.append(
    "comboItems",
    JSON.stringify(splitTextLines(formState.comboItemsText))
  );
  payload.append("badges", JSON.stringify(splitTags(formState.badgesText)));
  payload.append(
    "highlights",
    JSON.stringify(splitTextLines(formState.highlightsText))
  );
  payload.append("isAvailable", String(formState.isAvailable !== false));
  payload.append("isActive", String(formState.isActive !== false));
  payload.append("isBestSeller", String(Boolean(formState.isBestSeller)));
  payload.append("isNew", String(Boolean(formState.isNew)));

  (Array.isArray(formState.imageFiles) ? formState.imageFiles : []).forEach((file) => {
    payload.append("images", file);
  });

  return payload;
};

export const describeVoucherScope = (voucher = {}) => {
  const productCount = voucher.products?.length || 0;
  const categoryCount = voucher.categories?.length || 0;

  if (
    voucher.appliesToAllProducts ||
    (productCount === 0 && categoryCount === 0)
  ) {
    return "Toan bo menu";
  }

  return `${productCount} mon | ${categoryCount} danh muc`;
};

export const formatAdminVoucherValue = (voucher = {}) => {
  if (voucher.discountType === "free_shipping") {
    return "Free ship";
  }

  if (voucher.discountType === "percent") {
    return `${voucher.discountValue}%`;
  }

  return currencyFormatter.format(Number(voucher.discountValue || 0));
};

export const formatPriceAdmin = (price = 0) =>
  currencyFormatter.format(Number(price || 0));

export const formatShortId = (value = "") => {
  const normalized = String(value || "").trim();
  return normalized ? normalized.slice(-8).toUpperCase() : "--";
};

export const formatDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString("vi-VN", {
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStatusColor = (status) =>
  statusMeta[status]?.className ||
  "border border-slate-200 bg-slate-100 text-slate-700";

export const getStatusLabel = (status) =>
  statusMeta[status]?.label || String(status || "--");

export const getFulfillmentColor = (type) =>
  fulfillmentMeta[type]?.className ||
  "border border-slate-200 bg-slate-100 text-slate-700";

export const getFulfillmentLabel = (type) =>
  fulfillmentMeta[type]?.label || String(type || "--");

export const getPaymentLabel = (method) =>
  paymentMeta[method] || String(method || "--");
