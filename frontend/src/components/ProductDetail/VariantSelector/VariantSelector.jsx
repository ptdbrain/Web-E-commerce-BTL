import React from "react";
import "./VariantSelector.css";

/**
 * VariantSelector Component
 * Component cho phép chọn các biến thể sản phẩm (màu sắc, cấu hình, dung lượng...)
 */
export const VariantSelector = ({
  variants,
  selectedVariant,
  onVariantChange,
}) => {
  if (!variants || variants.length === 0) return null;

  const handleVariantSelect = (variantId) => {
    const selected = variants.find((v) => v.id === variantId);
    if (selected && onVariantChange) {
      onVariantChange(selected);
    }
  };

  return (
    <div className="variant-selector">
      <h3 className="variant-title">Chọn phiên bản:</h3>
      <div className="variant-options">
        {variants.map((variant) => (
          <button
            key={variant.id}
            className={`variant-option ${
              selectedVariant?.id === variant.id ? "selected" : ""
            } ${variant.stock === 0 ? "out-of-stock" : ""}`}
            onClick={() => handleVariantSelect(variant.id)}
            disabled={variant.stock === 0}
          >
            <div className="variant-name">{variant.name}</div>
            {variant.priceModifier !== 0 && (
              <div className="variant-price">
                {variant.priceModifier > 0 ? "+" : ""}
                {variant.priceModifier.toLocaleString("vi-VN")}₫
              </div>
            )}
            {variant.stock === 0 && (
              <div className="variant-stock-label">Hết hàng</div>
            )}
          </button>
        ))}
      </div>
      {selectedVariant && selectedVariant.description && (
        <p className="variant-description">{selectedVariant.description}</p>
      )}
    </div>
  );
};
