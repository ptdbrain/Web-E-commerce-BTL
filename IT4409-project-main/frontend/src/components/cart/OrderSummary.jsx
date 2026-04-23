import React from "react";

import { calculateCheckoutTotals } from "../../utils/checkoutPricing.js";

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export function OrderSummary({ cartItems, voucherResult, fulfillmentType }) {
  const totals = calculateCheckoutTotals({
    items: cartItems,
    fulfillmentType,
    voucherResult,
  });

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
      <h3 className="font-display text-xl font-bold text-slate-900">
        Xac nhan don mon
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
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-slate-800">
                {item.name}
              </div>
              <div className="mt-0.5 text-[11px] text-slate-400">
                SL: {item.quantity}
                {item.selectedSize?.label && ` | Size: ${item.selectedSize.label}`}
              </div>
              {item.selectedAddons?.length > 0 && (
                <div className="mt-0.5 text-[11px] text-slate-400">
                  Topping: {item.selectedAddons.map((addon) => addon.label).join(", ")}
                </div>
              )}
              {item.itemNote && (
                <div className="mt-0.5 text-[11px] text-orange-500">
                  Note: {item.itemNote}
                </div>
              )}
            </div>
            <div className="shrink-0 text-sm font-bold text-slate-700">
              {formatPrice(
                (item.configuredUnitPrice || item.unitPrice || item.newPrice) *
                  item.quantity
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2.5 border-t border-slate-100 pt-4">
        <div className="flex justify-between text-sm text-slate-500">
          <span>Tam tinh</span>
          <span>{formatPrice(totals.subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm text-slate-500">
          <span>
            {fulfillmentType === "delivery" ? "Phi giao hang" : "Phi phuc vu"}
          </span>
          <span>
            {totals.deliveryFee > 0 ? formatPrice(totals.deliveryFee) : "Mien phi"}
          </span>
        </div>

        {totals.itemDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-emerald-600">Giam tren mon</span>
            <span className="font-semibold text-emerald-600">
              -{formatPrice(totals.itemDiscount)}
            </span>
          </div>
        )}

        {totals.shippingDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-emerald-600">Giam phi ship</span>
            <span className="font-semibold text-emerald-600">
              -{formatPrice(totals.shippingDiscount)}
            </span>
          </div>
        )}

        <div className="flex justify-between border-t border-dashed border-slate-200 pt-3">
          <span className="text-base font-bold text-slate-800">Tong tien</span>
          <span className="font-display text-xl font-extrabold text-gradient">
            {formatPrice(totals.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
