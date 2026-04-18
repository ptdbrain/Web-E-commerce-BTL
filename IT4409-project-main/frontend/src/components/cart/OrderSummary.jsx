import React from "react";

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export function OrderSummary({ cartItems, voucherResult, fulfillmentType }) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.configuredUnitPrice || item.newPrice) * item.quantity,
    0
  );
  const deliveryFee = fulfillmentType === "delivery" && subtotal > 0 ? 30000 : 0;
  const discountAmount = voucherResult?.discountAmount || 0;
  const total = Math.max(subtotal - discountAmount, 0) + deliveryFee;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
      <h3 className="font-display text-xl font-bold text-slate-900">
        Xác nhận đơn món
      </h3>

      <div className="mt-5 space-y-3">
        {cartItems.map((item) => (
          <div
            key={item.cartKey || item.id}
            className="flex gap-3 rounded-xl bg-slate-50/70 p-3"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-16 w-16 shrink-0 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-800 truncate">
                {item.name}
              </div>
              <div className="mt-0.5 text-[11px] text-slate-400">
                SL: {item.quantity}
                {item.selectedSize?.label && ` • Size: ${item.selectedSize.label}`}
              </div>
              {item.selectedAddons?.length > 0 && (
                <div className="mt-0.5 text-[11px] text-slate-400">
                  Topping: {item.selectedAddons.map((addon) => addon.label).join(", ")}
                </div>
              )}
              {item.itemNote && (
                <div className="mt-0.5 text-[11px] text-orange-500">
                  📝 {item.itemNote}
                </div>
              )}
            </div>
            <div className="shrink-0 text-sm font-bold text-slate-700">
              {formatPrice((item.configuredUnitPrice || item.newPrice) * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <div className="mt-6 space-y-2.5 border-t border-slate-100 pt-4">
        <div className="flex justify-between text-sm text-slate-500">
          <span>Tạm tính</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-emerald-600">🎟️ Giảm giá voucher</span>
            <span className="font-semibold text-emerald-600">
              -{formatPrice(discountAmount)}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm text-slate-500">
          <span>
            {fulfillmentType === "delivery" ? "Phí giao hàng" : "Phí phục vụ"}
          </span>
          <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : "Miễn phí"}</span>
        </div>
        <div className="flex justify-between border-t border-dashed border-slate-200 pt-3">
          <span className="text-base font-bold text-slate-800">Tổng tiền</span>
          <span className="text-xl font-extrabold text-gradient font-display">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
