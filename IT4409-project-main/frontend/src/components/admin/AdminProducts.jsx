import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Clock3,
  Flame,
  ImagePlus,
  LoaderCircle,
  Package2,
  PencilLine,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { clearProductsCache } from "../../api/productsApi";
import { buildApiUrl } from "../../config/api";
import { categories } from "../../data/categories";
import { formatPriceAdmin } from "./utils";

const ITEM_TYPE_OPTIONS = [
  { value: "single", label: "Mon le" },
  { value: "combo", label: "Combo" },
  { value: "drink", label: "Do uong" },
  { value: "side", label: "Mon phu" },
  { value: "dessert", label: "Trang mieng" },
];

const SPICE_LEVEL_OPTIONS = [
  { value: "", label: "Khong chon" },
  { value: "none", label: "Khong cay" },
  { value: "mild", label: "Cay nhe" },
  { value: "medium", label: "Cay vua" },
  { value: "hot", label: "Cay dam" },
];

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-orange-300 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]";
const textareaClass = `${inputClass} min-h-[120px] resize-y`;
const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

const createEmptySize = () => ({
  label: "",
  priceModifier: "0",
  isDefault: false,
});

const createEmptyAddon = () => ({
  label: "",
  price: "0",
  maxQuantity: "1",
  isAvailable: true,
});

const createEmptyForm = () => ({
  name: "",
  slug: "",
  category: "combo",
  itemType: "single",
  description: "",
  price: "",
  discountPrice: "",
  stock: "0",
  preparationTime: "15",
  spiceLevel: "",
  sizes: [createEmptySize()],
  addons: [createEmptyAddon()],
  comboItemsText: "",
  badgesText: "",
  highlightsText: "",
  isAvailable: true,
  isActive: true,
  isBestSeller: false,
  isNew: false,
  existingImages: [],
  imageFiles: [],
});

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const splitTextLines = (value) =>
  String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

const splitTags = (value) =>
  String(value || "")
    .split(/[\r\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const sanitizeSizes = (sizes) => {
  const nextSizes = (Array.isArray(sizes) ? sizes : [])
    .map((size) => ({
      label: String(size.label || "").trim(),
      priceModifier: toNumber(size.priceModifier, 0),
      isDefault: Boolean(size.isDefault),
    }))
    .filter((size) => size.label);

  if (nextSizes.length > 0 && !nextSizes.some((size) => size.isDefault)) {
    nextSizes[0].isDefault = true;
  }

  return nextSizes;
};

const sanitizeAddons = (addons) =>
  (Array.isArray(addons) ? addons : [])
    .map((addon) => ({
      label: String(addon.label || "").trim(),
      price: toNumber(addon.price, 0),
      maxQuantity: Math.max(1, toNumber(addon.maxQuantity, 1)),
      isAvailable: addon.isAvailable !== false,
    }))
    .filter((addon) => addon.label);

const normalizeProductForForm = (product) => ({
  name: product.name || "",
  slug: product.slug || "",
  category:
    product.category?.slug || product.category?.name || product.category || "combo",
  itemType: product.itemType || "single",
  description: product.description || "",
  price: String(product.price ?? ""),
  discountPrice:
    product.discountPrice === undefined || product.discountPrice === null
      ? ""
      : String(product.discountPrice),
  stock: String(product.stock ?? 0),
  preparationTime: String(product.preparationTime ?? 15),
  spiceLevel: product.spiceLevel || "",
  sizes:
    Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes.map((size) => ({
          label: size.label || "",
          priceModifier: String(size.priceModifier ?? 0),
          isDefault: Boolean(size.isDefault),
        }))
      : [createEmptySize()],
  addons:
    Array.isArray(product.addons) && product.addons.length > 0
      ? product.addons.map((addon) => ({
          label: addon.label || "",
          price: String(addon.price ?? 0),
          maxQuantity: String(addon.maxQuantity ?? 1),
          isAvailable: addon.isAvailable !== false,
        }))
      : [createEmptyAddon()],
  comboItemsText: Array.isArray(product.comboItems)
    ? product.comboItems.join("\n")
    : "",
  badgesText: Array.isArray(product.badges) ? product.badges.join(", ") : "",
  highlightsText: Array.isArray(product.highlights)
    ? product.highlights.join("\n")
    : "",
  isAvailable: product.isAvailable !== false,
  isActive: product.isActive !== false,
  isBestSeller: Boolean(product.isBestSeller),
  isNew: Boolean(product.isNew),
  existingImages: Array.isArray(product.images) ? product.images : [],
  imageFiles: [],
});

const buildProductPayload = (formState) => {
  const payload = new FormData();
  const sizes = sanitizeSizes(formState.sizes);
  const addons = sanitizeAddons(formState.addons);

  payload.append("name", formState.name.trim());
  payload.append("slug", formState.slug.trim());
  payload.append("category", formState.category);
  payload.append("itemType", formState.itemType);
  payload.append("description", formState.description.trim());
  payload.append("price", String(toNumber(formState.price, 0)));
  payload.append(
    "discountPrice",
    formState.discountPrice === "" ? "" : String(toNumber(formState.discountPrice, 0))
  );
  payload.append("stock", String(Math.max(0, toNumber(formState.stock, 0))));
  payload.append(
    "preparationTime",
    String(Math.max(0, toNumber(formState.preparationTime, 15)))
  );
  payload.append("spiceLevel", formState.spiceLevel);
  payload.append("sizes", JSON.stringify(sizes));
  payload.append("addons", JSON.stringify(addons));
  payload.append("comboItems", JSON.stringify(splitTextLines(formState.comboItemsText)));
  payload.append("badges", JSON.stringify(splitTags(formState.badgesText)));
  payload.append("highlights", JSON.stringify(splitTextLines(formState.highlightsText)));
  payload.append("isAvailable", String(formState.isAvailable));
  payload.append("isActive", String(formState.isActive));
  payload.append("isBestSeller", String(formState.isBestSeller));
  payload.append("isNew", String(formState.isNew));

  formState.imageFiles.forEach((file) => {
    payload.append("images", file);
  });

  return payload;
};

const getProductImage = (product) => product.images?.[0] || product.image || "";

const getProductSearchTarget = (product) =>
  [
    product.name,
    product.description,
    product.itemType,
    product.category?.name,
    product.category?.slug,
    ...(Array.isArray(product.badges) ? product.badges : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState(createEmptyForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [filters, setFilters] = useState({
    query: "",
    category: "all",
    availability: "all",
  });

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(buildApiUrl("/products"));
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to load products", err);
      setProducts([]);
      setError(err?.response?.data?.message || "Khong the tai menu hien tai.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        !query || getProductSearchTarget(product).includes(query);

      const productCategory =
        product.category?.slug || product.category?.name || product.category || "";
      const matchesCategory =
        filters.category === "all" || String(productCategory) === filters.category;

      const matchesAvailability =
        filters.availability === "all" ||
        (filters.availability === "available"
          ? product.isAvailable !== false
          : product.isAvailable === false);

      return matchesQuery && matchesCategory && matchesAvailability;
    });
  }, [filters, products]);

  const stats = useMemo(
    () => ({
      total: products.length,
      available: products.filter((product) => product.isAvailable !== false).length,
      bestseller: products.filter((product) => product.isBestSeller).length,
      combos: products.filter((product) => product.itemType === "combo").length,
    }),
    [products]
  );

  const openCreateForm = () => {
    setEditingProductId(null);
    setFormState(createEmptyForm());
    setError("");
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProductId(product._id);
    setFormState(normalizeProductForForm(product));
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProductId(null);
    setFormState(createEmptyForm());
  };

  const updateField = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const updateDynamicItem = (field, index, key, value) => {
    setFormState((prev) => {
      const next = [...prev[field]];
      const current = { ...next[index], [key]: value };

      if (field === "sizes" && key === "isDefault" && value) {
        next.forEach((item, itemIndex) => {
          next[itemIndex] = { ...item, isDefault: itemIndex === index };
        });
        return { ...prev, [field]: next };
      }

      next[index] = current;
      return { ...prev, [field]: next };
    });
  };

  const addDynamicItem = (field, factory) => {
    setFormState((prev) => ({
      ...prev,
      [field]: [...prev[field], factory()],
    }));
  };

  const removeDynamicItem = (field, index) => {
    setFormState((prev) => {
      const next = prev[field].filter((_, itemIndex) => itemIndex !== index);
      return {
        ...prev,
        [field]: next.length > 0 ? next : [field === "sizes" ? createEmptySize() : createEmptyAddon()],
      };
    });
  };

  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files || []);
    setFormState((prev) => ({ ...prev, imageFiles: files }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formState.name.trim()) {
      setError("Ten mon khong duoc de trong.");
      return;
    }

    if (!formState.category) {
      setError("Can chon danh muc.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Can dang nhap admin de cap nhat menu.");
      return;
    }

    setSaving(true);

    try {
      const payload = buildProductPayload(formState);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingProductId) {
        await axios.put(buildApiUrl(`/products/${editingProductId}`), payload, config);
      } else {
        await axios.post(buildApiUrl("/products"), payload, config);
      }

      clearProductsCache();
      await loadProducts();
      closeForm();
    } catch (err) {
      console.error("Failed to save product", err);
      setError(err?.response?.data?.message || "Khong the luu mon an.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Can dang nhap admin de xoa mon an.");
      return;
    }

    if (!window.confirm("Xoa mon nay khoi menu?")) return;

    setDeletingId(productId);
    setError("");

    try {
      await axios.delete(buildApiUrl(`/products/${productId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      clearProductsCache();
      await loadProducts();
    } catch (err) {
      console.error("Failed to delete product", err);
      setError(err?.response?.data?.message || "Khong the xoa mon an.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 p-6 text-white shadow-2xl shadow-slate-900/15">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-100">
              Quan ly menu
            </div>
            <h2 className="mt-4 font-display text-3xl font-black tracking-tight">
              FireBite Menu Studio
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Tao va chinh sua burger, ga ran, combo, do uong va add-on trong
              cung mot workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:scale-[1.01]"
          >
            <Plus size={18} />
            Them mon moi
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: Package2,
              label: "Tong mon",
              value: stats.total,
              accent: "from-orange-500 to-rose-500",
            },
            {
              icon: Sparkles,
              label: "Dang phuc vu",
              value: stats.available,
              accent: "from-emerald-500 to-lime-500",
            },
            {
              icon: Flame,
              label: "Best seller",
              value: stats.bestseller,
              accent: "from-amber-500 to-orange-500",
            },
            {
              icon: Clock3,
              label: "Combo / nhom",
              value: stats.combos,
              accent: "from-cyan-500 to-sky-500",
            },
          ].map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-white`}
                >
                  <Icon size={18} />
                </div>
                <div className="mt-4 text-sm text-slate-300">{card.label}</div>
                <div className="mt-1 font-display text-3xl font-black">
                  {card.value}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-200/40 backdrop-blur">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid flex-1 gap-3 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
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
                placeholder="Tim theo ten mon, category, badge..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3 text-sm text-slate-700 outline-none transition-all focus:border-orange-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(249,115,22,0.08)]"
              />
            </label>

            <select
              value={filters.category}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, category: event.target.value }))
              }
              className={inputClass}
            >
              <option value="all">Tat ca danh muc</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={filters.availability}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  availability: event.target.value,
                }))
              }
              className={inputClass}
            >
              <option value="all">Tat ca trang thai</option>
              <option value="available">Dang ban</option>
              <option value="hidden">Tam an / het mon</option>
            </select>
          </div>

          <button
            type="button"
            onClick={loadProducts}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
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
              className="h-72 rounded-[28px] border border-slate-100 bg-white shadow-sm animate-pulse"
            />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <section className="rounded-[28px] border border-dashed border-slate-200 bg-white/80 p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-600">
            <Package2 size={28} />
          </div>
          <h3 className="mt-4 font-display text-2xl font-black text-slate-900">
            Chua co mon phu hop
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Thu doi bo loc hoac them mon moi vao menu FireBite.
          </p>
        </section>
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {filteredProducts.map((product) => {
            const displayPrice = product.discountPrice ?? product.price ?? 0;
            const productImage = getProductImage(product);

            return (
              <article
                key={product._id}
                className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/30 backdrop-blur transition-transform hover:-translate-y-0.5"
              >
                <div className="relative h-56 overflow-hidden bg-slate-200">
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                      FireBite
                    </div>
                  )}

                  <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        {ITEM_TYPE_OPTIONS.find((item) => item.value === product.itemType)?.label ||
                          product.itemType}
                      </span>
                      {product.category?.name ? (
                        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
                          {product.category.name}
                        </span>
                      ) : null}
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.isAvailable !== false
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-900/70 text-white"
                      }`}
                    >
                      {product.isAvailable !== false ? "Dang ban" : "Tam an"}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl font-black text-slate-950">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {(product.description || "Chua co mo ta cho mon nay.").slice(
                          0,
                          140
                        )}
                        {product.description && product.description.length > 140
                          ? "..."
                          : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl font-black text-slate-950">
                        {formatPriceAdmin(displayPrice)}
                      </div>
                      {product.discountPrice && product.discountPrice < product.price ? (
                        <div className="mt-1 text-xs font-medium text-slate-400 line-through">
                          {formatPriceAdmin(product.price)}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Stock
                      </div>
                      <div className="mt-1 text-lg font-semibold text-slate-900">
                        {product.stock ?? 0}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Prep time
                      </div>
                      <div className="mt-1 text-lg font-semibold text-slate-900">
                        {product.preparationTime ?? 15} phut
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Toppings
                      </div>
                      <div className="mt-1 text-lg font-semibold text-slate-900">
                        {product.addons?.length || 0}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(product.badges || []).slice(0, 4).map((badge) => (
                      <span
                        key={`${product._id}-${badge}`}
                        className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEditForm(product)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <PencilLine size={16} />
                      Chinh sua
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product._id)}
                      disabled={deletingId === product._id}
                      className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-60"
                    >
                      {deletingId === product._id ? (
                        <LoaderCircle size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      Xoa mon
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {showForm ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="max-h-[94vh] w-full max-w-6xl overflow-hidden rounded-[30px] border border-white/10 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_50%,#f8fafc_100%)] px-6 py-5">
              <div>
                <div className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-700">
                  {editingProductId ? "Cap nhat mon" : "Tao mon moi"}
                </div>
                <h3 className="mt-3 font-display text-2xl font-black text-slate-950">
                  {editingProductId
                    ? "Chinh sua menu item"
                    : "Them item vao FireBite"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Upload anh moi neu can thay bo gallery hien tai.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[calc(94vh-92px)] overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <section className="rounded-[24px] border border-slate-100 bg-slate-50/70 p-5">
                    <h4 className="font-semibold text-slate-950">Thong tin co ban</h4>
                    <div className="mt-4 grid gap-4">
                      <div>
                        <label className={labelClass}>Ten mon</label>
                        <input
                          type="text"
                          value={formState.name}
                          onChange={(event) => updateField("name", event.target.value)}
                          className={inputClass}
                          placeholder="Vi du: Burger ga gion mat ong"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Slug (khong bat buoc)</label>
                        <input
                          type="text"
                          value={formState.slug}
                          onChange={(event) => updateField("slug", event.target.value)}
                          className={inputClass}
                          placeholder="Tu dong sinh neu de trong"
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className={labelClass}>Danh muc</label>
                          <select
                            value={formState.category}
                            onChange={(event) => updateField("category", event.target.value)}
                            className={inputClass}
                          >
                            {categories.map((category) => (
                              <option key={category.slug} value={category.slug}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Loai item</label>
                          <select
                            value={formState.itemType}
                            onChange={(event) => updateField("itemType", event.target.value)}
                            className={inputClass}
                          >
                            {ITEM_TYPE_OPTIONS.map((item) => (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Mo ta mon</label>
                        <textarea
                          value={formState.description}
                          onChange={(event) =>
                            updateField("description", event.target.value)
                          }
                          className={textareaClass}
                          placeholder="Mo ta huong vi, thanh phan, phong cach phuc vu..."
                        />
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-slate-100 bg-slate-50/70 p-5">
                    <h4 className="font-semibold text-slate-950">Gia va van hanh</h4>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <label className={labelClass}>Gia goc</label>
                        <input
                          type="number"
                          min="0"
                          value={formState.price}
                          onChange={(event) => updateField("price", event.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Gia khuyen mai</label>
                        <input
                          type="number"
                          min="0"
                          value={formState.discountPrice}
                          onChange={(event) =>
                            updateField("discountPrice", event.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Stock</label>
                        <input
                          type="number"
                          min="0"
                          value={formState.stock}
                          onChange={(event) => updateField("stock", event.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Thoi gian chuan bi (phut)</label>
                        <input
                          type="number"
                          min="0"
                          value={formState.preparationTime}
                          onChange={(event) =>
                            updateField("preparationTime", event.target.value)
                          }
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Muc do cay</label>
                        <select
                          value={formState.spiceLevel}
                          onChange={(event) =>
                            updateField("spiceLevel", event.target.value)
                          }
                          className={inputClass}
                        >
                          {SPICE_LEVEL_OPTIONS.map((option) => (
                            <option key={option.value || "empty"} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {[
                        { key: "isAvailable", label: "Dang ban" },
                        { key: "isActive", label: "Hien tren storefront" },
                        { key: "isBestSeller", label: "Best seller" },
                        { key: "isNew", label: "Gan nhan mon moi" },
                      ].map((flag) => (
                        <label
                          key={flag.key}
                          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700"
                        >
                          <input
                            type="checkbox"
                            checked={formState[flag.key]}
                            onChange={(event) =>
                              updateField(flag.key, event.target.checked)
                            }
                          />
                          <span>{flag.label}</span>
                        </label>
                      ))}
                    </div>
                  </section>
                </div>

                <section className="rounded-[24px] border border-slate-100 bg-white p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-950">Hinh anh menu</h4>
                      <p className="mt-1 text-sm text-slate-500">
                        Upload toi da 6 anh. Neu cap nhat va tai anh moi, bo anh cu se
                        duoc thay the.
                      </p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                      <ImagePlus size={16} />
                      Chon anh
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFilesChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Gallery hien tai
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                        {formState.existingImages.length > 0 ? (
                          formState.existingImages.map((image, index) => (
                            <div
                              key={`${image}-${index}`}
                              className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                            >
                              <img
                                src={image}
                                alt={`Existing ${index + 1}`}
                                className="h-24 w-full object-cover"
                              />
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-400">
                            Chua co anh duoc luu cho mon nay.
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        File sap upload
                      </div>
                      <div className="mt-3 rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 p-4">
                        {formState.imageFiles.length > 0 ? (
                          <div className="space-y-2 text-sm text-slate-600">
                            {formState.imageFiles.map((file) => (
                              <div
                                key={`${file.name}-${file.lastModified}`}
                                className="rounded-2xl border border-slate-200 bg-white px-3 py-2"
                              >
                                {file.name}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-slate-400">
                            Chua chon file moi.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-[24px] border border-slate-100 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-950">Sizes</h4>
                    <button
                      type="button"
                      onClick={() => addDynamicItem("sizes", createEmptySize)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <Plus size={16} />
                      Them size
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {formState.sizes.map((size, index) => (
                      <div
                        key={`size-${index}`}
                        className="grid gap-3 rounded-[22px] border border-slate-100 bg-slate-50/80 p-4 lg:grid-cols-[1.6fr_1fr_auto_auto]"
                      >
                        <input
                          type="text"
                          value={size.label}
                          onChange={(event) =>
                            updateDynamicItem("sizes", index, "label", event.target.value)
                          }
                          className={inputClass}
                          placeholder="Regular / Large / 5 mieng"
                        />
                        <input
                          type="number"
                          min="0"
                          value={size.priceModifier}
                          onChange={(event) =>
                            updateDynamicItem(
                              "sizes",
                              index,
                              "priceModifier",
                              event.target.value
                            )
                          }
                          className={inputClass}
                          placeholder="Gia cong them"
                        />
                        <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                          <input
                            type="checkbox"
                            checked={size.isDefault}
                            onChange={(event) =>
                              updateDynamicItem(
                                "sizes",
                                index,
                                "isDefault",
                                event.target.checked
                              )
                            }
                          />
                          Mac dinh
                        </label>
                        <button
                          type="button"
                          onClick={() => removeDynamicItem("sizes", index)}
                          className="flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 transition-colors hover:bg-rose-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[24px] border border-slate-100 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-950">Add-ons / toppings</h4>
                    <button
                      type="button"
                      onClick={() => addDynamicItem("addons", createEmptyAddon)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <Plus size={16} />
                      Them add-on
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {formState.addons.map((addon, index) => (
                      <div
                        key={`addon-${index}`}
                        className="grid gap-3 rounded-[22px] border border-slate-100 bg-slate-50/80 p-4 lg:grid-cols-[1.6fr_1fr_1fr_auto_auto]"
                      >
                        <input
                          type="text"
                          value={addon.label}
                          onChange={(event) =>
                            updateDynamicItem("addons", index, "label", event.target.value)
                          }
                          className={inputClass}
                          placeholder="Them pho mai / Sot dac biet"
                        />
                        <input
                          type="number"
                          min="0"
                          value={addon.price}
                          onChange={(event) =>
                            updateDynamicItem("addons", index, "price", event.target.value)
                          }
                          className={inputClass}
                          placeholder="Gia"
                        />
                        <input
                          type="number"
                          min="1"
                          value={addon.maxQuantity}
                          onChange={(event) =>
                            updateDynamicItem(
                              "addons",
                              index,
                              "maxQuantity",
                              event.target.value
                            )
                          }
                          className={inputClass}
                          placeholder="Max"
                        />
                        <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                          <input
                            type="checkbox"
                            checked={addon.isAvailable}
                            onChange={(event) =>
                              updateDynamicItem(
                                "addons",
                                index,
                                "isAvailable",
                                event.target.checked
                              )
                            }
                          />
                          San sang
                        </label>
                        <button
                          type="button"
                          onClick={() => removeDynamicItem("addons", index)}
                          className="flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 transition-colors hover:bg-rose-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                  <div className="rounded-[24px] border border-slate-100 bg-white p-5 lg:col-span-2">
                    <h4 className="font-semibold text-slate-950">Combo, highlights va badges</h4>
                    <div className="mt-4 grid gap-4">
                      <div>
                        <label className={labelClass}>
                          Thanh phan combo (moi dong mot item)
                        </label>
                        <textarea
                          value={formState.comboItemsText}
                          onChange={(event) =>
                            updateField("comboItemsText", event.target.value)
                          }
                          className={textareaClass}
                          placeholder="2 burger ga gion&#10;1 khoai L&#10;2 ly nuoc"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Highlights (moi dong mot y)
                        </label>
                        <textarea
                          value={formState.highlightsText}
                          onChange={(event) =>
                            updateField("highlightsText", event.target.value)
                          }
                          className={textareaClass}
                          placeholder="Ga tam uop 12 gio&#10;Phu hop cho 2 nguoi"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          Badges (tach bang dau phay)
                        </label>
                        <input
                          type="text"
                          value={formState.badgesText}
                          onChange={(event) =>
                            updateField("badgesText", event.target.value)
                          }
                          className={inputClass}
                          placeholder="best_seller, spicy, group_meal"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-slate-100 bg-slate-950 p-5 text-white">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-200">
                      Preview nhanh
                    </div>
                    <div className="mt-3 font-display text-2xl font-black">
                      {formState.name || "Menu item"}
                    </div>
                    <div className="mt-2 text-sm text-slate-300">
                      {ITEM_TYPE_OPTIONS.find((item) => item.value === formState.itemType)?.label ||
                        "Mon le"}{" "}
                      • {categories.find((category) => category.slug === formState.category)?.name || formState.category}
                    </div>
                    <div className="mt-6 rounded-2xl bg-white/10 p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-300">
                        Gia hien thi
                      </div>
                      <div className="mt-2 font-display text-3xl font-black">
                        {formatPriceAdmin(
                          formState.discountPrice === ""
                            ? toNumber(formState.price, 0)
                            : toNumber(formState.discountPrice, 0)
                        )}
                      </div>
                      <div className="mt-2 text-sm text-slate-300">
                        {toNumber(formState.preparationTime, 15)} phut •{" "}
                        {formState.isAvailable ? "Dang phuc vu" : "Tam an"}
                      </div>
                    </div>
                  </div>
                </section>

                {error ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeForm}
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
                    {editingProductId ? "Cap nhat menu item" : "Luu menu item"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminProducts;
