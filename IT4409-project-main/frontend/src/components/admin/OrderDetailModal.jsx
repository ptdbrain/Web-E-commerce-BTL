import React from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  CreditCard,
  MapPin,
  ReceiptText,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import {
  formatDateTime,
  formatPriceAdmin,
  formatShortId,
  getFulfillmentColor,
  getFulfillmentLabel,
  getPaymentLabel,
  getStatusColor,
  getStatusLabel,
} from "./utils";

const getFulfillmentDetail = (order) => {
  if (order.fulfillmentType === "pickup") {
    return order.pickupTime
      ? `Gio lay mon: ${formatDateTime(order.pickupTime)}`
      : "Khach tu den lay";
  }

  if (order.fulfillmentType === "dine_in") {
    const guestCount = order.tableBooking?.guestCount || 0;
    const bookingTime = order.tableBooking?.bookingTime
      ? formatDateTime(order.tableBooking.bookingTime)
      : "--";
    return `${guestCount} khach • ${bookingTime}`;
  }

  return order.shippingAddress || "Chua co dia chi giao hang";
};

export const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  const subtotal =
    order.originalTotalPrice ??
    (Array.isArray(order.items)
      ? order.items.reduce(
          (sum, item) =>
            sum +
            (item.lineTotal ||
              Math.max(1, Number(item.quantity || 1)) *
                Number(item.unitPrice || item.price || 0)),
          0
        )
      : 0);
  const deliveryFee = Number(order.deliveryFee || 0);
  const discountAmount = Number(order.discountAmount || 0);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/10 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_45%,#f8fafc_100%)] px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Order #{formatShortId(order._id)}
              </div>
              <h3 className="mt-3 font-display text-2xl font-black tracking-tight text-slate-950">
                Chi tiet don hang
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.orderStatus)}`}
                >
                  {getStatusLabel(order.orderStatus)}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getFulfillmentColor(order.fulfillmentType)}`}
                >
                  {getFulfillmentLabel(order.fulfillmentType)}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                  {getPaymentLabel(order.paymentMethod)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-right text-white">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Tong thanh toan
                </div>
                <div className="mt-1 font-display text-2xl font-black">
                  {formatPriceAdmin(order.totalPrice)}
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 overflow-y-auto p-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="grid gap-4 md:grid-cols-2">
              <article className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Users size={16} className="text-orange-500" />
                  Khach hang
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="font-semibold text-slate-900">{order.customerName}</div>
                  <div>{order.customerPhone || "--"}</div>
                  <div>{order.customerEmail || "Khong co email"}</div>
                </div>
              </article>

              <article className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <MapPin size={16} className="text-orange-500" />
                  Hinh thuc nhan mon
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="font-semibold text-slate-900">
                    {getFulfillmentLabel(order.fulfillmentType)}
                  </div>
                  <div>{getFulfillmentDetail(order)}</div>
                  {order.tableBooking?.contactNote ? (
                    <div>Ghi chu: {order.tableBooking.contactNote}</div>
                  ) : null}
                </div>
              </article>
            </section>

            <section className="rounded-[24px] border border-slate-100 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 text-sm font-semibold text-slate-900">
                <UtensilsCrossed size={16} className="text-orange-500" />
                Mon trong don
              </div>
              <div className="space-y-4 p-5">
                {(order.items || []).map((item, index) => {
                  const addons = Array.isArray(item.selectedAddons)
                    ? item.selectedAddons.filter((addon) => addon?.label)
                    : [];
                  const itemTotal =
                    item.lineTotal ||
                    Math.max(1, Number(item.quantity || 1)) *
                      Number(item.unitPrice || item.price || 0);

                  return (
                    <article
                      key={item._id || `${item.productId || "item"}-${index}`}
                      className="flex flex-col gap-4 rounded-[22px] border border-slate-100 bg-slate-50/70 p-4 md:flex-row"
                    >
                      <div className="h-24 w-full overflow-hidden rounded-2xl bg-slate-200 md:w-24">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            FireBite
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="font-semibold text-slate-950">
                              {item.productName || "Menu item"}
                            </div>
                            <div className="mt-1 text-sm text-slate-500">
                              So luong: {item.quantity || 1}
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-slate-900">
                            {formatPriceAdmin(itemTotal)}
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          {item.selectedSize?.label ? (
                            <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 font-semibold text-orange-700">
                              Size {item.selectedSize.label}
                              {item.selectedSize.priceModifier
                                ? ` (+${formatPriceAdmin(item.selectedSize.priceModifier)})`
                                : ""}
                            </span>
                          ) : null}
                          {addons.map((addon, addonIndex) => (
                            <span
                              key={`${addon.label}-${addonIndex}`}
                              className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-600"
                            >
                              {addon.label}
                              {addon.quantity > 1 ? ` x${addon.quantity}` : ""}
                            </span>
                          ))}
                        </div>

                        {item.itemNote ? (
                          <div className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                            Ghi chu: {item.itemNote}
                          </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="space-y-4">
            <article className="rounded-[24px] border border-slate-100 bg-white p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <CalendarClock size={16} className="text-orange-500" />
                Moc thoi gian
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Tao don
                  </div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {formatDateTime(order.createdAt)}
                  </div>
                </div>
                {order.pickupTime ? (
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Gio pickup
                    </div>
                    <div className="mt-1 font-semibold text-slate-900">
                      {formatDateTime(order.pickupTime)}
                    </div>
                  </div>
                ) : null}
                {order.tableBooking?.bookingTime ? (
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Gio dat ban
                    </div>
                    <div className="mt-1 font-semibold text-slate-900">
                      {formatDateTime(order.tableBooking.bookingTime)}
                    </div>
                  </div>
                ) : null}
              </div>
            </article>

            <article className="rounded-[24px] border border-slate-100 bg-white p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <ReceiptText size={16} className="text-orange-500" />
                Thanh toan
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Tam tinh</span>
                  <span className="font-semibold text-slate-900">
                    {formatPriceAdmin(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Phi giao hang</span>
                  <span className="font-semibold text-slate-900">
                    {formatPriceAdmin(deliveryFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Giam gia</span>
                  <span className="font-semibold text-emerald-600">
                    -{formatPriceAdmin(discountAmount)}
                  </span>
                </div>
                {order.voucherCode ? (
                  <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-700">
                    Voucher: <span className="font-semibold">{order.voucherCode}</span>
                  </div>
                ) : null}
                <div className="rounded-2xl bg-slate-950 px-4 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Tong cong</span>
                    <span className="font-display text-2xl font-black">
                      {formatPriceAdmin(order.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-[24px] border border-slate-100 bg-white p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <CreditCard size={16} className="text-orange-500" />
                Ghi chu admin
              </div>
              <div className="mt-4 text-sm leading-6 text-slate-500">
                {order.note || "Khach khong de lai ghi chu them cho don hang nay."}
              </div>
            </article>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetailModal;
