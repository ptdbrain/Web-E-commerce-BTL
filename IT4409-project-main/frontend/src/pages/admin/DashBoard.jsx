import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { buildApiUrl } from "../../config/api";
import {
  formatDateTime,
  formatPriceAdmin,
  formatShortId,
  getFulfillmentLabel,
  getStatusColor,
  getStatusLabel,
} from "../../components/admin/utils";

const getMonthParts = (value) => {
  const [yearValue, monthValue] = String(value || "").split("-");
  const year = Number(yearValue);
  const month = Number(monthValue);
  return {
    year: Number.isFinite(year) ? year : 0,
    month: Number.isFinite(month) ? month : 0,
  };
};

const isCompletedOrder = (order) => order.orderStatus === "confirmed";
const isActiveOrder = (order) =>
  ["waiting_for_payment", "pending", "shipping"].includes(order.orderStatus);

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const loadOrders = async () => {
    setLoadingOrders(true);
    setOrdersError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(buildApiUrl("/orders"), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setOrders(Array.isArray(response.data?.orders) ? response.data.orders : []);
    } catch (err) {
      console.error("Failed to load dashboard orders", err);
      setOrders([]);
      setOrdersError(
        err?.response?.data?.message || "Khong the tai so lieu don hang."
      );
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (!selectedMonth) return orders;
    const { year, month } = getMonthParts(selectedMonth);
    if (!year || !month) return orders;

    return orders.filter((order) => {
      const date = new Date(order.createdAt);
      return (
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === year &&
        date.getMonth() + 1 === month
      );
    });
  }, [orders, selectedMonth]);

  const stats = useMemo(() => {
    const completedOrders = filteredOrders.filter(isCompletedOrder);
    const activeOrders = filteredOrders.filter(isActiveOrder);
    const revenue = completedOrders.reduce(
      (sum, order) => sum + Number(order.totalPrice || 0),
      0
    );
    const paidOrders = filteredOrders.filter(
      (order) => !["cancelled", "refunded"].includes(order.orderStatus)
    );
    const averageTicket = paidOrders.length
      ? paidOrders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0) /
        paidOrders.length
      : 0;
    const refunds = filteredOrders.filter((order) => order.orderStatus === "refunded");
    const cancelled = filteredOrders.filter((order) => order.orderStatus === "cancelled");

    return {
      total: filteredOrders.length,
      active: activeOrders.length,
      completed: completedOrders.length,
      revenue,
      averageTicket,
      refundCount: refunds.length,
      cancelledCount: cancelled.length,
      fulfillmentMix: {
        delivery: filteredOrders.filter((order) => order.fulfillmentType === "delivery")
          .length,
        pickup: filteredOrders.filter((order) => order.fulfillmentType === "pickup")
          .length,
        dine_in: filteredOrders.filter((order) => order.fulfillmentType === "dine_in")
          .length,
      },
    };
  }, [filteredOrders]);

  const recentOrders = useMemo(
    () =>
      [...filteredOrders]
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
        .slice(0, 6),
    [filteredOrders]
  );

  const mixItems = [
    { key: "delivery", accent: "bg-orange-500" },
    { key: "pickup", accent: "bg-cyan-500" },
    { key: "dine_in", accent: "bg-fuchsia-500" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 p-6 text-white shadow-2xl shadow-slate-900/15">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-100">
              Tong quan van hanh
            </div>
            <h2 className="mt-4 font-display text-3xl font-black tracking-tight">
              FireBite Performance
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Nhin nhanh doanh thu, don dang xu ly va ty trong delivery, pickup,
              dine-in.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="month"
              min="2025-01"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none backdrop-blur placeholder:text-slate-300"
            />
            <button
              type="button"
              onClick={() => setSelectedMonth("")}
              className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15"
            >
              Tat ca thoi gian
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Doanh thu hoan tat",
              value: formatPriceAdmin(stats.revenue),
            },
            {
              label: "Don dang xu ly",
              value: stats.active,
            },
            {
              label: "Ticket trung binh",
              value: formatPriceAdmin(stats.averageTicket),
            },
            {
              label: "Don hoan tat",
              value: stats.completed,
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur"
            >
              <div className="text-sm text-slate-300">{card.label}</div>
              <div className="mt-2 font-display text-3xl font-black">
                {card.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {ordersError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {ordersError}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-950">Ty trong fulfillment</h3>
              <p className="mt-1 text-sm text-slate-500">
                Phan bo don theo cach nhan mon.
              </p>
            </div>
            <button
              type="button"
              onClick={loadOrders}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Lam moi
            </button>
          </div>

          <div className="mt-6 space-y-5">
            {mixItems.map((item) => {
              const count = stats.fulfillmentMix[item.key];
              const percentage = stats.total
                ? Math.round((count / stats.total) * 100)
                : 0;

              return (
                <div key={item.key}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-900">
                      {getFulfillmentLabel(item.key)}
                    </span>
                    <span className="text-slate-500">
                      {count} don • {percentage}%
                    </span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-slate-100">
                    <div
                      className={`h-3 rounded-full ${item.accent}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Don hoan tien
              </div>
              <div className="mt-1 text-2xl font-bold text-slate-900">
                {stats.refundCount}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Don da huy
              </div>
              <div className="mt-1 text-2xl font-bold text-slate-900">
                {stats.cancelledCount}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-950">Don gan nhat</h3>
              <p className="mt-1 text-sm text-slate-500">
                Cap nhat theo bo loc thang hien tai.
              </p>
            </div>
            {loadingOrders ? (
              <div className="text-sm text-slate-400">Dang tai...</div>
            ) : null}
          </div>

          <div className="mt-5 space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-[24px] border border-slate-100 bg-white p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                          #{formatShortId(order._id)}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.orderStatus)}`}
                        >
                          {getStatusLabel(order.orderStatus)}
                        </span>
                      </div>
                      <div className="mt-3 font-semibold text-slate-950">
                        {order.customerName}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {getFulfillmentLabel(order.fulfillmentType)} •{" "}
                        {formatDateTime(order.createdAt)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-display text-2xl font-black text-slate-950">
                        {formatPriceAdmin(order.totalPrice)}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {(order.items || []).length} mon
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
                Chua co don hang trong khoang thoi gian nay.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
