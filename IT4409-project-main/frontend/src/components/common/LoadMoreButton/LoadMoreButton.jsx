import React from "react";
import "./LoadMoreButton.css";

const LoadMoreButton = ({
  currentCount,
  totalCount,
  onLoadMore,
  isLoading = false,
}) => {
  const hasMore = currentCount < totalCount;
  const remainingCount = totalCount - currentCount;
  const nextLoadCount = Math.min(12, remainingCount);

  if (!hasMore) {
    return (
      <div className="load-more-container">
        <div className="load-more-completed">
          <span className="completed-icon">✓</span>
          <span className="completed-text">
            Đã hiển thị tất cả {totalCount} sản phẩm
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="load-more-container">
      <button
        className="load-more-btn"
        onClick={onLoadMore}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="load-more-spinner"></span>
            <span>Đang tải...</span>
          </>
        ) : (
          <>
            <span className="load-more-icon">⊕</span>
            <span>Xem thêm {nextLoadCount} sản phẩm</span>
          </>
        )}
      </button>

      <div className="load-more-info">
        Đang hiển thị <strong>{currentCount}</strong> trên{" "}
        <strong>{totalCount}</strong> sản phẩm
      </div>
    </div>
  );
};

export default LoadMoreButton;
