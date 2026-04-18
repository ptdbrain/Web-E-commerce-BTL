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
