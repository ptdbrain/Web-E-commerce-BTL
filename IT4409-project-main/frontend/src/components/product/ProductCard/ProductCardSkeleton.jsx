import React from "react";
import "./ProductCardSkeleton.css";

const ProductCardSkeleton = () => {
  return (
    <div className="product-card-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-specs">
          <div className="skeleton-spec-line"></div>
          <div className="skeleton-spec-line"></div>
          <div className="skeleton-spec-line"></div>
        </div>
        <div className="skeleton-price">
          <div className="skeleton-price-main"></div>
          <div className="skeleton-price-old"></div>
        </div>
        <div className="skeleton-actions">
          <div className="skeleton-btn skeleton-btn-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
