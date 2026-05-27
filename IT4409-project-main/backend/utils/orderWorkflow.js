const DELIVERY_TYPES = new Set(["delivery"]);
const TERMINAL_STATUSES = new Set(["confirmed", "cancelled", "refunded"]);
const CUSTOMER_CANCELABLE_STATUSES = new Set(["waiting_for_payment", "pending"]);
const HANDOFF_STATUSES_BY_FULFILLMENT = {
  delivery: new Set(["shipping"]),
  pickup: new Set(["ready"]),
  dine_in: new Set(["ready"]),
};

export const PAYMENT_EXPIRY_MINUTES = 15;

export const getAdminOrderAdvance = (status, fulfillmentType = "delivery") => {
  if (!status || status === "waiting_for_payment" || TERMINAL_STATUSES.has(status)) {
    return null;
  }

  if (status === "pending") return "preparing";

  if (status === "preparing") {
    return DELIVERY_TYPES.has(fulfillmentType) ? "shipping" : "ready";
  }

  if (status === "ready" || status === "shipping") {
    return "confirmed";
  }

  return null;
};

export const getAdminOrderActionLabel = (status, fulfillmentType = "delivery") => {
  const nextStatus = getAdminOrderAdvance(status, fulfillmentType);

  if (nextStatus === "preparing") return "Nhan don";
  if (nextStatus === "ready") return "San sang giao mon";
  if (nextStatus === "shipping") return "Chuyen giao hang";
  if (nextStatus === "confirmed") return "Hoan tat don";

  return "";
};

export const canCancelOrder = (status) => CUSTOMER_CANCELABLE_STATUSES.has(status);

export const canCompleteOrder = (status, fulfillmentType = "delivery") => {
  const allowed =
    HANDOFF_STATUSES_BY_FULFILLMENT[fulfillmentType] ||
    HANDOFF_STATUSES_BY_FULFILLMENT.delivery;
  return allowed.has(status);
};

export const canRequestRefund = (status, fulfillmentType = "delivery") =>
  canCompleteOrder(status, fulfillmentType);

export const isPaymentExpired = (
  order,
  now = new Date(),
  expiryMinutes = PAYMENT_EXPIRY_MINUTES
) => {
  if (!order) return false;
  if (order.orderStatus !== "waiting_for_payment" || order.paymentStatus !== "waiting") {
    return false;
  }

  const createdAt = order.createdAt ? new Date(order.createdAt) : null;
  const nowDate = now instanceof Date ? now : new Date(now);
  if (!createdAt || Number.isNaN(createdAt.getTime()) || Number.isNaN(nowDate.getTime())) {
    return false;
  }

  return nowDate.getTime() - createdAt.getTime() > expiryMinutes * 60 * 1000;
};
