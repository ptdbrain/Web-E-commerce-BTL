import React from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiClock, FiMapPin, FiPackage, FiPhone, FiX } from "react-icons/fi";
import { buildApiUrl } from "../../config/api";

const formatPrice = (value = 0) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value || 0));

const statusLabelMap = {
  waiting_for_payment: "Chờ thanh toán",
  pending: "Chờ xử lý",
  paid: "Đã thanh toán",
  confirmed: "Hoàn tất",
  shipping: "Đang phục vụ",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn tiền",
};

const fulfillmentLabelMap = {
  delivery: "Giao hàng",
  pickup: "Tự đến lấy",
  dine_in: "Đặt bàn",
};

const formatDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN", {
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getFulfillmentDetail = (order) => {
  if (order.fulfillmentType === "pickup") {
    return order.pickupTime
      ? `Lấy món lúc ${formatDateTime(order.pickupTime)}`
      : "Khách tự đến lấy tại quầy";
  }

  if (order.fulfillmentType === "dine_in") {
    return `${order.tableBooking?.guestCount || 0} khách • ${formatDateTime(
      order.tableBooking?.bookingTime
    )}`;
  }

  return order.shippingAddress || "Chưa có địa chỉ giao hàng";
};

export default function OrderDetailPopup({ order, onClose, onCancel }) {
  const handleCancelOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        buildApiUrl(`/orders/${order._id}/cancel`),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onCancel(order._id);
    } catch (err) {
      console.error("Không thể hủy đơn hàng:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_50%,#f8fafc_100%)] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-700">
                Order #{String(order._id || "").slice(-8).toUpperCase()}
              </div>
              <h2 className="mt-3 font-display text-2xl font-black text-slate-950">
                Chi tiết đơn hàng
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {statusLabelMap[order.orderStatus] || order.orderStatus} •{" "}
                {fulfillmentLabelMap[order.fulfillmentType] || order.fulfillmentType}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <FiPhone className="text-orange-500" />
                  Khách hàng
                </div>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <div className="font-semibold text-slate-900">
                    {order.customerName}
                  </div>
                  <div>{order.customerPhone}</div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-100 bg-slate-50/80 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <FiMapPin className="text-orange-500" />
                  Nhận món
                </div>
                <div className="mt-3 text-sm leading-6 text-slate-600">
                  {getFulfillmentDetail(order)}
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-100 bg-white">
              <div className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-slate-900">
                Món đã đặt
              </div>
              <div className="space-y-3 p-5">
                {(order.items || []).map((item, index) => {
                  const itemTotal =
                    item.lineTotal ||
                    Math.max(1, Number(item.quantity || 1)) *
                      Number(item.unitPrice || item.price || 0);

                  return (
                    <div
                      key={item._id || `${item.productId || "item"}-${index}`}
                      className="flex gap-4 rounded-[22px] border border-slate-100 bg-slate-50/70 p-4"
                    >
                      <div className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-200">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            FireBite
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-slate-950">
                              {item.productName}
                            </div>
                            <div className="mt-1 text-sm text-slate-500">
                              Số lượng: {item.quantity}
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-slate-900">
                            {formatPrice(itemTotal)}
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          {item.selectedSize?.label ? (
                            <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 font-semibold text-orange-700">
                              Size {item.selectedSize.label}
                            </span>
                          ) : null}
                          {(item.selectedAddons || []).map((addon, addonIndex) => (
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
                            Ghi chú: {item.itemNote}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-100 bg-white p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <FiClock className="text-orange-500" />
                Thời gian và thanh toán
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Tạo đơn
                  </div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {formatDateTime(order.createdAt)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Thanh toán
                  </div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {order.paymentMethod === "zalopay" ? "ZaloPay" : "Tiền mặt"}
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-950 px-4 py-4 text-white">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Tổng cộng
                  </div>
                  <div className="mt-1 font-display text-2xl font-black">
                    {formatPrice(order.totalPrice)}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-100 bg-white p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <FiPackage className="text-orange-500" />
                Ghi chú đơn hàng
              </div>
              <div className="mt-4 text-sm leading-6 text-slate-500">
                {order.note || "Không có ghi chú thêm cho đơn này."}
              </div>
            </div>

            {order.orderStatus !== "cancelled" && order.orderStatus !== "confirmed" && (
              <button
                type="button"
                onClick={handleCancelOrder}
                className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100"
              >
                Hủy đơn hàng
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
