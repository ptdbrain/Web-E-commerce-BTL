import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SEO from "../../components/common/SEO";
import { getProductById } from "../../api/productsApi.js";
import { createReview, getReviews } from "../../api/reviewApi";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../contexts/ToastContext";
import { calculateConfiguredUnitPrice } from "../../utils/cartItem.js";
import "./ProductDetailPage.css";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const {
    addToCart,
    setIsCartOpen,
    setSelectedItemIds,
    setIsManualSelection,
    setDirectCheckoutItems,
  } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reviewList, setReviewList]             = useState([]);
  const [reviewStats, setReviewStats]           = useState(null);
  const [reviewSort, setReviewSort]             = useState("newest");
  const [reviewPage, setReviewPage]             = useState(1);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);
  const [reviewLoading, setReviewLoading]       = useState(false);

  const [reviewForm, setReviewForm] = useState({ guestName: "", rating: 5, comment: "" });
  const [reviewFormError, setReviewFormError] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [itemNote, setItemNote] = useState("");

  const loadReviews = useCallback(async (sort, page, append = false) => {
    setReviewLoading(true);
    try {
      const { data } = await getReviews(id, { sort, page, limit: 5 });
      setReviewList((prev) => (append ? [...prev, ...data.reviews] : data.reviews));
      setReviewStats(data.stats);
      setReviewTotalPages(data.totalPages);
    } catch {
      if (!append) setReviewList([]);
    } finally {
      setReviewLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
        setSelectedSize(data?.sizes?.find((s) => s.isDefault) || data?.sizes?.[0] || null);
        setSelectedAddons([]);
        setItemNote("");
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  useEffect(() => {
    setReviewPage(1);
    loadReviews(reviewSort, 1, false);
  }, [id, reviewSort, loadReviews]);

  const configuredPrice = useMemo(
    () => calculateConfiguredUnitPrice({
      newPrice: product?.newPrice || product?.price || 0,
      selectedSize,
      selectedAddons,
    }),
    [product, selectedSize, selectedAddons]
  );

  const averageRating = reviewStats?.avg ?? product?.rating ?? 0;

  const buildConfiguredItem = () => ({
    ...product,
    imageUrl: product.image,
    quantity: 1,
    newPrice: product.newPrice,
    selectedSize,
    selectedAddons,
    itemNote,
    configuredUnitPrice: configuredPrice,
  });

  const handleToggleAddon = (addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((item) => item.label === addon.label);
      return exists
        ? prev.filter((item) => item.label !== addon.label)
        : [...prev, { ...addon, quantity: 1 }];
    });
  };

  const handleAddToCart = () => {
    addToCart(buildConfiguredItem());
    success("Đã thêm vào giỏ hàng!");
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    const checkoutItem = buildConfiguredItem();
    setIsManualSelection(false);
    setSelectedItemIds([]);
    setDirectCheckoutItems([checkoutItem]);
    navigate("/checkout");
  };

  const handleLoadMoreReviews = () => {
    const next = reviewPage + 1;
    setReviewPage(next);
    loadReviews(reviewSort, next, true);
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.comment.trim()) {
      setReviewFormError("Vui lòng nhập nội dung đánh giá.");
      return;
    }
    setReviewFormError("");
    try {
      await createReview(id, {
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        userName: reviewForm.guestName,
      });
      setReviewForm({ guestName: "", rating: 5, comment: "" });
      setReviewPage(1);
      await loadReviews(reviewSort, 1, false);
      success("Cảm ơn bạn đã đánh giá sản phẩm!");
    } catch (err) {
      toastError(err?.response?.data?.message || "Gửi đánh giá thất bại, vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <SEO title="Đang tải sản phẩm..." />
        <div className="spinner" />
        <p>Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <SEO title="Không tìm thấy sản phẩm" />
        <h2>Không tìm thấy sản phẩm</h2>
        <a href="/">Quay về trang chủ</a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <SEO
        title={`${product.name} - ${configuredPrice.toLocaleString("vi-VN")}đ`}
        description={product.description}
        keywords={`${product.name}, ${product.category?.name}, ${product.badges?.join(", ")}`}
        image={product.image}
      />

      <nav className="mb-6 text-sm text-slate-500">
        <Link to="/">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link to={`/products/${product.category?.slug}`}>{product.category?.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Ảnh + combo items */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="h-[420px] w-full rounded-[32px] object-cover shadow-xl"
          />
          {product.comboItems?.length > 0 && (
            <div className="mt-6 rounded-[28px] border border-orange-100 bg-orange-50 p-5">
              <h3 className="text-lg font-black text-slate-900">Bao gồm trong combo</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.comboItems.map((item) => (
                  <span key={item} className="rounded-full bg-white px-3 py-1 text-sm text-slate-700">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Thông tin & hành động */}
        <div>
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {(product.badges || []).map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700"
              >
                {badge.replaceAll("_", " ")}
              </span>
            ))}
          </div>

          <h1 className="mt-4 text-4xl font-black text-slate-900">{product.name}</h1>
          <p className="mt-3 text-lg text-slate-600">{product.description}</p>

          {/* Meta: thời gian, danh mục, rating */}
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {product.preparationTime > 0 && <span>{product.preparationTime} phút</span>}
            <span>{product.category?.name}</span>
            <span className="flex items-center gap-1">
              <span className="text-orange-400">★</span>
              <span className="font-medium text-slate-700">{averageRating.toFixed(1)}</span>
              <span>({reviewStats?.total ?? product.reviewCount ?? 0} đánh giá)</span>
            </span>
          </div>

          {/* Giá */}
          <div className="mt-6 flex items-end gap-4">
            <div className="text-4xl font-black text-orange-600">
              {configuredPrice.toLocaleString("vi-VN")}đ
            </div>
            {product.originalPrice > product.newPrice && (
              <div className="text-xl text-slate-400 line-through">
                {product.originalPrice.toLocaleString("vi-VN")}đ
              </div>
            )}
          </div>

          {/* Chọn size */}
          {product.sizes?.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-black text-slate-900">Chọn size</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      selectedSize?.label === size.label
                        ? "border-orange-600 bg-orange-600 text-white"
                        : "border-slate-200 text-slate-700 hover:border-orange-300"
                    }`}
                  >
                    {size.label}
                    {size.priceModifier > 0 && ` (+${size.priceModifier.toLocaleString("vi-VN")}đ)`}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Thêm topping */}
          {product.addons?.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-black text-slate-900">Thêm topping</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {product.addons.map((addon) => {
                  const active = selectedAddons.some((item) => item.label === addon.label);
                  return (
                    <button
                      key={addon.label}
                      onClick={() => handleToggleAddon(addon)}
                      className={`rounded-2xl border p-4 text-left transition-colors ${
                        active
                          ? "border-orange-600 bg-orange-50"
                          : "border-slate-200 hover:border-orange-300"
                      }`}
                    >
                      <div className="font-semibold text-slate-900">{addon.label}</div>
                      <div className="mt-1 text-sm text-slate-500">
                        +{addon.price.toLocaleString("vi-VN")}đ
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Ghi chú */}
          <section className="mt-8">
            <h2 className="text-lg font-black text-slate-900">Ghi chú</h2>
            <textarea
              value={itemNote}
              onChange={(e) => setItemNote(e.target.value)}
              placeholder="Ví dụ: không hành tây, ít sốt, tách đá..."
              className="mt-3 w-full rounded-3xl border border-slate-200 p-4 text-sm outline-none focus:border-orange-400"
              rows={3}
            />
          </section>

          {/* Hành động */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleAddToCart}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
            >
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={handleBuyNow}
              className="rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
            >
              Đặt ngay
            </button>
          </div>

          {/* Điểm nổi bật */}
          {product.highlights?.length > 0 && (
            <section className="mt-8 rounded-[28px] border border-slate-100 bg-white p-5">
              <h2 className="text-lg font-black text-slate-900">Điểm nổi bật</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {product.highlights.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {/* Thông tin chi tiết + Đánh giá */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Thông tin sản phẩm */}
        <section className="rounded-[28px] border border-slate-100 bg-white p-6">
          <h2 className="text-2xl font-black text-slate-900">Thông tin sản phẩm</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            {Object.keys(product.specifications || {}).length === 0 ? (
              <p className="text-slate-400">Chưa có thông tin chi tiết.</p>
            ) : (
              Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between border-b border-slate-100 pb-3"
                >
                  <span className="font-medium text-slate-500">{key}</span>
                  <span className="text-right font-semibold text-slate-800">{value}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Đánh giá */}
        <section className="rounded-[28px] border border-slate-100 bg-white p-6">
          <h2 className="text-2xl font-black text-slate-900">Đánh giá sản phẩm</h2>

          {/* Thống kê rating */}
          {reviewStats && (
            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
              {/* Điểm trung bình */}
              <div className="flex flex-col items-center justify-center rounded-2xl bg-orange-50 px-8 py-5 text-center">
                <span className="text-5xl font-black leading-none text-orange-600">
                  {reviewStats.avg.toFixed(1)}
                </span>
                <div className="mt-2 flex text-xl">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={i < Math.round(reviewStats.avg) ? "text-orange-400" : "text-slate-200"}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="mt-1 text-xs text-slate-500">{reviewStats.total} đánh giá</span>
              </div>

              {/* Thanh phân phối sao */}
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviewStats.distribution[star] ?? 0;
                  const pct = reviewStats.total ? (count / reviewStats.total) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-8 shrink-0 text-slate-500">{star} ★</span>
                      <div className="flex-1 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-orange-400 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 shrink-0 text-right text-xs text-slate-400">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Nút lọc */}
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { value: "newest",  label: "Mới nhất" },
              { value: "oldest",  label: "Cũ nhất" },
              { value: "highest", label: "5★ trước" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setReviewSort(opt.value)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  reviewSort === opt.value
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Danh sách đánh giá */}
          <div className="mt-5 space-y-4">
            {reviewLoading && reviewPage === 1 ? (
              <div className="py-8 text-center text-sm text-slate-400">Đang tải đánh giá...</div>
            ) : reviewList.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                Chưa có đánh giá nào. Hãy là người đầu tiên!
              </div>
            ) : (
              reviewList.map((review) => (
                <article key={review._id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">
                        {review.userName || "Khách"}
                      </span>
                      {review.isVerified && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                          Đã mua
                        </span>
                      )}
                    </div>
                    <div className="flex shrink-0 text-base">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={i < review.rating ? "text-orange-400" : "text-slate-200"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{review.comment}</p>
                  )}
                  <p className="mt-1.5 text-xs text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </article>
              ))
            )}
          </div>

          {/* Xem thêm */}
          {reviewPage < reviewTotalPages && (
            <button
              onClick={handleLoadMoreReviews}
              disabled={reviewLoading}
              className="mt-4 w-full rounded-2xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-orange-300 hover:text-orange-600 disabled:opacity-50"
            >
              {reviewLoading ? "Đang tải..." : "Xem thêm đánh giá"}
            </button>
          )}

          {/* Form viết đánh giá */}
          <div className="mt-8 rounded-[24px] bg-orange-50 p-5">
            <h3 className="text-lg font-black text-slate-900">Viết đánh giá</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                value={reviewForm.guestName}
                onChange={(e) => setReviewForm((p) => ({ ...p, guestName: e.target.value }))}
                placeholder="Tên của bạn (để trống nếu đã đăng nhập)"
                className="rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none focus:border-orange-300"
              />
              {/* Chọn sao */}
              <div className="flex items-center gap-1 rounded-2xl border border-orange-100 bg-white px-4 py-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm((p) => ({ ...p, rating: star }))}
                    className={`text-2xl leading-none transition-colors ${
                      star <= reviewForm.rating ? "text-orange-400" : "text-slate-200 hover:text-orange-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-slate-500">{reviewForm.rating} sao</span>
              </div>
            </div>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => {
                setReviewFormError("");
                setReviewForm((p) => ({ ...p, comment: e.target.value }));
              }}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              className={`mt-3 w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:border-orange-300 ${
                reviewFormError ? "border-red-300" : "border-orange-100"
              }`}
              rows={4}
            />
            {reviewFormError && (
              <p className="mt-1 text-xs text-red-500">{reviewFormError}</p>
            )}
            <button
              onClick={handleSubmitReview}
              className="mt-3 rounded-full bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
            >
              Gửi đánh giá
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
