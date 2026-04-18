import React, { useState } from "react";
import "./ReviewsSection.css";

export const ReviewsSection = ({
  reviews = [],
  productRating = 0,
  rating,
  setRating,
  comment,
  setComment,
  guestName,
  setGuestName,
  onSubmitReview,
}) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="reviews-section">
      <h2 className="reviews-title">Đánh giá sản phẩm</h2>

      <div className="review-summary">
        <div className="summary-left">
          <div className="average-rating">
            <span className="rating-number">{productRating || 0}</span>
            <div className="stars-display">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`star ${i <= productRating ? "filled" : ""}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="total-reviews">{reviews.length} đánh giá</span>
          </div>
        </div>
      </div>

      <div className="reviews-actions">
        <button
          className="btn-write-review"
          onClick={() => setShowForm(!showForm)}
        >
          Viết đánh giá
        </button>
      </div>

      {showForm && (
        <div className="review-form-container">
          <h3>Đánh giá của bạn</h3>

          <div className="form-group">
            <label>Số sao</label>
            <div className="star-rating-input">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`star ${i <= rating ? "filled" : ""}`}
                  onClick={() => setRating(i)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Tên của bạn</label>
            <input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Khách"
            />
          </div>

          <div className="form-group">
            <label>Nhận xét</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button className="btn-submit" onClick={onSubmitReview}>
              Gửi đánh giá
            </button>
            <button className="btn-cancel" onClick={() => setShowForm(false)}>
              Hủy
            </button>
          </div>
        </div>
      )}

      <div className="reviews-list">
        {reviews.length === 0 && (
          <div className="no-reviews">Chưa có đánh giá nào</div>
        )}

        {reviews.map((r) => (
          <div key={r._id} className="review-item">
            <div className="review-header">
              <strong>{r.userName || "Khách"}</strong>
              <div className="review-stars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={`star ${i <= r.rating ? "filled" : ""}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="review-comment">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
