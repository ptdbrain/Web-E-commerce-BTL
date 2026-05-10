import React from "react";
import {
  FaTruck,
  FaShieldAlt,
  FaExchangeAlt,
  FaGift,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";
import "./ProductInfo.css";

// Mapping tên specs tiếng Anh sang tiếng Việt
const specLabels = {
  processor: "CPU",
  cpu: "CPU",
  ram: "RAM",
  storage: "Ổ cứng",
  ssd: "SSD",
  graphics: "Card đồ họa",
  gpu: "Card đồ họa",
  display: "Màn hình",
  screen: "Màn hình",
  battery: "Pin",
  weight: "Trọng lượng",
  os: "Hệ điều hành",
  color: "Màu sắc",
  size: "Kích thước",
  material: "Chất liệu",
  connection: "Kết nối",
  warranty: "Bảo hành",
};

// Lấy label hiển thị cho spec
const getSpecLabel = (key) => {
  return specLabels[key.toLowerCase()] || key;
};

// Kiểm tra giá trị có phải primitive (string, number, boolean) không
const isPrimitive = (value) => {
  return value !== null && value !== undefined && typeof value !== "object";
};

// Lấy các specs có giá trị primitive để hiển thị
const getDisplayableSpecs = (specs) => {
  if (!specs || typeof specs !== "object") return [];

  const result = [];

  Object.entries(specs).forEach(([key, value]) => {
    if (isPrimitive(value) && String(value).trim() !== "") {
      result.push([key, String(value)]);
    } else if (Array.isArray(value)) {
      result.push([key, value.join(", ")]);
    }
    // Bỏ qua nested objects
  });

  return result;
};

/**
 * ProductInfo Component
 * Hiển thị thông tin chi tiết sản phẩm: tên, giá, đánh giá, mô tả
 */
export const ProductInfo = ({
  product,
  selectedVariant,
  onAddToCart,
  onBuyNow,
}) => {
  if (!product) return null;

  const basePrice = product.price ?? 0;
  const variantPriceModifier = selectedVariant?.priceModifier ?? 0;

  const finalPrice = selectedVariant
    ? basePrice + variantPriceModifier
    : basePrice;

  const originalPrice = product.originalPrice
    ? selectedVariant
      ? product.originalPrice + variantPriceModifier
      : product.originalPrice
    : null;

  const inStock = selectedVariant
    ? selectedVariant.stock > 0
    : product.stock > 0;

  const stockCount = selectedVariant ? selectedVariant.stock : product.stock;

  return (
    <div className="product-info">
      {/* Product Header */}
      <div className="product-header">
        <div className="brand-badge">{product.brand?.name || ""}</div>
        <h1 className="product-title">{product.name}</h1>
        {selectedVariant && (
          <p className="variant-name-display">
            Phiên bản: {selectedVariant.name}
          </p>
        )}
      </div>

      {/* Rating & Stock */}
      <div className="product-meta">
        <div className="rating-section">
          <span className="rating">
            <FaStar color="#ffc107" size={18} /> {product.rating} (
            {product.numReviews} đánh giá)
          </span>
        </div>
        <div className="stock-section">
          {inStock ? (
            <span className="stock in-stock">
              ✓ Còn hàng ({stockCount} sản phẩm)
            </span>
          ) : (
            <span className="stock out-of-stock">✗ Hết hàng</span>
          )}
        </div>
      </div>

      {/* Price Section */}
      <div className="price-section">
        <div className="price-main">
          <span className="current-price">
            {finalPrice > 0
              ? `${finalPrice.toLocaleString("vi-VN")}₫`
              : "Liên hệ"}
          </span>
          {originalPrice && originalPrice > finalPrice && (
            <>
              <span className="original-price">
                {originalPrice.toLocaleString("vi-VN")}₫
              </span>
              {product.discount > 0 && (
                <span className="discount-badge">-{product.discount}%</span>
              )}
            </>
          )}
        </div>
        {product.discount > 0 &&
          originalPrice &&
          originalPrice > finalPrice && (
            <p className="savings-text">
              Tiết kiệm: {(originalPrice - finalPrice).toLocaleString("vi-VN")}₫
            </p>
          )}
      </div>

      {/* Quick Specs */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="quick-specs">
          <h3>Thông số nổi bật:</h3>
          <div className="specs-grid">
            {getDisplayableSpecs(product.specs)
              .slice(0, 6)
              .map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-label">{getSpecLabel(key)}:</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div className="product-description">
          <h3>Mô tả sản phẩm:</h3>
          <p>{product.description}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="btn-buy-now" disabled={!inStock} onClick={onBuyNow}>
          {inStock ? "Mua ngay" : "Hết hàng"}
        </button>
        <button
          className="btn-add-to-cart"
          disabled={!inStock}
          onClick={onAddToCart}
        >
          <FaShoppingCart /> Thêm vào giỏ hàng
        </button>
      </div>

      {/* Additional Info */}
      <div className="additional-info">
        <div className="info-item">
          <span className="icon">
            <FaTruck />
          </span>
          <div>
            <strong>Giao hàng toàn quốc</strong>
            <p>Miễn phí ship đơn từ 500.000₫</p>
          </div>
        </div>
        <div className="info-item">
          <span className="icon">
            <FaShieldAlt />
          </span>
          <div>
            <strong>Bảo hành chính hãng</strong>
            <p>12 tháng bảo hành toàn quốc</p>
          </div>
        </div>
        <div className="info-item">
          <span className="icon">
            <FaExchangeAlt />
          </span>
          <div>
            <strong>Đổi trả dễ dàng</strong>
            <p>Trong vòng 7 ngày nếu có lỗi</p>
          </div>
        </div>
        <div className="info-item">
          <span className="icon">
            <FaGift />
          </span>
          <div>
            <strong>Quà tặng hấp dẫn</strong>
            <p>Nhiều ưu đãi khi mua hàng</p>
          </div>
        </div>
      </div>
    </div>
  );
};
