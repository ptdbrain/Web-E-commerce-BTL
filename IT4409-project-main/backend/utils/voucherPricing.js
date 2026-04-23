const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeDate = (value) => {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toIdSet = (items = []) => new Set(items.map((item) => String(item)));

const normalizePricingItems = (items = []) =>
  (Array.isArray(items) ? items : []).map((item) => {
    const quantity = Math.max(1, toNumber(item.quantity, 1));
    const unitPrice = toNumber(
      item.unitPrice ?? item.newPrice ?? item.price,
      0
    );
    const lineTotal = toNumber(item.lineTotal, unitPrice * quantity);

    return {
      productId: String(item.productId || item.id || ""),
      categoryId: String(item.categoryId || item.categorySlug || ""),
      quantity,
      unitPrice,
      lineTotal,
    };
  });

export const calculateVoucherPricing = ({
  voucher,
  userId,
  items,
  orderTotal,
  deliveryFee = 0,
  fulfillmentType = "delivery",
  nowDate = new Date(),
}) => {
  if (!userId) {
    return { errorMessage: "Ban can dang nhap." };
  }

  if (!voucher || !voucher.isActive) {
    return { errorMessage: "Voucher khong ton tai hoac da bi vo hieu." };
  }

  if (voucher.maxUsage && voucher.maxUsage > 0 && voucher.usedCount >= voucher.maxUsage) {
    return { errorMessage: "Voucher da het luot su dung." };
  }

  const startDate = normalizeDate(voucher.startDate);
  const endDate = normalizeDate(voucher.endDate);
  const effectiveNow = normalizeDate(nowDate) || new Date();

  if (startDate && startDate > effectiveNow) {
    return { errorMessage: "Voucher chua bat dau hieu luc." };
  }

  if (endDate && endDate < effectiveNow) {
    return { errorMessage: "Voucher da het han." };
  }

  if (!voucher.appliesToAllUsers) {
    const allowedUsers = toIdSet(voucher.users || []);
    if (!allowedUsers.has(String(userId))) {
      return { errorMessage: "Ban khong duoc su dung voucher nay." };
    }
  }

  const normalizedItems = normalizePricingItems(items);
  const subtotal = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const normalizedDeliveryFee = Math.max(0, toNumber(deliveryFee, 0));
  const totalOrder =
    typeof orderTotal === "number"
      ? orderTotal
      : subtotal + normalizedDeliveryFee;

  if (voucher.minOrderValue && totalOrder < voucher.minOrderValue) {
    return {
      errorMessage: `Don hang can toi thieu ${voucher.minOrderValue.toLocaleString(
        "vi-VN"
      )}d de dung voucher nay.`,
    };
  }

  const eligibleProducts = toIdSet(voucher.products || []);
  const eligibleCategories = toIdSet(voucher.categories || []);
  const scopeAll =
    voucher.appliesToAllProducts ||
    (eligibleProducts.size === 0 && eligibleCategories.size === 0);

  const itemResults = normalizedItems.map((item) => {
    const eligible =
      scopeAll ||
      eligibleProducts.has(item.productId) ||
      eligibleCategories.has(item.categoryId);

    return {
      productId: item.productId,
      categoryId: item.categoryId,
      eligible,
      lineTotal: item.lineTotal,
    };
  });

  const eligibleSubtotal = itemResults
    .filter((item) => item.eligible)
    .reduce((sum, item) => sum + item.lineTotal, 0);

  if (!scopeAll && eligibleSubtotal <= 0) {
    return {
      errorMessage: "Khong co mon nao trong don hang duoc ap dung voucher.",
      itemResults,
      voucher,
      eligibleSubtotal: 0,
      itemDiscount: 0,
      shippingDiscount: 0,
      discountAmount: 0,
      finalTotal: totalOrder,
      subtotal,
      totalOrder,
    };
  }

  let itemDiscount = 0;
  let shippingDiscount = 0;

  if (voucher.discountType === "free_shipping") {
    if (fulfillmentType !== "delivery") {
      return {
        errorMessage: "Voucher chi ap dung cho don giao hang.",
        itemResults,
        voucher,
        eligibleSubtotal,
        itemDiscount: 0,
        shippingDiscount: 0,
        discountAmount: 0,
        finalTotal: totalOrder,
        subtotal,
        totalOrder,
      };
    }

    shippingDiscount = normalizedDeliveryFee;
  } else {
    if (eligibleSubtotal <= 0) {
      return {
        errorMessage: "Khong co mon nao trong don hang duoc ap dung voucher.",
        itemResults,
        voucher,
        eligibleSubtotal: 0,
        itemDiscount: 0,
        shippingDiscount: 0,
        discountAmount: 0,
        finalTotal: totalOrder,
        subtotal,
        totalOrder,
      };
    }

    if (voucher.discountType === "percent") {
      itemDiscount = (toNumber(voucher.discountValue, 0) / 100) * eligibleSubtotal;
      if (voucher.maxDiscountAmount && voucher.maxDiscountAmount > 0) {
        itemDiscount = Math.min(itemDiscount, voucher.maxDiscountAmount);
      }
    } else if (voucher.discountType === "amount") {
      itemDiscount = toNumber(voucher.discountValue, 0);
    }

    itemDiscount = Math.min(itemDiscount, eligibleSubtotal);
  }

  const discountAmount = itemDiscount + shippingDiscount;
  const finalTotal = Math.max(totalOrder - discountAmount, 0);

  return {
    voucher,
    itemResults,
    eligibleSubtotal,
    itemDiscount,
    shippingDiscount,
    discountAmount,
    finalTotal,
    subtotal,
    totalOrder,
  };
};

export default {
  calculateVoucherPricing,
};
