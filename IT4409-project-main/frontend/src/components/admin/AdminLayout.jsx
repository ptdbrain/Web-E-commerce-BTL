import React from "react";
import {
  BarChart3,
  ChevronRight,
  LayoutDashboard,
  MessagesSquare,
  Package2,
  ShoppingBag,
  TicketPercent,
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  {
    to: "/admin",
    label: "Tong quan",
    description: "So lieu cua cua hang",
    icon: LayoutDashboard,
  },
  {
    to: "/admin/orders",
    label: "Don hang",
    description: "Giao, pickup va dat ban",
    icon: ShoppingBag,
  },
  {
    to: "/admin/products",
    label: "Menu",
    description: "Mon le, combo va do uong",
    icon: Package2,
  },
  {
    to: "/admin/vouchers",
    label: "Voucher",
    description: "Ma giam gia va campaign",
    icon: TicketPercent,
  },
  {
    to: "/admin/chat",
    label: "Chat",
    description: "Ho tro khach dang dat mon",
    icon: MessagesSquare,
  },
];

const isItemActive = (pathname, href) =>
  pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));

const getCurrentSection = (pathname) =>
  navItems.find((item) => isItemActive(pathname, item.to)) || navItems[0];

const getNavClassName = (active, compact = false) =>
  [
    "group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200",
    compact ? "min-w-max whitespace-nowrap" : "",
    active
      ? "border-orange-200 bg-orange-50 text-orange-700 shadow-sm shadow-orange-500/10"
      : "border-transparent bg-transparent text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-900",
  ].join(" ");

export const AdminLayout = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentSection = getCurrentSection(location.pathname);
  const todayLabel = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8f1_0%,#f8fafc_38%,#f8fafc_100%)] text-slate-800">
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-[292px] shrink-0 lg:block">
          <div className="sticky top-4 space-y-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 p-6 text-left text-white shadow-2xl shadow-slate-900/20"
            >
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-100">
                FireBite Admin
              </div>
              <h1 className="mt-5 font-display text-3xl font-black tracking-tight">
                FireBite
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Dieu pho menu, don hang va ho tro khach trong cung mot giao dien.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-200">
                Mo storefront
                <ChevronRight size={16} />
              </div>
            </button>

            <div className="rounded-[28px] border border-white/70 bg-white/85 p-3 shadow-xl shadow-slate-200/40 backdrop-blur">
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(location.pathname, item.to);

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/admin"}
                      className={getNavClassName(active)}
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                          active
                            ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white"
                            : "bg-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white"
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold">{item.label}</div>
                        <div className="text-xs text-slate-400 group-hover:text-slate-500">
                          {item.description}
                        </div>
                      </div>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-slate-200">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <BarChart3 size={16} className="text-orange-300" />
                  Van hanh trong ngay
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Kiem tra nhanh menu, don dang xu ly va voucher dang chay truoc
                  khung gio cao diem.
                </p>
                <button
                  type="button"
                  onClick={onLogout}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Dang xuat admin
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <section className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur lg:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {todayLabel}
                </div>
                <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-slate-950">
                  {currentSection.label}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {currentSection.description}
                </p>
              </div>

              <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
                <div className="font-semibold">Mot cua hang, ba kieu nhan mon</div>
                <div className="mt-1 text-orange-600">
                  Delivery, pickup va dine-in da duoc gom chung trong luong admin.
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(location.pathname, item.to);

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/admin"}
                    className={getNavClassName(active, true)}
                  >
                    <Icon size={16} />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </section>

          <div className="pb-8 pt-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
