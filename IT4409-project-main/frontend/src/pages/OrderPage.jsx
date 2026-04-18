import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiEye, FiPackage, FiRotateCcw } from "react-icons/fi";
import { buildApiUrl } from "../config/api";
import OrderDetailPopup from "../components/order/OrderDetailPopup";
import SEO from "../components/common/SEO";

const getStatusStyle = (status) => {
  const map = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    paid: "bg-blue-50 text-blue-700 border-blue-200",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    shipping: "bg-violet-50 text-violet-700 border-violet-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    refunded: "bg-slate-100 text-slate-600 border-slate-200",
    waiting_for_payment: "bg-orange-50 text-orange-700 border-orange-200",
  };
  return map[status] || "bg-slate-100 text-slate-600 border-slate-200";
};

const getStatusLabel = (status) => {
  const map = {
    pending: "Chờ xử lý",
    paid: "Đã thanh toán",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao",
    cancelled: "Đã hủy",
    refunded: "Đã hoàn tiền",
    waiting_for_payment: "Chờ thanh toán",
  };
  return map[status] || status;
};

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(buildApiUrl("/orders/my"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const serverOrders = Array.isArray(res.data.orders)
          ? res.data.orders
          : [];
        setOrders(serverOrders);
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleReceiveOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.put(
        buildApiUrl(`/orders/${orderId}/receive`),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: "confirmed" } : o
        )
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Không thể xác nhận nhận hàng");
    }
  };

  const handleRefundOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!window.confirm("Bạn có chắc muốn trả hàng và yêu cầu hoàn tiền?"))
      return;
    try {
      await axios.put(
        buildApiUrl(`/orders/${orderId}/refund`),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: "refunded" } : o
        )
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Không thể yêu cầu trả hàng");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 to-slate-50 py-10 px-4">
      <SEO title="Đơn hàng của tôi" description="Theo dõi và quản lý đơn hàng." />

      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-extrabold text-slate-900">
            Đơn hàng của tôi
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Theo dõi trạng thái và quản lý đơn hàng
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-2xl skeleton" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-16 text-center shadow-card">
            <div className="text-5xl mb-4">📦</div>
            <p className="font-display text-lg font-bold text-slate-700">
              Chưa có đơn hàng nào
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Hãy đặt món đầu tiên nhé!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Order info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-800">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getStatusStyle(
                          order.orderStatus
                        )}`}
                      >
                        {getStatusLabel(order.orderStatus)}
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span>{order.customerName}</span>
                      <span>{order.customerPhone}</span>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <div className="text-lg font-extrabold text-gradient font-display">
                      {order.totalPrice?.toLocaleString("vi-VN")}đ
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {order.items?.length || 0} món
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-orange-200 hover:text-orange-600 transition-all"
                  >
                    <FiEye size={13} />
                    Chi tiết
                  </button>
                  {order.orderStatus === "shipping" && (
                    <>
                      <button
                        onClick={() => handleReceiveOrder(order._id)}
                        className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                      >
                        <FiPackage size={13} />
                        Nhận hàng
                      </button>
                      <button
                        onClick={() => handleRefundOrder(order._id)}
                        className="flex items-center gap-1.5 rounded-lg bg-orange-50 border border-orange-200 px-3 py-1.5 text-xs font-bold text-orange-700 hover:bg-orange-100 transition-colors"
                      >
                        <FiRotateCcw size={13} />
                        Trả hàng
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailPopup
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCancel={(id) => {
            setOrders((prev) =>
              prev.map((o) =>
                o._id === id ? { ...o, orderStatus: "cancelled" } : o
              )
            );
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}
