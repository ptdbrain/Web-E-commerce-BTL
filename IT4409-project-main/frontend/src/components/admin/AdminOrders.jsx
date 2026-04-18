import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Check,
  LoaderCircle,
  RefreshCw,
  Search,
  Truck,
  X,
} from "lucide-react";
import { buildApiUrl } from "../../config/api";
import OrderDetailModal from "./OrderDetailModal";
import {
  formatDateTime,
  formatPriceAdmin,
  formatShortId,
  getFulfillmentColor,
  getFulfillmentLabel,
  getPaymentLabel,
  getStatusColor,
  getStatusLabel,
} from "./utils";

const statusFilters = [
  { value: "all", label: "Tat ca" },
  { value: "waiting_for_payment", label: "Cho thanh toan" },
  { value: "pending", label: "Cho xu ly" },
  { value: "shipping", label: "Dang phuc vu" },
  { value: "confirmed", label: "Hoan tat" },
  { value: "cancelled", label: "Da huy" },
  { value: "refunded", label: "Da hoan tien" },
];

const fulfillmentFilters = [
  { value: "all", label: "Moi hinh thuc" },
  { value: "delivery", label: "Giao hang" },
  { value: "pickup", label: "Tu den lay" },
  { value: "dine_in", label: "Dat ban" },
];

const getFulfillmentDetail = (order) => {
  if (order.fulfillmentType === "pickup") {
    return order.pickupTime
      ? `Lay mon luc ${formatDateTime(order.pickupTime)}`
      : "Khach tu den lay tai quay";
  }

  if (order.fulfillmentType === "dine_in") {
    const guestCount = order.tableBooking?.guestCount || 0;
    return `${guestCount} khach • ${formatDateTime(order.tableBooking?.bookingTime)}`;
  }

  return order.shippingAddress || "Chua co dia chi giao hang";
};

const canConfirmOrder = (status) => ["pending", "confirmed"].includes(status);
const canCancelOrder = (status) =>
  !["cancelled", "confirmed", "refunded"].includes(status);

export const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState("");
  const [filters, setFilters] = useState({
    query: "",
    status: "all",
    fulfillmentType: "all",
  });

  const loadOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Can dang nhap voi quyen admin de xem don hang.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(buildApiUrl("/orders"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(response.data?.orders) ? response.data.orders : []);
    } catch (err) {
      console.error("Failed to load orders", err);
      setError(err?.response?.data?.message || "Khong the tai danh sach don.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return orders.filter((order) => {
      const target = [
        order._id,
        order.customerName,
        order.customerPhone,
        order.customerEmail,
        order.shippingAddress,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = !query || target.includes(query);
      const matchesStatus =
        filters.status === "all" || order.orderStatus === filters.status;
      const matchesFulfillment =
        filters.fulfillmentType === "all" ||
        order.fulfillmentType === filters.fulfillmentType;

      return matchesQuery && matchesStatus && matchesFulfillment;
    });
  }, [filters, orders]);

  const stats = useMemo(
    () => ({
      total: orders.length,
      processing: orders.filter((order) =>
        ["waiting_for_payment", "pending", "shipping"].includes(order.orderStatus)
      ).length,
      delivery: orders.filter((order) => order.fulfillmentType === "delivery").length,
      dineIn: orders.filter((order) => order.fulfillmentType === "dine_in").length,
    }),
    [orders]
  );

  const handleConfirmOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setActingId(orderId);

    try {
      await axios.put(
        buildApiUrl(`/orders/${orderId}/confirm`),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: "shipping" } : order
        )
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Khong the xac nhan don hang.");
    } finally {
      setActingId("");
    }
  };

  const handleCancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!window.confirm("Huy don hang nay?")) return;

    setActingId(orderId);

    try {
      await axios.put(
        buildApiUrl(`/orders/${orderId}/admin-cancel`),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: "cancelled" } : order
        )
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Khong the huy don hang.");
    } finally {
      setActingId("");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 p-6 text-white shadow-2xl shadow-slate-900/15">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-100">
              Don hang toan cua hang
            </div>
            <h2 className="mt-4 font-display text-3xl font-black tracking-tight">
              FireBite Order Desk
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Theo doi don giao hang, pickup va dat ban trong cung mot bang dieu
              phoi.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-[1.01]"
          >
            <RefreshCw size={16} />
            Tai lai danh sach
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Tong don", value: stats.total },
            { label: "Dang xu ly", value: stats.processing },
            { label: "Delivery", value: stats.delivery },
            { label: "Dat ban", value: stats.dineIn },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur"
            >
              <div className="text-sm text-slate-300">{card.label}</div>
              <div className="mt-1 font-display text-3xl font-black">{card.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid flex-1 gap-3 md:grid-cols-[1.5fr_0.9fr_0.9fr]">
            <label className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={filters.query}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, query: event.target.value }))
                }
                placeholder="Tim theo ma don, ten khach, sdt..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3 text-sm text-slate-700 outline-none transition-all focus:border-orange-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
              />
            </label>

            <select
              value={filters.status}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, status: event.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-orange-300 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
            >
              {statusFilters.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <select
              value={filters.fulfillmentType}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  fulfillmentType: event.target.value,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-orange-300 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
            >
              {fulfillmentFilters.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
      </section>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-52 rounded-[28px] border border-slate-100 bg-white animate-pulse"
            />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-slate-200 bg-white/80 p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-600">
            <Truck size={28} />
          </div>
          <h3 className="mt-4 font-display text-2xl font-black text-slate-900">
            Khong tim thay don nao
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Thu doi tu khoa tim kiem hoac bo loc trang thai.
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {filteredOrders.map((order) => (
            <article
              key={order._id}
              className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-200/30 backdrop-blur"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                      #{formatShortId(order._id)}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.orderStatus)}`}
                    >
                      {getStatusLabel(order.orderStatus)}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getFulfillmentColor(order.fulfillmentType)}`}
                    >
                      {getFulfillmentLabel(order.fulfillmentType)}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                      {getPaymentLabel(order.paymentMethod)}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1fr_1fr]">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Khach hang
                      </div>
                      <div className="mt-1 font-semibold text-slate-950">
                        {order.customerName}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {order.customerPhone || "Khong co so dien thoai"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Nhan mon
                      </div>
                      <div className="mt-1 text-sm font-medium leading-6 text-slate-700">
                        {getFulfillmentDetail(order)}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Tao luc
                      </div>
                      <div className="mt-1 text-sm font-medium text-slate-700">
                        {formatDateTime(order.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-100 bg-white px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Mon trong don
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(order.items || []).slice(0, 4).map((item, index) => (
                        <span
                          key={`${order._id}-item-${index}`}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700"
                        >
                          {item.productName} x{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full xl:w-[260px]">
                  <div className="rounded-[24px] bg-slate-950 p-5 text-white">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Tong don
                    </div>
                    <div className="mt-2 font-display text-3xl font-black">
                      {formatPriceAdmin(order.totalPrice)}
                    </div>
                    <div className="mt-2 text-sm text-slate-300">
                      {(order.items || []).length} mon • {getPaymentLabel(order.paymentMethod)}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      Xem chi tiet
                    </button>

                    {canConfirmOrder(order.orderStatus) ? (
                      <button
                        type="button"
                        onClick={() => handleConfirmOrder(order._id)}
                        disabled={actingId === order._id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-60"
                      >
                        {actingId === order._id ? (
                          <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}
                        Xac nhan va chuyen xu ly
                      </button>
                    ) : null}

                    {canCancelOrder(order.orderStatus) ? (
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={actingId === order._id}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-60"
                      >
                        {actingId === order._id ? (
                          <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <X size={16} />
                        )}
                        Huy don
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {selectedOrder ? (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      ) : null}
    </div>
  );
};

export default AdminOrders;
