import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  LoaderCircle,
  RefreshCw,
  Search,
  TicketPercent,
  Trash2,
  Users,
} from "lucide-react";

import { buildApiUrl } from "../../config/api";
import {
  describeVoucherScope,
  formatAdminVoucherValue,
  formatPriceAdmin,
} from "./utils";

const createInitialForm = () => ({
  code: "",
  description: "",
  discountType: "percent",
  discountValue: 0,
  maxDiscountAmount: 0,
  minOrderValue: 0,
  maxUsage: 0,
  startDate: "",
  endDate: "",
  appliesToAllUsers: true,
  appliesToAllProducts: true,
  userIds: [],
  productIds: [],
  categoryIds: [],
});

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-orange-300 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]";
const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

const isExpiringSoon = (voucher) => {
  if (!voucher?.endDate) return false;
  const endDate = new Date(voucher.endDate);
  if (Number.isNaN(endDate.getTime())) return false;
  const diff = endDate.getTime() - Date.now();
  return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
};

const formatDate = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("vi-VN");
};

const getTargetSummary = (form) => {
  if (form.appliesToAllProducts) return "Toan bo menu";
  return `${form.productIds.length} mon | ${form.categoryIds.length} danh muc`;
};

export default function AdminVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(createInitialForm());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [productResults, setProductResults] = useState([]);
  const [categoryResults, setCategoryResults] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [actingVoucherId, setActingVoucherId] = useState("");

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : { headers: {} };
  };

  const loadVouchers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(buildApiUrl("/vouchers"), getAuthConfig());
      setVouchers(Array.isArray(response.data?.vouchers) ? response.data.vouchers : []);
    } catch (err) {
      console.error("Failed to load vouchers", err);
      setVouchers([]);
      setError(err?.response?.data?.message || "Khong the tai voucher.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVouchers();
  }, []);

  const filteredVouchers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return vouchers;

    return vouchers.filter((voucher) =>
      [voucher.code, voucher.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [query, vouchers]);

  const stats = useMemo(
    () => ({
      active: vouchers.filter((voucher) => voucher.isActive).length,
      expiringSoon: vouchers.filter(isExpiringSoon).length,
      targeted: vouchers.filter(
        (voucher) => !voucher.appliesToAllUsers || describeVoucherScope(voucher) !== "Toan bo menu"
      ).length,
      totalUses: vouchers.reduce(
        (sum, voucher) => sum + Number(voucher.usedCount || 0),
        0
      ),
    }),
    [vouchers]
  );

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => {
      if (type === "checkbox") {
        if (name === "appliesToAllUsers") {
          return {
            ...prev,
            appliesToAllUsers: checked,
            userIds: checked ? [] : prev.userIds,
          };
        }

        if (name === "appliesToAllProducts") {
          return {
            ...prev,
            appliesToAllProducts: checked,
            productIds: checked ? [] : prev.productIds,
            categoryIds: checked ? [] : prev.categoryIds,
          };
        }

        return { ...prev, [name]: checked };
      }

      if (
        [
          "discountValue",
          "maxDiscountAmount",
          "minOrderValue",
          "maxUsage",
        ].includes(name)
      ) {
        return { ...prev, [name]: Number(value) || 0 };
      }

      return { ...prev, [name]: value };
    });
  };

  const resetCreateForm = () => {
    setForm(createInitialForm());
    setUserResults([]);
    setProductResults([]);
    setCategoryResults([]);
    setUserSearch("");
    setProductSearch("");
    setCategorySearch("");
  };

  const handleCreateVoucher = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setSaving(true);
      const response = await axios.post(
        buildApiUrl("/vouchers"),
        {
          ...form,
          code: form.code.trim().toUpperCase(),
          discountValue:
            form.discountType === "free_shipping" ? 0 : Number(form.discountValue || 0),
          maxDiscountAmount:
            form.discountType === "percent"
              ? Number(form.maxDiscountAmount || 0)
              : 0,
          userIds: form.appliesToAllUsers ? [] : form.userIds,
          productIds: form.appliesToAllProducts ? [] : form.productIds,
          categoryIds: form.appliesToAllProducts ? [] : form.categoryIds,
        },
        getAuthConfig()
      );

      setVouchers((prev) => [response.data.voucher, ...prev]);
      setShowCreateForm(false);
      resetCreateForm();
    } catch (err) {
      console.error("Failed to create voucher", err);
      setError(err?.response?.data?.message || "Khong the tao voucher.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVoucher = async (voucherId) => {
    if (!window.confirm("Xoa voucher nay?")) return;
    setActingVoucherId(voucherId);
    setError("");

    try {
      await axios.delete(buildApiUrl(`/vouchers/${voucherId}`), getAuthConfig());
      setVouchers((prev) => prev.filter((voucher) => voucher._id !== voucherId));
    } catch (err) {
      console.error("Failed to delete voucher", err);
      setError(err?.response?.data?.message || "Khong the xoa voucher.");
    } finally {
      setActingVoucherId("");
    }
  };

  const handleToggleVoucherStatus = async (voucher) => {
    setActingVoucherId(voucher._id);
    setError("");

    try {
      const response = await axios.put(
        buildApiUrl(`/vouchers/${voucher._id}`),
        { isActive: !voucher.isActive },
        getAuthConfig()
      );

      setVouchers((prev) =>
        prev.map((item) => (item._id === voucher._id ? response.data.voucher : item))
      );
    } catch (err) {
      console.error("Failed to toggle voucher", err);
      setError(err?.response?.data?.message || "Khong the cap nhat voucher.");
    } finally {
      setActingVoucherId("");
    }
  };

  const fetchUsers = async (searchValue) => {
    setUserLoading(true);
    try {
      const response = await axios.get(buildApiUrl("/vouchers/search-users"), {
        ...getAuthConfig(),
        params: searchValue ? { q: searchValue } : {},
      });
      setUserResults(Array.isArray(response.data?.users) ? response.data.users : []);
    } catch (err) {
      console.error("Failed to search users", err);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchProducts = async (searchValue) => {
    setProductLoading(true);
    try {
      const response = await axios.get(buildApiUrl("/vouchers/search-products"), {
        ...getAuthConfig(),
        params: searchValue ? { q: searchValue } : {},
      });
      setProductResults(
        Array.isArray(response.data?.products) ? response.data.products : []
      );
    } catch (err) {
      console.error("Failed to search products", err);
    } finally {
      setProductLoading(false);
    }
  };

  const fetchCategories = async (searchValue) => {
    setCategoryLoading(true);
    try {
      const response = await axios.get(buildApiUrl("/vouchers/search-categories"), {
        ...getAuthConfig(),
        params: searchValue ? { q: searchValue } : {},
      });
      setCategoryResults(
        Array.isArray(response.data?.categories) ? response.data.categories : []
      );
    } catch (err) {
      console.error("Failed to search categories", err);
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    if (!userModalOpen) return undefined;
    const timeoutId = setTimeout(() => fetchUsers(userSearch), 300);
    return () => clearTimeout(timeoutId);
  }, [userModalOpen, userSearch]);

  useEffect(() => {
    if (!productModalOpen) return undefined;
    const timeoutId = setTimeout(() => fetchProducts(productSearch), 300);
    return () => clearTimeout(timeoutId);
  }, [productModalOpen, productSearch]);

  useEffect(() => {
    if (!categoryModalOpen) return undefined;
    const timeoutId = setTimeout(() => fetchCategories(categorySearch), 300);
    return () => clearTimeout(timeoutId);
  }, [categoryModalOpen, categorySearch]);

  const openUserModal = () => {
    setUserModalOpen(true);
    setUserSearch("");
    fetchUsers("");
  };

  const openProductModal = () => {
    setProductModalOpen(true);
    setProductSearch("");
    fetchProducts("");
  };

  const openCategoryModal = () => {
    setCategoryModalOpen(true);
    setCategorySearch("");
    fetchCategories("");
  };

  const toggleUserSelection = (userId) => {
    setForm((prev) => ({
      ...prev,
      appliesToAllUsers: false,
      userIds: prev.userIds.includes(userId)
        ? prev.userIds.filter((item) => item !== userId)
        : [...prev.userIds, userId],
    }));
  };

  const toggleProductSelection = (productId) => {
    setForm((prev) => ({
      ...prev,
      appliesToAllProducts: false,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter((item) => item !== productId)
        : [...prev.productIds, productId],
    }));
  };

  const toggleCategorySelection = (categoryId) => {
    setForm((prev) => ({
      ...prev,
      appliesToAllProducts: false,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((item) => item !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 p-6 text-white shadow-2xl shadow-slate-900/15">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-100">
              Promotion center
            </div>
            <h2 className="mt-4 font-display text-3xl font-black tracking-tight">
              FireBite Voucher Desk
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Quan ly voucher toan cua hang, free ship, target user va uu dai theo
              tung mon hoac danh muc menu.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-[1.01]"
          >
            <TicketPercent size={16} />
            Tao voucher moi
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Dang hoat dong", value: stats.active },
            { label: "Sap het han", value: stats.expiringSoon },
            { label: "Voucher target", value: stats.targeted },
            { label: "Tong luot su dung", value: stats.totalUses },
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
          <label className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tim theo ma hoac mo ta voucher..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3 text-sm text-slate-700 outline-none transition-all focus:border-orange-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
            />
          </label>

          <button
            type="button"
            onClick={loadVouchers}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Tai lai
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
      </section>

      {loading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-56 animate-pulse rounded-[28px] border border-slate-100 bg-white"
            />
          ))}
        </div>
      ) : filteredVouchers.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-slate-200 bg-white/80 p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-600">
            <TicketPercent size={28} />
          </div>
          <h3 className="mt-4 font-display text-2xl font-black text-slate-900">
            Chua co voucher nao
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Tao voucher moi de bat dau campaign cho cua hang.
          </p>
        </section>
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {filteredVouchers.map((voucher) => (
            <article
              key={voucher._id}
              className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-200/30 backdrop-blur"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    {voucher.code}
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-black text-slate-950">
                    {formatAdminVoucherValue(voucher)}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {voucher.description || "Khong co mo ta cho voucher nay."}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    voucher.isActive
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border border-slate-200 bg-slate-100 text-slate-600"
                  }`}
                >
                  {voucher.isActive ? "Dang hoat dong" : "Tam tat"}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Don toi thieu
                  </div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {voucher.minOrderValue
                      ? formatPriceAdmin(voucher.minOrderValue)
                      : "Khong gioi han"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Luot su dung
                  </div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {voucher.usedCount || 0}
                    {voucher.maxUsage ? ` / ${voucher.maxUsage}` : " lan"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Hieu luc
                  </div>
                  <div className="mt-1 text-sm font-medium text-slate-700">
                    {formatDate(voucher.startDate)} - {formatDate(voucher.endDate)}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Pham vi
                  </div>
                  <div className="mt-1 text-sm font-medium text-slate-700">
                    {voucher.appliesToAllUsers
                      ? "Tat ca user"
                      : `${voucher.users?.length || 0} user`}
                    {" | "}
                    {describeVoucherScope(voucher)}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleVoucherStatus(voucher)}
                  disabled={actingVoucherId === voucher._id}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
                >
                  {actingVoucherId === voucher._id ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : null}
                  {voucher.isActive ? "Tam tat voucher" : "Kich hoat voucher"}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteVoucher(voucher._id)}
                  disabled={actingVoucherId === voucher._id}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-60"
                >
                  {actingVoucherId === voucher._id ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Xoa voucher
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {showCreateForm ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="max-h-[94vh] w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/10 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_50%,#f8fafc_100%)] px-6 py-5">
              <div>
                <div className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-700">
                  Tao voucher moi
                </div>
                <h3 className="mt-3 font-display text-2xl font-black text-slate-950">
                  FireBite promotion builder
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Chon muc giam, thoi gian va pham vi ap dung cho voucher.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  resetCreateForm();
                }}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Dong
              </button>
            </div>

            <form
              onSubmit={handleCreateVoucher}
              className="max-h-[calc(94vh-92px)] overflow-y-auto p-6"
            >
              <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <section className="rounded-[24px] border border-slate-100 bg-slate-50/70 p-5">
                    <h4 className="font-semibold text-slate-950">Thong tin voucher</h4>
                    <div className="mt-4 grid gap-4">
                      <div>
                        <label className={labelClass}>Ma voucher</label>
                        <input
                          name="code"
                          value={form.code}
                          onChange={handleFormChange}
                          className={inputClass}
                          placeholder="FIREBITE20"
                          required
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Mo ta</label>
                        <input
                          name="description"
                          value={form.description}
                          onChange={handleFormChange}
                          className={inputClass}
                          placeholder="Giam 20% cho combo bua trua"
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className={labelClass}>Loai giam gia</label>
                          <select
                            name="discountType"
                            value={form.discountType}
                            onChange={handleFormChange}
                            className={inputClass}
                          >
                            <option value="percent">Giam theo %</option>
                            <option value="amount">Giam so tien</option>
                            <option value="free_shipping">Free shipping</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>
                            {form.discountType === "percent"
                              ? "Gia tri (%)"
                              : form.discountType === "amount"
                              ? "Gia tri (VND)"
                              : "Gia tri"}
                          </label>
                          <input
                            type="number"
                            min="0"
                            name="discountValue"
                            value={
                              form.discountType === "free_shipping"
                                ? 0
                                : form.discountValue
                            }
                            onChange={handleFormChange}
                            disabled={form.discountType === "free_shipping"}
                            className={inputClass}
                          />
                        </div>
                      </div>
                      {form.discountType === "percent" ? (
                        <div>
                          <label className={labelClass}>Giam toi da (VND)</label>
                          <input
                            type="number"
                            min="0"
                            name="maxDiscountAmount"
                            value={form.maxDiscountAmount}
                            onChange={handleFormChange}
                            className={inputClass}
                          />
                        </div>
                      ) : null}
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-slate-100 bg-slate-50/70 p-5">
                    <h4 className="font-semibold text-slate-950">Dieu kien ap dung</h4>
                    <div className="mt-4 grid gap-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className={labelClass}>Don toi thieu (VND)</label>
                          <input
                            type="number"
                            min="0"
                            name="minOrderValue"
                            value={form.minOrderValue}
                            onChange={handleFormChange}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>So luot toi da</label>
                          <input
                            type="number"
                            min="0"
                            name="maxUsage"
                            value={form.maxUsage}
                            onChange={handleFormChange}
                            className={inputClass}
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className={labelClass}>Ngay bat dau</label>
                          <input
                            type="date"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleFormChange}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Ngay ket thuc</label>
                          <input
                            type="date"
                            name="endDate"
                            value={form.endDate}
                            onChange={handleFormChange}
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                <section className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-[24px] border border-slate-100 bg-white p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-slate-950">Target user</h4>
                        <p className="mt-1 text-sm text-slate-500">
                          Chon toan bo user hoac nhom user cu the.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={openUserModal}
                        disabled={form.appliesToAllUsers}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                      >
                        <Users size={16} />
                        Chon user
                      </button>
                    </div>

                    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="appliesToAllUsers"
                        checked={form.appliesToAllUsers}
                        onChange={handleFormChange}
                      />
                      <span>Ap dung cho tat ca user</span>
                    </div>

                    {!form.appliesToAllUsers ? (
                      <div className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-500">
                        Da chon {form.userIds.length} user
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-[24px] border border-slate-100 bg-white p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-slate-950">Target menu</h4>
                        <p className="mt-1 text-sm text-slate-500">
                          Chon toan bo menu hoac mot nhom mon cu the.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        name="appliesToAllProducts"
                        checked={form.appliesToAllProducts}
                        onChange={handleFormChange}
                      />
                      <span>Ap dung cho toan bo menu</span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={openProductModal}
                        disabled={form.appliesToAllProducts}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                      >
                        Chon mon
                      </button>
                      <button
                        type="button"
                        onClick={openCategoryModal}
                        disabled={form.appliesToAllProducts}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                      >
                        Chon danh muc
                      </button>
                    </div>

                    {!form.appliesToAllProducts ? (
                      <div className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-500">
                        {getTargetSummary(form)}
                      </div>
                    ) : null}
                  </div>
                </section>

                {error ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                ) : null}

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      resetCreateForm();
                    }}
                    className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Huy
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-[1.01] disabled:opacity-60"
                  >
                    {saving ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : null}
                    Tao voucher
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {userModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-semibold text-slate-950">Chon user</h3>
              <button
                type="button"
                onClick={() => setUserModalOpen(false)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Dong
              </button>
            </div>
            <div className="space-y-4 p-6">
              <input
                type="text"
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
                placeholder="Tim theo ten, username hoac email"
                className={inputClass}
              />

              <div className="max-h-[52vh] overflow-y-auto rounded-[24px] border border-slate-100">
                {userLoading ? (
                  <div className="p-4 text-sm text-slate-400">Dang tai user...</div>
                ) : userResults.length > 0 ? (
                  userResults.map((user) => (
                    <label
                      key={user._id}
                      className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={form.userIds.includes(user._id)}
                        onChange={() => toggleUserSelection(user._id)}
                      />
                      <span>
                        {user.fullname || user.username} ({user.email})
                      </span>
                    </label>
                  ))
                ) : (
                  <div className="p-4 text-sm text-slate-400">Khong tim thay user.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {productModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-semibold text-slate-950">Chon mon ap dung</h3>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Dong
              </button>
            </div>
            <div className="space-y-4 p-6">
              <input
                type="text"
                value={productSearch}
                onChange={(event) => setProductSearch(event.target.value)}
                placeholder="Tim theo ten mon..."
                className={inputClass}
              />

              <div className="max-h-[52vh] overflow-y-auto rounded-[24px] border border-slate-100">
                {productLoading ? (
                  <div className="p-4 text-sm text-slate-400">Dang tai menu...</div>
                ) : productResults.length > 0 ? (
                  productResults.map((product) => (
                    <label
                      key={product._id}
                      className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={form.productIds.includes(product._id)}
                        onChange={() => toggleProductSelection(product._id)}
                      />
                      <span>{product.name}</span>
                    </label>
                  ))
                ) : (
                  <div className="p-4 text-sm text-slate-400">
                    Khong tim thay mon phu hop.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {categoryModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-semibold text-slate-950">Chon danh muc ap dung</h3>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Dong
              </button>
            </div>
            <div className="space-y-4 p-6">
              <input
                type="text"
                value={categorySearch}
                onChange={(event) => setCategorySearch(event.target.value)}
                placeholder="Tim theo ten danh muc..."
                className={inputClass}
              />

              <div className="max-h-[52vh] overflow-y-auto rounded-[24px] border border-slate-100">
                {categoryLoading ? (
                  <div className="p-4 text-sm text-slate-400">
                    Dang tai danh muc...
                  </div>
                ) : categoryResults.length > 0 ? (
                  categoryResults.map((category) => (
                    <label
                      key={category._id}
                      className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={form.categoryIds.includes(category._id)}
                        onChange={() => toggleCategorySelection(category._id)}
                      />
                      <span>{category.name}</span>
                    </label>
                  ))
                ) : (
                  <div className="p-4 text-sm text-slate-400">
                    Khong tim thay danh muc phu hop.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
