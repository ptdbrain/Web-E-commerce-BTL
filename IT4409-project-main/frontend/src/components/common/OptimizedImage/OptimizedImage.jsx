import { useState } from "react";
import "./OptimizedImage.css";

/**
 * OptimizedImage Component - Tối ưu hiệu năng loading ảnh
 *
 * Features:
 * - Lazy loading (tải khi scroll đến gần)
 * - Placeholder blur effect khi đang tải
 * - Error fallback khi ảnh lỗi
 * - Responsive với srcSet
 *
 * @param {string} src - URL của ảnh chính
 * @param {string} alt - Alt text cho SEO
 * @param {string} className - CSS classes
 * @param {string} placeholder - URL ảnh placeholder nhỏ (optional)
 * @param {string} fallback - URL ảnh hiện khi lỗi
 * @param {boolean} priority - Không lazy load (cho ảnh quan trọng)
 */
function OptimizedImage({
  src,
  alt = "",
  className = "",
  placeholder = "/placeholder-blur.png",
  fallback = "/image-not-found.png",
  priority = false,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Xử lý khi ảnh load xong
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Xử lý khi ảnh bị lỗi
  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // URL ảnh cuối cùng (nếu lỗi thì dùng fallback)
  const imageSrc = hasError ? fallback : src;

  return (
    <div className={`optimized-image-wrapper ${className}`}>
      {/* Placeholder - hiện khi đang loading */}
      {!isLoaded && (
        <div className="optimized-image-placeholder">
          <div className="optimized-image-skeleton"></div>
        </div>
      )}

      {/* Ảnh chính */}
      <img
        src={imageSrc}
        alt={alt}
        className={`optimized-image ${isLoaded ? "loaded" : "loading"}`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...props}
      />
    </div>
  );
}

export default OptimizedImage;
