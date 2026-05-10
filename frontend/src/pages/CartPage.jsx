import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, Minus, Trash2, ShoppingBag, Tag, ArrowLeft, Check } from "lucide-react";
import { useCart } from "../hooks/useCart";
import SEO from "../components/common/SEO";

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
}

export default function CartPage() {
  const {
    cartItems,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    selectedItemIds,
    setSelectedItemIds,
    setIsManualSelection,
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
  const [loadingVoucherList, setLoadingVoucherList] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const selectedItems = cartItems.filter((item) => selectedItemIds.includes(item.id));
  const subtotal = selectedItems.reduce((acc, item) => acc + item.newPrice * item.quantity, 0);
  const discountAmount = voucherResult?.discountAmount || 0;
  const shippingFee = subtotal > 0 ? 30000 : 0;
  const total = Math.max(subtotal - discountAmount, 0) + shippingFee;
  const allSelected = cartItems.length > 0 && selectedItemIds.length === cartItems.length;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const fetchVouchers = async () => {
      try {
        setLoadingVoucherList(true);
        const res = await axios.get(
          "https://it4409-deploy-backend.onrender.com/api/vouchers/available",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAvailableVouchers(res.data?.vouchers || []);
      } catch (err) {
        console.error("Failed to load vouchers", err);
      } finally {
        setLoadingVoucherList(false);
      }
    };
    fetchVouchers();
  }, []);

  const handleToggleSelectAll = () => {
    setIsManualSelection(true);
    if (allSelected) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(cartItems.map((item) => item.id));
    }
  };

  const handleToggleItem = (id) => {
    setIsManualSelection(true);
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter((i) => i !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  const handleApplyVoucher = async (codeParam) => {
    setVoucherError("");
    const code = (codeParam ?? voucherCode).trim();
    if (!code) {
      setVoucherError("Vui lòng nhập mã voucher.");
      return;
    }
    if (selectedItems.length === 0) {
      setVoucherError("Chọn ít nhất một sản phẩm để áp dụng voucher.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setVoucherError("Bạn cần đăng nhập để sử dụng voucher.");
      return;
    }
    try {
      setApplying(true);
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVoucherResult(res.data);
      setVoucherCode(code);
    } catch (err) {
      setVoucherResult(null);
      setVoucherError(err?.response?.data?.message || "Áp dụng voucher thất bại.");
    } finally {
      setApplying(false);
    }
  };

  const handleRemoveVoucher = () => {
    setVoucherResult(null);
    setVoucherCode("");
    setVoucherError("");
  };

  const handleSelectVoucher = (v) => {
    setVoucherCode(v.code);
    handleApplyVoucher(v.code);
    setShowVoucherList(false);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-gray-400">
        <SEO title="Giỏ hàng" description="Giỏ hàng của bạn tại Tech-Geeks" />
        <ShoppingBag size={80} className="opacity-20" />
        <p className="text-xl font-medium text-gray-500">Giỏ hàng của bạn đang trống</p>
        <p className="text-sm">Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm!</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <SEO title="Giỏ hàng" description="Giỏ hàng của bạn tại Tech-Geeks" />
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full transition text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag size={26} className="text-blue-600" />
            Giỏ hàng của bạn
          </h1>
          <span className="text-gray-400 text-sm">({cartItems.length} sản phẩm)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select All Row */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between border border-gray-100">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleToggleSelectAll}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="font-medium text-gray-700">
                  Chọn tất cả ({cartItems.length} sản phẩm)
                </span>
              </label>
              <span className="text-sm text-gray-400">
                Đã chọn {selectedItems.length}/{cartItems.length}
              </span>
            </div>

            {/* Cart Items */}
            {cartItems.map((item) => {
              const itemResult = voucherResult?.itemResults?.find(
                (r) => String(r.productId) === String(item.id)
              );
              const eligible = voucherResult?.voucher && itemResult?.eligible;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl shadow-sm p-4 flex gap-4 items-center border transition ${
                    selectedItemIds.includes(item.id)
                      ? "border-blue-200"
                      : "border-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedItemIds.includes(item.id)}
                    onChange={() => handleToggleItem(item.id)}
                    className="w-4 h-4 accent-blue-600 flex-shrink-0"
                  />
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-contain border rounded-lg flex-shrink-0 bg-gray-50"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 line-clamp-2 text-sm leading-snug">
                      {item.name}
                    </p>
                    {item.variant && (
                      <p className="text-xs text-gray-400 mt-1">
                        Phiên bản: {item.variant}
                      </p>
                    )}
                    <p className="text-lg font-bold text-red-600 mt-1">
                      {formatPrice(item.newPrice)}
                    </p>
                    {voucherResult?.voucher && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                          eligible
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {eligible ? "Áp dụng voucher" : "Không áp dụng voucher"}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-500 transition"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 size={17} />
                    </button>
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="px-2 py-1.5 hover:bg-gray-100 transition"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-9 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="px-2 py-1.5 hover:bg-gray-100 transition"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-gray-700">
                      {formatPrice(item.newPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Voucher + Summary */}
          <div className="space-y-4">
            {/* Voucher Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-800">
                <Tag size={18} className="text-blue-600" />
                Mã giảm giá (Voucher)
              </h3>

              {voucherResult?.voucher ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-green-700">
                      {voucherResult.voucher.code}
                    </p>
                    <p className="text-xs text-green-600 mt-0.5">
                      Giảm {formatPrice(voucherResult.discountAmount)}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveVoucher}
                    className="text-xs text-red-500 hover:underline flex-shrink-0"
                  >
                    Xóa
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="Nhập mã voucher"
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                    onKeyDown={(e) => e.key === "Enter" && handleApplyVoucher()}
                  />
                  <button
                    onClick={() => handleApplyVoucher()}
                    disabled={applying}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-60 transition font-medium"
                  >
                    {applying ? "..." : "Áp dụng"}
                  </button>
                </div>
              )}

              {voucherError && (
                <p className="text-xs text-red-600 mt-2">{voucherError}</p>
              )}

              {/* Available Vouchers */}
              {!loadingVoucherList && availableVouchers.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setShowVoucherList(!showVoucherList)}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    {showVoucherList
                      ? "Ẩn danh sách"
                      : `Xem ${availableVouchers.length} voucher khả dụng`}
                  </button>
                  {showVoucherList && (
                    <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1">
                      {availableVouchers.map((v) => (
                        <div
                          key={v.id}
                          className="border rounded-lg p-2 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer"
                          onClick={() => handleSelectVoucher(v)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                {v.code}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyCode(v.code);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                                title="Sao chép mã"
                              >
                                {copiedCode === v.code ? (
                                  <Check size={12} className="text-green-500" />
                                ) : (
                                  <span className="text-xs text-gray-400">📋</span>
                                )}
                              </button>
                            </div>
                            <span className="text-xs font-bold text-red-600">
                              {v.discountType === "percent"
                                ? `-${v.discountValue}%`
                                : `-${formatPrice(v.discountValue)}`}
                            </span>
                          </div>
                          {v.description && (
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {v.description}
                            </p>
                          )}
                          {v.minOrderValue > 0 && (
                            <p className="text-xs text-gray-400">
                              Đơn tối thiểu: {formatPrice(v.minOrderValue)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>Giảm giá voucher</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Phí giao hàng</span>
                  <span>{subtotal > 0 ? formatPrice(shippingFee) : formatPrice(0)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t">
                  <span>Tổng cộng</span>
                  <span className="text-red-600">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                disabled={selectedItems.length === 0}
                className="mt-4 w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-40 disabled:cursor-not-allowed text-base shadow-md"
              >
                Thanh toán ({selectedItems.length} sản phẩm)
              </button>
              <button
                onClick={() => navigate("/products")}
                className="mt-2 w-full border border-gray-300 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 text-sm transition font-medium"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
