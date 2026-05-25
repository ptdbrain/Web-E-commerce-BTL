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

  if (nextStatus === "preparing") return "Chuyen bep";
  if (nextStatus === "ready") return "San sang giao mon";
  if (nextStatus === "shipping") return "Chuyen giao hang";
  if (nextStatus === "confirmed") return "Hoan tat don";

  return "";
};
