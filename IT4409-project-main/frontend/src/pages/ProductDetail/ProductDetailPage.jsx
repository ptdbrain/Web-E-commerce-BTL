import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SEO from "../../components/common/SEO";
import { getProductById } from "../../api/productsApi";
import { createReview, getReviews } from "../../api/reviewApi";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../contexts/ToastContext";
import { calculateConfiguredUnitPrice } from "../../utils/cartItem";
import "./ProductDetailPage.css";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success } = useToast();
  const {
    addToCart,
    setIsCartOpen,
    setSelectedItemIds,
    setIsManualSelection,
    setDirectCheckoutItems,
  } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    guestName: "",
    rating: 5,
    comment: "",
  });
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [itemNote, setItemNote] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
        setSelectedSize(
          data?.sizes?.find((size) => size.isDefault) || data?.sizes?.[0] || null
        );

        try {
          const reviewResponse = await getReviews(id);
          setReviews(Array.isArray(reviewResponse.data) ? reviewResponse.data : []);
        } catch {
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const configuredPrice = useMemo(
    () =>
      calculateConfiguredUnitPrice({
        newPrice: product?.newPrice || product?.price || 0,
        selectedSize,
        selectedAddons,
      }),
    [product, selectedSize, selectedAddons]
  );

  const averageRating = useMemo(() => {
    if (!reviews.length) return product?.rating || 0;
    return (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    ).toFixed(1);
  }, [product, reviews]);

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
      if (exists) {
        return prev.filter((item) => item.label !== addon.label);
      }
      return [...prev, { ...addon, quantity: 1 }];
    });
  };

  const handleAddToCart = () => {
    addToCart(buildConfiguredItem());
    success("Da them mon vao gio hang");
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    const checkoutItem = buildConfiguredItem();
    setIsManualSelection(false);
    setSelectedItemIds([]);
    setDirectCheckoutItems([checkoutItem]);
    navigate("/checkout");
  };

  const handleSubmitReview = async () => {
    try {
      await createReview(id, {
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        userName: reviewForm.guestName,
      });
      const reviewResponse = await getReviews(id);
      setReviews(Array.isArray(reviewResponse.data) ? reviewResponse.data : []);
      setReviewForm({ guestName: "", rating: 5, comment: "" });
      success("Cam on ban da danh gia mon");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <SEO title="Dang tai mon an..." />
        <div className="spinner" />
        <p>Dang tai thong tin mon an...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <SEO title="Khong tim thay mon" />
        <h2>Khong tim thay mon an</h2>
        <a href="/">Quay ve trang chu</a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <SEO
        title={`${product.name} - ${configuredPrice.toLocaleString("vi-VN")} d`}
        description={product.description}
        keywords={`fast food, ${product.name}, ${product.category?.name}, ${product.badges?.join(", ")}`}
        image={product.image}
      />

      <nav className="mb-6 text-sm text-slate-500">
        <Link to="/">Trang chu</Link>
        <span className="mx-2">/</span>
        <Link to={`/products/${product.category?.slug}`}>{product.category?.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="h-[420px] w-full rounded-[32px] object-cover shadow-xl"
          />
          {product.comboItems?.length > 0 && (
            <div className="mt-6 rounded-[28px] border border-orange-100 bg-orange-50 p-5">
              <h3 className="text-lg font-black text-slate-900">
                Bao gom trong combo
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.comboItems.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white px-3 py-1 text-sm text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
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

          <h1 className="mt-4 text-4xl font-black text-slate-900">
            {product.name}
          </h1>
          <p className="mt-3 text-lg text-slate-600">{product.description}</p>

          <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500">
            <span>{product.preparationTime} phut</span>
            <span>{product.category?.name}</span>
            <span>Danh gia {averageRating}/5</span>
            <span>{product.reviewCount} reviews</span>
          </div>

          <div className="mt-6 flex items-end gap-4">
            <div className="text-4xl font-black text-orange-600">
              {configuredPrice.toLocaleString("vi-VN")} d
            </div>
            {product.originalPrice > product.newPrice && (
              <div className="text-xl text-slate-400 line-through">
                {product.originalPrice.toLocaleString("vi-VN")} d
              </div>
            )}
          </div>

          {product.sizes?.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-black text-slate-900">Chon size</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                      selectedSize?.label === size.label
                        ? "border-orange-600 bg-orange-600 text-white"
                        : "border-slate-200 text-slate-700 hover:border-orange-300"
                    }`}
                  >
                    {size.label}
                    {size.priceModifier > 0 &&
                      ` (+${size.priceModifier.toLocaleString("vi-VN")} d)`}
                  </button>
                ))}
              </div>
            </section>
          )}

          {product.addons?.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-black text-slate-900">Them topping</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {product.addons.map((addon) => {
                  const active = selectedAddons.some(
                    (item) => item.label === addon.label
                  );
                  return (
                    <button
                      key={addon.label}
                      onClick={() => handleToggleAddon(addon)}
                      className={`rounded-2xl border p-4 text-left ${
                        active
                          ? "border-orange-600 bg-orange-50"
                          : "border-slate-200 hover:border-orange-300"
                      }`}
                    >
                      <div className="font-semibold text-slate-900">
                        {addon.label}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        +{addon.price.toLocaleString("vi-VN")} d
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <section className="mt-8">
            <h2 className="text-lg font-black text-slate-900">Ghi chu mon</h2>
            <textarea
              value={itemNote}
              onChange={(event) => setItemNote(event.target.value)}
              placeholder="Vi du: khong hanh tay, it sot, tach da..."
              className="mt-3 w-full rounded-3xl border border-slate-200 p-4 outline-none focus:border-orange-400"
              rows={4}
            />
          </section>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleAddToCart}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Them vao gio hang
            </button>
            <button
              onClick={handleBuyNow}
              className="rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-700"
            >
              Dat ngay
            </button>
          </div>

          {product.highlights?.length > 0 && (
            <section className="mt-8 rounded-[28px] border border-slate-100 bg-white p-5">
              <h2 className="text-lg font-black text-slate-900">Diem noi bat</h2>
              <ul className="mt-3 space-y-2 text-slate-600">
                {product.highlights.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[28px] border border-slate-100 bg-white p-6">
          <h2 className="text-2xl font-black text-slate-900">Thong tin mon</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            {Object.entries(product.specifications || {}).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between border-b border-slate-100 pb-3"
              >
                <span className="font-medium text-slate-500">{key}</span>
                <span className="text-right font-semibold text-slate-800">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-100 bg-white p-6">
          <h2 className="text-2xl font-black text-slate-900">Danh gia</h2>
          <div className="mt-3 text-sm text-slate-500">
            {reviews.length} nhan xet | Diem trung binh {averageRating}/5
          </div>

          <div className="mt-6 space-y-4">
            {reviews.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                Chua co review nao cho mon nay.
              </div>
            ) : (
              reviews.map((review) => (
                <article
                  key={review._id}
                  className="rounded-2xl border border-slate-100 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-900">
                      {review.userName || "Khach"}
                    </div>
                    <div className="text-sm text-orange-600">
                      {"★".repeat(review.rating)}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
                </article>
              ))
            )}
          </div>

          <div className="mt-8 rounded-[24px] bg-orange-50 p-5">
            <h3 className="text-lg font-black text-slate-900">Viet danh gia</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                value={reviewForm.guestName}
                onChange={(event) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    guestName: event.target.value,
                  }))
                }
                placeholder="Ten cua ban"
                className="rounded-2xl border border-orange-100 px-4 py-3 outline-none focus:border-orange-300"
              />
              <select
                value={reviewForm.rating}
                onChange={(event) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    rating: Number(event.target.value),
                  }))
                }
                className="rounded-2xl border border-orange-100 px-4 py-3 outline-none focus:border-orange-300"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} sao
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={reviewForm.comment}
              onChange={(event) =>
                setReviewForm((prev) => ({
                  ...prev,
                  comment: event.target.value,
                }))
              }
              placeholder="Mon co hop khau vi khong?"
              className="mt-3 w-full rounded-2xl border border-orange-100 px-4 py-3 outline-none focus:border-orange-300"
              rows={4}
            />
            <button
              onClick={handleSubmitReview}
              className="mt-3 rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700"
            >
              Gui danh gia
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
