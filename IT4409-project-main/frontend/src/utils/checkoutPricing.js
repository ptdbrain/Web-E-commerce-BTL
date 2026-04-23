import { calculateConfiguredUnitPrice } from "./cartItem.js";

export const DEFAULT_DELIVERY_FEE = 30000;

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const getCheckoutItemUnitPrice = (item = {}) =>
  toNumber(item.configuredUnitPrice, NaN) ||
  toNumber(item.unitPrice, NaN) ||
  calculateConfiguredUnitPrice(item);

export const calculateCheckoutTotals = ({
  items = [],
  fulfillmentType = "delivery",
  voucherResult = null,
} = {}) => {
  const subtotal = (Array.isArray(items) ? items : []).reduce((sum, item) => {
    const unitPrice = getCheckoutItemUnitPrice(item);
    const quantity = Math.max(1, toNumber(item.quantity, 1));
    return sum + unitPrice * quantity;
  }, 0);

  const deliveryFee =
    fulfillmentType === "delivery" && subtotal > 0 ? DEFAULT_DELIVERY_FEE : 0;
  const itemDiscount = toNumber(voucherResult?.itemDiscount, 0);
  const shippingDiscount = toNumber(voucherResult?.shippingDiscount, 0);
  const discountAmount = toNumber(
    voucherResult?.discountAmount,
    itemDiscount + shippingDiscount
  );
  const total = toNumber(
    voucherResult?.finalTotal,
    Math.max(subtotal + deliveryFee - discountAmount, 0)
  );

  return {
    subtotal,
    deliveryFee,
    itemDiscount,
    shippingDiscount,
    discountAmount,
    total,
  };
};
