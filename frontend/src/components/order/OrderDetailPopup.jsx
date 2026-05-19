import React from "react";
import axios from "axios";

export default function OrderDetailPopup({ order, onClose, onCancel }) {
  const handleCancelOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://it4409-deploy-backend.onrender.com/api/orders/${order._id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onCancel(order._id);
    } catch (err) {
      console.error("Lỗi khi hủy đơn hàng:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-cyan-700">
          Chi tiết đơn hàng #{order._id}
        </h2>
        <div className="space-y-2 text-gray-700">
          <p><strong>Khách hàng:</strong> {order.customerName}</p>
          <p><strong>SĐT:</strong> {order.customerPhone}</p>
          <p><strong>Địa chỉ:</strong> {order.shippingAddress}</p>
          <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
          <p><strong>Tổng tiền:</strong> {order.totalPrice.toLocaleString()}₫</p>
          <p><strong>Trạng thái:</strong> {order.orderStatus}</p>
        </div>

        <h3 className="mt-4 font-semibold text-cyan-600">Sản phẩm:</h3>
        <ul className="list-disc pl-5 text-gray-600">
          {order.items.map((item, index) => (
            <li key={index}>
              <img src={item.productImage} alt={item.productName} className="w-12 h-12 inline-block mr-2" />
              {item.productName} - SL: {item.quantity} - Giá: {(item.price || 0).toLocaleString()}₫
            </li>

          ))}
        </ul>

        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="bg-cyan-500 text-white px-6 py-3 rounded-full font-bold hover:bg-cyan-600 transition"
          >
            Đóng
          </button>
          {order.orderStatus !== "cancelled" && (
            <button
              onClick={handleCancelOrder}
              className="bg-red-500 text-white px-6 py-3 rounded-full font-bold hover:bg-red-600 transition"
            >
              Hủy đơn
            </button>
          )}
        </div>
      </div>
    </div>
  );
}