import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiChevronDown,
  FiChevronUp,
  FiCreditCard,
  FiDollarSign,
} from "react-icons/fi";

import { CheckoutForm } from "../components/cart/CheckOutForm.jsx";
import { OrderSummary } from "../components/cart/OrderSummary.jsx";
import SEO from "../components/common/SEO";
import { buildApiUrl } from "../config/api.js";
import { storeConfig } from "../data/menuData.js";
import { useCart } from "../hooks/useCart";
import { buildVoucherItemPayload } from "../utils/cartPayload.js";
import { calculateCheckoutTotals } from "../utils/checkoutPricing.js";

const formatVoucherValue = (voucher = {}) => {
  if (voucher.discountType === "free_shipping") {
    return "Free ship";
  }

  if (voucher.discountType === "percent") {
    return `-${voucher.discountValue}%`;
  }

  return `-${Number(voucher.discountValue || 0).toLocaleString("vi-VN")}d`;
};

export default function CheckoutPage() {
  const {
    cartItems,
    selectedItemIds,
    directCheckoutItems,
    formData,
    setFormData,
    orderSuccess,
    handlePlaceOrder,
    paymentMethod,
    setPaymentMethod,
    voucherCode,
    setVoucherCode,
    voucherResult,
    setVoucherResult,
  } = useCart();

  const navigate = useNavigate();
  const [voucherError, setVoucherError] = useState("");
  const [applying, setApplying] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [showVoucherList, setShowVoucherList] = useState(false);

  const selectedItems = useMemo(
    () =>
      Array.isArray(directCheckoutItems) && directCheckoutItems.length > 0
        ? directCheckoutItems
        : cartItems.filter((item) => selectedItemIds.includes(item.cartKey)),
    [cartItems, directCheckoutItems, selectedItemIds]
  );

  const selectedItemsSignature = useMemo(
    () =>
      selectedItems
        .map(
          (item) =>
            `${item.cartKey || item.id}:${item.quantity}:${item.configuredUnitPrice || item.newPrice}`
        )
        .join("|"),
    [selectedItems]
  );

  const totals = useMemo(
    () =>
      calculateCheckoutTotals({
        items: selectedItems,
        fulfillmentType: formData.fulfillmentType,
        voucherResult,
      }),
    [formData.fulfillmentType, selectedItems, voucherResult]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(buildApiUrl("/vouchers/available"), {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAvailableVouchers(response.data?.vouchers || []);
      })
      .catch(() => {
        setAvailableVouchers([]);
      });
  }, []);

  useEffect(() => {
    setVoucherError("");
    setVoucherResult(null);
  }, [formData.fulfillmentType, selectedItemsSignature, setVoucherResult]);

  const handleApplyVoucher = async (codeParam) => {
    setVoucherError("");
    const code = String(codeParam ?? voucherCode).trim().toUpperCase();

    if (!code) {
      setVoucherError("Vui long nhap ma voucher.");
      return;
    }

    if (selectedItems.length === 0) {
      setVoucherError("Chua co mon nao duoc chon.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setVoucherError("Ban can dang nhap de dung voucher.");
      return;
    }

    try {
      setApplying(true);
      const response = await axios.post(
        buildApiUrl("/vouchers/apply"),
        {
          code,
          items: selectedItems.map(buildVoucherItemPayload),
          orderTotal: totals.subtotal,
          deliveryFee: totals.deliveryFee,
          fulfillmentType: formData.fulfillmentType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setVoucherCode(code);
      setVoucherResult(response.data || null);
    } catch (error) {
      setVoucherResult(null);
      setVoucherError(
        error?.response?.data?.message || "Ap dung voucher that bai."
      );
    } finally {
      setApplying(false);
    }
  };

  const paymentOptions = [
    { value: "cash", label: "Tien mat khi nhan mon", icon: FiDollarSign },
    { value: "zalopay", label: "ZaloPay", icon: FiCreditCard },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-slate-50 px-4 py-8">
      <SEO
        title="Checkout dat mon"
        description={`Hoan tat don mon tai ${storeConfig.name}`}
      />

      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-orange-600"
            >
              <FiArrowLeft size={14} />
              Quay lai
            </button>
            <h2 className="font-display text-3xl font-extrabold text-slate-900">
              Xac nhan dat mon
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Delivery, pickup va dine-in trong cung mot form.
            </p>
          </div>
        </div>

        {orderSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-10 text-center"
          >
            <div className="mb-4 text-6xl">Done</div>
            <h3 className="font-display text-3xl font-extrabold text-emerald-700">
              Dat mon thanh cong
            </h3>
            <p className="mt-3 text-emerald-600">
              Cam on ban da dat mon tai {storeConfig.name}.
            </p>
            <button
              onClick={() => navigate("/orders")}
              className="mt-6 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-emerald-700"
            >
              Xem don hang
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handlePlaceOrder}>
            <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <CheckoutForm formData={formData} setFormData={setFormData} />
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
                  <h3 className="mb-3 font-display text-base font-bold text-slate-900">
                    Phuong thuc thanh toan
                  </h3>
                  <div className="space-y-2">
                    {paymentOptions.map((option) => {
                      const Icon = option.icon;
                      const isActive = paymentMethod === option.value;

                      return (
                        <label
                          key={option.value}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3.5 transition-all duration-200 ${
                            isActive
                              ? "border-orange-500 bg-orange-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={option.value}
                            checked={isActive}
                            onChange={() => setPaymentMethod(option.value)}
                            className="sr-only"
                          />
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              isActive
                                ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            <Icon size={15} />
                          </div>
                          <span
                            className={`text-sm font-semibold ${
                              isActive ? "text-orange-700" : "text-slate-600"
                            }`}
                          >
                            {option.label}
                          </span>
                          {isActive && (
                            <div className="ml-auto h-2.5 w-2.5 rounded-full bg-orange-500" />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
                  <h3 className="mb-3 font-display text-base font-bold text-slate-900">
                    Ma voucher
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(event) =>
                        setVoucherCode(event.target.value.toUpperCase())
                      }
                      placeholder="Nhap ma voucher"
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyVoucher()}
                      disabled={applying}
                      className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-shadow hover:shadow-md disabled:opacity-60"
                    >
                      {applying ? "Dang xu ly" : "Ap dung"}
                    </button>
                  </div>

                  {voucherError && (
                    <p className="mt-2 text-xs text-red-500">{voucherError}</p>
                  )}

                  {voucherResult?.voucher && (
                    <p className="mt-2 text-xs font-semibold text-emerald-600">
                      Da ap dung voucher {voucherResult.voucher.code}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowVoucherList((prev) => !prev)}
                    className="mt-3 flex items-center gap-1 text-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
                  >
                    {showVoucherList ? "An voucher kha dung" : "Xem voucher kha dung"}
                    {showVoucherList ? (
                      <FiChevronUp size={14} />
                    ) : (
                      <FiChevronDown size={14} />
                    )}
                  </button>

                  {showVoucherList && (
                    <div className="mt-3 space-y-2 animate-fade-in-down">
                      {availableVouchers.length === 0 ? (
                        <p className="text-sm text-slate-400">
                          Hien chua co voucher kha dung.
                        </p>
                      ) : (
                        availableVouchers.map((voucher) => (
                          <button
                            key={voucher.id}
                            type="button"
                            onClick={() => {
                              setVoucherCode(voucher.code);
                              handleApplyVoucher(voucher.code);
                            }}
                            className="flex w-full items-center justify-between rounded-xl border border-dashed border-orange-200 bg-orange-50/50 px-4 py-3 text-left text-sm transition-all hover:border-orange-300 hover:bg-orange-50"
                          >
                            <div>
                              <div className="font-bold text-slate-800">
                                {voucher.code}
                              </div>
                              {voucher.description && (
                                <div className="mt-0.5 text-xs text-slate-400">
                                  {voucher.description}
                                </div>
                              )}
                              {voucher.minOrderValue > 0 && (
                                <div className="mt-1 text-[11px] text-slate-500">
                                  Don tu{" "}
                                  {Number(voucher.minOrderValue).toLocaleString(
                                    "vi-VN"
                                  )}
                                  d
                                </div>
                              )}
                            </div>
                            <div className="font-bold text-orange-600">
                              {formatVoucherValue(voucher)}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <OrderSummary
                  cartItems={selectedItems}
                  voucherResult={voucherResult}
                  fulfillmentType={formData.fulfillmentType}
                />

                <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Tong tam tinh</span>
                    <span className="font-semibold text-slate-900">
                      {totals.total.toLocaleString("vi-VN")}d
                    </span>
                  </div>
                  {voucherResult?.discountAmount > 0 && (
                    <div className="mt-2 text-xs text-emerald-600">
                      Da giam {voucherResult.discountAmount.toLocaleString("vi-VN")}d
                      {voucherResult.shippingDiscount > 0 ? " bao gom free ship" : ""}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:scale-[1.01] hover:shadow-xl hover:shadow-orange-500/30 active:scale-[0.99]"
                >
                  Xac nhan dat mon
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
