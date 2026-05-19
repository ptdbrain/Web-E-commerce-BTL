import React, { useState, useEffect } from "react";
import { Eye, Check, X } from "lucide-react";
import OrderDetailModal from "./OrderDetailModal";
import { formatPriceAdmin, getStatusColor } from "./utils";
import axios from "axios";

export const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Bạn cần đăng nhập với vai trò admin để xem đơn hàng.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("https://it4409-deploy-backend.onrender.com/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const serverOrders = Array.isArray(res?.data?.orders)
        ? res.data.orders
        : [];
      const mapped = serverOrders.map((o) => ({
        id: o._id,
        customer: o.customerName,
        email: o.customerEmail,
        phone: o.customerPhone,
        address: o.shippingAddress,
        date: o.createdAt?.slice(0, 10) ?? "",
        total: o.totalPrice,
        status: o.orderStatus,
        items: Array.isArray(o.items)
          ? o.items.map((it, idx) => ({
              name: it.productName,
              price: it.price,
              quantity: it.quantity,
              id: it.productId || idx,
            }))
          : [],
      }));
      setOrders(mapped);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Không thể tải danh sách đơn hàng"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Xác nhận đơn hàng (chuyển sang shipping)
  const handleConfirmOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.put(
        `https://it4409-deploy-backend.onrender.com/api/orders/${orderId}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Cập nhật lại danh sách
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "shipping" } : o))
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Không thể xác nhận đơn hàng");
    }
  };

  // Hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    try {
      await axios.put(
        `https://it4409-deploy-backend.onrender.com/api/orders/${orderId}/admin-cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Cập nhật lại danh sách
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Không thể hủy đơn hàng");
    }
  };

  const filtered = orders.filter(
    (o) => filter === "all" || o.status === filter
  );

  // Kiểm tra có thể xác nhận/hủy không
  const canConfirmOrCancel = (status) => {
    return status === "pending" || status === "confirmed" || status === "paid";
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Danh sách đơn hàng</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">Tất cả</option>
          <option value="pending">Chờ xử lý</option>
          <option value="paid">Đã thanh toán</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="shipping">Đang giao</option>
          <option value="cancelled">Đã hủy</option>
          <option value="refunded">Đã hoàn tiền</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        {loading && (
          <div className="p-3 text-sm text-gray-500">Đang tải đơn hàng...</div>
        )}
        {error && <div className="p-3 text-sm text-red-600">{error}</div>}
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">Mã</th>
              <th className="p-3">Khách</th>
              <th className="p-3">Tổng tiền</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium text-blue-600">{order.id}</td>
                <td className="p-3">
                  <div>{order.customer}</div>
                  <div className="text-xs text-gray-500">{order.phone}</div>
                </td>
                <td className="p-3">{formatPriceAdmin(order.total)}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:bg-blue-100 p-2 rounded"
                      title="Xem chi tiết"
                    >
                      <Eye size={18} />
                    </button>
                    {canConfirmOrCancel(order.status) && (
                      <>
                        <button
                          onClick={() => handleConfirmOrder(order.id)}
                          className="text-green-600 hover:bg-green-100 p-2 rounded"
                          title="Xác nhận đơn hàng"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="text-red-600 hover:bg-red-100 p-2 rounded"
                          title="Hủy đơn hàng"
                        >
                          <X size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default AdminOrders;
