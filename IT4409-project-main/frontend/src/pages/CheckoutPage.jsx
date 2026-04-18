import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiChevronDown, FiChevronUp, FiCreditCard, FiDollarSign } from "react-icons/fi";
import { CheckoutForm } from "../components/cart/CheckOutForm.jsx";
import { OrderSummary } from "../components/cart/OrderSummary.jsx";
import SEO from "../components/common/SEO";
import { buildApiUrl } from "../config/api";
import { storeConfig } from "../data/menuData";
import { useCart } from "../hooks/useCart";

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

  const selectedItems =
    directCheckoutItems.length > 0
      ? directCheckoutItems
      : cartItems.filter((item) => selectedItemIds.includes(item.cartKey));

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

  const handleApplyVoucher = async (codeParam) => {
    setVoucherError("");
    const code = (codeParam ?? voucherCode).trim();

    if (!code) {
      setVoucherError("Vui lòng nhập mã voucher.");
      return;
    }

    if (selectedItems.length === 0) {
      setVoucherError("Chưa có món nào được chọn.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setVoucherError("Bạn cần đăng nhập để dùng voucher.");
      return;
    }

    try {
      setApplying(true);
      const orderTotal = selectedItems.reduce(
        (sum, item) => sum + item.configuredUnitPrice * item.quantity,
        0
      );

      const response = await axios.post(
        buildApiUrl("/vouchers/apply"),
        {
          code,
          items: selectedItems.map((item) => ({
            productId: item.id,
            newPrice: item.configuredUnitPrice,
            quantity: item.quantity,
          })),
          orderTotal,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setVoucherResult(response.data);
    } catch (error) {
      setVoucherResult(null);
      setVoucherError(
        error?.response?.data?.message || "Áp dụng voucher thất bại."
      );
    } finally {
      setApplying(false);
    }
  };

  const paymentOptions = [
    { value: "cash", label: "Tiền mặt khi nhận món", icon: FiDollarSign },
    { value: "zalopay", label: "ZaloPay", icon: FiCreditCard },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-slate-50 px-4 py-8">
      <SEO
        title="Checkout đặt món"
        description={`Hoàn tất đơn món tại ${storeConfig.name}`}
      />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-2 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors"
            >
              <FiArrowLeft size={14} />
              Quay lại
            </button>
            <h2 className="font-display text-3xl font-extrabold text-slate-900">
              Xác nhận đặt món
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Delivery, pickup và dine-in trong cùng một form.
            </p>
          </div>
        </div>

        {orderSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-10 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="font-display text-3xl font-extrabold text-emerald-700">
              Đặt món thành công!
            </h3>
            <p className="mt-3 text-emerald-600">
              Cảm ơn bạn đã đặt món tại {storeConfig.name}.
            </p>
            <button
              onClick={() => navigate("/orders")}
              className="mt-6 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
            >
              Xem đơn hàng →
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handlePlaceOrder}>
            <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              {/* Left column */}
              <div className="space-y-6">
                <CheckoutForm formData={formData} setFormData={setFormData} />
              </div>

              {/* Right column */}
              <div className="space-y-5">
                {/* Payment method */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
                  <h3 className="font-display text-base font-bold text-slate-900 mb-3">
                    Phương thức thanh toán
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

                {/* Voucher */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
                  <h3 className="font-display text-base font-bold text-slate-900 mb-3">
                    🎟️ Mã voucher
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(event) =>
                        setVoucherCode(event.target.value.toUpperCase())
                      }
                      placeholder="Nhập mã voucher"
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition-all focus:border-orange-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyVoucher()}
                      disabled={applying}
                      className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:shadow-md transition-shadow disabled:opacity-60"
                    >
                      {applying ? "Đang..." : "Áp dụng"}
                    </button>
                  </div>
                  {voucherError && (
                    <p className="mt-2 text-xs text-red-500">{voucherError}</p>
                  )}
                  {voucherResult?.voucher && (
                    <p className="mt-2 text-xs font-semibold text-emerald-600">
                      ✅ Đã áp dụng voucher {voucherResult.voucher.code}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowVoucherList((prev) => !prev)}
                    className="mt-3 flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    {showVoucherList ? "Ẩn voucher khả dụng" : "Xem voucher khả dụng"}
                    {showVoucherList ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                  </button>

                  {showVoucherList && (
                    <div className="mt-3 space-y-2 animate-fade-in-down">
                      {availableVouchers.length === 0 ? (
                        <p className="text-sm text-slate-400">
                          Hiện chưa có voucher khả dụng.
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
                            className="flex w-full items-center justify-between rounded-xl border border-dashed border-orange-200 bg-orange-50/50 px-4 py-3 text-left text-sm transition-all hover:bg-orange-50 hover:border-orange-300"
                          >
                            <div>
                              <div className="font-bold text-slate-800">
                                {voucher.code}
                              </div>
                              {voucher.description && (
                                <div className="text-xs text-slate-400 mt-0.5">
                                  {voucher.description}
                                </div>
                              )}
                            </div>
                            <div className="font-bold text-orange-600">
                              {voucher.discountType === "percent"
                                ? `-${voucher.discountValue}%`
                                : `-${voucher.discountValue?.toLocaleString?.("vi-VN") || voucher.discountValue}đ`}
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

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                >
                  Xác nhận đặt món →
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
