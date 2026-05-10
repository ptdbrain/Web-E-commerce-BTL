import "./PageLoader.css";

/**
 * PageLoader - Loading indicator khi lazy load pages
 * Hiển thị spinner với logo khi đang tải trang
 */
function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader-content">
        {/* Logo hoặc spinner */}
        <div className="page-loader-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>

        {/* Text */}
        <p className="page-loader-text">Đang tải...</p>
      </div>
    </div>
  );
}

export default PageLoader;
