import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  // selectedMonth rỗng => thống kê tất cả thời gian
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        setOrdersError("");
        const token = localStorage.getItem("token");
        const headers = token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {};

        const res = await axios.get("https://it4409-deploy-backend.onrender.com/api/orders", {
          headers,
        });

        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to load orders for dashboard", err);
        setOrdersError(
          err?.response?.data?.message || "Không thể tải danh sách đơn hàng."
        );
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  const computeStats = (data) => {
    let totalRevenue = 0; // tiền kiếm được từ đơn (đã thành công)
    let pendingCash = 0; // tiền đang pending (COD, đang vận chuyển)
    let successOrders = 0; // đơn hàng bán ra thành công
    let refundAmount = 0; // số tiền hoàn trả (đơn hoàn trả)
    let refundOrders = 0; // số đơn hoàn trả

    for (const o of data) {
      const status = o.orderStatus;
      const method = o.paymentMethod;
      const amount = Number(o.totalPrice || 0);

      if (status === "confirmed") {
        totalRevenue += amount;
        successOrders += 1;
      }

      if (method === "cash" && status === "pending") {
        pendingCash += amount;
      }

      // Đơn hoàn trả: trạng thái riêng "refunded" khác với "cancelled"
      if (status === "refunded") {
        refundAmount += amount;
        refundOrders += 1;
      }
    }

    return {
      totalRevenue,
      pendingCash,
      successOrders,
      refundAmount,
      refundOrders,
    };
  };

  const overallStats = useMemo(() => computeStats(orders), [orders]);

  const monthlyOrders = useMemo(() => {
    if (!selectedMonth) return [];
    const [yStr, mStr] = selectedMonth.split("-");
    const year = parseInt(yStr, 10);
    const month = parseInt(mStr, 10);
    if (!year || !month) return [];

    return orders.filter((o) => {
      if (!o.createdAt) return false;
      const d = new Date(o.createdAt);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
  }, [orders, selectedMonth]);

  const monthlyStats = useMemo(
    () => computeStats(monthlyOrders),
    [monthlyOrders]
  );

  const displayStats = selectedMonth ? monthlyStats : overallStats;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Trang tổng quan quản trị</h2>

      {/* Lựa chọn tháng + thống kê đơn hàng */}
      <div className="bg-white rounded shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
          <h3 className="font-semibold">Thống kê đơn hàng</h3>
          <div className="flex items-center gap-2 text-sm">
            <span>Chọn tháng (từ 01/2025):</span>
            <input
              type="month"
              className="border rounded px-2 py-1 text-xs md:text-sm"
              min="2025-01"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setSelectedMonth("")}
              className="px-3 py-1 text-xs md:text-sm border rounded text-gray-700 hover:bg-gray-50"
            >
              Xem tất cả thời gian
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-3">
          {selectedMonth
            ? `Đang xem số liệu cho tháng ${selectedMonth.split("-")[1]}/${
                selectedMonth.split("-")[0]
              }`
            : "Đang xem số liệu cho tất cả thời gian từ trước tới nay."}
        </p>
        {ordersError && (
          <p className="text-xs text-red-600 mb-3">{ordersError}</p>
        )}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Tiền kiếm được (đơn thành công)</div>
            <div className="text-lg font-semibold mt-1">
              {displayStats.totalRevenue.toLocaleString("vi-VN")}₫
            </div>
          </div>
          <div>
            <div className="text-gray-500">Tiền đang pending (COD)</div>
            <div className="text-lg font-semibold mt-1">
              {displayStats.pendingCash.toLocaleString("vi-VN")}₫
            </div>
          </div>
          <div>
            <div className="text-gray-500">Đơn bán ra thành công</div>
            <div className="text-lg font-semibold mt-1">
              {displayStats.successOrders}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Số tiền hoàn trả (đơn hoàn trả)</div>
            <div className="text-lg font-semibold mt-1">
              {displayStats.refundAmount.toLocaleString("vi-VN")}₫
            </div>
          </div>
          <div>
            <div className="text-gray-500">Số đơn hoàn trả</div>
            <div className="text-lg font-semibold mt-1">
              {displayStats.refundOrders}
            </div>
          </div>
        </div>
        {loadingOrders && (
          <p className="mt-2 text-xs text-gray-500">Đang tải dữ liệu đơn hàng...</p>
        )}
      </div>

      {/* Danh sách đơn hàng theo tháng (chỉ hiển thị khi đã chọn tháng) */}
      {selectedMonth && (
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-3">Danh sách đơn hàng trong tháng</h3>
          {monthlyOrders.length === 0 ? (
            <p className="text-sm text-gray-500">
              Không có đơn hàng nào trong tháng này.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2">Ngày</th>
                    <th className="px-3 py-2">Khách hàng</th>
                    <th className="px-3 py-2">Tổng tiền</th>
                    <th className="px-3 py-2">Trạng thái</th>
                    <th className="px-3 py-2">Thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyOrders.map((o) => {
                    const date = o.createdAt ? new Date(o.createdAt) : null;
                    const dateLabel = date
                      ? `${String(date.getDate()).padStart(2, "0")}/${String(
                          date.getMonth() + 1
                        ).padStart(2, "0")}/${date.getFullYear()}`
                      : "";

                    return (
                      <tr key={o._id} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2">{dateLabel}</td>
                        <td className="px-3 py-2">{o.customerName}</td>
                        <td className="px-3 py-2">
                          {Number(o.totalPrice || 0).toLocaleString("vi-VN")}₫
                        </td>
                        <td className="px-3 py-2 capitalize">{o.orderStatus}</td>
                        <td className="px-3 py-2 capitalize">{o.paymentMethod}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}