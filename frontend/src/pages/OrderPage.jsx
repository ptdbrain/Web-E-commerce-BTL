import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderDetailPopup from "../components/order/OrderDetailPopup";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://it4409-deploy-backend.onrender.com/api/orders/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const serverOrders = Array.isArray(res.data.orders)
          ? res.data.orders
          : [];

        setOrders(serverOrders);
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
        setOrders([]); // fallback để tránh lỗi map
      }
    };
    fetchOrders();
  }, []);

  // Nhận hàng (chuyển từ shipping sang confirmed)
  const handleReceiveOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.put(
        `https://it4409-deploy-backend.onrender.com/api/orders/${orderId}/receive`,
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

  // Trả hàng (chuyển từ shipping sang refunded)
  const handleRefundOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!window.confirm("Bạn có chắc muốn trả hàng và yêu cầu hoàn tiền?"))
      return;
    try {
      await axios.put(
        `https://it4409-deploy-backend.onrender.com/api/orders/${orderId}/refund`,
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

  // Lấy màu sắc cho trạng thái
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "paid":
        return "bg-blue-100 text-blue-700";
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "shipping":
        return "bg-purple-100 text-purple-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "refunded":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Lấy tên hiển thị trạng thái
  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "paid":
        return "Đã thanh toán";
      case "confirmed":
        return "Đã xác nhận";
      case "shipping":
        return "Đang giao";
      case "cancelled":
        return "Đã hủy";
      case "refunded":
        return "Đã hoàn tiền";
      case "waiting_for_payment":
        return "Chờ thanh toán";
      default:
        return status;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách đơn hàng</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow">
          <thead>
            <tr className="bg-cyan-100 text-cyan-800">
              <th className="border p-3">Mã đơn</th>
              <th className="border p-3">Khách hàng</th>
              <th className="border p-3">SĐT</th>
              <th className="border p-3">Tổng tiền</th>
              <th className="border p-3">Trạng thái</th>
              <th className="border p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="border p-3">{order._id}</td>
                <td className="border p-3">{order.customerName}</td>
                <td className="border p-3">{order.customerPhone}</td>
                <td className="border p-3 font-semibold text-red-600">
                  {order.totalPrice.toLocaleString()}₫
                </td>
                <td className="border p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(
                      order.orderStatus
                    )}`}
                  >
                    {getStatusLabel(order.orderStatus)}
                  </span>
                </td>
                <td className="border p-3 text-center">
                  <div className="flex gap-2 justify-center flex-wrap">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                    >
                      Xem chi tiết
                    </button>
                    {order.orderStatus === "shipping" && (
                      <>
                        <button
                          onClick={() => handleReceiveOrder(order._id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
                        >
                          Nhận hàng
                        </button>
                        <button
                          onClick={() => handleRefundOrder(order._id)}
                          className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition"
                        >
                          Trả hàng
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
