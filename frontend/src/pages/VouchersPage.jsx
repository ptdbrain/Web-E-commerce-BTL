import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Tag, Copy, Check, Clock, ShoppingCart, Gift, Percent } from "lucide-react";
import SEO from "../components/common/SEO";

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function VoucherCard({ v, onCopy, copiedId, onUse }) {
  const isPercent = v.discountType === "percent";
  const remaining = v.maxUsage > 0 ? v.maxUsage - (v.usedCount || 0) : null;
  const progressPct =
    v.maxUsage > 0 ? Math.min(((v.usedCount || 0) / v.maxUsage) * 100, 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 flex">
      {/* Left color accent strip */}
      <div
        className={`w-3 flex-shrink-0 ${
          isPercent
            ? "bg-gradient-to-b from-orange-400 to-red-500"
            : "bg-gradient-to-b from-blue-500 to-indigo-600"
        }`}
      />

      {/* Main content */}
      <div className="flex-1 p-5">
        {/* Top: discount + copy */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isPercent ? (
                <Percent size={16} className="text-orange-500" />
              ) : (
                <Gift size={16} className="text-blue-500" />
              )}
              <span className="text-2xl font-extrabold text-red-600">
                {isPercent
                  ? `-${v.discountValue}%`
                  : `-${formatPrice(v.discountValue)}`}
              </span>
            </div>
            {isPercent && v.maxDiscountAmount > 0 && (
              <p className="text-xs text-gray-400">
                Giảm tối đa {formatPrice(v.maxDiscountAmount)}
              </p>
            )}
          </div>
          <button
            onClick={() => onCopy(v.code, v.id)}
            className="flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded-lg transition font-medium
              hover:bg-gray-50"
            style={
              copiedId === v.id
                ? { borderColor: "#22c55e", color: "#16a34a" }
                : { borderColor: "#3b82f6", color: "#2563eb" }
            }
          >
            {copiedId === v.id ? (
              <>
                <Check size={12} />
                Đã sao chép
              </>
            ) : (
              <>
                <Copy size={12} />
                Sao chép
              </>
            )}
          </button>
        </div>

        {/* Voucher code badge */}
        <div className="mb-3">
          <span className="font-mono font-bold text-base bg-gray-100 text-gray-700 px-3 py-1 rounded tracking-widest select-all">
            {v.code}
          </span>
        </div>

        {/* Description */}
        {v.description && (
          <p className="text-sm text-gray-600 mb-3">{v.description}</p>
        )}

        {/* Conditions */}
        <div className="space-y-1.5 text-xs text-gray-500 mb-3">
          {v.minOrderValue > 0 && (
            <div className="flex items-center gap-1.5">
              <ShoppingCart size={12} />
              <span>Đơn hàng tối thiểu: {formatPrice(v.minOrderValue)}</span>
            </div>
          )}
          {v.endDate && (
            <div className="flex items-center gap-1.5 text-orange-500 font-medium">
              <Clock size={12} />
              <span>Hết hạn: {formatDate(v.endDate)}</span>
            </div>
          )}
        </div>

        {/* Usage progress bar */}
        {v.maxUsage > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Đã sử dụng: {v.usedCount || 0}/{v.maxUsage}</span>
              {remaining !== null && (
                <span className="text-orange-500 font-medium">
                  Còn {remaining} lượt
                </span>
              )}
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Use button */}
        <button
          onClick={onUse}
          className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition text-sm"
        >
          Dùng ngay
        </button>
      </div>
    </div>
  );
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://it4409-deploy-backend.onrender.com/api/vouchers/available",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVouchers(res.data?.vouchers || []);
      } catch (err) {
        console.error("Failed to load vouchers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVouchers();
  }, [token]);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUse = (code) => {
    navigate(`/checkout?voucher=${code}`);
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-gray-400">
        <SEO title="Voucher của tôi" description="Xem voucher khuyến mãi của bạn" />
        <Tag size={72} className="opacity-20" />
        <p className="text-lg text-gray-500 font-medium">
          Bạn cần đăng nhập để xem voucher
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <SEO title="Voucher của tôi" description="Xem tất cả voucher khuyến mãi của bạn tại Tech-Geeks" />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
            <Tag size={26} className="text-blue-600" />
            Voucher của tôi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sử dụng voucher khi thanh toán để được giảm giá
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p>Đang tải danh sách voucher...</p>
          </div>
        ) : vouchers.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-4 text-gray-400">
            <Tag size={72} className="opacity-20" />
            <p className="text-lg font-medium">Bạn chưa có voucher nào khả dụng</p>
            <p className="text-sm">Hãy theo dõi các chương trình khuyến mãi của chúng tôi!</p>
            <button
              onClick={() => navigate("/")}
              className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              Về trang chủ
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Bạn có <span className="font-bold text-blue-600">{vouchers.length}</span> voucher khả dụng
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vouchers.map((v) => (
                <VoucherCard
                  key={v.id}
                  v={v}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                  onUse={() => handleUse(v.code)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
