import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FolderTree,
  LoaderCircle,
  PencilLine,
  Plus,
  Power,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { buildApiUrl } from "../../config/api";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-orange-300 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]";
const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

const createEmptyForm = () => ({
  name: "",
  slug: "",
  icon: "",
  image: "",
  subcategoriesText: "",
  isActive: true,
});

const normalizeForm = (category = {}) => ({
  name: category.name || "",
  slug: category.slug || "",
  icon: category.icon || "",
  image: category.image || "",
  subcategoriesText: Array.isArray(category.subcategories)
    ? category.subcategories.join("\n")
    : "",
  isActive: category.isActive !== false,
});

const buildPayload = (form = {}) => ({
  name: form.name.trim(),
  slug: form.slug.trim(),
  icon: form.icon.trim(),
  image: form.image.trim(),
  subcategories: form.subcategoriesText
    .split(/[\r\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean),
  isActive: form.isActive,
});

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actingId, setActingId] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(createEmptyForm);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return { headers: token ? { Authorization: `Bearer ${token}` } : {} };
  };

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(buildApiUrl("/admin/categories"), getAuthConfig());
      setCategories(
        Array.isArray(response.data?.categories) ? response.data.categories : []
      );
    } catch (err) {
      console.error("Failed to load categories", err);
      setError(err?.response?.data?.message || "Không thể tải danh mục.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return categories;

    return categories.filter((category) =>
      [category.name, category.slug, ...(category.subcategories || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [categories, query]);

  const stats = useMemo(
    () => ({
      total: categories.length,
      active: categories.filter((category) => category.isActive !== false).length,
      hidden: categories.filter((category) => category.isActive === false).length,
      withImage: categories.filter((category) => category.icon || category.image).length,
    }),
    [categories]
  );

  const openCreateForm = () => {
    setEditingId("");
    setForm(createEmptyForm());
    setError("");
    setShowForm(true);
  };

  const openEditForm = (category) => {
    setEditingId(category._id);
    setForm(normalizeForm(category));
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId("");
    setForm(createEmptyForm());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Tên danh mục không được để trống.");
      return;
    }

    setSaving(true);

    try {
      const payload = buildPayload(form);
      if (editingId) {
        await axios.put(buildApiUrl(`/categories/${editingId}`), payload, getAuthConfig());
      } else {
        await axios.post(buildApiUrl("/categories"), payload, getAuthConfig());
      }

      await loadCategories();
      closeForm();
    } catch (err) {
      console.error("Failed to save category", err);
      setError(err?.response?.data?.message || "Không thể lưu danh mục.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (category) => {
    setActingId(category._id);
    setError("");

    try {
      if (category.isActive === false) {
        await axios.put(
          buildApiUrl(`/categories/${category._id}`),
          { isActive: true },
          getAuthConfig()
        );
      } else {
        if (!window.confirm("Ẩn danh mục này khỏi storefront?")) return;
        await axios.delete(buildApiUrl(`/categories/${category._id}`), getAuthConfig());
      }

      await loadCategories();
    } catch (err) {
      console.error("Failed to toggle category", err);
      setError(err?.response?.data?.message || "Không thể cập nhật danh mục.");
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
              Menu taxonomy
            </div>
            <h2 className="mt-4 font-display text-3xl font-black tracking-tight">
              FireBite Category Desk
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Quan ly nhom mon an, icon va trang thai hien thi tren storefront.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-[1.01]"
          >
            <Plus size={18} />
            Thêm danh mục
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Tổng danh mục", value: stats.total },
            { label: "Đang hiển thị", value: stats.active },
            { label: "Đang ẩn", value: stats.hidden },
            { label: "Co hinh/icon", value: stats.withImage },
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
              placeholder="Tim theo ten, slug hoac danh muc con..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3 text-sm text-slate-700 outline-none transition-all focus:border-orange-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
            />
          </label>

          <button
            type="button"
            onClick={loadCategories}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Tải lại
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
              className="h-52 animate-pulse rounded-[28px] border border-slate-100 bg-white"
            />
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-slate-200 bg-white/80 p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-600">
            <FolderTree size={28} />
          </div>
          <h3 className="mt-4 font-display text-2xl font-black text-slate-900">
            Không tìm thấy danh mục
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Thử đổi từ khóa tìm kiếm hoặc tạo danh mục mới.
          </p>
        </section>
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {filteredCategories.map((category) => (
            <article
              key={category._id || category.slug}
              className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-200/30 backdrop-blur"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-orange-100 bg-orange-50 text-orange-600">
                    {category.icon || category.image ? (
                      <img
                        src={category.icon || category.image}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FolderTree size={24} />
                    )}
                  </div>
                  <div>
                    <div className="inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                      {category.slug}
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-black text-slate-950">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {(category.subcategories || []).length > 0
                        ? category.subcategories.join(", ")
                        : "Chưa có danh mục con."}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    category.isActive !== false
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border border-slate-200 bg-slate-100 text-slate-600"
                  }`}
                >
                  {category.isActive !== false ? "Đang hiển thị" : "Đang ẩn"}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openEditForm(category)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <PencilLine size={16} />
                  Chỉnh sửa
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleActive(category)}
                  disabled={actingId === category._id}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-60"
                >
                  {actingId === category._id ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : category.isActive === false ? (
                    <Power size={16} />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  {category.isActive === false ? "Bật lại" : "Ẩn danh mục"}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {showForm ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="max-h-[94vh] w-full max-w-3xl overflow-hidden rounded-[30px] border border-white/10 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_50%,#f8fafc_100%)] px-6 py-5">
              <div>
                <div className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-700">
                  {editingId ? "Cập nhật danh mục" : "Tạo danh mục"}
                </div>
                <h3 className="mt-3 font-display text-2xl font-black text-slate-950">
                  {editingId ? "Chỉnh sửa category" : "Thêm category vào menu"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(94vh-92px)] space-y-5 overflow-y-auto p-6"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Ten danh muc</label>
                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                    className={inputClass}
                    placeholder="Burger"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Slug</label>
                  <input
                    value={form.slug}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, slug: event.target.value }))
                    }
                    className={inputClass}
                    placeholder="Tự động sinh nếu để trống"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Icon URL</label>
                  <input
                    value={form.icon}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, icon: event.target.value }))
                    }
                    className={inputClass}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className={labelClass}>Image URL</label>
                  <input
                    value={form.image}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, image: event.target.value }))
                    }
                    className={inputClass}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Danh mục con</label>
                <textarea
                  value={form.subcategoriesText}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      subcategoriesText: event.target.value,
                    }))
                  }
                  className={`${inputClass} min-h-[120px] resize-y`}
                  placeholder="Mỗi dòng một danh mục con"
                />
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, isActive: event.target.checked }))
                  }
                />
                <span>Hien thi tren storefront</span>
              </label>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-[1.01] disabled:opacity-60"
                >
                  {saving ? <LoaderCircle size={16} className="animate-spin" /> : null}
                  {editingId ? "Cập nhật" : "Tạo danh mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
