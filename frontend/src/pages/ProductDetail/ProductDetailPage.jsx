import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ProductGallery } from "../../components/ProductDetail/ProductGallery";
import { ProductInfo } from "../../components/ProductDetail/ProductInfo";
import { VariantSelector } from "../../components/ProductDetail/VariantSelector";
import { SpecificationsTable } from "../../components/ProductDetail/SpecificationsTable";
import { ReviewsSection } from "../../components/ProductDetail/ReviewsSection";
import { getProductById } from "../../api/productsApi";
import SEO from "../../components/common/SEO";
import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../contexts/ToastContext";
import { getSlugFromCategoryName } from "../../data/categories";
import "./ProductDetailPage.css";
import { getReviews } from "../../api/reviewApi";
import { createReview } from "../../api/reviewApi";
/**
 * ProductDetailPage Component
 * Trang chi tiết sản phẩm
 */
export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    addToCart,
    setIsCartOpen,
    setSelectedItemIds,
    setIsManualSelection,
    setDirectCheckoutItems,
  } = useCart();
  const { success } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  // ===== REVIEW STATE =====
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id || 1);
        setProduct(data);

        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }

        // ✅ LOAD REVIEWS
        const reviewRes = await getReviews(id);
        setReviews(reviewRes.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    // Tạo object sản phẩm để thêm vào giỏ
    const cartItem = {
      id: product.id,
      name: product.name,
      imageUrl: product.images?.[0] || product.image,
      newPrice: selectedVariant?.price || product.newPrice || product.price,
      oldPrice: product.oldPrice,
      variant: selectedVariant?.name || null,
      specs: product.specifications,
    };

    // Thêm vào giỏ hàng
    addToCart(cartItem);

    // Hiển thị thông báo và mở popup giỏ hàng
    success("Đã thêm sản phẩm vào giỏ hàng!");
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    if (!product) return;

    // Tạo object sản phẩm chỉ dùng cho thanh toán trực tiếp (không thêm vào giỏ)
    const checkoutItem = {
      id: product.id,
      name: product.name,
      imageUrl: product.images?.[0] || product.image,
      newPrice: selectedVariant?.price || product.newPrice || product.price,
      oldPrice: product.oldPrice,
      variant: selectedVariant?.name || null,
      specs: product.specifications,
      quantity: 1,
    };

    // Thiết lập chế độ Mua ngay: chỉ thanh toán 1 sản phẩm, không ảnh hưởng giỏ hàng
    setIsManualSelection(false);
    setSelectedItemIds([]);
    setDirectCheckoutItems([checkoutItem]);
    navigate("/checkout");
  };

  const handleSubmitReview = async () => {
    try {
      await createReview(id, {
        rating,
        comment,
        userName: guestName,
      });

      const res = await getReviews(id);
      setReviews(res.data);

      setRating(5);
      setComment("");
      setGuestName("");

      success("Cảm ơn bạn đã đánh giá sản phẩm!");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <SEO title="Đang tải sản phẩm..." />
        <div className="spinner"></div>
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

  // Tạo SEO data từ product
  const productTitle = `${product.name} - ${formatPrice(product.price)}`;
  const productDescription = product.description
    ? product.description.slice(0, 160)
    : `Mua ${product.name} chính hãng, giá ${formatPrice(
        product.price
      )}. Bảo hành 12 tháng, giao hàng toàn quốc.`;
  const productImage =
    product.images?.[0] || product.image || "/placeholder.png";

  // Transform product data to match gallery format
  const galleryImages = [
    {
      id: "img1",
      url: product.image,
      alt: product.name,
      isPrimary: true,
    },
    {
      id: "img2",
      url: product.thumbnail,
      alt: `${product.name} - Góc 2`,
      isPrimary: false,
    },
  ];

  const badges = [
    "Bảo hành chính hãng 12 tháng",
    "Giao hàng miễn phí toàn quốc",
    "Đổi trả trong 7 ngày",
    product.discount ? `Giảm giá ${product.discount}%` : null,
  ].filter(Boolean);

  // ===== TÍNH RATING TỪ REVIEWS =====
  const reviewCount = reviews.length;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="product-detail-page">
      {/* ===== SEO META TAGS ===== */}
      <SEO
        title={productTitle}
        description={productDescription}
        keywords={`${product.name}, ${product.brand || ""}, ${
          product.category || ""
        }, laptop, mua laptop, tech geeks`}
        image={productImage}
      />

      <div className="product-detail-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to={`/products/${getSlugFromCategoryName(product.category)}`}>
            {product.category}
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="current">{product.brand}</span>
        </nav>

        {/* Main Content Grid */}
        <div className="product-main-content">
          {/* Left: Gallery */}
          <div className="product-gallery-section">
            <ProductGallery images={galleryImages} badges={badges} />
          </div>

          {/* Right: Product Info */}
          <div className="product-info-section">
            <ProductInfo
              product={{
                ...product,
                rating: averageRating,
                numReviews: reviewCount,
              }}
              selectedVariant={selectedVariant}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>

        {/* Specifications Table */}
        {product.specifications && (
          <SpecificationsTable specifications={product.specifications} />
        )}

        {/* Reviews Section */}
        <ReviewsSection
          reviews={reviews}
          productRating={averageRating}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          guestName={guestName}
          setGuestName={setGuestName}
          onSubmitReview={handleSubmitReview}
        />
      </div>
    </div>
  );
};
