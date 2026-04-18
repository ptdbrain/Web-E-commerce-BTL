import React from "react";
import "./ErrorBoundary.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Cập nhật state để hiển thị UI fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log lỗi ra console để debug
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h1 className="error-title">Oops! Có lỗi xảy ra</h1>
            <p className="error-message">
              Đã có lỗi không mong muốn xảy ra. Vui lòng thử lại sau.
            </p>

            {/* Chỉ hiển thị chi tiết lỗi ở development mode */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="error-details">
                <summary>Chi tiết lỗi (Development Only)</summary>
                <pre className="error-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="error-actions">
              <button onClick={this.handleReload} className="btn-primary">
                Tải lại trang
              </button>
              <button onClick={this.handleGoHome} className="btn-secondary">
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
