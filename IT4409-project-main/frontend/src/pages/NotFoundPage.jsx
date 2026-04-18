import React from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/common/SEO/SEO";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <SEO
        title="404 - Không tìm thấy trang"
        description="Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển."
        noindex={true}
      />

      <div className="not-found-page">
        <div className="not-found-container">
  
          <div className="not-found-number">
            <span className="number-4 left">4</span>
            <span className="number-0">
              <span className="zero-inner">0</span>
            </span>
            <span className="number-4 right">4</span>
          </div>

  
          <h1 className="not-found-title">Không tìm thấy trang</h1>
          <p className="not-found-description">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>

      
          <div className="not-found-suggestions">
            <p className="suggestions-title">Có thể bạn muốn:</p>
            <ul className="suggestions-list">
              <li>Kiểm tra lại URL</li>
              <li>Quay lại trang trước</li>
              <li>Về trang chủ để khám phá sản phẩm</li>
            </ul>
          </div>

        
          <div className="not-found-actions">
            <button onClick={handleGoBack} className="btn-back">
              ← Quay lại
            </button>
            <button onClick={handleGoHome} className="btn-home">
              🏠 Về trang chủ
            </button>
          </div>

      
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
