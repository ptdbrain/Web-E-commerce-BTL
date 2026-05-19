import React, { useState } from "react";
import PropTypes from "prop-types";
import "./ProductGallery.css";

/**
 * ProductGallery Component
 * Hiển thị gallery ảnh sản phẩm với thumbnail, navigation và badges
 */
export const ProductGallery = ({ images, badges }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <div className="product-gallery">
      {/* Main Image Container */}
      <div className="main-image-container">
        <img
          src={images[selectedIndex].url}
          alt={images[selectedIndex].alt}
          className="main-image"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              className="nav-arrow nav-arrow-prev"
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              &#8249;
            </button>
            <button
              className="nav-arrow nav-arrow-next"
              onClick={handleNext}
              aria-label="Next image"
            >
              &#8250;
            </button>
          </>
        )}
      </div>

      {/* Thumbnail List */}
      <div className="thumbnail-list">
        {images.map((image, index) => (
          <button
            key={image.id}
            className={`thumbnail ${selectedIndex === index ? "active" : ""}`}
            onClick={() => handleThumbnailClick(index)}
          >
            <img src={image.url} alt={image.alt} />
          </button>
        ))}
      </div>

      {/* Promotional Badges */}
      <div className="promo-badges">
        {badges.map((badge, index) => (
          <div key={index} className="promo-badge">
            <span className="badge-icon">✓</span>
            <span className="badge-text">{badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

ProductGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
      isPrimary: PropTypes.bool,
    })
  ).isRequired,
  badges: PropTypes.arrayOf(PropTypes.string).isRequired,
};
