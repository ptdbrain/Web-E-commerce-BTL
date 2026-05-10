import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../hooks/useCart";
import { CheckoutForm } from "../components/cart/CheckOutForm.jsx";
import { OrderSummary } from "../components/cart/OrderSummary.jsx";
import SEO from "../components/common/SEO";

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
  const [voucherListError, setVoucherListError] = useState("");
  const [loadingVoucherList, setLoadingVoucherList] = useState(false);
  const [showVoucherList, setShowVoucherList] = useState(false);

  // Nếu có danh sách Mua ngay thì ưu tiên dùng, nếu không thì dùng các sản phẩm đã chọn trong giỏ
  const selectedItems =
    directCheckoutItems && directCheckoutItems.length > 0
      ? directCheckoutItems
      : cartItems.filter((item) => selectedItemIds.includes(item.id));

  const handleBackToCart = () => {
    navigate(-1);
  };

  // Tự động tải danh sách voucher khả dụng cho tài khoản hiện tại
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchAvailable = async () => {
      try {
        setLoadingVoucherList(true);
        setVoucherListError("");
        const res = await axios.get(
          "https://it4409-deploy-backend.onrender.com/api/vouchers/available",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAvailableVouchers(res.data?.vouchers || []);
      } catch (err) {
        console.error("Failed to load available vouchers", err);
        setVoucherListError(
          err?.response?.data?.message ||
            "Không thể tải danh sách voucher của bạn."
        );
      } finally {
        setLoadingVoucherList(false);
      }
    };

    fetchAvailable();
  }, []);

  const handleApplyVoucher = async (codeParam) => {
    setVoucherError("");

    const code = (codeParam ?? voucherCode).trim();
    if (!code) {
      setVoucherError("Vui lòng nhập mã voucher.");
      return;
    }

    if (!selectedItems || selectedItems.length === 0) {
      setVoucherError("Không có sản phẩm nào được chọn để áp dụng voucher.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setVoucherError("Bạn cần đăng nhập để sử dụng voucher.");
      return;
    }

    try {
      setApplying(true);
      const subtotal = selectedItems.reduce(
        (acc, item) => acc + item.newPrice * item.quantity,
        0
      );

      const res = await axios.post(
        "https://it4409-deploy-backend.onrender.com/api/vouchers/apply",
        {
          code,
          items: selectedItems.map((item) => ({
            productId: item.id,
            newPrice: item.newPrice,
            quantity: item.quantity,
          })),
          orderTotal: subtotal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVoucherResult(res.data);
    } catch (err) {
      setVoucherResult(null);
      setVoucherError(
        err?.response?.data?.message ||
          "Áp dụng voucher thất bại. Vui lòng thử lại."
      );
    } finally {
      setApplying(false);
    }
  };

  const handleRemoveVoucher = () => {
    setVoucherResult(null);
    setVoucherCode("");
    setVoucherError("");
  };

  const handleSelectVoucher = (code) => {
    setVoucherCode(code);
    handleApplyVoucher(code);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <SEO
        title="Thanh toán"
        description="Thanh toán đơn hàng của bạn tại Tech-Geeks"
      />
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Thanh toán đơn hàng</h2>
          <button
            type="button"
            onClick={handleBackToCart}
            className="text-sm text-blue-600 hover:underline"
          >
            Quay lại
          </button>
        </div>

        {orderSuccess ? (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center">
            <h3 className="font-bold text-xl">Đặt hàng thành công!</h3>
            <p>Cảm ơn bạn đã mua hàng tại Tech-Geeks.</p>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <CheckoutForm formData={formData} setFormData={setFormData} />

              <div className="flex flex-col gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-3">
                    Phương thức thanh toán
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={() => setPaymentMethod("cash")}
                      />
                      <span>Thanh toán khi nhận hàng (Tiền mặt)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="zalopay"
                        checked={paymentMethod === "zalopay"}
                        onChange={() => setPaymentMethod("zalopay")}
                      />
                      <span>Thanh toán qua ZaloPay</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-3">Mã voucher</h3>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) =>
                        setVoucherCode(e.target.value.toUpperCase())
                      }
                      placeholder="Nhập mã voucher"
                      className="flex-1 border rounded px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleApplyVoucher}
                      disabled={applying}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-60"
                    >
                      {applying ? "Đang áp dụng..." : "Áp dụng"}
                    </button>
                    {voucherResult && (
                      <button
                        type="button"
                        onClick={handleRemoveVoucher}
                        className="px-3 py-2 border text-sm rounded hover:bg-gray-100"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                  {voucherError && (
                    <p className="text-xs text-red-600 mt-1">{voucherError}</p>
                  )}
                  {voucherResult?.voucher && (
                    <p className="text-xs text-green-700 mt-1">
                      Đã áp dụng voucher {voucherResult.voucher.code} - Giảm{" "}
                      {voucherResult.discountAmount.toLocaleString("vi-VN")}đ
                    </p>
                  )}

                  <div className="mt-3 border-t pt-3">
                    <button
                      type="button"
                      onClick={() => setShowVoucherList((prev) => !prev)}
                      className="text-xs px-3 py-2 border rounded hover:bg-gray-100"
                    >
                      {showVoucherList
                        ? "Ẩn voucher khả dụng"
                        : "Xem voucher khả dụng"}
                    </button>

                    {showVoucherList && (
                      <div className="mt-2">
                        <div className="text-sm font-semibold mb-1">
                          Voucher của bạn
                        </div>
                        {loadingVoucherList ? (
                          <p className="text-xs text-gray-500">
                            Đang tải danh sách voucher...
                          </p>
                        ) : voucherListError ? (
                          <p className="text-xs text-red-600">
                            {voucherListError}
                          </p>
                        ) : availableVouchers.length === 0 ? (
                          <p className="text-xs text-gray-500">
                            Hiện bạn chưa có voucher khả dụng.
                          </p>
                        ) : (
                          <div className="space-y-1 max-h-40 overflow-y-auto">
                            {availableVouchers.map((v) => (
                              <button
                                key={v.id}
                                type="button"
                                onClick={() => handleSelectVoucher(v.code)}
                                className="w-full text-left text-xs px-3 py-2 rounded border hover:bg-gray-100 flex justify-between items-center"
                              >
                                <div>
                                  <div className="font-semibold">{v.code}</div>
                                  {v.description && (
                                    <div className="text-[11px] text-gray-600 truncate">
                                      {v.description}
                                    </div>
                                  )}
                                  {v.minOrderValue > 0 && (
                                    <div className="text-[11px] text-gray-500">
                                      Đơn tối thiểu:{" "}
                                      {v.minOrderValue.toLocaleString("vi-VN")}đ
                                    </div>
                                  )}
                                </div>
                                <span className="text-[11px] text-gray-700">
                                  {v.discountType === "percent"
                                    ? `- ${v.discountValue}%`
                                    : `- ${v.discountValue.toLocaleString(
                                        "vi-VN"
                                      )}đ`}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <OrderSummary
                  cartItems={selectedItems}
                  voucherResult={voucherResult}
                />

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white font-bold text-lg py-3 rounded-lg shadow-md hover:bg-red-700"
                >
                  Xác nhận Đặt Hàng
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
