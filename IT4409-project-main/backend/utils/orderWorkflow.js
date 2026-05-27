const DELIVERY_TYPES = new Set(["delivery"]);
const TERMINAL_STATUSES = new Set(["confirmed", "cancelled", "refunded"]);

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

  if (nextStatus === "preparing") return "Nhận đơn";
  if (nextStatus === "ready") return "Sẵn sàng giao món";
  if (nextStatus === "shipping") return "Chuyển giao hàng";
  if (nextStatus === "confirmed") return "Hoàn tất đơn";

  return "";
};
